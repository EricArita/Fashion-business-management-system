import React, { useState, useEffect } from "react";
import { Card, Button, Form, Input, Row, Col, Select, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import Router from "next/router";
import "./styles.less";
import { fetchAPI, constants } from "../../../../helper";

interface Props {
  id: string;
}

const Screen = (props: Props) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [wholesalerOptions, setWholesalerOptions] = useState([]);
  const [packageOptions, setPackageOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [totalWholesalerRecords, setTotalWholesalerRecords] = useState(0);
  const [totalPackageRecords, setTotalPackageRecords] = useState(0);
  const [totalCategoryRecords, setTotalCategoryRecords] = useState(0);
  const [totalProductRecords, setTotalProductRecords] = useState(0);
  const [paginationPackage, setPaginationPackage] = useState({
    current: 0,
    totalPages: 0,
  });
  const [paginationProduct, setPaginationProduct] = useState({
    current: 0,
    totalPages: 0,
  });
  const [paginationCategory, setPaginationCategory] = useState({
    current: 0,
    totalPages: 0,
  });
  const [paginationWholesaler, setPaginationWholesaler] = useState({
    current: 0,
    totalPages: 0,
  });
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    getEditedContract();
    countTotalPages("wholesalers");
    countTotalPages("packages");
    countTotalPages("categories");
  }, []);

  useEffect(() => {
    if (totalWholesalerRecords != 0) {
      getWholesalers();
    }
  }, [totalWholesalerRecords]);

  useEffect(() => {
    if (totalCategoryRecords != 0) {
      getCategories();
    }
  }, [totalCategoryRecords]);

  useEffect(() => {
    if (totalProductRecords !== 0 && selectedCategoryId !== "") {
      getProducts();
    }
  }, [totalProductRecords, selectedCategoryId]);

  useEffect(() => {
    if (totalPackageRecords != 0) {
      getPackages();
    }
  }, [totalPackageRecords]);

  const countTotalPages = async (target: string) => {
    const res = await fetchAPI("GET", `${target}/count`, {
      deleted: false,
    });

    if (res.count !== undefined) {
      let totalPages = (res.count / constants.LIMIT_RECORDS_PER_PAGE) | 0;
      if (res.count % constants.LIMIT_RECORDS_PER_PAGE !== 0) {
        totalPages++;
      }

      switch (target) {
        case "wholesalers":
          paginationWholesaler.totalPages = totalPages;
          setTotalWholesalerRecords(res.count);
          setPaginationWholesaler({ ...paginationWholesaler });
          break;
        case "categories":
          paginationCategory.totalPages = totalPages;
          setTotalCategoryRecords(res.count);
          setPaginationCategory({ ...paginationCategory });
          break;
        case "packages":
          paginationPackage.totalPages = totalPages;
          setTotalPackageRecords(res.count);
          setPaginationPackage({ ...paginationPackage });
          break;
        default:
          break;
      }
    }
  };

  const countTotalProductPages = async (categoryId: string) => {
    const res = await fetchAPI("GET", `products/count`, {
      deleted: false,
      categoryId,
    });

    if (res.count === 0){
      form.setFieldsValue({
        productId: ''
      });
      setProductOptions([]);
      paginationProduct.current = 0;
    }

    let totalPages = (res.count / constants.LIMIT_RECORDS_PER_PAGE) | 0;
    if (res.count % constants.LIMIT_RECORDS_PER_PAGE !== 0) {
      totalPages++;
    }

    paginationProduct.totalPages = totalPages;
    setTotalProductRecords(res.count);
    setPaginationProduct({ ...paginationProduct });
    setSelectedCategoryId(categoryId);
  };

  const getEditedContract = async () => {
    const res = await fetchAPI('GET', `contracts/${props.id}`);
    const product = res.productId !== undefined ? await fetchAPI('GET', `products/${res.productId}`) : undefined;
    form.setFieldsValue({
      code: res.code,
      wholesalerId: res.wholesalerId,
      categoryId: res.categoryId,
      productId: product !== undefined ? product.name : '',
      packageId: res.packageId
    });
  }

  const getWholesalers = async () => {
    try {
      if (paginationWholesaler.current < paginationWholesaler.totalPages) {
        const res = await fetchAPI("GET", "wholesalers", {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: paginationWholesaler.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false,
          },
        });

        if (wholesalerOptions.length === 0) {
          setWholesalerOptions(res);
        } else {
          setWholesalerOptions([...wholesalerOptions, ...res]);
        }

        paginationWholesaler.current++;
        setPaginationWholesaler({ ...paginationWholesaler });
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const getPackages = async () => {
    try {
      if (paginationPackage.current < paginationPackage.totalPages) {
        const res = await fetchAPI("GET", "packages", {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: paginationPackage.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false,
          },
        });

        if (packageOptions.length === 0) {
          setPackageOptions(res);
        } else {
          setPackageOptions([...packageOptions, ...res]);
        }

        paginationPackage.current++;
        setPaginationPackage({ ...paginationPackage });
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      if (paginationCategory.current < paginationCategory.totalPages) {
        const res = await fetchAPI("GET", "categories", {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: paginationCategory.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false,
          },
        });

        if (categoryOptions.length === 0) {
          setCategoryOptions(res);
        } else {
          setCategoryOptions([...categoryOptions, ...res]);
        }
      }

      paginationCategory.current++;
      setPaginationCategory({ ...paginationCategory });
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const getProducts = async () => {
    try {
      if (paginationProduct.current < paginationProduct.totalPages) {
        const res = await fetchAPI("GET", "products", {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: paginationProduct.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false,
            categoryId: selectedCategoryId,
          },
        });

        if (productOptions.length === 0) {
          setProductOptions(res);
        } else {
          setProductOptions([...productOptions, ...res]);
        }

        paginationProduct.current++;
        setPaginationProduct({ ...paginationProduct });
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  // const doSearchProduct = async (filterString: string) => {
  //   try {
  //     const lowerCaseFilterString = filterString.toLowerCase();
  //     const upperCaseFilterString = filterString.toUpperCase();

  //     if (filterString !== '') {
  //       const products = productOptions.filter((item, index) => {
  //           if ((item.code !== undefined && item.code.toLowerCase().indexOf(lowerCaseFilterString) >= 0)
  //             || item.name.toLowerCase().indexOf(lowerCaseFilterString) >= 0) {
  //               return item;
  //           }
  //       });

  //       if (products.length > 0) {
  //         setProductOptions([...products]);
  //       }
  //       else {
  //         // filter in DB
  //         // const pattern = new RegExp('%' + 'VM11' + '%', 'i');
  //         const ret = await fetchAPI('GET', {
  //           path: 'products',
  //           params: {
  //             page: 2,
  //             filter: [
  //               {
  //                 where: {
  //                   deleted: false,
  //                   categoryId: selectedCategoryId,
  //                   code: upperCaseFilterString,
  //                   // applicationId: config.appId,
  //                 },
  //               },
  //             ],
  //           },
  //         });
  //         // console.log()

  //         if (ret.res.data !== undefined) {
  //           setProductOptions([...ret.res.data]);
  //         }
  //       }
  //     }
  //     else {
  //       getProducts(selectedCategoryId);
  //     }
  //   } catch (error) {
  //     // tslint:disable-next-line: no-console
  //     console.log(error);
  //   }
  // };

  const saveEditedContract = async (values: any) => {
    try {
      const res = await fetchAPI("PATCH", `contracts/${props.id}`, values);

      if (res !== undefined) {
        message.success("Cập nhật dữ liệu thành công");
        Router.push("/contracts");
      }
    } catch (error) {
      message.error("Không thể thêm mới dữ liệu do đã có lỗi xảy ra !!");
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };
  
  const onSubmit = async (values: any) => {
    setIsDisabled(true);
    await saveEditedContract(values);
    setIsDisabled(false);
  };

  const handleScrollPackage = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      getPackages();
    }
  };

  const handleScrollWholesaler = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      getWholesalers();
    }
  };

  const handleScrollProduct = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      getProducts();
    }
  };

  const handleScrollCategory = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      getCategories();
    }
  };

  return (
    <Card bordered={false}>
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="code" label="Mã hợp đồng">
              <Input placeholder="Code" autoFocus={true} />
            </Form.Item>
            <Form.Item name="wholesalerId" label="Nhà bán buôn">
              <Select
                showSearch={true}
                placeholder="Nhà bán buôn"
                optionFilterProp="children"
                loading={false}
                onPopupScroll={handleScrollWholesaler}
                notFoundContent="Không tìm thấy"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {wholesalerOptions.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {`${item.code} - ${item.name}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="packageId" label="Gói chiết khấu">
              {
                <Select
                  showSearch={true}
                  placeholder="Gói chiết khấu"
                  optionFilterProp="children"
                  loading={false}
                  onPopupScroll={handleScrollPackage}
                  notFoundContent="Không tìm thấy"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {packageOptions.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.sale !== undefined
                        ? `${item.name} ${item.sale}${item.currency}`
                        : item.name}
                    </Option>
                  ))}
                </Select>
              }
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="categoryId" label="Loại sản phẩm">
              <Select
                showSearch={true}
                placeholder="Loại sản phẩm"
                optionFilterProp="children"
                onSelect={countTotalProductPages}
                loading={false}
                onPopupScroll={handleScrollCategory}
                notFoundContent="Không tìm thấy"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {categoryOptions.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="productId" label="Sản phẩm">
              <Select
                showSearch={true}
                placeholder="Sản phẩm"
                // optionFilterProp='children'
                loading={false}
                onPopupScroll={handleScrollProduct}
                notFoundContent="Không tìm thấy"
                allowClear={true}
                // filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                //onSearch={(filterString) => doSearchProduct(filterString)}
              >
                {productOptions.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.code !== undefined
                      ? item.code + "-" + item.name
                      : item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item>
            <Button
              disabled={isDisabled}
              icon={<SaveOutlined />}
              type="primary"
              htmlType="submit"
            >
              Lưu
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
};

export const EditContractScreen = Screen;