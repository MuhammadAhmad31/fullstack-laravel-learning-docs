---
sidebar_position: 1
---

# Pengenalan Tutorial

Mari belajar **Laravel 12 dengan Blade dan Tailwind CSS**.

## Memulai

Mulai dengan **membuat proyek Laravel baru**.

Atau **coba Laravel langsung** dengan **[Laravel Bootcamp](https://bootcamp.laravel.com)**.

### Yang Anda butuhkan

- [PHP](https://www.php.net/downloads) versi 8.2 atau lebih tinggi
- [Composer](https://getcomposer.org/) - pengelola dependensi PHP
- [Node.js](https://nodejs.org/en/download/) versi 20.0 atau lebih tinggi (untuk Tailwind CSS):
  - Saat menginstal Node.js, Anda disarankan untuk mencentang semua kotak yang berhubungan dengan dependensi.

## Membuat situs baru

Buat situs Laravel baru menggunakan **Laravel installer**.

Pertama, instal Laravel installer secara global melalui Composer:
```bash
composer global require laravel/installer
```

Kemudian buat proyek Laravel baru:
```bash
laravel new my-website
```

Anda dapat mengetik perintah ini di Command Prompt, Powershell, Terminal, atau terminal terintegrasi lainnya dari code editor Anda.

Perintah ini juga menginstal semua dependensi PHP yang diperlukan untuk menjalankan Laravel.

## Instal Dependensi Node

Navigasi ke direktori proyek Anda dan instal dependensi Node.js (termasuk Tailwind CSS):
```bash
cd my-website
npm install
```

Laravel 12 sudah dilengkapi dengan Tailwind CSS yang telah dikonfigurasi. Perintah `npm install` menginstal semua dependensi yang diperlukan termasuk Tailwind CSS dan Vite.

## Menjalankan situs Anda

Jalankan server pengembangan:
```bash
composer run dev
```

Perintah `composer run dev` menjalankan aplikasi Laravel dan server pengembangan Vite secara bersamaan. Situs Anda akan siap dilihat di http://localhost:8000/.

Buka `resources/views/welcome.blade.php` dan edit beberapa baris: situs akan **dimuat ulang secara otomatis** dan menampilkan perubahan Anda dengan styling Tailwind CSS.