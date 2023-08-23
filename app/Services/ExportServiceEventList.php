<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use App\Services\NumberService;
use Illuminate\Support\Facades\Log;




use App\Models\TBPB001Model;

class ExportServiceEventList
{
    public function makePdf($file_name)
    {
        // モデルからデータ取得
        $sqlData = TBPB001Model::index();                // メイン情報
/*
        // 項目取り出し

        // メイン情報
        foreach ($sqlData as $data) {
            $type_name_array[] = $data->type_name;                      // 開始実施形態
            $event_name_array[] = $data->event_name;                    // イベント名
            $plan_design_array[] = $data->plan_design;                  //　企画立案
            $plan_content_array[] = $data->plan_content;                //　企画内容
            $release_dt_array[] = $data->release_dt;                    //　発売日
            $info_disclosure_array[] = $data->info_disclosure;          //　情報解禁日
            $scenario_array[] = $data->scenario;                        //　情報解禁日
            $event_total_income_array[] = $data->event_total_income;    //  全体収入
            $event_total_outgo_array[] = $data->event_total_outgo;      //  全体支出
            $event_total_balance_array[] = $data->event_total_balance;  //  全体収支
            $single_income_array[] = $data->single_income;              //  全体収入
            $single_outgo_array[] = $data->single_outgo;                //  全体支出
            $single_balance_array[] = $data->single_balance;            //  全体収支
            $break_even_array[] = $data->break_even;                    //  損益分岐点
            $type_kind_array[] = $data->type_kind;                      //  タイプ種別
        }

        // 会場情報１
        $venue_name_array = [];
        $period_start_array = [];
        $period_end_array = [];
        $decison_flg_array = [];
    foreach ($venueData1 as $data) {
            $venue_name_array[] = $data->venue_name;                    // 会場名
            $period_start_array[] = $data->period_start;                // 日程（開始日）
            $period_end_array[] = $data->period_end;                    // 日程（終了日）
            $decison_flg_array[] = $data->venue_decision_flg;           // 決定フラグ
        }

        // 会場情報２
        $audience_array = [];                        //　目標動員数
        $capacity_array = [];                        //　総キャパ
    foreach ($venueData2 as $data) {
            $audience_array[] = $data->audience;                        //　目標動員数
            $capacity_array[] = $data->capacity;                        //　総キャパ
        }

        // チケット情報
        $ticket_kind_array = [];                 //　チケット種別
        $advance_fee_array = [];                  // 前売料金
        $the_day_array = [];                     // 当日料金
        $ticket_remind_array = [];              // 備考
    foreach ($ticketData as $data) {
            $ticket_kind_array[] = $data->ticket_kind;                  //　チケット種別
            $advance_fee_array[] = $data->advance_fee;                  // 前売料金
            $the_day_array[] = $data->the_day_fee;                      // 当日料金
            $ticket_remind_array[] = $data->remind;              // 備考
        }

        // 関係先情報
        $relation_title_array = [];                     //　関係先名称
        $related_parties_array = [];          // 
    foreach ($relationData as $data) {
            $relation_title_array[] = $data->title;                     //　関係先名称
            $related_parties_array[] = $data->related_parties;          // 
        }

        // 出資情報
        $client_cd_array = [];                      //　取引先CD
        $client_name_array = [];                  //　取引先名称 
        $investment_percent_array = [];    //　取引先名称 
        $role_array = [];                  //　取引先名称 
    foreach ($invetmentData as $data) {
            $client_cd_array[] = $data->client_cd;                      //　取引先CD
            $client_name_array[] = $data->client_name;                  //　取引先名称 
            $investment_percent_array[] = $data->investment_percent;    //　取引先名称 
            $role_array[] = $data->role;                  //　取引先名称 
        }

        // 出力情報編集
        $output_title = $event_name_array[0] . "開催について";          //　タイトル
        $output_plan_content = $plan_content_array[0];
        $output_release_dt = $release_dt_array[0];                            //　発売日
        $output_info_disclousure = $info_disclosure_array[0];                 //　情報解禁日
        $output_total_income = $event_total_income_array[0];                 //　総収入
        $output_total_outgo = $event_total_outgo_array[0];                    //　総支出
        $output_total_balance = $event_total_balance_array[0];                //　総収支
        $output_single_income = $single_income_array[0];                //　単独収入
        $output_single_outgo = $single_outgo_array[0];                  //　単独支出
        $output_single_balance = $single_balance_array[0];              //　単独収支

        $output_recovery_rate = "";
        if (empty($output_single_outgo) == false && !intval($output_single_outgo) == 0) {
            $output_recovery_rate =  ((($output_single_income / $output_single_outgo) * 10000) / 100)."%)";
        }
        if (empty($break_even_array) == false) {
            $ouput_break_even = (round($break_even_array[0] * 10000) / 100) ;
        }

        if ($type_kind_array[0] == 2) {
            $output_mobilization =  "目標動員";
        }
        else {
            $output_mobilization =  "総キャパ";
        }

        // 日時出力データ編集
        $output_period = "";

        for ($i = 0; $i < count($period_start_array); $i++) {
            if (empty($period_end_array[$i])) {
                $output_period .= $period_start_array[$i];
            }
            else {
                $output_period .= ($period_start_array[$i] . "～" . $period_end_array[$i] );
            }
            $output_period .= "、";
        }
        // 最後の区切り文字を除去
        $output_period = mb_substr($output_period, 0, -1);


        // 会場出力データ編集
        $venue_name_array = array_unique($venue_name_array);
        $output_venue = "";
        for ($i = 0; $i < count($venue_name_array); $i++) {
            $output_venue .= $venue_name_array[$i]. "、";
        }

        // 最後の区切り文字を除去
        $output_venue = mb_substr($output_venue, 0, -1);

        //　料金データ編集
        \Debugbar::log('count($ticket_kind_array) :'. count($ticket_kind_array) );

        $output_ticket = "";
        for ($i = 0; $i < count($ticket_kind_array); $i++) {
            $output_ticket .=  $ticket_kind_array[$i] . " ";

            \Debugbar::log('$type :' . gettype($the_day_array[$i]) );
            if (isset($advance_fee_array[$i])  && isset($the_day_array[$i]) ) {
                $output_ticket .= "前売：".number_format((float)$advance_fee_array[$i], 0) . " 当日：" . number_format((float)$the_day_array[$i], 0);
                \Debugbar::log('$advance_fee_array[$i] :' . $advance_fee_array[$i] );
                \Debugbar::log('$advance_fee_array[$i] :' . $advance_fee_array[$i] );
        }
            else {
                if (isset($advance_fee_array[$i]) && !isset($the_day_array[$i])) {
                    $output_ticket .= number_format((float)$advance_fee_array[$i], 0);
                    \Debugbar::log('$advance_fee_array[$i] :' . $advance_fee_array[$i] );
                    \Debugbar::log('$advance_fee_array[$i] :' . $advance_fee_array[$i] );
                }
                else {
                    if (!isset($advance_fee_array[$i]) && isset($the_day_array[$i])) {
                            $output_ticket .= number_format((float)$advance_fee_array[$i], 0);
                            \Debugbar::log('$advance_fee_array[$i] :' . $advance_fee_array[$i] );
                            \Debugbar::log('$advance_fee_array[$i] :' . $advance_fee_array[$i] );
                    }
                    else{
                        \Debugbar::log('該当なし' );

                    }
                }
            }

            $output_ticket .= "円　";

            if (!$ticket_remind_array[$i]) {
                $output_ticket .= "(" . $ticket_remind_array[$i] .")";
            }   
    }

        $output_relation_cnt = count($relation_title_array);
        $output_relation_title = "";
        $output_relation_parties = "";

*/
        
        // もとになるExcelを読み込み
        $excel_file = storage_path('app\excel\template\イベントリストテンプレート.xlsx');
        $reader = new XlsxReader();
        $spreadsheet = $reader->load($excel_file);

        // 編集するシート名を指定
        $worksheet = $spreadsheet->getSheetByName('Sheet1');

        $sourceRowIndex = 4; // コピー元の行インデックス（0から始まる行番号）
        // コピー元の行スタイルを取得
        $sourceRowStyle = $worksheet->getStyle('A' . $sourceRowIndex . ':T' . $sourceRowIndex);

        $dataWriteStarRow = 4;
        $dataCnt = count($sqlData);


        foreach ($sqlData as $rec) {

            // 開始年月
            $col = 1;
            $row = $dataWriteStarRow;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->period_start);                               

            // 終了開始年月
            $col = 2;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->period_end);                               

