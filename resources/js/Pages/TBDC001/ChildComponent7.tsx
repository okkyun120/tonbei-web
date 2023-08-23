import * as React from 'react';
import { Row, Col, Form, Select, InputNumber, Input } from "antd";
const { TextArea } = Input;

interface ChildProps {
  rowData: NameInfo;
  clientSelectItem: any[];
  updateRowData: (newRowData: NameInfo) => void;
}

//　名義情報インターフェース
interface NameInfo {
  event_grp_cd: string,
  lend_name: string,
  client_cd: number,
  requester_position: string,
  requester_name: string,
  content: string,
  income_item1: string,
  income_amount1: number,
  income_item2: string,
  income_amount2: number,
  income_item3: string,
  income_amount3: number,
  income_total: number,
  outgo_item1: string,
  outgo_amount1: number,
  outgo_item2: string,
  outgo_amount2: number,
  outgo_item3: string,
  outgo_amount3: number,
  outgo_total: number,
  total_balance: number,
  remind: string,
}



const ChildComponent7: React.FC<ChildProps> = ({ rowData, clientSelectItem, updateRowData }) => {

  const [rows, setRows] = React.useState<NameInfo>(rowData);


  /**
   * 取引先Select設定
   */
  interface ClientProps {
    options: { client_cd: number; client_name: string }[];
    defaultValue: number; 
    onChange: (value: number) => void; 
  }

  /**
   * 取引先選択イベントハンドラ
   * @param value : 取引先
   */
  const handleChangeClient = (value: number) => {
    console.log(`selected ${value}`);

    setRows((prevRows) => {
      const updatedRow: NameInfo = { ...prevRows, client_cd: value }; // 新しいオブジェクトを作成して更新

      console.log("updatedRow : ", updatedRow);

//      updateRowData(rows);

      return updatedRow; // 更新されたデータを返す
    });     
  };

  function CustomTypeSelect({ options, defaultValue, onChange }: ClientProps) {
    return (
      <Select
        style={{ width: '60%' }}
        placeholder="取引先を選択"
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {options.map((option) => (
          <Select.Option key={option.client_cd} value={option.client_cd} name="client_cd">
            {option.client_name}
          </Select.Option>
        ))}
      </Select>
    );
  }

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
};
    
