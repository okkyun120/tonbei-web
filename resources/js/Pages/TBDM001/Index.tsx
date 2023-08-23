import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowsProp,
    GridToolbarExport,
    DataGridPro,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridRowParams,
    GridToolbar,
    GridRowModesModel,
    GridRowModes,
    jaJP
} from '@mui/x-data-grid-pro';

import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import { Row, Col, Form, Input } from "antd";


//export const ClientMstIndex= ()=> {
export  default function UserMstIndex( props: any ) {

    const user = usePage<PageProps>().props.auth.user;

    const [rows, setRows] = React.useState<GridRowsProp>(props.userlists);

    const handleClick = () => {

        const id = (rows.length == 0)? 1 : Math.max(...rows.map(v => v.id)) + 1; /* 配列内のオブジェクトidの最大値を求めて+1 */
        const newValue = { id: id, };
        setRows([...rows,newValue]);
      }


      function listUpdate() {
        // 入力値を投げる
        axios
            .post('/api/TBDM001/update',         
             {
                rows
             })
            .then((res: any)=>{
                console.log(res);
    
            })
            .catch(error=>{
                console.log(error);
            })    
    
    }
    
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

  const editedRow = rows.find((row) => row.id === id);
  if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
      }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 40, editable: false },
    {
      field: 'name',
      headerName: '名前',
      type: 'string',
      width: 100,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    {
        field: 'email',
        headerName: 'e-mail',
        type: 'string',
        width: 120,
        editable: false,
      },

];

  return (
    <AuthenticatedLayout
    user={user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">ユーザーマスタ編集</h2>}
>
    <Head title="シン・トンベイ　ユーザーマスタ編集" />

    <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <div style={{ height: 720, width: '100%'  }}>
                        
                        <DataGridPro sx={styles.grid} columns={columns} rows={rows} 
                            initialState={{
                            columns: {
                                columnVisibilityModel: {
                                id: false
                                }
                            },
                            pagination: {
                                paginationModel: { page: 0, pageSize: 20},
                            },
                            
                            }}
                            slots={{
                                toolbar: GridToolbar,
                              }}
                            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
                            />
                    </div> 
               </div> 
            </div>
        </div>
    </div>
</AuthenticatedLayout>
);
}

const styles = {
    grid: {
      '.MuiDataGrid-toolbarContainer': {
        borderBottom: 'solid 1px rgba(224, 224, 224, 1)'  
      },
      '.MuiDataGrid-row .MuiDataGrid-cell:not(:last-child)': {
        borderRight: 'solid 1px rgba(224, 224, 224, 1) !important'
      },
       // 列ヘッダに背景色を指定
      '.MuiDataGrid-columnHeaders': {
        backgroundColor: '#65b2c6', 
        color: '#fff',
      }
    }
}


