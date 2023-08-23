import * as React from 'react';
import { useContext } from "react";
import { TicketContext } from "./Index";
import { Tabs, Row, Col, Select, Form,  InputNumber, Breadcrumb, Layout, Popconfirm, Space, Input } from "antd";
const { Option } = Select;
const { TextArea } = Input;

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

const handleChangeStaff = (value: string[]) => {
    console.log(`selected ${value}`);
  };


export default function NameList() {

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
                                                <Row>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="lend_name"
                                                            label="貸与名義"
                                                            >
                                                            <Input placeholder="15文字以内で入力してください。" maxLength={15}/>   
                                                        </Form.Item>        
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item
                                                            name="client_cd"
                                                            label="依頼者"
                                                            rules={[
                                                                {required: true, message: "依頼者を選択してください。"},
                                                            ]}>
                                                            <Select
                                                                style={{ width: '80%' }}
                                                                placeholder="依頼者を選択"
                                                                onChange={handleChangeStaff}
                                                                optionLabelProp="label"
                                                                >
                                                                <Option value="1" label="名義">
                                                                <Space>
                                                                    <span role="img" aria-label="名義">
                                                                    1
                                                                    </span>
                                                                    名義
                                                                </Space>
                                                                </Option>
                                                                <Option value="2" label="テスト次郎">
                                                                <Space>
                                                                    <span role="img" aria-label="テスト次郎">
                                                                    2
                                                                    </span>
                                                                    テスト次郎
                                                                </Space>
                                                                </Option>
                                                            </Select>
                                                        </Form.Item>        
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="reequester_position"
                                                            label="依頼者役職"
                                                            >
                                                            <Input placeholder="15文字以内で入力してください。" maxLength={15}/>   
                                                        </Form.Item>        
                                                    </Col>
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name="reequester_name"
                                                            label="氏名"
                                                            >
                                                            <Input placeholder="15文字以内で入力してください。" maxLength={15}/>   
                                                        </Form.Item>        
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={18}>
                                                        <Form.Item
                                                            name="name_content"
                                                            label="名義内容"
                                                            >
                                                            <TextArea rows={3} placeholder="250文字以内で入力してください。" maxLength={250}/>   
                                                        </Form.Item>        
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={18}>
                                                        <Form.Item
                                                            name="name_remind"
                                                            label="名義備考"
                                                            >
                                                            <TextArea rows={2} placeholder="200文字以内で入力してください。" maxLength={200}/>   
                                                        </Form.Item>        
                                                    </Col>
                                                </Row>
                                                <div style={{ float: 'left', width: '46%', border: '1px  solid #000000', padding: '10px 10px'}}>
                                                    <Row>収入</Row>
                                                    <Row>
                                                        <Col span={14}>科目</Col>
                                                        <Col span={10}>金額</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={14}>
                                                            <Form.Item
                                                                name="income_item1"
                                                                label=""
                                                                >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={10}>
                                                            <Form.Item
                                                                name="income_amount1"
                                                                label=""
                                                                >
                                                                <InputNumber />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={14}>
                                                            <Form.Item
                                                                name="income_item2"
                                                                label=""
                                                                >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={10}>
                                                            <Form.Item
                                                                name="income_amount2"
                                                                label=""
                                                                >
                                                                <InputNumber />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={14}>
                                                            <Form.Item
                                                                name="income_item3"
                                                                label=""
                                                                >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={10}>
                                                            <Form.Item
                                                                name="income_amount3"
                                                                label=""
                                                                >
                                                                <InputNumber />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    
                                                </div>
                                                <div style={{ float: 'right', width: '46%', border: '1px  solid #000000', padding: '10px 10px'}}>
                                                    <Row>支出</Row>
                                                    <Row>
                                                        <Col span={14}>科目</Col>
                                                        <Col span={10}>金額</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={14}>
                                                            <Form.Item
                                                                name="outgo_item1"
                                                                label=""
                                                                >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={10}>
                                                            <Form.Item
                                                                name="outgo_amount1"
                                                                label=""
                                                                >
                                                                <InputNumber />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={14}>
                                                            <Form.Item
                                                                name="outgo_item2"
                                                                label=""
                                                                >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={10}>
                                                            <Form.Item
                                                                name="outgo_amount2"
                                                                label=""
                                                                >
                                                                <InputNumber />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={14}>
                                                            <Form.Item
                                                                name="outgo_item3"
                                                                label=""
                                                                >
                                                                <Input />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={10}>
                                                            <Form.Item
                                                                name="outgo_amount3"
                                                                label=""
                                                                >
                                                                <InputNumber />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    
                                                </div>
                                                <Row>
                                                    <Col span={10}>
                                                        <Form.Item
                                                            name="total_balance"
                                                            label="収支"
                                                            >
                                                            <InputNumber />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
    </Box>
  );
}