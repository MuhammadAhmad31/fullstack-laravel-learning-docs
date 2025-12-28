---
sidebar_position: 1
---

# Memanfaatkan Component dalam Kode Laravel

Pada banyak proyek Laravel, terutama yang dikerjakan dalam tim atau dikembangkan dalam waktu lama, kode Blade sering kali:

* ditulis berulang-ulang pada banyak file,
* sulit dipelihara karena tidak ada pemisahan UI yang jelas,
* tidak mengikuti prinsip reusable component,
* bercampur dengan banyak class Tailwind yang mengacaukan struktur kode,
* menyulitkan konsistensi UI antar halaman.

Kondisi ini menyebabkan frontend menjadi tidak konsisten, sulit dibaca, sulit di-maintain, dan rawan bug ketika satu perubahan UI harus dilakukan pada banyak file.

Untuk mengatasi hal tersebut, Laravel menyediakan **Blade Components**, dan dikombinasikan dengan **Tailwind CSS**, UI dapat dibuat lebih rapi, reusable, modular, dan mudah dirawat.

## Tujuan Dokumentasi

Dokumentasi ini dibuat untuk:

1. Menstandarkan implementasi Laravel Components di seluruh proyek.
2. Menjadikan struktur UI lebih terorganisir, reusable, dan scalable.
3. Menghilangkan duplikasi kode Blade dan Tailwind.
4. Mempermudah pengembangan fitur baru tanpa merusak tampilan yang sudah ada.
5. Mempercepat workflow frontend dan backend.

## Pembuatan Component dan Penggunaan Tailwind

### Membuat Component Baru

Gunakan perintah bawaan Laravel, tuliskan di terminal:
```bash
php artisan make:component NamaComponent
```

Perintah ini otomatis membuat dua file baru:
```
app/View/Components/NamaComponent.php
resources/views/components/nama-component.blade.php
```

### Penjelasan File

- **`app/View/Components/NamaComponent.php`** - Class PHP yang menangani logika component
- **`resources/views/components/nama-component.blade.php`** - Template Blade yang berisi struktur HTML dan Tailwind CSS

### Contoh Penggunaan

Setelah component dibuat, Anda dapat menggunakannya di file Blade mana pun dengan syntax:
```blade
<x-nama-component />
```

Atau dengan passing data:
```blade
<x-nama-component :title="$title" :description="$description" />
```