import * as React from 'react';
import {useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
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
  jaJP,
  MuiEvent,
} from '@mui/x-data-grid-pro';

import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
  } from '@mui/x-data-grid-generator';

interface ChildProps {
  rowData: VenueInfo[];
  venueSelectItem: any[];
  updateRowData: (newRowData: VenueInfo[]) => void;
}

//　会場情報インターフェース
export interface VenueInfo {
  id: number,
  event_grp_cd: number,
  venue_cd: number,
  period_start: string,
//  period_start_etc: string,
  search_period_start: Date,
  period_end: string,
//  period_end_etc: string,
  day_count: number,
  curtain_time: string,
  release_dt: string,
  capacity: number,
  audience: number,
  sepector_num: number,
  info_disclosure: string,
  remind: string,
  income: number,
  outgo: number,
  balance: number,
  decision_flg: boolean,
  del_flg: boolean,
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
    setRows((oldRows) => [...oldRows, {
          id,
          event_grp_cd:'',
          venue_cd: '', 
          period_start: '', 
//          period_start_etc: '',
          search_period_start: '', 
          period_end: '', 
//          period_end_etc: '',
          day_count:'',
          curtain_time: '',
          release_dt: '',
          capacity: '',
          audience: '',
          sepector_num: '',
          info_disclosure: '',
          remind: '',
          income: '',
          outgo: '',
          balance: '',
          decision_flg: false,
          del_flg: true,
          isNew: true }]);
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

const ChildComponent1: React.FC<ChildProps> = ({ rowData, venueSelectItem, updateRowData }) => {
  console.log("rowData : " , rowData);
  console.log("venuItem : " , venueSelectItem);

  const [rows, setRows] = React.useState<VenueInfo[]>(rowData);
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

  };


  const processRowUpdate = (newRow: GridRowModel) => {

    console.log("newRow :", newRow);

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


/**
   * 会場選択項目設定
   *
   */
const itemOptions = venueSelectItem.map((venue) => ({
  value: venue.venue_cd,
  label: venue.venue_name,
}));

  const columns: GridColDef[] = [
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
  { field: 'id', headerName: 'ID', width: 40 },
    { field: 'decision_flg', headerName: '仮', width: 70, editable: true, type: 'boolean' },
    { field: 'venue_cd', headerName: '会場名', width: 160,  editable: true, type: 'singleSelect', valueOptions: itemOptions },
    { field: 'period_start', headerName: '期間(開始日)', width: 160, editable: true, type: 'string' },
//    { field: 'period_start_etc', headerName: '', width: 200, editable: true, mui select item db 取得データ, valueOptions: ['上旬', '中旬', '下旬', '未定'] },
    { field: 'search_period_start', headerName: '開始日(必須)', width: 160, editable: true, type: 'date' , valueGetter: (params) => new Date(params.value)},
    { field: 'period_end', headerName: '期間(終了日)', width: 120, editable: true, type: 'string' },
//    { field: 'period_end_etc', headerName: '', width: 200, editable: true, type: 'singleSelect', valueOptions: ['上旬', '中旬', '下旬', '未定'] },
    { field: 'day_count', headerName: '公演数', width: 80, editable: true, type:'number' },
    { field: 'curtain_time', headerName: '開演時間', width: 120, editable: true },
    { field: 'release_dt', headerName: '発売日', width: 120, editable: true },
    { field: 'capacity', headerName: '総キャパ', width: 80, editable: true, type:'number' },
    { field: 'audience', headerName: '動員数', width: 80, editable: true, type:'number' },
    { field: 'sepector_num', headerName: '実績動員数', width: 80, editable: true },
    { field: 'info_disclosure', headerName: '情報解禁日', width: 120, editable: true },
    { field: 'remind', headerName: '備考', width: 100, editable: true },
    { field: 'income', headerName: '各会場収入', width: 100, editable: true, type:'number' },
    { field: 'outgo', headerName: '各会場支出', width: 100, editable: true, type:'number' },
    { field: 'balance', headerName: '各会場収支', width: 100, editable: true, type:'number' },
    ];


    console.log("rows", rows);
    console.log("columns", columns);

    return (
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
        </div>
      );
    }
    
export default ChildComponent1;
