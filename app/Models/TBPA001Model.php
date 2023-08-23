<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBPA001Model 
{    
    /**
     * のレコードを取得する
     */
    public static function  show( $yyyy,  $mm,  $genre) {
        $param = ['yyyy' => $yyyy,
                    'mm' => $mm,
                    'genre' => $genre];

        $sql = <<<SQL
        
            SELECT
                tmp.start_month,
                tmp.genre_name,
                tmp.concatenated_event_names
            FROM
                (SELECT
                    DATE_PART('month', search_period_start) AS month,
                    start_month,
                    genre_name,
                    STRING_AGG(event_name, ', ') AS concatenated_event_names
                FROM
                    view_event_calendar
                WHERE
                    EXTRACT(YEAR FROM search_period_start) = :yyyy
                    AND DATE_PART('month', search_period_start) = :mm
                    AND (genre_name = :genre OR genre_name IS NULL) -- Use OR for genre_name condition
                GROUP BY
                    DATE_PART('month', search_period_start),
                    start_month,
                    genre_name
                ORDER BY
                    DATE_PART('month', search_period_start)
                ) AS tmp;
        SQL;

        \Debugbar::log('sql:'.$sql);

        return DB::select($sql, $param);

    }


}
