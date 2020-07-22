import React from 'react';
// import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';
import Head from 'next/head';
import { AddWholesalerScreen } from '../ui_modules/partner/screens/AddWholesaler';

class AddWholesalerPage extends React.Component<any, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'wholesalers'} title='Thêm doanh nghiệp - thương hiệu'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/companies')}
          title='Thêm nhà phân phối'
          ghost={false}
        />
        <AddWholesalerScreen />
      </Page>
    );
  }
}

const mapState = (rootState: any) => ({
  authUser: rootState.profileModel.authUser,
});

const mapDispatch = (_rootReducer: any) => {
  return {
    profileReducer: _rootReducer.profileModel,
  };
};

// export default withRematch(initStore, mapState, mapDispatch)(Dashboard);

export default AddWholesalerPage;
