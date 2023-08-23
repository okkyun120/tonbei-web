<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBDM005Model 
{
   /**
     * ジャンルマスタ全項目の情報を取得する。
     */
    public static function index() {
        $sql = <<<SQL
            SELECT
            row_number() over(order by genre.genre_cd) as id,
            genre.genre_cd,
            genre.genre_name,
            genre.type_kind,
            genre.del_flg,
            genre.cr_dt,
            COALESCE(user2.user_name, 'データ移行') as cr_user_name,
            genre.up_dt,
            COALESCE(user3.user_name, 'データ移行') as up_user_name
            FROM
                (SELECT
                    genre_cd,
                    genre_name,
                    type_kind,
                    del_flg,
                    cr_dt,
                    cr_user_id,
                    up_dt,
                    up_user_id
                FROM
                    mst_genre
                ) as genre
            LEFT OUTER join mst_user as user2 on genre.cr_user_id = user2.user_id
            LEFT OUTER join mst_user as user3 on genre.up_user_id = user3.user_id
            ORDER BY
            genre.genre_cd
            SQL;
        
            \Debugbar::log('sql:'.$sql);

        return DB::select($sql);
    }

    /**
     * ジャンルマスタのレコードを追加する
     */
    public static function store(Request $request) {

        $param = [
            'genre_name' => $request->genre_name,
            'type_kind' => $request->type_kind,
            'del_flg' => $request->del_flg,
        ];

        $sql = <<<SQL
            INSERT INTO mst_genre (
                genre_cd, genre_name, type_kind, del_flg, cr_dt, cr_user_id, up_dt, up_user_id)
            VALUES (
                (
                    SELECT
                        max(genre_cd) + 1
                    FROM
                    mst_genre
                ),
                :genre_name,
                :type_kind,
                :del_flg,
                CURRENT_TIMESTAMP,
                '00000',
                CURRENT_TIMESTAMP,
                '00000'
            )
        SQL;

        \Debugbar::log('insert sql:'.$sql);

        return DB::insert( $sql, $param );
    }

    /**
     * ジャンルマスタのレコードを更新する
     */
    public static function update(Request $request) {

        $datas = $request->input('genreMstData');
        if ($datas !== null) {
            $user_id = $request->user_id;

            $param = [
                'genre_cd' => $datas["genre_cd"],
                'genre_name' => $datas["genre_name"],
                'type_kind' => $datas["type_kind"],
                'del_flg' => $datas["del_flg"],
                'user_id' => $user_id,
            ];

            $sql = <<<SQL
                INSERT INTO mst_genre (
                    genre_cd, genre_name, type_kind, del_flg, cr_user_id, up_user_id)
                VALUES (
                    :genre_cd,
                    :genre_name,
                    :type_kind,
                    :del_flg,
                    :user_id,
                    :user_id
                )
                on conflict (genre_cd)
                DO UPDATE SET 
                    genre_name = :genre_name,
                    type_kind = :type_kind,
                    del_flg = :del_flg,
                    cr_dt = CURRENT_TIMESTAMP,
                    cr_user_id = :user_id,
                    up_dt = CURRENT_TIMESTAMP,
                    up_user_id = :user_id
                SQL;

            return DB::update( $sql, $param );

        }
    }

}
