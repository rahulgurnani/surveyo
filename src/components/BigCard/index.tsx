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
} from 'antd';
import update from 'immutability-helper';
import {gql, useMutation} from '@apollo/client';
import {DownOutlined} from '@ant-design/icons';

import TextQuestionCard from '../TextQuestionCard';
import DateQuestionCard from '../DateQuestionCard';
import RatingCard from '../RatingCard';
import MCQCard from '../MCQCard';

import {useForm} from 'antd/lib/form/Form';
import {useAuth0} from '@auth0/auth0-react';

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

export default BigCard;
