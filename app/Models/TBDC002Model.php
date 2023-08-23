<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Debugbar;

class TBDC002Model 
{
    private $prv_event_grp_cd;
    private $prv_user_id;

    /**
     * イベントリストデータ取得
     */
    public static function index() {
        $sql = <<<SQL
            SELECT
                row_number() over() AS ID,
                event_status,
                event_grp_cd,
                period_start,
                search_period_start,
                period_end,
                event_name,
                plan_content,
                venue_cd,
                venue_name,
                staff_cd,
                staff_name,
                type_cd,
                type_name,
                genre_cd,
                genre_name,
                plan_design,
                performer1,
                performer2,
                output_eventsheet_dt,
                director_dt,
                exective_dt,
                decision_no,
                decision_dt,
                conclusion_dt,
                transfer_dt,
                interim_flg,
                fin_flg,
                del_flg,
                related_parties,
                venue_del_flg,
                sub_no
            FROM
                view_event_list
            WHERE
                interim_flg = false
                AND del_flg = false
                AND search_period_start IS NOT NULL
            ORDER BY
                search_period_start DESC
        SQL;

        return DB::select($sql);
    }


        /**
     * イベント基本情報データ取得.
     */
    public static function showBasic(string $event_grp_cd)
    {
        \Debugbar::log('$event_grp_cd : '.$event_grp_cd);

        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                PARENT.EVENT_GRP_CD
                , PARENT.EVENT_NAME
                , PARENT.EVENT_KANA
                , PARENT.STAFF_NAME
                , PARENT.STAFF_CD
                , string_to_array(PARENT.STAFF_CD, ',')::integer[] AS STAFF_CD_ARRAY
                , PARENT.PERFORMER1
                , PARENT.PERFORMER2
                , PARENT.SCENARIO
                , PARENT.TYPE_CD
                , PARENT.ROUND_FLG
                , PARENT.GENRE_CD
                , PARENT.PLAN_DESIGN
                , PARENT.PLAN_CONTENT
                , PARENT.ATTACH_DOC
                , PARENT.REMIND
                , PARENT.DECISION_REMIND
                , PARENT.TV_ASAHI_TICKET
                , PARENT.SPONSORSHIP
                , PARENT.PR
                , PARENT.OUTPUT_EVENTSHEET_DT
                , PARENT.DIRECTOR_DT
                , PARENT.EXECTIVE_DT
                , PARENT.OUTPUT_BIS_DECISION_DT
                , PARENT.CIRCULAR_STAT
                , PARENT.BIS_DECISION_DT
                , PARENT.BIS_DECISION_NO
                , PARENT.OUTPUT_NAME_DECISION_DT
                , PARENT.NAME_DECISION_DT
                , PARENT.NAME_DECISION_NO
                , PARENT.OUTPUT_CONSENT_DT
                , PARENT.CONCLUSION_DT
                , PARENT.TRANSFER_DT
                , PARENT.PAY_OFF
                , PARENT.OUTPUT_CHART_DT
                , PARENT.INTERIM_FLG
                , PARENT.FIN_FLG
                , PARENT.DEL_FLG
                , SUB_TYP.TYPE_NAME
                , SUB_TYP.NAME_FLG
                , PARENT.PLAN_BACKGROUND
                , PARENT.UP_DT
                , MST_USER.USER_NAME as USER_NAME                
            FROM
                ( 
                    EVENT AS PARENT 
                        LEFT JOIN MST_TYPE AS SUB_TYP 
                            ON PARENT.TYPE_CD = SUB_TYP.TYPE_CD
                ) 
                LEFT JOIN MST_USER 
                    ON PARENT.UP_USER_ID = MST_USER.USER_ID 
            WHERE
                PARENT.EVENT_GRP_CD = :event_grp_cd
        SQL;

        return DB::select($sql, $param);
    }

