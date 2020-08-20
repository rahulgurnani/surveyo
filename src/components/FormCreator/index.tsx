import React, {useState} from 'react';
import {
  Card,
  Menu,
  Result,
  Button,
  Input,
  Form,
  Dropdown,
  Anchor,
  PageHeader,
  DatePicker, 
  Checkbox,
  Radio,
  Col,
  Row,
  Rate
} from 'antd';
import update from 'immutability-helper';
import {gql, useMutation} from '@apollo/client';
import {DownOutlined} from '@ant-design/icons';


import {useForm} from 'antd/lib/form/Form';
import {useAuth0} from '@auth0/auth0-react';
import {Select} from 'antd';
import moment from 'moment';
import {DeleteOutlined, MinusCircleOutlined, PlusOutlined,} from '@ant-design/icons';

const {Option} = Select;

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

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 4},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 20},
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {span: 24, offset: 0},
    sm: {span: 20, offset: 4},
  },
};

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

function MCQCard({question, updateQuestion, deleteQuestion}: any) {
  const options = question.options || [];
  return (
    <div>
      <Card
        bordered={false}
        actions={[
          <DeleteOutlined
            key="setting"
            label="Check2"
            onClick={() => deleteQuestion()}
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
        <Form
          // form={form}
          name="dynamic_form_item"
          {...formItemLayoutWithOutLabel}
        >
          <Form.List name="names">
            {(fields, {add, remove}) => {
              return (
                <div>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...(index === 0
                        ? formItemLayout
                        : formItemLayoutWithOutLabel)}
                      label={index === 0 ? 'Options' : ''}
                      required={false}
                      key={field.key}
                    >
                      <div>
                        <Row>
                          <Col span={16}>
                            <div>
                              <Radio style={radioStyle} value={1}>
                                <Form.Item
                                  {...field}
                                  validateTrigger={['onChange', 'onBlur']}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: 'Please input option',
                                    },
                                  ]}
                                  noStyle
                                >
                                  <Input
                                    placeholder="Please input option"
                                    style={{width: '60%'}}
                                    value={options[index]}
                                    onChange={e => {
                                      let newOptions = [...options];
                                      newOptions[index] = e.target.value;
                                      updateQuestion({
                                        ...question,
                                        options: newOptions,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </Radio>
                            </div>
                          </Col>
                          <Col span={8}>
                            <div>
                              {fields.length > 1 ? (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  style={{margin: '0 8px'}}
                                  onClick={() => {
                                    remove(field.name);
                                    let newOptions = update(options, {
                                      $splice: [[field.name, 1]],
                                    });
                                    // update(questions, {$splice: [[i, 1, question]]})

                                    // newOptions[index] = e.target.value;
                                    // fields = newOptions;
                                    updateQuestion({
                                      ...question,
                                      options: newOptions,
                                    });
                                  }}
                                />
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                        updateQuestion({
                          ...question,
                          options: [...options, ''],
                        });
                      }}
                      style={{width: '60%'}}
                    >
                      <PlusOutlined /> Add option
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Form>
      </Card>
    </div>
  );
}

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

type question = any;
const CREATE_FORM = gql`
    mutation AddForm($form: AddFormInput!) {
      addForm(input: [$form]) {
        form {
          id
        }
      }
    }
  `;


function FormCreator() {
  const [questions, setQuestions] = useState<question>([]);
  const [formSubmitted, setFormSubmitState] = useState(false);
  const [formURL, setFormURL] = useState('');
  const [surveyTitle, setSurveyTitle] = useState('');
  const [formHook] = useForm();
  const {user} = useAuth0();
  
  const [sendToClient, {loading}] = useMutation(CREATE_FORM);

  const getCard = (i: number) => {
    const question = questions[i];
    const params = {
      question: question,
      updateQuestion: (question: question) =>
        setQuestions(update(questions, {$splice: [[i, 1, question]]})),
      deleteQuestion: () =>
        setQuestions(update(questions, {$splice: [[i, 1]]})),
    };
    switch (question.type) {
      case 'SingleChoice':
        return <MCQCard {...params} />;
      case 'Date':
        return <DateQuestionCard {...params} />;
      case 'Rating':
        return <RatingCard {...params} />;
      default:
        return <TextQuestionCard {...params} />;
    }
  };
  const menu = (
    <Menu onClick={e => setQuestions(questions.concat({type: e.key}))}>
      <Menu.Item key="Text">Short Answer</Menu.Item>
      <Menu.Item key="SingleChoice">Multiple Choice</Menu.Item>
      <Menu.Item key="Date">Date</Menu.Item>
      <Menu.Item key="Rating">Rating</Menu.Item>
    </Menu>
  );

  if (formSubmitted) {
    return (
      <Card type="inner">
        <Result
          status="success"
          title="Thank you!"
          subTitle={
            <Anchor>
              <Anchor.Link href={formURL} title="Your form is live." />
            </Anchor>
          }
        />
      </Card>
    );
  } else
    return (
      <PageHeader ghost={true} title="Create a survey">
        <Form form={formHook}>
          <Card
            actions={[
              <Dropdown overlay={menu}>
                <Button>
                  Add Question <DownOutlined />
                </Button>
              </Dropdown>,
              <Button
                type="primary"
                onClick={async () => {
                  const values = await formHook.validateFields();
                  console.log('validation ' + values.name);
                  for (let index = 0; index < questions.length; index++) {
                    if ('options' in questions[index]) {
                      let newOptions = questions[index].options.map(
                        (value: any, index: any) => {
                          return {order: index, title: value};
                        }
                      );
                      questions[index].options = newOptions;
                    }
                    questions[index].order = index;
                    if (!('required' in questions[index])) {
                      questions[index].required = false;
                    }
                  }
                  var form = {
                    title: surveyTitle,
                    fields: questions,
                    creator: {email: user.email},
                  };

                  console.log('Form: ', form);

                  try {
                    var result = await sendToClient({
                      variables: {
                        form: form,
                      },
                    });

                    console.log(result);
                    let id = result.data.addForm.form[0].id;
                    let url =
                      window.location.href.replace('/create', '') +
                      '/form/' +
                      id;
                    setFormURL(url);
                    setFormSubmitState(true);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Create
              </Button>,
            ]}
          >
            <Form.Item
              label="Survey Title"
              name="survey title"
              rules={[{required: true, message: 'Please input Survey title'}]}
            >
              <Input
                placeholder="Enter your survey title"
                onChange={e => {
                  setSurveyTitle(e.target.value);
                }}
              />
            </Form.Item>
            {questions.map((question: question, index: number) => (
              <div key={index}>
                <Card>{getCard(index)}</Card>
              </div>
            ))}
          </Card>
        </Form>
      </PageHeader>
    );
}

export default FormCreator;
