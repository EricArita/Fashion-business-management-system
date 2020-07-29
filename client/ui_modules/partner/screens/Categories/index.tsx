import React, { useState, useEffect } from 'react';
import { Card, Table } from 'antd';
import Router from 'next/router';
import { fetchAPI } from '../../../../helper';

const Screen = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const res = await fetchAPI('GET', 'categories', {
        where: {
          deleted: false
        }
      });
      setCategories(res);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Công cụ',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a style={{ marginRight: 16 }} onClick={() => Router.push(`/editCategory?id=${record.id}`)}>
              Sửa
            </a>
          </span>
        );
      },
    },
  ];

  return (
    <Card bordered={false}>
      <Table dataSource={categories} columns={columns} pagination={false} rowKey='id' />
    </Card>
  );
};

export const CategoriesScreen = Screen;
