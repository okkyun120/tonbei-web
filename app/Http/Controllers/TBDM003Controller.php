<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\TBDM003Model;
use Illuminate\Support\Facades\DB;

class TBDM003Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // 取引先マスタ全件データ取得
        $sqlData = TBDM003Model::index();

      return Inertia::render('TBDM003/Index', ['clientlists' => $sqlData]);
    //    return Inertia::render('TBDM003/Index');
        // 取得したデータを返す
       // return response()->json($sqlData, 200);
    }

    /**
     * データ追加
     */
    public function store(Request $request)
    {
        // トランザクション処理開始
        DB::beginTransaction();
        try {
            $sqlData = TBDM003Model::store($request);
            DB::commit();
        }
        catch (Exception $e) {
            DB::rollback();
            Debugbar::log('取引先マスタ追加エラー: '.$e);
        }
        return  $sqlData;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * データ更新.
     */
    public function update(Request $request)
    {
        

        // トランザクション処理開始
        DB::beginTransaction();

        try {
            $sqlData = TBDM003Model::update($request);
            DB::commit();
        }
        catch (Exception $e) {
            DB::rollback();
        }

        return  $sqlData;
    }
}
