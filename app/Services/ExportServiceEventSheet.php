<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use App\Services\NumberService;
use Illuminate\Support\Facades\Log;

use App\Models\TBPC001Model;

class ExportServiceEventSheet
{
    public function makePdf($file_name, $id) {
        define('ROW_INVESTMENT', 8);
        define('ROW_VENUE', 17);
        define('ROW_TICKET', 28);
        define('ROW_RELATION',37);
        define('ROW_SIMILAR', 49);
        define('ROW_BALANCE', 59);


        // モデルからデータ取得
        $sqlEventData = TBPC001Model::show($id);                        //　メイン情報
        $sqlVenueData = TBPC001Model::showVenue($id);                   //　会場情報
        $sqlTicketData = TBPC001Model::showTicket($id);                 //　チケット情報
        $sqlRelationData = TBPC001Model::showRelation($id);             //　関係先情報
        $sqlInvestmentData = TBPC001Model::showInvestment($id);         //　出資情報
        $sqlSimilarData = TBPC001Model::showSimilar($id);               //　類似実績情報
        $sqlBalanceData = TBPC001Model::showBalance($id);               //　収支情報

        $sqlNameData = TBPC001Model::showName($id);                     //　名義情報
//        dd($sqlEventData);

        // もとになるExcelを読み込み
        $excel_file = storage_path('app\excel\template\イベントシートテンプレート.xlsx');
        $reader = new XlsxReader();
        $spreadsheet = $reader->load($excel_file);

        // 編集するシート名を指定
        $worksheet = $spreadsheet->getSheetByName('Sheet1');

        $sourceRowIndex = 4; // コピー元の行インデックス（0から始まる行番号）
        // コピー元の行スタイルを取得
//        $sourceRowStyle = $worksheet->getStyle('A' . $sourceRowIndex . ':Z' . $sourceRowIndex);


        // 起案日
        $col = 20;
        $row = 1;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->output_eventsheet_dt); 

