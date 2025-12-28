---
sidebar_position: 7
---

# All Routes on Laravel

Berikut penjelasan route-route yang paling sering dipakai di Laravel, lengkap dengan contoh dan fungsinya. Ini berlaku di Laravel 12 maupun versi sebelumnya karena routing Laravel sangat stabil.

## 1. Route GET

Digunakan untuk **menampilkan halaman** atau **mengambil data**.
```php
Route::get('/home', HomeController::class);
```

**Contoh penggunaan:** halaman dashboard, detail data, tampilan form.
```php
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::get('/dashboard', DashboardController::class);
```

## 2. Route POST

Dipakai untuk **mengirim data** dari form atau API endpoint.
```php
Route::post('/login', [AuthController::class, 'login']);
```

**Contoh penggunaan:** login, register, store data.
```php
Route::post('/register', [AuthController::class, 'register']);
Route::post('/posts', [PostController::class, 'store']);
Route::post('/comments', [CommentController::class, 'store']);
```

## 3. Route PUT

Untuk **update data secara keseluruhan**.
```php
Route::put('/profile/{id}', [ProfileController::class, 'update']);
```

**Contoh penggunaan:**
```php
Route::put('/users/{id}', [UserController::class, 'update']);
Route::put('/posts/{id}', [PostController::class, 'update']);
```

## 4. Route PATCH

Untuk **update sebagian data**.
```php
Route::patch('/profile/{id}', [ProfileController::class, 'partialUpdate']);
```

:::info Catatan PUT vs PATCH
Dalam praktik, PUT & PATCH sering **interchangeable** karena Laravel handle keduanya sama. Jadi ketika route didaftarkan PATCH, akan tetapi dipanggil dengan PUT, Laravel tetap akan bisa membaca walaupun methodnya berbeda.
:::

## 5. Route DELETE

Untuk **menghapus data**.
```php
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
```

**Contoh penggunaan:**
```php
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::delete('/posts/{id}', [PostController::class, 'destroy']);
```

## 6. Route ANY

Menerima **semua HTTP method**: GET, POST, PUT, PATCH, DELETE.
```php
Route::any('/webhook', WebhookController::class);
```

**Contoh penggunaan:** untuk webhook yang tidak pasti method-nya.
```php
Route::any('/callback', CallbackController::class);
Route::any('/test', function() {
    return 'Method apapun diterima';
});
```

## 7. Route MATCH

Menerima **hanya method tertentu**.
```php
Route::match(['get', 'post'], '/search', SearchController::class);
```

**Contoh penggunaan:**
```php
Route::match(['get', 'post'], '/contact', [ContactController::class, 'handle']);
Route::match(['put', 'patch'], '/settings', [SettingController::class, 'update']);
```

## 8. Route VIEW

Mengembalikan **langsung view tanpa controller**.
```php
Route::view('/about', 'about');
```

**Dengan data:**
```php
Route::view('/about', 'about', ['title' => 'Company Info']);
```

**Contoh penggunaan:**
```php
Route::view('/terms', 'legal.terms');
Route::view('/privacy', 'legal.privacy', ['updated' => '2025-01-01']);
Route::view('/contact', 'pages.contact', ['email' => 'info@example.com']);
```

## 9. Route REDIRECT

Untuk melakukan **redirect permanen/temporary**.
```php
Route::redirect('/old', '/new', 301);
```

**Parameter ketiga (status code):**
- `301` - Permanent redirect (default)
- `302` - Temporary redirect

**Contoh penggunaan:**
```php
Route::redirect('/home', '/dashboard', 301);
Route::redirect('/old-blog', '/blog', 302);
Route::permanentRedirect('/old-url', '/new-url'); // Shortcut untuk 301
```

## 10. Resource Route (CRUD otomatis)

Membuat **7 route CRUD** otomatis.
```php
Route::resource('posts', PostController::class);
```

Route yang dihasilkan:
- `GET /posts` → index
- `GET /posts/create` → create
- `POST /posts` → store
- `GET /posts/{post}` → show
- `GET /posts/{post}/edit` → edit
- `PUT/PATCH /posts/{post}` → update
- `DELETE /posts/{post}` → destroy

## 11. API Resource Route

Versi API (tanpa create/edit form).
```php
Route::apiResource('products', ProductController::class);
```

Route yang dihasilkan:
- `GET /products` → index
- `POST /products` → store
- `GET /products/{product}` → show
- `PUT/PATCH /products/{product}` → update
- `DELETE /products/{product}` → destroy

## 12. Single Action Controller Route

Route yang memanggil controller dengan `__invoke()`.
```php
Route::post('/send-email', SendEmailController::class);
```

**Contoh penggunaan:**
```php
Route::post('/upload-image', UploadImageController::class);
Route::get('/export-users', ExportUsersController::class);
Route::post('/webhook/payment', WebhookPaymentController::class);
```

## 13. Route Group

Dipakai untuk **grouping** middleware, prefix, atau name.

