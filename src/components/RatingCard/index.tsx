import React from 'react';
import {Card, Input, Rate, Radio, Checkbox} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

function RatingCard({question, updateQuestion, deleteQuestion}: any) {
  let count = question.count || 3;
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
        <p>Maximum rating</p>
        <Radio.Group
          options={['3', '5', '10']}
          value={count}
          onChange={e => {
            count = e.target.value;
            updateQuestion({...question, count: e.target.value});
          }}
        />
        <Rate
          count={count}
          allowHalf
        />
      </Card>
    </div>
  );
}

export default RatingCard;
