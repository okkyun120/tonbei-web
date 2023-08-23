<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use App\Services\NumberService;
use Illuminate\Support\Facades\Log;




use App\Models\TBPC002Model;

class ExportServiceDirector
{
    /**
     * 
     */
    public function makePdf($file_name, $id, $name_flg)
    {
      
        $numberService = new NumberService();

        // モデルからデータ取得
        $mainData = TBPC002Model::showMain($id);                // メイン情報
        $venueData1 = TBPC002Model::showVenue1($id);              // 会場情報
        $venueData2 = TBPC002Model::showVenue2($id);              // 会場情報
        $ticketData = TBPC002Model::showTicket($id);            // チケット情報
        $relationData = TBPC002Model::showRelation($id);        // 関係先情報
        $investmentData = TBPC002Model::showInvestment($id);     // 出資情報
        $nameData = TBPC002Model::showName($id);                // 名義情報
        $balanceData = TBPC002Model::showBalance($id);          // 収支情報
        
        // もとになるExcelを読み込み
        $excel_file = storage_path('app\excel\template\戦略会議資料テンプレート.xlsx');
        $reader = new XlsxReader();
        $spreadsheet = $reader->load($excel_file);

        // 編集するシート名を指定
        $worksheet = $spreadsheet->getSheetByName('Sheet1');

       //dd($nameData);

        // メイン情報
        foreach ($mainData as $data) {
            $worksheet->setCellValue('A3', "(" . $data->type_name . "案件)");          // 実施形態
            $worksheet->setCellValue('C5', $data->event_name);                         // タイトル

            if ($name_flg !== "0" ) {
                if (!empty($nameData)) {
                    $buf = $data->plan_content . "\n";
                    $buf .= "○名義依頼元：" . $nameData[0]->client_name . "\n";
                    $buf .= "○名義クレジット：" . $nameData[0]->lend_name . "\n";
                    $buf .= "○名義料：" . number_format($nameData[0]->income_total, 0) . "\n";
                    $worksheet->setCellValue('B6', $buf);                       // 企画内容
                }
                else {
                    $worksheet->setCellValue('B6', $data->plan_content);                       // 企画内容
                }
            }
            else {
                $worksheet->setCellValue('B6', $data->plan_content);                       // 企画内容
            }

            // 企画立案元
            $worksheet->setCellValue('F10', $data->plan_design);                       

            // チケット発売日
            $worksheet->setCellValue('F11', $data->release_dt);                       

            // 　情報解禁日
            $worksheet->setCellValue('F12', $data->info_disclosure);                   
        }

        // 日時
        $buf = "";
        foreach ($venueData1 as $data) {
            $buf .= $data->period_start;
            if (!empty($data->period_end)) {
                $buf .= " ～ " . $data->period_end . "  ";
            }
        }
        $worksheet->setCellValue('F7', $buf);  
        
        // 会場
        $buf = "";
        foreach ($venueData1 as $data) {
            $buf .= $data->venue_name . " ";
        }
        $worksheet->setCellValue('F8', $buf);  

        // 料金
        $buf = "";
        foreach ($ticketData as $data) {
            $buf .= $data->ticket_kind . " ";
            if (!empty($data->advance_fee) && !empty($data->the_day_fee)) {
                $buf .= "前売: " . $data->advance_fee . "円 当日: " . $data->the_day_fee . "円　";
            }
            else {
                if (empty($data->advance_fee) && !empty($data->the_day_fee)) {
                    $buf .= "当日: " . $data->the_day_fee. "円　";
                }
                else {
                    if (!empty($data->advance_fee) && empty($data->the_day_fee)) {
                        $buf .= "前売: " . $data->advance_fee . "円　";
                    }
                }
            }
            // 備考付加
            if (!empty($data->remind))
                $buf .= "(" . $data->remind . ")";
        }
        $worksheet->setCellValue('F9', $buf);  

        // 出資等は収支情報を記載
        if ($name_flg == "0" ) {
            if (!empty($balanceData)) {
                $worksheet->setCellValue('H13', NumberService::numberToJapaneseUnitSh($balanceData[0]->event_total_income));
                $worksheet->setCellValue('H14', NumberService::numberToJapaneseUnitSh($balanceData[0]->event_total_outgo));
                $worksheet->setCellValue('H15', NumberService::numberToJapaneseUnitSh($balanceData[0]->event_total_balance));
                $worksheet->setCellValue('L15', ($balanceData[0]->break_even * 100));
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
            $worksheet->setCellValue('F17', $buf);  
    
            if (!$deleteSingleDisp) {
                $worksheet->setCellValue('H20', NumberService::numberToJapaneseUnitSh($balanceData[0]->single_income));
                $worksheet->setCellValue('H21', NumberService::numberToJapaneseUnitSh($balanceData[0]->single_outgo));
                $worksheet->setCellValue('H22', NumberService::numberToJapaneseUnitSh($balanceData[0]->single_balance));
                if (!empty($balanceData[0]->single_outgo)) {
                    $worksheet->setCellValue('L22', ($balanceData[0]->single_income / $balanceData[0]->single_outgo) * 100);
                }
            }
            else {
                $startRowIndex = 19; // 削除を開始する行番号（0から始まる）
                $endRowIndex = 22;
                for ($rowIndex = $endRowIndex; $rowIndex >= $startRowIndex; $rowIndex--) {
                    $sheet->removeRow($rowIndex);
                }
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