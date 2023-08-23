<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBPB002Model 
{    /**
     * イベントリストデータ取得
     */
    public static function index() {
        $sql = <<<SQL
            SELECT
                event_grp_cd
                , period_start
                , search_period_start
                , period_end
                , event_name
                , plan_content
                , venue_cd
                , venue_name
                , staff_cd
                , staff_name
                , type_cd
                , type_name
                , genre_cd
                , genre_name
                , plan_design
                , performer1
                , performer2
                , related_parties
                , release_dt
                , info_disclosure
            FROM
                view_event_list
            ORDER BY
                search_period_start DESC
        SQL;

        return DB::select($sql);
    }

    public static function show($event_grp_cd) {
        $sql = <<<SQL
            SELECT
            FROM
                event_detail_relation
            WHERE
                event_grp_cd = :event_grp_cd
        SQL;
    }

}
