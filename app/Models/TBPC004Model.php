<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBPC004Model 
{

    /**
     * 業務決裁イベント情報データ取得
     */
    public static function show($event_grp_cd) {

        $param = ['event_grp_cd' => $event_grp_cd];

        $sql = <<<SQL
            SELECT
                  event_grp_cd
                , event_name
                , start_day
                , end_day
                , plan_design
                , release_day
                , plan_content
                , scenario
                , performer1
                , decision_total_income
                , decision_total_outgo
                , decision_total_balance
                , investment_income
                , investment_outgo
                , investment_balance
                , attach_doc
                , staff_name
                , bis_decision_dt
                , decision_remind
                , type_name
            FROM
                view_event_bis_decision
            WHERE
                event_grp_cd = :event_grp_cd
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
            SELECT distinct
                  event_grp_cd
                , other_flg
                , similar_cd
                , sim_event_name
                , sim_venue_name
                , sim_period
                , sim_day_cnt
                , sim_capacity
                , sim_dayly
                , sim_percent
                , sim_income
                , sim_outgo
                , sim_balance
                , event_name
                , venue_name
                , period
                , day_cnt
                , capacity
                , dayly
                , percent
                , income
                , outgo
                , balance
            FROM
                view_event_similar
            WHERE
                event_grp_cd = :event_grp_cd
        SQL;

        return DB::select($sql, $param);
    }

    /**
     * 類似実績情報データ取得.
     */
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
                event_grp_cd = :event_grp_cd 
            ORDER BY
                disp_order

        SQL;

        return DB::select($sql, $param);
    }
    
}
