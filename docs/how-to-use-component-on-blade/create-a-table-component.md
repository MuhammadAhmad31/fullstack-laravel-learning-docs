---
sidebar_position: 3
---

# Praktek Pembuatan Table Data dengan Component

Dalam pembuatan aplikasi, banyak yang menggunakan table untuk menampilkan list datanya. Terkadang di Laravel masih banyak coder yang menulis table berulang-ulang, atau bahkan menggunakan library data table yang sudah ada untuk membuatnya. Nah disini kita akan membuat data table sederhana dengan memanfaatkan component Laravel agar kita bisa lebih paham.

## Membuat Component Datatable

Jalankan perintah artisan:
```bash
php artisan make:component DataTable
```

### app/View/Components/DataTable.php
```php
<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class DataTable extends Component
{
    public $headers;
    public $items;
    
    /**
     * Create a new component instance.
     */
    public function __construct($headers = [], $items = [])
    {
        $this->headers = $headers;
        $this->items = $items;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.data-table');
    }
}
```

### resources/views/components/data-table.blade.php
```blade
<div class="overflow-x-auto rounded-lg border border-gray-300">
    <table class="min-w-full text-sm text-left">
        
        {{-- Header --}}
        <thead class="bg-gray-100 border-b">
            <tr>
                @foreach ($headers as $header)
                    <th class="px-4 py-2 font-semibold uppercase text-gray-700">
                        {{ $header }}
                    </th>
                @endforeach
            </tr>
        </thead>

        {{-- Body --}}
        <tbody>
            @foreach ($items as $item)
                <tr class="border-b">

                    @foreach ($item as $value)
                        <td class="px-4 py-2">
                            {{ $value }}
                        </td>
                    @endforeach

                </tr>
            @endforeach
        </tbody>
        
    </table>
</div>
```

## Penggunaan Component

### Contoh 1: Data Langsung di View
```blade
<x-data-table 
    :headers="['ID', 'Nama', 'Email']"
    :items="[
        [
            'id' => 1, 
            'name' => 'Budi', 
            'email' => 'budi@gmail.com'
        ],
        [
            'id' => 2, 
            'name' => 'Andi', 
            'email' => 'andi@gmail.com'
        ],
    ]"
/>
```

### Contoh 2: Data dari Controller/Route

Apabila data dikirim dari luar halaman:
```php
// file routes/web.php
Route::get('/', function () {
    $users = [
        [
            'id' => 1, 
            'name' => 'Budi', 
            'email' => 'budi@gmail.com'
        ],
        [
            'id' => 2, 
            'name' => 'Andi', 
            'email' => 'andi@gmail.com'
        ],
    ];

    return view('welcome', compact('users'));
});
```
```blade
<x-data-table 
    :headers="['ID', 'Nama', 'Email']"
    :items="$users"
/>
```

:::tip Catatan Penting
`:headers` dan `:items` kenapa harus ada symbol **":"**? Ini dikarenakan agar isi datanya bukan string. Jika tidak diberi symbol **":"** maka akan dibaca sebagai string saja, bukan sebagai variabel yang memiliki nilai.
:::

## Menambahkan Aksi didalam Tabel

Disini kita hanya bisa menampilkan data. Didalam data table biasanya kita membutuhkan button untuk aksi menambahkan data, mengedit data, serta menghapus datanya.

### Langkah 1: Menambahkan Atribut Baru untuk Action

Perbarui file `app/View/Components/DataTable.php`:
```php
<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class DataTable extends Component
{
    public $headers;
    public $items;
    public $editable;
    public $deletable;
    public $creatable;
    public $editRoute;
    public $deleteRoute;
    public $createRoute;

    /**
     * Create a new component instance.
     */
    public function __construct(
        $headers = [], 
        $items = [], 
        $editable = false, 
        $deletable = false, 
        $creatable = false, 
        $editRoute = '', 
        $deleteRoute = '', 
        $createRoute = ''
    )
    {
        $this->headers = $headers;
        $this->items = $items;
        $this->editable = $editable;
        $this->deletable = $deletable;
        $this->creatable = $creatable;
        $this->editRoute = $editRoute;
        $this->deleteRoute = $deleteRoute;
        $this->createRoute = $createRoute;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.data-table');
    }
}
```

### Langkah 2: Tambahkan Route untuk Aksi
```php
Route::get('/users/create', function () {
    return 'FORM CREATE USER';
})->name('users.create');

Route::get('/users/{id}/edit', function ($id) {
    return "FORM EDIT USER ID: " . $id;
})->name('users.edit');

Route::delete('/users/{id}', function ($id) {
    return "DELETE USER ID: " . $id;
})->name('users.destroy');
```

### Langkah 3: Ubah Tampilan Component

Perbarui file `resources/views/components/data-table.blade.php`:
```blade
<div class="overflow-x-auto rounded-lg border border-gray-300">

    @if ($creatable && $createRoute)
        <div class="p-3">
            <a 
                href="{{ route($createRoute) }}" 
                class="px-4 py-2 bg-blue-600 text-white rounded"
            >
                + Tambah Baru
            </a>
        </div>
    @endif

    <table class="min-w-full text-sm text-left">

        <thead class="bg-gray-100 border-b">
            <tr>
                @foreach ($headers as $header)
                    <th class="px-4 py-2 font-semibold uppercase text-gray-700">
                        {{ $header }}
                    </th>
                @endforeach

                @if ($editable || $deletable)
                    <th class="px-4 py-2 font-semibold uppercase text-gray-700">
                        Aksi
                    </th>
                @endif
            </tr>
        </thead>

        <tbody>
            @foreach ($items as $item)
                <tr class="border-b">

                    @foreach ($headers as $key)
                        <td class="px-4 py-2">
                            {{ $item[strtolower($key)] ?? $item[$key] ?? '' }}
                        </td>
                    @endforeach

                    @if ($editable || $deletable)
                        <td class="px-4 py-2 space-x-2">

                            @if ($editable && $editRoute)
                                <a 
                                    href="{{ route($editRoute, $item['id']) }}" 
                                    class="text-blue-600 hover:underline"
                                >
                                    Edit
                                </a>
                            @endif

                            @if ($deletable && $deleteRoute)
                                <form 
                                    action="{{ route($deleteRoute, $item['id']) }}" 
                                    method="POST" 
                                    class="inline"
                                >
                                    @csrf
                                    @method('DELETE')
                                    <button 
                                        type="submit" 
                                        class="text-red-600 hover:underline"
                                    >
                                        Hapus
                                    </button>
                                </form>
                            @endif
                        </td>
                    @endif
                </tr>
            @endforeach
        </tbody>  
    </table>
</div>
```

### Langkah 4: Panggil Component dengan Aksi
```blade
<x-data-table 
   :headers="['name', 'email']"
   :items="$users"

   editable="true"
   deletable="true"
   creatable="true"

   editRoute="users.edit"
   deleteRoute="users.destroy"
   createRoute="users.create"
/>
```

Dengan cara ini, data table Anda sekarang sudah memiliki fitur lengkap untuk menambah, edit, dan hapus data dengan mudah dan reusable di berbagai halaman.