    /**
     * イベント会場情報データ取得.
     */
    public static function showVenue(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                row_number() over() AS id
                , EVENT_GRP_CD
                , VENUE_CD
                , PERIOD_START
                , SEARCH_PERIOD_START
                , TO_CHAR(SEARCH_PERIOD_START, 'YYYY/MM') AS EVENT_START_YM
                , PERIOD_END
                , DAY_COUNT
                , CURTAIN_TIME
                , RELEASE_DT
                , CAPACITY
                , AUDIENCE
                , SEPECTOR_NUM
                , INFO_DISCLOSURE
                , REMIND
                , INCOME
                , OUTGO
                , BALANCE
                , NOT DECISION_FLG AS DECISION_FLG
            FROM
                EVENT_DETAIL_VENUE 
            WHERE
                EVENT_GRP_CD = :event_grp_cd
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
                row_number() over() AS id
                ,  EVENT_DETAIL_TICKET.EVENT_GRP_CD
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
                row_number() over() AS id
                , EVENT_DETAIL_INVESTMENT.EVENT_GRP_CD
                , EVENT_DETAIL_INVESTMENT.SUB_NO
                , EVENT_DETAIL_INVESTMENT.CLIENT_CD
                , EVENT_DETAIL_INVESTMENT.INVESTMENT_PERCENT * 100 as INVESTMENT_PERCENT
                , EVENT_DETAIL_INVESTMENT.ROLE
                , EVENT_DETAIL_INVESTMENT.ROLE_OUTPUT_FLG
                , EVENT_DETAIL_INVESTMENT.DISP_FLG
                , EVENT_DETAIL_INVESTMENT.DEL_FLG 
            FROM
                EVENT_DETAIL_INVESTMENT 
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
                row_number() over() AS id
                , EVENT_DETAIL_RELATION.EVENT_GRP_CD
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
                , EVENT_DETAIL_BALANCE.RESULTS_GOODS_PROFIT_RATE * 100 as RESULTS_GOODS_PROFIT_RATE
                , EVENT_DETAIL_BALANCE.BREAK_EVEN * 100 as BREAK_EVEN
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
                , EVENT_DETAIL_NAME.TOTAL_BALANCE
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
            SELECT
                row_number() over() AS id
                , event_grp_cd
                , sub_no
                , other_flg
                , similar_cd
                , sim_event_name
                , sim_venue_name
                , sim_period
                , sim_day_cnt
                , sim_capacity
                , sim_dayly
                , sim_sales_goods
                , sim_unit_price
                , sim_average
                , sim_percent
                , sim_income
                , sim_outgo
                , sim_balance
                , del_flg
                , cr_dt
                , cr_user_id
                , up_dt
                , up_user_id
            FROM
                event_detail_similar
            WHERE
                event_grp_cd = :event_grp_cd
        SQL;

        return DB::select($sql, $param);
    }


    /**
     * 類似実績情報データ取得（copy生成時）
     */
    public static function showSimilarCopy(string $event_grp_cd)
    {
        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                row_number() over() AS id
                , event_grp_cd
                , sub_no
                , other_flg
                , similar_cd
                , sim_event_name
                , sim_venue_name
                , sim_period
                , sim_day_cnt
                , sim_capacity
                , sim_dayly
                , sim_sales_goods
                , sim_unit_price
                , sim_average
                , sim_percent
                , sim_income
                , sim_outgo
                , sim_balance
                , del_flg
                , cr_dt
                , cr_user_id
                , up_dt
                , up_user_id
            FROM
                event_detail_similar
            WHERE
                event_grp_cd = :event_grp_cd OR
                similar_cd = :event_grp_cd
        SQL;

        return DB::select($sql, $param);
    }


    /**
     * 回議・報告先情報データ取得.
     */
    public static function show_circulate_dat(string $event_grp_cd) {

        $param = ['event_grp_cd' => $event_grp_cd];
        
        $sql = <<<SQL
            SELECT
                row_number() over() AS id
                , $event_grp_cd
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
                event_detail_circulate AS evt
                LEFT JOIN mst_circulate AS mst
                    ON evt.circulate_cd = mst.circulate_cd
            WHERE
                evt.event_grp_cd = :event_grp_cd
        SQL;        

        return DB::select($sql, $param);    
    }

    /**
     * 回議・報告先情報データ取得.
     */
    public static function show_circulate_mst(string $event_grp_cd) {
        $sql = <<<SQL
            SELECT
                row_number() over() AS id
                , $event_grp_cd
                , '' as type_kind
                , circulate_cd
                , position_name
                , chief_name
                , disp_order
                , kaigi_flg
                , circulate_flg
                , report_flg
                , approval_flg
                , drafter_flg            
            FROM
                mst_circulate
            WHERE
                del_flg = false
        SQL;        

        return DB::select($sql);    
    }


