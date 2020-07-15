import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Popconfirm, Form, message, Spin, Col, Row, Select } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import './styles.less';
import { EditableCell } from './components/EditableCell';
import Router from 'next/router';
// import { fetchAPI, linkModel } from '@client/core';
// import { config } from '@client/config';
import fetchAPI  from '../../../../helper/apiHelper/fetchApi';
const Screen = () => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [suppliers, setSuppliers] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [maxRecord, setMaxRecord] = useState(0);
  const [pagination, setPagination] = useState({current: 0, page: 1});
  const [loadingMore, setLoadingMore] = useState(false);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [loadingSupplierTable, setLoadingSupplierTable] = useState(true);
  const [styleDisbledAnchorTag, setStyleDisabledAnchorTag] = useState({});
  useEffect(() => {
    getSuppliers();
  }, []);

  const columns = [
    {
      title: 'Mã',
      key: 'code',
      editable: true,
      render: (_: any, record: any) => {
        return record.companyId.code;
      },
    },
    {
      title: 'Tên',
      key: 'name',
      editable: true,
      render: (_: any, record: any) => {
        return record.companyId.name;
      },
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      editable: true,
      render: (_: any, record: any) => {
        return record.companyId.address;
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      editable: true,
      render: (_: any, record: any) => {
        return record.companyId.phone;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      editable: true,
      render: (_: any, record: any) => {
        return record.companyId.email;
      },
    },
    {
      title: 'Công cụ',
      key: 'action',
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href='javascript:;'
              onClick={() => saveEditedSupplier(record)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </a>
            <Popconfirm title='Bạn có chắc muốn thoát?' onConfirm={cancel} okText='Thoát' cancelText='Hủy'>
              <a>Thoát</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a style={{ ...styleDisbledAnchorTag, marginRight: 8 }} onClick={() => editSupplier(record)}>
              Sửa
            </a>
            <Popconfirm
              title='Bạn chắc chắn muốn xóa dữ liệu này?'
              onConfirm={() => deleteSupplier(record.id)}
              okText='Đồng ý'
              cancelText='Hủy'
            >
              <a style={styleDisbledAnchorTag}>Xóa</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => {
        return {
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        };
      },
    };
  });

  const isEditing = (record: any) => record.id === editingId;

  const editSupplier = (record: any) => {
    const fieldsValue = {
      name: record.companyId.name,
      address: record.companyId.address,
      phone: record.companyId.phone,
      email: record.companyId.email,
    };
    form.setFieldsValue(fieldsValue);
    setEditingId(record.id);
    setStyleDisabledAnchorTag({
      pointerEvents: 'none',
      color: '#ccc',
    });
  };

  const deleteSupplier = async (recordId: string) => {
    try {
      const ret = await fetchAPI('PATCH', `suppliers/${recordId}`, { deleted: true });

      const index = suppliers.findIndex((supplier) => supplier.id === recordId);
      if (index !== -1) {
        const newData = [...suppliers];
        newData.splice(index, 1);
        setSuppliers(newData);
      }
      setEditingId('');
      message.success('Xóa dữ liệu thành công');
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể xóa dữ liệu do đã có lỗi xảy ra');
    }
  };

  const cancel = () => {
    setEditingId('');
    setStyleDisabledAnchorTag({});
  };

  const saveEditedSupplier = async (record: any) => {
    try {
      const updatedInfo = await form.validateFields();
      const company = record.companyId;
      Object.assign(company, updatedInfo);

      const ret = await fetchAPI('PATCH', `companies/${company.id}`, company);

      const index = suppliers.findIndex((supplier) => supplier.id === record.id);
      if (index !== -1) {
        Object.assign(suppliers[index].companyId, updatedInfo);
        setSuppliers(suppliers);
      }
      setEditingId('');
      setStyleDisabledAnchorTag({});
      message.success('Cập nhật dữ liệu thành công');
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể cập nhật dữ liệu do đã có lỗi xảy ra');
    }
  };

  const getSuppliers = async () => {
    try {
      if (pagination.current < pagination.page) {
        if (pagination.current !== 0) setLoadingMore(true);
        const ret = await fetchAPI('GET', {
          path: 'suppliers',
          params: {
            page: pagination.current + 1,
            filter: [
              {
                where: {
                  deleted: false,
                },
              },
            ],
          },
        });
        const data = await linkModel(ret.res.data, 'companies', 'companyId');

        if (pagination.current === 0) {
          setPagination(ret.res.pagination);
          setMaxRecord(ret.res.pagination.count);
          setSuppliers(data);
          setSupplierOptions(data); // for filter
        }
        else { // onClick loadmore button
          setPagination(ret.res.pagination);
          setSuppliers([...suppliers, ...data]);
          setSupplierOptions([...suppliers, ...data]);
          setLoadingMore(false);
        }
        setLoadingSupplierTable(false);
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const handleScrollSupplierList = (e) => {
    const ele = e.target;
    // tslint:disable-next-line: radix
    if (parseInt(ele.scrollTop) + ele.clientHeight === ele.scrollHeight) {
      getSuppliers();
    }
  };

  const handleSelectSuppliers = (value: string) => {
    if (value !== 'all') {
      const Suppliers = supplierOptions.filter((item) => item.id === value);
      setSuppliers(Suppliers);
    }
    else if (value === 'all') {
      setSuppliers(supplierOptions);
    }
  };

  const spinnerIcon = <LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />;

  return (
    <Card bordered={false}>
      <Card title='Tìm kiếm'>
        <Form form={form} layout='vertical'>
          <Row gutter={16}>
            <Col xs={24} sm={6}>
              <Form.Item name='SupplierCode' label='Mã nhà phân phối'>
                <Select
                  style={{ width: '100%' }}
                  showSearch={true}
                  placeholder='Code'
                  optionFilterProp='children'
                  loading={false}
                  allowClear={true}
                  onPopupScroll={handleScrollSupplierList}
                  notFoundContent='Không tìm thấy'
                  onSelect={handleSelectSuppliers}
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value='all' key='all'>
                    Tất cả
                  </Option>
                  {supplierOptions.map((item) => (
                    <Option value={item.supplierId} key={item.id}>
                      {item.companyId !== undefined && item.companyId.code !== undefined ? item.companyId.code : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <div className='body-content'>
        <Form form={form} component={false}>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => Router.push('/addSupplier')}
            style={{ marginBottom: 16 }}
          >
            Thêm mới
          </Button>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={suppliers}
            columns={mergedColumns}
            loading={loadingSupplierTable}
            pagination={false}
            rowKey='id'
          />
        </Form>
        <div className={'pagination-area'}>
          <Button type='primary' onClick={() => getSuppliers()}>
            <span>Hiển thị thêm</span>
            <Spin className='spinner-loading' indicator={spinnerIcon} spinning={loadingMore} />
          </Button>
          <span className={'pagination-info'}>
            {suppliers.length} / {maxRecord}
          </span>
        </div>
      </div>
    </Card>
  );
};

export const SuppliersScreen = Screen;
