import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  Result,
  Input,
  DatePicker,
  Radio,
  Rate,
  Row,
  PageHeader,
  Col,
  message,
} from 'antd';


import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';

import { useForm } from 'antd/lib/form/Form';

function replaceAt<T>(arr: T[], idx: number, func: (element: T) => T): T[] {
  return arr.map((element, elementIdx) => {
    if (elementIdx === idx) {
      return func(element);
    }
    return element;
  });
}

function SyFormFieldTitle(props: any) {
  return <p style={{ margin: 0, color: 'black', fontSize: '16px' }}>
    {props.title}
    {props.required ? <span style={{ color: 'red' }}> *</span> : null}
  </p>;
}

function SyForm(props: SyFormProps): JSX.Element {
  const [state, setState] = useState({
    form: { id: props.id },
    entries: props.fields.map(field => {
      return {
        field: {
          id: field.id,
        },
      };
    }),
  });
  const [formHook] = useForm();
  const [submitResponse, { loading: loadingResponse }] = useMutation(
    CREATE_RESPONSE
  );

  if ((state as any).submitted) {
    return (
      <Card type="inner">
        <Result
          status="success"
          title="Thank you!"
          subTitle="Your response has been recorded."
        />
      </Card>
    );
  }

  const handleRadioChange = (idx: number) => (event: any) => {
    const value = event.target.value;

    setState(state => {
      const entries = replaceAt(state.entries, idx, entry => {
        return {
          ...entry,
          singleChoice: {
            id: value,
          },
        };
      });

      return {
        ...state,
        entries,
      };
    });
  };

  const handleRateChange = (idx: number) => (event: any) => {
    const value = event;

    setState(state => {
      const entries = replaceAt(state.entries, idx, entry => {
        return {
          ...entry,
          rating: value,
        };
      });

      return {
        ...state,
        entries,
      };
    });
  };

  const handleInputChange = (idx: number) => (event: any) => {
    const value = event.target.value;

    setState(state => {
      const entries = replaceAt(state.entries, idx, entry => {
        return {
          ...entry,
          text: value,
        };
      });

      return {
        ...state,
        entries,
      };
    });
  };

  const handleDatePickerChange = (idx: number) => (event: any) => {
    const value = event;

    setState(state => {
      const entries = replaceAt(state.entries, idx, entry => {
        return {
          ...entry,
          date: value,
        };
      });

      return {
        ...state,
        entries,
      };
    });
  };

  const createField = (field: SyField, idx: number): JSX.Element => {
    switch (field.type) {
      case 'Date':
        return (
          <DatePicker mode="date" onChange={handleDatePickerChange(idx)} />
        );
      case 'Rating':
        return (
          <Rate
            allowClear
            count={field.count}
            onChange={handleRateChange(idx)}
          />
        );
      case 'SingleChoice':
        const radioStyle = {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
        };

        return (
          <Radio.Group onChange={handleRadioChange(idx)}>
            {field.options.map(option => (
              <Radio key={option.id} value={option.id} style={radioStyle}>
                {option.title}
              </Radio>
            ))}
          </Radio.Group>
        );
      case 'Text':
        return (
          <Input
            placeholder="Write something..."
            onChange={handleInputChange(idx)}
          />
        );
    }
  };

  const createFieldItem = (field: SyField, idx: number): JSX.Element => {
    const required_rules = {
      rules: [{ required: true, message: 'This field is required' }],
      name: field.title,
    };

    if (field.required) {
      return (
        <Form.Item style={{ margin: 0 }} {...required_rules}>
          {createField(field, idx)}
        </Form.Item>
      );
    } else {
      return (
        <Form.Item style={{ margin: 0 }}>{createField(field, idx)}</Form.Item>
      );
    }
  };

  async function handleSubmit() {
    const values = await formHook.validateFields();

    console.log('Validate', values);

    try {
      const response = await submitResponse({
        variables: { response: state },
      });
      setState({ submitted: true } as any);
      console.log(response);
    } catch (e) {
      message.error(`${e}`);
    }
  }

  const fields = props.fields.map((field, idx) => {
    return (
      <Row gutter={[16, 16]} key={field.id}>
        <Col span={24}>
          <Card key={idx} type="inner" style={{ borderRadius: '4px' }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <SyFormFieldTitle
                  title={field.title}
                  required={field.required}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>{createFieldItem(field, idx)}</Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  });

  return (
    <PageHeader ghost={true} title={props.title}>
      <Form form={formHook} onFinish={handleSubmit}>
        {fields}
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Form.Item>
              <Button
                htmlType="submit"
                loading={loadingResponse}
                type="primary"
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </PageHeader>
  );
}

type SyFormProps = {
  id: string;
  title: string;
  fields: SyField[];
};

type SyField = SyFieldDate | SyFieldRating | SyFieldSingleChoice | SyFieldText;

type SyFieldDate = SyFieldBase & {
  type: 'Date';
};

type SyFieldRating = SyFieldBase & {
  type: 'Rating';
  count: number;
};

type SyFieldSingleChoice = SyFieldBase & {
  type: 'SingleChoice';
  options: SyFieldOptions[];
};

type SyFieldText = SyFieldBase & {
  type: 'Text';
};

type SyFieldBase = {
  id: string;
  title: string;
  required: boolean;
};

type SyFieldOptions = {
  id: string;
  title: string;
};

const GET_FORM = gql`
  query($id: ID!) {
    getForm(id: $id) {
      id
      title
      fields(order: {asc: order}) {
        id
        title
        type
        required
        options(order: {asc: order}) {
          id
          title
        }
        count
      }
    }
  }
`;

const CREATE_RESPONSE = gql`
  mutation($response: AddResponseInput!) {
    addResponse(input: [$response]) {
      response {
        id
      }
    }
  }
`;

export default function FormPage() {
  return <GqlForm />;
}

function GqlForm() {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_FORM, {
    variables: { id },
  });

  if (loading) {
    return (
      <>
        <PageHeader title="...">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card loading />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card loading />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card loading />
            </Col>
          </Row>
        </PageHeader>
      </>
    );
  }

  if (error) {
    return <Alert message={error.message} type="error" />;
  }

  if (data.getForm === null) {
    return (
      <Card title>
        <Alert message="We couldn't find that form." type="warning" />
      </Card>
    );
  }

  return <SyForm {...data.getForm} />;
}
