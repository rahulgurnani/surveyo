import React, { useState } from 'react';
import { Card, Input, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';


const { TextArea } = Input;
const { Option } = Select;

function TextQuestionCard(props: any) {
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