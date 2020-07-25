import React from 'react';
// import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';
import { WholesalersScreen } from '../ui_modules/partner/screens/Wholesalers';

interface Props {
  //
}

class Company extends React.Component<Props, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'wholesalers'} title='Nhà phân phối'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/dashboard')}
          title='Nhà phân phối'
          ghost={false}
        />
        <WholesalersScreen />
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

export default Company;
