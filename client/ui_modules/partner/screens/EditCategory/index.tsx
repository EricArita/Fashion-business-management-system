import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Row, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { fetchAPI } from '../../../../helper';

interface Props {
  id: string;
}

const Screen = (props: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [category, setCategory] = useState({});

  const [form] = Form.useForm();

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      const res = await fetchAPI('GET', `categories/${props.id}`);
      setCategory(res);
      form.setFieldsValue(res);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const saveCategory = async (values) => {
    try {
      const res = await fetchAPI('PATCH', `categories/${props.id}`, values);
      message.success('Cập nhật thông tin thành công');
      Router.push('/categories');
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
      message.error('Cập nhật thông tin thất bại do đã có lỗi xảy ra');
    }
  };

  return (
    <Card bordered={false}>
      <Form layout='vertical' initialValues={category} form={form} onFinish={saveCategory}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name='name' label='Tên loại' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name='tag' label='Tag' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item>
            <Button icon={<PlusOutlined />} type='primary' htmlType='submit' disabled={isDisabled}>
              Sửa
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
};

export const EditCategoryScreen = Screen;
