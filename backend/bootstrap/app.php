<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Asegúrate de que el middleware de CORS se ejecute primero si es necesario
        $middleware->prepend(HandleCors::class);

        // Configura los middleware específicos para la API o para todos los grupos
        $middleware->api(append: [
            EnsureFrontendRequestsAreStateful::class,
        ]);

        // Si prefieres usarlo en el grupo 'web' para la autenticación SPA:
        $middleware->web(append: [
             EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
