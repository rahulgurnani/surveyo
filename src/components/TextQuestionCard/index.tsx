import React from 'react';
import {Card, Input, Checkbox} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

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
        <Checkbox
          onChange={e =>
            updateQuestion({...question, required: e.target.checked})
          }
        >
          Want this to be a required field
        </Checkbox>
        <Input.TextArea placeholder="Short answer here" allowClear disabled />
      </Card>
    </div>
  );
}

export default TextQuestionCard;
