<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBPC007Model
{
    /**
     * イベントカルテデータ取得.
     */
    public static function show(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                view_event_sheet_main.event_grp_cd
                , event_name
                , staff_name
                , event_total_income
                , event_total_outgo
                , event_total_balance
                , single_income
                , single_outgo
                , single_balance
                , event_detail_chart.num_recrutiments
                , event_detail_chart.generalization
            FROM
                view_event_sheet_main
                LEFT JOIN
                    event_detail_chart
                    ON view_event_sheet_main.event_grp_cd = event_detail_chart.event_grp_cd
            WHERE
            view_event_sheet_main.event_grp_cd = :event_grp_cd
        SQL;
        
        return DB::select($sql, $param);
    }
 
}
