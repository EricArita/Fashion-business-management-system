import React from 'react';
// import { withRematch, initStore } from '@client/store';
import { Page } from '../layouts/Page';
import { PageHeader } from 'antd';
import Router from 'next/router';
import Head from 'next/head';
import { AddCompanyScreen } from '../ui_modules/partner/screens/AddWholesaler';

class AddCompanyPage extends React.Component<any, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <Page selectedMenuItem={'companies'} title='Thêm doanh nghiệp - thương hiệu'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/companies')}
          title='Thêm doanh nghiệp - thương hiệu'
          ghost={false}
        />
        <AddCompanyScreen />
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

export default AddCompanyPage;
