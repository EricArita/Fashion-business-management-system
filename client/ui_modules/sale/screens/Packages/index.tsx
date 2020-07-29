import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Popconfirm, Form, message, Spin } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import './styles.less';
import { EditableCell } from './components/EditableCell';
import Router from 'next/router';
import { fetchAPI, constants} from '../../../../helper';

const Screen = () => {
  const [form] = Form.useForm();
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({current: 0, totalPages: 0});
  const [loadingMore, setLoadingMore] = useState(false);
  const [styleDisbledAnchorTag, setStyleDisabledAnchorTag] = useState({});
  const [loadingPackageTable, setLoadingPackageTable] = useState(false);
 
  const formatterPrice = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'VND',
  });
  
  useEffect(() => {
    countTotalPackages();
  }, []);

  useEffect(() => {
    if (totalRecords !== 0){
      setLoadingPackageTable(true);
      getPackages();
    }
  }, [totalRecords]);

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Công thức',
      dataIndex: 'formula',
      key: 'formula',
      editable: true,
      render: (_: any, record: any) => {
        return record.formula !== undefined ? record.formula : 'N/A';
      }
    },
    {
      title: 'Sale',
      key: 'sale',
      dataIndex: 'sale',
      editable: true,
      render: (_: any, record: any) => {
        return record.sale !== undefined ? formatterPrice.format(record.sale) : 'N/A';
      }
    },
    {
      title: 'Tiền tệ',
      key: 'currency',
      dataIndex: 'currency',
      editable: true,
      render: (_: any, record: any) => {
        return record.currency !== undefined ? record.currency : 'N/A';
      }
    },
    {
      title: 'SEO',
      dataIndex: 'seo',
      key: 'seo',
      editable: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_date',
      key: 'created_date',
      editable: false,
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
              onClick={() => saveEditedPackage(record.id)}
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
            <a style={{...styleDisbledAnchorTag, marginRight: 8}} onClick={() => editPackage(record)}>
              Sửa
            </a>
            <Popconfirm title='Bạn chắc chắn muốn xóa dữ liệu này?' onConfirm={() => deletePackage(record.id)} okText='Đồng ý' cancelText='Hủy'>
              <a style={styleDisbledAnchorTag}>
                Xóa
              </a>
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
        const editing = isEditing(record);
        const propObj = {
          record,
          inputType: col.dataIndex === 'sale' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing,
        };

        if (editing) {
          if (record.formula !== undefined && record.formula !== '') {
            if (col.dataIndex === 'sale' || col.dataIndex === 'currency') {
              propObj.editing = false;
            }
          }
          else if (record.sale !== undefined && record.sale !== '') {
            if (col.dataIndex === 'formula') {
              propObj.editing = false;
            }
          }
        }
        return propObj;
      },
    };
  });

  const isEditing = (record: any) => record.id === editingId;

  const countTotalPackages = async () => {
    const res = await fetchAPI('GET', 'packages/count', {
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

  const editPackage = (record: any) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
    setStyleDisabledAnchorTag({
      pointerEvents: 'none',
      color: '#ccc',
    });
  };

  const deletePackage = async (recordId: string) => {
    try {
      await fetchAPI('PATCH', `packages/${recordId}`, {deleted: true});

      const index = packages.findIndex((item) => item.id === recordId);
      if (index !== -1) {
        const newData = [...packages];
        newData.splice(index, 1);
        setPackages(newData);
      }
      setEditingId('');
      message.success('Xóa dữ liệu thành công');
    }
    catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể xóa dữ liệu do đã có lỗi xảy ra');
    }
  };

  const cancel = () => {
    setEditingId('');
    setStyleDisabledAnchorTag({});
  };

  const saveEditedPackage = async (recordId: string) => {
    try {
      const updatedInfo = await form.validateFields();
      await fetchAPI('PATCH', `packages/${recordId}`, updatedInfo);

      const index = packages.findIndex((item) => item.id === recordId);
      if (index !== -1) {
        Object.assign(packages[index], updatedInfo);
        setPackages(packages);
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

  const getPackages = async () => {
    try {
      if (pagination.current < pagination.totalPages) {
        if (pagination.current !== 0) setLoadingMore(true);
        const res = await fetchAPI('GET','packages', {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: pagination.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false
          }
        });

        if (pagination.current === 0) {
          setPackages(res);
        }
        else { // onClick loadmore button
          setPackages([...packages, ...res]);
          setLoadingMore(false);
        }

        pagination.current++;
        setPagination({...pagination});
        setLoadingPackageTable(false);
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
          onClick={() => Router.push('/addPackage')}
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
          dataSource={packages}
          columns={mergedColumns}
          loading={loadingPackageTable}
          pagination={false}
          rowKey='id'
        />
      </Form>
      <div className={'pagination-area'}>
        <Button
            type='primary'
            onClick={() => getPackages()}
          >
            <span>
              Hiển thị thêm
            </span>
            <Spin className='spinner-loading' indicator={spinnerIcon} spinning={loadingMore}/>
        </Button>
        <span className={'pagination-info'}>{packages.length} / {totalRecords}</span>
      </div>
    </Card>
  );
};

export const PackagesScreen = Screen;
