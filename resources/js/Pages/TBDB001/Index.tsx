import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
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
    jaJP
  } from '@mui/x-data-grid-pro';

import { Button, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

//import CopyIcon from "@mui/icons-material/Copy";


//import  {Index}  from "../TBDC001/Index";


export default function EventListIndex( props: any ) {

    const user = usePage<PageProps>().props.auth.user;

 //   const [evtData, setEvtData] = useState([]);

    //　DataGridにデータを入れる
    const rows: GridRowsProp[] = props.evtlists;
        
    // コピーアイコンをクリックしたときの処理
    const handleCopyClick = (params:any) => () => {
 
      console.log(params.row['event_grp_cd']);
   
      const event_grp_cd: string = params.row['event_grp_cd'];
   
      window.history.pushState(null, '', "/TBDC002/" + event_grp_cd + "/copy");
      location.reload();
  };
  


    // 編集アイコンをクリックしたときの処理
    const handleEditClick = (params:any) => () => {
 
    console.log(params.row['event_grp_cd']);
 
    const event_grp_cd: string = params.row['event_grp_cd'];
 
    window.history.pushState(null, '', "/TBDC002/" + event_grp_cd + "/edit");
    location.reload();
};

    // DataGridカラム設定
    const colums: GridColDef[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: (params: GridRowParams) => {
              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="編集"
                  className="textPrimary"
                  onClick={handleEditClick(params)}
                  color="inherit"
                />,
                <GridActionsCellItem
                  icon={<ContentCopyIcon />}
                  label="コピー生成"
                  className="textPrimary"
                  onClick={handleCopyClick(params)}
                  color="inherit"
                />,
              ];
            },
          },
        { field: 'event_status', headerName: 'ステータス', width: 80},
        { field: 'event_grp_cd', headerName: 'イベントCD', width: 80 },
        { field: 'period_start', headerName: '開始日', },
        { field: 'period_end', headerName: '終了日', },
        { field: 'event_name', headerName: 'イベント名', width: 200 },
        { field: 'plan_content', headerName: '企画立案元',  },
        { field: 'venue_name', headerName: '会場', width: 120 },
        { field: 'staff_name', headerName: '担当者',  },
        { field: 'type_name', headerName: '実施形態',  },
        { field: 'genre_name', headerName: 'ジャンル',  },
        { field: 'director_dt', headerName: '局長会',  },
        { field: 'exective_dt', headerName: '常務会',  },
        { field: 'decision_no', headerName: '決裁番号',  },
        { field: 'decision_dt', headerName: '決裁日',  },
        { field: 'transfer_dt', headerName: '移管日',  },
        { field: 'related_parties', headerName: '関係会社', width: 120 },
        { field: 'perfomer1', headerName: '出演者等',  },
    ]

    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarExport />
          </GridToolbarContainer>
        );
      }

  //　各種出力ボタンクイベントハンドラー    
  function handleEventListBtnClick() {

    window.history.pushState(null, '', "/TBPB001");
    location.reload();
  }

  function handleEventCalenderBtnClick() {

    window.history.pushState(null, '', "/TBPB002");
    location.reload();
  }

/*
    setEvtData(props.evtlist.data);
    console.log('evtData:' + evtData);
*/    
    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">イベント一覧</h2>}
        >
            <Head title="シン・トンベイ　イベント一覧" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div style={{ height: 720, width: '100%'  }}>
                            <Grid item>
    <Grid container spacing={2}>
      <Grid item>
        <Button
        variant="contained"
        color="primary"
        onClick={() => handleEventListBtnClick()}
        >イベントリスト
        </Button>
      </Grid>
      <Grid item>
        <Button
        variant="contained"
        color="primary"
        onClick={() => handleEventCalenderBtnClick()}
        >イベントスケジュール
        </Button>
      </Grid>
    </Grid>
  </Grid>
                                <DataGridPro sx={styles.grid} columns={colums} rows={rows} 
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