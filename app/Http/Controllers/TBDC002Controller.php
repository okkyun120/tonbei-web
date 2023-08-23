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
use App\Models\TBDC002Model;
use Illuminate\Support\Facades\DB;

class TBDC002Controller extends Controller
{

    //
/*
    public function index()
    {
    }
*/
     /**
     * 対象イベントデータ取得
     */
    public function show(string $id, string $mode)
    {
        //$glb_user_id = Auth::id();

        // 基本情報取得
        $sqlDataBasic = TBDC002Model::showBasic($id);

        // 会場情報
        $sqlDataVenue = TBDC002Model::showVenue($id);

        // チケット情報
        $sqlDataTicket = TBDC002Model::showTicket($id);

        // 出資情報
        $sqlDataInvestment = TBDC002Model::showInvestment($id);

        // クレジット（関係先）情報
        $sqlDataRelation = TBDC002Model::showRelation($id);

        // 収支情報
        $sqlDataBalance = TBDC002Model::showBalance($id);

        // カルテ情報
        $sqlDataChart = TBDC002Model::showChart($id);

        // 名義情報
        $sqlDataName = TBDC002Model::showName($id);

        // 類似実績情報
        if ($mode == "copy")
            $sqlDataSimilar = TBDC002Model::showSimilarCopy($id);
        else
            $sqlDataSimilar = TBDC002Model::showSimilar($id);

//dd($mode, $sqlDataSimilar);

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

        //　回議・報告先データ」取得
        $sqlCirculate = TBDC002Model::show_circulate_dat($id);
        if (empty($sqlCirculate)) {
            // 回議・報告先マスタのデータを取得して作成
            $sqlCirculate = TBDC002Model::show_circulate_mst($id);
        }

        // ドキュメント格納フォルダ
        $doc_store_folder = config('doc_store_folder');

        return Inertia::render('TBDC002/Index', [
            'mode' => $mode,
            'doc_store_folder' => $doc_store_folder,
            'evtBasic' => $sqlDataBasic,
            'evtVenue' => $sqlDataVenue,
            'evtTicket' => $sqlDataTicket,
            'evtInvestment' => $sqlDataInvestment,
            'evtRelation' => $sqlDataRelation,
            'evtBalance' => $sqlDataBalance,
            'evtChart' => $sqlDataChart,
            'evtName' => $sqlDataName,
            'evtSimilar' => $sqlDataSimilar,
            'evtCirculate' => $sqlCirculate,
            'selectItemType' => $sqlSelectItemType,
            'selectItemGenre' => $sqlSelectItemGenre,
            'selectItemUsers' => $sqlSelectItemUsers,
            'selectItemVenu' => $sqlSelectItemVenue,
            'selectItemClient' => $sqlSelectItemClient,
        ]);
    }
}