---
sidebar_position: 2
---

# Praktek Pembuatan Card dengan Component

## Membuat Komponen Card

Jalankan perintah artisan untuk membuat component Card:
```bash
php artisan make:component Card
```

Perintah ini akan membuat file baru pada folder:
```
app/View/Components/Card.php
resources/views/components/card.blade.php
```

## Struktur File Component

### app/View/Components/Card.php
```php
<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Card extends Component
{
    public $shadow;
    
    /**
     * Create a new component instance.
     */
    public function __construct($shadow = '')
    {
        $this->shadow = $shadow;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.card');
    }
}
```

Pada constructor `__construct()` daftarkan properti data yang akan dibutuhkan di component. Ikuti seperti kode diatas, tulis data dengan `public $shadow;` kemudian masukkan kedalam constructor.

### resources/views/components/card.blade.php
```blade
<div {{ $attributes->merge(['class' => 'p-6 bg-white rounded ' . ($shadow ? 'shadow-lg' : '')]) }}>
    <div class="mb-4">
        ini headernya
    </div>
    <div>
        bodynya seperti ini
    </div>
    <div class="mt-4">
       ini footer ya
    </div>
</div>
```

Data `$shadow` dapat langsung dipakai karena tadi sudah didaftarkan lewat constructor yang ada di `app/View/Components/Card.php`. Dalam kasus ini digunakan untuk mengecek jika shadow true, card akan memunculkan bayangan dibelakang dengan menambahkan class tailwind `shadow-lg` → `($shadow ? 'shadow-lg' : '')`

## Pemanggilan Component Card
```blade
<x-card shadow="true" />
```

Maka card akan memunculkan tampilan dengan bayangan.

## Membuat Component Card Reusable

Akan tetapi ini belum selesai. Content yang ada didalamnya masih statis, belum bisa dipakai di banyak tempat. Semisal ada Card untuk kontak, ada Card untuk berita, ini masih belum reusable. Bagaimana caranya?

Kita bisa membuat agar card ini dapat menerima data dari luar untuk header, body, dan juga footernya.

### Langkah 1: Tambahkan Slot di Template

Pertama buat agar header, body, dan footernya dapat menerima data dengan kode `{{ $header }}`, `{{ $body }}` dan juga `{{ $footer }}`:
```blade
<div {{ $attributes->merge(['class' => 'p-6 bg-white rounded ' . ($shadow ? 'shadow-lg' : '')]) }}>
    <div class="mb-4">
        {{ $header }}
    </div>
    <div>
        {{ $body }}
    </div>
    <div class="mt-4">
        {{ $footer }}
    </div>
</div>
```

### Langkah 2: Kirim Data dari Halaman Lain

Kemudian kita bisa gunakan card ini dengan data yang kita kirim dari halaman lain seperti ini:
```blade
<x-card shadow="true">
    <x-slot name="header">
        <h2 class="text-lg font-semibold">Ini adalah header1</h2>
    </x-slot>

    <x-slot name="body">
        <p>ini adalah body1</p>
    </x-slot>

    <x-slot name="footer">
        <span class="text-sm text-gray-500">Ini adalah footer1</span>
    </x-slot>
</x-card>
```

Contoh penggunaan lainnya:
```blade
<x-card shadow="true">
    <x-slot name="header">
        <h2 class="text-lg font-semibold">Ini adalah header 2</h2>
    </x-slot>

    <x-slot name="body">
        <p>ini adalah body 2</p>
    </x-slot>

    <x-slot name="footer">
        <span class="text-sm text-gray-500">Ini adalah footer 2</span>
    </x-slot>
</x-card>
```

## Membuat Setiap Card Memiliki Style yang Berbeda

### Langkah 1: Tambahkan Properti Class

Tambahkan data `$class` di file `app/View/Components/Card.php`:
```php
<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Card extends Component
{
    public $shadow;
    
    // tambahkan data class
    public $class;
     
    // di constructor tambahkan param class dengan default string kosong
    public function __construct($shadow = '', $class = '')
    {
        $this->shadow = $shadow;
        $this->class = $class;
    }

    public function render(): View|Closure|string
    {
        return view('components.card');
    }
}
```

### Langkah 2: Gunakan Props Class di Template

Tambahkan props class dan gunakan di atribut class pada html:
```blade
// ini juga ditambahkan $class
<div {{ $attributes->merge(['class' => 'rounded ' . $class . ' ' . ($shadow ? ' shadow-lg' : '')]) }}>
    <div class="mb-4">
        {{ $header }}
    </div>
    <div>
        {{ $body }}
    </div>
    <div class="mt-4">
        {{ $footer }}
    </div>
</div>
```

### Langkah 3: Gunakan Atribut Class saat Pemanggilan

Tambahkan atribut class pada pemanggilan component card:
```blade
<x-card shadow="true" class="flex p-5 justify-center items-center flex-col bg-amber-500">
    <x-slot name="header">
        <h2 class="text-lg font-semibold">Header Card 1</h2>
    </x-slot>

    <x-slot name="body">
        <p>Body Card 1</p>
    </x-slot>

    <x-slot name="footer">
        <span class="text-sm text-gray-500">Footer Card 1</span>
    </x-slot>
</x-card>
```

Dengan cara ini, setiap card dapat memiliki styling yang berbeda sesuai kebutuhan, sambil tetap menggunakan component yang sama dan konsisten.