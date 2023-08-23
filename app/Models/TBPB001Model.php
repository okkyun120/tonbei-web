<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBPB001Model 
{    /**
     * イベントリストデータ取得
     */
    public static function index() {
        $sql = <<<SQL
            SELECT
                id
                , event_status
                , view_event_list.event_grp_cd
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
                , output_eventsheet_dt
                , director_dt
                , exective_dt
                , decision_no
                , decision_dt
                , conclusion_dt
                , transfer_dt
                , interim_flg
                , fin_flg
                , related_parties
                , release_dt
                , info_disclosure
                , event_detail_balance.single_income
                , event_detail_balance.single_outgo
                , event_detail_balance.single_balance
                , event_detail_name.income_total
                , event_detail_name.outgo_total
                , event_detail_investment.investment_percent 
            FROM
                ( 
                    SELECT
                        row_number() over () AS ID
                        , event_status
                        , event_grp_cd
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
                        , output_eventsheet_dt
                        , director_dt
                        , exective_dt
                        , decision_no
                        , decision_dt
                        , conclusion_dt
                        , transfer_dt
                        , interim_flg
                        , fin_flg
                        , related_parties
                        , release_dt
                        , info_disclosure
                        , venue_del_flg
                        , sub_no 
                    FROM
                        view_event_list
                ) as view_event_list 
                LEFT JOIN event_detail_balance 
                    ON view_event_list.event_grp_cd = event_detail_balance.event_grp_cd 
                LEFT JOIN event_detail_name 
                    ON view_event_list.event_grp_cd = event_detail_name.event_grp_cd 
                LEFT JOIN event_detail_investment 
                    ON view_event_list.event_grp_cd = event_detail_investment.event_grp_cd 
            ORDER BY
                search_period_start DESC

        SQL;

        return DB::select($sql);
        }

    /**
     * ユーザーマスタのレコードを取得する
     */
    public static function  find(string $user_id) {
        $param = ['user_id' => $user_id];

        $sql = <<<SQL
            SELECT
            row_number() over(order by user1.user_id) as id,
                user_id,
                user_name,
                user_kana,
                user_short_name,
                del_flg
            FROM
                mst_user
            WHERE
                user_id = :user_id
        SQL;

        \Debugbar::log('sql:'.$sql);

        return DB::select($sql, $param);

    }


}
