import React, {useState} from 'react';
import {Card, Menu, Select, Button, Input, Form, Dropdown} from 'antd';
import update from 'immutability-helper';
import {gql, useMutation} from '@apollo/client';
import {
  BorderInnerOutlined,
  QuestionCircleOutlined,
  DownOutlined,
} from '@ant-design/icons';
import header from '../../images/banner4.jpg';

import TextQuestionCard from '../TextQuestionCard';
import DateQuestionCard from '../DateQuestionCard';
import RatingCard from '../RatingCard';
import MCQCard from '../MCQCard';
import 'antd/dist/antd.css';

import {useForm} from 'antd/lib/form/Form';
import { useAuth0 } from '@auth0/auth0-react';

const {Meta} = Card;

// type BigCardState = {children: []}
type question = any;

function BigCard() {
  const [questions, setQuestions] = useState<question>([]);
  const [questionCard, setQuestionCard] = useState('Text');
  const [surveyTitle, setSurveyTitle] = useState('');
  const [formHook] = useForm();

  const CREATE_FORM = gql`
    mutation($form: AddFormInput!) {
      addForm(input: [$form]) {
        form {
          id
        }
      }
    }
  `;

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

  return (
    <div>
      <Form form={formHook}>
        <Card
          cover={<img alt="example" src={header} />}
          actions={[
            <Dropdown overlay={menu}>
              <Button>
                Add Question <DownOutlined />
              </Button>
            </Dropdown>,
            // <DropDown changeCardType={setQuestionCard} />,
            // <BorderInnerOutlined
            //   key="edit"
            //   onClick={() =>
            //     setQuestions(questions.concat({type: questionCard}))
            //   }
            // />,
            <Button
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
                  creator: {
                    email: user.email
                  }
                };

                console.log('Form: ', form);

                try {
                  var result = await sendToClient({
                    variables: {
                      form: form,
                    },
                  });

                  console.log(result);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Create Form
            </Button>,
          ]}
        >
          <Meta
            title="Surveyo"
            description="Simple App that let's you create simple surveys"
          />
          <br />
          <br />
          {/* <h1>Survey Title</h1> */}

          {/* <Form.Item
            name="note"
            label="Note"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            label="Survey Title"
            name="survey title"
            rules={[{required: true, message: 'Please input Survey title'}]}
          >
            <Input
              placeholder="Enter your survey title"
              onChange={e => {
                console.log(e.target.value);
                setSurveyTitle(e.target.value);
              }}
            />
          </Form.Item>

          <br />
          <br />

          {questions.map((question: question, index: number) => (
            <div key={index}>
              <Card>{getCard(index)}</Card>
              <br />
              <br />
            </div>
          ))}
          <br />
          <br />
        </Card>
      </Form>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default BigCard;
