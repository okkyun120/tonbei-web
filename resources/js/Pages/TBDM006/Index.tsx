//import * as React from 'react';
import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGridPro,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridToolbar,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  jaJP
} from '@mui/x-data-grid-pro';

import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import { Row, Col, Form, Input } from "antd";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

export type Props = {
    children: React.ReactNode;
}

//export const ClientMstIndex= ()=> {
export  default function CirculateMstIndex( props: any ) {

    const user = usePage<PageProps>().props.auth.user;

    const [rows, setRows] = React.useState<GridRowsProp>(props.circulatelists);

    const handleClick = () => {

//        const id = (rows.length == 0)? 1 : Math.max(...rows.map(v => v.id)) + 1; /* 配列内のオブジェクトidの最大値を求めて+1 */
        const id = (rows.length == 0)? 1 : Math.max(...rows.map(v => v.circulate_cd)) + 1; /* 配列内のオブジェクトidの最大値を求めて+1 */
        const newValue = {
          id: id,
          circulate_cd: id, 
          positon_name: '',
          chief_name: '',
          disp_order: '',
          kaigi_flg: false,
          circulate_flg: false,
          report_flg: false,
          approval_flg: false,
          drafter_flg: false,
          del_flg: false,
          isAdmin: true };
        setRows([...rows,newValue]);
      }    

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    
        axios
            .post('/api/TBDM006/update',         
             {
                circulateMstData: newRow,
                user_id: user.id
             })
            .then((res: any)=>{
                console.log(res);
    
            })
            .catch(error=>{
                console.log(error);
                //alert("は必ず入力して下さい。");
            })    

    return updatedRow;
  };

  useEffect(() => {

    console.log('状態が更新されました:', rows);

  }, [rows]);


  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 40, editable: false },
    { field: 'circulate_cd', headerName: 'CD', width: 60, editable: false },
    {
      field: 'position_name',
      headerName: '役職名',
      type: 'string',
      width:200,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'chief_name',
      headerName: '氏名',
      type: 'string',
      width: 160,
      editable: true,
    },
    {
      field: 'disp_order',
      headerName: '表示順',
      type: 'number',
      width: 80,
      editable: true,
    },
    {
      field: 'kaigi_flg',
      headerName: '回議者',
      width: 80,
      editable: true,
      type: 'boolean',
    },
    {
      field: 'circulate_flg',
      headerName: '回覧先',
      width: 80,
      editable: true,
      type: 'boolean',
      },
    {
      field: 'report_flg',
      headerName: '報告先',
      width: 80,
      editable: true,
      type: 'boolean',
    },
    {
      field: 'approval_flg',
      headerName: '決裁者',
      width: 80,
      editable: true,
      type: 'boolean',
    },
    {
      field: 'drafter_flg',
      headerName: '起案者',
      width: 80,
      editable: true,
      type: 'boolean',
    },
    {
      field: 'del_flg',
      headerName: '非表示',
      width: 80,
      editable: true,
      type: 'boolean',
    },
    {
      field: 'cr_dt',
      headerName: '作成日時',
      type: 'string',
      width: 160,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    {
      field: 'cr_user_id',
      headerName: '作成ユーザーID',
      type: 'string',
      width: 100,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    {
      field: 'up_dt',
      headerName: '更新日時',
      type: 'string',
      width: 160,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    {
      field: 'up_user_id',
      headerName: '更新ユーザーID',
      type: 'string',
      width: 100,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
  ];


  return (
    <AuthenticatedLayout
    user={user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">回議・報告先マスタ編集</h2>}
    >
    <Head title="シン・トンベイ　回議・報告先マスタ編集" />

    <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <div style={{ height: 720, width: '100%'  }}>
                      <Row>
                        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>追加</Button>
                      </Row>
                      <DataGridPro sx={styles.grid} columns={columns} rows={rows} 
                          initialState={{
                              columns: {
                                  columnVisibilityModel: {
                                  id: false,
                                  cr_dt: false,
                                  cr_user_id: false,
                                  up_dt: false,
                                  up_user_id: false,
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
                          processRowUpdate={processRowUpdate}
                          onProcessRowUpdateError={(error) => {
                              console.error('Error updating row:', error);
                              // Handle the error as needed
                            }}
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

