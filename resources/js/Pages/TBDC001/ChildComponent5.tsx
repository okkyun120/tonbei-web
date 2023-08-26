import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import { Tabs, Row, Col, Modal, Form,  InputNumber, Input } from "antd";

interface ChildProps {
  rowData: BalanceInfo;
  updateRowData: (newRowData: BalanceInfo) => void;
  tv_asahi_investment: any;
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


const ChildComponent5: React.FC<ChildProps> = ({ rowData, updateRowData, tv_asahi_investment }) => {

  const [rows, setRows] = React.useState<BalanceInfo>(rowData);

  function handleInputChange(value: number | null, name: string) {

    console.log('tv_asahi_investment : ', tv_asahi_investment);


    setRows((prevData) => ({
        ...prevData,
        [name]: value,
    }));

    let calcName : string;
    let calcValue : number;
    let singleName  : string = "";
    let calcSingle : number | null = null;
    let singleBalanceName  : string = "";
    let calcSingleBalance : number | null = null;

    if ( value !== null ) {
        switch(name) {
            case "event_total_income":
                calcName = "event_total_balance";
                calcValue = value - rows["event_total_outgo"];
                if (tv_asahi_investment !== null) {
                    // 「テレビ朝日」の出資比率が設定されている場合
                    // 単独収入および収支を更新する
                    singleName = "single_income";
                    calcSingle = Math.round(value * tv_asahi_investment / 100);

                    singleBalanceName = "single_balance";
                    calcSingleBalance = calcSingle - rows["single_outgo"];

                }
                break;
            case "event_total_outgo":
                calcName = "event_total_balance";
                calcValue = rows["event_total_income"] - value;
                if (tv_asahi_investment !== null) {
                    // 「テレビ朝日」の出資比率が設定されている場合
                    // 単独支出および収支を更新する
                    singleName = "single_outgo";
                    calcSingle = Math.round(value * tv_asahi_investment / 100);

                    singleBalanceName = "single_balance";
                    calcSingleBalance = rows["single_income"] - calcSingle;
                }
                break;
            case "decision_total_income":
                calcName = "decision_total_balance";
                calcValue = value - rows["decision_total_outgo"];
                if (tv_asahi_investment !== null) {
                    // 「テレビ朝日」の出資比率が設定されている場合
                    // 手数料抜き単独収入および収支を更新する
                    singleName = "investment_income";
                    calcSingle = Math.round(value * tv_asahi_investment /100);

                    singleBalanceName = "investment_balance";
                    calcSingleBalance = calcSingle - rows["investment_outgo"];
                }
                break;
            case "decision_total_outgo":
                calcName = "decision_total_balance";
                calcValue = rows["decision_total_income"] - value;
                if (tv_asahi_investment !== null) {
                    // 「テレビ朝日」の出資比率が設定されている場合
                    // 手数料抜き単独支出および収支を更新する
                    singleName = "investment_outgo";
                    calcSingle = Math.round(value * tv_asahi_investment /100);

                    singleBalanceName = "investment_balance";
                    calcSingleBalance = rows["investment_income"] - calcSingle;
                }
                break;
            case "single_income":
                calcName = "single_balance";
                calcValue = value - rows["single_outgo"];
                break;
            case "single_outgo":
                calcName = "single_balance";
                calcValue = rows["single_income"] - value;
                break;
            case "investment_income":
                calcName = "investment_balance";
                calcValue = value - rows["investment_outgo"];
                break;
            case "investment_outgo":
                calcName = "investment_balance";
                calcValue = rows["investment_income"] - value;
                break;
            case "results_income":
                calcName = "results_balance";
                calcValue = value - rows["results_outgo"];
                break;
            case "results_outgo":
                calcName = "results_balance";
                calcValue = rows["results_income"] - value;
                break;
            }

        console.log("singleName : ", singleName);

        if (calcSingle !== null) {
            setRows((prevData) => ({
                ...prevData,
                    [calcName]: calcValue,
                    [singleName]: calcSingle,
                    [singleBalanceName]: calcSingleBalance
                })); 

                console.log("calcSingle : ", calcSingle);
                console.log("rows : ", rows);
            }
        else {
            setRows((prevData) => ({
            ...prevData,
                [calcName]: calcValue,
            }));
        }
    }
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
                        min={0}
                        max={10000000000}
                        value={rows["event_total_income"]}
                        onChange={(value) => handleInputChange(value, "event_total_income")}
                    />    
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="総経費" >
                    <InputNumber
                        name="event_total_outgo"
                        style={{ width: 120 }}
                        min={0}
                        max={10000000000}
                        value={rows["event_total_outgo"]}
                        onChange={(value) => handleInputChange(value, "event_total_outgo")}
                    />    
                </Form.Item>
            </Col>
            <Col span={6}>
            
            <Form.Item label="総収支" >
                <InputNumber
                    name="event_total_balance"
                    style={{ width: 120 }}
                    min={0}
                    max={10000000000}
                    value={rows["event_total_balance"]}
                    onChange={(value) => handleInputChange(value, "event_total_balance")}
                    disabled
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
                    min={0}
                    max={10000000000}
                    value={rows["decision_total_income"]}
                    onChange={(value) => handleInputChange(value, "decision_total_income")}
                    />    
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="総製作費" >
                    <InputNumber
                    name="decision_total_outgo"
                    style={{ width: 120 }}
                    min={0}
                    max={10000000000}
                    value={rows["decision_total_outgo"]}
                    onChange={(value) => handleInputChange(value, "decision_total_outgo")}
                    />    
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="総収支" >
                    <InputNumber
                    name="decision_total_balance"
                    style={{ width: 120 }}
                    min={0}
                    max={10000000000}
                    value={rows["decision_total_balance"]}
                    onChange={(value) => handleInputChange(value, "decision_total_balance")}
                    disabled
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
                    min={0}
                    max={10000000000}
                    value={rows["single_income"]}                    
                    onChange={(value) => handleInputChange(value, "single_income")}
                    />    
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="経費" >
                <InputNumber
                    name="single_outgo"
                    style={{ width: 120 }}
                    value={rows["single_outgo"]}                    
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
                    min={0}
                    max={10000000000}
                    value={rows["single_balance"]}
                    onChange={(value) => handleInputChange(value, "single_balance")}
                    disabled
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
                    min={0}
                    max={10000000000}
                    value={rows["investment_income"]}                    
                    onChange={(value) => handleInputChange(value, "investment_income")}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="経費" >
                <InputNumber
                    name="investment_outgo"
                    style={{ width: 120 }}
                    min={0}
                    max={10000000000}
                    value={rows["investment_outgo"]}                    
                    onChange={(value) => handleInputChange(value, "investment_outgo")}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="収支" >
                <InputNumber
                    name="investment_balance"
                    style={{ width: 120 }}
                    min={0}
                    max={10000000000}
                    value={rows["investment_balance"]}
                    onChange={(value) => handleInputChange(value, "investment_balance")}
                    disabled
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
                    min={0}
                    max={10000000000}
                    value={rows["avg_unit_price"]}
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
                    min={0}
                    max={100}
                    value={rows["break_even"]}
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
                    min={0}
                    max={10000000000}
                    value={rows["results_income"]}
                    onChange={(value) => handleInputChange(value, "results_income")}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="総経費" >
                <InputNumber
                    name="results_outgo"
                    style={{ width: 120 }}
                    min={0}
                    max={10000000000}
                    value={rows["results_outgo"]}
                    onChange={(value) => handleInputChange(value, "results_outgo")}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="総収支" >
                <InputNumber
                    name="results_balance"
                    style={{ width: 120 }}
                    min={0}
                    max={10000000000}
                    value={rows["results_balance"]}
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
                    min={0}
                    max={10000000000}
                    value={rows["results_sales_goods"]}
                    onChange={(value) => handleInputChange(value, "results_sales_goods")}
                    />
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item
                    label="物販利益率(%)"
                    >
                <InputNumber
                    name="results_goods_profit_rate"
                    style={{ width: 120 }}
                    min={0}
                    max={100}
                    value={rows["results_goods_profit_rate"]}
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
