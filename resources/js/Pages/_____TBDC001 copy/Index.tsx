import React, { useState, useEffect, useRef, createContext } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Row, Col, Form,  Checkbox, Select, Space, InputNumber, Breadcrumb, Layout, Popconfirm, DatePicker, Input } from "antd";
const { Footer, Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button'
import VenueList from './VenueTab';
import TicketList from './TicketTab';
import InvestmentList from './InvestmentTab';
import RelationList from './RelationTab';
import BalanceList from './BalanceTab';
import ChartList from './ChartTab';
import NameList from './NameTab';
import SimilarList from './SimilarTab';

const handleChangeStaff = (value: string[]) => {
    console.log(`selected ${value}`);
};

export interface BasicInfo  {
    event_grp_cd: string,
    event_name: string,
    event_kana: string,
    staff_name: string,
    staff_cd: string,
    performer1: string,
    performer2: string,
    scenario: string,
    type_cd: number,
    round_flg: boolean,
    genre_cd: number,
    plan_design: string,
    plan_content: string,
    attach_doc: string,
    remind: string,
    decision_remind: string,
    sponsorship: string,
    pr: string,
    output_eventsheet_dt: string,
    director_dt: string,
    exective_dt: string,
    output_bis_decision_dt: string,
    circular_stat: string,
    bis_decision_dt: string,
    bis_decision_no: string,
    output_name_decision_dt: string,
    name_decision_dt: string,
    name_decision_no: string,
    output_consent_dt: string,
    conclusion_dt: string,
    transfer_dt: string,
    pay_off: string,
    output_chart_dt: string,
    interim_flg: boolean,
    fin_flg: boolean,
    del_flg: boolean,
    type_name: string,
    plan_background: string,
    up_dt: string,
    user_name: string,
}


export interface TicketDataType {
    grid: number, 
    ticket_kind: string,
    advance_fee: number,
    the_day_fee: number,
    remind: string,
    disp_flg: boolean,
/*    setId: (id: number) => void,
    setTicket_kind:(ticket_kind: number) => void,
    setAdvance_fee:(advance_fee: number) => void,
    setThe_day_fee: (the_day_fee: number) => void,
    setRemind: (remind: string) => void,
    setDisp_flg:(disp_flg: boolean) => void,*/
}
/*
// AppContext の生成
export const AppContext = React.createContext<TicketDataType>({
    grid: 0,  // デフォルト値
    ticket_kind: 'Default',  // デフォルト値
    advance_fee: 0,
    the_day_fee: 0,
    remind: '',
    disp_flg: true,
    setGrid: (grid: number) => {},
    setTicket_kind:(ticket_kind: number) => {},
    setAdvance_fee:(advance_fee: number) => {},
    setThe_day_fee: (the_day_fee: number) => {},
    setRemind: (remind: string) => {},
    setDisp_flg:(disp_flg: boolean) => {},
});
*/
/*
// AppContext にセッター関数を登録するためのコンポーネント
export const AppContextProvider: React.FC = ({children}) => {

    // デフォルト値取得用
    const context: TicketDataType = React.useContext(AppContext);

    // ステートオブジェクト作成
  const [id, setsetId] = React.useState(context.id);
  const [ticket_kind, setTicket_kind] = React.useState(context.ticket_kind);
  const [advance_fee, setAdvance_fee] = React.useState(context.advance_fee);
  const [the_day_fee, setThe_day_fee] = React.useState(context.the_day_fee);
  const [remind, setRemind] = React.useState(context.remind);
  const [disp_flg, setDisp_flg] = React.useState(context.ticket_kind);

  // 下位コンポーネントへ渡す Context
  const newContext: AppContextType = {
    username, setUsername, apiToken, setApiToken
  };

  return (
    <AppContext.Provider value={newContext}>
      {children}
    </AppContext.Provider>
  );
};
*/
//export const TickerDataVal = createContext(null);

const ticketData  = 
[
    {
      id: 1,
      ticket_kind: 'S席',
      advance_fee: 2500,
      the_day_fee: '3000',
      remind: '備考１',
      disp_flg: false,
    },
    {
        id: 2,
        ticket_kind: '徳席',
        advance_fee: 2500,
        the_day_fee: '3000',
        remind: '備考２',
        disp_flg: false,
        },
];

export const TicketContext = createContext(ticketData);


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

function handleNameLendAcceptanceBtnClick() {

    return;
/*    
    const event_grp_cd: string = "2445";    //basicInfoDatas.event_grp_cd;
 
    window.history.pushState(null, '', "/TBPC006/" + event_grp_cd);
*/
}

export default function Index( props: any ) {

    // ユーザー情報取得
    const user = usePage<PageProps>().props.auth.user;
    const [form] = Form.useForm();

    // イベント基本情報管理用
    const [basicInfoDatas, setBasicInfoDatas] = useState<BasicInfo[]>([
        {   
            event_grp_cd: '',
            event_name: '',
            event_kana: '',
            staff_name: '',
            staff_cd: '',
            performer1: '',
            performer2: '',
            scenario: '',            
            type_cd: 0,
            round_flg: false,
            genre_cd: 0,
            plan_design: '',
            plan_content: '',
            attach_doc: '',
            remind: '',
            decision_remind: '',
            sponsorship: '',
            pr: '',
            output_eventsheet_dt: '',
            director_dt: '',
            exective_dt: '',
            output_bis_decision_dt: '',
            circular_stat: '',
            bis_decision_dt: '',
            bis_decision_no: '',
            output_name_decision_dt: '',
            name_decision_dt: '',
            name_decision_no: '',
            output_consent_dt: '',
            conclusion_dt: '',
            transfer_dt: '',
            pay_off: '',
            output_chart_dt: '',
            interim_flg: false,
            fin_flg: false,
            del_flg: false,
            type_name: '',
            plan_background: '',
            up_dt: '',
            user_name: '',             
          }
    ]);

    let isEdit = false;
    // 追加/編集モード取得
    const mode = props.mode;
    console.log("mode : ", mode);

    if (mode == 'edit') {
        isEdit = true;
        useEffect(() => {
            // データの取得と状態の更新を行う関数を定義
            const fetchData = async () => {
              try {
//                setBasicInfoDatas(props.evtBasic);
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            };


            fetchData(); // 関数を実行
          }, []); // 空の依存配列を指定すると、初回レンダリング時のみ実行されます
          setBasicInfoDatas(props.evtBasic);
        





/*        
        useEffect(() => {
            const fetchData = async () => {
                try {
                const result = await setBasicInfoDatas(props.evtBasic); // （非同期処理）
                } catch (error) {
                console.error('Error fetching data:', error);
                }
            };
        
            setBasicInfoDatas(props.evtBasic);
            fetchData();         
        }, []); // 空の依存配列を指定すると、初回レンダリング時のみ実行されます

        //setBasicInfoDatas(props.evtBasic);
*/
        /*
        // 第1引数にコールバック関数を記述し、副作用を実行
        useEffect(() => {
            // このコールバック関数はコンポーネントがマウントされた後に実行される
            console.log('Component mounted.');

            // ここで非同期処理や副作用を実行
            // イベント基本情報取得
            setBasicInfoDatas(props.evtBasic);

            // イベント会場情報取得
            // const [venuebasicInfoDatas, setVenueInfoDatas] = useState(props.evtVenue);

        }, [props.evtBasic]); // 第2引数に空の配列を渡すと初回のみ実行される
*/
    };
    console.log("props.evtBasic : ", props.evtBasic);

    // 他のコンポーネントの再レンダリング時に実行されるコード
    console.log('Component re-rendered.');

    const defEventGrpCd = basicInfoDatas[0]['event_grp_cd'];


    // タブ管理
    const [valueTab, setValueTab] = React.useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValueTab(newValue);
    };

    // Select 項目選択値
    const itemTypeCd = props.selectItemType;

    const genreOptions = [ 
        {value: '1', label: '音楽'},
        {value: '2', label: 'クラシック'},
        {value: '2', label: '舞台'},
        {value: '2', label: '催事'},
        {value: '2', label: 'グルメ'},
        {value: '2', label: 'スポーツ'},
        {value: '2', label: 'ゼロ名義'},
        {value: '2', label: 'その他'},
    ];

    return (

        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">イベント登録</h2>}
        >
            <Head title="シン・トンベイ　イベント登録" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Form
                                form={form}
                                name="form_event_reg"
                                >
                                <Layout >
                                    <Content style={{ padding: '0 50px' }}>
                                        <div style={{ padding: '20px 20px', width: '100%'}}>
                                            <Row>
                                                <Col span={6} offset={18}>
                                                    <Button>保存</Button>
                                                    <Popconfirm
                                                        title="削除"
                                                        description="本当に削除しますか？"
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                    <Button>Delete</Button>
                                                    </Popconfirm>
                                                    <Button>閉じる</Button>
                                                </Col>
                                            </Row>
                                        </div>

                                        <div style={{ float: 'left', width: '64%', padding: '10px 10px'}}>
                                            <Space.Compact style={{ width: '100%' }}>
                                                <Form.Item
                                                    name="event_grp_cd"
                                                    label="イベントコード"
                                                    >
                                                    <Input disabled defaultValue={defEventGrpCd}/>
                                                </Form.Item>
                                                <span
                                                    style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}
                                                >
                                                </span>
                                                <Form.Item
                                                    name="interm_flg"
                                                    valuePropName="checked"
                                                    style={{ display: 'inline-block', width: 'calc(20% - 12px)' }}
                                                    >
                                                    <Checkbox>仮登録</Checkbox>
                                                </Form.Item>
                                            </Space.Compact>
                                            <Form.Item
                                                    name="staff_cd"
                                                    label="担当者"
                                                    rules={[
                                                        {required: true, message: "担当者を選択してください。"},
                                                    ]}>
                                                        <Select
                                                            mode="multiple"
                                                            style={{ width: '100%' }}
                                                            placeholder="担当者を選択"
                                                            defaultValue={['']}
                                                            onChange={handleChangeStaff}
                                                            optionLabelProp="label"
                                                            >
                                                            <Option value="1" label="テスト太郎">
                                                            <Space>
                                                                <span role="img" aria-label="テスト太郎">
                                                                1
                                                                </span>
                                                                テスト太郎
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
                                                <Form.Item
                                                    name="event_name"
                                                    label="公演名"
                                                    rules={[
                                                        {required: true, message: "公演名を選択してください。"},
                                                    ]}>
                                                        { isEdit ? <TextArea rows={2} placeholder="公演名は150文字以内で入力してください。" maxLength={150} defaultValue={basicInfoDatas[0]['event_name']}/>:<TextArea rows={2} placeholder="公演名は150文字以内で入力してください。" maxLength={150}/>}
                                                </Form.Item>
                                                <Form.Item
                                                    name="event_kana"
                                                    label="公演名カナ"
                                                    >
                                                        { isEdit ? <TextArea rows={2} placeholder="公演名カナは150文字以内で入力してください。" maxLength={150} defaultValue={basicInfoDatas[0]['event_kana']}/>: <TextArea rows={2} placeholder="公演名カナは150文字以内で入力してください。" maxLength={150} />}
                                                </Form.Item>
                                                <Form.Item
                                                    name="performer1"
                                                    label="出演者（公開）"
                                                    >
                                                        { isEdit ? <TextArea rows={2} placeholder="出演者は300文字以内で入力してください。" maxLength={300} defaultValue={basicInfoDatas[0]['performer1']}/> :<TextArea rows={2} placeholder="出演者は300文字以内で入力してください。" maxLength={300}/> }
                                                </Form.Item>
                                                <Form.Item
                                                    name="performer2"
                                                    label="出演者（非公開）"
                                                    >
                                                        { isEdit ? <TextArea rows={2} placeholder="出演者は300文字以内で入力してください。" maxLength={300} defaultValue={basicInfoDatas[0]['performer2']}/> : <TextArea rows={2} placeholder="出演者は300文字以内で入力してください。" maxLength={300} />}
                                                </Form.Item>
                                                <Form.Item
                                                    name="scenario"
                                                    label="脚本・演出"
                                                    >
                                                        <Input placeholder="脚本・演出は100文字以内で入力してください。" maxLength={100} defaultValue={basicInfoDatas[0]['scenario']}/>
                                                </Form.Item>
                                                <Form.Item
                                                    name="type_cd"
                                                    label="実施形態"
                                                    rules={[
                                                        {required: true, message: "実施形態を選択してください。"},
                                                    ]}>
                                                        <Select
                                                        style={{ width: '30%' }}
                                                            placeholder="実施形態を選択"
                                                            defaultValue={['']}
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
                                                <Form.Item
                                                    name="genre_cd"
                                                    label="ジャンル"
                                                    rules={[
                                                        {required: true, message: "ジャンルを選択してください。"},
                                                    ]}>
                                                        <Select
                                                            style={{ width: '30%' }}
                                                            placeholder="ジャンルを選択"
                                                            defaultValue={['']}
                                                            onChange={handleChangeStaff}
                                                            options={genreOptions}
                                                            >
                                                        </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    name="plan_design"
                                                    label="企画立案元"
                                                    >
                                                        <Input placeholder="企画立案元は60文字以内で入力してください。" maxLength={60} defaultValue={basicInfoDatas[0]['plan_design']}/>
                                                </Form.Item>
                                                <Form.Item
                                                    name="plan_background"
                                                    label="企画立案背景"
                                                    >
                                                        <TextArea rows={2} placeholder="企画立案背景は300文字以内で入力してください。" maxLength={300} defaultValue={basicInfoDatas[0]['plan_background']}/>
                                                </Form.Item>
                                                <Form.Item
                                                    name="plan_content"
                                                    label="企画内容"
                                                    >
                                                        <TextArea rows={4} placeholder="企画立案背景は2000文字以内で入力してください。" maxLength={2000} defaultValue={basicInfoDatas[0]['plan_content']}/>
                                                </Form.Item>
                                                <Form.Item
                                                    name="attach_doc"
                                                    label="添付書類"
                                                    >
                                                        <Input placeholder="添付書類は150文字以内で入力してください。" maxLength={150} defaultValue={basicInfoDatas[0]['attach_doc']}/>
                                                </Form.Item>
                                                <Form.Item
                                                    name="doc_store_folder"
                                                    label="ドキュメント格納フォルダ"
                                                    >
                                                        <Input disabled/>
                                                </Form.Item>
                                                <Form.Item
                                                    name="remind"
                                                    label="備考"
                                                    >
                                                        <TextArea rows={2} placeholder="備考は300文字以内で入力してください。" maxLength={300} defaultValue={basicInfoDatas[0]['remind']}/>
                                                </Form.Item>
                                                <Form.Item
                                                    name="decision_remind"
                                                    label="業務決裁用備考"
                                                    >
                                                        <TextArea rows={2} placeholder="業務決裁用備考は300文字以内で入力してください。" maxLength={300} defaultValue={basicInfoDatas[0]['decision_remind']}/>
                                                </Form.Item>
                                                <Form.Item
                                                    name="sponsorship"
                                                    label="協賛"
                                                    >
                                                        <TextArea rows={2} placeholder="協賛は300文字以内で入力してください。" maxLength={300} defaultValue={basicInfoDatas[0]['sponsorship']} />
                                                </Form.Item>
                                                <Form.Item
                                                    name="pr"
                                                    label="PR"
                                                    >
                                                        <TextArea rows={2} placeholder="PRは300文字以内で入力してください。" maxLength={300}  />
                                                </Form.Item>
                                                                                            
                                        </div>
                                        <div style={{ float: 'right', width: '36%', border: '1px  solid #000000', padding: '10px 10px'}}>
                                            <Row>
                                                <Form.Item
                                                    name="output_eventsheet_dt"
                                                    label="イベントシート出力日"
                                                    style={{ width: 'calc(80% - 3px)' }}                   
                                                >
                                                    <DatePicker />   
                                                </Form.Item>
                                                <span
                                                    style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                                                >
                                                </span>
                                                <Button variant="outlined">出力</Button>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="director_dt"
                                                    label="局長会報告日"
                                                    style={{ width: 'calc(80% - 3px)' }}                   
                                                >
                                                    <DatePicker />   
                                                </Form.Item>
                                                <span
                                                    style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                                                >
                                                </span>
                                                <Button variant="outlined" style={{ width: 'calc(20% - 3px)' }}>出力</Button>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="exective_dt"
                                                    label="常務会報告日"
                                                    style={{ width: 'calc(80% - 3px)' }}                   
                                                >
                                                    <DatePicker />   
                                                </Form.Item>
                                                <span
                                                    style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                                                >
                                                </span>
                                                <Button variant="outlined" style={{ width: 'calc(20% - 3px)' }}>出力</Button>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="output_bis_decision_dt"
                                                    label="業務決裁書出力日"
                                                    style={{ width: 'calc(80% - 3px)' }}                   
                                                >
                                                    <DatePicker />   
                                                </Form.Item>
                                                <span
                                                    style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                                                >
                                                </span>
                                                <Button variant="outlined" >出力</Button>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="circular_sata"
                                                    label="業務決裁書回議状況"
                                                >
                                                    <Input size="small" placeholder="業務決裁書回議状況は20文字以内で入力してください。" maxLength={20}/>   
                                                </Form.Item>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="bis_decision_dt"
                                                    label="業務決裁日"
                                                    style={{ width: 'calc(80% - 3px)' }}
                                                >
                                                    <DatePicker />   
                                                </Form.Item>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="bis_decision_no"
                                                    label="業務決裁書番号"
                                                    >
                                                    <Input size="small" placeholder="業務決裁書番号は10文字以内で入力してください。" maxLength={10}/>   
                                                </Form.Item>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="output_name_decision_dt"
                                                    label="名義貸与決裁書出力日"
                                                    style={{ width: 'calc(80% - 3px)' }}                   
                                                >
                                                    <DatePicker />   
                                                </Form.Item>
                                                <span
                                                    style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                                                >
                                                </span>
                                                <Button variant="outlined">出力</Button>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="name_decision_dt"
                                                    label="名義貸与決裁日"
                                                >
                                                    <DatePicker />   
                                                </Form.Item>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="name_decision_no"
                                                    label="名義貸与決裁書番号"
                                                    >
                                                    <Input size="small" placeholder="名義貸与決裁書番号は10文字以内で入力してください。" maxLength={10}/>   
                                                </Form.Item>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="output_consent_dt"
                                                    label="名義貸与承諾書出力日"
                                                    style={{ width: 'calc(80% - 3px)' }}
                                                >
                                                    <DatePicker />   
                                                </Form.Item>
                                                <span
                                                    style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                                                >
                                                </span>

                                                <Button variant="outlined" onClick={() => handleNameLendAcceptanceBtnClick()}>出力</Button>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="conclusion_dt"
                                                    label="契約締結日"
                                                    style={{ width: 'calc(80% - 3px)' }}
                                                >
                                                    <DatePicker />   
                                                </Form.Item>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="transfer_dt"
                                                    label="契約移管日"
                                                    style={{ width: 'calc(80% - 3px)' }}
                                                >
                                                    <DatePicker />   
                                                </Form.Item>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="pay_off"
                                                    label="精算状況"
                                                    rules={[
                                                        {max: 10, message: "精算状況は10文字以内で入力してください。"},
                                                    ]}>
                                                    <Input />                                                       
                                                </Form.Item>
                                            </Row>
                                            <Row>
                                                <Form.Item
                                                    name="output_chart_dt"
                                                    label="イベントカルテ出力日"
                                                    style={{ width: 'calc(80% - 3px)' }}
                                                >
                                                    <DatePicker />   
                                                </Form.Item>
                                                <span
                                                    style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                                                >
                                                </span>
                                                <Button variant="outlined">出力</Button>
                                            </Row>
                                            <Row>
                                                <Button variant="outlined">イベント終了</Button>
                                            </Row>
                                        </div>
                                    </Content>
                                    <Footer>
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                <Tabs value={valueTab} onChange={handleTabChange} aria-label="イベント詳細情報" >
                                                    <Tab label="会場" {...a11yProps(0)} />
                                                    <Tab label="チケット" {...a11yProps(1)} />
                                                    <Tab label="出資" {...a11yProps(2)} />
                                                    <Tab label="クレジット" {...a11yProps(3)} />
                                                    <Tab label="収支" {...a11yProps(4)} />
                                                    <Tab label="カルテ" {...a11yProps(5)} />
                                                    <Tab label="名義" {...a11yProps(6)} />
                                                    <Tab label="類似実績" {...a11yProps(7)} />
                                                </Tabs>
                                            </Box>
                                            <CustomTabPanel value={valueTab} index={0}>
                                                <VenueList />
                                            </CustomTabPanel>
                                            <CustomTabPanel value={valueTab} index={1}>
                                                <TicketList/>
                                            </CustomTabPanel>
                                            <CustomTabPanel value={valueTab} index={2}>
                                                <InvestmentList />
                                            </CustomTabPanel>
                                            <CustomTabPanel value={valueTab} index={3}>
                                                <RelationList />
                                            </CustomTabPanel>
                                            <CustomTabPanel value={valueTab} index={4}>
                                                <BalanceList />
                                            </CustomTabPanel>
                                            <CustomTabPanel value={valueTab} index={5}>
                                                <ChartList /> 
                                            </CustomTabPanel>
                                            <CustomTabPanel value={valueTab} index={6}>
                                                <NameList /> 
                                            </CustomTabPanel>
                                            <CustomTabPanel value={valueTab} index={7}>
                                                <SimilarList />
                                            </CustomTabPanel>

                                        </Box>
                                    </Footer>
                                </Layout>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    );
        
        
}
