---
sidebar_position: 5
---

# Naming Resource Route

Berikut penjelasan lengkap tentang **Naming Resource Routes** di Laravel, termasuk nama default untuk setiap method dan cara mengubah atau mengatur nama tersebut.

## Apa itu Naming Resource Routes?

Ketika kamu membuat resource route:
```php
Route::resource('posts', PostController::class);
```

Laravel secara otomatis memberi nama untuk setiap route yang di-generate. Nama-nama ini penting untuk:

* `route('posts.index')` - Menghasilkan URL
* redirect otomatis - `redirect()->route('posts.show', $id)`
* link ke halaman tertentu - `<a href="{{ route('posts.edit', $id) }}">`
* konsistensi naming di seluruh aplikasi

## Nama Default Resource Routes

Laravel membuat 7 route dengan nama bawaan seperti ini:

| HTTP Verb | URI | Action | Route Name |
|-----------|-----|--------|------------|
| GET | `/posts` | index | `posts.index` |
| GET | `/posts/create` | create | `posts.create` |
| POST | `/posts` | store | `posts.store` |
| GET | `/posts/{post}` | show | `posts.show` |
| GET | `/posts/{post}/edit` | edit | `posts.edit` |
| PUT/PATCH | `/posts/{post}` | update | `posts.update` |
| DELETE | `/posts/{post}` | destroy | `posts.destroy` |

### Contoh Penggunaan:
```php
// Redirect ke halaman index
return redirect()->route('posts.index');

// Redirect ke halaman detail dengan ID
return redirect()->route('posts.show', $postId);

// Generate URL di Blade
<a href="{{ route('posts.edit', $post->id) }}">Edit</a>

// Cek route saat ini
if (request()->routeIs('posts.index')) {
    // lakukan sesuatu
}
```

## Naming pada Partial Resource

Jika kamu pakai `only()` atau `except()`, nama yang tersedia **hanya method yang disertakan**.
```php
Route::resource('posts', PostController::class)->only(['index', 'show']);
```

Route yang tersedia:
* `posts.index`
* `posts.show`

Method lain tidak dibuat → nama lainnya tidak ada.

:::warning Perhatian
Jika mencoba mengakses route name yang tidak terdaftar, Laravel akan throw error `Route [posts.create] not defined`.
:::

## Cara Mengatur / Edit Nama Resource Route

### 1. Mengubah Nama Satu Method

Laravel punya fungsi `names()` untuk mengubah nama spesifik:
```php
Route::resource('posts', PostController::class)->names([
    'index' => 'post.list',
    'show' => 'post.detail',
]);
```

Sekarang:
* `posts.index` → `post.list`
* `posts.show` → `post.detail`
* Method lainnya tetap menggunakan nama default

**Contoh penggunaan:**
```php
return redirect()->route('post.list'); // menuju posts.index
return redirect()->route('post.detail', $id); // menuju posts.show
```

### 2. Mengubah Semua Prefix Nama Route

Gunakan `names()` dengan satu parameter untuk mengubah semua prefix:
```php
Route::resource('posts', PostController::class)->names('blog');
```

Nama menjadi:
* `blog.index`
* `blog.create`
* `blog.store`
* `blog.show`
* `blog.edit`
* `blog.update`
* `blog.destroy`

**Contoh penggunaan:**
```php
return redirect()->route('blog.index');
return redirect()->route('blog.show', $id);
```

### 3. Menamai Route API Resource

Untuk API:
```php
Route::apiResource('products', ProductController::class)->names('api.products');
```

Nama route menjadi:
* `api.products.index`
* `api.products.store`
* `api.products.show`
* `api.products.update`
* `api.products.destroy`

(form `create`/`edit` tidak ada karena menggunakan apiResource)

**Contoh penggunaan:**
```php
return response()->json([
    'data' => $product,
    'links' => [
        'self' => route('api.products.show', $product->id),
        'update' => route('api.products.update', $product->id),
        'delete' => route('api.products.destroy', $product->id),
    ]
]);
```

## Kombinasi dengan Partial Resource

Kamu bisa menggabungkan naming dengan partial resource:
```php
Route::resource('posts', PostController::class)
    ->only(['index', 'show'])
    ->names([
        'index' => 'articles.list',
        'show' => 'articles.detail'
    ]);
```

Atau:
```php
Route::resource('posts', PostController::class)
    ->except(['destroy'])
    ->names('blog');
```

## Best Practices

### 1. Konsistensi Naming

Gunakan naming yang konsisten di seluruh aplikasi:
```php
// ✅ Good - Konsisten
Route::resource('posts', PostController::class)->names('blog');
Route::resource('comments', CommentController::class)->names('blog.comments');

// ❌ Bad - Tidak konsisten
Route::resource('posts', PostController::class)->names('articles');
Route::resource('comments', CommentController::class)->names('comment');
```

### 2. API Versioning

Untuk API dengan versioning:
```php
Route::prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class)->names('api.v1.products');
});

Route::prefix('v2')->group(function () {
    Route::apiResource('products', ProductControllerV2::class)->names('api.v2.products');
});
```

### 3. Grouping dengan Prefix
```php
Route::prefix('admin')->name('admin.')->group(function () {
    Route::resource('posts', PostController::class);
    // Routes akan menjadi: admin.posts.index, admin.posts.create, dll
});
```

## Melihat Semua Route Names

Untuk melihat semua route names yang terdaftar:
```bash
php artisan route:list --columns=name,uri,action
```

Atau filter berdasarkan name:
```bash
php artisan route:list --name=posts
```

## Tabel Perbandingan Naming

| Method | Default Name | Custom with names('blog') | Custom Specific |
|--------|--------------|---------------------------|-----------------|
| index | posts.index | blog.index | article.list |
| create | posts.create | blog.create | article.form |
| store | posts.store | blog.store | article.save |
| show | posts.show | blog.show | article.detail |
| edit | posts.edit | blog.edit | article.form-edit |
| update | posts.update | blog.update | article.update |
| destroy | posts.destroy | blog.destroy | article.delete |

:::tip Tips
- Gunakan naming yang deskriptif dan mudah diingat
- Untuk proyek besar, gunakan prefix untuk mengelompokkan routes (admin, api, user, dll)
- Konsisten dalam penggunaan singular/plural
- Dokumentasikan custom route names untuk tim
:::

## Contoh Lengkap dalam Aplikasi
```php
// routes/web.php

// Public routes dengan custom naming
Route::resource('articles', ArticleController::class)
    ->only(['index', 'show'])
    ->names([
        'index' => 'blog.index',
        'show' => 'blog.show'
    ]);

// Admin routes dengan prefix dan naming
Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    Route::resource('posts', Admin\PostController::class);
    // Routes: admin.posts.index, admin.posts.create, dll
});

// API routes
Route::prefix('api/v1')->name('api.v1.')->group(function () {
    Route::apiResource('products', Api\ProductController::class);
    // Routes: api.v1.products.index, api.v1.products.store, dll
});
```

**Penggunaan di Blade:**
```blade
{{-- Public blog --}}
<a href="{{ route('blog.index') }}">Semua Artikel</a>
<a href="{{ route('blog.show', $article->id) }}">Detail Artikel</a>

{{-- Admin panel --}}
<a href="{{ route('admin.posts.create') }}">Buat Post Baru</a>
<a href="{{ route('admin.posts.edit', $post->id) }}">Edit Post</a>
```

**Penggunaan di Controller:**
```php
public function store(Request $request)
{
    // Simpan data...
    
    return redirect()
        ->route('admin.posts.index')
        ->with('success', 'Post berhasil dibuat!');
}
```