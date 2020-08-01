import React, { Component } from 'react';
import {  Row, Col } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import './index.css';
import BigCard from './components/BigCard'

function App() {
  return (
    <div className="App">
    <Row>
      <Col span={6}></Col>
      <Col span={12}><BigCard></BigCard></Col>
      <Col span={6}></Col>
    </Row>
    </div>
  );
}

export default App;
