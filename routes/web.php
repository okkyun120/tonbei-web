<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\TBDB001Controller;
use App\Http\Controllers\TBDC001Controller;
use App\Http\Controllers\TBDC002Controller;

use App\Http\Controllers\TBDM001Controller;
use App\Http\Controllers\TBDM002Controller;
use App\Http\Controllers\TBDM003Controller;
use App\Http\Controllers\TBDM004Controller;
use App\Http\Controllers\TBDM005Controller;
use App\Http\Controllers\TBDM006Controller;

use App\Http\Controllers\TBPA001Controller;

use App\Http\Controllers\TBPB001Controller;
use App\Http\Controllers\TBPB002Controller;

use App\Http\Controllers\TBPC001Controller;
use App\Http\Controllers\TBPC002Controller;
use App\Http\Controllers\TBPC003Controller;
use App\Http\Controllers\TBPC004Controller;
use App\Http\Controllers\TBPC005Controller;
use App\Http\Controllers\TBPC006Controller;
use App\Http\Controllers\TBPC007Controller;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/TBDM001', [TBDM001Controller::class, 'index'])->middleware(['auth', 'verified'])->name('TBDM001.index');
Route::get('/TBDM002', [TBDM002Controller::class, 'index'])->middleware(['auth', 'verified'])->name('TBDM002.index');
Route::get('/TBDM003', [TBDM003Controller::class, 'index'])->middleware(['auth', 'verified'])->name('TBDM003.index');
Route::get('/TBDM004', [TBDM004Controller::class, 'index'])->middleware(['auth', 'verified'])->name('TBDM004.index');
Route::get('/TBDM005', [TBDM005Controller::class, 'index'])->middleware(['auth', 'verified'])->name('TBDM005.index');
Route::get('/TBDM006', [TBDM006Controller::class, 'index'])->middleware(['auth', 'verified'])->name('TBDM006.index');

Route::get('/TBDB001', [TBDB001Controller::class, 'index'])->middleware(['auth', 'verified'])->name('TBDB001.index');

Route::get('/TBDC001', [TBDC001Controller::class, 'index'])->middleware(['auth', 'verified'])->name('TBDC001.index');
Route::get('/TBDC001/{event_cd}/{mode}', [TBDC001Controller::class, 'show'])->middleware(['auth', 'verified'])->name('TBDC001.show');

Route::get('/TBDC002', [TBDC002Controller::class, 'index'])->middleware(['auth', 'verified'])->name('TBDC002.index');
Route::get('/TBDC002/{event_cd}/{mode}', [TBDC002Controller::class, 'show'])->middleware(['auth', 'verified'])->name('TBDC002.show');

Route::get('/TBPA001/{nendo}', [TBPA001Controller::class, 'exportPdf'])->middleware(['auth', 'verified'])->name('TBPA001.exportPdf');

Route::get('/TBPB001', [TBPB001Controller::class, 'exportPdf'])->middleware(['auth', 'verified'])->name('TBPB001.exportPdf');
Route::get('/TBPB002', [TBPB002Controller::class, 'exportPdf'])->middleware(['auth', 'verified'])->name('TBPB002.exportPdf');

Route::get('/TBPC001/{event_cd}', [TBPC001Controller::class, 'exportPdf'])->middleware(['auth', 'verified'])->name('TBPC001.exportPdf');
Route::get('/TBPC002/{event_cd}/{name_flg}', [TBPC002Controller::class, 'exportPdf'])->middleware(['auth', 'verified'])->name('TBPC002.exportPdf');
Route::get('/TBPC003/{event_cd}', [TBPC003Controller::class, 'exportPdf'])->middleware(['auth', 'verified'])->name('TBPC003.exportPdf');
Route::get('/TBPC004/{event_cd}', [TBPC004Controller::class, 'exportPdf'])->middleware(['auth', 'verified'])->name('TBPC004.exportPdf');
Route::get('/TBPC005/{event_cd}', [TBPC005Controller::class, 'exportPdf'])->middleware(['auth', 'verified'])->name('TBPC005.exportPdf');
Route::get('/TBPC006/{event_cd}', [TBPC006Controller::class, 'exportPdf'])->middleware(['auth', 'verified'])->name('TBPC006.exportPdf');
Route::get('/TBPC007/{event_cd}', [TBPC007Controller::class, 'exportPdf'])->middleware(['auth', 'verified'])->name('TBPC007.exportPdf');

require __DIR__.'/auth.php';