/*
import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowsProp , GridActionsCellItem, GridRowParams, jaJP } from '@mui/x-data-grid';
//import { Grid } from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";

import { Row, Col, Button, Modal, Form, Input, Checkbox, Breadcrumb } from "antd";

export const UserMstIndex = ()=> {
    
    // APIでデータ取得
    const [datas,setDatas] = useState([]);

//    const urlAPI = "http://localhost/api/TBDM001/index";
    const urlAPI = "/api/TBDM001/index";

    useEffect( ()=> {
        axios.get(urlAPI).then((res)=> {
            setDatas(res.data);
          })
        },[]);
    
    // 追加用データ配列
    const[addData, setAddData] = useState<{[key: string]: any}>({
        user_name: '',
        user_kana: '',
        user_short_name: '',
        del_flg: false,
        } );

    // 追加用ダイアログ開閉処理
    const[isAddModalOpen, setAddModalOpen] = useState(false);

    const handleAddClick = () => {
        setAddModalOpen(true);
    }

    const handleAddOk = async(values: any): Promise<void> => {
        console.log("values :  ", values);

        // 登録処理
        // 入力値を投げる
        axios
        .post('/api/TBDM001/store',         
        {
            user_name: values.user_name,
            user_kana: values.user_kana,
            user_short_name: values.user_short_name,
            del_flg: values.del_flg,
        })
        .then((res: any)=>{
            console.log(res);
            setAddData(res.data);
        })
        .catch(error=>{
            console.log(error);
        })

        setAddModalOpen(false);
    }


    const handleAddCancel = () => {
        setAddModalOpen(false);
    }
  
      // 更新用データ配列
      const[editData, setEditData] = useState<{[key: string]: any}>({
        user_id: '',
        user_name: '',
        user_kana: '',
        user_short_name: '',
        del_flg: false,
        up_dt: '',
        } );


    // 編集アイコンをクリックしたときの処理
    const handleEditClick = React.useCallback(
        (params: GridRowParams) => (event: { stopPropagation: () => void }) => {
            // モーダルダイアログ表示
            setEditModalOpen(true);
            // クリックした行の編集データを取得
            setEditData(params.row);
        },
        []
    )
 
    // 編集用ダイアログ開閉処理
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    // 表示するアクションを返す関数
    const getEditAction = React.useCallback(
        (params: GridRowParams) => [
        <GridActionsCellItem
            icon={<EditIcon />}
            label="編集"
            onClick={handleEditClick(params)}
            color="inherit"
        />
        ],
        [handleEditClick]
    )

  // モーダルダイアログの【登録】ボタンがクリックされた時の処理
  const handleEditOk = (values: any) => {
    //console.log("values :  ", values);
  
    // 入力値を投げる
    axios
        .post('/api/TBDM001/update',         
         {
            user_id: values.user_id,
            user_name: values.user_name,
            user_kana: values.user_kana,
            user_short_name: values.user_short_name,
            del_flg: values.del_flg,
            up_dt: values.up_dt,
        })
        .then((res: any)=>{
            console.log(res);
            setEditData(res.data);
        })
        .catch(error=>{
            console.log(error);
        })

        setEditModalOpen(false);
  };

  const handleEditCancel = () => {
      setEditModalOpen(false);
  }

    // DataGridカラム設定
    const colums: GridColDef[] = [
        {
            field: 'detailAction',
            headerName: '',
            align: 'left',
            width: 60,
            type: 'actions', // action を指定
            getActions: getEditAction // GridActionsCellItem コンポーネントを指定
         } as GridColDef,
        { field: 'id', headerName: 'ID' },
        { field: 'user_id', headerName: 'ID', width: 80 },
        { field: 'user_name', headerName: 'ユーザー名', width: 200 },
        { field: 'user_kana', headerName: 'ユーザー名カナ', width: 200 },
        { field: 'user_short_name', headerName: '略称', width: 120 },
        { field: 'del_flg', headerName: '削除', width: 60 },
        { field: 'cr_dt', headerName: '作成日時', width: 160 },
        { field: 'cr_user_name', headerName: '作成者', width: 120 },
        { field: 'up_dt', headerName: '更新日時', width: 160 },
        { field: 'up_user_name', headerName: '更新者', width: 120 },
    ]

    //　DataGridにデータを入れる
    const rows: GridRowsProp[] = datas



    const UserMstAddForm = () => {
        const [form] = Form.useForm();

        return (
            <Modal
                title="ユーザーマスタ登録"
                open={isAddModalOpen}
                okText ="登録"
                onOk= {() => {
                    form
                        .validateFields()
                        .then((values) => {
                            handleAddOk(values);

                        })
                        .catch((info) => console.log("バリデーションエラー : ", info));
                }}
                cancelText="キャンセル"
                onCancel={handleAddCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        user_name: '',
                        user_kana: '',
                        user_short_name: '',
                        del_flg: false,
                    }}>
                        <Form.Item
                            name="user_name"
                            label="ユーザー名"
                            rules={[
                                {required: true, message: "ユーザー名を入力してください。"},
                                {max: 15, message: "ユーザー名は15文字以内で入力してください。"},
                            ]}>
                                <Input/>
                        </Form.Item>
                        <Form.Item
                            name="user_kana"
                            label="ユーザー名カナ"
                            rules={[
                                {max: 15, message: "ユーザー名カナは15文字以内で入力してください。"},
                            ]}>
                                <Input/>
                        </Form.Item>
                        <Form.Item
                            name="user_short_name"
                            label="略称"
                            rules={[
                                {required: true, message: "略称を入力してください。"},
                                {max: 10, message: "略称は10文字以内で入力してください。"},
                            ]}>
                                <Input />
                        </Form.Item>
                        <Form.Item
                            name="del_flg"
                            valuePropName="checked"
                            >
                                <Checkbox>削除</Checkbox>
                        </Form.Item>
                </Form>
            </Modal>
        );
    }

    const UserMstEditForm = () => {
        const [form] = Form.useForm();
        console.log(editData);

        return (
            <Modal
                title="ユーザーマスタ編集"
                open={isEditModalOpen}
                okText ="登録"
                onOk= {() => {
                    form
                        .validateFields()
                        .then((values) => {
                            handleEditOk(values);
                        })
                        .catch((info) => console.log("バリデーションエラー : ", info));
                }}
                cancelText="キャンセル"
                onCancel={handleEditCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        user_id: editData.user_id,
                        user_name: editData.user_name,
                        user_kana: editData.user_kana,
                        user_short_name: editData.user_short_name,
                        del_flg: editData.del_flg,
                        up_dt: editData.up_dt,
                    }}>
                        <Form.Item
                            name="user_name"
                            label="ユーザー名"
                            rules={[
                                {required: true, message: "ユーザー名を入力してください。"},
                                {max: 15, message: "ユーザー名は15文字以内で入力してください。"},
                            ]}>
                                <Input/>
                        </Form.Item>
                        <Form.Item
                            name="user_kana"
                            label="ユーザー名カナ"
                            rules={[
                                {max: 15, message: "ユーザー名カナは15文字以内で入力してください。"},
                            ]}>
                                <Input/>
                        </Form.Item>
                        <Form.Item
                            name="user_short_name"
                            label="略称"
                            rules={[
                                {required: true, message: "略称を入力してください。"},
                                {max: 10, message: "略称は10文字以内で入力してください。"},
                            ]}>
                                <Input />
                        </Form.Item>
                        <Form.Item
                            name="del_flg"
                            valuePropName="checked"
                            >
                                <Checkbox>削除</Checkbox>
                        </Form.Item>
                        <Form.Item
                            name="user_id"
                            >
                                <Input type="hidden"/>
                        </Form.Item>
                        <Form.Item
                            name="up_dt"
                            >
                                <Input type="hidden"/>
                        </Form.Item>
                </Form>
            </Modal>
        );

    }
    
    return (
        <React.Fragment>
            <div>
                <Row style={{margin:'10px'}}>
                    <Col span={24}><h1>ユーザーマスタ一覧</h1></Col>
                </Row>
                <Row style={{margin:'10px'}}>
                    <Col span={24}>
                        <Breadcrumb
                            items={[
                            {
                                title: <a href="/">メインメニュー</a>,
                            },
                            {
                                title: <a href="">マスターメニュー</a>,
                            },
                            {
                                title: 'ユーザーマスタ一覧',
                            },
                            ]}
                        />
                    </Col>
                </Row>
                <Row style={{margin:'10px'}}>
                    <Col span={20}></Col>
                    <Col span={4}><Button onClick={handleAddClick}>追加</Button></Col>
                </Row>
		    </div>

            <div style={{ height: 720, width: '100%'  }}>
                <DataGrid sx={styles.grid} columns={colums} rows={rows} 
                    initialState={{
                    columns: {
                        columnVisibilityModel: {
                        id: false
                        }
                    },
                    pagination: {
                        paginationModel: { page: 0, pageSize: 20},
                    },
                }}/>
            </div>
            <div>
                <UserMstEditForm />

            </div>
            <div>
                <UserMstAddForm />

            </div>
        </React.Fragment>
  
   );
}

const styles = {
    grid: {
      '.MuiDataGrid-toolbarContainer': {
        borderBottom: 'solid 1px rgba(224, 224, 224, 1)'  
      },
      '.MuiDataGrid-row .MuiDataGrid-cell:not(:last-child)': {
        borderRight: 'solid 1px rgba(224, 224, 224, 1) !important'
      },
       // 列ヘッダに背景色を指定
      '.MuiDataGrid-columnHeaders': {
        backgroundColor: '#65b2c6', 
        color: '#fff',
      }
    }
}
*/