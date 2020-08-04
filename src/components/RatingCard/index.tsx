import React, {useState} from 'react';
import {Card, Input, Select, Rate, Radio, Checkbox} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import moment from 'moment';

const {TextArea} = Input;
const {Option} = Select;
const dateFormat = 'YYYY/MM/DD';

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
        <p>Maximum rating</p>
        <Radio.Group
          options={['3', '5', '10']}
          value={count}
          onChange={e => {
            count = e.target.value;
            updateQuestion({...question, count: e.target.value});
          }}
        />
        <br />
        <br />
        <Rate
          // defaultValue={(question.count || count) / 2}
          count={count}
          allowHalf
        />
      </Card>
    </div>
  );
}

export default RatingCard;
