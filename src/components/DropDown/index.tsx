import React, { useState } from 'react';
import { Select } from 'antd';


const { Option } = Select;
// type BigCardState = {children: []}

function DropDown(props: any) {


    return (<div>
      <Select defaultValue="text" dropdownMatchSelectWidth={false} onChange={(e) => props.changeCardType(e)}>
        <Option value="text">Short Answer</Option>
        <Option value="mcq">Multiple Choice</Option>
        <Option value="date">Date</Option>
      </Select>
      </div>
    );
}

export default DropDown;

