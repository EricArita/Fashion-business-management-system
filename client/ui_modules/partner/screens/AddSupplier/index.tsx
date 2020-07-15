import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Row, Col, Select, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Router from 'next/router';
import './styles.less';
// import { fetchAPI } from '@client/core';
// import { config } from '@client/config';
import fetchAPI  from '../../../../helper/apiHelper/fetchApi';
const Screen = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [pagination, setPagination] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [enterInfoManually, SetEnterInfoManually] = useState(false);

  useEffect(() => {
   // getCompanies();
  }, []);

  // const getCompanies = async () => {
  //   try {
  //     const ret = await fetchAPI('GET', {
  //       path: 'companies',
  //       params: {
  //         page: 1,
  //         filter: [
  //           {
  //             where: {
  //               deleted: false,
  //               applicationId: config.appId,
  //             },
  //           },
  //         ],
  //       },
  //     });

  //     setCompanyOptions(ret.res.data);
  //     setPagination(ret.res.pagination);
  //   } catch (error) {
  //     // tslint:disable-next-line: no-console
  //     console.log(error);
  //   }
  // };

  const addSupplier = async (values: any) => {
    try {
      let ret: any;
      let val = values;

      // if (enterInfoManually) {
      //   ret = await fetchAPI('POST', {
      //     path: 'companies',
      //     params: val,
      //   });
      //   val = {companyId: ret.data.id};
      // }

      ret = await fetchAPI('POST','suppliers',val );

      if (ret !== undefined) {
        Router.push('/suppliers');
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const onSubmit = async(values: any) => {
    setIsDisabled(true);
    if (!enterInfoManually) {
      await addSupplier({companyId: selectedCompanyId});
    }
    else {
      await addSupplier(values);
    }
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

  const handleSelectedOption = (_value: any, option) => {
    const selectedOption = companyOptions.find((opt) => opt.id === option.key);
    setSelectedCompanyId(selectedOption.id);
    form.setFieldsValue({
      email: selectedOption.email,
      phone: selectedOption.phone,
      address: selectedOption.address,
      regcode: selectedOption.regcode,
      tax: selectedOption.tax,
    });
  };

  const handleChangeSwitch = (checked: boolean) => {
    if (checked) {
      SetEnterInfoManually(true);
      setSelectedCompanyId(null);
    }
    else {
      SetEnterInfoManually(false);
    }
    form.resetFields();
  };

  return (
    <Card bordered={false}>
      <div className='switch-mode'>
        <span>Chuyển sang chế độ nhập tay &nbsp;</span>
        <Switch size='small' defaultChecked={false}  onChange={handleChangeSwitch}/>
      </div>
      <div>
        <Form
          layout='vertical'
          form={form}
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
              <Form.Item name='name' label='Tên doanh nghiệp - thương hiệu' rules={[{ required: true }]}>
                {
                  enterInfoManually ?
                    <Input placeholder='Tên doanh nghiệp - thương hiệu'/>
                  :
                  <Select
                    showSearch={true}
                    placeholder='Tên doanh nghiệp - thương hiệu'
                    optionFilterProp='children'
                    autoFocus={true}
                    loading={false}
                    onPopupScroll={handleScroll}
                    notFoundContent='Không tìm thấy'
                    onSelect={handleSelectedOption}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                      companyOptions.map((item) => <Option value={item.name} key={item.id}>{item.name}</Option>)
                    }
                  </Select>
                }
              </Form.Item>
              <Form.Item name='address' label='Địa chỉ'>
                <Input disabled={!enterInfoManually} placeholder='Địa chỉ' />
              </Form.Item>
              <Form.Item name='phone' label='Số điện thoại'>
                <Input disabled={!enterInfoManually} placeholder='Số điện thoại' />
              </Form.Item>
              <Form.Item name='email' label='Địa chỉ email' rules={[{ type: 'email' }]}>
                <Input disabled={!enterInfoManually} placeholder='Email' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name='regcode' label='Mã số kinh doanh'>
                <Input disabled={!enterInfoManually} placeholder='Mã số kinh doanh' />
              </Form.Item>
              <Form.Item name='tax' label='Mã số thuế'>
                <Input disabled={!enterInfoManually} placeholder='Mã số thuê' />
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
