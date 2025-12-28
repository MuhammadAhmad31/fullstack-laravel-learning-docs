---
sidebar_position: 6
---

# Panduan Integrasi External API dengan Laravel

## 1. Persiapan

### 1.1 Registrasi RajaOngkir

1. Daftar di [RajaOngkir](https://rajaongkir.com/)
2. Dapatkan API Key dari dashboard
3. Pilih paket sesuai kebutuhan (Starter/Basic/Pro)

### 1.2 Konfigurasi Environment

Tambahkan di file `.env`:

```env
RAJAONGKIR_BASE_URL=https://pro.rajaongkir.com/api
RAJAONGKIR_API_KEY=your_rajaongkir_api_key_here
RAJAONGKIR_ORIGIN_CITY_ID=501
API_TOKEN=your_custom_api_token_here
```

### 1.3 Update Config

Buat file `config/rajaongkir.php`:

```php
<?php

return [
    'base_url' => env('RAJAONGKIR_BASE_URL'),
    'cost_api_key' => env('RAJAONGKIR_API_KEY'),
    'origin_city_id' => env('RAJAONGKIR_ORIGIN_CITY_ID'),
];
```

## 2. Struktur Backend

### 2.1 Service Layer

Buat file `app/Services/RajaOngkirService.php`:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RajaOngkirService
{
    protected $baseUrl;
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('rajaongkir.base_url');
        $this->apiKey = config('rajaongkir.cost_api_key');
    }

    private function client()
    {
        return Http::withHeaders([
            'key' => $this->apiKey
        ]);
    }

    public function getProvinces()
    {
        $response = $this->client()->get("{$this->baseUrl}/destination/province");
        return $response->json();
    }

    public function getCities($provinceId)
    {
        $response = $this->client()->get("{$this->baseUrl}/destination/city/{$provinceId}");
        return $response->json();
    }

    public function getDistrict($cityId)
    {
        $response = $this->client()->get("{$this->baseUrl}/destination/district/{$cityId}");
        return $response->json();
    }

    public function getSubdistrict($districtId)
    {
        $response = $this->client()->get("{$this->baseUrl}/destination/subdistrict/{$districtId}");
        return $response->json();
    }

    public function checkCost($origin, $destination, $weight, $courier)
    {
        $response = $this->client()
            ->asForm()
            ->post("{$this->baseUrl}/calculate/district/domestic-cost", [
                'origin'        => $origin,
                'destination'   => $destination,
                'weight'        => $weight,
                'courier'       => $courier,
                'price'         => 'lowest'
            ]);

        return $response->json();
    }
}
```

### 2.2 Controller

Buat file `app/Http/Controllers/RajaOngkirController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Services\RajaOngkirService;
use App\Helpers\ApiResponse;

class RajaOngkirController extends Controller
{
    protected $rajaOngkir;

    public function __construct(RajaOngkirService $service)
    {
        $this->rajaOngkir = $service;
    }

    public function provinces()
    {
        $res = $this->rajaOngkir->getProvinces();
        return ApiResponse::success($res['data'], "Provinces retrieved successfully");
    }

    public function cities($provinceId)
    {
        $res = $this->rajaOngkir->getCities($provinceId);
        return ApiResponse::success($res['data'], "Cities retrieved successfully");
    }

    public function district($cityId)
    {
        $res = $this->rajaOngkir->getDistrict($cityId);
        return ApiResponse::success($res['data'], "Districts retrieved successfully");
    }

    public function subdistrict($districtId)
    {
        $res = $this->rajaOngkir->getSubdistrict($districtId);
        return ApiResponse::success($res['data'], "Subdistricts retrieved successfully");
    }

    public function cost()
    {
        request()->validate([
            'origin' => 'required|integer',
            'destination' => 'required|integer',
            'weight' => 'required|integer',
            'courier' => 'required|string'
        ]);

        $res = $this->rajaOngkir->checkCost(
            request('origin'),
            request('destination'),
            request('weight'),
            request('courier')
        );

        return ApiResponse::success($res['data'], "Shipping cost calculated successfully");
    }
}
```

### 2.3 Routes

Tambahkan di `routes/api.php`:

```php
use App\Http\Controllers\RajaOngkirController;

Route::get('provinces', [RajaOngkirController::class,'provinces']);
Route::get('cities/{provinceId}',[RajaOngkirController::class, 'cities']);
Route::get('district/{cityId}', [RajaOngkirController::class,'district']);
Route::get('subdistrict/{districtId}',[RajaOngkirController::class, 'subdistrict']);
Route::post('cost', [RajaOngkirController::class, 'cost']);
```

## 3. Frontend Integration

### 3.1 Blade View

Buat file `resources/views/rajaongkir/check.blade.php` dan copy body HTML ini.

```php
<body class="p-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Cek Ongkir</h1>

    <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="border border-black p-4">
            <h3 class="font-bold mb-3">Asal</h3>
            <select id="originProvince" class="w-full p-2 border border-black mb-2">
                <option value="">Pilih Provinsi</option>
            </select>
            <select id="originCity" class="w-full p-2 border border-black mb-2" disabled>
                <option value="">Pilih Kota</option>
            </select>
            <select id="originDistrict" class="w-full p-2 border border-black" disabled>
                <option value="">Pilih Kecamatan</option>
            </select>
        </div>

        <div class="border border-black p-4">
            <h3 class="font-bold mb-3">Tujuan</h3>
            <select id="destProvince" class="w-full p-2 border border-black mb-2">
                <option value="">Pilih Provinsi</option>
            </select>
            <select id="destCity" class="w-full p-2 border border-black mb-2" disabled>
                <option value="">Pilih Kota</option>
            </select>
            <select id="destDistrict" class="w-full p-2 border border-black" disabled>
                <option value="">Pilih Kecamatan</option>
            </select>
        </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4 mb-4">
        <input type="number" id="weight" class="w-full p-2 border border-black" placeholder="Berat (gram)" value="1000">
        <select id="courier" class="w-full p-2 border border-black">
            <option value="jne">JNE</option>
            <option value="sicepat">SiCepat</option>
            <option value="anteraja">AnterAja</option>
        </select>
    </div>

    <button id="checkBtn" class="w-full bg-black text-white p-2 hover:bg-gray-800">Cek Ongkir</button>
    <div id="result" class="mt-4"></div>

