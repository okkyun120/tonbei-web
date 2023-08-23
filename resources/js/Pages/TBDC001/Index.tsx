import React, { useState, useEffect, useRef, createContext } from "react";
import axios from "axios";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Input, Row, Col, Form,  Checkbox, Select, Space, InputNumber, Layout, Popconfirm, DatePicker, Button, Modal } from "antd";
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs from 'dayjs';
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
//import Textarea from '@mui/joy/Textarea';
const { Footer, Content } = Layout;
const { Option } = Select;


import Box from '@mui/material/Box';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/material/Typography';

//import Button from '@mui/material/Button'
import ChildComponent1 from './ChildComponent1';
import ChildComponent2 from './ChildComponent2';
import ChildComponent3 from './ChildComponent3';
import ChildComponent4 from './ChildComponent4';
import ChildComponent5 from './ChildComponent5';
import ChildComponent6 from './ChildComponent6';
import ChildComponent7 from './ChildComponent7';          //　名義コンポーネント
import ChildComponent8 from './ChildComponent8';          //　類似実績コンポーネント

import moment from "moment";
import locale from 'antd/es/date-picker/locale/ja_JP';
import 'dayjs/locale/ja';


/**
 * 基本情報インターフェース
 */
export interface BasicInfo  {
    event_grp_cd: string,
    event_name: string,
    event_kana: string,
    staff_name: string,
    staff_cd: string,
    performer1: string,
    performer2: string,
    scenario: string,
    type_cd: string,
    round_flg: boolean,
    genre_cd: string,
    plan_design: string,
    plan_background: string,
    plan_content: string,
    attach_doc: string,
    remind: string,
    decision_remind: string,
    tv_asahi_ticket: string,
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
    //name_flg: boolean,
    up_dt: string,
    user_name: string,
}

export const initialBasicInfo: BasicInfo = {
  event_grp_cd: "",
  event_name: "",
  event_kana: "",
  staff_name: "",
  staff_cd: "",
  performer1: "",
  performer2: "",
  scenario: "",
  type_cd: "",
  round_flg: false,
  genre_cd: "",
  plan_design: "",
  plan_background: "",
  plan_content: "",
  attach_doc: "",
  remind: "",
  decision_remind: "",
  tv_asahi_ticket: "",
  sponsorship: "",
  pr: "",
  output_eventsheet_dt: "",
  director_dt: "",
  exective_dt: "",
  output_bis_decision_dt: "",
  circular_stat: "",
  bis_decision_dt: "",
  bis_decision_no: "",
  output_name_decision_dt: "",
  name_decision_dt: "",
  name_decision_no: "",
  output_consent_dt: "",
  conclusion_dt: "",
  transfer_dt: "",
  pay_off: "",
  output_chart_dt: "",
  interim_flg: false,
  fin_flg: false,
  del_flg: false,
  type_name: "",
  up_dt: "",
  user_name: "",
};

export interface VenueInfo {
    id: number,
    event_grp_cd: number,
    venue_cd: number,
    period_start: string,
//    period_start_etc: string,
    search_period_start: Date,
    period_end: string,
//    period_end_etc: string,
    day_count: number,
    curtain_time: string,
    release_dt: string,
    capacity: number,
    audience: number,
    sepector_num: number,
    info_disclosure: string,
    remind: string,
    income: number,
    outgo: number,
    balance: number,
    decision_flg: boolean,
    del_flg: boolean,
}

//　チケット情報インターフェース
export interface TicketInfo {
  id: number,
  event_grp_cd: string,
  ticket_kind: string,
  advance_fee: number,
  the_day_fee: number,
  remind: string,
  disp_flg: boolean,
}

//　出資情報インターフェース
export interface InvestmentInfo {
  id: string,
  event_grp_cd: string,
  client_cd: number,
  investment_percent: number,
  role: string,
  role_output_flg: boolean,
  disp_flg: boolean,
}

//　関係先情報インターフェース
export interface RelationInfo {
  id: number,
  event_grp_cd: string,
  title: string,
  related_parties: string,
  disp_flg: boolean,
}

