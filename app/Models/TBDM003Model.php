<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBDM003Model 
{
   /**
     * 取引先マスタ全項目の情報を取得する。
     */
    public static function index() {
        $sql = <<<SQL
            SELECT
            row_number() over(order by client.client_cd) as id,
            client.client_cd,
            client.client_name,
            client.short_name,
            client.client_kana,
            client.del_flg,
            client.cr_dt,
            client.cr_user_id,
            COALESCE(user2.user_name, 'データ移行') as cr_user_name,
            client.up_dt,
            client.up_user_id,
            COALESCE(user3.user_name, 'データ移行') as up_user_name
            FROM
                (SELECT
                    client_cd,
                    client_name,
                    short_name,
                    client_kana,
                    del_flg,
                    cr_dt,
                    cr_user_id,
                    up_dt,
                    up_user_id
                FROM
                    mst_client
                ) as client
                LEFT OUTER join mst_user as user2 on client.cr_user_id = user2.user_id
                LEFT OUTER join mst_user as user3 on client.up_user_id = user3.user_id
            WHERE
                client_cd > 1
            ORDER BY
                client.client_cd
            SQL;
            
        return DB::select($sql);
    }

    /**
     * 取引先マスタのレコードを追加する
     */
    public static function store(Request $request) {

        $param = [
            'client_name' => $request->client_name,
            'short_name' => $request->$short_name,
            'client_kana' => $request->client_kana,
            'del_flg' => $request->del_flg,
        ];

        \Debugbar::log('request : '.$request);

        $sql = <<<SQL
            INSERT INTO mst_client (
                client_cd, client_name, short_name, client_kana, del_flg, cr_dt, cr_user_id, up_dt, up_user_id)
            VALUES (
                (
                    SELECT
                        max(client_cd) + 1
                    FROM
                        mst_client
                ),
                :client_name,
                :short_name,
                :client_kana,
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
     * 取引先マスタのレコードを更新する
     */
    public static function update(Request $request) {

        $datas = $request->input('clientMstData');
        $user_id = $request->user_id;

        if ($datas !== null) {

            $param = [
                'client_cd' =>  $datas["client_cd"],
                'client_name' => $datas["client_name"],
                'short_name' => $datas["short_name"],
                'client_kana' => $datas["client_kana"],
                'del_flg' => $datas["del_flg"],
                'user_id' => $user_id,
            ];

            $sql = <<<SQL
                INSERT INTO mst_client (
                    client_cd, client_name, short_name, client_kana, del_flg, cr_user_id, up_user_id)
                VALUES (
                    :client_cd,
                    :client_name,
                    :short_name,
                    :client_kana,
                    :del_flg,
                    :user_id,
                    :user_id
                )
                on conflict (client_cd)
                DO UPDATE SET 
                    client_name = :client_name,
                    short_name = :short_name,
                    client_kana = :client_kana,
                    del_flg = :del_flg,
                    cr_dt = CURRENT_TIMESTAMP,
                    cr_user_id = :user_id,
                    up_dt = CURRENT_TIMESTAMP,
                    up_user_id = :user_id
                SQL;

                DB::update( $sql, $param );
        }
    }
}


