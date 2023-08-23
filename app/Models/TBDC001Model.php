<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBDC001Model 
{

    protected $fillabel = [
        'code',
        'name'
    ];

    
    /**
     * イベント基本情報データ取得
     */
    public static function index() {
        $sql = <<<SQL
            SELECT
                row_number() over() AS id,
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
            ORDER BY
                search_period_start DESC
        SQL;

        return DB::select($sql);
    }

    /**
     * イベント基本情報レコード更新
     */
    public static function store(Request $request) {
/*
        $sql = <<<SQL
            SELECT
                MAX(event_grp_cd) + 1 AS next_event_grp_cd
            FROM
                EVENT
        SQL;

        DB::select($sql)
*/

$result = DB::table('event')
    ->selectRaw('MAX(event_grp_cd) + 1 AS next_event_grp_cd')
    ->get();

// 結果から次のイベントグループコードを取得
$nextEventGrpCd = $result[0]->next_event_grp_cd;

    $prv_user_id = 1;

        $datas = $request->input('basicInfoDatas');

        $param1 = [
            'event_grp_cd' => $nextEventGrpCd,
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
            'cr_user_id' => '1',
            'up_user_id' => '1',

        ];

        $sql = <<<SQL

            INSERT INTO event
                ( event_grp_cd
                , event_name
                , event_kana
                , staff_name
                , staff_cd
                , performer1
                , performer2
                , scenario
                , type_cd
                , round_flg
                , genre_cd
                , plan_design
                , plan_background
                , plan_content
                , attach_doc
                , remind
                , decision_remind
                , tv_asahi_ticket
                , sponsorship
                , pr
                , output_eventsheet_dt
                , director_dt
                , exective_dt
                , output_bis_decision_dt
                , circular_stat
                , bis_decision_dt
                , bis_decision_no
                , output_name_decision_dt
                , name_decision_dt
                , name_decision_no
                , output_consent_dt
                , conclusion_dt
                , transfer_dt
                , pay_off
                , output_chart_dt
                , interim_flg
                , fin_flg
                , del_flg
                , cr_user_id
                , up_user_id )
            VALUES
                ( :event_grp_cd
                , :event_name
                , :event_kana
                , :staff_name
                , :staff_cd
                , :performer1
                , :performer2
                , :scenario
                , :type_cd
                , :round_flg
                , :genre_cd
                , :plan_design
                , :plan_background
                , :plan_content
                , :attach_doc
                , :remind
                , :decision_remind
                , :tv_asahi_ticket
                , :sponsorship
                , :pr
                , :output_eventsheet_dt
                , :director_dt
                , :exective_dt
                , :output_bis_decision_dt
                , :circular_stat
                , :bis_decision_dt
                , :bis_decision_no
                , :output_name_decision_dt
                , :name_decision_dt
                , :name_decision_no
                , :output_consent_dt
                , :conclusion_dt
                , :transfer_dt
                , :pay_off
                , :output_chart_dt
                , :interim_flg
                , :fin_flg
                , :del_flg
                , :cr_user_id
                , :up_user_id )
            SQL;

                    $result = DB::insert( $sql, $param1 );


            // 会場情報更新
            $datas_venue = $request->input('venueInfoDatas');

            if ($datas_venue !== null) {
                $dcnt = strval(count($datas_venue));

                // 検索用日付設定処理
        //        $search_period_start = $datas_venue[$cnt]["period_start"];

                for ($cnt = 0; $cnt < $dcnt; $cnt++) {

                $param1_2 = [
                    'event_grp_cd' => $nextEventGrpCd,
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
                        , NOT :decision_flg
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


                    $param2_2 = [
                        'event_grp_cd' => $nextEventGrpCd,
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


                    $param3_2 = [
                        'event_grp_cd' => $nextEventGrpCd,
                        'sub_no' => $cnt+ 1,
                        'client_cd' => $datas_investment[$cnt]["client_cd"],
                        'investment_percent' => $datas_investment[$cnt]["investment_percent"] / 100,
                        'role' => $datas_investment[$cnt]["role"],
                        'role_output_flg' => $datas_investment[$cnt]["role_output_flg"],
                        'disp_flg' => $datas_investment[$cnt]["disp_flg"],
                        'user_id' => $prv_user_id, 
                    ];
    //               dd($param3);
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


                $param4_2 = [
                    'event_grp_cd' => $nextEventGrpCd,
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

                $param5_2 = [
                    'event_grp_cd' => $nextEventGrpCd,
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
                    'results_goods_profit_rate' => $datas_balance["results_goods_profit_rate"] /100,
                    'break_even' => $datas_balance["break_even"] / 100,
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

                $param6_2 = [
                    'event_grp_cd' => $nextEventGrpCd,
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
                $param7_2 = [
                    'event_grp_cd' => $nextEventGrpCd,
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


                    $param8_2 = [
                        'event_grp_cd' => $nextEventGrpCd,
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
}