//　収支情報インターフェース
export interface BalanceInfo {
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

// 収支タブ初期値設定
const initialBalanceInfo: BalanceInfo = {
  event_grp_cd: "",
  sub_no: 0,
  event_total_income: 0,
  event_total_outgo: 0,
  event_total_balance: 0,
  decision_total_income: 0,
  decision_total_outgo: 0,
  decision_total_balance: 0,
  single_income: 0,
  single_outgo: 0,
  single_balance: 0,
  investment_income: 0,
  investment_outgo: 0,
  investment_balance: 0,
  avg_unit_price: 0,
  results_income: 0,
  results_outgo: 0,
  results_balance: 0,
  results_sales_goods: 0,
  results_goods_profit_rate: 0,
  break_even: 0,
};


//　カルテ情報インターフェース
export interface ChartInfo {
  event_grp_cd: string,
  num_recrutiments: number,
  generalization: string, 
}

// カルテ初期値設定
const initialChart: ChartInfo = {
  event_grp_cd: "",
  num_recrutiments: 0,
  generalization: "", 
}

//　名義情報インターフェース
export interface NameInfo {
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

const initialName: NameInfo = {
  event_grp_cd: "",
  lend_name: "",
  client_cd: 0,
  requester_position: "",
  requester_name: "",
  content: "",
  income_item1: "",
  income_amount1: 0,
  income_item2: "",
  income_amount2: 0,
  income_item3: "",
  income_amount3: 0,
  income_total: 0,
  outgo_item1: "",
  outgo_amount1: 0,
  outgo_item2: "",
  outgo_amount2: 0,
  outgo_item3: "",
  outgo_amount3: 0,
  outgo_total: 0,
  total_balance: 0,
  remind: "",
}

//　類似実績情報インターフェース
export interface SimilarInfo {
  id: string,
  event_grp_cd: string,
  other_flg: boolean,
  similar_cd: number,
  sim_event_name: string,
  sim_venue_name: string,
  sim_period: string,
  sim_day_cnt: number,
  sim_capacity: number,
  sim_dayly: number,
  sim_percent: number,
  sim_income: number,
  sim_outgo: number,
  sim_balance: number,     
}

export interface CirculateInfo {
  id: string,
  event_grp_cd: string,
  type_kind: number,
  circulate_cd: number,
  position_name: string,
  chief_name: string,
  disp_order: number,
  kaigi_flg: boolean,
  circulate_flg: boolean,
  report_flg: boolean,
  approval_flg:  boolean,
  drafter_flg: boolean,
}

interface SelectStaff {
  staff_cd: number,
  staff_name: string
}

/**
 * タブコントロール関連
 */
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

export default function Index( props: any ) {

  // ユーザー情報取得
  const user = usePage<PageProps>().props.auth.user;
  const [form] = Form.useForm();

  // 【保存】ボタン状態管理
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(false);

  // イベント基本情報管理
  const [basicInfoDatas, setBasicInfoDatas] = useState<BasicInfo>(initialBasicInfo);

  useEffect(() => {
    // イベント基本情報管理の更新が完了したら、【保存ボタンを有効化】
    setIsSaveBtnDisabled(false);
  },[basicInfoDatas])  

  //　会場情報管理用
  const [venueInfoDatas, setVenueInfoDatas] = useState<VenueInfo[]>();
  
  const updateVenueRowData = (newRowData: VenueInfo[]) => {

    setVenueInfoDatas(newRowData);

    console.log("会場情報親データ:", venueInfoDatas)
  };

  //　チケット情報管理用
  const [ticketInfoDatas, setTicketInfoDatas] = useState<TicketInfo[]>();

  const updateTicketRowData = (newRowData: TicketInfo[]) => {

    setTicketInfoDatas(newRowData);

    console.log("チケット情報親データ:", ticketInfoDatas)
  };

  //　出資情報管理用
  const [investmentInfoDatas, setInvestmentInfoDatas] = useState<InvestmentInfo[]>();

  const updateInvestmentRowData = (newRowData: InvestmentInfo[]) => {

    setInvestmentInfoDatas(newRowData);

    console.log("出資情報親データ:", investmentInfoDatas)
  };

  //　関係先情報管理用
  const [relationInfoDatas, setRelationInfoDatas] = useState<RelationInfo[]>();
  
  const updateRelationRowData = (newRowData: RelationInfo[]) => {

    setRelationInfoDatas(newRowData);

    console.log("関係先情報親データ:", relationInfoDatas)
  };

  //　収支情報管理用
  const [balanceInfoDatas, setBalanceInfoDatas] = useState<BalanceInfo>(initialBalanceInfo);
  const updateBalanceRowData = (newRowData: BalanceInfo) => {

    setBalanceInfoDatas(newRowData);

    console.log("収支 情報親データ:", balanceInfoDatas)
  };

  //　カルテ情報管理用
  const [chartInfoDatas, setChartInfoDatas] = useState<ChartInfo>(initialChart);
  const updateChartRowData = (newRowData: ChartInfo) => {

    setChartInfoDatas(newRowData);

    console.log("カルテ 情報親データ:", chartInfoDatas)
  };

  //　名義情報管理用
  const [nameInfoDatas, setNameInfoDatas] = useState<NameInfo>(initialName);
  const updateNameRowData = (newRowData: NameInfo) => {

    setNameInfoDatas(newRowData);

    console.log("名義 情報親データ:", nameInfoDatas)
  };

  //　類似実績情報管理用
  const [similarInfoDatas, setSimilarInfoDatas] = useState<SimilarInfo[]>();
  const updateSimilarRowData = (newRowData: SimilarInfo[]) => {

    setSimilarInfoDatas(newRowData);

    console.log("類似実績 情報親データ:", similarInfoDatas)
  };

  //　ドキュメント格納フォルダ
  const doc_store_folder = props.doc_store_folder;
  
    let isEdit = false;
    // 追加/編集モード取得
    const inputMode = props.mode;

        if (inputMode == 'edit') {
            isEdit = true;
        }
        else {
        }

    // 他のコンポーネントの再レンダリング時に実行されるコード
    console.log('Component re-rendered.');


    // タブ管理
    const [valueTab, setValueTab] = React.useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValueTab(newValue);
    };

