---
sidebar_position: 4
---

# Partials Resource Route

Partials Resource Controller di Laravel adalah fitur yang memungkinkan kamu membuat resource controller hanya dengan beberapa method tertentu, tidak semuanya (index, store, update, delete, dll).

Laravel 12 masih menggunakan konsep yang sama dengan Laravel sebelumnya untuk hal ini.

## Apa itu Partials Resource Controller?

Biasanya, ketika kamu membuat resource controller:
```php
Route::resource('posts', PostController::class);
```

Laravel otomatis membuat **7 method**:
* `index`
* `create`
* `store`
* `show`
* `edit`
* `update`
* `destroy`

Kalau kamu tidak membutuhkan semua method itu, kamu bisa mendaftarkan hanya sebagian—itulah yang disebut **partial resource**.

## Cara Menggunakan Partial Resource

### 1. Menggunakan `only()`

Gunakan kalau kamu **hanya mau beberapa method saja**.
```php
Route::resource('posts', PostController::class)->only([
    'index', 'show'
]);
```

Route yang dibuat hanya:
* `GET /posts` → `index()`
* `GET /posts/{post}` → `show()`

#### Contoh Kasus Penggunaan `only()`:

**Halaman Read-Only (Blog/Artikel):**
```php
Route::resource('articles', ArticleController::class)->only([
    'index', 'show'
]);
```

**Form Tambah Data Saja:**
```php
Route::resource('comments', CommentController::class)->only([
    'create', 'store'
]);
```

### 2. Menggunakan `except()`

Kebalikan dari `only`, gunakan kalau kamu ingin **menghapus beberapa method**.
```php
Route::resource('posts', PostController::class)->except([
    'create', 'edit'
]);
```

Artinya route untuk form `create/edit` tidak dibuat, tapi method lainnya tetap ada:
* `GET /posts` → `index()`
* `POST /posts` → `store()`
* `GET /posts/{post}` → `show()`
* `PUT/PATCH /posts/{post}` → `update()`
* `DELETE /posts/{post}` → `destroy()`

#### Contoh Kasus Penggunaan `except()`:

**API-like Controller (tanpa form):**
```php
Route::resource('products', ProductController::class)->except([
    'create', 'edit'
]);
```

**Tanpa Fitur Delete:**
```php
Route::resource('users', UserController::class)->except([
    'destroy'
]);
```

## Partial Resource untuk API

Untuk API, Laravel menyediakan `apiResource`, yang **otomatis menghapus create & edit** karena API tidak butuh halaman form.
```php
Route::apiResource('posts', PostController::class);
```

Method yang dibuat:
* `GET /posts` → `index()`
* `POST /posts` → `store()`
* `GET /posts/{post}` → `show()`
* `PUT/PATCH /posts/{post}` → `update()`
* `DELETE /posts/{post}` → `destroy()`

:::info Perbedaan apiResource dengan Resource
`apiResource` tidak memiliki method `create()` dan `edit()` karena API tidak memerlukan tampilan form.
:::

## Contoh Penerapan

### Hanya CRUD tanpa halaman form
```php
Route::resource('products', ProductController::class)->except([
    'create', 'edit'
]);
```

**Use case:** Ketika form create/edit menggunakan modal atau SPA (Single Page Application).

### Hanya create & store
```php
Route::resource('comments', CommentController::class)->only([
    'create', 'store'
]);
```

**Use case:** Fitur komentar yang hanya bisa ditambah, tidak bisa diedit atau dihapus.

### Hanya delete
```php
Route::resource('items', ItemController::class)->only([
    'destroy'
]);
```

**Use case:** Endpoint khusus untuk menghapus item, operasi lain ditangani controller berbeda.

### Kombinasi Multiple Resources
```php
// Admin dapat melakukan semua operasi
Route::resource('posts', PostController::class);

// User biasa hanya bisa melihat
Route::resource('public-posts', PostController::class)->only([
    'index', 'show'
]);
```

## Tabel Perbandingan

| Method | Resource | apiResource | only(['index','show']) | except(['destroy']) |
|--------|----------|-------------|------------------------|---------------------|
| index | ✅ | ✅ | ✅ | ✅ |
| create | ✅ | ❌ | ❌ | ✅ |
| store | ✅ | ✅ | ❌ | ✅ |
| show | ✅ | ✅ | ✅ | ✅ |
| edit | ✅ | ❌ | ❌ | ✅ |
| update | ✅ | ✅ | ❌ | ✅ |
| destroy | ✅ | ✅ | ❌ | ❌ |

## Melihat Route yang Terdaftar

Untuk memastikan route mana saja yang terdaftar, gunakan:
```bash
php artisan route:list
```

Atau filter berdasarkan nama:
```bash
php artisan route:list --name=posts
```

:::tip Best Practice
- Gunakan `only()` jika method yang dibutuhkan **lebih sedikit** dari yang tidak dibutuhkan
- Gunakan `except()` jika method yang **tidak dibutuhkan lebih sedikit**
- Gunakan `apiResource` untuk API endpoints
- Selalu cek route list untuk memastikan tidak ada route yang tidak diinginkan terbuka
:::

## Keuntungan Menggunakan Partial Resource

1. **Security** - Tidak membuka endpoint yang tidak diperlukan
2. **Performance** - Mengurangi jumlah route yang harus di-check Laravel
3. **Clean Code** - Route file lebih jelas dan sesuai kebutuhan
4. **Maintainability** - Tim lebih mudah memahami endpoint yang tersedia
5. **Documentation** - Lebih mudah mendokumentasikan API