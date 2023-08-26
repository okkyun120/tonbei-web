<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use App\Services\NumberService;
use Illuminate\Support\Facades\Log;

use App\Models\TBPC004Model;

class ExportServiceBisDecision
{
    public function makePdf($file_name, $id)
    {

        define('LINE_STR_MAX', 35);
        define('LINE_STR_MAX2', 50);
        define('PAGE_LINE_MAX', 50);    // 45
        define('PAGE_LINE_MAX2', 60);

        // モデルからデータ取得
        $sqlBaseData = TBPC004Model::show($id);                // メイン情報
        $sqlVenueData = TBPC004Model::showVenue($id);
        $sqlInvestmentData = TBPC004Model::showInvestment($id);
        $sqRelationData = TBPC004Model::showRelation($id);
        $sqlTicketData = TBPC004Model::showTicket($id);
        $sqlCirculate = TBPC004Model::showCirculate($id);
    

        // もとになるExcelを読み込み
        $excel_file = storage_path('app\excel\template\業務決裁書テンプレート.xlsx');
        $reader = new XlsxReader();
        $spreadsheet = $reader->load($excel_file);

        // 編集するシート名を指定
        $worksheet = $spreadsheet->getSheetByName('Sheet1');

        //$sourceRowIndex = 4; // コピー元の行インデックス（0から始まる行番号）
        // コピー元の行スタイルを取得
        //$sourceRowStyle = $worksheet->getStyle('A' . $sourceRowIndex . ':Z' . $sourceRowIndex);

        //　件名
        $event_title = $sqlBaseData[0]->event_name . "(" . $sqlBaseData[0]->type_name . ")について";
        $worksheet->setCellValue('G3', $event_title);

        // 書込み行数カウント
        $write_line_cnt = 0;
        $first_page_write = false;
        
        // 項目番号初期値
        $item_no = 1;

        // 書込用バッファ初期化
        $write_buff = "";

        //　催事名
        $event_title_buff = "1. 催事名　" . $sqlBaseData[0]->event_name;

//        $write_line_cnt = NumberService::calculateNumberOfLines($event_title_buff, LINE_STR_MAX);


        //  行数カウントアップ
        $event_title_buff .= "\n\n";

        if (!$first_page_write) {
            $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $event_title_buff, LINE_STR_MAX);
        }
        else {
            $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $event_title_buff, LINE_STR_MAX2);
        }
        \Debugbar::log('$write_line_cnt : ' . $write_line_cnt);

        // ページ最大値を超えているかチェック
        if (!$first_page_write) {
            if ($write_line_cnt > PAGE_LINE_MAX) {
                $worksheet->setCellValue('F8', $write_buff );

                // 書込み用バッファクリア
                $write_buff = "";
            
                // 書込み行数再設定
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $event_title_buff, LINE_STR_MAX2);

                // １ページ目書込みフラグON
                $first_page_write = true;
            }

            // バッファ格納
            $write_buff .= $event_title_buff;
        }
        else {
            if ($write_line_cnt > PAGE_LINE_MAX2) {
                $worksheet->setCellValue('F8', $write_buff );

                // 書込み用バッファクリア
                $write_buff = "";
            
                // 書込み行数再設定
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $event_title_buff, LINE_STR_MAX2);
            }
            // バッファ格納
            $write_buff .= $event_title_buff;
        }
      
        $date_buff = "";                    // 日時出力用バッファ
        $venue_buff = "";                   // 会場出力用バッファ
        if (count($sqlVenueData) > 0 ) {
            $item_no++;
            //　日時
            $data_cnt = 0;

            $date_buff = $item_no . ". 日時　" ;

            foreach ($sqlVenueData as $data) {
                if ($data_cnt > 0 ) {
                    $date_buff .= ",";
                }

                if (empty($data->period_end)) {
                    $date_buff .= $data->period_start;
                }
                else {
                    $date_buff .= $data->period_start . "～" . $data->period_end;
                }

                $data_cnt++;
            }

            $date_buff .= "\n\n";

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $date_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $date_buff, LINE_STR_MAX2);
            }

            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $date_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }

                // バッファ格納
                $write_buff .= $date_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $date_buff, LINE_STR_MAX2);    
                }

                // バッファ格納
                $write_buff .= $date_buff;
            }

            $item_no++;
            
            //　会場
            $data_cnt = 0;

            $venue_buff = $item_no . ". 会場　" ;

            foreach ($sqlVenueData as $data) {
                if ($data_cnt > 0 ) {
                    $venue_buff .= ",";
                }

                $venue_buff .= $data->venue_name;

                $data_cnt++;
            }
            $venue_buff .= "\n\n";

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $venue_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $venue_buff, LINE_STR_MAX2);
            }
    
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $venue_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }

                // バッファ格納
                $write_buff .= $venue_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $venue_buff, LINE_STR_MAX2);    
                }

                // バッファ格納
                $write_buff .= $venue_buff;
            }
        }

        $plan_design_buff = "";
        if (!empty($sqlBaseData[0]->plan_design)) {
            $item_no++;

            //　企画立案元
            $plan_design_buff = $item_no . ". 企画立案元　" . $sqlBaseData[0]->plan_design ;

            $plan_design_buff .= "\n\n";

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $plan_design_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $plan_design_buff, LINE_STR_MAX2);
            }
    
            // ページ最大値を超えているかチェック
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $plan_design_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }

                // バッファ格納
                $write_buff .= $plan_design_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $plan_design_buff, LINE_STR_MAX2);    
                }

                // バッファ格納
                $write_buff .= $plan_design_buff;
            }
        }

        // 出資
        $investment_buff = "";

        if (count($sqlInvestmentData) > 0 ) {
            $data_cnt = 0;

            $item_no++;
            $investment_buff = $item_no . ". 出資比率　" ;

            foreach ($sqlInvestmentData as $data) {
                if ($data->disp_flg) {
                    if ($data_cnt > 0 ) {
                        $investment_buff .= ",";
                    }
                    $investment_buff .= $data->client_name . " " . ($data->investment_percent * 100) . "%　"; 
                }
            }
            $investment_buff .= "\n\n";

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $investment_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $investment_buff, LINE_STR_MAX2);
            }
    
            // ページ最大値を超えているかチェック
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $investment_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }

                // バッファ格納
                $write_buff .= $investment_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $investment_buff, LINE_STR_MAX2);    
                }

                // バッファ格納
                $write_buff .= $investment_buff;
            }
        }


        //　関係先
        $relation_buff = "";

        if (count($sqRelationData) > 0)  {
            $data_cnt = 0;
            foreach ($sqRelationData as $data) {
                if ($data->disp_flg) {
                    $item_no++;

                    $relation_buff = $item_no . ".";            

                    $relation_buff .= $data->title . " " . $data->related_parties;

                    $relation_buff .= "\n\n";
                }
            }

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $relation_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $relation_buff, LINE_STR_MAX2);
            }
    
            // ページ最大値を超えているかチェック
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $relation_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }

                // バッファ格納
                $write_buff .= $relation_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $relation_buff, LINE_STR_MAX2);    
                }

                // バッファ格納
                $write_buff .= $relation_buff;
            }

        }


        // 一般発売日
        $release_dt_buff = "";

        if (!empty($sqlBaseData[0]->release_day)) {
            $item_no++;
            $release_dt_buff = $item_no . ". 一般発売日" . $sqlBaseData[0]->release_day;
            $release_dt_buff .= "\n\n";

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $release_dt_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $release_dt_buff, LINE_STR_MAX2);
            }

            // ページ最大値を超えているかチェック
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $release_dt_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }

                // バッファ格納
                $write_buff .= $release_dt_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $release_dt_buff, LINE_STR_MAX2);    
                }

                // バッファ格納
                $write_buff .= $release_dt_buff;
            }
        }

        //　チケット情報
        $ticket_buff = "";

        if (count($sqlTicketData) > 0 ) {
            $data_cnt = 0;

            $item_no++;
            $ticket_buff = $item_no . ". 料金　　　" ;

            foreach ($sqlTicketData as $data) {
                if ($data->disp_flg) {
                    if ($data_cnt == 0) {
                    }
                    else {
                        $ticket_buff .= "　　　　　";
                    }

                    $ticket_buff .= $data->ticket_kind;
                    if (!empty($data->advance_fee)) {
                        $ticket_buff .= "前売：" . $data->advance_fee . "円　";
                    }
                    if (!empty($data->the_day_fee)) {
                        $ticket_buff .= "当日：" . $data->the_day_fee . "円";
                    }

                    $ticket_buff .= "\n\n";
                    $data_cnt = 0;
                }
            }

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $ticket_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $ticket_buff, LINE_STR_MAX2);
            }
    
            // ページ最大値を超えているかチェック
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $ticket_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }

                // バッファ格納
                $write_buff .= $ticket_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $ticket_buff, LINE_STR_MAX2);    
                }

                // バッファ格納
                $write_buff .= $ticket_buff;
            }
        }

        // 企画内容
        $plan_content_buff = "";
        if (!empty($sqlBaseData[0]->plan_content)) {
            $item_no++;

            //　内容
            $plan_content_buff = $item_no . ". 内容　" . $sqlBaseData[0]->plan_content ;

            $plan_content_buff .= "\n\n";

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $plan_content_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $plan_content_buff, LINE_STR_MAX2);
            }
    
            // ページ最大値を超えているかチェック
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $plan_content_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }
    
                // バッファ格納
                $write_buff .= $plan_content_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $plan_content_buff, LINE_STR_MAX2);    
                }
    
                // バッファ格納
                $write_buff .= $plan_content_buff;
            }
        }


            //　脚本・演出
        $scenario_buff = "";
        if (!empty($sqlBaseData[0]->scenario)) {
            $item_no++;

            $scenario_buff = $item_no . ". 脚本・演出　" . $sqlBaseData[0]->scenario ;

            $scenario_buff .= "\n\n";

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $scenario_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $scenario_buff, LINE_STR_MAX2);
            }
    
            // ページ最大値を超えているかチェック
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $scenario_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }
    
                // バッファ格納
                $write_buff .= $scenario_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $scenario_buff, LINE_STR_MAX2);    
                }
    
                // バッファ格納
                $write_buff .= $scenario_buff;
            }
        }

        //　出演者
        $performer_buff = "";
        if (!empty($sqlBaseData[0]->performer1)) {
            $item_no++;

            $performer_buff = $item_no . ". 出演者　" . $sqlBaseData[0]->performer1 ;

            $performer_buff .= "\n\n";

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $performer_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $performer_buff, LINE_STR_MAX2);
            }
    
            // ページ最大値を超えているかチェック
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $performer_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }
    
                // バッファ格納
                $write_buff .= $performer_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );
    
                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $performer_buff, LINE_STR_MAX2);    
                }
    
                // バッファ格納
                $write_buff .= $performer_buff;
            }
        }


        //　収支（全体）  
        $event_balance_buff = "";

        $item_no++;
        $event_balance_buff = $item_no . ". 収支(全体)　　";

        $space_len = mb_strwidth($event_balance_buff, 'UTF-8');
        $space_str = "";
        for($i = 0; $i < $space_len; $i++){
            $space_str .= " ";
        }

        $event_balance_buff .= "収入　";
        $event_balance_buff .= $sqlBaseData[0]->decision_total_income . "円\n\n";
        $event_balance_buff .= $space_str . "支出　";
        $event_balance_buff .= $sqlBaseData[0]->decision_total_outgo . "円\n\n";
        $event_balance_buff .= $space_str . "差引　";
        $event_balance_buff .= $sqlBaseData[0]->decision_total_outgo . "円\n\n";
        $event_balance_buff .= "\n\n";

        if (!$first_page_write) {
            $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $event_balance_buff, LINE_STR_MAX);
        }
        else {
            $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $event_balance_buff, LINE_STR_MAX2);
        }

        // ページ最大値を超えているかチェック
        if (!$first_page_write) {
            if ($write_line_cnt > PAGE_LINE_MAX) {
                $worksheet->setCellValue('F8', $write_buff );

                // 書込み用バッファクリア
                $write_buff = "";
            
                // 書込み行数再設定
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $event_balance_buff, LINE_STR_MAX2);
    
                // １ページ目書込みフラグON
                $first_page_write = true;
            }

            // バッファ格納
            $write_buff .= $event_balance_buff;
        }
        else {
            if ($write_line_cnt > PAGE_LINE_MAX2) {
                $worksheet->setCellValue('F8', $write_buff );

                // 書込み用バッファクリア
                $write_buff = "";
            
                // 書込み行数再設定
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $event_balance_buff, LINE_STR_MAX2);    
            }

            // バッファ格納
            $write_buff .= $event_balance_buff;
        }

        //　収支（テレビ朝日単独）    
        $single_balance_buff = "";

        $item_no++;
        $single_balance_buff =  $item_no . ". テレビ朝日単独　";
        $space_len = mb_strwidth($single_balance_buff,'UTF-8');
        $space_singele_str = "";
        for($i = 0; $i < $space_len; $i++){
            $space_singele_str .= " ";
        }

  //      dd($space_singele_str, $space_len );

        $single_balance_buff .= "収入　";
        $single_balance_buff .= $sqlBaseData[0]->investment_income . "円\n\n";
        $single_balance_buff .= $space_singele_str . "支出　";
        $single_balance_buff .= $sqlBaseData[0]->investment_outgo . "円\n\n";
        $single_balance_buff .= $space_singele_str . "差引　";
        $single_balance_buff .= $sqlBaseData[0]->investment_balance . "円\n\n";
        $single_balance_buff .= "\n\n";

        if (!$first_page_write) {
            $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $single_balance_buff, LINE_STR_MAX);
        }
        else {
            $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $single_balance_buff, LINE_STR_MAX2);
        }

        // ページ最大値を超えているかチェック
        if (!$first_page_write) {
            if ($write_line_cnt > PAGE_LINE_MAX) {
                $worksheet->setCellValue('F8', $write_buff );

                // 書込み用バッファクリア
                $write_buff = "";
            
                // 書込み行数再設定
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $single_balance_buff, LINE_STR_MAX2);
    
                // １ページ目書込みフラグON
                $first_page_write = true;
            }

            // バッファ格納
            $write_buff .= $single_balance_buff;
        }
        else {
            if ($write_line_cnt > PAGE_LINE_MAX2) {
                $worksheet->setCellValue('F8', $write_buff );

                // 書込み用バッファクリア
                $write_buff = "";
            
                // 書込み行数再設定
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $single_balance_buff, LINE_STR_MAX2);    
            }

            // バッファ格納
            $write_buff .= $single_balance_buff;
        }


        // 決裁用備考
        $decision_remind_buff = "";
        if (!empty($sqlBaseData[0]->decision_remind)) {
            $item_no++;

            $decision_remind_buff = $item_no . ".備考　" . $sqlBaseData[0]->decision_remind ;

            $decision_remind_buff .= "\n\n";

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $decision_remind_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $decision_remind_buff, LINE_STR_MAX2);
            }
    
            // ページ最大値を超えているかチェック
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );

                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $decision_remind_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }

                // バッファ格納
                $write_buff .= $decision_remind_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );

                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $decision_remind_buff, LINE_STR_MAX2);    
                }

                // バッファ格納
                $write_buff .= $decision_remind_buff;
            }
        }

        // 添付書類
        $attach_doc_buff = "";
        if (!empty($sqlBaseData[0]->attach_doc)) {
            $item_no++;

            $attach_doc_buff = $item_no . ".添付書類　" . $sqlBaseData[0]->attach_doc ;

            $attach_doc_buff .= "\n\n";

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $attach_doc_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $attach_doc_buff, LINE_STR_MAX2);
            }
    
            // ページ最大値を超えているかチェック
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );

                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $attach_doc_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }

                // バッファ格納
                $write_buff .= $attach_doc_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );

                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $attach_doc_buff, LINE_STR_MAX2);    
                }

                // バッファ格納
                $write_buff .= $attach_doc_buff;
            }
        }


        // 担当者
        $staff_name_buff = "";
        if (!empty($sqlBaseData[0]->staff_name)) {
            $item_no++;

            $staff_name_buff = $item_no . ".担当者　" . $sqlBaseData[0]->staff_name ;

            $staff_name_buff .= "\n\n";

            if (!$first_page_write) {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $staff_name_buff, LINE_STR_MAX);
            }
            else {
                $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $staff_name_buff, LINE_STR_MAX2);
            }
    
            // ページ最大値を超えているかチェック
            if (!$first_page_write) {
                if ($write_line_cnt > PAGE_LINE_MAX) {
                    $worksheet->setCellValue('F8', $write_buff );

                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $staff_name_buff, LINE_STR_MAX2);
        
                    // １ページ目書込みフラグON
                    $first_page_write = true;
                }

                // バッファ格納
                $write_buff .= $staff_name_buff;
            }
            else {
                if ($write_line_cnt > PAGE_LINE_MAX2) {
                    $worksheet->setCellValue('F8', $write_buff );

                    // 書込み用バッファクリア
                    $write_buff = "";
                
                    // 書込み行数再設定
                    $write_line_cnt = NumberService::calculateNumberOfLines($write_buff . $staff_name_buff, LINE_STR_MAX2);    
                }

                // バッファ格納
                $write_buff .= $staff_name_buff;
            }
        }

        $write_buff .= "\n以上";


        if (!$first_page_write) 
            $worksheet->setCellValue('F8', $write_buff );
        else 
            $worksheet->setCellValue('A36', $write_buff );


        //　回覧先・報告先
        //　決裁者取得
        $filteredApproval = array_filter($sqlCirculate, function ($item) {
            return $item->approval_flg == true;
        });

        foreach($filteredApproval as $approval) {
            $approvalDepartment = $approval->position_name;
            $approvalName = $approval->chief_name;
        }

        $worksheet->setCellValue('C6', $approvalDepartment );
        $worksheet->setCellValue('C7', $approvalName );

        //　起案者者取得
        $filteredDrafter = array_filter($sqlCirculate, function ($item) {
            return $item->drafter_flg == true;
        });

        foreach($filteredDrafter as $drafter) {
            $drafterDepartment = $drafter->position_name;
            $drafterName = $drafter->chief_name;
        }

        $worksheet->setCellValue('E26', $drafterDepartment );
        $worksheet->setCellValue('E27', $drafterName );

        //  回議者
        $kaigi_dat = "";
        $filteredKaigi = array_filter($sqlCirculate, function ($item) {
            return $item->kaigi_flg == true;
        });
        foreach($filteredKaigi as $kaigi) {
            $drafterDepartment = $kaigi->position_name;
            $drafterName = $kaigi->chief_name;
            if (!empty($drafterDepartment) && !empty($drafterName)) {
                $kaigi_dat .= $drafterDepartment . "\n　" .$drafterName . "\n";
            }
            else {
                $kaigi_dat .= $drafterDepartment . $drafterName . "\n";
            }
        }
        $worksheet->setCellValue('A9', $kaigi_dat );

        //　回覧先
        $circulate_dat = "";
        $filteredCirculate = array_filter($sqlCirculate, function ($item) {
            return $item->circulate_flg == true;
        });
        foreach($filteredCirculate as $circulate) {
            $circulateDepartment = $circulate->position_name;
            $circulateName = $circulate->chief_name;

            if (!empty($circulateDepartment) && !empty($circulateName)) {
                $circulate_dat .= $circulateDepartment . "\n　" .$circulateName . "\n";
            }
            else {
                $circulate_dat .= $circulateDepartment . $circulateName . "\n";
            }
        }
        $worksheet->setCellValue('A20', $circulate_dat );

        // Excel出力
        $writer = new XlsxWriter($spreadsheet);
        $export_excel_path = storage_path('app/excel/export/'.$file_name.'.xlsx');
        $writer->save($export_excel_path);

        // Pdf出力
        if (file_exists($export_excel_path)) {
            $export_pdf_path = storage_path('app\pdf\export');

            $export_excel_path = escapeshellarg($export_excel_path);
            $export_pdf_path = escapeshellarg($export_pdf_path);

            $command = "export HOME=/tmp; libreoffice --headless --convert-to pdf --outdir $export_pdf_path $export_excel_path";

            \Debugbar::log( $command );

            // Execute the shell command
            exec($command, $output, $returnVar);

            // Check the return status to see if the conversion was successful
            if ($returnVar === 0) {
                echo 'Excel file converted to PDF successfully.';
            } else {
                \Debugbar::log( '$returnVar'.$returnVar );
                echo 'An error occurred during the conversion.';
            }
        }
    }

}
