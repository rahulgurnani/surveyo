import React, { useState } from 'react';
import { Form, Input, Button, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
  
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const rowC = {
  display: 'flex',
  flexDirection: 'row',

};


// display:flex; flex-direction:row;
function MCQCard() {
  // const onFinish = (values: any) => {
  //   console.log('Received values of form:', values);
  // };
  
    return (<div>
    <Input placeholder="Enter your question here" allowClear />
    <br/>
    <br/>
    <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel}  >
    <Form.List name="names">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (

              <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? 'Options' : ''}
                required={false}
                key={field.key}
              >
                <div >
              <Radio style={radioStyle} value={1}>
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input option",
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="Please input option" style={{ width: '60%' }} />
                </Form.Item>
              </Radio>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    style={{ margin: '0 8px' }}
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                ) : null}
                </div>
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add();
                }}
                style={{ width: '60%' }}
              >
                <PlusOutlined /> Add option
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  </Form>
  </div>
  );
}

export default MCQCard;