<?php

use Illuminate\Support\Facades\Route;
use App\Models\Contacto;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Mostrar el formulario
Route::get('/formulario', function () {
    return view('formulario');
});

// Procesar el formulario  
Route::post('/formulario', function () {
    $datos = request()->only(['nombre', 'email', 'mensaje']);
    Contacto::create($datos);
    return "¡Contacto guardado exitosamente!"; // Mostrar los datos recibidos en la consola del navegador

});
