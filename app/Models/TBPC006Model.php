<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBPC006Model
{
    /**
     * 名義貸与承諾書情報データ取得.
     */
    public static function show(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                  nm.event_grp_cd
                , nm.event_name
                , nm.lend_name
                , nm.client_name
                , nm.requester_position
                , nm.requester_name
                , nm.name_decision_no
                , list.period_start
                , list.period_end
            FROM
                view_name_content AS nm
                LEFT JOIN view_event_list AS list
                ON nm.event_grp_cd = list.event_grp_cd
            WHERE
                nm.event_grp_cd = :event_grp_cd

        SQL;
        
        return DB::select($sql, $param);
    }

    /**
     * 承認者役職・名前取得
     */
    public static function showCirculate(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                  evt.event_grp_cd
                , mst.position_name
                , mst.chief_name
            FROM
                event_detail_circulate AS evt
                JOIN mst_circulate AS mst
                    ON evt.circulate_cd = mst.circulate_cd
            WHERE
                evt.event_grp_cd = :event_grp_cd
                AND evt.approval_flg = true
        SQL;
        
        return DB::select($sql, $param);
    }

 
}
