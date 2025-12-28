---
sidebar_position: 7
---

# Laravel Redis Cache & Queue Guide

Dokumentasi ini menjelaskan **cara menggunakan Redis sebagai cache API** dan **mengirim email menggunakan Queue berbasis Redis** pada Laravel.

---

## 1. Prasyarat

* Laravel sudah ter-install
* Redis sudah berjalan

cara menjalankan redis bisa install dulu di laptop atau lewat docker
jika pakai docker bisa jalankan seperti ini :

```bash
 docker run -d \                                           
  --name redis-server \
  -p 6379:6379 \
  redis:latest \
  redis-server --requirepass redminote8  
```

Cek Redis:

```bash
redis-cli ping
# PONG
```

---

## 2. Konfigurasi Redis di Laravel

### 2.1 `.env`

```env
CACHE_STORE=redis
QUEUE_CONNECTION=redis

REDIS_CLIENT=predis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=redminote8
REDIS_PORT=6379
```

### 2.2 `config/database.php`

```php
'redis' => [
    'client' => env('REDIS_CLIENT', 'phpredis'),

    'default' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', 6379),
        'database' => 0,
    ],

    'cache' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', 6379),
        'database' => 1,
    ],
],
```

---

## 3. Implementasi Redis Cache pada API Product

### 3.1 Cache List Product

```php
class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Cache::remember('products_all', 60, function () {
            return Product::all();
        });

        return ApiResponse::success($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|integer',
        ]);

        $product = Product::create($validated);

        Cache::forget('products_all');

        return ApiResponse::success(
            $product,
            'Product created & email sent (sync)',
            201
        );
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Cache::remember("product_{$id}", 60, function () use ($id) {
            return Product::find($id);
        });

        if (!$product) {
            return ApiResponse::error('Product not found', 404);
        }

        return ApiResponse::success($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return ApiResponse::error('Product not found', 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|required|integer',
        ]);

        $product->update($validated);

        Cache::forget('products_all');
        Cache::forget("product_{$id}");

        return ApiResponse::success($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return ApiResponse::error('Product not found', 404);
        }

        $product->delete();

        Cache::forget('products_all');
        Cache::forget("product_{$id}");

        return ApiResponse::success(null, 'Product deleted successfully');
    }
}
```

### 3.3 Invalidate Cache saat Create / Update / Delete

```php
Cache::forget('products_all');
Cache::forget("product_{$id}");
```

### 3.4 Cek Cache di Redis

```bash
redis-cli
SELECT 1
KEYS *
```

---

## 4. Kirim Email TANPA Queue

kita buat dulu file untuk handle email dengan 

```bash
php artisan make:mail ProductCreateMail
php artisan make:mail ProductCreateMailWithQueue
```
### 4.1 Mailable

```php
class ProductCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Product $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.product-created',
            with: ['product' => $this->product],
        );
    }
}
```

### 4.2 Controller

```php
Mail::to('test@example.com')
    ->send(new ProductCreatedMail($product));
```

⛔ Request menunggu email selesai dikirim

---

## 5. Kirim Email DENGAN Queue Redis (Rekomendasi)

### 5.1 Aktifkan Queue di Mailable

```php
class ProductCreatedMail extends Mailable implements ShouldQueue
```

### 5.2 Controller (Async)

```php
Mail::to('test@example.com')
    ->queue(new ProductCreatedMail($product));
```

✔ API cepat
✔ Email diproses background

---

## 6. Menjalankan Queue Worker

```bash
php artisan queue:work redis
```

Worker **harus berjalan terus** untuk memproses job.

Cek queue:

```bash
redis-cli
LLEN queues:default
```

---

## 7. View Email

```blade
<!DOCTYPE html>
<html>
<body>
    <h2>Product Created</h2>
    <p>Product name: <strong>{{ $product->name }}</strong></p>
    <p>Price: {{ $product->price }}</p>
</body>
</html>
```

---

## 8. Best Practice

* Gunakan Redis untuk:

  * Cache API
  * Queue
  * Session
* Gunakan **queue** untuk:

  * Email
  * Notifikasi
  * Export / Import
* Jalankan worker via **Supervisor** di production

---

## 9. Kesimpulan

| Fitur       | Tanpa Redis | Dengan Redis |
| ----------- | ----------- | ------------ |
| API Speed   | Lambat      | ⚡ Cepat      |
| Email       | Blocking    | Async        |
| Scalability | Rendah      | Tinggi       |

---

Happy Coding 🚀