    /**
     * 日付選択イベントハンドラ
     * @param date 
     */
    const handleChangeDate = (date: any, name: string)=> {

      let date_tmp = new Date();
      date_tmp.setTime(date + 1000*60*60*9);// JSTに変換

      setBasicInfoDatas((prevBasicInfoDatas) => {
        const updatedBasicInfoDatas:BasicInfo = {...prevBasicInfoDatas}; // 元のデータをコピー


        switch (name) {
          case "output_eventsheet_dt":
            updatedBasicInfoDatas["output_eventsheet_dt"] = date_tmp.toLocaleDateString();
            break;
          case "director_dt":
            updatedBasicInfoDatas["director_dt"] = date_tmp.toLocaleDateString();
            break;
          case "exective_dt":                   // 常務会資料出力日
            updatedBasicInfoDatas["exective_dt"] = date_tmp.toLocaleDateString();
            break;
          case "output_bis_decision_dt":        // 業務決裁書出力ひ
            updatedBasicInfoDatas["output_bis_decision_dt"] = date_tmp.toLocaleDateString();
            break;
            case "bis_decision_dt":             // 業務決裁日
            updatedBasicInfoDatas["bis_decision_dt"] = date_tmp.toLocaleDateString();
            break;
          case "output_name_decision_dt":       // 名義決裁書出力日
            updatedBasicInfoDatas["output_name_decision_dt"] = date_tmp.toLocaleDateString();
            break;
          case "name_decision_dt":              //　名義決裁日
            updatedBasicInfoDatas["name_decision_dt"] = date_tmp.toLocaleDateString();
            break;
          case "output_consent_dt":             //　名義貸与承諾書出力日
            updatedBasicInfoDatas["output_consent_dt"] = date_tmp.toLocaleDateString();
            break;
          case "conclusion_dt":
            updatedBasicInfoDatas["conclusion_dt"] = date_tmp.toLocaleDateString();
            break;
          case "transfer_dt":

            updatedBasicInfoDatas["transfer_dt"] = date_tmp.toLocaleDateString();
            break;
          case "output_chart_dt":
            updatedBasicInfoDatas["output_chart_dt"] = date_tmp.toLocaleDateString();
            break;

        }

        return updatedBasicInfoDatas; // 更新されたデータを返す
      });     
    };