        // イベント名
        $col = 2;
        $row = 4;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->event_name); 
        
        // 実施形態
        $col = 2;
        $row = 6;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->type_name); 

        // 担当者
        $col = 12;
        $row = 6;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->staff_name); 

        // 出演者
        $col = 2;
        $row = 7;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->performer1); 

        // 企画立案元（名義の場合のみ表示）
        $col = 2;
        $row = 13;
        if ($sqlEventData[0]->name_flg == 1) {
            if (!empty($sqlNameData[0]->client_name))
                $worksheet->setCellValueByColumnAndRow($col, $row, $sqlNameData[0]->client_name); 
        }
        else {
            $rowDimension = $worksheet->getRowDimension($row);
            $rowDimension->setVisible(false);            
        }

        // 企画立案背景
        $col = 2;
        $row = 14;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->plan_background); 

        // 企画内容
        $col = 2;
        $row = 15;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->plan_content); 

        //　会場情報
       // dd($sqlVenueData);
        $venue_data_cnt = 0;
        foreach($sqlVenueData as $data) {

            $row = ROW_VENUE + $venue_data_cnt;

            // 期間
            $col = 2;

            if (empty($data->period_end)) {
                $period = $data->period_start;
            }
            else {
                $period = $data->period_start . "～" . $data->period_end;               
            }
            $worksheet->setCellValueByColumnAndRow($col, $row, $period); 

            // 会場名
            $col = 9;
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->venue_name);

            //　公演数
            $col = 19;
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->day_count);

            //　総キャパ
            $col = 21;
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->capacity);

            $venue_data_cnt++;
        } 

        // 余った行を非表示にする
        for ($i = ROW_VENUE + $venue_data_cnt; $i <= ROW_VENUE + 9; $i++) {
            $rowDimension = $worksheet->getRowDimension($i);
            $rowDimension->setVisible(false);            
        }

        //　出資情報
       // dd($sqlInvestmentData);
       $investment_data_cnt = 0;
       $invetment_line_cnt = 0;
       foreach($sqlInvestmentData as $data) {

            $row = ROW_INVESTMENT + $invetment_line_cnt;

            if ($investment_data_cnt % 2 == 0)
                $col = 2;
            else
                $col = 13;

            // 取引先名
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->client_name);

            //　比率
            $col += 9;
            $worksheet->setCellValueByColumnAndRow($col, $row, ($data->investment_percent * 100)."%");

            //　データカウント更新
            $investment_data_cnt++;

            if ($investment_data_cnt % 2 == 0)
                $invetment_line_cnt++;
        } 

        // 余った行を非表示にする
        for ($i = ROW_INVESTMENT + $invetment_line_cnt; $i <= ROW_INVESTMENT + 3; $i++) {
            $rowDimension = $worksheet->getRowDimension($i + 1);
            $rowDimension->setVisible(false);            
        }

        //　チケット情報
       // dd($sqlTicketData);
        $ticket_data_cnt = 0;
        $ticket_line_cnt = 0;
        foreach($sqlTicketData as $data) {

            $row = ROW_TICKET + $ticket_line_cnt;

            if ($ticket_data_cnt % 2 == 0)
                $col = 2;
            else
                $col = 13;

            // 種別
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->ticket_kind);

            //　前売料金
            $col += 7;
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->advance_fee);

            //　当日料金
            $col += 2;
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->the_day_fee);

            //　データカウント更新
            $ticket_data_cnt++;

            if ($ticket_data_cnt % 2 == 0)
                $ticket_line_cnt++;
        } 

        // 余った行を非表示にする
        for ($i = ROW_TICKET + $ticket_line_cnt; $i <= ROW_TICKET + 4; $i++) {
            $rowDimension = $worksheet->getRowDimension($i);
            $rowDimension->setVisible(false);            
        }

        // テレ朝チケット
        $col = 2;
        $row = 33;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->tv_asahi_ticket); 

        // 情報解禁日
        $col = 2;
        $row = 34;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->info_disclosure); 

        // 発売日
        $col = 15;
        $row = 34;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->release_dt); 

        // 協賛
        $col = 2;
        $row = 35;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->sponsorship); 

        // PR
        $col = 2;
        $row = 36;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->pr); 

        //　関係先情報
       // dd($sqlVenueData);
       $relationdata_cnt = 0;
       foreach($sqlRelationData as $data) {

           $row = ROW_RELATION + $relationdata_cnt;
           $col = 2;

           // 見出し
           $worksheet->setCellValueByColumnAndRow($col, $row, $data->title); 

           // 関係先
           $col += 5;
           $worksheet->setCellValueByColumnAndRow($col, $row, $data->related_parties);

           $relationdata_cnt++;
       } 

        // 余った行を非表示にする
        for ($i = ROW_RELATION + $relationdata_cnt; $i <= ROW_RELATION + 9; $i++) {
            $rowDimension = $worksheet->getRowDimension($i);
            $rowDimension->setVisible(false);            
        }
    
        //　類似実績情報
        // dd($sqlVenueData);
        $similardata_cnt = 0;
        foreach($sqlSimilarData as $data) {

            $row = ROW_SIMILAR + $similardata_cnt;
            $col = 1;

            //　イベント名
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->event_name); 

            //　会場名
            $col += 2;
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->venue_name); 
            //
            $col += 4;
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->period); 
            //　公演数
            $col += 4;
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->day_cnt); 
            //　動員数
            $col++;
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->capacity); 
            //　日割り
            $col += 2;
            $worksheet->setCellValueByColumnAndRow($col, $row, $data->dayly); 
            //　出資
            $col += 3;
            $worksheet->setCellValueByColumnAndRow($col, $row, ($data->persent * 100) . "%"); 
            //　収入
            $col++;
            $worksheet->setCellValueByColumnAndRow($col, $row, substr($data->income, 0, -3)); 
            //　支出
            $col += 2;
            $worksheet->setCellValueByColumnAndRow($col, $row, substr($data->outgo, 0, -3)); 
            //　利益
            $col += 2;
            $worksheet->setCellValueByColumnAndRow($col, $row, substr($data->balance, 0, -3));             

            $similardata_cnt++;
        } 

        // 余った行を非表示にする
        for ($i = ROW_SIMILAR + $similardata_cnt; $i <= ROW_SIMILAR + 9; $i++) {
            $rowDimension = $worksheet->getRowDimension($i);
            $rowDimension->setVisible(false);            
        }
    
        //　収支情報
        // dd($sqlBalanceData);
 
        $row = ROW_BALANCE;
 
 
        // 興行総収支
        $col = 4;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->event_total_income); 
        $col += 7;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->event_total_outgo); 
        $col += 8;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->event_total_balance); 

        // 業務決裁記載収支
        $row++;
        $col = 4;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->decision_total_income); 
        $col += 7;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->decision_total_outgo); 
        $col += 8;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->decision_total_balance); 

        // 単独収支
        $row += 2;
        $col = 4;

        if ($sqlEventData[0]->name_flg == 1) {
            if (!empty($sqlNameData)) {
                $worksheet->setCellValueByColumnAndRow($col, $row, $sqlNameData[0]->income_total); 
                $col += 7;
                $worksheet->setCellValueByColumnAndRow($col, $row, $sqlNameData[0]->outgo_total); 
//                $col += 8;
//                $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->single_balance); 
            }
        }
        else {
            $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->single_income); 
            $col += 7;
            $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->single_outgo); 
            $col += 8;
            $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->single_balance); 
        }

        // 出資分
        $row++;
        $col = 4;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->investment_income); 
        $col += 7;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->investment_outgo); 
        $col += 8;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->investment_balance); 

        // 損益分岐
        $row++;
        $col = 2;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlBalanceData[0]->break_even * 100 . "%"); 

        // 備考
        $row++;
        $col = 2;
        $worksheet->setCellValueByColumnAndRow($col, $row, $sqlEventData[0]->remind); 


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
