import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import { Tabs, Row, Col, Modal, Form,  InputNumber, Input } from "antd";

interface ChildProps {
  rowData: BalanceInfo;
  updateRowData: (newRowData: BalanceInfo) => void;
}

//　収支情報インターフェース
interface BalanceInfo {
  event_grp_cd: string,
  sub_no: number,
  event_total_income: number,
  event_total_outgo: number,
  event_total_balance: number,
  decision_total_income: number,
  decision_total_outgo: number,
  decision_total_balance: number,
  single_income: number,
  single_outgo: number,
  single_balance: number,
  investment_income: number,
  investment_outgo: number,
  investment_balance: number,
  avg_unit_price: number,
  results_income: number,
  results_outgo: number,
  results_balance: number,
  results_sales_goods: number,
  results_goods_profit_rate: number,
  break_even: number,
}


const ChildComponent5: React.FC<ChildProps> = ({ rowData, updateRowData }) => {

  const [rows, setRows] = React.useState<BalanceInfo>(rowData);

  
  function handleInputChange(value: number | null, name: string) {
        console.log('name : ', name);
        console.log('value : ', value);

      setRows((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      // updateRowData(rows);
  }

  React.useEffect(() => {
    updateRowData(rows);
    console.log("rows : ", rows);

  },[rows])


  // 収支データ存在チェック
  let data_exist_flg = false;
  if (rows !== null) {
    data_exist_flg = true;
  }
 
  function delHeadCurrency(price: number) {
    if (price === null) {
        return 0;
    }
    else {
        const currencyStr = price.toString();
        return parseFloat(currencyStr.replace(/[^\d.-]/g, '').replace(/^\\/, ''));
    }
  }

  return (
      <div style={{ height: 400, width: '100%' }}>
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
            <Col span={6}>興行総収支</Col>
            <Col span={6}>
                <Form.Item label="総収入" >
                    <InputNumber
                        name="event_total_income"
                        style={{ width: 120 }}
                        defaultValue={ data_exist_flg ? rows["event_total_income"]: undefined } 
                        min={0}
                        max={10000000000}
                        onChange={(value) => handleInputChange(value, "event_total_income")}
                    />    
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="総経費" >
                    <InputNumber
                        name="event_total_outgo"
                        style={{ width: 120 }}
                        defaultValue={data_exist_flg ? rows["event_total_outgo"]: undefined}
                        min={0}
                        max={10000000000}
                        onChange={(value) => handleInputChange(value, "event_total_outgo")}
                    />    
                </Form.Item>
            </Col>
            <Col span={6}>
            
            <Form.Item label="総収支経費" >
                <InputNumber
                    name="event_total_balance"
                    style={{ width: 120 }}
                    defaultValue={data_exist_flg ? rows["event_total_balance"]: undefined}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "event_total_balance")}
                    />    
                </Form.Item>
            </Col>
        </Row>
        <Row>
            <Col span={6}>興行総収支(手数料抜)</Col>
            <Col span={6}>
                <Form.Item label="総収入" >
                <InputNumber
                    name="decision_total_income"
                    style={{ width: 120 }}
                    defaultValue={data_exist_flg ? rows["decision_total_income"]: undefined}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "decision_total_income")}
                    />    
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="総製作費" >
                    <InputNumber
                    name="decision_total_outgo"
                    style={{ width: 120 }}
                    defaultValue={data_exist_flg ? rows["decision_total_outgo"]: undefined}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "decision_total_outgo")}
                    />    
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="総収支" >
                    <InputNumber
                    name="decision_total_balance"
                    style={{ width: 120 }}
                    defaultValue={data_exist_flg ? rows["decision_total_balance"]: undefined}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "decision_total_balance")}
                    />    
                </Form.Item>
            </Col>
        </Row>
        <Row>
            <Col span={6}>単独収支</Col>
            <Col span={6}>
                <Form.Item label="収入" >
                <InputNumber
                    name="single_income"
                    style={{ width: 120 }}
                    defaultValue={rows["single_income"]}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "single_income")}
                    />    
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="経費" >
                <InputNumber
                    name="single_outgo"
                    style={{ width: 120 }}
                    defaultValue={rows["single_outgo"]}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "single_outgo")}
                    />    
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="収支" >
                <InputNumber
                    name="single_balance"
                    style={{ width: 120 }}
                    defaultValue={rows["single_balance"]}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "single_balance")}
                    />    
                </Form.Item>
            </Col>
        </Row>
        <Row>
            <Col span={6}>単独収支(手数料抜)</Col>
            <Col span={6}>
                <Form.Item label="収入" >
                <InputNumber
                    name="investment_income"
                    style={{ width: 120 }}
                    defaultValue={rows["investment_income"]}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "investment_income")}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="経費" >
                <InputNumber
                    name="investment_outgo"
                    style={{ width: 120 }}
                    defaultValue={rows["investment_outgo"]}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "investment_outgo")}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="収支" >
                <InputNumber
                    name="investment_balance"
                    style={{ width: 120 }}
                    defaultValue={rows["investment_balance"]}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "investment_balance")}
                    />
                </Form.Item>
            </Col>
        </Row>
        <Row>
            <Col span={6}>
                <Form.Item label="平均単価" >
                <InputNumber
                    name="avg_unit_price"
                    style={{ width: 120 }}
                    defaultValue={rows["avg_unit_price"]}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "avg_unit_price")}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name="break_even"
                    label="損益分岐(%)"
                    >
                <InputNumber
                    name="break_even"
                    style={{ width: 120 }}
                    defaultValue={rows["break_even"]}
                    min={0}
                    max={100}
                    onChange={(value) => handleInputChange(value, "break_even")}
                    />
                </Form.Item>
            </Col>
        </Row>
        <hr />
        <Row>
            <Col span={6}>実績</Col>
            <Col span={6}>
                <Form.Item label="総収入" >
                <InputNumber
                    name="results_income"
                    style={{ width: 120 }}
                    defaultValue={rows["results_income"]}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "results_income")}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="総経費" >
                <InputNumber
                    name="results_outgo"
                    style={{ width: 120 }}
                    defaultValue={rows["results_outgo"]}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "results_outgo")}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="総収支" >
                <InputNumber
                    name="results_balance"
                    style={{ width: 120 }}
                    defaultValue={rows["results_balance"]}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "results_balance")}
                    />
                </Form.Item>
            </Col>
        </Row>
        <Row>
            <Col span={6}>
                <Form.Item label="物販売上実績" >
                <InputNumber
                    name="results_sales_goods"
                    style={{ width: 120 }}
                    defaultValue={rows["results_sales_goods"]}
                    min={0}
                    max={10000000000}
                    onChange={(value) => handleInputChange(value, "results_sales_goods")}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    name="results_goods_profit_rate"
                    label="物販利益率(%)"
                    >
                <InputNumber
                    name="results_goods_profit_rate"
                    style={{ width: 120 }}
                    defaultValue={rows["results_goods_profit_rate"]}
                    min={0}
                    max={100}
                    onChange={(value) => handleInputChange(value, "results_goods_profit_rate")}
                    />
                </Form.Item>
            </Col>
        </Row>
    </Box>
        </div>
      );
    }
    



export default ChildComponent5;
