<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as XlsxWriter;
use App\Services\NumberService;
use Illuminate\Support\Facades\Log;




use App\Models\TBPA001Model;

class ExportServiceYearCalender
{
    public function makePdf($file_name, $yyyy)
    {
        $genre_array = array("音楽", "クラシック", "舞台", "催事", "グルメ", "スポーツ", "ゼロ名義", "その他");
        
        // もとになるExcelを読み込み
        $excel_file = storage_path('app\excel\template\年間予定表テンプレート.xlsx');
        $reader = new XlsxReader();
        $spreadsheet = $reader->load($excel_file);

        // 編集するシート名を指定
        $worksheet = $spreadsheet->getSheetByName('Sheet1');

        $sourceRowIndex = 4; // コピー元の行インデックス（0から始まる行番号）
        // コピー元の行スタイルを取得
        $sourceRowStyle = $worksheet->getStyle('A' . $sourceRowIndex . ':Z' . $sourceRowIndex);

        $col = 2;
        $mm = 4;

        for ($i = 0; $i < 12; $i++) {
            $col++;
            for ($j = 0; $j < count($genre_array); $j++) {
                if ($mm = 4 + $i > 12) {
                    $yyyy++;
                    $mm = 4 + $i -12;
                };

                $target_yyyy = intval($yyyy);
                $target_mm = intval($mm);

                //dd(count($genre_array));

                $sqlData = TBPA001Model::show($target_yyyy, $target_mm, $genre_array[$j]); 
                $row = 5 + $j;
                if (count($sqlData) > 0 ) {
                    $worksheet->setCellValueByColumnAndRow($col, $row, $sqlData[0]->concatenated_event_names);
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
