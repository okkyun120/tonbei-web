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

import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGridPro,
  GridColDef,
  GridCellEditStopParams,
  GridCellEditStopReasons,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridToolbar,
  jaJP,
  MuiEvent,
} from '@mui/x-data-grid-pro';

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
    type_cd: number,
    round_flg: boolean,
    genre_cd: number,
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
    name_flg: boolean,
    up_dt: string,
    user_name: string,
}

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

//　カルテ情報インターフェース
export interface ChartInfo {
  event_grp_cd: string,
  num_recrutiments: number,
  generalization: string, 
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
  const [basicInfoDatas, setBasicInfoDatas] = useState<BasicInfo>(props.evtBasic[0]);

  useEffect(() => {
    // イベント基本情報管理の更新が完了したら、【保存ボタンを有効化】
    setIsSaveBtnDisabled(false);
  },[basicInfoDatas])  

  //　会場情報管理用
  const [venueInfoDatas, setVenueInfoDatas] = useState<VenueInfo[]>(props.evtVenue);
  const updateVenueRowData = (newRowData: VenueInfo[]) => {

    setVenueInfoDatas(newRowData);

    console.log("会場情報親データ:", venueInfoDatas)
  };

  //　チケット情報管理用
  const [ticketInfoDatas, setTicketInfoDatas] = useState<TicketInfo[]>(props.evtTicket);

  const updateTicketRowData = (newRowData: TicketInfo[]) => {

    setTicketInfoDatas(newRowData);

    console.log("チケット情報親データ:", ticketInfoDatas)
  };

  //　出資情報管理用
  const [investmentInfoDatas, setInvestmentInfoDatas] = useState<InvestmentInfo[]>(props.evtInvestment);

  const updateInvestmentRowData = (newRowData: InvestmentInfo[]) => {

    setInvestmentInfoDatas(newRowData);

    console.log("出資情報親データ:", investmentInfoDatas)
  };

  //　関係先情報管理用
  const [relationInfoDatas, setRelationInfoDatas] = useState<RelationInfo[]>(props.evtRelation);
  const updateRelationRowData = (newRowData: RelationInfo[]) => {

    setRelationInfoDatas(newRowData);

    console.log("関係先情報親データ:", relationInfoDatas)
  };

  //　収支情報管理用
  const [balanceInfoDatas, setBalanceInfoDatas] = useState<BalanceInfo>(props.evtBalance[0]);
  const updateBalanceRowData = (newRowData: BalanceInfo) => {

    setBalanceInfoDatas(newRowData);

    console.log("収支 情報親データ:", balanceInfoDatas)
  };

  //　カルテ情報管理用
  const [chartInfoDatas, setChartInfoDatas] = useState<ChartInfo>(props.evtChart[0]);
  const updateChartRowData = (newRowData: ChartInfo) => {

    setChartInfoDatas(newRowData);

    console.log("カルテ 情報親データ:", chartInfoDatas)
  };

  //　名義情報管理用
  const [nameInfoDatas, setNameInfoDatas] = useState<NameInfo>(props.evtName[0]);
  const updateNameRowData = (newRowData: NameInfo) => {

    setNameInfoDatas(newRowData);

    console.log("名義 情報親データ:", nameInfoDatas)
  };

  //　類似実績情報管理用
  const [similarInfoDatas, setSimilarInfoDatas] = useState<SimilarInfo[]>(props.evtSimilar);
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

    const defEventGrpCd = isEdit ? basicInfoDatas['event_grp_cd'] : '';


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
       // updatedBasicInfoDatas["conclusion_dt"] = date_tmp.toLocaleDateString();

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
    
