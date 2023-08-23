<?php


namespace App\Http\Controllers;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\File;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use App\Http\Controllers\Controller;
use App\Services\ExportServiceEventList as ExportService;
use Illuminate\Support\Facades\Storage;


class TBPB001Controller extends Controller
{
    public function exportPdf()
    {

        $file_name = 'イベントリスト_' . date('YmdHis');
        $export_service = new ExportService();
    
        $export_service->makePdf($file_name);

        $file_path = Storage::path('excel/export/' . $file_name . '.xlsx');

        ob_end_clean(); // this
        ob_start(); // and this        

        return response()->download($file_path, $file_name . '.xlsx',
                               ['content-type' => 'application/vnd.ms-excel',])  // (e)
                         ->deleteFileAfterSend(true);                            // (f)

        /*
        //日本語文字化け
        $file_path = Storage::path('pdf/export/' . $file_name . '.pdf');
        $headers = ['Content-Type' => 'application/pdf'];
        return response()->download($file_path, $file_name . '.pdf', $headers);
        */
    }
  
}


/*
    出力はされる

        $templatePath = storage_path('app\excel\template\名義貸与承諾書テンプレート.xlsx');

        $spreadsheet = IOFactory::load($templatePath);
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setCellValue('B9', 'サンプル株式会社');

        File::setUseUploadTempDirectory(public_path());

        $writer = IOFactory::createWriter($spreadsheet, 'Tcpdf');
    //    $writer->setFont('ipaexm');
        $writer->save(storage_path('app\excel'). '\output.pdf');

        $writer = new Xlsx($spreadsheet);
        $writer->save(storage_path('app\excel'). '\output.xlsx');
*/
