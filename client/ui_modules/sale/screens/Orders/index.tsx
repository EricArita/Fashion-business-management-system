import React, { useState, useEffect, useRef } from 'react';
import {
  Row,
  Input,
  Col,
  Card,
  Button,
  Table,
  Popconfirm,
  Form,
  message,
  Spin,
  Select,
  Modal,
  InputNumber,
  DatePicker,
} from 'antd';
import moment from 'moment';
import {
  PlusOutlined,
  LoadingOutlined,
  SaveFilled,
  PrinterOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import './styles.less';
import { EditableCell } from './components/EditableCell';
import Router from 'next/router';
import { fetchAPI, constants } from '../../../../helper';
import ReactToPrint from 'react-to-print';
import { ExportReactCSV } from './components/ExportReactCSV';
import { values } from 'lodash';
import { resolveMx } from 'dns';

const Screen = () => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const [orders, setOrders] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [totalOrderRecords, setTotalOrderRecords] = useState(0);
  const [orderPagination, setOrderPagination] = useState({ current: 0, totalPages: 0 });
  const [productPagination, setProductPagination] = useState({ current: 0, totalPages: 0 });
  const [wholesalerPagination, setWholesalerPagination] = useState({ current: 0, totalPages: 0 });
  const [totalWholesalerRecords, setTotalWholesalerRecords] = useState(0);
  const [totalProductRecords, setTotalProductRecords] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [styleDisabledAnchorTag, setStyleDisabledAnchorTag] = useState({});
  const [visibleParcelListModal, setVisibleParcelListModal] = useState(false);
  const [parcelData, setParcelData] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [visibleAddParcelModal, setVisibleAddParcelModal] = useState(false);
  const [visibleAddItemModal, setVisibleAddItemModal] = useState(false);
  const [visibleItemListModal, setVisibleItemListModal] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [wholesalerOptions, setWholesalerOptions] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [itemsOfOrder, setItemsOfOrder] = useState([]);
  const [listItemToPrint, setListItemToPrint] = useState([]);
  const [visiblePrintModal, setVisiblePrintModal] = useState(false);
  const [loadingOrderTable, setLoadingOrderTable] = useState(false);
  const [loadingItemTable, setLoadingItemTable] = useState(true);
  const [disableBtnAddNewProduct, setDisableBtnAddNewProduct] = useState(false);
  const [UIprintScreen, setUIprintScreen] = useState(null);
  const [totalPriceOrdersAwait, setTotalPriceOrderAwait] = useState(0);
  const [totalPriceOrdersOnBoard, setTotalPriceOrderOnBoard] = useState(0);

  const orderTableColumns = [
    {
      title: 'Mã nhà phân phối',
      key: 'wholesalerId',
      editable: true,
      render: (_: any, record: any) => {
        return record.wholesalerId !== undefined &&
          record.wholesalerId.companyId !== undefined &&
          record.wholesalerId.companyId.code !== undefined
          ? record.wholesalerId.companyId.code
          : '';
      },
    },
    {
      title: 'Tên nhà phân phối',
      key: 'wholesalerId',
      editable: true,
      render: (_: any, record: any) => {
        return record.wholesalerId !== undefined &&
          record.wholesalerId.companyId !== undefined &&
          record.wholesalerId.companyId.name !== undefined
          ? record.wholesalerId.companyId.name
          : '';
      },
    },
    {
      title: 'Tổng giá',
      key: 'price',
      editable: true,
      render: (_: any, record: any) => {
        return record.price !== undefined && record.price !== null ? formatterPrice.format(record.price) : 0;
      },
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      editable: true,
      render: (_: any, record: any) => {
        return record.discount !== undefined && record.discount !== null ? formatterPrice.format(record.discount) : 0;
      },
    },
    {
      title: 'Danh sách sản phẩm',
      key: 'action',
      render: (_: any, record: any) => {
        return <a onClick={() => showItemListModal(record.id)}>Xem chi tiết</a>;
      },
    },
    {
      title: 'Ngày tạo',
      key: 'created_dt',
      editable: false,
      render: (_: any, record: any) => {
        const date = moment(record.created_dt);
        return date.format('DD-MM-YYYY');
      },
    },
    {
      title: 'Ngày xuất',
      key: 'leave_date',
      editable: false,
      render: (_: any, record: any) => {
        const date = moment(record.leave_date);
        return date.format('DD-MM-YYYY');
      },
    },
    {
      title: 'Trạng thái',
      key: 'order_status',
      editable: false,
      render: (_: any, record: any) => {
        switch (record.order_status) {
          case 'await':
            return <span style={{ color: 'red' }}>Chưa thu tiền</span>;
          case 'onboard':
            return <span style={{ color: '#3ADF00' }}>Đã đã thu tiền</span>;
          case 'cancel':
            return <span style={{ color: '#ccc' }}>Hủy</span>;
        }
      },
    },
    {
      title: 'Công cụ',
      key: 'action',
      render: (_: any, record: any) => {
        return record.order_status !== 'cancel' ? (
          <span>
            <a style={{ marginRight: 8 }} onClick={() => showPrintOrderModal(record.id)}>
              In
            </a>
            <a style={{ marginRight: 8 }} onClick={() => Router.push(`/editOrder/${record.id}`)}>
              Sửa
            </a>
            <Popconfirm
              title='Bạn chắc chắn muốn hủy đơn hàng này?'
              onConfirm={() => cancelOrder(record.id)}
              okText='Đồng ý'
              cancelText='Thoát'
            >
              <a style={{ marginRight: 8 }}>Hủy</a>
            </Popconfirm>
            <Popconfirm
              title='Bạn chắc chắn muốn xóa dữ liệu này?'
              onConfirm={() => deleteOrder(record.id)}
              okText='Đồng ý'
              cancelText='Hủy'
            >
              <a>Xóa</a>
            </Popconfirm>
          </span>
        ) : (
          ''
        );
      },
    },
  ];

  const orderTableData = [
    {
      title: 'Mã nhà phân phối',
      key: 'wholesalerId',
      editable: true,
      render: (_: any, record: any) => {
        return record.wholesalerId !== undefined &&
          record.wholesalerId.companyId !== undefined &&
          record.wholesalerId.companyId.code !== undefined
          ? record.wholesalerId.companyId.code
          : '';
      },
    },
    {
      title: 'Tên nhà phân phối',
      key: 'wholesalerId',
      editable: true,
      render: (_: any, record: any) => {
        return record.wholesalerId !== undefined &&
          record.wholesalerId.companyId !== undefined &&
          record.wholesalerId.companyId.name !== undefined
          ? record.wholesalerId.companyId.name
          : '';
      },
    },
    {
      title: 'Tổng giá',
      key: 'price',
      editable: true,
      render: (_: any, record: any) => {
        return record.price !== undefined && record.price !== null ? formatterPrice.format(record.price) : 0;
      },
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      editable: true,
      render: (_: any, record: any) => {
        return record.discount !== undefined && record.discount !== null ? formatterPrice.format(record.discount) : 0;
      },
    },
    {
      title: 'Danh sách sản phẩm',
      key: 'action',
      render: (_: any, record: any) => {
        return <a onClick={() => showItemListModal(record.id)}>Xem chi tiết</a>;
      },
    },
    {
      title: 'Ngày tạo',
      key: 'created_dt',
      editable: false,
      render: (_: any, record: any) => {
        const date = moment(record.created_dt);
        return date.format('DD-MM-YYYY');
      },
    },
    {
      title: 'Ngày xuất',
      key: 'leave_date',
      editable: false,
      render: (_: any, record: any) => {
        const date = moment(record.leave_date);
        return date.format('DD-MM-YYYY');
      },
    },
    {
      title: 'Trạng thái',
      key: 'order_status',
      editable: false,
      render: (_: any, record: any) => {
        switch (record.order_status) {
          case 'await':
            return <span style={{ color: 'red' }}>Chưa thu tiền</span>;
          case 'onboard':
            return <span style={{ color: '#3ADF00' }}>Đã đã thu tiền</span>;
          case 'cancel':
            return <span style={{ color: '#ccc' }}>Hủy</span>;
        }
      },
    },
  ];

  const parcelTableColumns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      editable: true,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      editable: true,
    },
    {
      title: 'Khối lượng',
      dataIndex: 'weight',
      key: 'weight',
      editable: true,
    },
    {
      title: 'Đơn vị khối lượng',
      dataIndex: 'unit_weight',
      key: 'unit_weight',
      editable: true,
    },
    {
      title: 'Chiều dài',
      dataIndex: 'length',
      key: 'length',
      editable: true,
    },
    {
      title: 'Chiều rộng',
      dataIndex: 'width',
      key: 'width',
      editable: true,
    },
    {
      title: 'Chiều cao',
      dataIndex: 'height',
      key: 'height',
      editable: true,
    },
    {
      title: 'Đơn vị kích thước',
      dataIndex: 'unit_dimension',
      key: 'unit_dimension',
      editable: true,
    },
    {
      title: 'Số lượng hàng',
      key: 'qty',
      render: (_: any, record: any) => {
        return <a onClick={() => showItemListModal(record)}>{record.qty}</a>;
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
              onClick={async () => {
                const res = await saveEditedParcel(record.id);
                if (res.status === 1) {
                  message.success('Cập nhật dữ liệu thành công');
                }
              }}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </a>
            <Popconfirm title='Bạn có chắc muốn thoát?' onConfirm={cancelEditingParcel} okText='Thoát' cancelText='Hủy'>
              <a>Thoát</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a style={{ ...styleDisabledAnchorTag, marginRight: 4, marginLeft: 4 }} onClick={() => editParcel(record)}>
              Sửa
            </a>
            /
            <Popconfirm
              title='Bạn chắc chắn muốn xóa dữ liệu này?'
              onConfirm={() => deleteParcel(record.id)}
              okText='Đồng ý'
              cancelText='Hủy'
            >
              <a style={{ ...styleDisabledAnchorTag, marginLeft: 4 }}>Xóa</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const productItemTableColumns = [
    {
      title: 'Mã HH',
      dataIndex: 'code',
      key: 'code',
      editable: true,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Khối lượng',
      dataIndex: 'weight',
      key: 'weight',
      editable: false,
    },
    {
      title: 'Đơn vị khối lượng',
      dataIndex: 'unit_weight',
      key: 'unit_weight',
      editable: false,
    },
    {
      title: 'Kích thước',
      key: 'length',
      editable: false,
      render: (_: any, record: any) => {
        return (
          <span>
            {record.length !== undefined ? record.length : 0}x{record.width !== undefined ? record.width : 0}x
            {record.height !== undefined ? record.height : 0}
          </span>
        );
      },
    },
    {
      title: 'Đơn vị kích thước',
      dataIndex: 'unit_dimension',
      key: 'unit_dimension',
      editable: false,
    },
    {
      title: 'Giá',
      key: 'price',
      editable: true,
      render: (_: any, record: any) => {
        return record.price !== undefined && record.price !== null ? formatterPrice.format(record.price) : 0;
      },
    },
    {
      title: 'Tiền tệ',
      dataIndex: 'currency',
      key: 'currency',
      editable: true,
    },
    {
      title: 'Số lượng',
      dataIndex: 'qty',
      key: 'qty',
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
              onClick={() => saveEditedItem(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </a>
            <Popconfirm title='Bạn có chắc muốn thoát?' onConfirm={cancelEditingItem} okText='Thoát' cancelText='Hủy'>
              <a>Thoát</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a style={{ ...styleDisabledAnchorTag, marginRight: 4, marginLeft: 4 }} onClick={() => editItem(record)}>
              Sửa
            </a>
            <Popconfirm
              title='Bạn chắc chắn muốn xóa dữ liệu này?'
              onConfirm={() => deleteItem(record.id)}
              okText='Đồng ý'
              cancelText='Hủy'
            >
              <a style={{ ...styleDisabledAnchorTag, marginLeft: 4 }}>Xóa</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedParcelTableColumns = parcelTableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    const inputType =
      col.dataIndex === 'weight' ||
      col.dataIndex === 'width' ||
      col.dataIndex === 'length' ||
      col.dataIndex === 'height' ||
      col.dataIndex === 'qty'
        ? 'number'
        : 'text';
    return {
      ...col,
      onCell: (record: any) => {
        return {
          record,
          inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        };
      },
    };
  });
  const mergedItemTableColumns = productItemTableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    const inputType =
      col.dataIndex === 'code' ||
      col.dataIndex === 'name' ||
      col.dataIndex === 'unit_weight' ||
      col.dataIndex === 'unit_dimension' ||
      col.dataIndex === 'currency'
        ? 'text'
        : 'number';
    return {
      ...col,
      onCell: (record: any) => {
        return {
          record,
          inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        };
      },
    };
  });
  const formatterPrice = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'VND',
  });

  useEffect(() => {
    getProducts();
    getWholesalers();
    countTotalPriceOrders();
    countTotalOrders();
    countTotalWholesalers();
    countTotalProducts();
  }, []);

  useEffect(() => {
    if (totalOrderRecords !== 0){
      setLoadingOrderTable(true);
      getOrders();
    }
  }, [totalOrderRecords]);

  useEffect(() => {
    if (totalWholesalerRecords !== 0){
      getWholesalers();
    }
  }, [totalWholesalerRecords]);

  useEffect(() => {
    if (totalProductRecords !== 0){
      getProducts();
    }
  }, [totalProductRecords]);

  // =============================================
  //          initial methods region
  // =============================================

  const countTotalProducts = async () => {
    const res = await fetchAPI('GET', 'products/count', {
      deleted: false
    });
    if (res.count !== undefined) {
      let totalPages = (res.count / constants.LIMIT_RECORDS_PER_PAGE) | 0;   
      if (res.count % constants.LIMIT_RECORDS_PER_PAGE !== 0) {
        totalPages++;
      }
      productPagination.totalPages = totalPages;
      setProductPagination({...productPagination});
      setTotalProductRecords(res.count);
    }
  }

  const getProducts = async () => {
    try {
      if (productPagination.current < productPagination.totalPages) {
        const res = await fetchAPI('GET', 'products',  {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: productPagination.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false
          }
        });

        if (productPagination.current === 0) {
          setProductOptions(res);
        }
        else { // loadmore
          setProductOptions([...productOptions, ...res]);
        }

        productPagination.current++;
        setProductPagination({...productPagination});
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const handleScrollProductList = (e) => {
    const ele = e.target;
    // tslint:disable-next-line: radix
    if (parseInt(ele.scrollTop) + ele.clientHeight === ele.scrollHeight) {
      getProducts();
    }
  };

  const countTotalWholesalers = async () => {
    const res = await fetchAPI('GET', 'wholesalers/count', {
      deleted: false
    });
    if (res.count !== undefined) {
      let totalPages = (res.count / constants.LIMIT_RECORDS_PER_PAGE) | 0;   
      if (res.count % constants.LIMIT_RECORDS_PER_PAGE !== 0) {
        totalPages++;
      }
      wholesalerPagination.totalPages = totalPages;
      setWholesalerPagination({...wholesalerPagination});
      setTotalWholesalerRecords(res.count);
    }
  }

  const getWholesalers = async () => {
    try {
      if (wholesalerPagination.current < wholesalerPagination.totalPages) {
        const res = await fetchAPI('GET', 'wholesalers',  {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: wholesalerPagination.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false
          }
        });

        if (wholesalerPagination.current === 0) {
          setWholesalerOptions(res);
        }
        else { // loadmore
          setWholesalerOptions([...wholesalerOptions, ...res]);
        }

        wholesalerPagination.current++;
        setWholesalerPagination({...wholesalerPagination});
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const handleScrollWholesalerList = (e) => {
    const ele = e.target;
    // tslint:disable-next-line: radix
    if (parseInt(ele.scrollTop) + ele.clientHeight === ele.scrollHeight) {
      getWholesalers();
    }
  };

  const isEditing = (record: any) => record.id === editingId;

  // end region

  // =============================================
  //          Parcel's methods region
  // =============================================

  const showParcelList = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setVisibleParcelListModal(true);
  };

  const getParcelList = async (orderId: string) => {
    if (parcelData[orderId] === undefined) {
      try {
        const ret = await fetchAPI('GET', {
          path: 'parcels',
          params: {
            filter: [
              {
                where: {
                  deleted: false,
                  orderId,
                  // applicationId: config.appId,
                },
              },
            ],
          },
        });

        if (ret.res.data !== undefined && ret.res.data.length > 0) {
          setParcels(ret.res.data);
          setListItemToPrint(ret.res.data);
          parcelData[orderId] = ret.res.data;
          setParcelData({ ...parcelData });
        }
        return ret.res.data;
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.log(err);
      }
    } else {
      setParcels(parcelData[orderId]);
      setListItemToPrint(parcelData[orderId]);
      return parcelData[orderId];
    }
  };

  const editParcel = async (record) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
    setStyleDisabledAnchorTag({
      pointerEvents: 'none',
      color: '#ccc',
    });
  };

  const saveEditedParcel = async (updateInfo: any) => {
    try {
      // const updatedInfo = values === undefined ? await form.validateFields() : values;
      const ret = await fetchAPI('PATCH', {
        path: `parcels/${updateInfo.id}`,
        params: updateInfo,
      });

      if (ret.res.data !== undefined) {
        Object.assign(selectedParcel, updateInfo);
        setSelectedParcel({ ...selectedParcel });
        countPriceOfOrder(parcelData[selectedOrderId]);
        return {
          status: 1, // ok
        };
        // const parcelList = parcelData[selectedOrderId];
        // const index = parcelList.findIndex((item) => item.id === recordId);
        // if (index !== -1) {
        //   Object.assign(parcelList[index], updatedInfo);
        //   parcelData[selectedOrderId] = parcelList;
        //   setParcels([...parcelList]);
        //   setParcelData({ ...parcelData });
        //   setSelectedParcel(parcelList[index]);
        //   countPriceOfOrder(parcelData[selectedOrderId]);
        //   setEditingId('');
        //   setStyleDisabledAnchorTag({});
        //   return {
        //     status: 1, // ok
        //   };
        // }
      }

      // setEditingId('');
      // setStyleDisabledAnchorTag({});
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể cập nhật dữ liệu do đã có lỗi xảy ra');
      return {
        status: 0, // faill
      };
    }
  };

  const deleteParcel = async (recordId: string) => {
    try {
      const updatedInfo = { deleted: true };
      const ret = await fetchAPI('PATCH', {
        path: `parcels/${recordId}`,
        params: updatedInfo,
      });

      const index = parcels.findIndex((item) => item.id === recordId);
      if (index !== -1) {
        parcels.splice(index, 1);
        parcelData[selectedOrderId] = parcels;
        setParcels([...parcels]);
        setParcelData({ ...parcelData });
      }

      setEditingId('');
      message.success('Xóa dữ liệu thành công');
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể xóa dữ liệu do đã có lỗi xảy ra');
    }
  };

  const cancelEditingParcel = () => {
    setEditingId('');
    setStyleDisabledAnchorTag({});
  };

  const handlePostNewParcel = async () => {
    try {
      const value = await form.validateFields();
      value.orderId = selectedOrderId;

      const ret = await fetchAPI('POST', {
        path: `parcels`,
        params: value,
      });

      if (ret.data !== undefined) {
        parcels.push(ret.data);
        setParcels([...parcels]);
        if (parcelData[selectedOrderId] === undefined) {
          parcelData[selectedOrderId] = [];
        }
        parcelData[selectedOrderId].push(ret.data);
        setParcelData({ ...parcelData });
        setVisibleAddParcelModal(false);
        form.setFieldsValue({
          code: '',
          type: '',
          weight: 0,
          unit_weight: '',
          height: 0,
          width: 0,
          length: 0,
          unit_dimension: '',
          qty: '0',
        });
        message.success('Thêm dữ liệu thành công');
      }
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể thêm dữ liệu do đã có lỗi xảy ra');
    }
  };
  // ============ end region =====================

  // ==============================================
  //       Product item's methods region
  // ==============================================

  const showItemListModal = async (orderId: string) => {
    const order = orders.find((item) => item.id === orderId);
    if (order.order_status === 'cancel') {
      setDisableBtnAddNewProduct(true);
    }

    setSelectedOrderId(orderId);
    setVisibleItemListModal(true);
    setLoadingItemTable(true);
    getContracts(orderId);
    const Parcels = await getParcelList(orderId);

    if (Parcels === undefined || Parcels.length === 0) {
      const parcel = {
        orderId,
        items: [],
      };
      const ret = await fetchAPI('POST', {
        path: `parcels`,
        params: parcel,
      });

      if (ret.data !== undefined) {
        parcelData[orderId] = [{ ...ret.data }];
        setParcelData({ ...parcelData });
        setSelectedParcel(ret.data);
        setItemsOfOrder([]);
      }
    } else {
      const parcel = Parcels[0];
      setSelectedParcel(parcel);
      if (parcel.items !== undefined) {
        setItemsOfOrder(parcel.items);
      }
    }
    setLoadingItemTable(false);
  };

  const editItem = async (record) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
    setStyleDisabledAnchorTag({
      pointerEvents: 'none',
      color: '#ccc',
    });
  };

  const saveEditedItem = async (recordId: string) => {
    try {
      const updatedInfo = await form.validateFields();
      const itemIndex = selectedParcel.items.findIndex((x) => x.id === recordId);
      const item = selectedParcel.items[itemIndex];
      Object.assign(item, updatedInfo);

      const ret = await fetchAPI('PATCH', {
        path: `parcels/${selectedParcel.id}`,
        params: selectedParcel,
      });

      if (ret.res.data !== undefined) {
        message.success('Cập nhật dữ liệu thành công');
        const parcelList = parcelData[selectedOrderId];
        // tslint:disable-next-line: no-shadowed-variable
        const index = parcelList.findIndex((item) => item.id === selectedParcel.id);
        if (index !== -1) {
          parcelList[index] = selectedParcel;
          parcelData[selectedOrderId] = parcelList;
          setParcels([...parcelList]);
          setParcelData({ ...parcelData });
          countPriceOfOrder(parcelList);
          countTotalPriceOrders();
        }
      }

      setEditingId('');
      setStyleDisabledAnchorTag({});
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể cập nhật dữ liệu do đã có lỗi xảy ra');
    }
  };

  const deleteItem = async (recordId: string) => {
    try {
      // const parcel = parcels.find((item) => item.id === selectedParcel.id);
      const itemIndex = selectedParcel.items.findIndex((item) => item.id === recordId);
      selectedParcel.items.splice(itemIndex, 1);

      const res = await saveEditedParcel(selectedParcel);
      if (res.status === 1) {
        message.success('Xóa dữ liệu thành công');
        countTotalPriceOrders();
        setItemsOfOrder([...selectedParcel.items]);
      }
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể xóa dữ liệu do đã có lỗi xảy ra');
    }
  };

  const cancelEditingItem = () => {
    setEditingId('');
    setStyleDisabledAnchorTag({});
  };

  const handlePostNewItem = async () => {
    try {
      const newItem = await form.validateFields();
      // const parcel = parcels.find((item) => item.id === selectedParcel.id);
      selectedParcel.items = selectedParcel.items === undefined ? [] : selectedParcel.items;
      selectedParcel.items.push(newItem);

      const res = await saveEditedParcel(selectedParcel);
      if (res.status === 1) {
        message.success('Thêm dữ liệu thành công');
        setItemsOfOrder([...selectedParcel.items]);
        countTotalPriceOrders();
      }
      setVisibleAddItemModal(false);
      form.setFieldsValue({
        id: '',
        name: '',
        code: '',
        category: '',
        weight: 0,
        unit_weight: '',
        height: 0,
        width: 0,
        length: 0,
        unit_dimension: '',
        price: 0,
        currency: '',
        qty: '0',
      });
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể thêm dữ liệu do đã có lỗi xảy ra');
    }
  };

  const handleSelectedProduct = (productId) => {
    const product = productOptions.find((item) => item.id === productId);
    form.setFieldsValue({
      id: product.id,
      code: product.code !== undefined ? product.code : 'Sản phẩm chưa có code',
      name: product.name,
      categoryId: product.categoryId,
      weight: product.weight,
      unit_weight: product.unit_weight,
      width: product.width,
      length: product.length,
      height: product.height,
      unit_dimension: product.unit_dimension,
      price: product.price,
      currency: product.currency,
    });
  };

  // ============ end region =====================

  // =======================================
  //        Order's methods region
  // =======================================

  const countTotalOrders = async () => {
    const res = await fetchAPI('GET', 'orders/count', {
      deleted: false
    });
    if (res.count !== undefined) {
      let totalPages = (res.count / constants.LIMIT_RECORDS_PER_PAGE) | 0;   
      if (res.count % constants.LIMIT_RECORDS_PER_PAGE !== 0) {
        totalPages++;
      }
      orderPagination.totalPages = totalPages;
      setOrderPagination({...orderPagination});
      setTotalOrderRecords(res.count);
    }
  }


  const getOrders = async (reset = false) => {
    try {
      if (orderPagination.current < orderPagination.totalPages || reset) {
        if (reset) {
          setLoadingOrderTable(true);
        } 
        else if (orderPagination.current !== 0) setLoadingMore(true);
       
        let res = await fetchAPI('GET', 'orders', {
          where: {
            deleted: false
          }
        });

        if (res !== undefined) {
          res = await Promise.all(
            res.map(async (order, index) => {
              if (order.wholesalerId !== undefined) {
                const wholesaler = await fetchAPI("GET", `wholesalers/${order.wholesalerId}`);
                if (wholesaler !== null) {
                  order.wholesaler = wholesaler;
                }
              }
              return order;
            }),
          );

          if (orderPagination.current === 0 || reset) {
            setOrders(res);
          } else {
            // onClick loadmore button
            setOrders([...orders, ...res]);
            setLoadingMore(false);
          }

          orderPagination.current = reset ? 1 : orderPagination.current + 1;
          setOrderPagination({...orderPagination});
          setLoadingOrderTable(false);
          return res;
        }
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  // const doSearchDate = async (start, end) => {
  //   try {
  //     if (start !== '' && end !== '') {
  //       setLoadingOrderTable(true);
  //       const ret = await fetchAPI('GET', {
  //         path: 'orders',
  //         params: {
  //           filter: [
  //             {
  //               where: {
  //                 deleted: false,
  //                 created_dt: {
  //                   between: [start, end],
  //                 },
  //                 applicationId: config.appId,
  //               },
  //             },
  //           ],
  //         },
  //       });
  //       if (ret.res.data !== undefined) {
  //         let data = await linkModel(ret.res.data, 'wholesalers', 'wholesalerId');
  //         data = await Promise.all(
  //           data.map(async (ele, index) => {
  //             if (ele.wholesalerId !== undefined) {
  //               const company = await getCompanyById(ele.wholesalerId.companyId);
  //               if (company !== null) {
  //                 ele.wholesalerId.companyId = company;
  //               }
  //             }
  //             return ele;
  //           }),
  //         );
  //         setOrders(data);
  //         countTotalPriceOrders(data);
  //       }
  //       setLoadingOrderTable(false);
  //     } else if (start === '' && end === '') {
  //       const data = await getOrders(true);
  //       countTotalPriceOrders(data);
  //     }
  //   } catch (error) {
  //     // tslint:disable-next-line: no-console
  //     console.log(error);
  //   }
  // };

  const countPriceOfOrder = async (parcelList) => {
    let totalPrice = 0;
    let discount = 0;

    if (parcelList !== undefined) {
      parcelList.forEach((parcel) => {
        if (parcel.items !== undefined) {
          const arr = parcel.items.map((item, index) => {
            const contract = contracts.find((ct) => ct.categoryId === item.categoryId);
            const price = item.price * item.qty;

            if (contract !== undefined) {
              const sale = contract.packagesId.sale;
              const formula = contract.packagesId.formula;
              if (formula !== undefined && formula !== '') {
                // tslint:disable-next-line: no-eval
                const cost = eval(formula);
                discount += price - cost;
                totalPrice += cost;
              } else if (sale !== undefined) {
                totalPrice += price - sale;
                discount += sale;
              }
            } else {
              totalPrice += price;
            }
          });
        }
      });

      if (selectedOrderId !== '') {
        const index = orders.findIndex((item) => item.id === selectedOrderId);
        orders[index].price = totalPrice;
        orders[index].discount = discount;

        const res = await fetchAPI('PATCH', `orders/${selectedOrderId}`, {
          price: totalPrice,
          discount,
        });

        if (res !== undefined) {
          setOrders([...orders]);
        }
      }
    }
  };

  const countTotalPriceOrders = async (dataArr?: any) => {
    let data = dataArr;
    if (data === undefined || data.length === 0) {
      const res = await fetchAPI('GET', 'orders', {
        where: {
          order_status: { inq: ['await', 'onboard'] },
          deleted: false
        }
      });
      if (res !== undefined && res.length > 0) {
        data = res;
      }
    }

    let sumAwait = 0;
    let sumOnBoard = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < data.length; i++) {
      if (data[i].price !== undefined && data[i].order_status !== 'cancel') {
        // tslint:disable-next-line: radix
        data[i].order_status === 'await' ? (sumAwait += data[i].price) : (sumOnBoard += data[i].price);
      }
    }
    setTotalPriceOrderAwait(sumAwait);
    setTotalPriceOrderOnBoard(sumOnBoard);
  };

  const deleteOrder = async (orderId) => {
    try {
      const ret = await fetchAPI('PATCH', `orders/${orderId}`, { deleted: true });

      const index = orders.findIndex((item) => item.id === orderId);
      if (index !== -1) {
        const newData = [...orders];
        newData.splice(index, 1);
        setOrders(newData);
      }

      setEditingId('');
      message.success('Xóa dữ liệu thành công');
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error('Không thể xóa dữ liệu do đã có lỗi xảy ra');
    }
  };

  const getContracts = async (orderId: string) => {
    if (orderId !== undefined && orderId !== '') {
      const order = orders.find((item) => item.id === orderId);
      const wholesalerId = order.wholesalerId !== undefined ? order.wholesalerId : '';
      let res = await fetchAPI('GET', 'contracts', {
        where: {
          wholesalerId,
          deleted: false
        }
      });

      if (res !== undefined) {
        res = await Promise.all(res.map(async (contract, index) => {
          contract.package = await fetchAPI('GET', `packages/${contract.packageId}`);
          return contract;
        }));
        setContracts(res);
        return res;
      }
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetchAPI('PATCH', `orders/${orderId}`, { order_status: 'cancel' });

      if (res!== undefined) {
        message.success('Hủy đơn hàng thành công');
        const index = orders.findIndex((item) => item.id === orderId);
        orders[index].order_status = 'cancel';
        setOrders([...orders]);
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
      message.error('Hủy đơn hàng thất bại do đã có lỗi xảy ra !!');
    }
  };

  const handleChangeDateTime = async (_dates: any, dateStrings: [string, string]) => {
    // try {
    //   doSearchDate(dateStrings[0], dateStrings[1]);
    // } catch (error) {
    //   // tslint:disable-next-line: no-console
    //   console.log(error);
    //   message.error('Tìm đơn hàng thất bại do đã có lỗi xảy ra!!');
    //   getOrders();
    // }
  };

  const handleSelectWholesalers = (value: string) => {
    if (value !== 'all') {
      const wholesaler = wholesalerOptions.find((item) => item.id === value);
      form.setFieldsValue({
        wholersalerCode: wholesaler.code,
        wholesalerName: wholesaler.name,
      });
    } else {
      form.setFieldsValue({
        wholersalerCode: 'Tất cả',
        wholesalerName: 'Tất cả',
      });
    }
    doSearchWholesalers(value);
  };

  const doSearchWholesalers = async (value: string) => {
    // try {
    //   if (value !== 'all') {
    //     setLoadingOrderTable(true);
    //     const ret = await fetchAPI('GET', {
    //       path: 'orders',
    //       params: {
    //         filter: [
    //           {
    //             where: {
    //               deleted: false,
    //               wholesalerId: value,
    //               applicationId: config.appId,
    //             },
    //           },
    //         ],
    //       },
    //     });
    //     if (ret.res.data !== undefined) {
    //       let data = await linkModel(ret.res.data, 'wholesalers', 'wholesalerId');
    //       data = await Promise.all(
    //         data.map(async (ele, index) => {
    //           if (ele.wholesalerId !== undefined) {
    //             const company = await getCompanyById(ele.wholesalerId.companyId);
    //             if (company !== null) {
    //               ele.wholesalerId.companyId = company;
    //             }
    //           }
    //           return ele;
    //         }),
    //       );
    //       setOrders(data);
    //       countTotalPriceOrders(data);
    //     }
    //     setLoadingOrderTable(false);
    //   } else if (value === 'all') {
    //     const data = await getOrders(true);
    //     countTotalPriceOrders(data);
    //   }
    // } catch (error) {
    //   // tslint:disable-next-line: no-console
    //   console.log(error);
    // }
  };

  const showPrintOrderModal = async (orderId: string) => {
    setVisiblePrintModal(true);
    setUIprintScreen(<PrintScreen loading={true} />);
    const wholesalerId = orders.find((item) => item.id === orderId).wholesalerId;
    const wholesaler = await fetchAPI("GET", `wholesalers/${wholesalerId}`);
    const [Contracts, ListItemToPrint] = await Promise.all([getContracts(orderId), getParcelList(orderId)]);
    setUIprintScreen(
      <PrintScreen
        loading={false}
        orderId={orderId}
        listToPrint={ListItemToPrint}
        contracts={Contracts}
        company={wholesaler}
      />,
    );
  };

  const spinnerIcon = <LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />;
  console.log(orders);
  const csv = orders.map((el) => {
    return {
      id: el.id,
      status: el.order_status,
      price: el.price,
      currency: el.currency,
      discount: el.discount,
      // company: el.wholesalerId.companyId ? el.wholesalerId.companyId.name : '',
      company:
        el.wholesalerId !== undefined &&
        el.wholesalerId.companyId !== undefined &&
        el.wholesalerId.companyId.name !== undefined
          ? el.wholesalerId.companyId.name
          : '',
      // wholesaler: el.wholesalerId.name,
      created_dt: moment(el.created_dt).format('DD-MM-YYYY'),
      updated_dt: moment(el.updated_dt).format('DD-MM-YYYY'),
      leave_date: moment(el.leave_date).format('DD-MM-YYYY'),
    };
  });
  return (
    <Card bordered={false}>
      <Card title='Tìm kiếm'>
        <Form form={form} layout='vertical'>
          <Row gutter={16}>
            <Col xs={24} sm={6}>
              <Form.Item name='wholesalerCode' label='Mã nhà phân phối'>
                <Select
                  style={{ width: '100%' }}
                  showSearch={true}
                  placeholder='Code'
                  optionFilterProp='children'
                  loading={false}
                  allowClear={true}
                  onPopupScroll={handleScrollWholesalerList}
                  notFoundContent='Không tìm thấy'
                  onSelect={handleSelectWholesalers}
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value='all' key='all'>
                    Tất cả
                  </Option>
                  {wholesalerOptions.map((item) => (
                    <Option value={item.wholesalerId} key={item.id}>
                      {item.companyId !== undefined && item.companyId.code !== undefined ? item.companyId.code : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item name='wholesalerName' label='Tên nhà phân phối'>
                <Select
                  style={{ width: '100%' }}
                  showSearch={true}
                  placeholder='Tên'
                  optionFilterProp='children'
                  loading={false}
                  allowClear={true}
                  onPopupScroll={handleScrollWholesalerList}
                  notFoundContent='Không tìm thấy'
                  onSelect={handleSelectWholesalers}
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value='all' key='all'>
                    Tất cả
                  </Option>
                  {wholesalerOptions.map((item) => (
                    <Option value={item.wholesalerId} key={item.id}>
                      {item.companyId !== undefined && item.companyId.name !== undefined ? item.companyId.name : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item label='Ngày tạo'>
                <RangePicker placeholder={['Từ ngày', 'Đến ngày']} onCalendarChange={handleChangeDateTime} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <div className='body-content'>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => Router.push('/addOrder')}
          style={{ marginBottom: 16 }}
        >
          Thêm mới
        </Button>
        <Button>
          <ExportReactCSV csvData={csv} fileName={'myOrders'} />
        </Button>
        <div className='total-price-order-info'>
          <div className='total-price-onboard'>
            <span>Tổng tiền đã in</span>
            <span className='badge-price'>{formatterPrice.format(totalPriceOrdersOnBoard)}</span>
          </div>
          <div className='total-price-await'>
            <span>Tổng tiền chưa in</span>
            <span className='badge-price'>{formatterPrice.format(totalPriceOrdersAwait)}</span>
          </div>
        </div>
        <Table
          dataSource={orders}
          columns={orderTableColumns}
          loading={loadingOrderTable}
          pagination={false}
          rowKey='id'
        />
        <div className={'pagination-area'}>
          <Button type='primary' onClick={() => getOrders()}>
            <span>Hiển thị thêm</span>
            <Spin className='spinner-loading' indicator={spinnerIcon} spinning={loadingMore} />
          </Button>
          <span className={'pagination-info'}>
            {orders.length} / {maxRecord}
          </span>
        </div>
        <Modal
          title='Danh sách kiện hàng'
          visible={visibleParcelListModal}
          style={{ top: 20 }}
          width='90%'
          onCancel={() => {
            cancelEditingParcel();
            setVisibleParcelListModal(false);
          }}
          footer={[
            <Button key='add-new' type='primary' icon={<PlusOutlined />} onClick={() => setVisibleAddParcelModal(true)}>
              Thêm mới
            </Button>,
            <Button
              key='cancel'
              onClick={() => {
                cancelEditingParcel();
                setVisibleParcelListModal(false);
              }}
            >
              Đóng
            </Button>,
          ]}
        >
          <Form form={form} component={false}>
            <Table
              className='components-table-nested'
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              rowKey='id'
              columns={mergedParcelTableColumns}
              dataSource={parcels}
            />
          </Form>
        </Modal>
        <Modal
          title='Thêm kiện hàng mới'
          width='70%'
          style={{ top: 20 }}
          visible={visibleAddParcelModal}
          footer={null}
          onCancel={() => setVisibleAddParcelModal(false)}
        >
          <Form
            layout='vertical'
            form={form}
            initialValues={{
              code: '',
              type: '',
              unit_weight: '',
              unit_dimension: '',
            }}
            onFinish={handlePostNewParcel}
          >
            <Row gutter={16}>
              <Col xs={24} sm={24}>
                <Card bordered={true} title='Thông tin chung'>
                  <Row>
                    <Col xs={24} sm={12}>
                      <Form.Item name='code' label='Mã kiện hàng'>
                        <Input className='input-info-parcel' placeholder='Mã kiện hàng' />
                      </Form.Item>
                      <Form.Item name='type' label='Loại'>
                        <Input className='input-info-parcel' placeholder='Loại kiện hàng' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name='qty' label='Số lượng'>
                        <Input className='input-info-parcel' placeholder='Số lượng' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <br></br>
            <Row gutter={16}>
              <Col xs={24} sm={24}>
                <Card bordered={true} title='Khối lượng'>
                  <Row>
                    <Col xs={24} sm={3}>
                      <Form.Item name='weight' label='Khối lượng'>
                        <InputNumber className='input-info-parcel' min={0} placeholder='Khối lượng' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name='unit_weight' label='Đơn vị'>
                        <Input className='input-info-parcel' placeholder='Đơn vị khối lượng' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <br></br>
            <Row gutter={16}>
              <Col xs={24} sm={24}>
                <Card bordered={true} title='Kích thước'>
                  <Row>
                    <Col xs={24} sm={4}>
                      <Form.Item name='length' label='Dài'>
                        <InputNumber className='input-info-parcel' min={0} placeholder='Chiều dài' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Form.Item name='width' label='Rộng'>
                        <InputNumber className='input-info-parcel' placeholder='Chiều rộng' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Form.Item name='height' label='Cao'>
                        <InputNumber className='input-info-parcel' placeholder='Chiều cao' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name='unit_dimension' label='Đơn vị kích thước'>
                        <Input className='input-info-parcel' placeholder='Đơn vị kích thước' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row gutter={16}>
              <Form.Item>
                <Button key='save' icon={<SaveFilled />} type='primary' htmlType='submit'>
                  Lưu
                </Button>
                <Button key='cancel' onClick={() => setVisibleAddParcelModal(false)}>
                  Đóng
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Modal>
        <Modal
          title='Danh sách sản phẩm'
          width='95%'
          style={{ top: 20 }}
          visible={visibleItemListModal}
          footer={[
            <Button
              disabled={disableBtnAddNewProduct}
              key='add-new'
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setVisibleAddItemModal(true)}
            >
              Thêm mới
            </Button>,
            <Button
              key='cancel'
              onClick={() => {
                cancelEditingItem();
                setDisableBtnAddNewProduct(false);
                setVisibleItemListModal(false);
              }}
            >
              Đóng
            </Button>,
          ]}
          onCancel={() => {
            cancelEditingItem();
            setVisibleItemListModal(false);
          }}
        >
          <Form form={form} component={false}>
            <Table
              dataSource={itemsOfOrder !== undefined ? itemsOfOrder : []}
              loading={loadingItemTable}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              columns={mergedItemTableColumns}
              pagination={false}
              rowKey='id'
            />
          </Form>
        </Modal>
        <Modal
          title='Thêm sản phẩm mới cho đơn hàng'
          width='70%'
          style={{ top: 20 }}
          visible={visibleAddItemModal}
          footer={null}
          onCancel={() => setVisibleAddItemModal(false)}
        >
          <Form
            layout='vertical'
            form={form}
            initialValues={{
              id: '',
              code: '',
              name: '',
              category: '',
              unit_weight: '',
              unit_dimension: '',
              currency: 'VND',
            }}
            onFinish={handlePostNewItem}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name='code'
                  label='Mã sản phẩm'
                  rules={[{ required: true, message: 'Mã sản phẩm không được để trống' }]}
                >
                  {
                    <Select
                      showSearch={true}
                      placeholder='Chọn mã sản phẩm'
                      optionFilterProp='children'
                      loading={false}
                      allowClear={true}
                      onPopupScroll={handleScrollProductList}
                      notFoundContent='Không tìm thấy'
                      onSelect={handleSelectedProduct}
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {productOptions.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.code !== undefined ? item.code : 'Sản phẩm chưa có code'}
                        </Option>
                      ))}
                    </Select>
                  }
                </Form.Item>
                <Form.Item name='id'>
                  <Input hidden className='input-info-parcel' />
                </Form.Item>
                <Form.Item name='categoryId'>
                  <Input hidden className='input-info-parcel' />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name='name'
                  label='Tên sản phẩm'
                  rules={[{ required: true, message: 'Tên sản phẩm không được để trống' }]}
                >
                  {
                    <Select
                      showSearch={true}
                      placeholder='Chọn tên sản phẩm'
                      optionFilterProp='children'
                      loading={false}
                      allowClear={true}
                      onPopupScroll={handleScrollProductList}
                      notFoundContent='Không tìm thấy'
                      onSelect={handleSelectedProduct}
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {productOptions.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  }
                </Form.Item>
              </Col>
            </Row>
            <br></br>
            <Row gutter={16}>
              <Col xs={24} sm={24}>
                <Card bordered={true} title='Khối lượng'>
                  <Row>
                    <Col xs={24} sm={3}>
                      <Form.Item name='weight' label='Khối lượng'>
                        <InputNumber className='input-info-parcel' min={0} placeholder='Khối lượng' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name='unit_weight' label='Đơn vị'>
                        <Input className='input-info-parcel' placeholder='Đơn vị khối lượng' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <br></br>
            <Row gutter={16}>
              <Col xs={24} sm={24}>
                <Card bordered={true} title='Kích thước'>
                  <Row>
                    <Col xs={24} sm={4}>
                      <Form.Item name='length' label='Dài'>
                        <InputNumber className='input-info-parcel' min={0} placeholder='Chiều dài' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Form.Item name='width' label='Rộng'>
                        <InputNumber className='input-info-parcel' placeholder='Chiều rộng' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Form.Item name='height' label='Cao'>
                        <InputNumber className='input-info-parcel' placeholder='Chiều cao' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name='unit_dimension' label='Đơn vị kích thước'>
                        <Input className='input-info-parcel' placeholder='Đơn vị kích thước' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <br></br>
            <Row gutter={16}>
              <Col xs={24} sm={24}>
                <Card bordered={true} title='Giá và số lượng'>
                  <Row>
                    <Col xs={24} sm={3}>
                      <Form.Item
                        name='price'
                        label='Giá'
                        rules={[{ required: true, message: 'Giá tiền không được bỏ trống' }]}
                      >
                        <InputNumber className='input-info-parcel' min={0} placeholder='Giá' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={9}>
                      <Form.Item
                        name='currency'
                        label='Tiền tệ'
                        rules={[{ required: true, message: 'Tiền tệ không được bỏ trống' }]}
                      >
                        <Input className='input-info-parcel' placeholder='Đơn vị tiền tệ' />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={5}>
                      <Form.Item
                        name='qty'
                        label='Số lượng'
                        rules={[{ required: true, message: 'Số lượng không được bỏ trống' }]}
                      >
                        <InputNumber className='input-info-parcel' placeholder='Số lượng' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row gutter={16}>
              <Form.Item>
                <Button key='save' icon={<SaveFilled />} type='primary' htmlType='submit'>
                  Lưu
                </Button>
                <Button key='cancel' onClick={() => setVisibleAddItemModal(false)}>
                  Đóng
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Modal>
        <Modal
          title='In hóa đơn'
          visible={visiblePrintModal}
          style={{ top: 20 }}
          width='90%'
          onCancel={() => setVisiblePrintModal(false)}
          footer={[
            <Button key='cancel' onClick={() => setVisiblePrintModal(false)}>
              Đóng
            </Button>,
          ]}
        >
          {UIprintScreen}
        </Modal>
      </div>
    </Card>
  );
};

interface IProps {}
interface IState {
  listToPrint: [];
  contracts: [];
  company: any;
  orderCode: string;
  currentDate: string;
}

class ComponentToPrint extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    const date = new Date();
    const hour = date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours();
    const minute = date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes();
    const second = date.getSeconds() <= 9 ? `0${date.getSeconds()}` : date.getSeconds();

    this.state = {
      listToPrint: props.listToPrint,
      contracts: props.contracts,
      company: props.company,
      orderCode: `${hour}${minute}${second}`,
      currentDate: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    };
  }

  countPriceOfOrder = (parcelList) => {
    let totalPrice = 0;
    let totalDiscount = 0;
    let cnt = 0;
    const UIDataForPrintScreen = {
      rowData: [],
      totalPrice: 0,
      totalDiscount: 0,
    };
    const formatterPrice = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'VND',
    });

    if (parcelList !== undefined) {
      parcelList.forEach((parcel) => {
        if (parcel.items !== undefined) {
          const arr = parcel.items.map((item, index) => {
            const contract = this.state.contracts.find((ct) => ct['categoryId'] === item.categoryId);
            const price = item.qty !== 0 ? item.price * item.qty : item.price; // for calculte % of discount when price and cost are 0, avoid NaN% error
            totalPrice += item.qty !== 0 ? price : 0;

            if (contract !== undefined) {
              const sale = contract['packagesId']['sale'];
              const formula = contract['packagesId']['formula'];
              if (formula !== undefined && formula !== '') {
                // tslint:disable-next-line: no-eval
                const cost = eval(formula);
                totalDiscount += item.qty !== 0 ? price - cost : 0;

                return (
                  <tr className='product-table-body' key={++cnt}>
                    <td style={{ textAlign: 'center' }}>{cnt}</td>
                    <td style={{ textAlign: 'center' }}>{item.code}</td>
                    <td>{item.name}</td>
                    <td style={{ textAlign: 'center' }}>Cây</td>
                    <td style={{ textAlign: 'center' }}>{item.qty}</td>
                    <td>{formatterPrice.format(item.price)}</td>
                    <td style={{ textAlign: 'center' }}>{((price - cost) / price) * 100}%</td>
                    <td>{item.qty !== 0 ? formatterPrice.format(price) : 0}</td>
                  </tr>
                );
              } else if (sale !== undefined) {
                totalDiscount += sale;
                return (
                  <tr className='product-table-body' key={++cnt}>
                    <td style={{ textAlign: 'center' }}>{cnt}</td>
                    <td style={{ textAlign: 'center' }}>{item.code}</td>
                    <td>{item.name}</td>
                    <td style={{ textAlign: 'center' }}>Cây</td>
                    <td style={{ textAlign: 'center' }}>{item.qty}</td>
                    <td>{formatterPrice.format(item.price)}</td>
                    <td style={{ textAlign: 'center' }}>Giảm trực tiếp {formatterPrice.format(sale)}</td>
                    <td>{formatterPrice.format(price)}</td>
                  </tr>
                );
              }
            } else {
              return (
                <tr className='product-table-body' key={++cnt}>
                  <td style={{ textAlign: 'center' }}>{cnt}</td>
                  <td style={{ textAlign: 'center' }}>{item.code}</td>
                  <td>{item.name}</td>
                  <td style={{ textAlign: 'center' }}>Cây</td>
                  <td style={{ textAlign: 'center' }}>{item.qty}</td>
                  <td>{formatterPrice.format(item.price)}</td>
                  <td></td>
                  <td>{formatterPrice.format(price)}</td>
                </tr>
              );
            }
          });
          UIDataForPrintScreen.rowData = [...UIDataForPrintScreen.rowData, ...arr];
        }
      });

      UIDataForPrintScreen.totalPrice = totalPrice;
      UIDataForPrintScreen.totalDiscount = totalDiscount;
    }

    return UIDataForPrintScreen;
  };

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    const date = new Date();
    if (nextProps.listToPrint !== this.state.listToPrint) {
      this.setState({
        listToPrint: nextProps['listToPrint'],
        contracts: nextProps['contracts'],
        company: nextProps['company'],
        currentDate: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
      });
    }
  }

  render() {
    const formatterPrice = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'VND',
    });

    const UIDataForPrintScreen = this.countPriceOfOrder(this.state.listToPrint);

    return (
      <div className='print-container'>
        <div className='print-header'>
          <div className='print-header-info'>
            <div className='header-info-text'>CÔNG TY TNHH MTV CỌ VIỆT MỸ</div>
            <div className='header-info-text'>ĐT: 38767888 - 3755488; Fax: (848) 3755 1128 </div>
            <div className='header-info-text'>Email: info@vietmybrush.vn </div>
          </div>
          <div className='print-header-title'>
            <div className='print-big-title'>BIÊN NHẬN</div>
            <div className='header-info-text'>
              Số {this.state.orderCode} - Ngày {this.state.currentDate}{' '}
            </div>
          </div>
        </div>
        <div className='client-info'>
          <div className='client-info-detail'>
            <div className='client-code-text'>Mã KH</div>
            <div className='client-code-container'>DBDF</div>
            <div className='client-name'>MindX</div>
          </div>
          <div>
            <div className='header-info-text'>ĐT: 123456</div>
          </div>
        </div>
        <p className='client-address'>TPHCM</p>
        <table className='product-table'>
          <tr className='product-table-header'>
            <th className='stt'>STT</th>
            <th className='product-code'>MHH</th>
            <th className='product-item'>HÀNG HOÁ</th>
            <th className='dvt'>ĐVT</th>
            <th className='product-quantity'>SL</th>
            <th className='product-price'>ĐƠN GIÁ</th>
            <th className='product-discount'>CHIẾT KHẤU</th>
            <th className='product-total-price'>THÀNH TIỀN</th>
          </tr>
          {UIDataForPrintScreen.rowData}
          <tr className='upper-border-section'>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td colSpan={2} className='no-border-right'>
              <b>Tổng thành tiền:</b> &nbsp;&nbsp;&nbsp;
              {formatterPrice.format(UIDataForPrintScreen.totalPrice)}
            </td>
          </tr>
          <tr className='upper-border-section'>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td colSpan={2} className='no-border-right'>
              <b>Tổng chiết khấu:</b> &nbsp;&nbsp;&nbsp;
              {formatterPrice.format(UIDataForPrintScreen.totalDiscount)}
            </td>
          </tr>
          <tr className='upper-border-section'>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td className='no-border-right'></td>
            <td colSpan={2} className='no-border-right'>
              <b>TỔNG TIỀN THANH TOÁN:</b> &nbsp;&nbsp;&nbsp;
              {formatterPrice.format(UIDataForPrintScreen.totalPrice - UIDataForPrintScreen.totalDiscount)}
            </td>
          </tr>
        </table>
        <div className='signing'>
          <div>NGƯỜI NHẬN HÀNG</div>
          <div>NGƯỜI GIAO HÀNG</div>
          <div>NGƯỜI LẬP B/N</div>
        </div>
      </div>
    );
  }
}

