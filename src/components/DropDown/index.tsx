import React, {useState} from 'react';
import {Select} from 'antd';

const {Option} = Select;
// type BigCardState = {children: []}

function DropDown(props: any) {
  return (
    <div>
      <Select
        defaultValue="Text"
        dropdownMatchSelectWidth={false}
        onChange={e => props.changeCardType(e)}
      >
        <Option value="Text">Short Answer</Option>
        <Option value="SingleChoice">Multiple Choice</Option>
        <Option value="Date">Date</Option>
        <Option value="Rating">Rating</Option>
        {/* <Option value="date">Date</Option> */}
      </Select>
    </div>
  );
}

export default DropDown;
