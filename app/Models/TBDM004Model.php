<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBDM004Model 
{
   /**
     * 実施形態マスタ全項目の情報を取得する。
     */
    public static function index() {
        $sql = <<<SQL
            SELECT
            row_number() over(order by msttype.type_cd) as id,
            msttype.type_cd,
            msttype.type_name,
            msttype.name_flg,
            msttype.del_flg,
            msttype.cr_dt,
            COALESCE(user2.user_name, 'データ移行') as cr_user_name,
            msttype.up_dt,
            COALESCE(user3.user_name, 'データ移行') as up_user_name
            FROM
                (SELECT
                    type_cd,
                    type_name,
                    name_flg,
                    del_flg,
                    cr_dt,
                    cr_user_id,
                    up_dt,
                    up_user_id
                FROM
                    mst_type
                ) as msttype
            LEFT OUTER join mst_user as user2 on msttype.cr_user_id = user2.user_id
            LEFT OUTER join mst_user as user3 on msttype.up_user_id = user3.user_id
            ORDER BY
                msttype.type_cd
            SQL;
        
            \Debugbar::log('sql:'.$sql);

        return DB::select($sql);
    }

    /**
     * 実施形態マスタのレコードを追加する
     */
    public static function store(Request $request) {

        $param = [
            'type_name' => $request->type_name,
            'name_flg' => $request->name_flg,
            'del_flg' => $request->del_flg,
        ];

        $sql = <<<SQL
            INSERT INTO mst_type (
                type_cd, type_name, name_flg, del_flg, cr_dt, cr_user_id, up_dt, up_user_id)
            VALUES (
                (
                    SELECT
                        max(type_cd) + 1
                    FROM
                        mst_type
                ),
                :type_name,
                :name_flg,
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
     * 実施形態マスタのレコードを更新する
     */
    public static function update(Request $request) {

        $datas = $request->input('typeMstData');
        if ($datas !== null) {
            $user_id = $request->user_id;

            $param = [
                'type_cd' => $datas["type_cd"],
                'type_name' => $datas["type_name"],
                'name_flg' => $datas["name_flg"],
                'del_flg' => $datas["del_flg"],
                'user_id' => $user_id,
            ];

            $sql = <<<SQL
                INSERT INTO mst_type (
                    type_cd, type_name, name_flg, del_flg, cr_user_id, up_user_id)
                VALUES (
                    :type_cd,
                    :type_name,
                    :name_flg,
                    :del_flg,
                    :user_id,
                    :user_id
                )
                on conflict (type_cd)
                DO UPDATE SET 
                    type_name = :type_name,
                    name_flg = :name_flg,
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
