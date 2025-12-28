---
sidebar_position: 2
---

# Basic Controller dan Routes

Untuk membuat controller basic pada Laravel, kita cukup jalankan perintah ini di terminal:
```bash
php artisan make:controller UserController
```

Disini Laravel akan membuat sebuah file baru di folder `/app/Http/Controllers/UserController.php`, dengan isi hanya ada sebuah class tanpa method/function:
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    //
}
```

## Membuat Method di Controller

Disini saya akan mencoba memanfaatkan Controller User untuk datanya dan edit data sebelumnya yang ada di routes pada materi sebelumnya. Disini kita buat function `index` dengan mengisi data `$users`:
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
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
}
```

## Mendaftarkan Controller ke Routes

Setelah kita daftarkan data `$users` di controller, kita cukup panggil controller dan daftarkan function/methodnya di file routes:
```php
// import UserController di file routes
use App\Http\Controllers\UserController;

// gunakan controller di routes
Route::get('/', [UserController::class, 'index']);
```

## Penjelasan Kode

### Di Controller:
- **Method `index()`** - Fungsi yang akan dijalankan ketika route dipanggil
- **Data `$users`** - Array yang berisi data pengguna
- **`return view()`** - Mengembalikan tampilan dengan data yang dikirim
- **`compact('users')`** - Mengirim variabel `$users` ke view

### Di Routes:
- **`use App\Http\Controllers\UserController`** - Import class controller
- **`[UserController::class, 'index']`** - Memanggil method `index` dari `UserController`
- Syntax ini menggunakan array dengan dua elemen:
  1. Class controller yang akan dipanggil
  2. Nama method yang akan dieksekusi

## Keuntungan Memindahkan Data ke Controller

1. **Separation of Concerns** - Route file lebih bersih dan fokus pada routing
2. **Maintainability** - Logika data terpusat di satu tempat
3. **Reusability** - Data dan logika dapat digunakan ulang
4. **Scalability** - Mudah dikembangkan dengan menambah method baru
5. **Testing** - Lebih mudah untuk melakukan unit testing

## Tips

:::tip Route Naming
Berikan nama pada route untuk memudahkan referensi:
```php
Route::get('/', [UserController::class, 'index'])->name('home');
```

Kemudian gunakan di view atau redirect:
```php
return redirect()->route('home');
```
:::

:::info Method Naming Convention
Gunakan nama method yang sesuai dengan aksinya:
- `index()` - Menampilkan daftar data
- `create()` - Menampilkan form create
- `store()` - Menyimpan data baru
- `show($id)` - Menampilkan detail data
- `edit($id)` - Menampilkan form edit
- `update($id)` - Mengupdate data
- `destroy($id)` - Menghapus data
:::