import React, {useState} from 'react';
import GraphiQL from 'graphiql';
import {Row, Col, DatePicker, Layout} from 'antd';

import 'graphiql/graphiql.css';

const {Header, Footer, Sider, Content} = Layout;

const URL = 'https://surveyo.us-west-2.aws.cloud.dgraph.io/graphql';

const queryPanel = {
  width: '80%',
  height: '200px',
  minWidth: '100px',
  alignSelf: 'stretch',
  boxSizing: 'border-box',
  backgroundColor: 'gainsboro',
  padding: '10px 0',
};

function GraphiqlCard({question, updateQuestion, deleteQuestion}: any) {
  const [query, setQuery] = useState('');

  const graphQLFetcher = (graphQLParams: any) => {
    return fetch(URL, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  };

  return (
    <div>
      <Layout style={{height: '100vh'}}>
        <Header style={{backgroundColor: 'white'}}>
          <h1>Query your survey data using GraphiQL</h1>
        </Header>
        <Row style={{height: '100vh'}}>
          <Col span={4}></Col>
          <Col span={16}>
            <GraphiQL
              fetcher={graphQLFetcher}
              query={query}
              onEditQuery={(q: any) => setQuery(q)}
            />
          </Col>
          <Col span={4}></Col>
        </Row>
      </Layout>
      {/* </Col> */}
    </div>
  );
}

export default GraphiqlCard;
