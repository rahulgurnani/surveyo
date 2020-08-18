import React from 'react';
import {Card, Input, DatePicker, Checkbox} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';

function DateQuestionCard({question, updateQuestion, deleteQuestion}: any) {
  return (
    <div>
      <Card
        bordered={false}
        actions={[
          <DeleteOutlined
            key="setting"
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
        <DatePicker
          defaultValue={moment('2015/01/01', dateFormat)}
          format={dateFormat}
          disabled
        />
      </Card>
    </div>
  );
}

export default DateQuestionCard;
