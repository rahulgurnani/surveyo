import React from 'react';
import { Card, Avatar } from 'antd';
import { BorderInnerOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import header from '../../images/header.jpg';
const { Meta } = Card;
function BigCard() {
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
      <SettingOutlined key="setting" />,
      <BorderInnerOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
    //   avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      title="Surveyo"
      description="Simple App that let's you create your surveys"
    />
  </Card>
      </div>
    );
}

  export default BigCard;