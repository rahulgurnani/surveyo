import React, { useState } from 'react';
import { Card, Input, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';


const { TextArea } = Input;
const { Option } = Select;
// type BigCardState = {children: []}

function TextQuestionCard(props: any) {
    // const onChange = (e: any) => {
    //   console.log(e);
    // };
    return (<div>
      <Card
      bordered={false}
      actions={[
        <DeleteOutlined  key="setting" label="Check2" onClick={(e) => {props.deleteCard(props.listId)}} />,
        ]}>
      <Input placeholder="Enter your question here" allowClear />
      <br />
      <br />
      <TextArea placeholder="Short answer here" allowClear  disabled />
      </Card>
      </div>
    );
}

export default TextQuestionCard;