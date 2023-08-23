import * as React from 'react';
import { useContext } from "react";
import { TicketContext } from "./Index";

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
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridValueFormatterParams,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import { Row, Col, Form, Input } from "antd";



import { AnyARecord } from 'dns';

const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows: GridRowsProp = [

];

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
            追加
        </Button>
    </GridToolbarContainer>
  );
}


export type Props = {
    children: React.ReactNode;
}

export default function VenueList() {

    //const ticketData = useContext(TicketContext);

    //console.log(ticketData);


//const TicketList: FC<Props> = (props) => {

  const [rows, setRows] = React.useState(initialRows);
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
      console.log('rowModesModel前', rowModesModel);
      console.log('GridRowModes', GridRowModes);
      console.log('id', id);

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    console.log('rows', rows);
    console.log('rowModesModel後', rowModesModel);
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
    {
      field: 'decision_flg',
      headerName: '仮',
      width: 40,
      editable: true,
      type: 'boolean',
    },
    {
      field: 'venue_name',
      headerName: '会場',
      type: 'singleSelect',
      width: 160,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      valueOptions: ['', '日本武道館', '東京ドーム', ]
    },
    {
      field: 'period_start',
      headerName: '期間（開始）',
      type: 'date',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params.value == null) {
          return '';
        }
        return `${params.value.toLocaleString()} `;
      },
    },
    {
      field: 'period_start2',
      headerName: '',
      type: 'singleSelect',
      width: 40,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      valueOptions: ['', '上旬', '中旬', '下旬', '未定']
    },
    {
      field: 'period_end',
      headerName: '期間（終了）',
      type: 'date',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params.value == null) {
          return '';
        }
        return `${params.value.toLocaleString()} `;
      },
    },
    {
      field: 'period_end2',
      headerName: '',
      type: 'singleSelect',
      width: 40,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      valueOptions: ['', '上旬', '中旬', '下旬', '未定']
    },
    {
      field: 'day_count',
      headerName: '日数/公演数',
      type: 'number',
      width: 60,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'release_dt',
      headerName: '発売日',
      type: 'date',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params.value == null) {
          return '';
        }
        return `${params.value.toLocaleString()} `;
      },
    },
    {
      field: 'capacity',
      headerName: '総キャパ',
      type: 'number',
      width: 80,
      editable: true,
    },
    {
      field: 'audience',
      headerName: '目標動員数',
      type: 'number',
      width: 80,
      editable: true,
    },
    {
      field: 'sepector_num',
      headerName: '実績動員数',
      type: 'number',
      width: 80,
      editable: true,
    },
    {
      field: 'info_disclosure',
      headerName: '情報解禁日',
      type: 'date',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: true,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params.value == null) {
          return '';
        }
        return `${params.value.toLocaleString()} `;
      },
    },
    {
      field: 'remind',
      headerName: '備考',
      type: 'string',
      width: 120,
      editable: true,
    },
    {
      field: 'income',
      headerName: '収入',
      type: 'number',
      width: 100,
      editable: true,
    },
    {
      field: 'outgo',
      headerName: '支出',
      type: 'number',
      width: 100,
      editable: true,
    },
    {
      field: 'balancd',
      headerName: '収支',
      type: 'number',
      width: 100,
      editable: true,
    },
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
              label="保存"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="キャンセル"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="編集"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="削除"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >

      <DataGridPro
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}