<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;

use App\Models\TBPC005Model;

class ExportServiceNameDecision 
{
    public function makePdf($file_name, $id)
    {
        // モデルからデータ取得
        $nameData = TBPC005Model::showMain($id);     
        $relationData = TBPC005Model::showRelation($id);
        $periodData = TBPC005Model::showPeriod($id);
        $sqlCirculate = TBPC005Model::showCirculate($id);

        
        // もとになるExcelを読み込み
        $excel_file = storage_path('app\excel\template\名義貸与決裁書テンプレート.xlsx');
        $reader = new XlsxReader();
        $spreadsheet = $reader->load($excel_file);

        // 編集するシート名を指定
        $worksheet = $spreadsheet->getSheetByName('Sheet1');

        // セルに指定した値挿入
        $worksheet->setCellValue('C6', $nameData[0]->name_decision_no);

        $worksheet->setCellValue('B9', $nameData[0]->event_name);
        $worksheet->setCellValue('B10',  $nameData[0]->lend_name);
        $worksheet->setCellValue('B11', $nameData[0]->client_name);

        $data_cnt = 0;
        $col = 1;
        $row = 12;

        foreach ($relationData as $data) {
            // 見出し
            $worksheet->setCellValueByColumnAndRow($col, $row + $data_cnt, $data->title); 
            // 関係先
            $worksheet->setCellValueByColumnAndRow($col + 1, $row + $data_cnt, $data->related_parties); 
            $data_cnt++;
        }

        for ($i = $row + $data_cnt; $i <= 16; $i++) {
            $rowDimension = $worksheet->getRowDimension($i);
            $rowDimension->setVisible(false);            
        }

        $period = "";
        $venue = "";

        foreach ($periodData as $data) {
            $period .= $data->period_start;
            if ($data->period_end !== null) {
                $period .= "～" . $data->period_end;
            }
            $period .= "\n";
            
            $venue .= $data->venue_name . "\n";
        }


        $worksheet->setCellValue('B18', $period);
        $worksheet->setCellValue('F18', $venue);

        $worksheet->setCellValue('B19', $nameData[0]->content);
        $worksheet->setCellValue('B20', $nameData[0]->staff_name);

        $worksheet->setCellValue('C24', $nameData[0]->income_item1);
        $worksheet->setCellValue('C25', $nameData[0]->income_item2);
        $worksheet->setCellValue('C26', $nameData[0]->income_item3);

        $worksheet->setCellValue('D24', $nameData[0]->income_amount1);
        $worksheet->setCellValue('D25', $nameData[0]->income_amount2);
        $worksheet->setCellValue('D26', $nameData[0]->income_amount3);
        $worksheet->setCellValue('D28', $nameData[0]->income_total);

        $worksheet->setCellValue('G24', $nameData[0]->outgo_item1);
        $worksheet->setCellValue('G25', $nameData[0]->outgo_item2);
        $worksheet->setCellValue('G26', $nameData[0]->outgo_item3);

        $worksheet->setCellValue('I24', $nameData[0]->outgo_amount1);
        $worksheet->setCellValue('I25', $nameData[0]->outgo_amount2);
        $worksheet->setCellValue('I26', $nameData[0]->outgo_amount3);
        $worksheet->setCellValue('I28', $nameData[0]->outgo_total);

        $worksheet->setCellValue('B30', $nameData[0]->remind);


        //　起案者者取得
        $filteredDrafter = array_filter($sqlCirculate, function ($item) {
            return $item->drafter_flg == true;
        });

        $drafterDepartment = "";
        $drafterName = "";
        foreach($filteredDrafter as $drafter) {
            $drafterDepartment = $drafter->position_name;
            $drafterName = $drafter->chief_name;
        }

        $worksheet->setCellValue('B21', $drafterDepartment . " " . $drafterName);

        //  報告先
        $report_dat = "";
        $filteredReport = array_filter($sqlCirculate, function ($item) {
            return $item->report_flg == true;
        });
        foreach($filteredReport as $report) {
            $approvalDepartment = $report->position_name;
            $approvalName = $report->chief_name;

            $report_dat .= $approvalDepartment . $approvalName . "\n";
        }
        $worksheet->setCellValue('J2', $report_dat );


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
