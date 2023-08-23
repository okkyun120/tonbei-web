<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TBDC002Model;
use Illuminate\Support\Facades\DB;


class TBDC002Controller extends Controller
{
    /**
     * データ追加
     */
    public function index()
    {
        // 削除、仮登録以外のイベント一覧データを取得
        $sqlData = TBDC002Model::index();

        // 取得したデータを返す
        return response()->json($sqlData, 200);
    }

    /**
     * 編集対象データ取得.
     */
    public function sim_show(string $id)
    {
        \Debugbar::log('$id : '.$id);

        // 対象データ取得
        $sqlData = TBDC002Model::sim_find($id);


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
            $sqlData = TBDC002Model::update($request);
            DB::commit();
        }
        catch (Exception $e) {
            DB::rollback();
            Debugbar::log('イベント情報更新エラー: '.$e);
        }

        return  $sqlData;
    }

    /**
     * データ削除.
     */
    public function delete(Request $request)
    {

        // トランザクション処理開始
        DB::beginTransaction();

        try {
            $sqlData = TBDC002Model::eventDelete($request);
            DB::commit();
        }
        catch (Exception $e) {
            DB::rollback();
 //           Debugbar::log('イベント情報更新エラー: '.$e);
        }

        return  $sqlData;
    }

    public function updateCirculate(Request $request)
    {
        \Debugbar::log('$request:'.$request);

        // トランザクション処理開始
        DB::beginTransaction();

        try {
            $sqlData = TBDC002Model::updateCirculate($request);
            DB::commit();
        }
        catch (Exception $e) {
            DB::rollback();
            Debugbar::log('回議・報告先情報更新エラー: '.$e);
        }

        return  $sqlData;
    }

}