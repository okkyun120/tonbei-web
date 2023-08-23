<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TBDC001Model;
use Illuminate\Support\Facades\DB;


class TBDC001Controller extends Controller
{
    /**
     * データ登録.
     */
    public function store(Request $request)
    {
        \Debugbar::log('$request:'.$request);

        // トランザクション処理開始
        DB::beginTransaction();

        try {
            $sqlData = TBDC001Model::store($request);
            DB::commit();
        }
        catch (Exception $e) {
            DB::rollback();
            Debugbar::log('イベント情報挿入エラー: '.$e);
        }

        return  $sqlData;
    }

}