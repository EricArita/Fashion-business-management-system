import React, { useState } from 'react';
import { Card, Button, Form, Input, Row, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { fetchAPI } from '../../../../helper';

const Screen = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  const addWholesaler = async (values: any) => {
    try {
      const res = await fetchAPI('POST', 'wholesalers', values);

      if (res !== undefined) {
        message.success('Thêm dữ liệu thành công');
        Router.push('/wholesalers');
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      message.error('Thêm dữ liệu thất bại do đã có lỗi xảy ra');
      console.log(error);
    }
  };

  const onSubmit = async(values: any) => {
    setIsDisabled(true);
    await addWholesaler(values);
    setIsDisabled(false);
  };

  return (
    <Card bordered={false}>
      <Form
        layout='vertical'
        initialValues={{
          name: '',
          code: '',
          address: '',
          phone: '',
          email: '',
        }}
        onFinish={onSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name='name' label='Tên doanh nghiệp - thương hiệu' rules={[{ required: true, message: 'Tên không được bỏ trống !' }]}>
              <Input placeholder='Tên doanh nghiệp - thương hiệu' />
            </Form.Item>
            <Form.Item name='address' label='Địa chỉ'>
              <Input placeholder='Địa chỉ' />
            </Form.Item>
            <Form.Item name='phone' label='Số điện thoại'>
              <Input placeholder='Số điện thoại' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name='code' label='Mã số doanh nghiệp'  rules={[{ required: true, message: 'Mã số doanh nghiệp không được bỏ trống !' }]}>
              <Input placeholder='Mã số doanh nghiệp' />
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
    </Card>
  );
};

export const AddWholesalerScreen = Screen;
