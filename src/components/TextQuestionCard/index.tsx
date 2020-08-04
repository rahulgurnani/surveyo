import React, {useState} from 'react';
import {Card, Input, Select, Checkbox} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

const {TextArea} = Input;
const {Option} = Select;

function TextQuestionCard({question, updateQuestion, deleteQuestion}: any) {
  return (
    <div>
      <Card
        bordered={false}
        actions={[
          <DeleteOutlined
            key="setting"
            label="Check2"
            onClick={e => {
              deleteQuestion();
            }}
          />,
        ]}
      >
        <Input
          placeholder="Enter your question here"
          allowClear
          value={question.title}
          onChange={e => updateQuestion({...question, title: e.target.value})}
        />
        <br></br>
        <Checkbox
          onChange={e =>
            updateQuestion({...question, required: e.target.checked})
          }
        >
          Want this to be a required field
        </Checkbox>
        <br />
        <br />
        <TextArea placeholder="Short answer here" allowClear disabled />
      </Card>
    </div>
  );
}

export default TextQuestionCard;
