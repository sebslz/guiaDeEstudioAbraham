<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function store(Request $request)
    {
        // Validar los datos recibidos
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'edad' => 'required|integer|min:1|max:120'
        ]);

        // Simular guardado (por ahora no usamos base de datos)
        $usuario = [
            'id' => rand(1, 1000),
            'nombre' => $validatedData['nombre'],
            'email' => $validatedData['email'],
            'edad' => $validatedData['edad'],
            'created_at' => now()->toDateTimeString()
        ];

        // Responder con JSON
        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente',
            'data' => $usuario
        ], 201);
    }
}
