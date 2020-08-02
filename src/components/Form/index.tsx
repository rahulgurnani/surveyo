import React from 'react';
import {Alert, Card, Form, Input, DatePicker, Radio, Rate} from 'antd';

import {useQuery, gql} from '@apollo/client';

function SyForm(props: SyFormProps): JSX.Element {
  function fieldBuilder(field: SyField): JSX.Element {
    switch (field.type) {
      case 'Date':
        return <DatePicker />;
      case 'Rating':
        return <Rate allowClear count={field.count} />;
      case 'SingleChoice':
        return (
          <Radio.Group>
            {field.options.map(option => (
              <Radio key={option.order} value={option.id}>
                {option.title}
              </Radio>
            ))}
          </Radio.Group>
        );
      case 'Text':
        return <Input />;
    }
  }

  const fields = props.fields.map(field => {
    return (
      <Card type="inner">
        <p>{field.title}</p>
        <Form.Item>{fieldBuilder(field)}</Form.Item>
      </Card>
    );
  });

  return <Form>{fields}</Form>;
}

type SyFormProps = {
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
  order: number;
  title: string;
};

type SyFieldOptions = {
  id: string;
  order: number;
  title: string;
};

const GET_FORM = gql`
  query($id: ID!) {
    getForm(id: $id) {
      title
      fields(order: {asc: order}) {
        order
        title
        type
        options(order: {asc: order}) {
          id
          order
          title
        }
        count
      }
    }
  }
`;

type GqlFormProps = {
  id: string;
};

function GqlForm(props: GqlFormProps) {
  const {loading, error, data} = useQuery(GET_FORM, {
    variables: {id: props.id},
  });

  if (loading) return <Card title loading />;

  if (error)
    return (
      <Card title>
        <Alert message={error.message} type="warning" />
      </Card>
    );

  return (
    <Card title={data.getForm.title}>
      <SyForm {...data.getForm} />
    </Card>
  );
}
