import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Popconfirm, Form, message, Spin } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import './styles.less';
import Router from 'next/router';
import { fetchAPI, constants } from '../../../../helper';

const Screen = () => {
  const [form] = Form.useForm();
  const [contracts, setContracts] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({ current: 0, totalPages: 0 });
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingContractTable, setLoadingContractTable] = useState(false);

  useEffect(() => {
    countTotalContracts();
  }, []);

  useEffect(() => {
    if (totalRecords !== 0){
      setLoadingContractTable(true);
      getContracts();
    }
  }, [totalRecords]);

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      editable: true,
    },
    {
      title: 'Nhà phân phối',
      key: 'wholesaler',
      editable: true,
      render: (_: any, record: any) => {
        return record.wholesaler !== undefined ? record.wholesaler.name : '';
      },
    },
    {
      title: 'Gói chiết khấu',
      key: 'package',
      editable: true,
      render: (_: any, record: any) => {
        if (record.package !== undefined) {
          const pkg = record.package;
          return pkg.sale !== undefined ? `${pkg.name} ${pkg.sale}${pkg.currency}` : pkg.name;
        } 
        else {
          return '';
        }
      },
    },
    {
      title: 'Loại sản phẩm',
      key: 'category',
      editable: true,
      render: (_: any, record: any) => {
        return record.category !== undefined ? record.category.name : '';
      },
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      editable: true,
      render: (_: any, record: any) => {
        return record.product !== undefined ? record.product.name : '';
      },
    },
    {
      title: 'Công cụ',
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <span>
            <a
              style={{ marginRight: 8 }}
              onClick={() => Router.push(`/editContract?id=${record.id}`)}
            >
              Sửa
            </a>
            <Popconfirm
              title='Bạn chắc chắn muốn xóa dữ liệu này?'
              onConfirm={() => deleteContract(record.id)}
              okText='Đồng ý'
              cancelText='Hủy'
            >
              <a>Xóa</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const countTotalContracts = async () => {
    const res = await fetchAPI('GET', 'contracts/count', {
      deleted: false
    });
    if (res.count !== undefined) {
      let totalPages = (res.count / constants.LIMIT_RECORDS_PER_PAGE) | 0;   
      if (res.count % constants.LIMIT_RECORDS_PER_PAGE !== 0) {
        totalPages++;
      }
      pagination.totalPages = totalPages;
      setPagination({...pagination});
      setTotalRecords(res.count);
    }
  }

  const deleteContract = async (recordId: string) => {
    try {
      const ret = await fetchAPI('PATCH', `contracts/${recordId}`, { deleted: true });

      const index = contracts.findIndex((item) => item.id === recordId);
      if (index !== -1) {
        const newData = [...contracts];
        newData.splice(index, 1);
        setContracts(newData);
      }
      setEditingId('');
      message.success('Xóa dữ liệu thành công');
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể xóa dữ liệu do đã có lỗi xảy ra');
    }
  };

  const getContracts = async () => {
    try {
      if (pagination.current < pagination.totalPages) {
        if (pagination.current !== 0) setLoadingMore(true);
        let res = await fetchAPI('GET', 'contracts', {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: pagination.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false
          }
        });

        res = await Promise.all(res.map(async (contract, i) => {
          if (contract.wholesalerId !== undefined) contract.wholesaler = await fetchAPI('GET', `wholesalers/${contract.wholesalerId}`);
          if (contract.categoryId !== undefined) contract.category = await fetchAPI('GET', `categories/${contract.categoryId}`);
          if (contract.productId !== undefined) contract.product = await fetchAPI('GET', `products/${contract.productId}`);
          if (contract.packageId !== undefined) contract.package = await fetchAPI('GET', `packages/${contract.packageId}`);
          return contract;
        }));

        if (pagination.current === 0) {
          setContracts(res);
        }
        else { // onClick loadmore button
          setContracts([...contracts, ...res]);
          setLoadingMore(false);
        }

        pagination.current++;
        setPagination({...pagination});
        setLoadingContractTable(false);
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const spinnerIcon = <LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />;

  return (
    <Card bordered={false}>
      <Form form={form} component={false}>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => Router.push('/addContract')}
          style={{ marginBottom: 16 }}
        >
          Thêm mới
        </Button>
        <Table
          dataSource={contracts}
          columns={columns}
          loading={loadingContractTable}
          pagination={false}
          rowKey='id'
        />
      </Form>
      <div className={'pagination-area'}>
        <Button type='primary' onClick={() => getContracts()}>
          <span>Hiển thị thêm</span>
          <Spin className='spinner-loading' indicator={spinnerIcon} spinning={loadingMore} />
        </Button>
        <span className={'pagination-info'}>
          {contracts.length} / {totalRecords}
        </span>
      </div>
    </Card>
  );
};

export const ContractsScreen = Screen;