            // イベント名
            $col = 3;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->event_name);     
            
            // 会場
            $col = 4;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->venue_name);     

            // 関係先
            $col = 5;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->plan_design);     

            // 担当
            $col = 6;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->staff_name);     

            // 形態
            $col = 7;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->type_name);     

            // 比率
            $col = 8;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->investment_percent);     

            // 情報解禁日
            $col = 9;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->info_disclosure);     

            // 発売日
            $col = 10;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->release_dt);     

            //　イベント台帳
            $col = 11;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->output_eventsheet_dt);     

            //　局長会
            $col = 12;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->director_dt);     

            //　常務会
            $col = 13;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->exective_dt);  
            
            //　決裁番号
            $col = 14;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->decision_no);  
            
            //　決裁日
            $col = 15;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->decision_dt);  
            
            //　締結日
            $col = 16;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->conclusion_dt);  

            //　移管日
            $col = 17;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->transfer_dt);  

            //　収入
            $col = 18;
            if ($rec->type_name == "名義" || $rec->type_name == "ゼロ名義") {
                $worksheet->setCellValueByColumnAndRow($col, $row, $rec->income_total);  
            }
            else {
                $worksheet->setCellValueByColumnAndRow($col, $row, $rec->single_income);  
            }

            //　支出
            $col = 19;
            if ($rec->type_name == "名義" || $rec->type_name == "ゼロ名義") {
                $worksheet->setCellValueByColumnAndRow($col, $row, $rec->outgo_total);  
            }
            else {
                $worksheet->setCellValueByColumnAndRow($col, $row, $rec->single_outgo);  
            }

            //　収支
            $col = 20;
            if ($rec->type_name == "名義" || $rec->type_name == "ゼロ名義") {
                $name_balance = intval($rec->income_total) - intval($rec->outgo_total);
                $worksheet->setCellValueByColumnAndRow($col, $row, $name_balance);  
            }
            else {
                $worksheet->setCellValueByColumnAndRow($col, $row, $rec->single_balance);  
            }


            $worksheet->duplicateStyle($sourceRowStyle, 'A' . $row . ':T' . $row);

            // 次の行へ
            $dataWriteStarRow++;
        }
