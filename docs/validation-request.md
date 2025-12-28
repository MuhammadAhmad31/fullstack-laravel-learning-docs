---
sidebar_position: 3
---

# Validation Request

## Apa Itu Validasi?

**Validasi** adalah proses memastikan data yang dikirim user benar, lengkap, dan sesuai aturan sebelum disimpan ke database atau diproses lebih lanjut.

### Contoh Validasi:
* Email harus format email yang valid
* Password minimal 8 karakter
* Harga harus berupa angka
* Judul harus unik
* Tanggal harus format date

Laravel menyediakan fitur validasi otomatis yang sangat mudah digunakan.

## Validasi Paling Dasar Menggunakan `$request->validate()`

### Step 1 — Buat Route

File: `routes/web.php`
```php
use App\Http\Controllers\PostController;

Route::get('/post/create', [PostController::class, 'create']);
Route::post('/post/store', [PostController::class, 'store']);
```

### Step 2 — Buat Controller
```bash
php artisan make:controller PostController
```

Edit file `app/Http/Controllers/PostController.php`:
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostController extends Controller
{
    public function create()
    {
        return view('post-create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|min:5|max:100',
            'body'  => 'required|min:10',
        ]);

        // Data sudah tervalidasi, aman untuk diproses
        // Post::create($validated);

        return "Data valid! 🎉";
    }
}
```

### Step 3 — Buat View Form

File: `resources/views/post-create.blade.php`
```blade
<!DOCTYPE html>
<html>
<head>
    <title>Buat Post</title>
</head>
<body>

<h2>Buat Post</h2>

@if ($errors->any())
    <div style="color:red; background:#ffe6e6; padding:10px; margin-bottom:15px;">
        <strong>Terjadi kesalahan:</strong>
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="/post/store" method="POST">
    @csrf

    <label>Title:</label><br>
    <input type="text" name="title" value="{{ old('title') }}" style="width:300px;">
    @error('title')
        <span style="color:red;">{{ $message }}</span>
    @enderror
    <br><br>

    <label>Body:</label><br>
    <textarea name="body" rows="5" style="width:300px;">{{ old('body') }}</textarea>
    @error('body')
        <span style="color:red;">{{ $message }}</span>
    @enderror
    <br><br>

    <button type="submit">Simpan</button>
</form>

</body>
</html>
```

**Penjelasan:**
* Form akan menampilkan error otomatis jika validasi gagal
* Input yang sudah diisi tidak hilang (karena `old()`)
* `@error` directive untuk menampilkan error per field

## Validasi Menggunakan Form Request (Lebih Rapi)

Cara ini sangat **disarankan untuk project menengah–besar**.

### Step 1 — Membuat Form Request
```bash
php artisan make:request StorePostRequest
```

### Step 2 — Isi Aturan Validasi

File: `app/Http/Requests/StorePostRequest.php`
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // harus true untuk mengizinkan
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => 'required|min:5|max:100',
            'body'  => 'required|min:10',
        ];
    }
}
```

### Step 3 — Pakai di Controller

File `app/Http/Controllers/PostController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;

class PostController extends Controller
{
    public function create()
    {
        return view('post-create');
    }

    public function store(StorePostRequest $request)
    {
        // Data otomatis sudah tervalidasi
        // $validated = $request->validated();
        
        return "Data valid dari Form Request! 🎉";
    }
}
```

### Keuntungan Form Request:
* ✅ Lebih rapi dan terorganisir
* ✅ Bisa custom message
* ✅ Bisa custom attribute
* ✅ Bisa persiapan data sebelum validasi
* ✅ Reusable di berbagai controller

## Custom Pesan Error

Di `app/Http/Requests/StorePostRequest.php`:
```php
public function messages(): array
{
    return [
        'title.required' => 'Judul wajib diisi!',
        'title.min' => 'Judul minimal :min karakter.',
        'title.max' => 'Judul maksimal :max karakter.',
        'body.required'  => 'Isi artikel tidak boleh kosong.',
        'body.min' => 'Isi artikel minimal :min karakter.',
    ];
}
```

## Custom Nama Atribut
```php
public function attributes(): array
{
    return [
        'title' => 'judul artikel',
        'body'  => 'isi artikel',
    ];
}
```

Dengan custom attribute, pesan error otomatis menjadi lebih natural:
- Sebelum: "The title field is required"
- Sesudah: "Judul artikel wajib diisi"

## Aturan Validasi yang Sering Dipakai

| Rule | Keterangan | Contoh |
|------|------------|--------|
| `required` | Wajib diisi | `'name' => 'required'` |
| `email` | Harus format email | `'email' => 'required\|email'` |
| `min:n` | Minimal n karakter | `'password' => 'min:8'` |
| `max:n` | Maksimal n karakter | `'title' => 'max:100'` |
| `unique:table,column` | Harus unik di database | `'email' => 'unique:users,email'` |
| `confirmed` | Harus ada field `_confirmation` | `'password' => 'confirmed'` |
| `numeric` | Harus angka | `'age' => 'numeric'` |
| `integer` | Harus integer | `'quantity' => 'integer'` |
| `date` | Harus format tanggal | `'birthdate' => 'date'` |
| `in:foo,bar` | Harus salah satu dari list | `'role' => 'in:admin,user'` |
| `alpha` | Hanya huruf | `'name' => 'alpha'` |
| `alpha_num` | Huruf dan angka | `'username' => 'alpha_num'` |
| `between:min,max` | Antara min dan max | `'age' => 'between:18,65'` |
| `boolean` | true/false/1/0 | `'agree' => 'boolean'` |
| `image` | Harus file gambar | `'photo' => 'image'` |
| `mimes:jpg,png` | Tipe file tertentu | `'file' => 'mimes:pdf,docx'` |
| `nullable` | Boleh kosong | `'phone' => 'nullable\|numeric'` |

