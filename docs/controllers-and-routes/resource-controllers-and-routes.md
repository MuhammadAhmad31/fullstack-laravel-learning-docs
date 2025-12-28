---
sidebar_position: 3
---

# Resource Controller dan Routes

Pada kasus Basic Controller sebelumnya, ketika kita membuat controller basic, file digenerate hanya class-nya saja, belum ada method/function didalamnya, kita perlu membuatnya sendiri. Pada **Resource Controller** ini kita bisa langsung membuat Controller dengan isi class serta method/functionnya.

## Membuat Resource Controller

Pertama kita tuliskan ini di terminal kita:
```bash
php artisan make:controller UserController --resource
```

Kode yang dibuat pada file `UserController` akan seperti dibawah ini, sudah terdapat function/method-nya pada class controller:
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
```

## Penjelasan Method Resource Controller

| Method | HTTP Verb | URI | Aksi | Keterangan |
|--------|-----------|-----|------|------------|
| `index()` | GET | `/users` | Menampilkan list | Menampilkan daftar semua data |
| `create()` | GET | `/users/create` | Menampilkan form | Form untuk membuat data baru |
| `store()` | POST | `/users` | Menyimpan data | Menyimpan data baru ke database |
| `show($id)` | GET | `/users/{id}` | Menampilkan detail | Menampilkan detail data berdasarkan ID |
| `edit($id)` | GET | `/users/{id}/edit` | Menampilkan form edit | Form untuk mengedit data |
| `update($id)` | PUT/PATCH | `/users/{id}` | Mengupdate data | Mengupdate data di database |
| `destroy($id)` | DELETE | `/users/{id}` | Menghapus data | Menghapus data dari database |

## Implementasi Method Index

Kita langsung bisa pakai function dan method-nya tanpa harus membuatnya manual. Sekarang kita coba daftarkan data `$users` ke method `index()`:
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = [
            [
                'id' => 1, 
                'name' => 'Budi', 
                'email' => 'budi@gmail.com', 
                'photo' => 'https://randomuser.me/api/portraits/men/1.jpg', 
                'image_url' => 'https://randomuser.me/api/portraits/men/3.jpg',
                'balance' => 1000000,
                'status' => 'active',
            ],
            [
                'id' => 2, 
                'name' => 'Andi', 
                'email' => 'andi@gmail.com', 
                'photo' => 'https://randomuser.me/api/portraits/men/2.jpg', 
                'image_url' => 'https://randomuser.me/api/portraits/men/4.jpg',
                'balance' => 2000000,
                'status' => 'inactive',
            ],
        ];
        
        return view('welcome', compact('users'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
```

## Mendaftarkan Resource Route

Kita cukup panggil controller di routes seperti ini, **tanpa mendaftarkan function/method-nya satu per satu**:
```php
use App\Http\Controllers\UserController;

Route::resource('users', UserController::class);
```

Dengan **satu baris kode** ini, Laravel otomatis membuat **7 route** sekaligus untuk semua operasi CRUD!

## Melihat Semua Route

Untuk melihat semua route yang telah terdaftar, jalankan perintah:
```bash
php artisan route:list
```

Hasilnya akan menampilkan:
```
GET|HEAD   users ...................... users.index › UserController@index
POST       users ...................... users.store › UserController@store
GET|HEAD   users/create ............... users.create › UserController@create
GET|HEAD   users/{user} ............... users.show › UserController@show
PUT|PATCH  users/{user} ............... users.update › UserController@update
DELETE     users/{user} ............... users.destroy › UserController@destroy
GET|HEAD   users/{user}/edit .......... users.edit › UserController@edit
```

## Keuntungan Resource Controller

1. **Efisien** - Membuat 7 route dengan 1 baris kode
2. **Standar** - Mengikuti konvensi RESTful
3. **Konsisten** - Nama route dan URI sudah terstandarisasi
4. **Maintainable** - Mudah dikelola dan dipahami tim
5. **Auto-generated** - Method sudah tersedia, tinggal isi logikanya

## Membatasi Route Resource

Jika tidak ingin menggunakan semua method, kita bisa membatasinya:

### Hanya menggunakan method tertentu:
```php
Route::resource('users', UserController::class)->only(['index', 'show']);
```

### Mengecualikan method tertentu:
```php
Route::resource('users', UserController::class)->except(['destroy']);
```

## API Resource Controller

Untuk API, Laravel juga menyediakan API Resource Controller yang tidak memiliki method `create` dan `edit` (karena API tidak memerlukan form):
```bash
php artisan make:controller UserController --api
```

Atau di routes:
```php
Route::apiResource('users', UserController::class);
```

:::tip Best Practice
Resource Controller sangat cocok digunakan untuk operasi CRUD standar. Untuk operasi yang tidak standar atau custom, buat method tambahan atau gunakan controller terpisah.
:::