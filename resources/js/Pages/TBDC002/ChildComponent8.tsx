import React, { useState } from "react";
import axios from "axios";

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import { Modal } from "antd";

import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGridPro,
  GridColDef,
  GridCellEditStopParams,
  GridCellEditStopReasons,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridToolbar,
  jaJP,
  MuiEvent,
} from '@mui/x-data-grid-pro';

import {
    randomId,
  } from '@mui/x-data-grid-generator';
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import { StringIterator } from "lodash";

interface ChildProps {
  rowData: SimilarInfo[];
  updateRowData: (newRowData: SimilarInfo[]) => void;
}

//　類似実績情報インターフェース
interface SimilarInfo {
  id: string,
  event_grp_cd: string,
  other_flg: boolean,
  similar_cd: number,
  sim_event_name: string,
  sim_venue_name: string,
  sim_period: string,
  sim_day_cnt: number,
  sim_capacity: number,
  sim_dayly: number,
  sim_percent: number,
  sim_income: number,
  sim_outgo: number,
  sim_balance: number,     
}

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, event_grp_cd: '', other_flg: false, similar_cd: '', sim_event_name: '', sim_venue_name: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        追加
      </Button>
    </GridToolbarContainer>
  );
}

const ChildComponent8: React.FC<ChildProps> = ({ rowData, updateRowData }) => {

  const [rows, setRows] = React.useState<SimilarInfo[]>(rowData);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  /**
   * モーダルダイアログ制御
   */
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  /**
   * 類似実績選択DataGrid表示データ管理
   */
  const [eventList, setEventList] = useState([]);

  // 類似実績選択DataGridカラム設定
  const columsList: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 40 },
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


  //　類似実績選択ボタンがクリックされたIDを格納
  const [simSelectRowID, setSimSelectRowID] = useState<GridRowId>();

  /**
   * 類似実績選択ボタンがクリックされた時イベントハンドラ
   * 
   * @param id 
   * @returns 
   */
  const handleCopyClick = (id: GridRowId) => () => {
    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    console.log("Button clicked for :", id);

    // 類似実績選択アイコンがクリックされたGridRowIDを格納
    setSimSelectRowID(id);

    // APIで削除・仮登録以外イベント一覧を取得
    axios.get('/api/TBDC002/index')
    .then(res => {
      setEventList(res.data);
      setIsModalOpen(true);
    })
    .catch(error => {
      console.error("Error fetching event list:", error);
    });
  };

  /**
   * 類似実績選択データ管理用
   */
  const [simEventInfo, setSimEventInfo] = useState('');


  /**
   * 類似実績選択用DataGrid行選択イベントハンドラ
   * @param params 
   */
  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    // 類似実績選択データ管理に取得した行の値をセット
    const eventGrpCd: string = params.row["event_grp_cd"];
    console.log('eventGrpCd:', eventGrpCd);
    setSimEventInfo(eventGrpCd);
    console.log('simEventInfo:', simEventInfo);
  };


  const showModal = () => {
    setIsModalOpen(true);
  };


  const handleOk = () => {
    console.log("simEventInfo : ", simEventInfo);

 // 選択された類似実績データを反映させる。
 const selectedRow = rows.find((row) => row.id === simSelectRowID);

 axios.get('/api/TBDC002/sim_show/' + simEventInfo)
   .then(res => {
     const updatedRow = {
       ...selectedRow!,
       sim_event_name: res.data[0]["sim_event_name"],
       sim_venue_name: res.data[0]["sim_venue_name"],
       sim_period: res.data[0]["sim_period"],
       similar_cd: res.data[0]["similar_cd"],
       sim_day_cnt: res.data[0]["sim_day_cnt"],
       sim_capacity: res.data[0]["sim_capacity"],
       sim_dayly: res.data[0]["sim_dayly"],
       sim_percent: res.data[0]["sim_percent"],
       sim_income: res.data[0]["sim_income"],
       sim_outgo: res.data[0]["sim_outgo"],
       sim_balance: res.data[0]["sim_balance"],
     };

     console.log("updatedRow : ", updatedRow);
     setRows((prevRows) => {
      const updatedRows = prevRows.map(row =>
        row.id === simSelectRowID ? updatedRow : row
      );
      console.log("updatedRows : ", updatedRows); // 更新後のデータをログで確認

      updateRowData(updatedRows);
      
      return updatedRows;
    });

  })
  .catch(error => {
    console.error("Error fetching event list:", error);
  });

  setIsModalOpen(false);

};

  const handleCancel = () => {
    setIsModalOpen(false);
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
    /*
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
    */
  };


  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
  
    const updatedRows = rows.map((row) => {
      if (row.id === newRow.id) {
        const updatedRow = { ...row, ...newRow };
        console.log("Updated Row:", updatedRow);
        return updatedRow;
      }
      return row;
    });
  
    setRows(updatedRows);

  // setRows の非同期処理が完了した後に updateRowData を呼び出す
  setTimeout(() => {
    updateRowData(updatedRows);
  }, 200);

    return updatedRow;
  };


  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  
  const columns: GridColDef[] = [

    { field: 'id', headerName: 'ID', width: 70 },
/*
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSimilatButtonClick(params.value)}
        >
          Action
        </Button>
      ),
    },
*/
{
  field: 'actions',
  type: 'actions',
  headerName: 'Actions',
  width: 100,
  cellClassName: 'actions',
getActions: ({ id }) => {
    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

    if (isInEditMode) {
      return [
        <GridActionsCellItem
          icon={<SaveIcon />}
          label="Save"
          sx={{
            color: 'primary.main',
          }}
          onClick={handleSaveClick(id)}
        />,
        <GridActionsCellItem
          icon={<CancelIcon />}
          label="Cancel"
          className="textPrimary"
          onClick={handleCancelClick(id)}
          color="inherit"
        />,
      ];
    }

    return [
      <GridActionsCellItem
        icon={<CopyAllIcon />}
        label="Copy"
        className="textPrimary"
        onClick={handleCopyClick(id)}
        color="inherit"
      />,
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Edit"
        className="textPrimary"
        onClick={handleEditClick(id)}
        color="inherit"
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={handleDeleteClick(id)}
        color="inherit"
      />,
    ];
  },
},
{ field: 'event_grp_cd', headerName: 'イベントコード', width: 70,  },
    { field: 'other_flg', headerName: '他社', width: 70, editable: true, type: 'boolean' },
    { field: 'similar_cd', headerName: 'イベントCD', width: 60, editable: false },
    { field: 'sim_event_name', headerName: 'イベント名', width: 160, editable: true },
    { field: 'sim_venue_name', headerName: '会場名', width: 160, editable: true },
    { field: 'sim_period', headerName: '期間', width: 140, editable: true },
    { field: 'sim_day_cnt', headerName: '公演数', width: 80, editable: true },
    { field: 'sim_capacity', headerName: '動員数', width: 80, editable: true },
    { field: 'sim_dayly', headerName: '日割', width: 80, editable: true },
    { field: 'sim_percent', headerName: '出資比率', width: 80, editable: true },
    { field: 'sim_income', headerName: '収入', width: 80, editable: true },
    { field: 'sim_outgo', headerName: '支出', width: 80, editable: true },
    { field: 'sim_balance', headerName: '収支', width: 80, editable: true },
    ];

    return (
      <React.Fragment>
        <div style={{ height: 300, width: '100%' }}>
          <DataGridPro
            rows={rows}
            columns={columns}
            initialState={{
              columns: {
                  columnVisibilityModel: {
                  id: false,
                  event_grp_cd: false,
                  }
              },
            pagination: {
                paginationModel: { page: 0, pageSize: 10},
                },
            
            }}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => {
                console.error("An error occurred during row update:", error);

              }}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
          />

          <div style={{ height: '600px' }}>
            <Modal width="640" title="自社類似実績選択" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <div style={{ height: 480, width: '720' }}>
                <DataGridPro sx={styles.grid} columns={columsList} rows={eventList} 
                  initialState={{
                    columns: {
                      columnVisibilityModel: {
                        id: false
                      }
                    },
                    pagination: {
                      paginationModel: { page: 0, pageSize: 12},
                    },
                  }}
                  slots={{
                    toolbar: GridToolbar,
                  }}
                  localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
                  onRowClick={handleRowClick}
                  />
              </div>
            </Modal>
          </div>
        </div>
      </React.Fragment>
      );
    }
    
export default ChildComponent8;

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
