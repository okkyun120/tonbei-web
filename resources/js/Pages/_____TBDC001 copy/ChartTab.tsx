import * as React from 'react';
import { useContext } from "react";
import { Tabs, Row, Col, Modal, Form,  InputNumber, Breadcrumb, Layout, Popconfirm, DatePicker, Input } from "antd";
const { TextArea } = Input;

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';






export default function ChartList() {

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
                                                            name="num_recrutiments"
                                                            label="最終動員数"
                                                            >
                                                            <InputNumber />   
                                                        </Form.Item>        
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12}>
                                                        <Form.Item
                                                            name="generaization"
                                                            label="総括"
                                                            >
                                                            <TextArea rows={4} placeholder="1500文字以内で入力してください。" maxLength={1500}/>   
                                                        </Form.Item>        
                                                    </Col>
                                                </Row>
    </Box>
  );
}