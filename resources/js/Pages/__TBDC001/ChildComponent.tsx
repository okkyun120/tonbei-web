import * as React from 'react';
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
  MuiEvent,
} from '@mui/x-data-grid-pro';

import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
  } from '@mui/x-data-grid-generator';
  

interface ChildProps {
  rowData: RowData[];
  updateRowData: (newRowData: RowData[]) => void;
}

interface RowData {
  id: number;
  name: string;
  age: number;

}

const ChildComponent: React.FC<ChildProps> = ({ rowData, updateRowData }) => {

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
      

        const [rows, setRows] = React.useState<RowData[]>(rowData);
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

            console.log("handleSaveClick id : ", id);
            console.log("row : ", rows);

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
        */
          console.log("processRowUpdate 更新１: ", updatedRows);
        
          setRows(updatedRows);
        
          console.log("processRowUpdate 更新２: ", updatedRows);
        
          updateRowData(rows);

          return updatedRows;
        
        };




/*
            const updatedRow = { ...newRow, isNew: false };

            const updatedRows = rows.map((row) =>
                row.id === newRow.id ? { ...row, [newRow.field]: newRow.value } : row
            );
            setRows(updatedRows);

            
            updateRowData(updatedRows);
*/
            console.log("processRowUpdate rows : ", rows);

//            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
            //return updatedRow;
          //}; 
          
          

        const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
          setRowModesModel(newRowModesModel);
        };



  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'age', headerName: 'Age', width: 70, editable: true },

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
  
  const handleCellEditCommit = (params: any) => {

    console.log("any : ", params);

    const updatedRows = rowData.map((row) =>
      row.id === params.id ? { ...row, [params.field]: params.value } : row
    );
    updateRowData(updatedRows);

    console.log("updateRowData After: ", updatedRows);

  };

    return (
        <div style={{ height: 300, width: '100%' }}>
          <DataGridPro
        rows={rows}
        columns={columns}
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
      />
        </div>
      );
    }
    



export default ChildComponent;
