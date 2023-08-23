import React, { useState } from 'react';
import ChildComponent from './ChildComponent';

interface RowData {
    id: number;
    name: string;
    age: number;
  }


const initData =[
    {
      id: 1,
      name: "テスト１",
      age: 25,
    },
    {
      id: 2,
      name: "テスト２",
      age: 36,
    },
    {
      id: 3,
      name: "テスト３",
      age: 19,
    },
    {
      id: 4,
      name: "テスト４",
      age: 28,
    },
    {
      id: 5,
      name: "テスト５",
      age: 23,
    },
  ];


const ParentComponent: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>(initData);

  const updateRowData = (newRowData: RowData[]) => {

    setRowData(newRowData);

    console.log("親データ:", rowData)
  };

  return (
    <div>
      <h2>Parent Component</h2>
      <ChildComponent rowData={rowData} updateRowData={updateRowData} />
    </div>
  );
};

export default ParentComponent;