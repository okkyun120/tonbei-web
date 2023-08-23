<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBDM006Model 
{
   /**
     * 回議・報告先ジャンルマスタ全項目の情報を取得する。
     */
    public static function index() {
        $sql = <<<SQL
            SELECT
                row_number() over(order by circulate.circulate_cd) as id,
                circulate.circulate_cd,
                circulate.position_name,
                circulate.chief_name,
                circulate.disp_order,
                circulate.kaigi_flg,
                circulate.circulate_flg,
                circulate.report_flg,
                circulate.approval_flg,
                circulate.drafter_flg,
                circulate.del_flg,
                circulate.cr_dt,
                COALESCE(user2.user_name, 'データ移行') as cr_user_name,
                circulate.up_dt,
                COALESCE(user3.user_name, 'データ移行') as up_user_name
            FROM
                (SELECT
                    circulate_cd,
                    position_name,
                    chief_name,
                    disp_order,
                    kaigi_flg,
                    circulate_flg,
                    report_flg,
                    approval_flg,
                    drafter_flg,
                    del_flg,
                    cr_dt,
                    cr_user_id,
                    up_dt,
                    up_user_id
                FROM
                    mst_circulate
                ) as circulate
            LEFT OUTER join mst_user as user2 on circulate.cr_user_id = user2.user_id
            LEFT OUTER join mst_user as user3 on circulate.up_user_id = user3.user_id
            ORDER BY
                circulate.circulate_cd
            SQL;
        
            \Debugbar::log('sql:'.$sql);

        return DB::select($sql);
    }
    
    /**
     * 回議・報告先マスタのレコードを更新する
     */
    public static function update(Request $request) {

        $datas = $request->input('circulateMstData');

        if ($datas !== null) {
            $user_id = $request->user_id;

            $param = [
                'circulate_cd' => $datas["circulate_cd"],
                'position_name' => $datas["position_name"],
                'chief_name' => $datas["chief_name"],
                'disp_order' => $datas["disp_order"],
                'kaigi_flg' => $datas["kaigi_flg"],
                'circulate_flg' => $datas["circulate_flg"],
                'report_flg' => $datas["report_flg"],
                'approval_flg' => $datas["approval_flg"],
                'drafter_flg' => $datas["drafter_flg"],
                'del_flg' => $datas["del_flg"],
                'user_id' => $user_id,
            ];

            $sql = <<<SQL
                INSERT INTO mst_circulate (
                    circulate_cd, position_name, chief_name, disp_order, kaigi_flg, circulate_flg, report_flg, approval_flg, drafter_flg, del_flg, cr_user_id, up_user_id)
                VALUES (
                    :circulate_cd,
                    :position_name,
                    :chief_name,
                    :disp_order,
                    :kaigi_flg,
                    :circulate_flg,
                    :report_flg,
                    :approval_flg,
                    :drafter_flg,
                    :del_flg,
                    :user_id,
                    :user_id
                )
                on conflict (circulate_cd)
                DO UPDATE SET 
                    position_name = :position_name,
                    chief_name = :chief_name,
                    disp_order = :disp_order,
                    kaigi_flg = :kaigi_flg,
                    circulate_flg = :circulate_flg,
                    report_flg = :report_flg,
                    approval_flg = :approval_flg,
                    drafter_flg = :drafter_flg,
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
