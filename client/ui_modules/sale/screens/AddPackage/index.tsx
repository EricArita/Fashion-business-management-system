import React, { useState } from 'react';
import { Card, Button, Form, Input, Row, Col, InputNumber, Radio, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './styles.less';
import Router from 'next/router';
import { fetchAPI, constants } from '../../../../helper';

const Screen = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [packageType, setPackageType] = useState('formula');

  const addPackage = async (values: any) => {
    try {
      const res = await fetchAPI('POST', 'packages', values);
      if (res !== undefined) {
        message.success('Thêm dữ liệu thành công');
        Router.push('/packages');
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      message.error('Thêm dữ liệu thất bại do đã có lỗi xảy ra');
      console.log(error);
    }
  };

  const onSubmit = async(values: any) => {
    setIsDisabled(true);
    await addPackage(values);
    setIsDisabled(false);
  };

  const handleChangeRadio = (e) => {
    setPackageType(e.target.value);
  };

  return (
    <Card bordered={false}>
      <Form
        layout='vertical'
        initialValues={{
          name: '',
          address: '',
          phone: '',
          email: '',
          regcode: '',
          tax: '',
        }}
        onFinish={onSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name='name' label='Tên gói' rules={[{ required: true, message: 'Tên không được bỏ trống !' }]}>
              <Input placeholder='Tên gói' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name='seo' label='SEO' rules={[{ required: true, message: 'SEO không được bỏ trống !' }]}>
              <Input placeholder='SEO' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <div className='radio-group'>
            <span className='label-radio-group'>Điều chỉnh giá:</span>
            <Radio.Group className='option-radio-group' onChange={handleChangeRadio} value={packageType}>
              <Radio value={'formula'}>Theo công thức</Radio>
              <Radio value={'fixed'}>Cố định</Radio>
            </Radio.Group>
          </div>
        </Row>
        {
          packageType === 'formula' ? (
            <Row className='input-info-row'>
              <Col xs={24} sm={12}>
                <Form.Item name='formula' label='Công thức'>
                    <Input placeholder='Công thức' />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <Row className='input-info-row'>
              <Form.Item name='sale' label='Sale'>
                  <InputNumber placeholder='Giá sale' />
              </Form.Item>
              <Form.Item name='currency' label='Tiền tệ'>
                  <Input placeholder='Tiền tệ' />
              </Form.Item>
            </Row>
          )
        }
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

export const AddPackageScreen = Screen;