### Group dengan Middleware
```php
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class);
    Route::get('/profile', ProfileController::class);
});
```

### Group dengan Prefix
```php
Route::prefix('admin')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/posts', [PostController::class, 'index']);
});
// Menghasilkan: /admin/users, /admin/posts
```

### Group dengan Name
```php
Route::name('admin.')->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::get('/posts', [PostController::class, 'index'])->name('posts');
});
// Menghasilkan: admin.users, admin.posts
```

### Kombinasi Group
```php
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('posts', PostController::class);
    });
```

## 14. Route Parameter

### Parameter Wajib
```php
Route::get('/user/{id}', UserController::class);
```

### Parameter Optional
```php
Route::get('/user/{id?}', UserController::class);
```

### Dengan Default Value
```php
Route::get('/user/{name?}', function ($name = 'Guest') {
    return "Hello, $name";
});
```

### Multiple Parameters
```php
Route::get('/posts/{category}/{id}', [PostController::class, 'show']);
```

### Regular Expression Constraints
```php
// Hanya angka
Route::get('/user/{id}', UserController::class)->where('id', '[0-9]+');

// Hanya huruf
Route::get('/user/{name}', UserController::class)->where('name', '[a-zA-Z]+');

// Multiple constraints
Route::get('/posts/{category}/{id}', [PostController::class, 'show'])
    ->where(['category' => '[a-zA-Z]+', 'id' => '[0-9]+']);
```

### Global Constraints

Di `RouteServiceProvider` atau `bootstrap/app.php`:
```php
Route::pattern('id', '[0-9]+');
Route::pattern('slug', '[a-z0-9-]+');
```

## 15. Route Fallback

Dipanggil ketika **route tidak ditemukan** (handle 404 custom).
```php
Route::fallback(function () {
    return view('errors.404');
});
```

**Contoh dengan response JSON:**
```php
Route::fallback(function () {
    return response()->json([
        'message' => 'Route not found'
    ], 404);
});
```

:::warning Perhatian
Route fallback harus didaftarkan di **paling akhir** file routes agar tidak menimpa route lain.
:::

## Ringkasan Tabel

| Jenis Route | Fungsi | Contoh |
|-------------|--------|--------|
| **GET** | Menampilkan data/halaman | `Route::get('/posts', ...)` |
| **POST** | Menyimpan data | `Route::post('/posts', ...)` |
| **PUT/PATCH** | Update data | `Route::put('/posts/{id}', ...)` |
| **DELETE** | Hapus data | `Route::delete('/posts/{id}', ...)` |
| **ANY** | Semua method | `Route::any('/webhook', ...)` |
| **MATCH** | Method tertentu | `Route::match(['get','post'], ...)` |
| **VIEW** | Langsung ke view | `Route::view('/about', 'about')` |
| **REDIRECT** | Redirect | `Route::redirect('/old', '/new')` |
| **RESOURCE** | CRUD otomatis | `Route::resource('posts', ...)` |
| **API RESOURCE** | CRUD API | `Route::apiResource('posts', ...)` |
| **GROUP** | Prefix, middleware, namespace | `Route::prefix('admin')->group(...)` |
| **PARAMETER** | Route dengan variable | `Route::get('/user/{id}', ...)` |
| **FALLBACK** | Route not found custom | `Route::fallback(...)` |

## Best Practices

### 1. Gunakan Route Names
```php
// ✅ Good
Route::get('/dashboard', DashboardController::class)->name('dashboard');

// Penggunaan
return redirect()->route('dashboard');
```

### 2. Grouping untuk Organisasi
```php
// ✅ Good - Terorganisir
Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    Route::resource('users', UserController::class);
    Route::resource('posts', PostController::class);
});
```

### 3. Gunakan Resource untuk CRUD
```php
// ✅ Good
Route::resource('posts', PostController::class);

// ❌ Bad - Manual
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/create', [PostController::class, 'create']);
Route::post('/posts', [PostController::class, 'store']);
// ... dst
```

### 4. Pisahkan Routes berdasarkan Konteks
```php
// routes/web.php - untuk halaman web
// routes/api.php - untuk API endpoints
// routes/admin.php - untuk admin panel (custom)
```

### 5. Gunakan Middleware dengan Bijak
```php
Route::middleware(['auth', 'verified'])->group(function () {
    // Routes yang memerlukan autentikasi dan verifikasi email
});
```

## Melihat Semua Routes

Untuk melihat semua route yang terdaftar:
```bash
php artisan route:list
```

Dengan filter:
```bash
# Filter by name
php artisan route:list --name=admin

# Filter by method
php artisan route:list --method=GET

# Filter by path
php artisan route:list --path=api
```

:::tip Tips
- Selalu beri **nama route** untuk memudahkan maintenance
- Gunakan **route grouping** untuk organisasi yang lebih baik
- Manfaatkan **resource routes** untuk operasi CRUD standar
- Pisahkan **web routes** dan **api routes**
- Gunakan **middleware** untuk proteksi route
:::