import * as React from 'react';

import Box from '@mui/material/Box';

import { Tabs, Row, Col, Modal, Form,  InputNumber, Input } from "antd";
const { TextArea } = Input;


interface ChildProps {
  rowData: ChartInfo;
  updateRowData: (newRowData: ChartInfo) => void;
}

//　カルテ情報インターフェース
interface ChartInfo {
  event_grp_cd: string,
  num_recrutiments: number,
  generalization: string, 
}

const ChildComponent6: React.FC<ChildProps> = ({ rowData, updateRowData }) => {

  const [rows, setRows] = React.useState<ChartInfo>(rowData);

  function handleInputChange(value: number | null, name: string) {
    setRows((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // updateRowData(rows);
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    console.log("handleChange name:", name);
    console.log("handleChange value:", value);
            
    setRows((prevData) => ({
          ...prevData,
          [name]: value,
        }));

//    updateRowData(rows);
};
    

  React.useEffect(() => {
    updateRowData(rows);
    console.log("rows : ", rows);

  },[rows])  



  // 収支データ存在チェック
  let data_exist_flg = false;
  if (rows !== null) {
    data_exist_flg = true;
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
        <Row>
            <Col span={6}>
                <Form.Item label="最終動員数" > 
                    <InputNumber
                        name="num_recrutiments"
                        style={{ width: 80 }}
                        defaultValue={ rows.num_recrutiments }
                        min={0}
                        max={10000000000}
                        onChange={(value) => handleInputChange(value, "num_recrutiments")}
                    />    
                </Form.Item>
            </Col>
        </Row>
        <Row>
            <Col span={18}>
                <Form.Item label="総括" >
                <TextArea rows={6} 
                        name="generalization"
                        placeholder="公演名は150文字以内で入力してください。" 
                        maxLength={150} 
                        defaultValue={rows.generalization}
                        onChange={handleTextAreaChange}/>
                </Form.Item>
            </Col>
        </Row>
    </Box>
        </div>
      );
    }
    
export default ChildComponent6;
