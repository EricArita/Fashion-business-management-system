// @ts-ignore
import React from 'react';
import { Footer, SideBarMenu } from '../components';
import { Layout } from 'antd';
import "antd/dist/antd.css";
import Head from 'next/head';
import { AppHeader } from '../components/AppHeader';
// import Router from 'next/router';
// import * as jsCookie from 'js-cookie';


export class Page extends React.Component<any, any> {
  // componentDidMount() {
  //   this.getToken();
  // }

  // getToken = () => {
  //   const idToken = jsCookie.get('token');
  //   if (!idToken) {
  //     Router.push('/auth/login');
  //   }
  // };

  render() {
    return (
      <Layout>
        <Head>
          <title>{this.props.title ? `${this.props.title} | ` : ''}Vodka</title>
        </Head>
        {/* <AdminLayout permission={[]} authRequired={false}></AdminLayout> */}
        <SideBarMenu selectedMenuItem={this.props.selectedMenuItem} />
        <Layout className='site-layout' style={{ marginLeft: 256 }}>
          <AppHeader />
          <Layout.Content
            className='site-layout-background'
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: '100vh',
            }}
          >
            {this.props.children}
          </Layout.Content>
          <Footer title={'@Copyright 2020 by Vodka'} />
        </Layout>
        {/* <DashboardScreen {...this.props} /> */}
      </Layout>
    );
  }
}
