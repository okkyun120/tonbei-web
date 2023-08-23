<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use App\Services\NumberService;
use Illuminate\Support\Facades\Log;




use App\Models\TBPC003Model;

class ExportServiceExective
{
    /**
     * 
     */
    public function makePdf($file_name, $id)
    {
      
        $numberService = new NumberService();

        // モデルからデータ取得
        $mainData = TBPC003Model::showMain($id);                // メイン情報
        $venueData1 = TBPC003Model::showVenue1($id);              // 会場情報
        $venueData2 = TBPC003Model::showVenue2($id);              // 会場情報
        $ticketData = TBPC003Model::showTicket($id);            // チケット情報
        $relationData = TBPC003Model::showRelation($id);        // 関係先情報
        $investmentData = TBPC003Model::showInvestment($id);     // 出資情報
        $nameData = TBPC003Model::showName($id);                // 名義情報
        $balanceData = TBPC003Model::showBalance($id);          // 収支情報
        
        // もとになるExcelを読み込み
        $excel_file = storage_path('app\excel\template\常務会資料テンプレート.xlsx');
        $reader = new XlsxReader();
        $spreadsheet = $reader->load($excel_file);

        // 編集するシート名を指定
        $worksheet = $spreadsheet->getSheetByName('Sheet1');

       //dd($nameData);

       $date_buf = "〇日時 : ";
       $venue_buf = "〇会場 : ";
       $ticket_buf = "〇料金 : ";
       $relation_buf = "";
       $plan_design = "";
       $scenario = "";

        // メイン情報
        foreach ($mainData as $data) {
            $worksheet->setCellValue('C4', $data->event_name . "開催について");                         // タイトル

            // 企画内容
            $worksheet->setCellValue('B6', $data->plan_content);         
            // チケット発売日
            $worksheet->setCellValue('F17', $data->release_dt);                       

            // 　情報解禁日
            $worksheet->setCellValue('F18', $data->info_disclosure);                   

            if (!empty($data->plan_design)) {
                $plan_design = "〇企画立案元：" . $data->plan_design;
            }
    
            if (!empty($data->scenario)) {
                $scenario = "〇脚本・演出：" . $data->scenario;
            }    

        }

        // 日時
        foreach ($venueData1 as $data) {
            $date_buf .= $data->period_start;
            if (!empty($data->period_end)) {
                $date_buf .= " ～ " . $data->period_end . " \n";
            }
        }  
        
        // 会場
        foreach ($venueData1 as $data) {
            $venue_buf .= $data->venue_name . " ";
        }

        $ticket_line_cnt = 0;
        // 料金
        foreach ($ticketData as $data) {
            if ($ticket_line_cnt > 0) $ticket_buf .= "　　　　　";

            $ticket_buf .= $data->ticket_kind . " ";

            if (!empty($data->advance_fee) && !empty($data->the_day_fee)) {
                $ticket_buf .= "前売: " . $data->advance_fee . "円 当日: " . $data->the_day_fee . "円　\n";
            }
            else {
                if (empty($data->advance_fee) && !empty($data->the_day_fee)) {
                    $ticket_buf .= "当日: " . $data->the_day_fee. "円　\n";
                }
                else {
                    if (!empty($data->advance_fee) && empty($data->the_day_fee)) {
                        $ticket_buf .= "前売: " . $data->advance_fee . "円　\n";
                    }
                }
            }
            // 備考付加
            if (!empty($data->remind))
                $ticket_buf .= "(" . $data->remind . ")";
            
            $ticket_line_cnt++;
        }

        // 関係先情報
        foreach ($relationData as $data) {
            $relation_buf = "〇" . $data->title . " ： " . $data->related_parties . "\n";
        }

        $writeBuff = "";
        // 日時からまとめてセルに挿入
        $writeBuff .= $date_buf ;
        $writeBuff .=  $venue_buf ;
        $writeBuff .= "\n" .$ticket_buf;
        $writeBuff .= $relation_buf;
        $writeBuff .= $plan_design . "\n";
        $writeBuff .= $scenario . "\n";

        $worksheet->setCellValue('B7', $writeBuff);

        //dd($balanceData);

        // 出資等は収支情報を記載
        if (!empty($balanceData)) {
            $worksheet->setCellValue('H19', NumberService::numberToJapaneseUnitSh($balanceData[0]->event_total_income));
            $worksheet->setCellValue('H20', NumberService::numberToJapaneseUnitSh($balanceData[0]->event_total_outgo));
            $worksheet->setCellValue('H21', NumberService::numberToJapaneseUnitSh($balanceData[0]->event_total_balance));
            $worksheet->setCellValue('L21', ($balanceData[0]->break_even * 100));
        }

        // 出資比率
        $buf = "";
        $deleteSingleDisp = false;

        foreach ($investmentData as $data) {
            $buf .= $data->client_name . " " . ($data->investment_percent * 100) . "%  ";
            if ( $data->client_cd = "1" && $data->investment_percent == 1) {
                $deleteSingleDisp = ture;
            }
        }
        $worksheet->setCellValue('F23', $buf);  

        if (!$deleteSingleDisp) {
            $worksheet->setCellValue('H26', NumberService::numberToJapaneseUnitSh($balanceData[0]->single_income));
            $worksheet->setCellValue('H27', NumberService::numberToJapaneseUnitSh($balanceData[0]->single_outgo));
            $worksheet->setCellValue('H28', NumberService::numberToJapaneseUnitSh($balanceData[0]->single_balance));
            if (!empty($balanceData[0]->single_outgo)) {
                $worksheet->setCellValue('L28', ($balanceData[0]->single_income / $balanceData[0]->single_outgo) * 100);
            }
        }
        else {
            $startRowIndex = 19; // 削除を開始する行番号（0から始まる）
            $endRowIndex = 22;
            for ($rowIndex = $endRowIndex; $rowIndex >= $startRowIndex; $rowIndex--) {
                $sheet->removeRow($rowIndex);
            }
        }

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