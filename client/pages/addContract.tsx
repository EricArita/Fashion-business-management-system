import React from 'react';
// import { withRematch, initStore } from '@client/store';
import { LayoutPage } from '../layouts/LayoutPage';
import { PageHeader } from 'antd';
import Router from 'next/router';
import { AddContractScreen } from '../ui_modules/sale/screens/AddContract';

class Dashboard extends React.Component<any, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <LayoutPage selectedMenuItem={'contracts'} title='Thêm loại hợp đồng'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/contracts')}
          title='Thêm loại hợp đồng'
          ghost={false}
        />
        <AddContractScreen />
      </LayoutPage>
    );
  }
}

// const mapState = (rootState: any) => ({
//   authUser: rootState.profileModel.authUser,
// });

// const mapDispatch = (_rootReducer: any) => {
//   return {
//     profileReducer: _rootReducer.profileModel,
//   };
// };

// export default withRematch(initStore, mapState, mapDispatch)(Dashboard);

export default Dashboard;
