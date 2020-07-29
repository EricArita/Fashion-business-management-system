import React from 'react';
// import { withRematch, initStore } from '@client/store';
import { LayoutPage } from '../layouts/LayoutPage';
import { PageHeader } from 'antd';
import Router from 'next/router';
import { SuppliersScreen } from '../ui_modules/partner/screens/Suppliers';

interface Props {
  //
}
interface State {}
class Dashboard extends React.Component<Props, State> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <LayoutPage selectedMenuItem={'suppliers'} title='Nhà cung cấp'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/dashboard')}
          title='Nhà cung cấp'
          ghost={false}
        />
        <SuppliersScreen />
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
