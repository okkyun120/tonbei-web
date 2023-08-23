<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TBDM002Model 
{
   /**
     * 会場マスタ全項目の情報を取得する。
     */
    public static function index() {
        $sql = <<<SQL
            SELECT
            row_number() over(order by venue.venue_cd) as id,
            venue.venue_cd,
            venue.venue_name,
            venue.venue_kana,
            venue.zip,
            venue.address,
            venue.remarks,
            venue.del_flg,
            venue.cr_dt,
            venue.cr_user_id,
            COALESCE(user2.user_name, 'データ移行') as cr_user_name,
            venue.up_dt,
            venue.up_user_id,
            COALESCE(user3.user_name, 'データ移行') as up_user_name
            FROM
                (SELECT
                    venue_cd,
                    venue_name,
                    venue_kana,
                    zip,
                    address,
                    remarks,
                    del_flg,
                    cr_dt,
                    cr_user_id,
                    up_dt,
                    up_user_id
                FROM
                    mst_venue
                ) as venue
            LEFT OUTER join mst_user as user2 on venue.cr_user_id = user2.user_id
            LEFT OUTER join mst_user as user3 on venue.up_user_id = user3.user_id
            ORDER BY
                venue.venue_cd
            SQL;
        
            \Debugbar::log('sql:'.$sql);

        return DB::select($sql);
    }

    /**
     *会場マスタのレコードを追加する
     */
    public static function store(Request $request) {

        foreach ($request as $data) {    
            $param = [
                'venue_name' => $data->venue_name,
                'venue_kana' =>$data->$venue_kana,
                'zip' => $data->zip,
                'address' => $data->address,
                'remarks' => $data->remarks,
                'del_flg' => $data->del_flg,
            ];

        }

        $sql = <<<SQL
            INSERT INTO mst_venue (
                venue_cd, venue_name, venue_kana, zip, address, remarks, del_flg, cr_dt, cr_user_id, up_dt, up_user_id)
            VALUES (
                (
                    SELECT
                        max(venue_cd) + 1
                    FROM
                        mst_venue
                ),
                :venue_name,
                :venue_kana,
                :zip,
                :address,
                :remarks,
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
     * 会場マスタのレコードを更新する
     */
    public static function update(Request $request) {

                
            $datas = $request->input('venueMstData');
//dd($datas);
            $dcnt = strval(count($datas));
                $param = [
                    'venue_cd' => $datas['venue_cd'],
                    'venue_name' => $datas['venue_name'],
                    'venue_kana' => $datas['venue_kana'],
                    'zip' => $datas['zip'],
                    'address' => $datas['address'],
                    'remarks' => $datas['remarks'],
                    'del_flg' => $datas['del_flg'],
                    'cr_user_id' => 1,
                    'up_user_id' => 1,
                ];


                $sql = <<<SQL
                    INSERT INTO mst_venue (
                        venue_cd, venue_name, venue_kana, zip, address, remarks, del_flg, cr_user_id, up_user_id)
                    VALUES (
                        :venue_cd,
                        :venue_name,
                        :venue_kana,
                        :zip,
                        :address,
                        :remarks,
                        :del_flg,
                        :cr_user_id,
                        :up_user_id
                    )
                    on conflict (venue_cd)
                    DO UPDATE SET 
                        venue_name = :venue_name,
                        venue_kana = :venue_kana,
                        zip = :zip,
                        address = :address,
                        remarks = :remarks,
                        del_flg = :del_flg,
                        cr_dt = CURRENT_TIMESTAMP,
                        cr_user_id = :up_user_id,
                        up_dt = CURRENT_TIMESTAMP,
                        up_user_id = :up_user_id
                SQL;

                DB::update( $sql, $param );
            
            
            return true;
    }

}
