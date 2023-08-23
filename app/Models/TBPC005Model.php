<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBPC005Model
{
    /**
     * 名義貸与決裁書情報データ取得.
     */
    public static function showMain(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                  event_grp_cd
                , event_name
                , lend_name
                , client_name
                , content
                , income_item1
                , income_amount1
                , income_item2
                , income_amount2
                , income_item3
                , income_amount3
                , outgo_item1
                , outgo_amount1
                , outgo_item2
                , outgo_amount2
                , outgo_item3
                , outgo_amount3
                , income_total
                , outgo_total
                , remind
                , staff_name
                , name_decision_no
            FROM
                view_name_decision
            WHERE
                event_grp_cd = :event_grp_cd
        SQL;
        
        return DB::select($sql, $param);
    }
 
    public static function showRelation(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                  event_grp_cd
                , title
                , related_parties
            FROM
                event_detail_relation
            WHERE
                event_grp_cd = :event_grp_cd
                AND disp_flg = true
        SQL;
        
        return DB::select($sql, $param);
    }

    public static function showPeriod(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                  venue.event_grp_cd
                , venue.venue_cd
                , venue.period_start
                , venue.period_end
                , mst.venue_name
            FROM
                event_detail_venue AS venue
                LEFT JOIN 
                    mst_venue AS mst
                    ON venue.venue_cd = mst.venue_cd
            WHERE
                venue.event_grp_cd = :event_grp_cd
        SQL;
        
        return DB::select($sql, $param);
    }

    public static function showCirculate(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT distinct
                evt.event_grp_cd
                , evt.type_kind
                , evt.circulate_cd
                , mst.position_name
                , mst.chief_name
                , evt.disp_order
                , evt.kaigi_flg
                , evt.circulate_flg
                , evt.report_flg
                , evt.approval_flg
                , evt.drafter_flg 
            FROM
                event_detail_circulate as evt JOIN mst_circulate as mst 
                    ON evt.circulate_cd = mst.circulate_cd 
            WHERE
                event_grp_cd = :event_grp_cd AND
                (evt.report_flg = true  OR evt.drafter_flg = true)
            ORDER BY
                disp_order

        SQL;

        return DB::select($sql, $param);
    }


}