const PrintScreen = (props: any) => {
  const componentRef = useRef();
  const { confirm } = Modal;
  const propsObj = {
    listToPrint: props.listToPrint,
    contracts: props.contracts,
    company: props.company,
  };

  const showConfirm = () => {
    confirm({
      title: 'Xác nhận đã in',
      icon: <ExclamationCircleOutlined />,
      content: 'Nếu hóa đơn của bạn đã in thành công, bấm vào nút "Xác nhận" để thiết lập trạng đã in cho đơn hàng',
      okText: 'Xác nhận',
      cancelText: 'Thoát',
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1 <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
            const day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate();
            const hour = date.getHours() <= 9 ? '0' + date.getHours() : date.getHours();
            const minute = date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes();
            const leave_date = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;

            const ret = await fetchAPI('PATCH', {
              path: `orders/${props.orderId}`,
              params: {
                order_status: 'onboard',
                leave_date,
              },
            });

            if (ret.res.data !== undefined) {
              message.success('Cập nhật trạng thái thành công');
              location.reload();
              resolve();
            }
          } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error);
            message.error('Cập nhật trạng thái thất bại do đã có lỗi xảy ra !!');
            reject();
          }
          // tslint:disable-next-line: no-console
        }).catch(() => console.log('Oops errors!'));
      },
      // tslint:disable-next-line: no-empty
      onCancel() {},
    });
  };

  return props.loading ? (
    <div>Đang load dữ liệu...</div>
  ) : (
    <Card style={{ marginTop: 30 }}>
      <h1>Hoá đơn</h1>
      <ReactToPrint
        trigger={() => (
          <Button type='primary' icon={<PrinterOutlined />}>
            In
          </Button>
        )}
        content={() => componentRef.current}
        bodyClass={'print-container'}
        onAfterPrint={() => showConfirm()}
      />
      <ComponentToPrint ref={componentRef} {...propsObj} />
    </Card>
  );
};

export const OrdersScreen = Screen;
