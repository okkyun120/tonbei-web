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

use App\Models\TBCM001Model;
use App\Models\TBDC001Model;
use Illuminate\Support\Facades\DB;

class TBDC001Controller extends Controller
{
    //
    public function index()
    {
        // 項目選択タイプマスタ取得
        $sqlSelectItemType = TBCM001Model::getSelectItemTypeMst();

        // 項目選択ジャンルマスタ取得
        $sqlSelectItemGenre = TBCM001Model::getSelectItemGenreMst();

        //　Breezeユーザー情報取得
        $sqlSelectItemUsers = TBCM001Model::getSelectItemUser();

        //　会場マスタ
        $sqlSelectItemVenue = TBCM001Model::getSelectItemVenueMst();

        //　取引先マスタ
        $sqlSelectItemClient = TBCM001Model::getSelectItemClientMst();
        

        //return response()->json($sqlData, 200);
        return Inertia::render('TBDC001/Index', [
            'mode' => 'add',
            'selectItemType' => $sqlSelectItemType,
            'selectItemGenre' => $sqlSelectItemGenre,
            'selectItemUsers' => $sqlSelectItemUsers,
            'selectItemVenu' => $sqlSelectItemVenue,
            'selectItemClient' => $sqlSelectItemClient,
        ]);
    }

     /**
     * 対象イベントデータ取得
     */
    public function show(string $id, string $mode)
    {
        // 基本情報取得
        $sqlDataBasic = TBDC001Model::showBasic($id);

        // 会場情報
        $sqlDataVenue = TBDC001Model::showVenue($id);

        // チケット情報
        $sqlDataTicket = TBDC001Model::showTicket($id);

        // 出資情報
        $sqlDataInvestment = TBDC001Model::showInvestment($id);

        // クレジット（関係先）情報
        $sqlDataRelation = TBDC001Model::showRelation($id);

        // 収支情報
        $sqlDataBalance = TBDC001Model::showBalance($id);

        // カルテ情報
        $sqlDataChart = TBDC001Model::showChart($id);

        // 名義情報
        $sqlDataName = TBDC001Model::showName($id);

        // 類似実績情報
        $sqlDataSimilar = TBDC001Model::showSimilar($id);

        // 項目選択タイプマスタ取得
       // $sqlSelectItemType = TBDC001Model::getSelectItemTypeMst();


        // 項目選択ジャンルマスタ取得
        //$sqlSelectItemGenre = TBDC001Model::getSelectItemGenreMst();

        return Inertia::render('TBDC001/Index', [
            'mode' => $mode,
/*
            'evtBasic' => $sqlDataBasic,
            'evtVenue' => $sqlDataVenue,
            'evtTicket' => $sqlDataTicket,
            'evtInvestment' => $sqlDataInvestment,
            'evtRelation' => $sqlDataRelation,
            'evtCahrt' => $sqlCahrt,
            'evtName' => $sqlDataName,
            'evtSimilar' => $sqlDataSimilar,
*/

        ]);
    }
}