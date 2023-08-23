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
  rowData: TicketInfo[];
  updateRowData: (newRowData: TicketInfo[]) => void;
}

//　チケット情報インターフェース
export interface TicketInfo {
  id: number,
  event_grp_cd: string,
  ticket_kind: string,
  advance_fee: number,
  the_day_fee: number,
  remind: string,
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
    setRows((oldRows) => [...oldRows, { id, ticket_kind: '', advance_fee: '', the_day_fee: '', remind: '', disp_flg: true, isNew: true }]);
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

const ChildComponent2: React.FC<ChildProps> = ({ rowData, updateRowData }) => {

  const [rows, setRows] = React.useState<TicketInfo[]>(rowData);
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


  /*
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

    // 状態更新後に実行される処理をuseEffect内で行う
    useEffect(() => {
      console.log("updatedRows after setRows: ", rows);
      updateRowData(updatedRows);
    }, [updatedRows]);




    setRows(updatedRows);

    updateRowData(rows);


    return updatedRow;
  };
*/
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

/*


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
          setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
          setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
          }));
        };
      
        return (
          <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
              Add record
            </Button>
          </GridToolbarContainer>
        );
      }
      

        const [rows, setRows] = React.useState<TicketInfo[]>(rowData);
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
//            if (editedRow!.isNew) {
//              setRows(rows.filter((row) => row.id !== id));
//            }
          };
        
          const processRowUpdate = (newRow: GridRowModel) => {
            console.log("processRowUpdate newRow ", newRow);
        
            const updatedRows = rows.map((row) => {
                if (row.id === newRow.id) {
                  const updatedRow = { ...row, ...newRow };
                  console.log("Updated Row:", updatedRow);
                  return updatedRow;
                }
                return row;
              });
            /*
            const updatedRows = rows.map((row) =>
            row.id === newRow.id ? { ...row, newRow } : row

            );
        
          console.log("processRowUpdate 更新１: ", updatedRows);
        
          setRows(updatedRows);
        
          console.log("processRowUpdate 更新２: ", updatedRows);
        
          updateRowData(rows);

          return updatedRows;
        
        };

*/


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
*/


  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'event_grp_cd', headerName: 'イベントコード', width: 70,  },
    { field: 'ticket_kind', headerName: 'チケット種別', width: 200, editable: true },
    { field: 'advance_fee', headerName: '前売料金', width: 100, editable: true, type: 'number' },
    { field: 'the_day_fee', headerName: '当日料金', width: 100, editable: true, type: 'number' },
    { field: 'remind', headerName: '備考', width: 150, editable: true },
    { field: 'disp_flg', headerName: '表示フラグ', width: 50, editable: true, type: 'boolean' },

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
    



export default ChildComponent2;
