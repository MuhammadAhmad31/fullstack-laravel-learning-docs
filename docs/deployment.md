---
sidebar_position: 8
---

# 🏁 LANGKAH DEPLOY LARAVEL DI VPS (TRAINER / MURID)
masa percobaan pelatihan hanya 1 bulan jadi manfaatkan prakteknya sebaik mungkin

## Masuk ke vps lewat terminal ssh
untuk user dan password ssh bisa tanya ke trainer git learning fullstack (Kak Muhammad).

```bash
ssh {user}@202.10.34.104
```

contoh 

```bash
ssh murid1@202.10.34.104
```

kemudian masukkan password yang didapat dari trainer

## 1️⃣ Masuk ke folder laravel
```bash
cd ~/laravel
```

---

## 2️⃣ Clone repo Laravel Project teman"
contoh

pakai symbol titik (.) ya ketika clone

contoh
```bash
git clone https://github.com/MuhammadAhmad31/fullstack-laravel-learning.git .
```

> ⚠️ Titik `.` penting supaya clone langsung ke folder laravel, bukan bikin folder baru.

Cek:
```bash
ls
```
Harus muncul file/folder Laravel (`app`, `artisan`, `composer.json`, dll).

---

## 3️⃣ Buat symlink public_html → laravel/public
```bash
# Hapus dulu public_html lama kalau ada
rm -rf ~/public_html

# Buat symlink baru
ln -s ~/laravel/public ~/public_html
```

Cek:
```bash
ls -l ~
```
Harus muncul:
```
public_html -> /home/trainer/laravel/public
laravel
```

---

## 4️⃣ Install dependency Composer & npm
```bash
cd ~/laravel
composer install
npm install
```

> ⚠️ npm install optional kalau repo ada frontend / vite / js packages.

---

## 5️⃣ Copy .env.example ke .env
```bash
cp .env.example .env
```

---

## 6️⃣ Sesuaikan .env
Buka `.env` dengan nano atau vim:
```bash
nano .env
```

Ubah DB sesuai user:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=trainer_db
DB_USERNAME=trainer_user
DB_PASSWORD=Muhammad31.
```
> Ganti sesuai murid1–8 kalau ini untuk mereka.

Simpan dan keluar (`Ctrl+O` lalu `Ctrl+X` di nano).

---

## 7️⃣ Generate Laravel APP key
```bash
php artisan key:generate
```

---

## 8️⃣ (Opsional) Migrate DB
```bash
php artisan migrate
```

---

## 9️⃣ Bersihkan cache (selalu aman)
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

---

## 10️⃣ Cek di browser
Buka:
```
http://IP_VPS:PORT
```
- PORT bisa default 80 jika Nginx bind langsung, atau port khusus per murid.
- Halaman Laravel harus muncul.

---

## ✅ Catatan Penting
- Jangan clone repo ke `public_html` karena nanti akan diakses secara public, .env, code dst jika dimasukkan public_html akan bisa dilihat semua orang
- Symlink selalu dari `laravel/public` → `public_html`
- jika ada error Permission `storage/bootstrap/cache` harus writable oleh PHP (`775`) bisa hubungi trainer
- DB user + password per murid berbeda bisa hubungi trainer

