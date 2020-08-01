import React, { useState } from 'react';
import { Card, Avatar, Select } from 'antd';
import { BorderInnerOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import header from '../../images/banner4.jpg';

import TextQuestionCard from '../TextQuestionCard'
import MCQCard from '../MCQCard'
import DropDown from '../DropDown'
const { Meta } = Card;


// type BigCardState = {children: []}

function BigCard() {
    const [children, modifyChildren] = useState<JSX.Element[]>( [] );
    const [count, setCount] = useState( 0 );
    const [questionCard, setQuestionCard] = useState("text")

    const deleteCard = (id: string) => {
      console.log("ID is: ",id)
      // setCount(count => count - 1)
      modifyChildren(children => {
        console.log(children)
        let newChildren = children.filter((value, index,array) => value.key != id )
        console.log(newChildren)
        return newChildren
      })
    }

    const addCard = () => {
      setCount(count => count + 1)
      modifyChildren(children => [...children, <div key={count}><Card > {getCard(questionCard, count)} </Card><br/><br/></div>])
    }

    const getCard = (questionType: string, listId: any) => {
      switch(questionType){
        case "text":
          return <TextQuestionCard deleteCard={deleteCard} listId={listId}/>
        case "mcq":
          return <MCQCard deleteCard={deleteCard} listId={listId}/>
        default:
          return <TextQuestionCard deleteCard={deleteCard} listId={listId}/>
      }
    }



    return (<div>
      <Card
    cover={
      <img
        alt="example"
        src={header}
        // style={{ height: 240 }}
      />
      
    }
    // style={{ width: 240 }}
    actions={[
      <DropDown changeCardType={setQuestionCard}/>,
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
    <br/>
    <br/>
  </Card>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
      </div>
    );
}

export default BigCard;