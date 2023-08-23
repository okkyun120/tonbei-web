import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

import React, { useState } from 'react';
import { Modal, InputNumber } from 'antd';


function callMovePage($url: string) {
    location.href=$url;
    //alert("Hello!");
}

export default function Dashboard({ auth }: PageProps) {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetYear, setTargetYear] = useState(2023);

  const handleInputChange = (event: any) => {
    // 入力値を更新
    setTargetYear(event.target.value);
  };

    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      // 年間予定表出力
      window.history.pushState(null, '', "/TBPA001/" + targetYear);
      location.reload();

      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">メイン画面</h2>}
        >
            <Head title="メイン画面" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                        <Button
                            style={{width: '240'}}
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={() => callMovePage('/TBDB001')}
                            >
                            　　イベント一覧　　　
                        </Button>   
                        <br /><br /><br />         

                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={() => callMovePage('/TBDM001')}
                            >
                            　ユーザーマスタ一覧　
                        </Button>   
                        <br /><br /><br />         

                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={() => callMovePage('/TBDM002')}
                            >
                            　　会場マスタ一覧　　
                        </Button>   
                        <br /><br /><br />         

                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={() => callMovePage('/TBDM003')}
                            >
                            　取引先マスタ一覧　　
                        </Button>   
                        <br /><br /><br />         

                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={() => callMovePage('/TBDM004')}
                            >
                            　実施形態マスタ一覧　
                        </Button>   
                        <br /><br /><br />         

                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={() => callMovePage('/TBDM005')}
                            >
                            　ジャンルマスタ一覧　
                        </Button>   
                        <br /><br /><br />         

                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={() => callMovePage('/TBDM006')}
                            >
                            回議・報告先マスタ一覧
                        </Button>   
                        <br /><br /><br />     
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={() => showModal()}
                            >
                            　　年間予定表出力　　
                        </Button>   
                        <Modal title="年間予定表出力" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>年度を指定してください。</p>
        <p>
            <InputNumber name="targetYear" min={2013} max={2035} defaultValue={2023}/>
            </p>
      </Modal>    

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
