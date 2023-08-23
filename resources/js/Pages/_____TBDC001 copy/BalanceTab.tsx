import * as React from 'react';
import { useContext } from "react";
import { TicketContext } from "./Index";
import { Tabs, Row, Col, Modal, Form,  InputNumber, Breadcrumb, Layout, Popconfirm, DatePicker, Input } from "antd";


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
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';




export default function BalanceList() {

    //const ticketData = useContext(TicketContext);

    //console.log(ticketData);


//const TicketList: FC<Props> = (props) => {

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

                                                <Row><h3>予算</h3></Row>
                                                <Row>
                                                    <Col span={3}>興行総収支</Col>
                                                    <Col span={7}>
                                                        <Form.Item
                                                            name="event_total_income"
                                                            label="総収入"
                                                            style={{ width: '80%' }}
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={7}>
                                                        <Form.Item
                                                            name="event_total_outgo"
                                                            label="総経費"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={7}>
                                                        <Form.Item
                                                            name="event_total_balance"
                                                            label="総収支"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={6}>興行総収支(手数料抜)</Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="decision_total_income"
                                                            label="総収入"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="decision_total_outgo"
                                                            label="総製作費"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="decision_total_balance"
                                                            label="総収支"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={6}>単独収支</Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="single_income"
                                                            label="収入"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="single_outgo"
                                                            label="経費"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="single_balance"
                                                            label="収支"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={6}>単独収支(手数料抜)</Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="investment_income"
                                                            label="収入"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="investment_outgo"
                                                            label="経費"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="investment_balance"
                                                            label="収支"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="avg_unit_price"
                                                            label="平均単価"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="break_even"
                                                            label="損益分岐(%)"
                                                            >
                                                            <InputNumber 
                                                                formatter={(value) => `${value}%`}
                                                                parser={(value) => value!.replace('%', '')}
                                                            />   
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <hr />
                                                <Row>
                                                    <Col span={6}>実績</Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="results_income"
                                                            label="総収入"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="results_outgo"
                                                            label="総経費"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="results_balance"
                                                            label="総収支"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="results_goods_sales"
                                                            label="物販売上実績"
                                                            >
                                                            <InputNumber 
                                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                                                />   
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="results_goods_profit_rate"
                                                            label="物販利益率(%)"
                                                            >
                                                            <InputNumber 
                                                                formatter={(value) => `${value}%`}
                                                                parser={(value) => value!.replace('%', '')}
                                                            />   
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
    </Box>
  );
}