<script>
const API = '/api/rajaongkir';
const get = async (url) => (await fetch(url)).json();
const post = async (url, data) => (await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
})).json();

const fillSelect = (id, items, keyId, keyName) => {
    const sel = document.getElementById(id);
    sel.innerHTML = '<option value="">Pilih</option>';
    items.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item[keyId];
        opt.textContent = item[keyName];
        sel.appendChild(opt);
    });
};

const loadProvinces = async (id) => {
    const data = await get(`${API}/provinces`);
    if (data.data) fillSelect(id, data.data, 'id', 'name');
};

const loadCities = async (provId, selId) => {
    const data = await get(`${API}/cities/${provId}`);
    if (data.data) fillSelect(selId, data.data, 'id', 'name');
};

const loadDistricts = async (cityId, selId) => {
    const data = await get(`${API}/district/${cityId}`);
    if (data.data) fillSelect(selId, data.data, 'id', 'name');
};

document.getElementById('originProvince').onchange = async function() {
    const city = document.getElementById('originCity');
    const dist = document.getElementById('originDistrict');
    if (this.value) {
        city.disabled = false;
        await loadCities(this.value, 'originCity');
    } else {
        city.disabled = dist.disabled = true;
        city.innerHTML = dist.innerHTML = '<option value="">Pilih</option>';
    }
};

document.getElementById('originCity').onchange = async function() {
    const dist = document.getElementById('originDistrict');
    if (this.value) {
        dist.disabled = false;
        await loadDistricts(this.value, 'originDistrict');
    } else {
        dist.disabled = true;
        dist.innerHTML = '<option value="">Pilih</option>';
    }
};

document.getElementById('destProvince').onchange = async function() {
    const city = document.getElementById('destCity');
    const dist = document.getElementById('destDistrict');
    if (this.value) {
        city.disabled = false;
        await loadCities(this.value, 'destCity');
    } else {
        city.disabled = dist.disabled = true;
        city.innerHTML = dist.innerHTML = '<option value="">Pilih</option>';
    }
};

document.getElementById('destCity').onchange = async function() {
    const dist = document.getElementById('destDistrict');
    if (this.value) {
        dist.disabled = false;
        await loadDistricts(this.value, 'destDistrict');
    } else {
        dist.disabled = true;
        dist.innerHTML = '<option value="">Pilih</option>';
    }
};

document.getElementById('checkBtn').onclick = async function() {
    const origin = document.getElementById('originDistrict').value;
    const destination = document.getElementById('destDistrict').value;
    const weight = document.getElementById('weight').value;
    const courier = document.getElementById('courier').value;
    const result = document.getElementById('result');

    if (!origin || !destination || !weight) {
        result.innerHTML = '<div class="border border-black p-2">Lengkapi semua data</div>';
        return;
    }

    result.innerHTML = '<div class="border border-black p-2">Loading...</div>';

    try {
        const data = await post(`${API}/cost`, {origin, destination, weight, courier});

        if (data.data && data.data.length > 0) {
            let html = '<div class="border border-black">';
            data.data.forEach(s => {
                html += `<div class="p-3 border-b border-black last:border-b-0">
                    <div class="font-bold">${s.service}</div>
                    <div class="text-sm">${s.description}</div>
                    <div class="font-bold mt-1">Rp ${s.cost.toLocaleString('id-ID')} <span class="font-normal text-sm">(${s.etd})</span></div>
                </div>`;
            });
            html += '</div>';
            result.innerHTML = html;
        } else {
            result.innerHTML = '<div class="border border-black p-2">Tidak ada layanan tersedia</div>';
        }
    } catch (error) {
        result.innerHTML = '<div class="border border-black p-2">Gagal mengecek ongkir</div>';
    }
};

loadProvinces('originProvince');
loadProvinces('destProvince');
</script>
</body>
```

### 3.2 Route untuk View

Tambahkan di `routes/web.php`:

```php
Route::get('/cek-ongkir', function () {
    return view('rajaongkir.check');
});
```

## 4. Testing

### 4.1 Test API Endpoints

```bash
# Get Provinces
curl -H "Authorization: Bearer your_api_token" http://localhost/api/rajaongkir/provinces

# Get Cities
curl -H "Authorization: Bearer your_api_token" http://localhost/api/rajaongkir/cities/9

# Get Districts
curl -H "Authorization: Bearer your_api_token" http://localhost/api/rajaongkir/district/152

# Check Cost
curl -X POST -H "Authorization: Bearer your_api_token" \
     -H "Content-Type: application/json" \
     -d '{"origin":1234,"destination":5678,"weight":1000,"courier":"jne"}' \
     http://localhost/api/rajaongkir/cost
```

### 4.2 Test Frontend

1. Akses: `http://localhost/cek-ongkir`
2. Pilih provinsi, kota, dan kecamatan
3. Masukkan berat paket
4. Klik "Cek Ongkir"

## 7. Referensi

-   [Dokumentasi RajaOngkir](https://rajaongkir.com/docs/)