React.useEffect(() => {
    updateRowData(rows);
    console.log("rows : ", rows);

  },[rows])  

    


  // 名義データ存在チェック
  let data_exist_flg = false;
  if (rows !== null) {
    data_exist_flg = true;
  }


  return (
      <div style={{ height: 540, width: '100%' }}>   
        <Row>
          <Col span={6}>
            <Form.Item label="貸与名義" >
              <TextArea rows={1} 
                name="lend_name"
                placeholder="15文字以内で入力してください。"
                maxLength={15}
                defaultValue={rows.lend_name}
                onChange={handleTextAreaChange}
                />
            </Form.Item>        
          </Col>
          <Col span={12}>
            <Form.Item label="依頼者">
              <CustomTypeSelect options={clientSelectItem} defaultValue={rows['client_cd']} onChange={handleChangeClient} />                  
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label="依頼者役職" >
              <TextArea rows={1}   
                name="requester_position"
                placeholder="15文字以内で入力してください。"
                maxLength={15}   
                defaultValue={rows.requester_position}
                onChange={handleTextAreaChange}
                />
            </Form.Item>        
          </Col>
          <Col span={6}>
              <Form.Item label="氏名" >
                <TextArea rows={1}   
                  name="requester_name"
                  placeholder="15文字以内で入力してください。"
                  maxLength={15}   
                  defaultValue={rows.requester_name}
                  onChange={handleTextAreaChange}
                  />
              </Form.Item>        
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Form.Item label="名義内容" >
              <TextArea rows={2}   
                name="content"
                placeholder="250文字以内で入力してください。"
                maxLength={250}   
                defaultValue={rows.content}
                onChange={handleTextAreaChange}
                />
            </Form.Item>        
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Form.Item label="名義備考" >
              <TextArea rows={2}   
                name="remind"
                placeholder="200文字以内で入力してください。"
                maxLength={200}   
                defaultValue={rows.remind}
                onChange={handleTextAreaChange}
                />
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
              <TextArea rows={1}   
                name="income_item1"
                placeholder=""
                maxLength={20}   
                defaultValue={rows.income_item1}
                onChange={handleTextAreaChange}
                />
            </Col>
            <Col span={10}>
              <InputNumber
                name="income_amount1"
                style={{ width: 80 }}
                defaultValue={ rows.income_amount1 }
                min={0}
                max={10000000000}
                onChange={(value) => handleInputChange(value, "income_amount1")}
                />    
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <TextArea rows={1}   
                name="income_item2"
                placeholder=""
                maxLength={20}   
                defaultValue={rows.income_item2}
                onChange={handleTextAreaChange}
                />
            </Col>
            <Col span={10}>
              <InputNumber
                name="income_amount2"
                style={{ width: 80 }}
                defaultValue={ rows.income_amount2 }
                min={0}
                max={10000000000}
                onChange={(value) => handleInputChange(value, "income_amount2")}
                />    
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <TextArea rows={1}   
                name="income_item3"
                placeholder=""
                maxLength={20}   
                defaultValue={rows.income_item3}
                onChange={handleTextAreaChange}
                />
            </Col>
            <Col span={10}>
              <InputNumber
                name="income_amount3"
                style={{ width: 80 }}
                defaultValue={ rows.income_amount3 }
                min={0}
                max={10000000000}
                onChange={(value) => handleInputChange(value, "income_amount3")}
                />    
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item label="収入合計" >
              <InputNumber
                name="income_total"
                style={{ width: 80 }}
                defaultValue={ rows.income_total }
                min={0}
                max={10000000000}
                onChange={(value) => handleInputChange(value, "income_total")}
                />
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
            <TextArea rows={1}   
                name="outgo_item1"
                placeholder=""
                maxLength={20}   
                defaultValue={rows.outgo_item1}
                onChange={handleTextAreaChange}
                />
            </Col>
            <Col span={10}>
              <InputNumber
                name="outgo_amount1"
                style={{ width: 80 }}
                defaultValue={ rows.outgo_amount1 }
                min={0}
                max={10000000000}
                onChange={(value) => handleInputChange(value, "outgo_amount1")}
                />    
            </Col>
          </Row>
          <Row>
            <Col span={14}>
            <TextArea rows={1}   
                name="outgo_item2"
                placeholder=""
                maxLength={20}   
                defaultValue={rows.outgo_item2}
                onChange={handleTextAreaChange}
                />
            </Col>
            <Col span={10}>
              <InputNumber
                name="outgo_amount2"
                style={{ width: 80 }}
                defaultValue={ rows.outgo_amount2 }
                min={0}
                max={10000000000}
                onChange={(value) => handleInputChange(value, "outgo_amount2")}
                />    
            </Col>
          </Row>
          <Row>
            <Col span={14}>
            <TextArea rows={1}   
                name="outgo_item3"
                placeholder=""
                maxLength={20}   
                defaultValue={rows.outgo_item3}
                onChange={handleTextAreaChange}
                />
            </Col>
            <Col span={10}>
              <InputNumber
                name="outgo_amount3"
                style={{ width: 80 }}
                defaultValue={ rows.outgo_amount3 }
                min={0}
                max={10000000000}
                onChange={(value) => handleInputChange(value, "outgo_amount3")}
                />    
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item label="支出合計" >
              <InputNumber
                name="outgo_total"
                style={{ width: 80 }}
                defaultValue={ rows.outgo_total }
                min={0}
                max={10000000000}
                onChange={(value) => handleInputChange(value, "outgo_total")}
                />
                </Form.Item>    
            </Col>
          </Row>  
        </div>
        <div style={{ clear: 'both', width: '100%', padding: '10px 10px'}}>
          <Row>
            <Col span={10}>
              <Form.Item label="収支" >
                <InputNumber
                  name="total_balance"
                  style={{ width: 80 }}
                  defaultValue={ rows.total_balance }
                  min={0}
                  max={10000000000}
                  onChange={(value) => handleInputChange(value, "total_balance")}
                  />    
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    );
 }
    
export default ChildComponent7;
