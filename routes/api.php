<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TBDC001Controller;
use App\Http\Controllers\Api\TBDC002Controller;

use App\Http\Controllers\Api\TBDM001Controller;
use App\Http\Controllers\Api\TBDM002Controller;
use App\Http\Controllers\Api\TBDM003Controller;
use App\Http\Controllers\Api\TBDM004Controller;
use App\Http\Controllers\Api\TBDM005Controller;
use App\Http\Controllers\Api\TBDM006Controller;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



    // イベント情報　登録・編集
    Route::post('TBDC001/store', [TBDC001Controller::class, 'store']);

    Route::get('TBDC002/sim_show/{event_cd}', [TBDC002Controller::class, 'sim_show']);
    Route::get('TBDC002/index', [TBDC002Controller::class, 'index']);

    Route::post('TBDC002/update', [TBDC002Controller::class, 'update']);
    Route::post('TBDC002/delete', [TBDC002Controller::class, 'delete']);

    Route::post('TBDC002/updateCirculate', [TBDC002Controller::class, 'updateCirculate']);


    // ユーザーマスタ一覧　登録・編集
    Route::get('TBDM001/index', [TBDM001Controller::class, 'index']);
    Route::post('TBDM001/store', [TBDM001Controller::class, 'store']);
    Route::post('TBDM001/update', [TBDM001Controller::class, 'update']);

    // 会場マスタ一覧　登録・編集
    Route::get('TBDM002/index', [TBDM002Controller::class, 'index']);
    Route::post('TBDM002/store', [TBDM002Controller::class, 'store']);
    Route::post('TBDM002/update', [TBDM002Controller::class, 'update']);

    // 取引先マスタ一覧　登録・編集
    Route::get('TBDM003/index', [TBDM003Controller::class, 'index']);
    Route::post('TBDM003/store', [TBDM003Controller::class, 'store']);
    Route::post('TBDM003/update', [TBDM003Controller::class, 'update']);
  
    // 実施形態マスタ一覧　登録・編集
    Route::get('TBDM004/index', [TBDM004Controller::class, 'index']);
    Route::post('TBDM004/store', [TBDM004Controller::class, 'store']);
    Route::post('TBDM004/update', [TBDM004Controller::class, 'update']);

    // ジャンルマスタ一覧　登録・編集
    Route::get('TBDM005/index', [TBDM005Controller::class, 'index']);
    Route::post('TBDM005/store', [TBDM005Controller::class, 'store']);
    Route::post('TBDM005/update', [TBDM005Controller::class, 'update']);

    // 回議・報告先マスタ一覧　登録・編集
    Route::get('TBDM006/index', [TBDM006Controller::class, 'index']);
    Route::post('TBDM006/store', [TBDM006Controller::class, 'store']);
    Route::post('TBDM006/update', [TBDM006Controller::class, 'update']);
    