## Contoh Kasus Nyata: Validasi Registrasi User

### Aturan:
* Username wajib, min 4 karakter
* Email wajib & unik
* Password wajib min 8
* Konfirmasi password harus sama
```php
$request->validate([
    'username' => 'required|min:4|alpha_num',
    'email' => 'required|email|unique:users,email',
    'password' => 'required|min:8|confirmed',
]);
```

### Di Form HTML harus ada:
```blade
<input type="text" name="username" value="{{ old('username') }}">
@error('username')<span>{{ $message }}</span>@enderror

<input type="email" name="email" value="{{ old('email') }}">
@error('email')<span>{{ $message }}</span>@enderror

<input type="password" name="password">
@error('password')<span>{{ $message }}</span>@enderror

<input type="password" name="password_confirmation">
```

:::info Catatan `confirmed`
Rule `confirmed` akan mencari field dengan nama `{field}_confirmation`. Jadi untuk `password` harus ada `password_confirmation`.
:::

## Validasi File Upload
```php
$request->validate([
    'photo' => 'required|image|mimes:jpg,png,jpeg|max:2048',
    'document' => 'required|file|mimes:pdf,docx|max:5120',
]);
```

**Penjelasan:**
- `image` - Harus berupa gambar
- `mimes:jpg,png` - Hanya menerima extension tertentu
- `max:2048` - Maksimal 2MB (dalam kilobytes)

### Upload File di Controller:
```php
public function store(Request $request)
{
    $request->validate([
        'photo' => 'required|image|max:2048',
    ]);

    $path = $request->file('photo')->store('photos', 'public');
    
    // Simpan $path ke database
}
```

## Validasi Array (Data Banyak)

Ketika mengirim multiple data dengan nama field yang sama:
```php
$request->validate([
    'tags' => 'required|array',
    'tags.*' => 'string|min:2|max:20',
]);
```

### Form HTML:
```blade
<input type="text" name="tags[]" placeholder="Tag 1">
<input type="text" name="tags[]" placeholder="Tag 2">
<input type="text" name="tags[]" placeholder="Tag 3">
```

### Validasi Array Nested:
```php
$request->validate([
    'users' => 'required|array',
    'users.*.name' => 'required|string',
    'users.*.email' => 'required|email',
]);
```

## Validasi dengan Regex
```php
$request->validate([
    'username' => ['required', 'regex:/^[a-zA-Z0-9_]+$/'],
    'phone' => ['required', 'regex:/^[0-9]{10,13}$/'],
]);
```

## Validasi Conditional

### Sometimes (Validasi jika field ada):
```php
$request->validate([
    'email' => 'sometimes|email',
]);
```

### Required If (Wajib jika kondisi terpenuhi):
```php
$request->validate([
    'reason' => 'required_if:status,rejected',
]);
```

### Required With (Wajib jika field lain ada):
```php
$request->validate([
    'phone' => 'required_with:address',
]);
```

## Menampilkan Error di Blade

### Semua Error:
```blade
@if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif
```

### Error Per Field:
```blade
<input type="text" name="title" value="{{ old('title') }}">
@error('title')
    <span class="text-red-500">{{ $message }}</span>
@enderror
```

### Cek Apakah Ada Error:
```blade
@if ($errors->has('email'))
    <span>{{ $errors->first('email') }}</span>
@endif
```

## Custom Validation Rule

Jika rule bawaan tidak cukup, buat custom rule:
```bash
php artisan make:rule Uppercase
```

File: `app/Rules/Uppercase.php`
```php
<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Uppercase implements Rule
{
    public function passes($attribute, $value)
    {
        return strtoupper($value) === $value;
    }

    public function message()
    {
        return ':attribute harus huruf kapital semua.';
    }
}
```

**Penggunaan:**
```php
use App\Rules\Uppercase;

$request->validate([
    'code' => ['required', new Uppercase],
]);
```

## After Validation Hook

Di Form Request, tambahkan method `withValidator`:
```php
public function withValidator($validator)
{
    $validator->after(function ($validator) {
        if ($this->somethingElseIsInvalid()) {
            $validator->errors()->add('field', 'Something is wrong!');
        }
    });
}
```

## Prepare for Validation

Manipulasi data sebelum validasi:
```php
protected function prepareForValidation()
{
    $this->merge([
        'slug' => Str::slug($this->title),
    ]);
}
```

## Tips Best Practices

:::tip Validation Best Practices
1. **Gunakan Form Request** untuk validasi kompleks
2. **Pisahkan logic validasi** dari controller
3. **Custom message** untuk UX yang lebih baik
4. **Gunakan `old()`** agar user tidak perlu input ulang
5. **Validasi di frontend juga** untuk UX, tapi tetap validasi di backend untuk security
6. **Gunakan `nullable`** jika field memang optional
7. **Test validasi** dengan berbagai input untuk memastikan keamanan
:::

## Troubleshooting

### Error tidak muncul?
Pastikan ada `@csrf` di form dan method POST

### Data hilang setelah error?
Gunakan `old('field_name')` di value input

### Custom message tidak muncul?
Cek typo di nama field dan rule di method `messages()`

### Validasi tidak jalan?
Pastikan `authorize()` return `true` di Form Request

:::warning Security Warning
**SELALU validasi di backend**, jangan hanya mengandalkan validasi frontend. Frontend validation hanya untuk UX, backend validation untuk security.
:::