    /**
     * 
     */
    public static function sim_find(string $event_grp_cd) {

        $param = ['event_grp_cd' => $event_grp_cd];

        
        $sql = <<<SQL
            SELECT
                $event_grp_cd as event_grp_cd
                , 'false' as other_flg
                , event_grp_cd as similar_cd
                , event_name as sim_event_name
                , venue_name as sim_venue_name
                , period as sim_period
                , days as sim_day_cnt
                , num_recrutiments as sim_capacity
                , daily as sim_dayly
                , investment_percent as sim_percent
                , results_income as sim_income
                , results_outgo as sim_outgo
                , results_balance as sim_balance
            FROM
                view_similar_result
            WHERE
                event_grp_cd = :event_grp_cd
        SQL;

        return DB::select( $sql, $param );

        //dd($sql);
    }


    /**
     * イベント基本情報レコード更新
     */
    public static function update(Request $request) {

        $datas = $request->input('basicInfoDatas');

//        dd($datas);

        $dcnt = strval(count($datas));       

        $prv_event_grp_cd = $datas["event_grp_cd"];

        // とりあえず、設定
        $prv_user_id = $request->user_id;

        for ($cnt = 0; $cnt < $dcnt; $cnt++) {

            $param = [
                'event_grp_cd' => $prv_event_grp_cd,
                'event_name' => $datas["event_name"],
                'event_kana' => $datas["event_kana"],
                'staff_name' => $datas["staff_name"],
                'staff_cd' => $datas["staff_cd"],
                'performer1' => $datas["performer1"],
                'performer2' => $datas["performer2"],                   
                'scenario' => $datas["scenario"],
                'type_cd' => $datas["type_cd"],
                'round_flg' => $datas["round_flg"],
                'genre_cd' => $datas["genre_cd"],
                'plan_design' => $datas["plan_design"],
                'plan_background' => $datas["plan_background"],
                'plan_content' => $datas["plan_content"],
                'attach_doc' => $datas["attach_doc"],
                'remind' => $datas["remind"],
                'decision_remind' => $datas["decision_remind"],
                'tv_asahi_ticket' => $datas["tv_asahi_ticket"],
                'sponsorship' => $datas["sponsorship"],
                'pr' => $datas["pr"],
                'output_eventsheet_dt' => $datas["output_eventsheet_dt"],
                'director_dt' => $datas["director_dt"],
                'exective_dt' => $datas["exective_dt"],
                'output_bis_decision_dt' => $datas["output_bis_decision_dt"],
                'circular_stat' => $datas["circular_stat"],
                'bis_decision_dt' => $datas["bis_decision_dt"],
                'bis_decision_no' => $datas["bis_decision_no"],
                'output_name_decision_dt' => $datas["output_name_decision_dt"],
                'name_decision_dt' => $datas["name_decision_dt"],
                'name_decision_no' => $datas["name_decision_no"],
                'output_consent_dt' => $datas["output_consent_dt"],
                'conclusion_dt' => $datas["conclusion_dt"],
                'transfer_dt' => $datas["transfer_dt"],
                'pay_off' => $datas["pay_off"],
                'output_chart_dt' => $datas["output_chart_dt"],
                'interim_flg' => $datas["interim_flg"],
                'fin_flg' => $datas["fin_flg"],
                'del_flg' => $datas["del_flg"],
                'user_id' => $prv_user_id,

            ];


            $sql = <<<SQL
                UPDATE event
                SET
                    event_name = :event_name,
                    event_kana = :event_kana,
                    staff_name = :staff_name,
                    staff_cd = :staff_cd,
                    performer1 = :performer1,
                    performer2 = :performer2,
                    scenario = :scenario,
                    type_cd = :type_cd,
                    round_flg = :round_flg,
                    genre_cd = :genre_cd,
                    plan_design = :plan_design,
                    plan_background = :plan_background,
                    plan_content = :plan_content,
                    attach_doc = :attach_doc,
                    remind = :remind,
                    decision_remind = :decision_remind,
                    tv_asahi_ticket = :tv_asahi_ticket,
                    sponsorship = :sponsorship,
                    pr = :pr,
                    output_eventsheet_dt = :output_eventsheet_dt,
                    director_dt = :director_dt,
                    exective_dt = :exective_dt,
                    output_bis_decision_dt = :output_bis_decision_dt,
                    circular_stat = :circular_stat,
                    bis_decision_dt = :bis_decision_dt,
                    bis_decision_no = :bis_decision_no,
                    output_name_decision_dt = :output_name_decision_dt,
                    name_decision_dt = :name_decision_dt,
                    name_decision_no = :name_decision_no,
                    output_consent_dt = :output_consent_dt,
                    conclusion_dt = :conclusion_dt,
                    transfer_dt = :transfer_dt,
                    pay_off = :pay_off,
                    output_chart_dt = :output_chart_dt,
                    interim_flg = :interim_flg,
                    fin_flg = :fin_flg,
                    del_flg = :del_flg,
                    up_dt = CURRENT_TIMESTAMP,
                    up_user_id = :user_id
                WHERE
                    event_grp_cd = :event_grp_cd

            SQL;

            DB::update( $sql, $param );
        }
        
        // 会場情報更新
        $datas_venue = $request->input('venueInfoDatas');

        if ($datas_venue !== null) {

            $dcnt = strval(count($datas_venue));
            for ($cnt = 0; $cnt < $dcnt; $cnt++) {
                $param1_1 = [
                    'event_grp_cd' => $prv_event_grp_cd,
                ];

                if ($cnt == 0) {
                    // 対象イベントデータ削除
                    $sql = <<<SQL
                        DELETE FROM event_detail_venue WHERE event_grp_cd = :event_grp_cd
                    SQL;
                    
        //         dd($sql, $param);

                    DB::delete( $sql, $param1_1 );
                }

                $param1_2 = [
                    'event_grp_cd' => $prv_event_grp_cd,
                    'sub_no' => $cnt+ 1,
                    'venue_cd' => $datas_venue[$cnt]["venue_cd"],
                    'period_start' => $datas_venue[$cnt]["period_start"],
                    'search_period_start' => $datas_venue[$cnt]["search_period_start"],
                    'period_end' => $datas_venue[$cnt]["period_end"],
                    'day_count' => $datas_venue[$cnt]["day_count"],
                    'curtain_time' => $datas_venue[$cnt]["curtain_time"],
                    'release_dt' => $datas_venue[$cnt]["release_dt"],
                    'capacity' => $datas_venue[$cnt]["capacity"],
                    'audience' => $datas_venue[$cnt]["audience"],
                    'sepector_num' => $datas_venue[$cnt]["sepector_num"],
                    'info_disclosure' => $datas_venue[$cnt]["info_disclosure"],
                    'remind' => $datas_venue[$cnt]["remind"],
                    'income' => $datas_venue[$cnt]["income"],
                    'outgo' => $datas_venue[$cnt]["outgo"],
                    'balance' => $datas_venue[$cnt]["balance"],
                    'decision_flg' => $datas_venue[$cnt]["decision_flg"],
                    'user_id' => $prv_user_id, 
                ];

                $sql = <<<SQL
                    INSERT INTO event_detail_venue
                        ( event_grp_cd
                        , sub_no
                        , venue_cd
                        , period_start
                        , search_period_start
                        , period_end
                        , day_count
                        , curtain_time
                        , release_dt
                        , capacity
                        , audience
                        , sepector_num
                        , info_disclosure
                        , remind
                        , income
                        , outgo
                        , balance
                        , decision_flg
                        , cr_user_id
                        , up_user_id )
                    VALUES
                        ( :event_grp_cd
                        , :sub_no
                        , :venue_cd
                        , :period_start
                        , :search_period_start
                        , :period_end
                        , :day_count
                        , :curtain_time
                        , :release_dt
                        , :capacity
                        , :audience
                        , :sepector_num
                        , :info_disclosure
                        , :remind
                        , :income
                        , :outgo
                        , :balance
                        , :decision_flg
                        , :user_id
                        , :user_id )
                    SQL;

                    DB::insert( $sql, $param1_2 );
            }          
        }

        // チケット情報更新
        $datas_ticket = $request->input('ticketInfoDatas');

        if ($datas_ticket !== null) {

            $dcnt = strval(count($datas_ticket));
            for ($cnt = 0; $cnt < $dcnt; $cnt++) {

                $param2_1 = [
                    'event_grp_cd' => $prv_event_grp_cd,
                ];

                if ($cnt == 0) {
                    // 対象イベントデータ削除
                    $sql = <<<SQL
                        DELETE FROM event_detail_ticket WHERE event_grp_cd = :event_grp_cd
                    SQL;

                    DB::delete( $sql, $param2_1 );
                }
                    
                $param2_2 = [
                    'event_grp_cd' => $prv_event_grp_cd,
                    'sub_no' => $cnt+ 1,
                    'ticket_kind' => $datas_ticket[$cnt]["ticket_kind"],
                    'advance_fee' => $datas_ticket[$cnt]["advance_fee"],
                    'the_day_fee' => $datas_ticket[$cnt]["the_day_fee"],
                    'remind' => $datas_ticket[$cnt]["remind"],
                    'disp_flg' => $datas_ticket[$cnt]["disp_flg"],
                    'user_id' => $prv_user_id, 
                ];

                    $sql = <<<SQL
                        INSERT INTO event_detail_ticket
                            ( event_grp_cd, sub_no, ticket_kind, advance_fee, the_day_fee, remind, disp_flg, cr_user_id, up_user_id )
                        VALUES
                            ( :event_grp_cd, :sub_no, :ticket_kind, :advance_fee, :the_day_fee, :remind, :disp_flg, :user_id, :user_id )
                        SQL;

                        DB::insert( $sql, $param2_2 );
            }  
        }        

        // 出資情報更新
        $datas_investment = $request->input('investmentInfoDatas');

        if ($datas_investment !== null) {
            $dcnt = strval(count($datas_investment));
            for ($cnt = 0; $cnt < $dcnt; $cnt++) {
                $param3_1 = [
                    'event_grp_cd' => $prv_event_grp_cd,
                ];

                if ($cnt == 0) {
                    // 対象イベントデータ削除
                    $sql = <<<SQL
                        DELETE FROM event_detail_investment WHERE event_grp_cd = :event_grp_cd
                    SQL;
                    
        //         dd($sql, $param);

                    DB::delete( $sql, $param3_1 );
                }

//               dd($datas_investment);


                $param3_2 = [
                    'event_grp_cd' => $prv_event_grp_cd,
                    'sub_no' => $cnt+ 1,
                    'client_cd' => $datas_investment[$cnt]["client_cd"],
                    'investment_percent' => $datas_investment[$cnt]["investment_percent"] / 100,
                    'role' => $datas_investment[$cnt]["role"],
                    'role_output_flg' => $datas_investment[$cnt]["role_output_flg"],
                    'disp_flg' => $datas_investment[$cnt]["disp_flg"],
                    'user_id' => $prv_user_id, 
                ];
//               dd($param3_2);
                $sql = <<<SQL
                    INSERT INTO event_detail_investment
                        ( event_grp_cd, sub_no, client_cd, investment_percent, role, role_output_flg, disp_flg, cr_user_id, up_user_id )
                    VALUES
                        ( :event_grp_cd, :sub_no, :client_cd, :investment_percent, :role, :role_output_flg, :disp_flg, :user_id, :user_id )
                    SQL;

                    DB::insert( $sql, $param3_2 );
            }
        }

        // 関係先情報更新
        $datas_relation = $request->input('relationInfoDatas');

        if ($datas_relation !== null) {

            $dcnt = strval(count($datas_relation));
            for ($cnt = 0; $cnt < $dcnt; $cnt++) {
                $param4_1 = [
                    'event_grp_cd' => $prv_event_grp_cd,
                ];


                if ($cnt == 0) {
                    // 対象イベントデータ削除
                    $sql = <<<SQL
                        DELETE FROM event_detail_relation WHERE event_grp_cd = :event_grp_cd
                    SQL;
                    
        //         dd($sql, $param);

                    DB::delete( $sql, $param4_1 );
                }

                $param4_2 = [
                    'event_grp_cd' => $prv_event_grp_cd,
                    'sub_no' => $cnt+ 1,
                    'title' => $datas_relation[$cnt]["title"],
                    'related_parties' => $datas_relation[$cnt]["related_parties"],
                    'disp_flg' => $datas_relation[$cnt]["disp_flg"],
                    'user_id' => $prv_user_id, 
                ];
//               dd($param3);
                $sql = <<<SQL
                    INSERT INTO event_detail_relation
                        ( event_grp_cd, sub_no, title, related_parties, disp_flg, cr_user_id, up_user_id )
                    VALUES
                        ( :event_grp_cd, :sub_no, :title, :related_parties, :disp_flg, :user_id, :user_id )
                    SQL;

                    DB::insert( $sql, $param4_2 );
            }
        }

        // 収支情報更新
        $datas_balance = $request->input('balanceInfoDatas');
        if ($datas_balance !== null) {

            $param5_1 = [
                'event_grp_cd' => $prv_event_grp_cd,
            ];

            // 対象イベントデータ削除
            $sql = <<<SQL
                DELETE FROM event_detail_balance WHERE event_grp_cd = :event_grp_cd
            SQL;

            DB::delete( $sql, $param5_1 );

            //dd($datas_balance);


            $param5_2 = [
                'event_grp_cd' => $prv_event_grp_cd,
                'sub_no' => 1,
                'event_total_income' => $datas_balance["event_total_income"],
                'event_total_outgo' => $datas_balance["event_total_outgo"],
                'event_total_balance' => $datas_balance["event_total_balance"],
                'decision_total_income' => $datas_balance["decision_total_income"],
                'decision_total_outgo' => $datas_balance["decision_total_outgo"],
                'decision_total_balance' => $datas_balance["decision_total_balance"],
                'single_income' => $datas_balance["single_income"],
                'single_outgo' => $datas_balance["single_outgo"],
                'single_balance' => $datas_balance["single_balance"],
                'investment_income' => $datas_balance["investment_income"],
                'investment_outgo' => $datas_balance["investment_outgo"],
                'investment_balance' => $datas_balance["investment_balance"],
                'avg_unit_price' => $datas_balance["avg_unit_price"],
                'results_income' => $datas_balance["results_income"],
                'results_outgo' => $datas_balance["results_outgo"],
                'results_balance' => $datas_balance["results_balance"],
                'results_sales_goods' => $datas_balance["results_sales_goods"],
                'results_goods_profit_rate' => $datas_balance["results_goods_profit_rate"] / 100,
                'break_even' => $datas_balance["break_even"] /100,
                'user_id' => $prv_user_id, 
            ];

            $sql = <<<SQL
                INSERT INTO event_detail_balance
                    ( 
                        event_grp_cd
                        , sub_no
                        , event_total_income
                        , event_total_outgo
                        , event_total_balance
                        , decision_total_income
                        , decision_total_outgo
                        , decision_total_balance
                        , single_income
                        , single_outgo
                        , single_balance
                        , investment_income
                        , investment_outgo
                        , investment_balance
                        , avg_unit_price
                        , results_income
                        , results_outgo
                        , results_balance
                        , results_sales_goods
                        , results_goods_profit_rate
                        , break_even
                        , cr_user_id
                        , up_user_id
                    )
                VALUES
                    (
                        :event_grp_cd
                        , :sub_no
                        , :event_total_income
                        , :event_total_outgo
                        , :event_total_balance
                        , :decision_total_income
                        , :decision_total_outgo
                        , :decision_total_balance
                        , :single_income
                        , :single_outgo
                        , :single_balance
                        , :investment_income
                        , :investment_outgo
                        , :investment_balance
                        , :avg_unit_price
                        , :results_income
                        , :results_outgo
                        , :results_balance
                        , :results_sales_goods
                        , :results_goods_profit_rate
                        , :break_even
                        , :user_id
                        , :user_id
                    )
                SQL;

                DB::insert( $sql, $param5_2 );
        }
        


        // カルテ情報更新
        $datas_chart = $request->input('chartInfoDatas');
        
        if ($datas_chart !== null) {

            $param6_1 = [
                'event_grp_cd' => $prv_event_grp_cd,
            ];

            // 対象イベントデータ削除
            $sql = <<<SQL
                DELETE FROM event_detail_chart WHERE event_grp_cd = :event_grp_cd
            SQL;

            DB::delete( $sql, $param6_1 );

//            dd($datas_chart, );
            $param6_2 = [
                'event_grp_cd' => $prv_event_grp_cd,
                'num_recrutiments' => $datas_chart["num_recrutiments"],
                'generalization' => $datas_chart["generalization"],
                'user_id' => $prv_user_id,
            ];

            //dd( $param6_2);

            $sql = <<<SQL
                INSERT INTO event_detail_chart
                    ( 
                        event_grp_cd
                        , num_recrutiments
                        , generalization
                        , cr_user_id
                        , up_user_id
                    )
                VALUES
                    (
                        :event_grp_cd
                        , :num_recrutiments
                        , :generalization
                        , :user_id
                        , :user_id
                    )
                SQL;

                DB::insert( $sql, $param6_2 );
        }

        // 名義情報更新
        $datas_name = $request->input('nameInfoDatas');

        if ($datas_name !== null) {

            $param7_1 = [
                'event_grp_cd' => $prv_event_grp_cd,
            ];

            // 対象イベントデータ削除
            $sql = <<<SQL
                DELETE FROM event_detail_name WHERE event_grp_cd = :event_grp_cd
            SQL;

            DB::delete( $sql, $param7_1 );

            $param7_2 = [
                'event_grp_cd' => $prv_event_grp_cd,
                'lend_name' => $datas_name["lend_name"],
                'client_cd' => $datas_name["client_cd"],
                'requester_position' => $datas_name["requester_position"],
                'requester_name' => $datas_name["requester_name"],
                'content' => $datas_name["content"],
                'income_item1' => $datas_name["income_item1"],
                'income_amount1' => $datas_name["income_amount1"],
                'income_item2' => $datas_name["income_item2"],
                'income_amount2' => $datas_name["income_amount2"],
                'income_item3' => $datas_name["income_item3"],
                'income_amount3' => $datas_name["income_amount3"],
                'income_total' => $datas_name["income_total"],
                'outgo_item1' => $datas_name["outgo_item1"],
                'outgo_amount1' => $datas_name["outgo_amount1"],
                'outgo_item2' => $datas_name["outgo_item2"],
                'outgo_amount2' => $datas_name["outgo_amount2"],
                'outgo_item3' => $datas_name["outgo_item3"],
                'outgo_amount3' => $datas_name["outgo_amount3"],
                'outgo_total' => $datas_name["outgo_total"],
                'total_balance' => $datas_name["total_balance"],
                'remind' => $datas_name["remind"],
                'user_id' => $prv_user_id,
            ];


            $sql = <<<SQL
                INSERT INTO event_detail_name
                    ( 
                        event_grp_cd
                        , lend_name
                        , client_cd
                        , requester_position
                        , requester_name
                        , content
                        , income_item1
                        , income_amount1
                        , income_item2
                        , income_amount2
                        , income_item3
                        , income_amount3
                        , income_total
                        , outgo_item1
                        , outgo_amount1
                        , outgo_item2
                        , outgo_amount2
                        , outgo_item3
                        , outgo_amount3
                        , outgo_total
                        , total_balance
                        , remind
                        , cr_user_id
                        , up_user_id
                    )
                VALUES
                    (
                        :event_grp_cd
                        , :lend_name
                        , :client_cd
                        , :requester_position
                        , :requester_name
                        , :content
                        , :income_item1
                        , :income_amount1
                        , :income_item2
                        , :income_amount2
                        , :income_item3
                        , :income_amount3
                        , :income_total
                        , :outgo_item1
                        , :outgo_amount1
                        , :outgo_item2
                        , :outgo_amount2
                        , :outgo_item3
                        , :outgo_amount3
                        , :outgo_total
                        , :total_balance
                        , :remind
                        , :user_id
                        , :user_id
                    )
                SQL;

                DB::insert( $sql, $param7_2 );
        }
            
        // 類似実績情報更新
        $datas_similar = $request->input('similarInfoDatas');

        if ($datas_similar !== null) {
            $dcnt = strval(count($datas_similar));

            //dd( $datas_similar);

            for ($cnt = 0; $cnt < $dcnt; $cnt++) {
                $param8_1 = [
                    'event_grp_cd' => $prv_event_grp_cd,
                ];


                if ($cnt == 0) {
                    // 対象イベントデータ削除
                    $sql = <<<SQL
                        DELETE FROM event_detail_similar WHERE event_grp_cd = :event_grp_cd
                    SQL;
                    

                    DB::delete( $sql, $param8_1 );
                }

                $param8_2 = [
                    'event_grp_cd' => $prv_event_grp_cd,
                    'sub_no' => $cnt+ 1,
                    'other_flg' => $datas_similar[$cnt]["other_flg"],
                    'similar_cd' => $datas_similar[$cnt]["similar_cd"],
                    'sim_event_name' => $datas_similar[$cnt]["sim_event_name"],
                    'sim_venue_name' => $datas_similar[$cnt]["sim_venue_name"],
                    'sim_period' => $datas_similar[$cnt]["sim_period"],
                    'sim_capacity' => $datas_similar[$cnt]["sim_capacity"],
                    'sim_dayly' => $datas_similar[$cnt]["sim_dayly"],
                    'sim_percent' => $datas_similar[$cnt]["sim_percent"],
                    'sim_income' => $datas_similar[$cnt]["sim_income"],
                    'sim_outgo' => $datas_similar[$cnt]["sim_outgo"],
                    'sim_balance' => $datas_similar[$cnt]["sim_balance"],
                    'user_id' => $prv_user_id, 
                ];
//               dd($param3);
                $sql = <<<SQL
                    INSERT INTO event_detail_similar
                        ( event_grp_cd, sub_no, other_flg, similar_cd, sim_event_name, sim_venue_name, sim_period, sim_capacity, sim_dayly, sim_percent, sim_income, sim_outgo, sim_balance, cr_user_id, up_user_id )
                    VALUES
                        ( :event_grp_cd, :sub_no, :other_flg, :similar_cd, :sim_event_name, :sim_venue_name, :sim_period, :sim_capacity, :sim_dayly, :sim_percent, :sim_income, :sim_outgo, :sim_balance, :user_id, :user_id )
                    SQL;

                    DB::insert( $sql, $param8_2 );
            }
        }
            
        return true;
        
    }