      console.log("basicInfoDatas : ", basicInfoDatas);
  
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
    options: { type_cd: number; type_name: string }[];
    defaultValue: number; 
    onChange: (value: number) => void; 
  }

  /**
   * 実施形態選択イベントハンドラ
   * @param value : 選択実施形態
   */
  const handleChangeType = (value: number) => {

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
    options: { genre_cd: number; genre_name: string }[];
    defaultValue: number; 
    onChange: (value: number) => void; 
  }

  /**
   * ジャンル選択イベントハンドラ
   * @param value : 選択実施形態
   */
  const handleChangeGenre = (value: number) => {

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

  const handleDeleteEvent = async (post: any) => {
    // 入力値を投げる
    console.log("開始");
    await axios
        .post('/api/TBDC002/delete',         
         {
          'event_grp_cd': defEventGrpCd,
          user_id: user.id
         })
        .then((res: any)=>{

              alert("イベントデータ削除しました。");

              window.history.pushState(null, '', "/TBDB001");
              location.reload();
        })
        .catch(error=>{
            console.log(error);
        })   
    }
 
    function handleCloseBtnClick() {
      console.log("閉じる");
      window.history.pushState(null, '', "/TBDB001");
        location.reload();
    }


    /**
     * 各種出力ボタンクイベントハンドラー
     */
    //　
    const handleReportOutputBtnClick = (btn_name: string) => {
     // const buttonName = event.target.name;
      const event_grp_cd = basicInfoDatas['event_grp_cd'];
      const name_flg = basicInfoDatas['name_flg'];

      console.log("basicInfoDatas['name_flg']", basicInfoDatas['name_flg']);
      
      switch (btn_name) {
        case 'output_eventsheet':
          window.history.pushState(null, '', "/TBPC001/" + event_grp_cd);
          break;
        case 'output_director':
          window.history.pushState(null, '', "/TBPC002/" + event_grp_cd + "/" + name_flg) ;
          break;
        case 'output_exective':
          window.history.pushState(null, '', "/TBPC003/" + event_grp_cd);
          break;
        case 'output_bis_decision':
          window.history.pushState(null, '', "/TBPC004/" + event_grp_cd);
          break;
        case 'output_name_decision':
          window.history.pushState(null, '', "/TBPC005/" + event_grp_cd);
          break;
        case 'output_name_consent':
          window.history.pushState(null, '', "/TBPC006/" + event_grp_cd);
          break;
        case 'output_chart':
          window.history.pushState(null, '', "/TBPC007/" + event_grp_cd);
          break;
      }
        location.reload();
    }


  //　DatePicker用デフォルト値設定
  // イベントシート出力日
  const defaultDateEventSheet = basicInfoDatas['output_eventsheet_dt'] ? dayjs(basicInfoDatas['output_eventsheet_dt']) : undefined;
  // 局長会報告日       
  const defaultDateDirctor = basicInfoDatas['director_dt'] ? dayjs(basicInfoDatas['director_dt']) : undefined;                   
  // 常務会報告日       
  const defaultDateExective = basicInfoDatas['exective_dt'] ? dayjs(basicInfoDatas['exective_dt']) : undefined;                   
  // 業務決裁書出力日       
  const defaultDateOutpBisDecision = basicInfoDatas['output_bis_decision_dt'] ? dayjs(basicInfoDatas['output_bis_decision_dt']) : undefined;                   
  // 業務決裁日       
  const defaultDateBisDecisionDt = basicInfoDatas['bis_decision_dt'] ? dayjs(basicInfoDatas['bis_decision_dt']) : undefined;                   
  // 名義貸与決裁書出力日       
  const defaultDateOutpNameDecision = basicInfoDatas['output_name_decision_dt'] ? dayjs(basicInfoDatas['output_name_decision_dt']) : undefined;                   
  // 名義貸与決裁日       
  const defaultDateNameDecisionDt = basicInfoDatas['name_decision_dt'] ? dayjs(basicInfoDatas['name_decision_dt']) : undefined;                   
  // 名義貸与承諾書出力日       
  const defaultDateOutpNameConcent= basicInfoDatas['output_consent_dt'] ? dayjs(basicInfoDatas['output_consent_dt']) : undefined;                   
  // 契約締結日       
  const defaultDateConclusion = basicInfoDatas['conclusion_dt'] ? dayjs(basicInfoDatas['conclusion_dt']) : undefined;                   
  // 契約移管日       
  const defaultDateTransfer = basicInfoDatas['transfer_dt'] ? dayjs(basicInfoDatas['transfer_dt']) : undefined;                   
  // イベントカルテ出力日       
  const defaultDateOutpChart = basicInfoDatas['output_chart_dt'] ? dayjs(basicInfoDatas['output_chart_dt']) : undefined;                   
  
  const [popoverVisible, setPopoverVisible] = useState(false);

  // 特定の処理が完了した後にポップオーバーを表示する関数
  const handleProcessCompletion = () => {
    // 処理が完了した後にポップオーバーを表示
    setPopoverVisible(true);
  };


  // 回議・報告先データ管理用
  const [circulateData, setCirculateData] = useState<CirculateInfo[]>(props.evtCirculate);

  // 回議・報告先モーダルダイアログ表示管理用
  const [isBisModalOpen, setIsBisModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // 出力対象　業務決裁書
  const [targetBisOutput, setTargetBisOutput] = useState(false);

  // モーダルダイアログで【

  const handleBisCancel = () => {
    setIsBisModalOpen(false);
  };

  const handleNameCancel = () => {
    setIsNameModalOpen(false);
  };


  /**
   * モーダルダイアログで【OK】ボタンクリックイベント処理（業務決裁書・名義貸与決裁書　共通）
   * @param post 
   */
  const handleOk  = async (post: any) => {
    // 入力値を投げる
    console.log("回議・報告先更新開始");

    if (targetBisOutput) {
      await axios
      .post('/api/TBDC002/updateCirculate',         
      {
        'circulateData': circulateData, 
        'event_grp_cd': defEventGrpCd,
        'type_kind': 1,
        user_id: user.id
      })
      .then((res: any)=>{

          // 業務決裁書出力
          window.history.pushState(null, '', "/TBPC004/" + defEventGrpCd);
          location.reload();
      })
      .catch(error=>{
          console.log(error);
      })   

      handleBisCancel();
    }
    else {
      await axios
      .post('/api/TBDC002/updateCirculate',         
      {
        'circulateData': circulateData, 
        'event_grp_cd': defEventGrpCd,
        'type_kind': 2,
        user_id: user.id
      })
      .then((res: any)=>{

          // 名義貸与決裁書出力
          window.history.pushState(null, '', "/TBPC005/" + defEventGrpCd);
          location.reload();
      })
      .catch(error=>{
          console.log(error);
      })   

      handleNameCancel();
    }
  }
  
   /**
   * 業務決裁書　回議先ポップアップ関連
   * 
   */

  /**
   * 【業務決裁書出力】ボタンクリックイベント 
   * @param name_flg 
   */
  function handleBisDecisionBtnClick() {

    setTargetBisOutput(true);

    // 回議先選択ダイアログ表示
    showBisModal();
  }

   const showBisModal = () => {
    setIsBisModalOpen(true);
  };

  const [bisHiddenColumns, setBisHiddenColumns] = useState({
    'id': false,
    'event_grp_cd': false,
    'type_kind': false,
    'circulate_cd': false,
    'report_flg': false,
  });

 
  const bis_columns: GridColDef[] = [

    { field: 'id', headerName: 'ID', width: 40 },
    { field: 'event_grp_cd', headerName: 'EVENT_CD', width: 40 },
    { field: 'type_kind', headerName: 'ID', width: 40 },
    { field: 'circulate_cd', headerName: 'CD', width: 40 },
    { field: 'position_name', headerName: '部署・役職名', width: 180 },
    { field: 'chief_name', headerName: '役職・氏名', width: 120 },
    { field: 'disp_order', headerName: '表示順', width: 60, editable: true, type: 'number'},
    { field: 'approval_flg', headerName: '決裁者', width: 60, editable: true, type: 'boolean'},
    { field: 'drafter_flg', headerName: '起案者', width: 60, editable: true, type: 'boolean'},
    { field: 'kaigi_flg', headerName: '回議者', width: 60, editable: true, type: 'boolean'},
    { field: 'circulate_flg', headerName: '回覧先', width: 60, editable: true, type: 'boolean'},
  ];


  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {

    console.log("params", params);
    console.log("event", event);

    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {

    console.log("newRow", newRow);

    const updatedRow = { ...newRow };

    const updatedCirculateData = circulateData.map((row) =>
    row.id === newRow.id ? { ...row, ...newRow } : row
    );

    setCirculateData(updatedCirculateData);

    return updatedRow;
  };

  /**
   * 回議先モーダルダイアログ設定
   * @returns 
   */
  const CirculateSelectForm = (props: any) => {

    return (
        <div style={{ height: 480, width: '60%' }}>
          <Modal
            title="回議先編集"
            width = {800}
              open={isBisModalOpen}
              okText ="出力"
              onOk= {handleOk}
              cancelText="キャンセル"
              onCancel={handleBisCancel}
          >
          <div style={{ height: 400, width: '100%' }}>
              <DataGridPro
                rows={circulateData}
                columns={bis_columns}
                columnVisibilityModel = {bisHiddenColumns}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                />
            </div>
          </Modal>
        </div>
    );
  }
   
  const handleNametOk = () => {
    setIsNameModalOpen(false);
  };


  function handleNameDecisionBtnClick() {
    setTargetBisOutput(false);
    // 報告先のデータを取得
    showNameModal();
  }

  const showNameModal = () => {
    setIsNameModalOpen(true);
  };

  const name_columns: GridColDef[] = [

    { field: 'id', headerName: 'ID', width: 40 },
    { field: 'event_grp_cd', headerName: 'EVENT_CD', width: 40 },
    { field: 'type_kind', headerName: 'ID', width: 40 },
    { field: 'circulate_cd', headerName: 'CD', width: 40 },
    { field: 'position_name', headerName: '部署・役職名', width: 180 },
    { field: 'chief_name', headerName: '役職・氏名', width: 120 },
    { field: 'disp_order', headerName: '表示順', width: 60, editable: true, type: 'number'},
    { field: 'approval_flg', headerName: '決裁者', width: 60, editable: true, type: 'boolean'},
    { field: 'drafter_flg', headerName: '起案者', width: 60, editable: true, type: 'boolean'},
    { field: 'report_flg', headerName: '報告先', width: 60, editable: true, type: 'boolean'},
  ];

  const [nameHiddenColumns, setNameHiddenColumns] = useState({
    'id': false,
    'event_grp_cd': false,
    'type_kind': false,
    'circulate_cd': false,
    'kaigi_flg': false,
    'circulate_flg': false,
  });


  /**
   * 報告先モーダルダイアログ設定
   * @returns 
   */
  const ReportSelectForm = (props: any) => {

    return (
        <div style={{ height: 480, width: '60%' }}>
          <Modal
            title="報告先編集"
            width = {800}
              open={isNameModalOpen}
              okText ="出力"
              onOk= {handleOk}
              cancelText="キャンセル"
              onCancel={handleNameCancel}
          >
          <div style={{ height: 400, width: '100%' }}>
              <DataGridPro
                rows={circulateData}
                columns={name_columns}
                columnVisibilityModel = {nameHiddenColumns}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                />
            </div>
          </Modal>
        </div>
    );
  }

  type FieldType = {
    event_name?: string;
    event_kana?: string;
    performer1?: string; 
    performer2?: string; 
    scenario?: string; 
    type_cd?: number;
    genre_cd?: number;
    plan_design?: string; 
    plan_background?: string; 
    plan_content?: string; 
    attach_doc?: string; 
    remind?: string; 
    decision_remind?: string; 
    tv_asahi_ticket: string;
    sponsorship: string; 
    pr: string; 
  };
  

  const onFinish = (values: any) => {
    console.log('Success:', values);

    handleSaveBtnClick();

  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };



  const getPercentTV_AsahiInvestment = () => {

    const item = investmentInfoDatas.find(item => item.client_cd === 1);

    return item ? item["investment_percent"] : null;
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
                    initialValues={{
                      event_name: basicInfoDatas.event_name, 
                      event_kana: basicInfoDatas.event_kana, 
                      performer1: basicInfoDatas.performer1, 
                      performer2: basicInfoDatas.performer2, 
                      scenario: basicInfoDatas.scenario, 
                      plan_design: basicInfoDatas.plan_design, 
                      plan_background: basicInfoDatas.plan_background, 
                      plan_content: basicInfoDatas.plan_content, 
                      attach_doc: basicInfoDatas.attach_doc, 
                      remind: basicInfoDatas.remind, 
                      decision_remind: basicInfoDatas.decision_remind, 
                      tv_asahi_ticket: basicInfoDatas.tv_asahi_ticket, 
                      sponsorship: basicInfoDatas.sponsorship, 
                      pr: basicInfoDatas.pr, 
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    >
                      <Content style={{ padding: '0 50px' }}>


                    <div style={{ padding: '20px 20px', width: '100%'}}>
                      <Row>
                          <Col span={2} offset={18}>
                              <Button style={{backgroundColor: '#00BFFF'}} type="primary" htmlType="submit">
                                保存   
                              </Button>
                           
                            </Col>
                            <Col span={2}>
                              <Popconfirm
                                  title="削除"
                                  description="本当に削除しますか？"
                                  okText="はい"
                                  cancelText="いいえ"
                                  onPopupClick={handleDeleteEvent}
                              >
                              <Button>削除</Button>
                              </Popconfirm>
                            </Col>  
                            <Col span={2}>
                              <Button onClick={handleCloseBtnClick}>閉じる</Button>
                          </Col>
                      </Row>
                  </div>
                  <div style={{ float: 'left', width: '60%', padding: '10px 10px'}}>
                    <Space.Compact style={{ width: '100%' }}>
                    <Form.Item label="イベントコード"><Input disabled defaultValue={defEventGrpCd}/></Form.Item>
                    <Form.Item><Checkbox name="interm_flg" onChange={handleCheckboxChange} defaultChecked={basicInfoDatas['interim_flg']}>仮登録</Checkbox></Form.Item>
                    </Space.Compact>
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
                        onChange={handleTextAreaChange}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="公演名カナ"
                      name="event_kana">
                      <TextArea rows={2} 
                        name="event_kana"
                        placeholder="公演名カナは150文字以内で入力してください。" 
                        maxLength={150} 
                        onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="出演者（公開）"
                      name="performer1">
                      <TextArea rows={2} 
                          name="performer1"
                          placeholder="出演者（公開）は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="出演者（非公開）"
                      name="performer2">
                      <TextArea rows={2} 
                          name="performer2"
                          placeholder="出演者（非公開）は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="脚本・演出"
                      name="scenario">
                      <TextArea rows={2} 
                          name="scenario"
                          placeholder="脚本・演出は100文字以内で入力してください。" 
                          maxLength={100} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>

                    <Form.Item<FieldType>
                      label="実施形態"
                      name="type_cd"
                      >
                      <CustomTypeSelect options={props.selectItemType} defaultValue={basicInfoDatas['type_cd']} onChange={handleChangeType} />                  
                    </Form.Item>

                    <Form.Item<FieldType>
                      label="ジャンル"
                      name="genre_cd"
                      >
                      <CustomGenreSelect options={props.selectItemGenre} defaultValue={basicInfoDatas['genre_cd']} onChange={handleChangeGenre} />                  
                    </Form.Item>

                    <Form.Item<FieldType>
                      label="企画立案元"
                      name="plan_design">
                      <TextArea rows={2} 
                          name="plan_design"
                          placeholder="企画立案元は100文字以内で入力してください。" 
                          maxLength={100} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="企画立案背景"
                      name="plan_background">
                      <TextArea rows={2} 
                          name="plan_background"
                          placeholder="企画立案背景は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="企画内容"
                      name="plan_content">
                      <TextArea rows={4} 
                          name="plan_content"
                          placeholder="企画内容は2000文字以内で入力してください。" 
                          maxLength={2000} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="添付書類"
                      name="attach_doc">
                      <TextArea rows={1} 
                          name="attach_doc"
                          placeholder="添付書類は150文字以内で入力してください。" 
                          maxLength={150} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item label="ドキュメント格納フォルダ">
                      
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="備考"
                      name="remind">
                      <TextArea rows={1} 
                          name="remind"
                          placeholder="備考は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="業務決裁用備考"
                      name="decision_remind">
                      <TextArea rows={1} 
                          name="decision_remind"
                          placeholder="業務決裁用備考は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="テレ朝チケット"
                      name="tv_asahi_ticket">
                      <TextArea rows={1} 
                        name="tv_asahi_ticket"
                        placeholder="テレ朝チケットは100文字以内で入力してください。" 
                        maxLength={100} 
                        onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="協賛"
                      name="sponsorship">
                      <TextArea rows={1} 
                          name="sponsorship"
                          placeholder="協賛は300文字以内で入力してください。" 
                          maxLength={300} 
                          onChange={handleTextAreaChange}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="PR"
                      name="pr">
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
                          <DatePicker locale={locale} defaultValue ={defaultDateEventSheet} onChange={(date) =>handleChangeDate(date, "output_eventsheet_dt")}/>  
                      </Form.Item>
                      <span style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }} />
                        <Button 
                            name="output_eventsheet" 
                            style={{ width: 'calc(20% - 3px)' }}
                            onClick={() => handleReportOutputBtnClick('output_eventsheet')}
                            >出力
                        </Button>
                    </Row>
                    <Row>
                      <Form.Item
                          name="director_dt"
                          label="局長会報告日"
                          style={{ width: 'calc(80% - 3px)' }}   
                        >
                          <DatePicker locale={locale} defaultValue={defaultDateDirctor} onChange={(date) =>handleChangeDate(date, "director_dt")}/>  
                      </Form.Item>
                      <span style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }} />
                          <Button 
                            name="output_director" 
                            style={{ width: 'calc(20% - 3px)' }}
                            onClick={() => handleReportOutputBtnClick('output_director')}
                            >出力
                          </Button>
                    </Row>
                    <Row>
                      <Form.Item
                          name="exective_dt"
                          label="常務会報告日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} defaultValue={defaultDateExective} onChange={(date) =>handleChangeDate(date, "exective_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                      <Button 
                          name="output_exective" 
                          style={{ width: 'calc(20% - 3px)' }}
                          onClick={() => handleReportOutputBtnClick('output_exective')}
                          >出力
                      </Button>
                    </Row>
                    <Row>
                      <Form.Item
                          name="output_bis_decision_dt"
                          label="業務決裁書出力日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} defaultValue={defaultDateOutpBisDecision} onChange={(date) =>handleChangeDate(date, "output_bis_decision_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                      <Button 
                          name="output_bis_decision" 
                          style={{ width: 'calc(20% - 3px)' }}
                          onClick={() => handleBisDecisionBtnClick()}
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
                          defaultValue={basicInfoDatas['circular_stat']} 
                          onChange={handleTextAreaChange}/>
                      </Form.Item>
                    </Row>
                    <Row>
                      <Form.Item
                          name="bis_decision_dt" 
                          label="業務決裁日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} defaultValue={defaultDateBisDecisionDt} onChange={(date) =>handleChangeDate(date, "bis_decision_dt")}/>  
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
                          defaultValue={basicInfoDatas['bis_decision_no']} 
                          onChange={handleTextAreaChange}/>
                      </Form.Item>
                    </Row>
                    <Row>
                      <Form.Item
                          name="output_name_decision_dt"
                          label="名義貸与決裁書出力日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} defaultValue={defaultDateOutpNameDecision} onChange={(date) =>handleChangeDate(date, "output_name_decision_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                      <Button 
                          name="output_name_decision" 
                          style={{ width: 'calc(20% - 3px)' }}
                          onClick={() => handleNameDecisionBtnClick()}
                          >出力
                      </Button>
                    </Row>
                    <Row>
                      <Form.Item
                          name="name_decision_dt" 
                          label="名義貸与決裁日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                        <DatePicker locale={locale} defaultValue={defaultDateNameDecisionDt} onChange={(date) =>handleChangeDate(date, "name_decision_dt")}/>  
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
                          <DatePicker locale={locale} defaultValue={defaultDateOutpNameConcent} onChange={(date) =>handleChangeDate(date, "output_consent_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                      <Button 
                         name="output_name_consent"
                         style={{ width: 'calc(20% - 3px)' }}
                         onClick={() => handleReportOutputBtnClick('output_name_consent')}
                        >出力
                      </Button>
                    </Row>
                    <Row>
                      <Form.Item
                           name="conclusion_dt"
                          label="契約締結日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker defaultValue={defaultDateConclusion} onChange={(date) =>handleChangeDate(date, "conclusion_dt")}/>  
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
                          <DatePicker locale={locale} defaultValue={defaultDateTransfer} onChange={(date) =>handleChangeDate(date, "transfer_dt")}/>  
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
                          defaultValue={basicInfoDatas['pay_off']} 
                          onChange={handleTextAreaChange}/>
                      </Form.Item>
                    </Row>
                    <Row>
                      <Form.Item
                           name="output_chart_dt"
                          label="イベントカルテ出力日"
                          style={{ width: 'calc(80% - 3px)' }}                   
                      >
                          <DatePicker locale={locale} defaultValue={defaultDateOutpChart} onChange={(date) =>handleChangeDate(date, "output_chart_dt")}/>  
                      </Form.Item>
                      <span
                          style={{ display: 'inline-block', width: '6px', lineHeight: '5px', textAlign: 'center' }}
                      >
                      </span>
                      <Button 
                           name="output_chart"
                           style={{ width: 'calc(20% - 3px)' }}
                           onClick={() => handleReportOutputBtnClick('output_chart')}
                           >出力
                      </Button>
                    </Row>
                    <Row>
                      <Button>イベント終了</Button>
                    </Row>
                    </div>

                    </Content>
                      <div style = {{display: 'block', width: '100%'}}>

                      </div>


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
                        <ChildComponent1 rowData={venueInfoDatas} venueSelectItem = {props.selectItemVenu} updateRowData={updateVenueRowData} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={1}>
                        <ChildComponent2 rowData={ticketInfoDatas} updateRowData={updateTicketRowData} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={2}>
                        <ChildComponent3 rowData={investmentInfoDatas} clientSelectItem = {props.selectItemClient} updateRowData={updateInvestmentRowData} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={3}>
                        <ChildComponent4 rowData={relationInfoDatas} updateRowData={updateRelationRowData} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={4}>
                        <ChildComponent5 rowData={balanceInfoDatas} updateRowData={updateBalanceRowData} tv_asahi_investment ={getPercentTV_AsahiInvestment()} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={5}>
                        <ChildComponent6 rowData={chartInfoDatas} updateRowData={updateChartRowData} />                        
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={6}>
                      <ChildComponent7 rowData={nameInfoDatas} clientSelectItem = {props.selectItemClient} updateRowData={updateNameRowData} />
                      </CustomTabPanel>
                      <CustomTabPanel value={valueTab} index={7}>
                        <ChildComponent8 rowData={similarInfoDatas} updateRowData={updateSimilarRowData} />
                      </CustomTabPanel>

                  </Box>
                            </Footer>

                  </Layout>
                </div>
                <CirculateSelectForm />
                <ReportSelectForm />



            </div>
        </div>
    </div>
</AuthenticatedLayout>

);


        
}
