---
sidebar_position: 1
---

# Memanfaatkan Controller dan Route untuk Mengirim dan Menerima Data

Dalam Laravel, kita mengenal **Controller** dan **Routing**. Controller dalam pola arsitektur MVC (Model–View–Controller) berfungsi sebagai pengelola logika program. Controller bertugas menerima permintaan (request) dari pengguna, memproses data yang diperlukan — biasanya dengan berinteraksi dengan Model — lalu mengembalikan response melalui View atau dalam bentuk JSON untuk API.

Sementara itu, **Routing** berfungsi sebagai penghubung antara URL dengan Controller. Setiap rute menentukan URL apa yang dapat diakses, metode HTTP apa yang digunakan (GET, POST, PUT, DELETE), serta fungsi Controller mana yang akan dijalankan ketika rute tersebut dipanggil.

## Perbedaan Route dan Controller

Dengan kata lain:

* **Route**: menangkap permintaan dari pengguna dan menentukan ke mana permintaan tersebut harus diarahkan.
* **Controller**: menjalankan logika bisnis dan mengembalikan hasilnya.

Kedua elemen ini bekerja bersama untuk membentuk alur permintaan dan respons dalam aplikasi Laravel.

## Alur Kerja Route dan Controller
```
User Request → Route → Controller → Process Logic → Return Response (View/JSON)
```

### Penjelasan Alur:

1. **User Request** - Pengguna mengakses URL tertentu
2. **Route** - Laravel mencocokkan URL dengan route yang terdaftar
3. **Controller** - Route memanggil method di Controller yang sesuai
4. **Process Logic** - Controller memproses data (bisa melibatkan Model)
5. **Return Response** - Controller mengembalikan tampilan (View) atau data (JSON)

## Contoh Implementasi

### Membuat Controller

Buat controller baru menggunakan artisan:
```bash
php artisan make:controller UserController
```

### Mendefinisikan Route

Di file `routes/web.php`:
```php
use App\Http\Controllers\UserController;

Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
```

### Implementasi di Controller

Di file `app/Http/Controllers/UserController.php`:
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    // Menampilkan daftar users
    public function index()
    {
        $users = [
            ['id' => 1, 'name' => 'Budi', 'email' => 'budi@gmail.com'],
            ['id' => 2, 'name' => 'Andi', 'email' => 'andi@gmail.com'],
        ];

        return view('users.index', compact('users'));
    }

    // Menampilkan form create
    public function create()
    {
        return view('users.create');
    }

    // Menyimpan data baru
    public function store(Request $request)
    {
        // Logika menyimpan data
        return redirect()->route('users.index')
                         ->with('success', 'User berhasil ditambahkan');
    }

    // Menampilkan form edit
    public function edit($id)
    {
        // Logika mengambil data berdasarkan ID
        return view('users.edit', compact('user'));
    }

    // Mengupdate data
    public function update(Request $request, $id)
    {
        // Logika update data
        return redirect()->route('users.index')
                         ->with('success', 'User berhasil diupdate');
    }

    // Menghapus data
    public function destroy($id)
    {
        // Logika hapus data
        return redirect()->route('users.index')
                         ->with('success', 'User berhasil dihapus');
    }
}
```

## Keuntungan Menggunakan Controller

1. **Separation of Concerns** - Memisahkan logika bisnis dari routing
2. **Reusable** - Method dapat digunakan kembali
3. **Maintainable** - Kode lebih terorganisir dan mudah dirawat
4. **Testable** - Lebih mudah untuk melakukan unit testing
5. **Clean Code** - Route file tetap bersih dan mudah dibaca

## Best Practices

1. **Gunakan Resource Controller** untuk CRUD operations yang standar
2. **Beri nama route** dengan `->name()` untuk memudahkan referensi
3. **Validation** sebaiknya dilakukan di Controller atau Request class
4. **Logika kompleks** sebaiknya dipindahkan ke Service class
5. **Gunakan dependency injection** untuk membuat kode lebih testable