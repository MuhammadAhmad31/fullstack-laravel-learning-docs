---
sidebar_position: 4
---

# Laravel CRUD API Tutorial

## 1. Create CRUD API Without Standardization

### Step 1 --- Create Laravel Project

``` bash
composer create-project laravel/laravel crud-api
cd crud-api
```

### Step 2 --- Create Model, Migration, Controller

``` bash
php artisan make:model Product -mcr --api
```

### Step 3 --- Migration

``` php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->integer('price');
    $table->timestamps();
});
```

### Step 4 --- Routes

``` php
Route::apiResource('products', ProductController::class);
```

### Step 5 --- Non-standardized CRUD Controller

``` php
public function index() {
    return Product::all();
}

public function store(Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|integer',
    ]);

    return Product::create($validated);
}
```

------------------------------------------------------------------------

## 2. Create CRUD API With Standardized Response

### Step 1 --- Create Helper

`app/Helpers/ApiResponse.php`

``` php
class ApiResponse {
    public static function success($data = null, $message = 'Success', $code = 200) {
        return response()->json([
            'code' => $code,
            'message' => $message,
            'data' => $data,
        ], $code);
    }
}
```

### Step 2 --- Add to composer.json

``` json
"files": ["app/Helpers/ApiResponse.php"]
```

### Step 3 --- Standardized Controller

``` php
public function index() {
    return ApiResponse::success(Product::all(), 'List products');
}

public function store(Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|integer',
    ]);

    return ApiResponse::success(Product::create($validated), 'Product created', 201);
}
```

------------------------------------------------------------------------

## End of Tutorial