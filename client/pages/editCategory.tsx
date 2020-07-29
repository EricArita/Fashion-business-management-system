import React from 'react';
// import { withRematch, initStore } from '@client/store';
import { LayoutPage } from '../layouts/LayoutPage';
import { PageHeader } from 'antd';
import Router from 'next/router';
import { EditCategoryScreen } from '../ui_modules/partner/screens/EditCategory';

interface Props {
  id: string;
}

class Page extends React.Component<Props, any> {
  static async getInitialProps (_context: any) {
    return {
      namespacesRequired: ['common'],
      id: _context.query.id,
    };
  }

  render() {
    return (
      <LayoutPage selectedMenuItem={'categories'} title='Sửa thông tin loại sản phẩm'>
        <PageHeader
          className='site-page-header'
          onBack={() => Router.push('/categories')}
          title='Sửa thông tin loại sản phẩm'
          ghost={false}
        />
        <EditCategoryScreen id={this.props.id} />
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