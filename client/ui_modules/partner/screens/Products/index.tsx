import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Input, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchAPI, constants } from '../../../../helper';
import './style.less';

const { Search } = Input;

const Screen = () => {
  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [pagination, setPagination] = useState({current: 0, totalPages: 0});
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingProductTable, setLoadingProductTable] = useState(false);
  const formatterPrice = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'VND',
  });

  const columns = [
    {
      title: 'Mã Sản Phẩm',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (supplier) => <span>{supplier.name}</span>
    },
    {
      title: 'Ảnh',
      dataIndex: 'photo',
      key: 'photo',
      width: '12%',
      render: (photo: any) => {
        return (
          <img alt={''} src={photo} style={{ width: '100%', height: 'auto' }} />
        );
      }
    },
    {
      title: 'Giá',
      key: 'price',
      render: (record: any) => {
        return (
          <span>{`${formatterPrice.format(record.price)} ${record.currency}`}</span>
        );
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

  useEffect(() => {
    countTotalProducts();
  }, []);

  useEffect(() => {
    if (totalRecords !== 0) {
      getProducts();
    }
  }, [totalRecords]);

  const countTotalProducts = async () => {
    const res = await fetchAPI('GET', 'products/count', {
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

  const getProducts = async () => {
    try {
      if (pagination.current < pagination.totalPages) {
        if (pagination.current !== 0) setLoadingMore(true);
        let res = await fetchAPI('GET', 'products', {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: pagination.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false
          }
        });

        for(let i = 0; i < res.length; i++) {
          const supplier = await fetchAPI('GET', `suppliers/${res[i].supplierId}`);
          res[i].supplier = supplier;
        }

        if (pagination.current === 0) {
          setProducts(res);
          setProductOptions(res); // for filter
        }
        else { // onClick loadmore button
          setProducts([...products, ...res]);
          setProductOptions([...products, ...res]);
          setLoadingMore(false);
        }
        
        pagination.current++;
        setPagination({...pagination});
        setLoadingProductTable(false);
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const spinnerIcon = <LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />;

  return (
    <Card bordered={false}>
      <Search
        placeholder='Tìm tên sản phẩm'
        // onSearch={(value) => doSearchName(value)}
        style={{ width: 200, marginRight: 20 }}
      />
      <Search
        placeholder='Tìm mã sản phẩm' 
        // onSearch={(value) => doSearchCode(value)} 
        style={{ width: 200 }} 
      />
      <div className="table-product">
        <Table dataSource={products} columns={columns} rowKey='id' pagination={false} />
      </div>
      <div className={'pagination-area'}>
        <Button type='primary' onClick={() => getProducts()}>
          <span>Hiển thị thêm</span>
          <Spin className='spinner-loading' indicator={spinnerIcon} spinning={loadingMore} />
        </Button>
        <span className={'pagination-info'}>
          {products.length} / {totalRecords}
        </span>
      </div>
    </Card>
  );
};

export const ProductsScreen = Screen;
