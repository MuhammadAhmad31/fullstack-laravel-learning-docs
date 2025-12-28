---
sidebar_position: 6
---

# Single Action Controller dan Routes

**Single Action Controller** (atau **invokable controller**) di Laravel adalah controller yang hanya memiliki satu method, yaitu `__invoke()`. Tujuannya adalah untuk menangani **satu aksi saja** dalam sebuah controller.

## Kapan Menggunakan Single Action Controller?

Single Action Controller cocok digunakan ketika:
* Controller hanya melakukan **satu tugas spesifik**
* Tidak memerlukan multiple methods
* Ingin membuat kode lebih **focused** dan **clean**
* Mengikuti **Single Responsibility Principle**

Contoh use case:
- Mengirim email
- Mengupload file
- Export data
- Generate report
- Webhook handler
- Payment callback

## Membuat Single Action Controller

Untuk membuat single action controller, tuliskan ini di terminal:
```bash
php artisan make:controller SendMessageController --invokable
```

Perintah ini akan membuat file controller dengan hanya punya 1 function `__invoke()`:
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SendMessageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // Logic untuk mengirim pesan
    }
}
```

## Implementasi Logic di Controller

Berikut contoh implementasi lengkap:
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SendMessageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'message' => 'required|string|max:255',
        ]);

        // Logic mengirim pesan
        // Misalnya kirim ke queue, database, atau API eksternal
        $message = $validated['message'];
        
        // Simulasi pengiriman pesan
        // Mail::to('admin@example.com')->send(new MessageSent($message));
        
        // Redirect dengan pesan sukses
        return redirect()
            ->back()
            ->with('success', 'Pesan berhasil dikirim!');
    }
}
```

## Mendaftarkan Route

Kemudian pada routes tinggal panggil controller seperti ini:
```php
use App\Http\Controllers\SendMessageController;

Route::post('/send-message', SendMessageController::class)->name('send.message');
```

:::info Perbedaan dengan Controller Biasa
Pada controller biasa:
```php
Route::post('/send-message', [MessageController::class, 'send']);
```

Pada Single Action Controller:
```php
Route::post('/send-message', SendMessageController::class);
```

Tidak perlu menyebutkan nama method karena Laravel otomatis memanggil `__invoke()`.
:::

## Contoh Penggunaan di Blade
```blade
<form action="{{ route('send.message') }}" method="post">
    @csrf
    <div class="mb-4">
        <label for="message" class="block text-sm font-medium mb-2">
            Pesan
        </label>
        <input 
            type="text" 
            name="message" 
            id="message"
            placeholder="Masukkan pesan Anda" 
            class="w-full px-4 py-2 border rounded"
            required
        />
        @error('message')
            <span class="text-red-500 text-sm">{{ $message }}</span>
        @enderror
    </div>
    
    <button 
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
        Kirim Pesan
    </button>
</form>

@if(session('success'))
    <div class="mt-4 p-4 bg-green-100 text-green-700 rounded">
        {{ session('success') }}
    </div>
@endif
```

## Contoh Kasus Penggunaan Lainnya

### 1. Export Data ke Excel
```bash
php artisan make:controller ExportUsersController --invokable
```
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\UsersExport;
use Maatwebsite\Excel\Facades\Excel;

class ExportUsersController extends Controller
{
    public function __invoke(Request $request)
    {
        return Excel::download(new UsersExport, 'users.xlsx');
    }
}
```
```php
Route::get('/export/users', ExportUsersController::class)->name('users.export');
```

### 2. Upload File
```bash
php artisan make:controller UploadImageController --invokable
```
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadImageController extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('images', 'public');

        return redirect()
            ->back()
            ->with('success', 'Gambar berhasil diupload!')
            ->with('path', $path);
    }
}
```
```php
Route::post('/upload/image', UploadImageController::class)->name('image.upload');
```

### 3. Webhook Handler
```bash
php artisan make:controller WebhookPaymentController --invokable
```
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookPaymentController extends Controller
{
    public function __invoke(Request $request)
    {
        // Verifikasi signature
        // Process payment data
        
        Log::info('Payment webhook received', $request->all());

        // Update order status
        // Send notification
        
        return response()->json(['status' => 'success'], 200);
    }
}
```
```php
Route::post('/webhook/payment', WebhookPaymentController::class);
```

### 4. Generate Report
```bash
php artisan make:controller GenerateReportController --invokable
```
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PDF; // atau package lainnya

class GenerateReportController extends Controller
{
    public function __invoke(Request $request)
    {
        $data = [
            'title' => 'Laporan Penjualan',
            'date' => now()->format('d M Y'),
            'sales' => Sale::whereBetween('created_at', [
                $request->start_date,
                $request->end_date
            ])->get()
        ];

        $pdf = PDF::loadView('reports.sales', $data);
        
        return $pdf->download('laporan-penjualan.pdf');
    }
}
```
```php
Route::get('/reports/generate', GenerateReportController::class)->name('reports.generate');
```

## Perbandingan dengan Controller Biasa

### Controller Biasa (Multiple Actions)
```php
class MessageController extends Controller
{
    public function index() { }
    public function create() { }
    public function store() { }
    public function show($id) { }
    public function edit($id) { }
    public function update($id) { }
    public function destroy($id) { }
}
```

**Cocok untuk:** Operasi CRUD lengkap pada satu resource

### Single Action Controller
```php
class SendMessageController extends Controller
{
    public function __invoke(Request $request) { }
}
```

**Cocok untuk:** Satu aksi spesifik yang tidak berhubungan dengan CRUD

## Keuntungan Single Action Controller

1. **Single Responsibility** - Setiap controller fokus pada satu tugas
2. **Readability** - Lebih mudah dibaca dan dipahami
3. **Maintainability** - Lebih mudah di-maintain karena scope kecil
4. **Testability** - Lebih mudah untuk di-test
5. **Organization** - Struktur project lebih terorganisir
6. **Naming** - Nama controller langsung menjelaskan fungsinya

## Best Practices

### ✅ Good - Gunakan Single Action Controller
```php
// Jelas dan spesifik
SendEmailVerificationController
GenerateInvoiceController
ProcessPaymentController
ExportReportController
UploadAvatarController
```

### ❌ Bad - Jangan Gunakan untuk CRUD
```php
// Lebih baik gunakan Resource Controller
UserIndexController  // ❌
UserStoreController  // ❌
UserUpdateController // ❌
UserDeleteController // ❌

// Gunakan ini:
UserController dengan resource methods // ✅
```

## Middleware pada Single Action Controller

Kamu bisa menambahkan middleware langsung di route atau di constructor:

### Di Route:
```php
Route::post('/admin/report', GenerateReportController::class)
    ->middleware(['auth', 'admin'])
    ->name('admin.report.generate');
```

### Di Constructor:
```php
class GenerateReportController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'admin']);
    }

    public function __invoke(Request $request)
    {
        // Generate report logic
    }
}
```

## Tips Naming Convention

Gunakan nama yang deskriptif dan menggunakan kata kerja:
```php
// ✅ Good naming
SendEmailController
UploadImageController
GenerateReportController
ProcessPaymentController
ExportUsersController
DownloadInvoiceController

// ❌ Bad naming
EmailController
ImageController
ReportController
PaymentController
```

:::tip Kapan Menggunakan Single Action vs Resource Controller?
- **Single Action**: Untuk aksi standalone yang tidak berhubungan dengan CRUD (send email, export, upload, webhook)
- **Resource Controller**: Untuk operasi CRUD lengkap pada satu resource (User, Post, Product)
:::