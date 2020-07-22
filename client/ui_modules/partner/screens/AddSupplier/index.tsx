import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Row, Col, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Router from 'next/router';
import './styles.less';
import { fetchAPI } from '../../../../helper';

const Screen = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);

  const addSupplier = async (values: any) => {
    try {
      const res = await fetchAPI('POST','suppliers', values);

      if (res !== undefined) {
        message.success('Thêm dữ liệu thành công');
        Router.push('/suppliers');
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      message.error('Thêm dữ liệu thất bại do đã có lỗi xảy ra');
      console.log(error);
    }
  };

  const onSubmit = async(values: any) => {
    setIsDisabled(true);
    await addSupplier(values);
    setIsDisabled(false);
  };

  // const loadMore = async () => {
  //   try {
  //     if (pagination.current < pagination.page) {
  //       const ret = await fetchAPI('GET', {
  //         path: 'companies',
  //         params: {
  //           page: pagination.current + 1,
  //           filter: [
  //             {
  //               where: {
  //                 deleted: false,
  //                 applicationId: config.appId,
  //               },
  //             },
  //           ],
  //         },
  //       });
  //       if (ret.res.data.length !== 0) {
  //         setPagination(ret.res.pagination);
  //         setCompanyOptions([...companyOptions, ...ret.res.data]);
  //       }
  //     }
  //   } catch (error) {
  //     // tslint:disable-next-line: no-console
  //     console.log(error);
  //   }
  // };

  const handleScroll = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      //loadMore();
    }
  };

  return (
    <Card bordered={false}>
      <div>
        <Form
          layout='vertical'
          form={form}
          initialValues={{
            name: '',
            address: '',
            phone: '',
            email: '',
            code: ''
          }}
          onFinish={onSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name='name' label='Tên nhà cung cấp' rules={[{ required: true }]}>
                <Input placeholder='Tên nhà cung cấp'/>
              </Form.Item>
              <Form.Item name='address' label='Địa chỉ'>
                <Input placeholder='Địa chỉ' />
              </Form.Item>
              <Form.Item name='phone' label='Số điện thoại'>
                <Input placeholder='Số điện thoại' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name='code' label='Mã số nhà cung cấp'  rules={[{ required: true, message: 'Mã số nhà cung cấp không được bỏ trống !' }]}>
                <Input placeholder='Mã số nhà cung cấp' />
              </Form.Item>
              <Form.Item name='email' label='Địa chỉ email' rules={[{ type: 'email' }]}>
                <Input placeholder='Email' />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Form.Item>
              <Button disabled={isDisabled} icon={<PlusOutlined />} type='primary' htmlType='submit'>
                Thêm mới
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
    </Card>
  );
};

export const AddSupplier = Screen;
