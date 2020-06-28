import React from 'react';
import { Layout, Menu } from 'antd';
import { ShoppingOutlined, TeamOutlined, ProfileOutlined, ContainerOutlined } from '@ant-design/icons';
import './SideBar.less';
import Router from 'next/router';
// import { withRematch, initStore } from '@client/store';
// import { fetchAPI } from '@client/core';
// import { config } from '@client/config';

// const menuTheme = 'light';
// const menuWidth = 256;
// const collapsedWidth = 80;
export interface SideBarProps {
  selectedMenuItem: any;
}
export class SideBar extends React.Component<SideBarProps, any> {
  constructor(props: SideBarProps) {
    super(props);
    this.state = {
      selectedMenuItem: this.props.selectedMenuItem,
      menuCollapsed: false,
      numberOrdersNotPrinted: 0,
    };
  }

  // async countNumerOfOrdersNotPrinted() {
  //   try {
  //     const ret: any = await fetchAPI('GET', {
  //       path: 'orders',
  //       params: {
  //         filter: [
  //           {
  //             where: {
  //               deleted: false,
  //               order_status: 'await',
  //               applicationId: config.appId,
  //             },
  //           } as any,
  //         ],
  //       },
  //     });

  //     if (ret.res.data !== undefined) {
  //       this.setState({
  //         numberOrdersNotPrinted: ret.res.data.length,
  //       });
  //     }
  //   }
  //   catch (error) {
  //     // tslint:disable-next-line: no-console
  //     console.log(error);
  //   }
  // }

  componentDidMount() {
    // this.countNumerOfOrdersNotPrinted();
  }

  render() {
    return (
      <Layout.Sider
        theme='light'
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
        width={256}
      >
        <div className='logo'>
          <img src='/edwork_logo.png' alt='' />
        </div>
        <Menu theme='light' mode='inline' selectedKeys={[this.state.selectedMenuItem]}>
          <Menu.Item key='dashboard' onClick={() => Router.push('/dashboard')}>
            <span>Tổng quan</span>
          </Menu.Item>
          <Menu.Item key='profile' onClick={() => Router.push('/profile')}>
            <span>
              <ProfileOutlined />
              <span> Thông tin tài khoản</span>
            </span>
          </Menu.Item>
          <Menu.ItemGroup
            key='partner'
            title={
              <span>
                <TeamOutlined />
                <span> Đối tác</span>
              </span>
            }
          >
            <Menu.Item key='companies' onClick={() => Router.push('/companies')}>
              <span>Doanh nghiệp/ Thương hiệu</span>
            </Menu.Item>
            <Menu.Item key='suppliers' onClick={() => Router.push('/suppliers')}>
              <span>Nhà cung cấp</span>
            </Menu.Item>
            <Menu.Item key='wholesalers' onClick={() => Router.push('/wholesalers')}>
              <span>Nhà phân phối</span>
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup
            key='products'
            title={
              <span>
                <ContainerOutlined />
                <span> Sản phẩm</span>
              </span>
            }
          >
            <Menu.Item key='categories' onClick={() => Router.push('/categories')}>
              <span>Quản lí Phân Loại Sản Phẩm</span>
            </Menu.Item>
            <Menu.Item key='products' onClick={() => Router.push('/products')}>
              <span>Quản lí sản phẩm</span>
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup
            key='sale'
            title={
              <span>
                <ShoppingOutlined />
                <span> Bán hàng</span>
              </span>
            }
          >
            <Menu.Item key='contracts' onClick={() => Router.push('/contracts')}>
              <span>Quản lí hợp đồng</span>
            </Menu.Item>
            <Menu.Item key='packages' onClick={() => Router.push('/packages')}>
              <span>Quản lí chiết khấu</span>
            </Menu.Item>
            <Menu.Item key='orders' onClick={() => Router.push('/orders')}>
              <div>
                Đơn hàng
                <span className='number-orders-not-printed'>
                  {this.state.numberOrdersNotPrinted}
                </span>
              </div>
            </Menu.Item>
            <Menu.Item key='7'>
              <span>Công nợ</span>
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Layout.Sider>
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

// export const SideBarMenu = withRematch<any>(initStore, mapState, mapDispatch)(SideBar);
export const SideBarMenu = SideBar;