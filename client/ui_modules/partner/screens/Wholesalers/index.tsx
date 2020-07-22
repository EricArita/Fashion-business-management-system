import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Popconfirm, Form, message, Spin } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import './styles.less';
import { EditableCell } from './components/EditableCell';
import Router from 'next/router';
import { fetchAPI } from '../../../../helper';
// import { config } from '@client/config';

const Screen = () => {
  const [form] = Form.useForm();
  const [wholesalers, setwholesalers] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [maxRecord, setMaxRecord] = useState(0);
  const [pagination, setPagination] = useState({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingwholesalerTable, setLoadingwholesalerTable] = useState(true);
  const [styleDisbledAnchorTag, setStyleDisabledAnchorTag] = useState({});
  useEffect(() => {
    getwholesalers();
  }, []);

  const columns = [
    {
      title: 'Mã doanh nghiệp',
      dataIndex: 'code',
      key: 'code',
      editable: true,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      editable: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      editable: true,
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
              onClick={() => saveEditedwholesaler(record.id)}
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
            <a style={{ ...styleDisbledAnchorTag, marginRight: 8 }} onClick={() => editwholesaler(record)}>
              Sửa
            </a>
            <Popconfirm
              title='Bạn chắc chắn muốn xóa dữ liệu này?'
              onConfirm={() => deletewholesaler(record.id)}
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

  const editwholesaler = (record: any) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
    setStyleDisabledAnchorTag({
      'pointer-events': 'none',
      color: '#ccc',
    });
  };

  const deletewholesaler = async (recordId: string) => {
    try {
      const ret = await fetchAPI('PATCH', `wholesalers/${recordId}`, { deleted: true });

      const index = wholesalers.findIndex((wholesaler) => wholesaler.id === recordId);
      if (index !== -1) {
        const newData = [...wholesalers];
        newData.splice(index, 1);
        setwholesalers(newData);
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

  const saveEditedwholesaler = async (recordId: string) => {
    try {
      const updatedInfo = await form.validateFields();
      const ret = await fetchAPI('PATCH', `wholesalers/${recordId}`, updatedInfo);

      const index = wholesalers.findIndex((wholesaler) => wholesaler.id === recordId);
      if (index !== -1) {
        Object.assign(wholesalers[index], updatedInfo);
        setwholesalers(wholesalers);
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

  const getwholesalers = async () => {
    try {
      const res = await fetchAPI('GET', 'wholesalers', 
        {
          where: {
            deleted: false
          }
        }
      );
      // setPagination(ret.res.pagination);
      // setMaxRecord(ret.res.pagination.count);
      setwholesalers(res);
      setLoadingwholesalerTable(false);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const LoadMore = async () => {
    // try {
    //   if (pagination['current'] < pagination['page']) {
    //     setLoadingMore(true);
    //     const ret = await fetchAPI('GET', {
    //       path: 'wholesalers',
    //       params: {
    //         page: pagination['current'] + 1,
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
    //     if (ret.res.data.length !== 0) {
    //       setPagination(ret.res.pagination);
    //       setwholesalers([...wholesalers, ...ret.res.data]);
    //       setLoadingMore(false);
    //     }
    //   }
    // } catch (error) {
    //   // tslint:disable-next-line: no-console
    //   console.log(error);
    // }
  };

  const spinnerIcon = <LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />;

  return (
    <Card bordered={false}>
      <Form form={form} component={false}>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => Router.push('/addWholesaler')}
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
          dataSource={wholesalers}
          columns={mergedColumns}
          loading={loadingwholesalerTable}
          pagination={false}
          rowKey='id'
        />
      </Form>
      <div className={'pagination-area'}>
        <Button type='primary' onClick={() => LoadMore()}>
          <span>Hiển thị thêm</span>
          <Spin className='spinner-loading' indicator={spinnerIcon} spinning={loadingMore} />
        </Button>
        <span className={'pagination-info'}>
          0/0
          {/* {wholesalers.length} / {maxRecord} */}
        </span>
      </div>
    </Card>
  );
};

export const WholesalersScreen = Screen;
