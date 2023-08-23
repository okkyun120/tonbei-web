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


const initialRows: GridRowsProp = [
  {
      id: randomId(),
      ticket_kind: 'S席（指定）',
      advance_fee: 5000,
      the_day_fee: 6000,
      remind: '備考入力１',
      disp_flg: true,
  },
  {
      id: randomId(),
      ticket_kind: 'A席（指定）',
      advance_fee: 4000,
      the_day_fee: 4800,
      remind: '備考入力２',
      disp_flg: true,
  },
  {
    id: randomId(),
    ticket_kind: 'B席（指定）',
    advance_fee: 3000,
    the_day_fee: 3600,
    remind: '備考入力３',
    disp_flg: true,
},
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

export default function SimilarList() {

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
  {
    field: 'other_flg',
    headerName: '他社',
    width: 40,
    editable: true,
    type: 'boolean',
  },
  {
    field: 'similar_cd',
    headerName: 'イベントCD',
    type: 'number',
    width: 40,
    align: 'left',
    headerAlign: 'left',
    editable: false,
  },
  {
    field: 'sim_event_name',
    headerName: 'イベント名',
    type: 'string',
    width: 120,
    align: 'left',
    headerAlign: 'left',
    editable: true,
  },
  {
    field: 'sim_venue_name',
    headerName: '会場名',
    type: 'string',
    width: 120,
    align: 'left',
    headerAlign: 'left',
    editable: true,
  },
  {
    field: 'sim_period',
      headerName: '期間',
    type: 'string',
    width: 120,
    align: 'left',
    headerAlign: 'left',
    editable: true,
  },
  {
    field: 'sim_day_cnt',
    headerName: '公演数',
    type: 'number',
    width: 40,
    align: 'left',
    headerAlign: 'left',
    editable: true,
  },
  {
    field: 'sim_capacity',
    headerName: '動員数',
    type: 'number',
    width: 40,
    align: 'left',
    headerAlign: 'left',
    editable: true,
  },
  {
    field: 'sim_dayly',
    headerName: '日割',
    type: 'number',
    width: 40,
    align: 'left',
    headerAlign: 'left',
    editable: true,
  },
  {
    field: 'sim_average',
    headerName: '比率',
    type: 'number',
    width: 40,
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
    field: 'sim_income',
    headerName: '日数/公演数',
    type: 'number',
    width: 60,
    align: 'left',
    headerAlign: 'left',
    editable: true,
  },
  {
    field: 'sim_outgo',
    headerName: '発売日',
    type: 'date',
    width: 80,
    align: 'left',
    headerAlign: 'left',
    editable: true,
  },
  {
    field: 'sim_balance',
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
      return [
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
/*
const columns: GridColDef[] = [
  { field: 'ticket_kind', headerName: 'チケット種別', width: 180, editable: true },
  {
    field: 'advance_fee',
    headerName: '前売料金',
    type: 'number',
    width: 80,
    align: 'left',
    headerAlign: 'left',
    editable: true,
  },
  {
    field: 'the_day_fee',
    headerName: '当日料金',
    type: 'number',
    width: 80,
    editable: true,
  },
  {
    field: 'remind',
    headerName: '備考',
    type: 'string',
    width: 80,
    editable: true,
  },
  {
    field: 'disp_flg',
    headerName: '表示',
    width: 40,
    editable: true,
    type: 'boolean',
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
*/
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

/*

import { AnyARecord } from 'dns';

const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows: GridRowsProp = [
    {
        id: randomId(),
        other_flg: false,
        similar_cd: 738,
        sim_event_name: '類似イベント１',
        sim_venue_name: 'テスト会場',
        sim_period: '2015/1/17～2015/1/18',
        sim_day_cnt: 2,
        sim_capacity: 5658,
        sim_dayly: 2824,
        sim_sales_good: 180000,
        sim_unit_price: null,
        sim_average: null,
        sim_percent: 0.35,
        sim_income: 1000000,
        sim_outgo: 800000,
        sim_balance: 200000,
    },
    {
        id: randomId(),
        other_flg: true,
        similar_cd: 738,
        sim_event_name: '類似イベント２',
        sim_venue_name: 'テスト２会場',
        sim_period: '2018/10/17～2018/10/20',
        sim_day_cnt: 4,
        sim_capacity: 25658,
        sim_dayly: 12824,
        sim_sales_good: 180000,
        sim_unit_price: null,
        sim_average: null,
        sim_percent: 0.35,
        sim_income: 1000000,
        sim_outgo: 800000,
        sim_balance: 200000,
    },
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

export default function SimilarList() {

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
    {
      field: 'other_flg',
      headerName: '他社',
      width: 40,
      editable: true,
      type: 'boolean',
    },
    {
      field: 'similar_cd',
      headerName: 'イベントCD',
      type: 'number',
      width: 40,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    {
      field: 'sim_event_name',
      headerName: 'イベント名',
      type: 'string',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'sim_venue_name',
      headerName: '会場名',
      type: 'string',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'sim_period',
        headerName: '期間',
      type: 'string',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'sim_day_cnt',
      headerName: '公演数',
      type: 'number',
      width: 40,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'sim_capacity',
      headerName: '動員数',
      type: 'number',
      width: 40,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'sim_dayly',
      headerName: '日割',
      type: 'number',
      width: 40,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'sim_average',
      headerName: '比率',
      type: 'number',
      width: 40,
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
      field: 'sim_income',
      headerName: '日数/公演数',
      type: 'number',
      width: 60,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'sim_outgo',
      headerName: '発売日',
      type: 'date',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'sim_balance',
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
*/