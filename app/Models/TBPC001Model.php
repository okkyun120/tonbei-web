<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBPC001Model 
{

    /**
     * イベント基本情報データ取得
     */
    public static function show($event_grp_cd) {

        $param = ['event_grp_cd' => $event_grp_cd];

        $sql = <<<SQL
            SELECT
                evt_list.event_status,
                evt_list.event_grp_cd,
                evt_list.period_start,
                evt_list.search_period_start,
                evt_list.period_end,
                evt_list.event_name,
                evt_list.plan_background,
                evt_list.plan_content,
                evt_list.remind,
                evt_list.decision_remind,
                evt_list.venue_cd,
                evt_list.venue_name,
                evt_list.staff_cd,
                evt_list.staff_name,
                evt_list.type_cd,
                evt_list.type_name,
                evt_list.genre_cd,
                evt_list.genre_name,
                evt_list.plan_design,
                evt_list.performer1,
                evt_list.performer2,
                evt_list.output_eventsheet_dt,
                evt_list.director_dt,
                evt_list.exective_dt,
                evt_list.decision_no,
                evt_list.decision_dt,
                evt_list.conclusion_dt,
                evt_list.transfer_dt,
                evt_list.interim_flg,
                evt_list.fin_flg,
                evt_list.related_parties,
                evt_list.release_dt,
                evt_list.info_disclosure,
                evt.tv_asahi_ticket,
                evt.sponsorship,
                evt.pr,
                typ.name_flg
            FROM
                view_event_list AS evt_list
                JOIN event as evt
                    ON evt_list.event_grp_cd = evt.event_grp_cd
                JOIN mst_type as typ
                    ON evt_list.type_cd = typ.type_cd
            WHERE
            evt_list.event_grp_cd = :event_grp_cd
            ORDER BY
                search_period_start DESC
        SQL;

        return DB::select($sql, $param);
    }


    /**
     * イベント会場情報データ取得.
     */
    public static function showVenue(string $event_grp_cd)
    {
        \Debugbar::log('$event_grp_cd : '.$event_grp_cd);

        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                EVENT_DETAIL_VENUE.EVENT_GRP_CD
                , EVENT_DETAIL_VENUE.SUB_NO
                , EVENT_DETAIL_VENUE.VENUE_CD
                , EVENT_DETAIL_VENUE.PERIOD_START
                , EVENT_DETAIL_VENUE.SEARCH_PERIOD_START
                , EVENT_DETAIL_VENUE.PERIOD_END
                , EVENT_DETAIL_VENUE.SEARCH_PERIOD_END
                , EVENT_DETAIL_VENUE.DAY_COUNT
                , EVENT_DETAIL_VENUE.CURTAIN_TIME
                , EVENT_DETAIL_VENUE.RELEASE_DT
                , EVENT_DETAIL_VENUE.CAPACITY
                , EVENT_DETAIL_VENUE.AUDIENCE
                , EVENT_DETAIL_VENUE.SEPECTOR_NUM
                , EVENT_DETAIL_VENUE.INFO_DISCLOSURE
                , EVENT_DETAIL_VENUE.REMIND
                , EVENT_DETAIL_VENUE.INCOME
                , EVENT_DETAIL_VENUE.OUTGO
                , EVENT_DETAIL_VENUE.BALANCE
                , EVENT_DETAIL_VENUE.DECISION_FLG
                , EVENT_DETAIL_VENUE.DEL_FLG
                , MST_VENUE.VENUE_NAME 
            FROM
                EVENT_DETAIL_VENUE
                LEFT JOIN MST_VENUE
                    ON EVENT_DETAIL_VENUE.VENUE_CD = MST_VENUE .VENUE_CD
            WHERE
                EVENT_DETAIL_VENUE.EVENT_GRP_CD = :event_grp_cd
            ORDER BY
                PERIOD_START

        SQL;

        return DB::select($sql, $param);
    }

    /**
     * チケット情報データ取得.
     */
    public static function showTicket(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                EVENT_DETAIL_TICKET.EVENT_GRP_CD
                , EVENT_DETAIL_TICKET.SUB_NO
                , EVENT_DETAIL_TICKET.TICKET_KIND
                , EVENT_DETAIL_TICKET.ADVANCE_FEE
                , EVENT_DETAIL_TICKET.THE_DAY_FEE
                , EVENT_DETAIL_TICKET.REMIND
                , EVENT_DETAIL_TICKET.DISP_FLG
                , EVENT_DETAIL_TICKET.DEL_FLG 
            FROM
                EVENT_DETAIL_TICKET 
            WHERE
                EVENT_DETAIL_TICKET.EVENT_GRP_CD = :event_grp_cd
            ORDER BY
                SUB_NO
        SQL;

        return DB::select($sql, $param);
    }

    /**
     * 出資情報データ取得.
     */
    public static function showInvestment(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                EVENT_DETAIL_INVESTMENT.EVENT_GRP_CD
                , EVENT_DETAIL_INVESTMENT.SUB_NO
                , EVENT_DETAIL_INVESTMENT.CLIENT_CD
                , EVENT_DETAIL_INVESTMENT.INVESTMENT_PERCENT
                , EVENT_DETAIL_INVESTMENT.ROLE
                , EVENT_DETAIL_INVESTMENT.ROLE_OUTPUT_FLG
                , EVENT_DETAIL_INVESTMENT.DISP_FLG
                , EVENT_DETAIL_INVESTMENT.DEL_FLG
                , MST_CLIENT.CLIENT_NAME 
            FROM
                EVENT_DETAIL_INVESTMENT
                LEFT JOIN
                    MST_CLIENT
                    ON EVENT_DETAIL_INVESTMENT.CLIENT_CD = MST_CLIENT.CLIENT_CD 
            WHERE
                EVENT_DETAIL_INVESTMENT.EVENT_GRP_CD = :event_grp_cd
            ORDER BY
                SUB_NO
        SQL;

        return DB::select($sql, $param);
    }

    /**
     * 関係先情報データ取得.
     */
    public static function showRelation(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                EVENT_DETAIL_RELATION.EVENT_GRP_CD
                , EVENT_DETAIL_RELATION.SUB_NO
                , EVENT_DETAIL_RELATION.TITLE
                , EVENT_DETAIL_RELATION.RELATED_PARTIES
                , EVENT_DETAIL_RELATION.DISP_FLG
                , EVENT_DETAIL_RELATION.DEL_FLG 
            FROM
                EVENT_DETAIL_RELATION 
            WHERE
                EVENT_DETAIL_RELATION.EVENT_GRP_CD = :event_grp_cd 
            ORDER BY
                SUB_NO
        SQL;

        return DB::select($sql, $param);
    }

    /**
     * 収支情報データ取得.
     */
    public static function showBalance(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                EVENT_DETAIL_BALANCE.EVENT_GRP_CD
                , EVENT_DETAIL_BALANCE.EVENT_TOTAL_INCOME
                , EVENT_DETAIL_BALANCE.EVENT_TOTAL_OUTGO
                , EVENT_DETAIL_BALANCE.EVENT_TOTAL_BALANCE
                , EVENT_DETAIL_BALANCE.DECISION_TOTAL_INCOME
                , EVENT_DETAIL_BALANCE.DECISION_TOTAL_OUTGO
                , EVENT_DETAIL_BALANCE.DECISION_TOTAL_BALANCE
                , EVENT_DETAIL_BALANCE.SINGLE_INCOME
                , EVENT_DETAIL_BALANCE.SINGLE_OUTGO
                , EVENT_DETAIL_BALANCE.SINGLE_BALANCE
                , EVENT_DETAIL_BALANCE.INVESTMENT_INCOME
                , EVENT_DETAIL_BALANCE.INVESTMENT_OUTGO
                , EVENT_DETAIL_BALANCE.INVESTMENT_BALANCE
                , EVENT_DETAIL_BALANCE.AVG_UNIT_PRICE
                , EVENT_DETAIL_BALANCE.RESULTS_INCOME
                , EVENT_DETAIL_BALANCE.RESULTS_OUTGO
                , EVENT_DETAIL_BALANCE.RESULTS_BALANCE
                , EVENT_DETAIL_BALANCE.RESULTS_SALES_GOODS
                , EVENT_DETAIL_BALANCE.RESULTS_GOODS_PROFIT_RATE
                , EVENT_DETAIL_BALANCE.BREAK_EVEN
                , EVENT_DETAIL_BALANCE.DEL_FLG 
            FROM
                EVENT_DETAIL_BALANCE 
            WHERE
                EVENT_DETAIL_BALANCE.EVENT_GRP_CD = :event_grp_cd 
        SQL;

        return DB::select($sql, $param);
    }

    /**
     * カルテ情報データ取得.
     */
    public static function showChart(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                EVENT_DETAIL_CHART.EVENT_GRP_CD
                , EVENT_DETAIL_CHART.NUM_RECRUTIMENTS
                , EVENT_DETAIL_CHART.GENERALIZATION
                , EVENT_DETAIL_CHART.DEL_FLG 
            FROM
                EVENT_DETAIL_CHART 
            WHERE
                EVENT_DETAIL_CHART.EVENT_GRP_CD = :event_grp_cd
        SQL;

        return DB::select($sql, $param);
    }

    /**
     * 名義情報データ取得.
     */
    public static function showName(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
            EVENT_DETAIL_NAME.EVENT_GRP_CD
                , EVENT_DETAIL_NAME.LEND_NAME
                , EVENT_DETAIL_NAME.CLIENT_CD
                , MST_CLIENT.CLIENT_NAME
                , EVENT_DETAIL_NAME.REQUESTER_POSITION
                , EVENT_DETAIL_NAME.REQUESTER_NAME
                , EVENT_DETAIL_NAME.CONTENT
                , EVENT_DETAIL_NAME.INCOME_ITEM1
                , EVENT_DETAIL_NAME.INCOME_AMOUNT1
                , EVENT_DETAIL_NAME.INCOME_ITEM2
                , EVENT_DETAIL_NAME.INCOME_AMOUNT2
                , EVENT_DETAIL_NAME.INCOME_ITEM3
                , EVENT_DETAIL_NAME.INCOME_AMOUNT3
                , EVENT_DETAIL_NAME.INCOME_TOTAL
                , EVENT_DETAIL_NAME.OUTGO_ITEM1
                , EVENT_DETAIL_NAME.OUTGO_AMOUNT1
                , EVENT_DETAIL_NAME.OUTGO_ITEM2
                , EVENT_DETAIL_NAME.OUTGO_AMOUNT2
                , EVENT_DETAIL_NAME.OUTGO_ITEM3
                , EVENT_DETAIL_NAME.OUTGO_AMOUNT3
                , EVENT_DETAIL_NAME.OUTGO_TOTAL
                , EVENT_DETAIL_NAME.REMIND
                , EVENT_DETAIL_NAME.DEL_FLG 
            FROM
                EVENT_DETAIL_NAME 
                JOIN MST_CLIENT 
                    ON EVENT_DETAIL_NAME.CLIENT_CD = MST_CLIENT.CLIENT_CD
            WHERE
                EVENT_DETAIL_NAME.EVENT_GRP_CD = :event_grp_cd
        SQL;

        return DB::select($sql, $param);
    }

    /**
     * 類似実績情報データ取得.
     */
    public static function showSimilar(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
        select
            sub1.id
            , sub1.event_grp_cd
            , sub1.other_flg
            , CASE 
                WHEN sub1.other_flg 
                    THEN null 
                ELSE own_event_grp_cd 
                END as similar_cd
            , CASE 
                WHEN sub1.other_flg 
                    THEN sub1.sim_venue_name 
                ELSE sub1.own_event_name 
                END as event_name
            , CASE 
                WHEN sub1.other_flg 
                    THEN sub1.sim_event_name 
                ELSE sub1.own_venue_name 
                END as venue_name
            , CASE 
                WHEN sub1.other_flg 
                    THEN sub1.sim_period 
                ELSE sub1.own_period 
                END as period
            , CASE 
                WHEN sub1.other_flg 
                    THEN sub1.sim_day_cnt 
                ELSE sub1.own_day_cnt 
                END as day_cnt
            , CASE 
                WHEN sub1.other_flg 
                    THEN sub1.sim_capacity 
                ELSE sub1.own_capacity 
                END as capacity
            , CASE 
                WHEN sub1.other_flg 
                    THEN sub1.sim_dayly 
                ELSE sub1.own_dayly 
                END as dayly
            , CASE 
                WHEN sub1.other_flg 
                    THEN sub1.sim_percent 
                ELSE sub1.own_percent 
                END as persent
            , CASE 
                WHEN sub1.other_flg 
                    THEN sub1.sim_income 
                ELSE sub1.own_income 
                END as income
            , CASE 
                WHEN sub1.other_flg 
                    THEN sub1.sim_outgo 
                ELSE sub1.own_outgo 
                END as outgo
            , CASE 
                WHEN sub1.other_flg 
                    THEN sub1.sim_balance 
                ELSE sub1.own_balance 
                END as balance 
        FROM
            ( 
                SELECT
                    row_number() over () AS id
                    , sim.event_grp_cd
                    , sim.other_flg
                    , sim.similar_cd
                    , sim.sim_event_name
                    , sim.sim_venue_name
                    , sim.sim_period
                    , sim.sim_day_cnt
                    , sim.sim_capacity
                    , sim.sim_dayly                     --    , sim.sim_sales_goods
                    --    , sim.sim_unit_price
                    --    , sim.sim_average
                    , sim.sim_percent
                    , sim.sim_income
                    , sim.sim_outgo
                    , sim.sim_balance
                    , result.event_grp_cd as own_event_grp_cd
                    , result.event_name as own_event_name
                    , result.venue_name as own_venue_name
                    , result.period as own_period
                    , result.days as own_day_cnt
                    , result.num_recrutiments as own_capacity
                    , result.daily as own_dayly         --    , result.sales_goods as own_sales_goods
                    --    , result.unit_price as own_unit_price
                    --    , result.average as own_average
                    , result.investment_percent as own_percent
                    , result.results_income as own_income
                    , result.results_outgo as own_outgo
                    , result.results_balance as own_balance 
                FROM
                    event_detail_similar AS sim 
                    LEFT OUTER JOIN view_similar_result AS result 
                        ON sim.similar_cd = result.event_grp_cd 
                WHERE
                    sim.event_grp_cd = :event_grp_cd
            ) sub1

        SQL;

        return DB::select($sql, $param);
    }

    /**
     * Selectアイテム用実施形態マスタ取得
     */
    public static function getSelectItemTypeMst() {

        $sql = <<<SQL
            SELECT
                type_cd,
                type_name
            FROM
                mst_type
            WHERE
                del_flg = false
        SQL;

        return DB::select($sql);
    }

    /**
     * Selectアイテム用ジャンルマスタ取得
     */
    public static function getSelectItemGenreMst() {

        $sql = <<<SQL
            SELECT
                genre_cd,
                genre_name
            FROM
                mst_genre
            WHERE
                del_flg = false
        SQL;

        return DB::select($sql);
    }

    /**
     * Selectアイテム用会場マスタ取得
     */
    public static function getSelectItemVenueMst() {

        $sql = <<<SQL
            SELECT
                venue_cd,
                venue_name
            FROM
                mst_venueg
            WHERE
                del_flg = false
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





    /**
     * ユーザーマスタのレコードを追加する
     */
    public static function store(Request $request) {
        // デフォルトパスワードを取得する
    //    $passwd = config('defaultpassword.password');

        $param = [
            'user_name' => $request->user_name,
            'user_kana' => $request->user_kana,
            'user_short_name' => $request->user_short_name,
            'passwd' => $passwd,
            'del_flg' => $request->del_flg,
        ];

        $sql = <<<SQL
            INSERT INTO mst_user (
                user_id, user_name, user_kana, user_short_name, passwd, del_flg, cr_dt, cr_user_id, up_dt, up_user_id)
            VALUES (
                to_char((
                    SELECT
                        max(a.id)
                    FROM
                        (SELECT
                            (row_number() OVER(ORDER BY user_id)) AS id
                        FROM
                            mst_user
                        ) AS a
                    )
                    + 1, '0000'),
                :user_name,
                :user_kana,
                :user_short_name,
                :passwd,
                :del_flg,
                CURRENT_TIMESTAMP,
                '00000',
                CURRENT_TIMESTAMP,
                '00000'
            )
        SQL;

        return DB::insert( $sql, $param );
    }

    /**
     * ユーザーマスタのレコードを更新する
     */
    public static function update(Request $request) {
        $param = [
            'user_id' => $request->user_id,
            'user_name' => $request->user_name,
            'user_kana' => $request->user_kana,
            'user_short_name' => $request->user_short_name,
            'del_flg' => $request->del_flg,
            'up_user_id' => '00000',
        ];

        $sql = <<<SQL
            UPDATE mst_user
            SET
                user_name = :user_name,
                user_kana = :user_kana,
                user_short_name = :user_short_name,
                del_flg = :del_flg,
                up_user_id = :up_user_id,
                up_dt = CURRENT_TIMESTAMP
            WHERE
                user_id = :user_id
        SQL;

        return DB::update( $sql, $param );
    }

}
