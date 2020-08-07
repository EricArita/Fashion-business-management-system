import React, { useState, useEffect, useRef } from "react";
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
} from "antd";
import moment from "moment";
import {
  PlusOutlined,
  LoadingOutlined,
  SaveFilled,
  PrinterOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "./styles.less";
import { EditableCell } from "./components/EditableCell";
import Router from "next/router";
import { fetchAPI, constants } from "../../../../helper";
import ReactToPrint from "react-to-print";
import { ExportReactCSV } from "./components/ExportReactCSV";

const Screen = () => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [totalOrderRecords, setTotalOrderRecords] = useState(0);
  const [orderPagination, setOrderPagination] = useState({ current: 0, totalPages: 0});
  const [productPagination, setProductPagination] = useState({ current: 0, totalPages: 0 });
  const [wholesalerPagination, setWholesalerPagination] = useState({ current: 0, totalPages: 0 });
  const [totalWholesalerRecords, setTotalWholesalerRecords] = useState(0);
  const [totalProductRecords, setTotalProductRecords] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [itemsOfOrder, setItemsOfOrder] = useState([]);
  const [styleDisabledAnchorTag, setStyleDisabledAnchorTag] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [visibleAddItemModal, setVisibleAddItemModal] = useState(false);
  const [visibleItemListModal, setVisibleItemListModal] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [wholesalerOptions, setWholesalerOptions] = useState([]);
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
      title: "Mã nhà phân phối",
      key: "wholesalerCode",
      editable: true,
      render: (_: any, record: any) => {
        return record.wholesaler !== undefined &&
               record.wholesaler.code !== undefined
               ? record.wholesaler.code : "";
      },
    },
    {
      title: "Tên nhà phân phối",
      key: "wholesalerName",
      editable: true,
      render: (_: any, record: any) => {
        return record.wholesaler !== undefined &&
               record.wholesaler.name !== undefined
               ? record.wholesaler.name : "";
      },
    },
    {
      title: "Tổng giá",
      key: "price",
      editable: true,
      render: (_: any, record: any) => {
        return record.price !== undefined && record.price !== null
          ? formatterPrice.format(record.price) : 0;
      },
    },
    {
      title: "Giảm giá",
      key: "discount",
      editable: true,
      render: (_: any, record: any) => {
        return record.discount !== undefined && record.discount !== null
          ? formatterPrice.format(record.discount) : 0;
      },
    },
    {
      title: "Danh sách sản phẩm",
      key: "action",
      render: (_: any, record: any) => {
        return <a onClick={() => showItemListModal(record.id)}>Xem chi tiết</a>;
      },
    },
    {
      title: "Ngày tạo",
      key: "created_dt",
      editable: false,
      render: (_: any, record: any) => {
        const date = moment(record.created_dt);
        return date.format("DD-MM-YYYY");
      },
    },
    {
      title: "Ngày xuất",
      key: "export_date",
      editable: false,
      render: (_: any, record: any) => {
        if (record.export_date !== undefined) {
          const date = moment(record.export_date);
          return date.format("DD-MM-YYYY");
        }
        return "";
      },
    },
    {
      title: "Trạng thái",
      key: "order_status",
      editable: false,
      render: (_: any, record: any) => {
        switch (record.order_status) {
          case "await":
            return <span style={{ color: "red" }}>Chưa xuất </span>;
          case "onboard":
            return <span style={{ color: "#3ADF00" }}>Đã xuất</span>;
          case "cancel":
            return <span style={{ color: "#ccc" }}>Hủy</span>;
        }
      },
    },
    {
      title: "Công cụ",
      key: "action",
      render: (_: any, record: any) => {
        return record.order_status !== "cancel" ? (
          <span>
            <a
              style={{ marginRight: 8 }}
              onClick={() => showPrintOrderModal(record.id)}
            >
              In
            </a>
            <a
              style={{ marginRight: 8 }}
              onClick={() => Router.push(`/editOrder/${record.id}`)}
            >
              Sửa
            </a>
            <Popconfirm
              title="Bạn chắc chắn muốn hủy đơn hàng này?"
              onConfirm={() => cancelOrder(record.id)}
              okText="Đồng ý"
              cancelText="Thoát"
            >
              <a style={{ marginRight: 8 }}>Hủy</a>
            </Popconfirm>
            <Popconfirm
              title="Bạn chắc chắn muốn xóa dữ liệu này?"
              onConfirm={() => deleteOrder(record.id)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <a>Xóa</a>
            </Popconfirm>
          </span>
        ) : (
          ""
        );
      },
    },
  ];

  const productItemTableColumns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      editable: true,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      key: "size",
      editable: false,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      editable: true,
      render: (_: any, record: any) => {
        return record.price !== undefined && record.price !== null
          ? `${formatterPrice.format(record.price)}${record.currency}`
          : 0;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "qty",
      key: "qty",
      editable: true,
    },
    {
      title: "Công cụ",
      key: "action",
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => saveEditedItem(record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </a>
            <Popconfirm
              title="Bạn có chắc muốn thoát?"
              onConfirm={cancelEditingItem}
              okText="Thoát"
              cancelText="Hủy"
            >
              <a>Thoát</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a
              style={{
                ...styleDisabledAnchorTag,
                marginRight: 4,
                marginLeft: 4,
              }}
              onClick={() => editItem(record)}
            >
              Sửa
            </a>
            <Popconfirm
              title="Bạn chắc chắn muốn xóa dữ liệu này?"
              onConfirm={() => deleteItem(record.id)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <a style={{ ...styleDisabledAnchorTag, marginLeft: 4 }}>Xóa</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedItemTableColumns = productItemTableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    const inputType =
      col.dataIndex === "code" ||
      col.dataIndex === "name" ||
      col.dataIndex === "size" ||
      col.dataIndex === "currency"
        ? "text"
        : "number";
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
    style: "currency",
    currency: "VND",
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
    if (totalOrderRecords !== 0) {
      setLoadingOrderTable(true);
      getOrders();
    }
  }, [totalOrderRecords]);

  useEffect(() => {
    if (totalWholesalerRecords !== 0) {
      getWholesalers();
    }
  }, [totalWholesalerRecords]);

  useEffect(() => {
    if (totalProductRecords !== 0) {
      getProducts();
    }
  }, [totalProductRecords]);

  // =============================================
  //          initial methods region
  // =============================================

  const countTotalProducts = async () => {
    const res = await fetchAPI("GET", "products/count", {
      deleted: false,
    });
    if (res.count !== undefined) {
      let totalPages = (res.count / constants.LIMIT_RECORDS_PER_PAGE) | 0;
      if (res.count % constants.LIMIT_RECORDS_PER_PAGE !== 0) {
        totalPages++;
      }
      productPagination.totalPages = totalPages;
      setProductPagination({ ...productPagination });
      setTotalProductRecords(res.count);
    }
  };

  const getProducts = async () => {
    try {
      if (productPagination.current < productPagination.totalPages) {
        const res = await fetchAPI("GET", "products", {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: productPagination.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false,
          },
        });

        if (productPagination.current === 0) {
          setProductOptions(res);
        } else {
          // loadmore
          setProductOptions([...productOptions, ...res]);
        }

        productPagination.current++;
        setProductPagination({ ...productPagination });
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
    const res = await fetchAPI("GET", "wholesalers/count", {
      deleted: false,
    });
    if (res.count !== undefined) {
      let totalPages = (res.count / constants.LIMIT_RECORDS_PER_PAGE) | 0;
      if (res.count % constants.LIMIT_RECORDS_PER_PAGE !== 0) {
        totalPages++;
      }
      wholesalerPagination.totalPages = totalPages;
      setWholesalerPagination({ ...wholesalerPagination });
      setTotalWholesalerRecords(res.count);
    }
  };

  const getWholesalers = async () => {
    try {
      if (wholesalerPagination.current < wholesalerPagination.totalPages) {
        const res = await fetchAPI("GET", "wholesalers", {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: wholesalerPagination.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false,
          },
        });

        if (wholesalerPagination.current === 0) {
          setWholesalerOptions(res);
        } else {
          // loadmore
          setWholesalerOptions([...wholesalerOptions, ...res]);
        }

        wholesalerPagination.current++;
        setWholesalerPagination({ ...wholesalerPagination });
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

  // ==============================================
  //       Product item's methods region
  // ==============================================

  const getContracts = async (orderId: string) => {
    if (orderId !== undefined && orderId !== "") {
      console.log(orders);
      const order = orders.find((item) => item.id === orderId);
      const wholesalerId =
        order.wholesalerId !== undefined ? order.wholesalerId : "";
      let res = await fetchAPI("GET", "contracts", {
        where: {
          wholesalerId,
          deleted: false,
        },
      });

      if (res !== undefined) {
        res = await Promise.all(
          res.map(async (contract, index) => {
            contract.package = await fetchAPI( "GET", `packages/${contract.packageId}` );
            return contract;
          })
        );
        setContracts(res);
        return res;
      }
    }
  };

  const showItemListModal = async (orderId: string) => {
    console.log(orders);
    getContracts(orderId);
    const order = orders.find((item) => item.id === orderId);
    
    if (order.order_status === "cancel") {
      setDisableBtnAddNewProduct(true);
    }
    
    setSelectedOrderId(orderId);
    setVisibleItemListModal(true);
    setLoadingItemTable(true);
    setItemsOfOrder(order.items);
    setLoadingItemTable(false);
  };

  const editItem = async (record) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
    setStyleDisabledAnchorTag({
      pointerEvents: "none",
      color: "#ccc",
    });
  };

  const saveEditedItem = async (recordId: string) => {
    try {
      const updatedInfo = await form.validateFields();
      const order = orders.find((item) => item.id === selectedOrderId);
      const itemIndex = order.items.findIndex((item) => item.id === recordId);
      Object.assign(order.items[itemIndex], updatedInfo);
      
      const res = await fetchAPI("PATCH", `orders/${selectedOrderId}`, order);
     
      message.success("Cập nhật dữ liệu thành công");
      setItemsOfOrder(order.items);
      countPriceOfOrder(order.items);
      countTotalPriceOrders();
      setEditingId("");
      setStyleDisabledAnchorTag({});
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error("Không thể cập nhật dữ liệu do đã có lỗi xảy ra");
    }
  };

  const deleteItem = async (recordId: string) => {
    try {
      const order = orders.find((item) => item.id === selectedOrderId);
      const index = order.items.findIndex((item) => item.id === recordId);
      order.items.splice(index, 1);
      countPriceOfOrder(order.items);

      const res = await fetchAPI("PATCH", `orders/${selectedOrderId}`, order);

      message.success("Xóa dữ liệu thành công");
      setItemsOfOrder(order.items);
      countTotalPriceOrders();
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error("Không thể xóa dữ liệu do đã có lỗi xảy ra");
    }
  };

  const cancelEditingItem = () => {
    setEditingId("");
    setStyleDisabledAnchorTag({});
  };

  const handlePostNewItem = async () => {
    try {
      const newItem = await form.validateFields();
      const order = orders.find((item) => item.id === selectedOrderId);
      const index = order.items.findIndex((item) => item.id === newItem.id);

      if (index === -1) {
        order.items.push(newItem);
      }
      else {
        order.items[index].qty++;
      }     
      countPriceOfOrder(order.items);

      const res = await fetchAPI("PATCH", `orders/${selectedOrderId}`, order);

      message.success("Thêm dữ liệu thành công");
      setItemsOfOrder(order.items);
      countTotalPriceOrders();
      setVisibleAddItemModal(false);
      form.setFieldsValue({
        id: "",
        code: "",
        name: "",
        categoryId: "",
        size: "",
        price: "",
        currency: ""
      });
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error("Không thể thêm dữ liệu do đã có lỗi xảy ra");
    }
  };

  const handleSelectedProduct = (productId) => {
    const product = productOptions.find((item) => item.id === productId);
    form.setFieldsValue({
      id: product.id,
      code: product.code !== undefined ? product.code : "Sản phẩm chưa có code",
      name: product.name,
      categoryId: product.categoryId,
      size: product.size,
      price: product.price,
      currency: product.currency
    });
  };

  // ============ end region =====================

  // =======================================
  //        Order's methods region
  // =======================================

  const countTotalOrders = async () => {
    const res = await fetchAPI("GET", "orders/count", {
      deleted: false,
    });
    if (res.count !== undefined) {
      let totalPages = (res.count / constants.LIMIT_RECORDS_PER_PAGE) | 0;
      if (res.count % constants.LIMIT_RECORDS_PER_PAGE !== 0) {
        totalPages++;
      }
      orderPagination.totalPages = totalPages;
      setOrderPagination({ ...orderPagination });
      setTotalOrderRecords(res.count);
    }
  };

  const getOrders = async (reset = false) => {
    try {
      if (orderPagination.current < orderPagination.totalPages || reset) {
        if (reset) {
          setLoadingOrderTable(true);
        } else if (orderPagination.current !== 0) setLoadingMore(true);

        let res = await fetchAPI("GET", "orders", {
          where: {
            deleted: false,
          },
        });

        if (res !== undefined) {
          res = await Promise.all(
            res.map(async (order, index) => {
              if (order.wholesalerId !== undefined) {
                const wholesaler = await fetchAPI(
                  "GET",
                  `wholesalers/${order.wholesalerId}`
                );
                if (wholesaler !== null) {
                  order.wholesaler = wholesaler;
                }
              }
              return order;
            })
          );

          if (orderPagination.current === 0 || reset) {
            console.log(res);
            setOrders(res);
          } else {
            // onClick loadmore button
            setOrders([...orders, ...res]);
            setLoadingMore(false);
          }

          orderPagination.current = reset ? 1 : orderPagination.current + 1;
          setOrderPagination({ ...orderPagination });
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

  const countPriceOfOrder = async (listItemsInOrder: []) => {
    let totalPrice = 0;
    let discount = 0;

    if (listItemsInOrder !== undefined) {
      listItemsInOrder.forEach((item: any) => {
        if (item !== undefined) {
          const contract = contracts.find(
            (ct) => ct.categoryId === item.categoryId
          );
          const price = item.price * item.qty;

          if (contract !== undefined) {
            const sale = contract.package.sale;
            const formula = contract.package.formula;
            if (formula !== undefined && formula !== "") {
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
        }
      });

      if (selectedOrderId !== "") {
        const res = await fetchAPI("PATCH", `orders/${selectedOrderId}`, {
          price: totalPrice,
          discount,
        });

        if (res !== undefined) {
          const index = orders.findIndex(
            (item) => item.id === selectedOrderId
          );
          orders[index].price = totalPrice;
          orders[index].discount = discount;
          setOrders([...orders]);
        }
      }
    }
  };

  const countTotalPriceOrders = async (dataArr?: any) => {
    let data = dataArr;
    if (data === undefined || data.length === 0) {
      const res = await fetchAPI("GET", "orders", {
        where: {
          order_status: { inq: ["await", "onboard"] },
          deleted: false,
        },
      });
      if (res !== undefined && res.length > 0) {
        data = res;
      }
    }

    if (data !== undefined) {
      let sumAwait = 0;
      let sumOnBoard = 0;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        if (data[i].price !== undefined && data[i].order_status !== "cancel") {
          // tslint:disable-next-line: radix
          data[i].order_status === "await"
            ? (sumAwait += data[i].price)
            : (sumOnBoard += data[i].price);
        }
      }
      setTotalPriceOrderAwait(sumAwait);
      setTotalPriceOrderOnBoard(sumOnBoard);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const ret = await fetchAPI("PATCH", `orders/${orderId}`, {
        deleted: true,
      });

      const index = orders.findIndex((item) => item.id === orderId);
      if (index !== -1) {
        const newData = [...orders];
        newData.splice(index, 1);
        setOrders(newData);
      }

      setEditingId("");
      message.success("Xóa dữ liệu thành công");
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      message.error("Không thể xóa dữ liệu do đã có lỗi xảy ra");
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetchAPI("PATCH", `orders/${orderId}`, {
        order_status: "cancel",
      });

      if (res !== undefined) {
        message.success("Hủy đơn hàng thành công");
        const index = orders.findIndex((item) => item.id === orderId);
        orders[index].order_status = "cancel";
        setOrders([...orders]);
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
      message.error("Hủy đơn hàng thất bại do đã có lỗi xảy ra !!");
    }
  };

  const handleChangeDateTime = async ( _dates: any, dateStrings: [string, string] ) => {
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
    if (value !== "all") {
      const wholesaler = wholesalerOptions.find((item) => item.id === value);
      form.setFieldsValue({
        wholersalerCode: wholesaler.code,
        wholesalerName: wholesaler.name,
      });
    } else {
      form.setFieldsValue({
        wholersalerCode: "Tất cả",
        wholesalerName: "Tất cả",
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
    const order = orders.find((item) => item.id === orderId);
    const wholesaler = await fetchAPI("GET", `wholesalers/${order.wholesalerId}`);
    const listItemToPrint = order.items;
    const Contracts = await getContracts(orderId);
    setUIprintScreen(
      <PrintScreen
        loading={false}
        orderId={orderId}
        listToPrint={listItemToPrint}
        contracts={Contracts}
        company={wholesaler}
      />
    );
  };

  const spinnerIcon = (
    <LoadingOutlined style={{ fontSize: 20, color: "#fff" }} spin />
  );

  const csv = orders.map((el) => {
    return {
      id: el.id,
      status: el.order_status,
      price: el.price,
      currency: el.currency,
      discount: el.discount,
      // company: el.wholesalerId.companyId ? el.wholesalerId.companyId.name : '',
      company:
        el.wholesale !== undefined &&
        el.wholesaler.name !== undefined
          ? el.wholesaler.name
          : "",
      // wholesaler: el.wholesalerId.name,
      created_dt: moment(el.created_dt).format("DD-MM-YYYY"),
      updated_dt: moment(el.updated_dt).format("DD-MM-YYYY"),
      export_date: moment(el.export_date).format("DD-MM-YYYY"),
    };
  });

  return (
    <Card bordered={false}>
      <Card title="Tìm kiếm">
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={6}>
              <Form.Item name="wholesalerCode" label="Mã nhà phân phối">
                <Select
                  style={{ width: "100%" }}
                  showSearch={true}
                  placeholder="Code"
                  optionFilterProp="children"
                  loading={false}
                  allowClear={true}
                  onPopupScroll={handleScrollWholesalerList}
                  notFoundContent="Không tìm thấy"
                  onSelect={handleSelectWholesalers}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="all" key="all">
                    Tất cả
                  </Option>
                  {wholesalerOptions.map((item) => (
                    <Option value={item.wholesalerId} key={item.id}>
                      {item.companyId !== undefined &&
                      item.companyId.code !== undefined
                        ? item.companyId.code
                        : ""}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item name="wholesalerName" label="Tên nhà phân phối">
                <Select
                  style={{ width: "100%" }}
                  showSearch={true}
                  placeholder="Tên"
                  optionFilterProp="children"
                  loading={false}
                  allowClear={true}
                  onPopupScroll={handleScrollWholesalerList}
                  notFoundContent="Không tìm thấy"
                  onSelect={handleSelectWholesalers}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="all" key="all">
                    Tất cả
                  </Option>
                  {wholesalerOptions.map((item) => (
                    <Option value={item.wholesalerId} key={item.id}>
                      {item.companyId !== undefined &&
                      item.companyId.name !== undefined
                        ? item.companyId.name
                        : ""}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item label="Ngày tạo">
                <RangePicker
                  placeholder={["Từ ngày", "Đến ngày"]}
                  onCalendarChange={handleChangeDateTime}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <div className="body-content">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => Router.push("/addOrder")}
          style={{ marginBottom: 16 }}
        >
          Thêm mới
        </Button>
        <Button>
          <ExportReactCSV csvData={csv} fileName={"myOrders"} />
        </Button>
        <div className="total-price-order-info">
          <div className="total-price-onboard">
            <span>Đã thanh toán</span>
            <span className="badge-price">
              {formatterPrice.format(totalPriceOrdersOnBoard)}
            </span>
          </div>
          <div className="total-price-await">
            <span>Chưa thanh toán</span>
            <span className="badge-price">
              {formatterPrice.format(totalPriceOrdersAwait)}
            </span>
          </div>
        </div>
        <Table
          dataSource={orders}
          columns={orderTableColumns}
          loading={loadingOrderTable}
          pagination={false}
          rowKey="id"
        />
        <div className={"pagination-area"}>
          <Button type="primary" onClick={() => getOrders()}>
            <span>Hiển thị thêm</span>
            <Spin
              className="spinner-loading"
              indicator={spinnerIcon}
              spinning={loadingMore}
            />
          </Button>
          <span className={"pagination-info"}>
            {orders.length} / {totalOrderRecords}
          </span>
        </div>
        <Modal
          title="Thêm sản phẩm mới cho đơn hàng"
          width="70%"
          style={{ top: 20 }}
          visible={visibleAddItemModal}
          footer={null}
          onCancel={() => setVisibleAddItemModal(false)}
        >
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              id: "",
              code: "",
              name: "",
              category: "",
              size: "",
              price: "",
              currency: "VND",
            }}
            onFinish={handlePostNewItem}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="code"
                  label="Mã sản phẩm"
                  rules={[
                    {
                      required: true,
                      message: "Mã sản phẩm không được để trống",
                    },
                  ]}
                >
                  {
                    <Select
                      showSearch={true}
                      placeholder="Chọn mã sản phẩm"
                      optionFilterProp="children"
                      loading={false}
                      allowClear={true}
                      onPopupScroll={handleScrollProductList}
                      notFoundContent="Không tìm thấy"
                      onSelect={handleSelectedProduct}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {productOptions.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.code !== undefined ? item.code : "Sản phẩm chưa có code"}
                        </Option>
                      ))}
                    </Select>
                  }
                </Form.Item>
                <Form.Item name="id">
                  <Input hidden className="input-info-parcel" />
                </Form.Item>
                <Form.Item name="categoryId">
                  <Input hidden className="input-info-parcel" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Tên sản phẩm"
                  rules={[
                    {
                      required: true,
                      message: "Tên sản phẩm không được để trống",
                    },
                  ]}
                >
                  {
                    <Select
                      showSearch={true}
                      placeholder="Chọn tên sản phẩm"
                      optionFilterProp="children"
                      loading={false}
                      allowClear={true}
                      onPopupScroll={handleScrollProductList}
                      notFoundContent="Không tìm thấy"
                      onSelect={handleSelectedProduct}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
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
                <Card bordered={true} title="Kích cỡ">
                  <Row>
                    <Col xs={24} sm={5}>
                      <Form.Item name="size" label="Kích cỡ">
                        <Input
                          className="input-info-parcel"
                          min={0}
                          placeholder="Size"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <br></br>         
            <Row gutter={16}>
              <Col xs={24} sm={24}>
                <Card bordered={true} title="Giá và số lượng">
                  <Row>
                    <Col xs={24} sm={3}>
                      <Form.Item
                        name="price"
                        label="Giá"
                        rules={[
                          {
                            required: true,
                            message: "Giá tiền không được bỏ trống",
                          },
                        ]}
                      >
                        <InputNumber
                          className="input-info-parcel"
                          min={0}
                          placeholder="Giá"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={9}>
                      <Form.Item
                        name="currency"
                        label="Tiền tệ"
                        rules={[
                          {
                            required: true,
                            message: "Tiền tệ không được bỏ trống",
                          },
                        ]}
                      >
                        <Input
                          className="input-info-parcel"
                          placeholder="Đơn vị tiền tệ"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={5}>
                      <Form.Item
                        name="qty"
                        label="Số lượng"
                        rules={[
                          {
                            required: true,
                            message: "Số lượng không được bỏ trống",
                          },
                        ]}
                      >
                        <InputNumber
                          className="input-info-parcel"
                          placeholder="Số lượng"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row gutter={16}>
              <Form.Item>
                <Button
                  key="save"
                  icon={<SaveFilled />}
                  type="primary"
                  htmlType="submit"
                >
                  Lưu
                </Button>
                <Button
                  key="cancel"
                  onClick={() => setVisibleAddItemModal(false)}
                >
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
          title="In hóa đơn"
          visible={visiblePrintModal}
          style={{ top: 20 }}
          width="90%"
          onCancel={() => setVisiblePrintModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setVisiblePrintModal(false)}>
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
    const minute =
      date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes();
    const second =
      date.getSeconds() <= 9 ? `0${date.getSeconds()}` : date.getSeconds();

    this.state = {
      listToPrint: props.listToPrint,
      contracts: props.contracts,
      company: props.company,
      orderCode: `${hour}${minute}${second}`,
      currentDate: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    };
  }

  countPriceOfOrder = (listProductItems) => {
    let totalPrice = 0;
    let totalDiscount = 0;
    let cnt = 0;
    const UIDataForPrintScreen = {
      rowData: [],
      totalPrice: 0,
      totalDiscount: 0,
    };
    const formatterPrice = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "VND",
    });

    if (listProductItems !== undefined) {
      const arr = listProductItems.map((item, index) => {
        const contract = this.state.contracts.find(
          (ct) => ct["categoryId"] === item.categoryId
        );
        const price = item.qty !== 0 ? item.price * item.qty : item.price; // for calculte % of discount when price and cost are 0, avoid NaN% error
        totalPrice += item.qty !== 0 ? price : 0;

        if (contract !== undefined) {
          const sale = contract["package"]["sale"];
          const formula = contract["package"]["formula"];
          if (formula !== undefined && formula !== "") {
            // tslint:disable-next-line: no-eval
            const cost = eval(formula);
            totalDiscount += item.qty !== 0 ? price - cost : 0;

            return (
              <tr className="product-table-body" key={++cnt}>
                <td style={{ textAlign: "center" }}>{cnt}</td>
                <td style={{ textAlign: "center" }}>{item.code}</td>
                <td>{item.name}</td>
                <td style={{ textAlign: "center" }}>Cây</td>
                <td style={{ textAlign: "center" }}>{item.qty}</td>
                <td>{formatterPrice.format(item.price)}</td>
                <td style={{ textAlign: "center" }}>
                  {((price - cost) / price) * 100}%
                </td>
                <td>{item.qty !== 0 ? formatterPrice.format(price) : 0}</td>
              </tr>
            );
          } else if (sale !== undefined) {
            totalDiscount += sale;
            return (
              <tr className="product-table-body" key={++cnt}>
                <td style={{ textAlign: "center" }}>{cnt}</td>
                <td style={{ textAlign: "center" }}>{item.code}</td>
                <td>{item.name}</td>
                <td style={{ textAlign: "center" }}>Cây</td>
                <td style={{ textAlign: "center" }}>{item.qty}</td>
                <td>{formatterPrice.format(item.price)}</td>
                <td style={{ textAlign: "center" }}>
                  Giảm trực tiếp {formatterPrice.format(sale)}
                </td>
                <td>{formatterPrice.format(price)}</td>
              </tr>
            );
          }
        } else {
          return (
            <tr className="product-table-body" key={++cnt}>
              <td style={{ textAlign: "center" }}>{cnt}</td>
              <td style={{ textAlign: "center" }}>{item.code}</td>
              <td>{item.name}</td>
              <td style={{ textAlign: "center" }}>Cây</td>
              <td style={{ textAlign: "center" }}>{item.qty}</td>
              <td>{formatterPrice.format(item.price)}</td>
              <td></td>
              <td>{formatterPrice.format(price)}</td>
            </tr>
          );
        }
      });
      UIDataForPrintScreen.rowData = [
        ...UIDataForPrintScreen.rowData,
        ...arr,
      ];

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
        listToPrint: nextProps["listToPrint"],
        contracts: nextProps["contracts"],
        company: nextProps["company"],
        currentDate: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
      });
    }
  }

  render() {
    const formatterPrice = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "VND",
    });

    const UIDataForPrintScreen = this.countPriceOfOrder(this.state.listToPrint);

    return (
      <div className="print-container">
        <div className="print-header">
          <div className="print-header-info">
            <div className="header-info-text">TỔNG CTY PHÂN PHỐI HÀNG HÓA HCMUS</div>
            <div className="header-info-text">
              ĐT: 0349004909 - 3755488; Fax: (848) 3755 1128{" "}
            </div>
            <div className="header-info-text">Email: fit@hcmus.edu.vn </div>
          </div>
          <div className="print-header-title">
            <div className="print-big-title">BIÊN NHẬN</div>
            <div className="header-info-text">
              Số {this.state.orderCode} - Ngày {this.state.currentDate}{" "}
            </div>
          </div>
        </div>
        <div className="client-info">
          <div className="client-info-detail">
            <div className="client-code-text">Mã KH</div>
            <div className="client-code-container">DBDF</div>
            <div className="client-name">MindX</div>
          </div>
          <div>
            <div className="header-info-text">ĐT: 123456</div>
          </div>
        </div>
        <p className="client-address">TPHCM</p>
        <table className="product-table">
          <tr className="product-table-header">
            <th className="stt">STT</th>
            <th className="product-code">MHH</th>
            <th className="product-item">HÀNG HOÁ</th>
            <th className="dvt">ĐVT</th>
            <th className="product-quantity">SL</th>
            <th className="product-price">ĐƠN GIÁ</th>
            <th className="product-discount">CHIẾT KHẤU</th>
            <th className="product-total-price">THÀNH TIỀN</th>
          </tr>
          {UIDataForPrintScreen.rowData}
          <tr className="upper-border-section">
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td colSpan={2} className="no-border-right">
              <b>Tổng thành tiền:</b> &nbsp;&nbsp;&nbsp;
              {formatterPrice.format(UIDataForPrintScreen.totalPrice)}
            </td>
          </tr>
          <tr className="upper-border-section">
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td colSpan={2} className="no-border-right">
              <b>Tổng chiết khấu:</b> &nbsp;&nbsp;&nbsp;
              {formatterPrice.format(UIDataForPrintScreen.totalDiscount)}
            </td>
          </tr>
          <tr className="upper-border-section">
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td className="no-border-right"></td>
            <td colSpan={2} className="no-border-right">
              <b>TỔNG TIỀN THANH TOÁN:</b> &nbsp;&nbsp;&nbsp;
              {formatterPrice.format(
                UIDataForPrintScreen.totalPrice -
                  UIDataForPrintScreen.totalDiscount
              )}
            </td>
          </tr>
        </table>
        <div className="signing">
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
      title: "Xác nhận đã in",
      icon: <ExclamationCircleOutlined />,
      content:
        'Nếu hóa đơn của bạn đã in thành công, bấm vào nút "Xác nhận" để thiết lập trạng đã in cho đơn hàng',
      okText: "Xác nhận",
      cancelText: "Thoát",
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            const date = new Date();
            const year = date.getFullYear();
            const month =
              date.getMonth() + 1 <= 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            const day =
              date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
            const hour =
              date.getHours() <= 9 ? "0" + date.getHours() : date.getHours();
            const minute =
              date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes();
            const export_date = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;

            const res = await fetchAPI("PATCH", `orders/${props.orderId}`, {
              order_status: "onboard",
              export_date,
            });

            if (res !== undefined) {
              message.success("Cập nhật trạng thái thành công");
              location.reload();
              resolve();
            }
          } catch (error) {
            // tslint:disable-next-line: no-console
            console.log(error);
            message.error(
              "Cập nhật trạng thái thất bại do đã có lỗi xảy ra !!"
            );
            reject();
          }
          // tslint:disable-next-line: no-console
        }).catch(() => console.log("Oops errors!"));
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
          <Button type="primary" icon={<PrinterOutlined />}>
            In
          </Button>
        )}
        content={() => componentRef.current}
        bodyClass={"print-container"}
        onAfterPrint={() => showConfirm()}
      />
      <ComponentToPrint ref={componentRef} {...propsObj} />
    </Card>
  );
};

export const OrdersScreen = Screen;
