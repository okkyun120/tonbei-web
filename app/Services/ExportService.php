<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;


use App\Models\TBPC006Model;

class ExportService
{
    public function makePdf($file_name, $id)
    {
        // モデルからデータ取得
        $nameData = TBPC006Model::show($id);                // メイン情報
        $circulateData = TBPC006Model::showCirculate($id);                // メイン情報
        
        // もとになるExcelを読み込み
        $excel_file = storage_path('app\excel\template\名義貸与承諾書テンプレート.xlsx');
        $reader = new XlsxReader();
        $spreadsheet = $reader->load($excel_file);

        // 編集するシート名を指定
        $worksheet = $spreadsheet->getSheetByName('Sheet1');

        // 名義貸与決裁番号
        $worksheet->setCellValue('C1', $nameData[0]->name_decision_no);

        // 承認者情報
        if (!empty($circulateData)) {
            $worksheet->setCellValue('B5', $circulateData[0]->position_name);
            $worksheet->setCellValue('C5', $circulateData[0]->chief_name);
        }

        // 顧客情報
        $customerInfo = $nameData[0]->client_name . "　\n" . $nameData[0]->requester_position . "　\n" . $nameData[0]->requester_name . "　";
        $worksheet->setCellValue('A3', $customerInfo);

        // 貸与名義
        $worksheet->setCellValue('A7', $nameData[0]->lend_name);

        // 催事名
        $worksheet->setCellValue('B10', $nameData[0]->event_name);

        // 開催日
        $period = $nameData[0]->period_start;
        if ($nameData[0]->period_end == null) {
            $period .= " ～ " . $nameData[0]->period_end;
        }
        $worksheet->setCellValue('B11', $period);


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
