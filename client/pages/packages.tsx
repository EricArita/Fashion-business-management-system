import React from 'react';
// import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';
import { PackagesScreen } from '../ui_modules/sale/screens/Packages';

interface Props {
  //
}

class Dashboard extends React.Component<Props, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'packages'} title='Gói khuyến mãi'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/dashboard')}
          title='Gói khuyến mãi'
          ghost={false}
        />
        <PackagesScreen />
      </Page>
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
