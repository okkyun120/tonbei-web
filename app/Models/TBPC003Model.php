<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBPC003Model
{
    /**
     * 常務会資料メイン情報データ取得.
     */
    public static function showMain(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                MST_TYPE.TYPE_NAME
                , EVENT.EVENT_NAME
                , EVENT.PLAN_DESIGN
                , EVENT.PLAN_CONTENT
                , MIN(EVENT_DETAIL_VENUE.RELEASE_DT) AS RELEASE_DT
                , MIN(EVENT_DETAIL_VENUE.INFO_DISCLOSURE) AS INFO_DISCLOSURE
                , EVENT.SCENARIO
                , EVENT.EXECTIVE_DT
                , EVENT_DETAIL_BALANCE.EVENT_TOTAL_INCOME
                , EVENT_DETAIL_BALANCE.EVENT_TOTAL_OUTGO
                , EVENT_DETAIL_BALANCE.EVENT_TOTAL_BALANCE
                , EVENT_DETAIL_BALANCE.SINGLE_INCOME
                , EVENT_DETAIL_BALANCE.SINGLE_OUTGO
                , EVENT_DETAIL_BALANCE.SINGLE_BALANCE
                , EVENT_DETAIL_BALANCE.BREAK_EVEN
                , MST_GENRE.TYPE_KIND 
            FROM
                ( 
                    ( 
                        EVENT 
                            INNER JOIN MST_TYPE 
                                ON EVENT.TYPE_CD = MST_TYPE.TYPE_CD
                    ) 
                        INNER JOIN MST_GENRE 
                            ON EVENT.GENRE_CD = MST_GENRE.GENRE_CD
                ) 
                LEFT JOIN ( 
                    EVENT_DETAIL_BALANCE 
                        LEFT JOIN EVENT_DETAIL_VENUE 
                            ON EVENT_DETAIL_BALANCE.EVENT_GRP_CD = EVENT_DETAIL_VENUE.EVENT_GRP_CD
                ) 
                    ON EVENT.EVENT_GRP_CD = EVENT_DETAIL_BALANCE.EVENT_GRP_CD

            WHERE
                EVENT.EVENT_GRP_CD = :event_grp_cd 
            GROUP BY
                MST_TYPE.TYPE_NAME
                , EVENT.EVENT_NAME
                , EVENT.PLAN_DESIGN
                , EVENT.PLAN_CONTENT
                , EVENT.SCENARIO
                , EVENT.EXECTIVE_DT
                , EVENT_DETAIL_BALANCE.EVENT_TOTAL_INCOME
                , EVENT_DETAIL_BALANCE.EVENT_TOTAL_OUTGO
                , EVENT_DETAIL_BALANCE.EVENT_TOTAL_BALANCE
                , EVENT_DETAIL_BALANCE.SINGLE_INCOME
                , EVENT_DETAIL_BALANCE.SINGLE_OUTGO
                , EVENT_DETAIL_BALANCE.SINGLE_BALANCE
                , EVENT_DETAIL_BALANCE.BREAK_EVEN
                , MST_GENRE.TYPE_KIND
        SQL;
       
        return DB::select($sql, $param);
    }
 
    /**
     * 常務会資料会場情報データ取得.
     */
    public static function showVenue1(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                venue_name
                , period_start
                , period_end
                , venue_decision_flg 
            FROM
                view_event_list 
            WHERE
                event_grp_cd = :event_grp_cd  
            ORDER BY
                search_period_start
        SQL;
       
        return DB::select($sql, $param);
    }

    /**
     * 常務会資料会場情報データ取得.
     */
    public static function showVenue2(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                EVENT_DETAIL_VENUE.AUDIENCE
                , EVENT_DETAIL_VENUE.CAPACITY
            FROM
                EVENT_DETAIL_VENUE   
            WHERE
                EVENT_DETAIL_VENUE.EVENT_GRP_CD = :event_grp_cd  
        SQL;
       
        return DB::select($sql, $param);
    }

    /**
     * 常務会資料チケット情報データ取得.
     */
    public static function showTicket(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                TICKET_KIND
                , ADVANCE_FEE
                , THE_DAY_FEE
                , REMIND 
            FROM
                EVENT_DETAIL_TICKET 
            WHERE
                DISP_FLG = TRUE 
                AND EVENT_GRP_CD =  :event_grp_cd  
        SQL;
       
        return DB::select($sql, $param);
    }

    /**
     * 常務会資料関係先情報データ取得.
     */
    public static function showRelation(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                TITLE
                , RELATED_PARTIES 
            FROM
                EVENT_DETAIL_RELATION 
            WHERE
                DISP_FLG = TRUE 
                AND EVENT_GRP_CD =  :event_grp_cd  
        SQL;
       
        return DB::select($sql, $param);
    }

    /**
     * 常務会資料出資情報データ取得.
     */
    public static function showInvestment(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL

            SELECT
                EVENT_DETAIL_INVESTMENT.CLIENT_CD
                , MST_CLIENT.CLIENT_NAME
                , EVENT_DETAIL_INVESTMENT.INVESTMENT_PERCENT
                , (CASE WHEN EVENT_DETAIL_INVESTMENT.ROLE_OUTPUT_FLG
                    THEN
                        EVENT_DETAIL_INVESTMENT.ROLE_OUTPUT_FLG
                    END
                ) AS ROLE 
            FROM
                EVENT_DETAIL_INVESTMENT 
                INNER JOIN MST_CLIENT 
                    ON EVENT_DETAIL_INVESTMENT.CLIENT_CD = MST_CLIENT.CLIENT_CD 
            WHERE
                EVENT_DETAIL_INVESTMENT.DEL_FLG = FALSE 
                AND EVENT_DETAIL_INVESTMENT.DISP_FLG = TRUE 
                AND EVENT_DETAIL_INVESTMENT.EVENT_GRP_CD =  :event_grp_cd
        SQL;
       
        return DB::select($sql, $param);
    }

        /**
     * 局長会資料名義情報データ取得.
     */
    public static function showName(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL

            SELECT
                EVENT_DETAIL_NAME.CLIENT_CD
                , LEND_NAME
                , INCOME_TOTAL
                , CLIENT_NAME
            FROM
                EVENT_DETAIL_NAME 
                INNER JOIN MST_CLIENT 
                    ON EVENT_DETAIL_NAME.CLIENT_CD = MST_CLIENT.CLIENT_CD 
                AND EVENT_DETAIL_NAME.EVENT_GRP_CD =  :event_grp_cd
        SQL;
       
        return DB::select($sql, $param);
    }

        /**
     * 
     */
    public static function showBalance(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL

            SELECT
                  EVENT_TOTAL_INCOME
                , EVENT_TOTAL_OUTGO
                , EVENT_TOTAL_BALANCE
                , SINGLE_INCOME
                , SINGLE_OUTGO
                , SINGLE_BALANCE
                , BREAK_EVEN
            FROM
                EVENT_DETAIL_BALANCE 
            WHERE
                EVENT_GRP_CD =  :event_grp_cd
        SQL;
       
        return DB::select($sql, $param);
    }



}
