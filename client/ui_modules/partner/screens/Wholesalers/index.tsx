import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Popconfirm, Form, message, Spin } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import './styles.less';
import { EditableCell } from './components/EditableCell';
import Router from 'next/router';
import { fetchAPI, constants } from '../../../../helper';
// import { config } from '@client/config';

const Screen = () => {
  const [form] = Form.useForm();
  const [wholesalers, setWholesalers] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({current: 0, totalPages: 0});
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingWholesalerTable, setLoadingWholesalerTable] = useState(true);
  const [styleDisbledAnchorTag, setStyleDisabledAnchorTag] = useState({});
 
  useEffect(() => {
    countTotalWholesalers();
  }, []);

  useEffect(() => {
    if (totalRecords !== 0){
      getWholesalers();
    }
  }, [totalRecords]);

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
            <a style={{ ...styleDisbledAnchorTag, marginRight: 8 }} onClick={() => editWholesaler(record)}>
              Sửa
            </a>
            <Popconfirm
              title='Bạn chắc chắn muốn xóa dữ liệu này?'
              onConfirm={() => deleteWholesaler(record.id)}
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

  const countTotalWholesalers = async () => {
    const res = await fetchAPI('GET', 'wholesalers/count', {
        deleted: false
    });
    console.log(res);

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

  const editWholesaler = (record: any) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
    setStyleDisabledAnchorTag({
      'pointer-events': 'none',
      color: '#ccc',
    });
  };

  const deleteWholesaler = async (recordId: string) => {
    try {
      const ret = await fetchAPI('PATCH', `wholesalers/${recordId}`, { deleted: true });

      const index = wholesalers.findIndex((wholesaler) => wholesaler.id === recordId);
      if (index !== -1) {
        const newData = [...wholesalers];
        newData.splice(index, 1);
        setWholesalers(newData);
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

  const getWholesalers = async () => {
    try {
      if (pagination.current < pagination.totalPages) {
        if (pagination.current !== 0) setLoadingMore(true);
        const res = await fetchAPI('GET', 'wholesalers', {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: pagination.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false
          }
        });

        if (pagination.current === 0) {
          setWholesalers(res);
          // setWholesalerOptions(res); // for filter
        }
        else { // onClick loadmore button
          setWholesalers([...wholesalers, ...res]);
          // setWholesalerOptions([...wholesalers, ...res]);
          setLoadingMore(false);
        }
        
        pagination.current++;
        setPagination({...pagination});
        setLoadingWholesalerTable(false);
      }
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
          loading={loadingWholesalerTable}
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
          {wholesalers.length} / {totalRecords}
        </span>
      </div>
    </Card>
  );
};

export const WholesalersScreen = Screen;
