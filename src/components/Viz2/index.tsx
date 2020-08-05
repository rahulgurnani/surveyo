import React from 'react';

import {Table, Tooltip, Space} from 'antd';
import {LineChartOutlined, CodeOutlined, LinkOutlined} from '@ant-design/icons';

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (text: any) => <a>{text}</a>,
  },
  {
    title: 'Responses',
    dataIndex: 'responses',
    key: 'responses',
  },
  {
    title: 'Actions',
    key: 'action',
    render: (text: any, record: any) => (
      <Space size="middle">
        <Tooltip title="Open form">
          <a href={`/form/${record.id}`}>
            <LinkOutlined />
          </a>
        </Tooltip>
        <Tooltip title="Visualizations">
          <a href={`/viz/${record.id}/charts`}>
            <LineChartOutlined />
          </a>
        </Tooltip>
        <Tooltip title="GraphiQL">
          <a href={`/viz/${record.id}/graphiql`}>
            <CodeOutlined />
          </a>
        </Tooltip>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    id: '0x9d',
    title: 'John Brown',
    responses: 32,
  },
  {
    key: '2',
    id: '0x9d',
    title: 'Jim Green',
    responses: 42,
  },
  {
    key: '3',
    id: '0x9d',
    title: 'Joe Black',
    responses: 32,
  },
];

export default function Viz2() {
  return <Table columns={columns} dataSource={data} />;
}
