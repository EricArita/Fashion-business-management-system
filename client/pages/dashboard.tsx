import React from 'react';
import { DashboardScreen } from '../ui_modules/home';
// import { withRematch, initStore } from '@client/store';
import { LayoutPage } from '../layouts/LayoutPage';
import { PageHeader } from 'antd';

interface Props {}
interface State {}

class Dashboard extends React.Component<Props, State> {
  static async getInitialProps(_context: any) {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return (
      <LayoutPage selectedMenuItem={'dashboard'} title='Tổng quan'>
        <PageHeader
          className='site-page-header'
          onBack={() => null}
          title='Bảng điều khiển'
          ghost={false}
          backIcon={false}
        />
        <DashboardScreen />
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
