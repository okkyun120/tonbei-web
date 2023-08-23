<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBCM001Model 
{
    /**
     * Selectアイテム用実施形態マスタ取得
     */
    public static function getSelectItemTypeMst() {

        $sql = <<<SQL
            SELECT
                type_cd,
                type_name
            FROM
                mst_type
            WHERE
                del_flg = false
        SQL;

        return DB::select($sql);
    }

    /**
     * Selectアイテム用ジャンルマスタ取得
     */
    public static function getSelectItemGenreMst() {

        $sql = <<<SQL
            SELECT
                genre_cd,
                genre_name
            FROM
                mst_genre
            WHERE
                del_flg = false
        SQL;

        return DB::select($sql);
    }

    /**
     * Selectアイテム用会場マスタ取得
     */
    public static function getSelectItemVenueMst() {

        $sql = <<<SQL
            SELECT
                venue_cd,
                venue_name
            FROM
                mst_venue
            WHERE
                del_flg = false
        SQL;

        return DB::select($sql);
    }

    /**
     *　Selectアイテム用取引先マスタ
     */
    public static function getSelectItemClientMst() {

        $sql = <<<SQL
            SELECT
                client_cd,
                client_name
            FROM
                mst_client
            WHERE
                del_flg = false
        SQL;

        return DB::select($sql);
    }

    /**
     * ユーザー情報
     */
    public static function getSelectItemUser() {

        $sql = <<<SQL
            SELECT
               id
              ,name
            FROM
                users
            ORDER BY
                name
        SQL;

        return DB::select($sql);
    }




}
