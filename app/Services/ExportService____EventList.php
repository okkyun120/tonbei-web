<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;

use App\Models\TBPC001Model;

class ExportServiceEventList {
    public function makePdf($file_name) 
    {
        // モデルからデータ取得
        $printdata = TBPC001Model::index();

        $event_name_array = [];
        $period_array = [];
        
        // 印刷項目データ取り出し
        foreach ($printdata as $data) {
            $event_name_array[] = $data->event_name;
            $lend_name_array[] = $data->lend_name;
            $client_name_array[] = $data->client_name;
            $lend_name_array[] = $data->lend_name;
            $requester_position_name_array[] = $data->requester_position;
            $requester_position_name_array[] = $data->requester_name;
        }        
        
        // もとになるExcelを読み込み
        $excel_file = storage_path('app\excel\template\名義貸与決裁書テンプレート.xlsx');
        $reader = new XlsxReader();
        $spreadsheet = $reader->load($excel_file);

        // 編集するシート名を指定
        $worksheet = $spreadsheet->getSheetByName('Sheet1');

        // セルに指定した値挿入
        $worksheet->setCellValue('B9', $event_name_array[0]);
        $worksheet->setCellValue('B10',  $lend_name_array[0]);
        $worksheet->setCellValue('B11', $client_name_array[0]);
        $worksheet->setCellValue('B12', $requester_position_name_array[0]." ".$requester_position_name_array[0]);
       // $worksheet->setCellValue('B9', '');
       // $worksheet->setCellValue('B9', '');
       // $worksheet->setCellValue('B9', '');

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
