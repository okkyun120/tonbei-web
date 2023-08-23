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
  rowData: RelationInfo[];
  updateRowData: (newRowData: RelationInfo[]) => void;
}

//　関係先情報インターフェース
export interface RelationInfo {
  id: number,
  event_grp_cd: string,
  title: string,
  related_parties: string,
  disp_flg: boolean,
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
    setRows((oldRows) => [...oldRows, { id, event_grp_cd: '', title: '', related_parties: '', disp_flg: true, isNew: true }]);
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

const ChildComponent4: React.FC<ChildProps> = ({ rowData, updateRowData }) => {

  const [rows, setRows] = React.useState<RelationInfo[]>(rowData);
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



/*
            const updatedRow = { ...newRow, isNew: false };

            const updatedRows = rows.map((row) =>
                row.id === newRow.id ? { ...row, [newRow.field]: newRow.value } : row
            );
            setRows(updatedRows);

            
            updateRowData(updatedRows);

            console.log("processRowUpdate rows : ", rows);
*/
//            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
            //return updatedRow;
          //}; 
          
          
/*
        const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
          setRowModesModel(newRowModesModel);
        };


          id: number,
  sub_no: number,
  event_grp_cd: string,
  title: string,
  related_parties: string,
  disp_flg: boolean,
*/


  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 40 },
    { field: 'event_grp_cd', headerName: 'イベントコード', width: 40,  },
    { field: 'title', headerName: '見出し', width: 120, editable: true },
    { field: 'related_parties', headerName: '関係先', width: 320, editable: true },
    { field: 'disp_flg', headerName: '表示', width: 40, editable: true, type: 'boolean' },

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

    ];

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
    



export default ChildComponent4;
