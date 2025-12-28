---
sidebar_position: 4
---

# (ADVANCE) Menambahkan Formatter pada Table Data

Pada materi kali ini teman-teman akan belajar bagaimana caranya mengirim tampilan blade ke tampilan lain. Pada studi kasus kita kali ini, kita akan mengirim tampilan blade untuk formatter ke dalam tampilan component Data Table.

## Permasalahan

Dalam menampilkan table sebelumnya, kita tidak bisa memformat data yang tampil. Semua data yang muncul hanya tulisan. Jika kita mengirim data url sebuah image, yang muncul hanya string URL-nya saja, bukan gambar.

Terlihat data yang muncul hanya string bukan sebuah gambar. Nah bagaimana kita memformat agar data yang muncul bukan sebuah string melainkan sebuah image? Kita akan langsung praktekkan.

## Buat Component Agar Dapat Menerima Formatters

Agar nantinya component kita dapat menerima sebuah formatter dari luar, kita harus menambahkan atribut formatter di class Component Data Table kita.

Perbarui `app/View/Components/DataTable.php`:
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
    // tambahkan formatters disini
    public $formatters;

    /**
     * Create a new component instance.
     */
    public function __construct(
        $headers = [], 
        $items = [],
        // tambahkan formatters disini
        $formatters = [], 
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
        //tambahkan juga disini
        $this->formatters = $formatters;
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

## Membuat Tampilan Blade untuk Formatter

Kita disini akan belajar untuk mengirim sebuah tampilan blade kedalam component. Studi kasus kita kali ini akan mengirim tampilan formatter untuk sebuah gambar yang nantinya kita kirim ke component Table Data.

### Buat File Formatter Image

Tambahkan file baru `/resources/views/components/partials/tableFormat/image.blade.php`:
```blade
@php
    $value = $item[$column] ?? null;
@endphp

@if ($value)
    <img src="{{ $value }}"
         class="w-12 h-12 rounded object-cover border"
         alt="image">
@else
    <span class="text-gray-400 text-xs">—</span>
@endif
```

## Mengubah Component Data Table untuk Mengirim Data ke Formatter

Edit file Component Data Table `/resources/views/components/data-table.blade.php`:
```blade
<div class="overflow-x-auto rounded-lg border border-gray-300 w-full">
    @if ($creatable && $createRoute)
        <div class="p-3">
            <a href="{{ route($createRoute) }}" class="px-4 py-2 bg-blue-600 text-white rounded">
                + Tambah Baru
            </a>
        </div>
    @endif

    <table class="min-w-full text-sm text-left">
        <thead class="bg-gray-100 border-b">
            <tr>
                @foreach ($headers as $header)
                    <th class="px-4 py-2 font-semibold uppercase text-gray-700">{{ $header }}</th>
                @endforeach

                @if ($editable || $deletable)
                    <th class="px-4 py-2 font-semibold uppercase text-gray-700">Aksi</th>
                @endif
            </tr>
        </thead>

        <tbody>
            @foreach ($items as $item)
                <tr class="border-b">
                    
                    {{-- START KODE YANG DIUBAH --}}
                    @foreach ($headers as $key)
                        @php
                            // ambil column dari $key headernya
                            $column = strtolower($key);
                                                        
                            // disini cek apakah column tersebut memiliki formatter
                            $formatter = $formatters[$column] ?? null;
                        @endphp

                        <td class="px-4 py-2">
                            @if ($formatter)
                                {{-- jika formatters ada maka panggil tampilan blade 
                                  formatter, kemudian kirim data $item dan $column-nya --}}
                                @include($formatter, [
                                    'item' => $item,
                                    'column' => $column,
                                ])
                            @else
                                {{-- jika tidak ada formatter dia akan mengembalikan string valuenya --}}
                                {{ $item[$column] ?? '' }}
                            @endif
                        </td>
                    @endforeach
                    {{-- END KODE YANG DIUBAH --}}

                    @if ($editable || $deletable)
                        <td class="px-4 py-2 space-x-2">
                            @if ($editable && $editRoute)
                                <a href="{{ route($editRoute, $item['id']) }}"
                                    class="text-blue-600 hover:underline">Edit</a>
                            @endif

                            @if ($deletable && $deleteRoute)
                                <form action="{{ route($deleteRoute, $item['id']) }}" method="POST" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-600 hover:underline">Hapus</button>
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

:::info Penjelasan
Pada file formatter image menerima data `$item`, dan juga `$column`. Isi dari `$item[$column]` di file formatter image sama dengan `{{ $item[$column] ?? '' }}` yang berada di file component data table yang digunakan untuk menampilkan data. 

Akan tetapi pada file formatter mengubah datanya dengan mengembalikan tampilan tag image html dengan value yang berasal dari data yang dikirim di component.
:::

## Cara Penggunaan Formatter Pada Pemanggilan Component Data Table

Setelah kita membuat formatternya, kita akan uji coba. Bagaimana caranya kita menggunakan formatternya ketika kita memanggil Component Data Table?

### Langkah 1: Sediakan Data Image

Masukkan data baru. Disini kita akan menambahkan image pada data `$users` yang ada di routes:
```php
Route::get('/', function () {
    $users = [
        [
            'id' => 1, 
            'name' => 'Budi', 
            'email' => 'budi@gmail.com', 
            'photo' => 'https://randomuser.me/api/portraits/men/1.jpg', 
        ],
        [
            'id' => 2, 
            'name' => 'Andi', 
            'email' => 'andi@gmail.com', 
            'photo' => 'https://randomuser.me/api/portraits/men/2.jpg', 
        ],
    ];

    return view('welcome', compact('users'));
});
```

### Langkah 2: Gunakan Formatter di Component

Kemudian gunakan data photo dan formatternya ketika memanggil Component Data Table:
```blade
<x-data-table 
    {{-- tambahkan data photo --}}
    :headers="['name', 'email', 'photo']"
    :items="$users"

    editable="true"
    deletable="true"
    creatable="true"

    editRoute="users.edit"
    deleteRoute="users.destroy"
    createRoute="users.create"
    :formatters="[
        // ambil tampilan blade formatter yang dibuat kemudian taruh disini
        'photo' => 'components.partials.tableFormat.image',
    ]"
/>
```

Sekarang data yang muncul sudah sebuah foto, bukan lagi string dari url imagenya! 🎉

## Keuntungan Menggunakan Formatter

1. **Reusable** - Formatter dapat digunakan di berbagai tabel
2. **Maintainable** - Perubahan tampilan cukup di satu file formatter
3. **Flexible** - Mudah membuat formatter baru untuk tipe data lain (badge, tanggal, status, dll)
4. **Clean Code** - Memisahkan logika tampilan dari component utama