    /**
     * イベント情報削除
     */
    public static function eventDelete(Request $request) {

        $param = [
            'event_grp_cd' => $request->event_grp_cd,
            'user_id' => $request->user_id,
        ]; 

        $sql = <<<SQL
            UPDATE event
            SET
               del_flg = true
              ,up_dt = CURRENT_TIMESTAMP
              ,up_user_id = :user_id
            WHERE
                event_grp_cd = :event_grp_cd
        SQL;

        DB::update( $sql, $param );
    }

    /**
     * 回議・報告先情報更新
     */
    public static function updateCirculate(Request $request) {

        $datas_circulate = $request->input('circulateData');
        $dcnt = strval(count($datas_circulate));

        for ($cnt = 0; $cnt < $dcnt; $cnt++) {
            $param9_1 = [
                'event_grp_cd' => $request->event_grp_cd,
            ];

            if ($cnt == 0) {
                // 対象イベントデータ削除
                $sql = <<<SQL
                    DELETE FROM event_detail_circulate WHERE event_grp_cd = :event_grp_cd
                SQL;

                DB::delete( $sql, $param9_1 );
            }

            $param9_2 = [
                'event_grp_cd' => $request->event_grp_cd,
                'type_kind' => $request->type_kind,
                'circulate_cd' => $datas_circulate[$cnt]["circulate_cd"],
                'disp_order' => $datas_circulate[$cnt]["disp_order"],
                'kaigi_flg' => $datas_circulate[$cnt]["kaigi_flg"],
                'circulate_flg' => $datas_circulate[$cnt]["circulate_flg"],
                'report_flg' => $datas_circulate[$cnt]["report_flg"],
                'approval_flg' => $datas_circulate[$cnt]["approval_flg"],
                'drafter_flg' => $datas_circulate[$cnt]["drafter_flg"],
                'user_id' => $request->user_id, 
            ];

            $sql = <<<SQL
                    INSERT INTO event_detail_circulate
                        ( event_grp_cd, type_kind, circulate_cd, disp_order, kaigi_flg, circulate_flg, report_flg, approval_flg, drafter_flg, cr_user_id, up_user_id )
                    VALUES
                        ( :event_grp_cd, :type_kind, :circulate_cd, :disp_order, :kaigi_flg, :circulate_flg, :report_flg, :approval_flg, :drafter_flg, :user_id, :user_id )
                    SQL;

                    DB::insert( $sql, $param9_2 );
        }
    }

}
