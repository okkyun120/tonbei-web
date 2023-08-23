<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBDM001Model 
{
   // use HasFactory;

    /**
     * ユーザーマスタの全レコードの情報を取得する。（移行以外）
     */
    public static function index() {
        $sql = <<<SQL
            SELECT
                id,
                name,
                email
            FROM
                users
            ORDER BY
                name
            SQL;

        return DB::select($sql);
    }

    /**
     * ユーザーマスタのレコードを取得する
     */
    public static function  find(string $user_id) {
        $param = ['user_id' => $user_id];

        $sql = <<<SQL
            SELECT
            row_number() over(order by user1.user_id) as id,
                user_id,
                user_name,
                user_kana,
                user_short_name,
                del_flg
            FROM
                mst_user
            WHERE
                user_id = :user_id
        SQL;

        \Debugbar::log('sql:'.$sql);

        return DB::select($sql, $param);

    }

    /**
     * ユーザーマスタのレコードを追加する
     */
    public static function store(Request $request) {
        // デフォルトパスワードを取得する
        $passwd = config('defaultpassword.password');

        $param = [
            'user_name' => $request->user_name,
            'user_kana' => $request->user_kana,
            'user_short_name' => $request->user_short_name,
            'passwd' => $passwd,
            'del_flg' => $request->del_flg,
        ];

        $sql = <<<SQL
            INSERT INTO mst_user (
                user_id, user_name, user_kana, user_short_name, passwd, del_flg, cr_dt, cr_user_id, up_dt, up_user_id)
            VALUES (
                to_char((
                    SELECT
                        max(a.id)
                    FROM
                        (SELECT
                            (row_number() OVER(ORDER BY user_id)) AS id
                        FROM
                            mst_user
                        ) AS a
                    )
                    + 1, '0000'),
                :user_name,
                :user_kana,
                :user_short_name,
                :passwd,
                :del_flg,
                CURRENT_TIMESTAMP,
                '00000',
                CURRENT_TIMESTAMP,
                '00000'
            )
        SQL;

        return DB::insert( $sql, $param );
    }

    /**
     * ユーザーマスタのレコードを更新する
     */
    public static function update(Request $request) {
        $param = [
            'user_id' => $request->user_id,
            'user_name' => $request->user_name,
            'user_kana' => $request->user_kana,
            'user_short_name' => $request->user_short_name,
            'del_flg' => $request->del_flg,
            'up_user_id' => '00000',
        ];

        $sql = <<<SQL
            UPDATE mst_user
            SET
                user_name = :user_name,
                user_kana = :user_kana,
                user_short_name = :user_short_name,
                del_flg = :del_flg,
                up_user_id = :up_user_id,
                up_dt = CURRENT_TIMESTAMP
            WHERE
                user_id = :user_id
        SQL;

        return DB::update( $sql, $param );
    }

}
