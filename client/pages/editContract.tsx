import React from 'react';
// import { withRematch, initStore } from '@client/store';
import { LayoutPage } from '../layouts/LayoutPage';
import { PageHeader } from 'antd';
import Router from 'next/router';

import { EditContractScreen } from '../ui_modules/sale/screens/EditContract';

class Page extends React.Component<any, any> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
      id: _context.query.id,
    };
  }

  render() {
    return (
      <LayoutPage selectedMenuItem={'contracts'} title='Sửa thông tin hợp đồng'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/contracts')}
          title='Sửa thông tin hợp đồng'
          ghost={false}
        />
        <EditContractScreen id={this.props.id} />
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

export default Page;
