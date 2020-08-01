import React, { useState } from 'react';
import { Select } from 'antd';


const { Option } = Select;
// type BigCardState = {children: []}

function DropDown() {
    // const onChange = (e: any) => {
    //   console.log(e);
    // };
    return (<div>
      <Select defaultValue="TextQ" dropdownMatchSelectWidth={false} >
        <Option value="TextQ">Short Answer</Option>
        <Option value="MCQ">Multiple Choice</Option>
        <Option value="Date">Date</Option>
      </Select>
      </div>
    );
}

export default DropDown;