import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Input } from 'antd';
import Router from 'next/router';
import { fetchAPI, constants } from '../../../../helper';

const { Search } = Input;

const Screen = () => {
  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [pagination, setPagination] = useState({current: 0, totalPages: 0});
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingProductTable, setLoadingProductTable] = useState(false);

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã Sản Phẩm',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Ảnh',
      dataIndex: 'photo',
      key: 'photo',
      width: '10%',
      render: (photo) => <img alt={photo} src={photo} style={{ width: '100%', height: 'auto' }} />
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
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
        const res = await fetchAPI('GET', 'products', {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: pagination.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false
          }
        });

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
      <Table dataSource={products} columns={columns} rowKey='id' pagination={false} />
      <div>
        <Button type='primary' onClick={() => getProducts()}>
          <span>Hiển thị thêm</span>
        </Button>
        <span className={'pagination-info'}>
          {products.length} / {totalRecords}
        </span>
      </div>
    </Card>
  );
};

export const ProductsScreen = Screen;
