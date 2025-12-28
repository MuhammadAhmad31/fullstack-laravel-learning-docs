---
sidebar_position: 5
---

# JWT Authentication di Laravel 12 - Panduan Lengkap

## 1. Instal Laravel & JWT Auth Package


### Install JWT Package

```bash
composer require tymon/jwt-auth
```

### Publish Config

```bash
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
```

### Generate JWT Secret Key

```bash
php artisan jwt:secret
```

---

## 2. Buat Middleware JWT

### Generate Middleware

```bash
php artisan make:middleware JwtMiddleware
```

### Edit File Middleware

**Path:** `app/Http/Middleware/JwtMiddleware.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtMiddleware
{
    public function handle($request, Closure $next)
    {
        try {
            JWTAuth::parseToken()->authenticate();
        } catch (Exception $e) {
            return response()->json([
                'message' => 
                    $e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException ? 'Token expired' :
                    ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException ? 'Token invalid' : 'Token not found')
            ], 401);
        }

        return $next($request);
    }
}
```

---

## 3. Daftarkan Middleware di `bootstrap/app.php`

**Laravel 12 menggunakan cara baru untuk registrasi middleware**

**Path:** `bootstrap/app.php`

```php
use App\Http\Middleware\JwtMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
    )
    ->withMiddleware(function ($middleware) {
        $middleware->alias([
            'jwt.verify' => JwtMiddleware::class,
        ]);
    })
    ->create();
```

---

## 4. Tambahkan `JWTSubject` ke Model User

### Edit Model User

**Path:** `app/Models/User.php`

**Tambahkan:**
1. `implements JWTSubject`
2. Dua method wajib: `getJWTIdentifier()` dan `getJWTCustomClaims()`

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
```

---

## 5. Buat Auth Controller (Login + Register)

### Generate Controller

```bash
php artisan make:controller AuthApiController
```

### Edit Controller

**Path:** `app/Http/Controllers/AuthApiController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthApiController extends Controller
{
    public function register(Request $request)
    {
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User registered']);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['token' => $token]);
    }
}
```

---

## 6. Buat Route API + Lindungi Resource Products

### Edit File Routes

**Path:** `routes/api.php`

```php
use App\Http\Controllers\AuthApiController as AuthController;
use App\Http\Controllers\ProductController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('jwt.verify')->group(function () {
    Route::apiResource('products', ProductController::class)->names([
        'index' => 'products.list',
        'show' => 'products.detail',
        'store' => 'products.create',
        'update' => 'products.update',
        'destroy' => 'products.delete',
    ]);
});
```

---

## 🔥 Testing API

### Register User

```bash
POST http://localhost:8000/api/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

### Login

```bash
POST http://localhost:8000/api/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Akses Protected Route

```bash
GET http://localhost:8000/api/products
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

---