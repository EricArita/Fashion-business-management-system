import React from 'react';
import { Layout, Dropdown, Menu } from 'antd';
// import './SideBar.less';
// import { withRematch, initStore } from '@client/store';

const logOut = () => {
  try {
    localStorage.clear();
    window.location.href = '/auth/logout';
  } catch (error) {
    // console.log(error);
  }
};

const menu = (
  <Menu className='dropdownMenu' selectedKeys={[]}>
    <Menu.Item key='logout'>
      <a onClick={logOut}>
        &nbsp; <span>Đăng xuất</span>
      </a>
    </Menu.Item>
  </Menu>
);

export class HeaderComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    //
  }

  render() {
    return (
      <Layout.Header className='site-layout-background' style={{ padding: 0 }}>
        <Dropdown overlayClassName='headerDropdown' overlay={menu} trigger={['click']}>
          <span className={`action account`}>
            <span className='name'>
              {this.props.authUser ? this.props.authUser.fullName || this.props.authUser.email : ''}
            </span>
          </span>
        </Dropdown>
      </Layout.Header>
    );
  }
}

const mapState = (rootState: any) => {
  return {
    authUser: rootState.profileModel.authUser,
  };
};

const mapDispatch = (_rootReducer: any) => {
  return {};
};

// export const AppHeader = withRematch<any>(initStore, mapState, mapDispatch)(HeaderComponent);
export const AppHeader = HeaderComponent;