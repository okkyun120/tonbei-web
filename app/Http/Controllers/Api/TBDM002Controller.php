<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TBDM002Model;
use Illuminate\Support\Facades\DB;

class TBDM002Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // 会場マスタ全件データ取得
        $sqlData = TBDM002Model::index();

        // 取得したデータを返す
        return response()->json($sqlData, 200);
    }

    /**
     * データ追加
     */
    public function store(Request $request)
    {
        // トランザクション処理開始
        DB::beginTransaction();
        try {
            $sqlData = TBDM002Model::store($request);
            DB::commit();
        }
        catch (Exception $e) {
            DB::rollback();
            Debugbar::log('会場マスタ追加エラー: '.$e);
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
    public function update(Request $request) {
    
        // トランザクション処理開始
        DB::beginTransaction();

        try {
            $sqlData = TBDM002Model::update($request);
            DB::commit();
        }
        catch (Exception $e) {
            DB::rollback();
            Debugbar::log('会場マスタ更新エラー: '.$e);
        }

        return  $sqlData;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
