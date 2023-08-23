<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use App\Services\NumberService;
use Illuminate\Support\Facades\Log;

use App\Models\TBPC007Model;

class ExportServiceEventChart
{
    public function makePdf($file_name, $id)
    {
        $numberService = new NumberService();

        // モデルからデータ取得
        $mainData = TBPC007Model::show($id);                // メイン情報
        
        // もとになるExcelを読み込み
        $excel_file = storage_path('app\excel\template\イベントカルテテンプレート.xlsx');
        $reader = new XlsxReader();
        $spreadsheet = $reader->load($excel_file);

        // 編集するシート名を指定
        $worksheet = $spreadsheet->getSheetByName('Sheet1');

        // セルに指定した値挿入
        $worksheet->setCellValue('D4', $mainData[0]->staff_name );              //　担当者
        $worksheet->setCellValue('B5',  $mainData[0]->event_name);              //　イベント名
        $worksheet->setCellValue('D7', $mainData[0]->num_recrutiments);         //　最終動員数
        $worksheet->setCellValue('B8', substr($mainData[0]->single_income, 0, -2));                      //　会場
        $worksheet->setCellValue('D8', substr($mainData[0]->single_outgo, 0, -2));                   //　料金
        $worksheet->setCellValue('B9', substr($mainData[0]->single_balance, 0, -2));                      //　会場
       // $worksheet->setCellValue('D9', $mainData[0]->single_balancd );                   //　料金
        $worksheet->setCellValue('B10', $mainData[0]->generalization );         //　総括               //　料金

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
