import React from 'react';

import {Alert, Card, Table, Tooltip, Space} from 'antd';
import {LineChartOutlined, CodeOutlined, LinkOutlined} from '@ant-design/icons';
import {gql, useQuery} from '@apollo/client';
import {useAuth0} from '@auth0/auth0-react';

const GET_SURVEYS = gql`
  query($email: String!) {
    getUser(email: $email) {
      forms {
        id
        title
        responses {
          id
        }
      }
    }
  }
`;

export default function Viz2() {
  const {user} = useAuth0();

  const {loading, error, data} = useQuery(GET_SURVEYS, {
    variables: {
      email: user.email,
    },
  });

  if (loading) {
    return <Card loading />;
  }

  if (error) {
    console.log(error);
    return <Alert message={error.message} type="warning" />;
  }

  console.log(data);
  const tableData = data.getUser?.forms || [];
  const tableCols = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: any) => text,
    },
    {
      title: 'Responses',
      dataIndex: 'responses',
      key: 'responses',
      render: (text: any, record: any) => record.responses?.length || 0,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Open form">
            <a href={`/form/${record.id}`} target="_blank">
              <LinkOutlined />
            </a>
          </Tooltip>
          <Tooltip title="Visualizations">
            <a href={`/viz/${record.id}/charts`} target="_blank">
              <LineChartOutlined />
            </a>
          </Tooltip>
          <Tooltip title="GraphiQL">
            <a href={`/viz/${record.id}/graphiql`} target="_blank">
              <CodeOutlined />
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return <Table columns={tableCols as any} dataSource={tableData} />;
}
