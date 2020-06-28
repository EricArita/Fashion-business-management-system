import React from 'react';
import './DashboardScreen.less';
import { Card } from 'antd';

class Screen extends React.Component<any, any> {
  render() {
    return <Card bordered={false}>Card content</Card>;
  }
}

export const DashboardScreen = Screen;
