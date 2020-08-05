import React, {useState} from 'react';
import {Card, Menu, Result, Button, Input, Form, Dropdown, Anchor} from 'antd';
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
import DropDown from '../DropDown';

import {ApolloProvider} from '@apollo/client';
import {ApolloClient, InMemoryCache} from '@apollo/client';
import {error} from 'console';
import {useForm} from 'antd/lib/form/Form';
import { useAuth0 } from "@auth0/auth0-react";

const {Meta} = Card;
const {Link} = Anchor;
// type BigCardState = {children: []}
type question = any;

function BigCard() {
  const [questions, setQuestions] = useState<question>([]);
  const [formSubmitted, setFormSubmitState] = useState(false);
  const [formURL, setFormURL] = useState('');
  const [surveyTitle, setSurveyTitle] = useState('');
  const [formHook] = useForm();
  const {user} = useAuth0();
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

  if (formSubmitted) {
    return (
      <Card type="inner">
        <Result
          status="success"
          title="Thank you!"
          subTitle={
            <Anchor>
              <Link href={formURL} title="Your form is live." />
            </Anchor>
          }
        />
      </Card>
    );
  } else
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
                    creator: user.email
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
                      window.location.href.replace('/creator', '') +
                      '/form/' +
                      id;
                    setFormURL(url);
                    setFormSubmitState(true);
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