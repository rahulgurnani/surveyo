import React from 'react';
import {useParams} from 'react-router-dom';
import {useQuery, gql} from '@apollo/client';
import {Alert, Card, Row, Col} from 'antd';
import {Layout} from 'antd';

import {Bar, Doughnut} from 'react-chartjs-2';

export default function VizPage() {
  return (
    <>
      <Layout>
        <Layout.Header>header</Layout.Header>
        <Layout>
          <Layout.Sider breakpoint="md" collapsedWidth={1} />
          <Layout.Content>
            <Card>
              <GqlViz />
            </Card>
          </Layout.Content>
          <Layout.Sider breakpoint="md" collapsedWidth={1} />
        </Layout>
        <Layout.Footer>footer</Layout.Footer>
      </Layout>
    </>
  );
}

function GenerateCsv(id: string) {
  const {loading, error, data} = useQuery(GET_THINGS, {
    variables: {id},
  });
}

const GET_CSV = gql`
  query($id: ID!) {
    getForm(id: $id) {
      title
      fields(order: {asc: order}) {
        type
        title
        entries {
          response {
            id
          }
          date
          rating
          singleChoice {
            title
          }
          text
        }
      }
    }
  }
`;

const GET_THINGS = gql`
  query($id: ID!) {
    getForm(id: $id) {
      title
      fields {
        title
        type
        count
        entries {
          rating
          singleChoice {
            title
          }
        }
      }
    }
  }
`;

function GqlViz() {
  const {id} = useParams();

  const {loading, error, data} = useQuery(GET_THINGS, {
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

  const makeChart = (field: any) => {
    switch (field.type) {
      case 'SingleChoice':
        return <Doughnut data={chartSingleChoice(field) as any} />;
      case 'Rating':
        return <Bar data={chartRating(field) as any} />;
    }
  };

  console.log('AAAH', data);

  return (
    <>
      <Row>
        <h2>Visualizations</h2>
      </Row>
      <Row gutter={[16, 16]}>
        {data.getForm.fields.map((field: any) => {
          const chart = makeChart(field);
          if (chart) {
            return (
              <Col span={12}>
                <Card>
                  <h3>{field.title}</h3>
                  {chart}
                </Card>
              </Col>
            );
          }
        })}
      </Row>
    </>
  );
}

function chartRating(field: any) {
  const count = counter(field.entries.map((entry: any) => entry.rating));

  const labels = [];
  const data = [];

  for (let i = 1; i <= field.count; i++) {
    labels.push(i);
    data.push(count[i] || 0);
  }

  return {
    datasets: [
      {
        data,
        label: 'Votes',
      },
    ],
    labels,
  };
}

function chartSingleChoice(field: any) {
  const count = counter(
    field.entries.map((entry: any) => entry.singleChoice?.title)
  );

  return {
    datasets: [
      {
        data: Object.values(count),
        backgroundColor: chartColors,
      },
    ],
    labels: Object.keys(count),
  };
}

const chartColors = [
  '#ff0029',
  '#377eb8',
  '#66a61e',
  '#984ea3',
  '#00d2d5',
  '#ff7f00',
  '#af8d00',
  '#7f80cd',
  '#b3e900',
  '#c42e60',
  '#a65628',
  '#f781bf',
  '#8dd3c7',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#fccde5',
  '#bc80bd',
  '#ffed6f',
  '#c4eaff',
  '#cf8c00',
  '#1b9e77',
  '#d95f02',
  '#e7298a',
  '#e6ab02',
  '#a6761d',
  '#0097ff',
  '#00d067',
  '#000000',
  '#252525',
  '#525252',
  '#737373',
  '#969696',
  '#bdbdbd',
  '#f43600',
  '#4ba93b',
  '#5779bb',
  '#927acc',
  '#97ee3f',
  '#bf3947',
  '#9f5b00',
  '#f48758',
  '#8caed6',
  '#f2b94f',
  '#eff26e',
  '#e43872',
  '#d9b100',
  '#9d7a00',
  '#698cff',
  '#d9d9d9',
  '#00d27e',
  '#d06800',
  '#009f82',
  '#c49200',
  '#cbe8ff',
  '#fecddf',
  '#c27eb6',
  '#8cd2ce',
  '#c4b8d9',
  '#f883b0',
  '#a49100',
  '#f48800',
  '#27d0df',
  '#a04a9b',
];

function counter(arr: string[]) {
  const count: any = {};

  for (const element of arr) {
    if (element === null || element === undefined) {
      continue;
    }

    if (count[element]) {
      count[element]++;
    } else {
      count[element] = 1;
    }
  }

  return count;
}