/*
        // セルに指定した値挿入
        $worksheet->setCellValue('C4', $output_title );
        $worksheet->setCellValue('B6',  $output_plan_content);              //　企画内容
        $worksheet->setCellValue('D7', $output_period);                     //　期間
        $worksheet->setCellValue('D8', $output_venue);                      //　会場
        $worksheet->setCellValue('D9', $output_ticket );                   //　料金

        for ($i = 0; $i < $output_relation_cnt; $i++) {  // 関係先
            $column = 3; // 列Cの番号
            $row = 10 + $i;       
            $worksheet->setCellValueByColumnAndRow($column, $row, $relation_title_array[$i]);                               

            $column = 6; // 列Dの番号
            $worksheet->setCellValueByColumnAndRow($column, $row, $related_parties_array[$i]);
        } 
        // 企画・制作

        //　企画立案元

        //　チケット発売日

        //　情報解禁日

        $worksheet->setCellValue('H19', ($output_total_income) );         // 総収入         
        $worksheet->setCellValue('H20', ($output_total_outgo) );         // 総支出         
        $worksheet->setCellValue('H21', ($output_total_balance) );         // 総収支         
        $worksheet->setCellValue('L21', $ouput_break_even );            // 損益分岐 

        $worksheet->setCellValue('H26', ($output_single_income ));         // 単独収入         
        $worksheet->setCellValue('H27', $numberService->numberToJapaneseUnit($output_single_outgo ));         // 単独支出         
        $worksheet->setCellValue('H28', $numberService->numberToJapaneseUnit($output_single_balance ));         // 単独収支         
        $worksheet->setCellValue('L28', $output_recovery_rate );            // 回収率 
*/

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
