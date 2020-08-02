import React, {useState} from 'react';
import {Alert, Button, Card, Form, Input, DatePicker, Radio, Rate} from 'antd';
import {useQuery, useMutation, gql} from '@apollo/client';
import {useParams} from 'react-router-dom';

function replaceAt<T>(arr: T[], idx: number, func: (element: T) => T): T[] {
  return arr.map((element, elementIdx) => {
    if (elementIdx === idx) {
      return func(element);
    }
    return element;
  });
}

function SyForm(props: SyFormProps): JSX.Element {
  const [state, setState] = useState({
    form: {id: props.id},
    entries: props.fields.map(field => {
      return {
        field: {
          id: field.id,
        },
      };
    }),
  });

  const [submitResponse, {loading}] = useMutation(CREATE_RESPONSE);

  console.log(state);

  function handleRadioChange(event: any, idx: number) {
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
  }

  function handleRateChange(event: any, idx: number) {
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
  }

  function handleInputChange(event: any, idx: number) {
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
  }

  function handleDatePickerChange(event: any, idx: number) {
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
  }

  function createField(field: SyField, idx: number): JSX.Element {
    switch (field.type) {
      case 'Date':
        return (
          <DatePicker onChange={event => handleDatePickerChange(event, idx)} />
        );
      case 'Rating':
        return (
          <Rate
            allowClear
            count={field.count}
            onChange={event => handleRateChange(event, idx)}
          />
        );
      case 'SingleChoice':
        return (
          <Radio.Group onChange={event => handleRadioChange(event, idx)}>
            {field.options.map(option => (
              <Radio key={option.id} value={option.id}>
                {option.title}
              </Radio>
            ))}
          </Radio.Group>
        );
      case 'Text':
        return <Input onChange={event => handleInputChange(event, idx)} />;
    }
  }

  async function handleSubmit() {
    const response = await submitResponse({
      variables: {response: state},
    });
    console.log('response', response);
  }

  const fields = props.fields.map((field, idx) => {
    return (
      <Card key={idx} type="inner">
        <p>{field.title}</p>
        <Form.Item>{createField(field, idx)}</Form.Item>
      </Card>
    );
  });

  return (
    <Form>
      {fields}
      <Form.Item>
        <Button onClick={handleSubmit}>Submit</Button>
      </Form.Item>
    </Form>
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

export default function GqlForm() {
  const {id} = useParams();

  const {loading, error, data} = useQuery(GET_FORM, {
    variables: {id},
  });

  if (loading) {
    return <Card title loading />;
  }

  if (error) {
    return (
      <Card title>
        <Alert message={error.message} type="warning" />
      </Card>
    );
  }

  return (
    <Card title={data.getForm.title}>
      <SyForm {...data.getForm} />
    </Card>
  );
}
