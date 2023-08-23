<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class NumberService
{

    public static function numberToJapaneseUnit($num) {
        $units = array('', '万', '億', '兆', '京', '垓', '𥝱');

        $num = strval($num);
        $len = strlen($num);
        $japaneseUnit = '';

        Log::debug("$num : " . $num);
        Log::debug("$len : " . $len);


        // 4桁ごとに単位を追加していく
        for ($i = 0; $i < $len; $i += 4) {
            $subNum = substr($num, max($len - $i - 4, 0), 4);
            $subNum = intval($subNum);
            
            if ($subNum === 0) {
                continue;
            }
            
            $unitIndex = $i / 4;

            \Debugbar::info("unitIndex: " . $units[$unitIndex]);

            $japaneseUnit = $units[$unitIndex] . $japaneseUnit;
        }

        return $japaneseUnit;
    }


    public static function numberToJapaneseUnitSh($num) {

        $billions = floor($num / 100000000); // 億の部分を取得
        $millions = floor(($num % 100000000) / 10000); // 万の部分を取得

        $formattedNumber = '';
        if ($billions > 0) {
            $formattedNumber .= number_format($billions, 0) . '億';
        }
        if ($millions > 0) {
            $formattedNumber .= number_format($millions, 0) . '万';
        }

        return $formattedNumber;
    }

    /**
     * 1行当たりの最大文字数（$maxCharactersPerLine）で改行コードを含む文字列を
     * 全て表示するのに必要な行数を算出する
     */
    public static function calculateNumberOfLines($text, $maxCharactersPerLine) {
        $lines = explode("\n", $text); // 文字列を改行で分割
        $totalLines = 0;
    
        foreach ($lines as $line) {
            $totalLines += ceil(strlen($line) / $maxCharactersPerLine);
        }
    
        return $totalLines;
    }
}