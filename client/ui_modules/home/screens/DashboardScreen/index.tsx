import React from 'react';
import './styles.less';
import { Card } from 'antd';

class Screen extends React.Component<any, any> {
  render() {
    return <Card bordered={false}>Card content</Card>;
  }
}

export const DashboardScreen = Screen;
