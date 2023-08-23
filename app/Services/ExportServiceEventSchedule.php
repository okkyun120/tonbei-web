<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use App\Services\NumberService;
use Illuminate\Support\Facades\Log;




use App\Models\TBPB002Model;

class ExportServiceEventSchedule
{
    public function makePdf($file_name)
    {
        // モデルからデータ取得
        $sqlData = TBPB002Model::index();                // メイン情報
        
        // もとになるExcelを読み込み
        $excel_file = storage_path('app\excel\template\イベントスケジュールテンプレート.xlsx');
        $reader = new XlsxReader();
        $spreadsheet = $reader->load($excel_file);

        // 編集するシート名を指定
        $worksheet = $spreadsheet->getSheetByName('Sheet1');

        $sourceRowIndex = 4; // コピー元の行インデックス（0から始まる行番号）
        // コピー元の行スタイルを取得
        $sourceRowStyle = $worksheet->getStyle('A' . $sourceRowIndex . ':L' . $sourceRowIndex);

        $dataWriteStarRow = 4;
        $dataCnt = count($sqlData);


        foreach ($sqlData as $rec) {

            // イベント名
            $col = 1;
            $row = $dataWriteStarRow;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->event_name);     

            // 開催月日
            $col = 2;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->period_start);                               
//            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->period_end);                               

            // 出演者
            $col = 3;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->performer1);     
            
            // 会場
            $col = 4;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->venue_name);     

            // 関係先
            $col = 5;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->plan_design);     

            // 形態
            $col = 6;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->type_name);     

            // 情報解禁日
            $col = 7;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->info_disclosure);     

            // 発売日
            $col = 8;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->release_dt);     

            //　ジャンル
            $col = 9;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->genre_name);     

            //　スポンサー等
            $col = 10;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->related_parties);     

            // 担当
            $col = 6;
            $worksheet->setCellValueByColumnAndRow($col, $row, $rec->staff_name);     


            $worksheet->duplicateStyle($sourceRowStyle, 'A' . $row . ':L' . $row);

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
