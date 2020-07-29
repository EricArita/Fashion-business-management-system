import React from 'react';
// import { withRematch, initStore } from '@client/store';
import { LayoutPage } from '../layouts/LayoutPage';
import { PageHeader } from 'antd';
import Router from 'next/router';

import { AddSupplier } from '../ui_modules/partner/screens/AddSupplier';

class Dashboard extends React.Component<any, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <LayoutPage selectedMenuItem={'suppliers'} title='Thêm nhà cung cấp'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/suppliers')}
          title='Thêm nhà cung cấp'
          ghost={false}
        />
        <AddSupplier />
      </LayoutPage>
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

export default Dashboard;