    /**
     * テキスト入力項目入力イベントハンドラ
     * @param e 
     */
    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Step 4: Update the state whenever a form field changes
        setBasicInfoDatas((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };
    
      /**
       * テキスト入力イベントハンドラ
       * @param e 
       */
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
            
        setBasicInfoDatas((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        
        setBasicInfoDatas((prevBasicInfoDatas) => {
          const updatedBasicInfoDatas:BasicInfo = {...prevBasicInfoDatas}; // 元のデータをコピー
      
          // 特定のプロパティを更新
          switch (name) {
            case "event_name":
              updatedBasicInfoDatas["event_name"] = value;
              break;
            case "event_kana":
              updatedBasicInfoDatas["event_kana"] = value;
              break;
            case "performer1":
              updatedBasicInfoDatas["performer1"] = value;
              break;
            case "performer2":
              updatedBasicInfoDatas["performer2"] = value;
              break;
            case "scenario":
              updatedBasicInfoDatas["scenario"] = value;
              break;
            case "plan_design":
              updatedBasicInfoDatas["plan_design"] = value;
              break;
            case "plan_background":
              updatedBasicInfoDatas["plan_background"] = value;
              break;
            case "plan_content":
              updatedBasicInfoDatas["plan_content"] = value;
              break;
            case "attach_doc":
              updatedBasicInfoDatas["attach_doc"] = value;
              break;
            case "remind":
              updatedBasicInfoDatas["remind"] = value;
              break;
            case "decision_remind":
              updatedBasicInfoDatas["decision_remind"] = value;
              break;
            case "tv_asahi_ticket":
              updatedBasicInfoDatas["tv_asahi_ticket"] = value;
              break;
            case "sponsorship":
              updatedBasicInfoDatas["sponsorship"] = value;
              break;
            case "pr":
              updatedBasicInfoDatas["pr"] = value;
              break;
            case "circular_stat":
              updatedBasicInfoDatas["circular_stat"] = value;
              break;
            case "bis_decision_no":
              updatedBasicInfoDatas["bis_decision_no"] = value;
              break;
            case "name_decision_no":
              updatedBasicInfoDatas["name_decision_no"] = value;
              break;
            case "pay_off":
              updatedBasicInfoDatas["pay_off"] = value;
              break;
          }

          return updatedBasicInfoDatas; // 更新されたデータを返す
        });
      };

    /**
     * 仮登録チェックイベント
     * @param e 
     */  
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
      const isChecked = e.target.checked;
      
      setBasicInfoDatas((prevBasicInfoDatas) => {
        const updatedBasicInfoDatas = {...prevBasicInfoDatas}; // 元のデータをコピー
        updatedBasicInfoDatas["interim_flg"] = isChecked;
  
        return updatedBasicInfoDatas; // 更新されたデータを返す
      });     

    };

  /**
   * 担当者Select設定
   */
  interface StaffProps {
    options: { id: number; name: string }[];
    defaultValue: number[]; // 配列の型に変更
    onChange: (value: number[]) => void; // パラメータの型も配列の型に変更
  }

  console.log("basicInfoDatas['staff_cd']", basicInfoDatas['staff_cd']);
  let staffCdArray : number[] = [];
  if (basicInfoDatas['staff_cd'] !== null) {
    staffCdArray = basicInfoDatas['staff_cd'].split(',').map(Number);
  }
  console.log("staffCdArray : ", staffCdArray);

    /**
     * 担当者選択イベントハンドラ
     * @param value : 選択担当者
     */
    const handleChangeStaff = (value: number[]) => {

      // 選択された value に対応する label を取得する
      const selectedLabels = value.map((selectedValue) => {
        const selectedOption = props.selectItemUsers.find((option: any) => option.id === selectedValue);
        return selectedOption ? selectedOption.name : '';
      });

      // staff_cdを文字列に変換して格納
      const staffCd = value.join(', ');   // カンマ区切りの文字列に変換
      // staff_nameを文字列に変換して格納
      const staffNameString = selectedLabels.join(', ');   // カンマ区切りの文字列に変換

      setBasicInfoDatas((prevBasicInfoDatas) => {
        const updatedBasicInfoDatas:BasicInfo = {...prevBasicInfoDatas}; // 元のデータをコピー
          updatedBasicInfoDatas["staff_cd"] = staffCd.replace(/^,/, '');
          updatedBasicInfoDatas["staff_name"] = staffNameString.replace(/^,/, '');
        return updatedBasicInfoDatas; // 更新されたデータを返す
      });     
    };
      
  function CustomStaffSelect({ options, defaultValue, onChange }: StaffProps) {
    return (
      <Select
        mode="multiple"
        style={{ width: '80%' }}
        placeholder="担当者を選択"
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {options.map((option) => (
          <Select.Option key={option.id} value={option.id} name="user_id">
            {option.name}
          </Select.Option>
        ))}
      </Select>
    );
  }

  /**
   * 実施形態Select設定
   */
  interface TypeProps {
    options: { type_cd: string; type_name: string }[];
    defaultValue: string; 
    onChange: (value: string) => void; 
  }

  /**
   * 実施形態選択イベントハンドラ
   * @param value : 選択実施形態
   */
  const handleChangeType = (value: string) => {

    setBasicInfoDatas((prevBasicInfoDatas) => {
      const updatedBasicInfoDatas:BasicInfo = {...prevBasicInfoDatas}; // 元のデータをコピー
      updatedBasicInfoDatas["type_cd"] = value;

      return updatedBasicInfoDatas; // 更新されたデータを返す
    });     
  };

  function CustomTypeSelect({ options, defaultValue, onChange }: TypeProps) {
    return (
      <Select
        style={{ width: '30%' }}
        placeholder="実施形態を選択"
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {options.map((option) => (
          <Select.Option key={option.type_cd} value={option.type_cd} name="type_cd">
            {option.type_name}
          </Select.Option>
        ))}
      </Select>
    );
  }

  /**
   * ジャンルSelect設定
   */
  interface GenreProps {
    options: { genre_cd: string; genre_name: string }[];
    defaultValue: string; 
    onChange: (value: string) => void; 
  }

  /**
   * ジャンル選択イベントハンドラ
   * @param value : 選択実施形態
   */
  const handleChangeGenre = (value: string) => {

    setBasicInfoDatas((prevBasicInfoDatas) => {
      const updatedBasicInfoDatas:BasicInfo = {...prevBasicInfoDatas}; // 元のデータをコピー
      updatedBasicInfoDatas["genre_cd"] = value;

      return updatedBasicInfoDatas; // 更新されたデータを返す
    });     
  };

  function CustomGenreSelect({ options, defaultValue, onChange }: GenreProps) {
    return (
      <Select
        style={{ width: '30%' }}
        placeholder="ジャンルを選択"
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {options.map((option) => (
          <Select.Option key={option.genre_cd} value={option.genre_cd} name="genre_cd">
            {option.genre_name}
          </Select.Option>
        ))}
      </Select>
    );
  }

    //　ヘッダー部ボタンイベントハンドラー
  /**
   * ヘッダー部【保存】ボタンイベントハンドラー
   */
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const handleSaveBtnClick = async () => {
    // 入力値を投げる
    console.log("開始");

    if (inputMode == 'edit') {
      await axios
          .post('/api/TBDC002/update',         
          {
            basicInfoDatas,
            venueInfoDatas,
            ticketInfoDatas,
            investmentInfoDatas,
            relationInfoDatas,
            balanceInfoDatas,
            chartInfoDatas,
            nameInfoDatas,
            similarInfoDatas,
            user_id: user.id,
          })
          .then((res: any)=>{
              console.log(res);
              alert("データ登録完了");
          })
          .catch(error=>{
              console.log(error);
              alert("登録に失敗しました。\n基本情報の公演名、並びに詳細タブで情報を追加した場合には\n会場：開始日（必須）」、「出資：取引先」、「クレジット：見出し」、「類似実績：全項目」に\n入力漏れが無いか確認してください。");
          })   
    }
    else {
      await axios
        .post('/api/TBDC001/store',         
        {
          basicInfoDatas,
          venueInfoDatas,
          ticketInfoDatas,
          investmentInfoDatas,
          relationInfoDatas,
          balanceInfoDatas,
          chartInfoDatas,
          nameInfoDatas,
          similarInfoDatas,
          user_id: user.id,
        })
        .then((res: any)=>{
            console.log(res);
            alert("データ登録完了");

            window.history.pushState(null, '', "/TBDB001");
            location.reload();

        })
        .catch(error=>{
            console.log(error);
            alert("登録に失敗しました。\n基本情報の公演名、並びに詳細タブで情報を追加した場合には\n会場：開始日（必須）」、「出資：取引先」、「クレジット：見出し」、「類似実績：全項目」に\n入力漏れが無いか確認してください。");
          })   
    }
  }

 
  function handleCloseBtnClick() {
    console.log("閉じる");
    window.history.pushState(null, '', "/TBDB001");
      location.reload();
  }


  const [popoverVisible, setPopoverVisible] = useState(false);

  // 特定の処理が完了した後にポップオーバーを表示する関数
  const handleProcessCompletion = () => {
    // 処理が完了した後にポップオーバーを表示
    setPopoverVisible(true);
  };

  type FieldType = {
    event_name?: string;
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    handleSaveBtnClick();
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


   return (
    <AuthenticatedLayout
    user={user}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">イベント登録</h2>}>
    <Head title="シン・トンベイ　イベント登録" />

    <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <Layout >
                    <Form
                    name="event_form"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    >
                      <Content style={{ padding: '0 50px' }}>


                    <div style={{ padding: '20px 20px', width: '100%'}}>
                      <Row>
                          <Col span={2} offset={18}>
                          <Form.Item >
                              <Button style={{backgroundColor: "blue"}} type="primary" htmlType="submit">
                                保存   
                              </Button>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Button disabled>削除</Button>
                            </Col>  
                            <Col span={2}>
                              <Button onClick={handleCloseBtnClick}>閉じる</Button>
                          </Col>
                      </Row>
                  </div>
                  <div style={{ float: 'left', width: '60%', padding: '10px 10px'}}>
                    <Form.Item label="イベントコード : ">
                    <TextArea rows={1} 
                        name="event_grp_cd"
                        style={{ width: 'calc(20% - 3px)' }}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item label="　">
                      <Checkbox name="interm_flg" onChange={handleCheckboxChange} >仮登録</Checkbox>
                    </Form.Item>

                    <Form.Item label="担当者">
                      <CustomStaffSelect options={props.selectItemUsers}  defaultValue={staffCdArray}  onChange={handleChangeStaff} />                  
                    </Form.Item>
                    <Form.Item<FieldType> label="公演名" name="event_name"
                      rules={[
                        {required: true, message: "公演名を入力してください。"},
                      ]}
                      >
                      <TextArea rows={2} 
                        name="event_name"
                        placeholder="公演名は150文字以内で入力してください。" 
                        maxLength={150} 
                        onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="公演名カナ">
                      <TextArea rows={2} 
                        name="event_kana"
                        placeholder="公演名カナは150文字以内で入力してください。" 
                        maxLength={150} 
                        onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="出演者（公開）">
                      <TextArea rows={2} 
                          name="performer1"
                          placeholder="出演者（公開）は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="出演者（非公開）">
                      <TextArea rows={2} 
                          name="performer2"
                          placeholder="出演者（非公開）は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="脚本・演出">
                      <TextArea rows={2} 
                          name="scenario"
                          placeholder="脚本・演出は100文字以内で入力してください。" 
                          maxLength={100} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>

                    <Form.Item label="実施形態"
                      name="type_cd"
                      rules={[
                        {required: true, message: "実施形態を選択してください。"},
                      ]}                    
                    >
                      <CustomTypeSelect options={props.selectItemType} defaultValue={basicInfoDatas['type_cd']} onChange={handleChangeType} />                  
                    </Form.Item>

                    <Form.Item label="ジャンル"
                      name="genre_cd"
                      rules={[
                        {required: true, message: "ジャンルを選択してください。"},
                      ]}                    
                    >
                      <CustomGenreSelect options={props.selectItemGenre} defaultValue={basicInfoDatas['genre_cd']} onChange={handleChangeGenre} />                  
                    </Form.Item>

                    <Form.Item label="企画立案元"
                      rules={[
                        {required: true, message: "企画立案元を入力してください。"},
                      ]}>
                      <TextArea rows={2} 
                          name="plan_design"
                          placeholder="企画立案元は100文字以内で入力してください。" 
                          maxLength={100} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="企画立案背景">
                      <TextArea rows={2} 
                          name="plan_background"
                          placeholder="企画立案背景は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="企画内容">
                      <TextArea rows={4} 
                          name="plan_content"
                          placeholder="企画内容は2000文字以内で入力してください。" 
                          maxLength={2000} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="添付書類">
                      <TextArea rows={1} 
                          name="attach_doc"
                          placeholder="添付書類は150文字以内で入力してください。" 
                          maxLength={150} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="ドキュメント格納フォルダ">
                      
                    </Form.Item>
                    <Form.Item label="備考">
                      <TextArea rows={1} 
                          name="remind"
                          placeholder="備考は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="業務決裁用備考">
                      <TextArea rows={1} 
                          name="decision_remind"
                          placeholder="業務決裁用備考は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="テレ朝チケット">
                      <TextArea rows={1} 
                        name="tv_asahi_ticket"
                        placeholder="テレ朝チケットは100文字以内で入力してください。" 
                        maxLength={100} 
                        onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="協賛">
                      <TextArea rows={1} 
                          name="sponsorship"
                          placeholder="協賛は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="PR">
                      <TextArea rows={1} 
                          name="pr"
                          placeholder="PRは300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>

                  </div> 
                  <div style={{ float: 'right', width: '40%', border: '1px  solid #000000', padding: '10px 10px'}}>
                    <Row>
                      <Form.Item
                          name="output_eventsheet_dt"
                          label="イベントシート出力日"
                          style={{ width: 'calc(80% - 3px)' }}   
                      >
                          <DatePicker locale={locale} onChange={(date) =>handleChangeDate(date, "output_eventsheet_dt")}/>  
                      </Form.Item>
                      <span style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }} />
                        <Button 
                            name="output_eventsheet" 
                            style={{ width: 'calc(20% - 3px)' }}
                            disabled
                            >出力
                        </Button>
                    </Row>
                    <Row>
                      <Form.Item
                          name="director_dt"
                          label="局長会報告日"
                          style={{ width: 'calc(80% - 3px)' }}   
                        >
                          <DatePicker locale={locale} onChange={(date) =>handleChangeDate(date, "director_dt")}/>  
                      </Form.Item>
                      <span style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }} />
                          <Button 
                            name="output_director" 
                            style={{ width: 'calc(20% - 3px)' }}
                            disabled
                            >出力
                          </Button>
                    </Row>
                    <Row>
                      <Form.Item
                          name="exective_dt"
                          label="常務会報告日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} onChange={(date) =>handleChangeDate(date, "exective_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                      <Button 
                          name="output_exective" 
                          style={{ width: 'calc(20% - 3px)' }}
                          disabled
                          >出力
                      </Button>
                    </Row>
                    <Row>
                      <Form.Item
                          name="output_bis_decision_dt"
                          label="業務決裁書出力日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} onChange={(date) =>handleChangeDate(date, "output_bis_decision_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                      <Button 
                          name="output_bis_decision" 
                          style={{ width: 'calc(20% - 3px)' }}
                          disabled
                          >出力
                      </Button>
                    </Row>
                    <Row>
                      <Form.Item label="業務決裁書回議状況">
                        <TextArea rows={1} 
                          name="circular_stat"
                          size="small"
                          placeholder="20文字以内で入力してください。"
                          maxLength={20}
                          onChange={handleTextAreaChange}/>
                      </Form.Item>
                    </Row>
                    <Row>
                      <Form.Item
                          name="bis_decision_dt" 
                          label="業務決裁日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} onChange={(date) =>handleChangeDate(date, "bis_decision_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                    </Row>
                    <Row>
                      <Form.Item label="業務決裁書番号">
                        <TextArea rows={1}
                          name="bis_decision_no"
                          size="small"
                          placeholder="10文字以内で入力してください。"
                          maxLength={10} 
                          onChange={handleTextAreaChange}/>
                      </Form.Item>
                    </Row>
                    <Row>
                      <Form.Item
                          name="output_name_decision_dt"
                          label="名義貸与決裁書出力日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} onChange={(date) =>handleChangeDate(date, "output_name_decision_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                      <Button 
                          name="output_name_decision" 
                          style={{ width: 'calc(20% - 3px)' }}
                          disabled
                          >出力
                      </Button>
                    </Row>
                    <Row>
                      <Form.Item
                          name="name_decision_dt" 
                          label="名義貸与決裁日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                        <DatePicker locale={locale} onChange={(date) =>handleChangeDate(date, "name_decision_dt")}/>  
                      </Form.Item>
                    </Row>
                    <Row>
                      <Form.Item label="名義貸与決裁書番号">
                        <TextArea rows={1}
                          name="name_decision_no"
                          size="small"
                          placeholder="10文字以内で入力してください。"
                          maxLength={10} 
                          defaultValue={basicInfoDatas['name_decision_no']} 
                          onChange={handleTextAreaChange}/>
                      </Form.Item>
                    </Row>
                    <Row>
                      <Form.Item
                         name="output_consent_dt"
                          label="名義貸与承諾書出力日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} onChange={(date) =>handleChangeDate(date, "output_consent_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                      <Button 
                         name="output_name_consent"
                         style={{ width: 'calc(20% - 3px)' }}
                         disabled
                         >出力
                      </Button>
                    </Row>
                    <Row>
                      <Form.Item
                           name="conclusion_dt"
                          label="契約締結日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker onChange={(date) =>handleChangeDate(date, "conclusion_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                    </Row>
                    <Row>
                      <Form.Item
                           name="transfer_dt"
                          label="契約移管日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} onChange={(date) =>handleChangeDate(date, "transfer_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                    </Row>
                    <Row>
                      <Form.Item label="精算状況">
                        <TextArea rows={1}
                          name="pay_off"
                          size="small"
                          placeholder="10文字以内で入力してください。"
                          maxLength={10} 
                          onChange={handleTextAreaChange}/>
                      </Form.Item>
                    </Row>
                    <Row>
                      <Form.Item
                           name="output_chart_dt"
                          label="イベントカルテ出力日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} onChange={(date) =>handleChangeDate(date, "output_chart_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                      <Button 
                           name="output_chart"
                           style={{ width: 'calc(20% - 3px)' }}
                           disabled
                           >出力
                      </Button>
                    </Row>
                    <Row>
                      <Button>イベント終了</Button>
                    </Row>

