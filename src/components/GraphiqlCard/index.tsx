import React, {useState} from 'react';
import GraphiQL from 'graphiql';
import {Row, Col, Select, DatePicker} from 'antd';

import 'graphiql/graphiql.css';

const URL = 'https://play.dgraph.io/graphql';

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
      {/* <Col span={24}> */}
      <GraphiQL
        fetcher={graphQLFetcher}
        query={query}
        onEditQuery={(q: any) => setQuery(q)}
      />
      {/* </Col> */}
    </div>
  );
}

export default GraphiqlCard;
