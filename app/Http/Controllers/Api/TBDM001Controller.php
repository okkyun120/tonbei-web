<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TBDM001Model;
use Illuminate\Support\Facades\DB;


class TBDM001Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // ユーザーマスタ全件データ取得
        $sqlData = TBDM001Model::index();

        // 取得したデータを返す
        return response()->json($sqlData, 200);
    }

    /**
     * データ追加
     */
    public function store(Request $request)
    {
        
    }

    /**
     * 編集対象データ取得.
     */
    public function show(string $id)
    {
        \Debugbar::log('$id : '.$id);

        // ユーザーマスタ全件データ取得
        $sqlData = TBDM001Model::find($id);

        // 取得したデータを返す
        return response()->json($sqlData, 200);
    }

    /**
     * データ更新.
     */
    public function update(Request $request)
    {
        \Debugbar::log('$request:'.$request);

        // トランザクション処理開始
        DB::beginTransaction();

        try {
            $sqlData = TBDM001Model::update($request);
            DB::commit();
        }
        catch (Exception $e) {
            DB::rollback();
            Debugbar::log('ユーザーマスタ更新エラー: '.$e);
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