                    </div>
                    </Content>
                    </Form>
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
                        <ChildComponent1
                         rowData={venueInfoDatas || []} 
                         venueSelectItem = {props.selectItemVenu}
                          updateRowData={updateVenueRowData} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={1}>
                        <ChildComponent2
                          rowData={ticketInfoDatas  || []}
                          updateRowData={updateTicketRowData} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={2}>
                        <ChildComponent3
                          rowData={investmentInfoDatas || []}
                          clientSelectItem = {props.selectItemClient}
                          updateRowData={updateInvestmentRowData} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={3}>
                        <ChildComponent4
                          rowData={relationInfoDatas || []}
                          updateRowData={updateRelationRowData} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={4}>
                        <ChildComponent5
                          rowData={balanceInfoDatas || []}
                          updateRowData={updateBalanceRowData} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={5}>
                        <ChildComponent6
                          rowData={chartInfoDatas}
                          updateRowData={updateChartRowData} />                        
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={6}>
                      <ChildComponent7
                        rowData={nameInfoDatas || []}
                        clientSelectItem = {props.selectItemClient}
                        updateRowData={updateNameRowData} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={7}>
                        <ChildComponent8
                          rowData={similarInfoDatas || []}
                           updateRowData={updateSimilarRowData} />
                      </CustomTabPanel>
                  </Box>
                  </Footer>

                  </Layout>
                </div>
            </div>
        </div>
    </div>
</AuthenticatedLayout>

);


        
}
