import React, { useState } from 'react';
import { Card, Avatar, Select } from 'antd';
import { BorderInnerOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import header from '../../images/header.jpg';

import TextQuestionCard from '../TextQuestionCard'
import MCQCard from '../MCQCard'
import DropDown from '../DropDown'
const { Meta } = Card;


// type BigCardState = {children: []}

function BigCard() {
    const [children, modifyChildren] = useState<JSX.Element[]>( [] );
    const [count, setCount] = useState( 0 );
    const addCard = () => {
        console.log("Check")
        setCount(count => count + 1)
        modifyChildren(children => [...children, <Card key={count}> <TextQuestionCard/> </Card>])
        console.log(children)
    }
    return (<div>
      <Card
    // style={{ width: 300 }}
    cover={
      <img
        alt="example"
        src={header}
      />
    }

    actions={[
      <DropDown/>,
      <BorderInnerOutlined key="edit" onClick={ () => addCard() } />,
    //   <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
    //   avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      title="Surveyo"
      description="Simple App that let's you create simple surveys"
    />
    <br/>
    <br/>

    {children}
  </Card>
      </div>
    );
}

export default BigCard;