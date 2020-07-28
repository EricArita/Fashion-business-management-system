import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  Switch,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Router from "next/router";
import "./styles.less";
import { fetchAPI, constants } from "../../../../helper";

const Screen = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [wholesalerOptions, setWholesalerOptions] = useState([]); 
  const [packageOptions, setPackageOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
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
    countTotalPages('wholesalers');
    countTotalPages('packages');
    countTotalPages('categories');
  }, []);

  useEffect(() => {
    if (paginationWholesaler.totalPages != 0) {
      getWholesalers();
    }
  }, [paginationWholesaler]);

  useEffect(() => {
    if (paginationCategory.totalPages != 0) {
      getCategories();
    }
  }, [paginationCategory]);

  useEffect(() => {
    if (paginationPackage.totalPages != 0) {
      getPackages();
    }
  }, [paginationPackage]);

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
          setPaginationWholesaler({ ...paginationWholesaler });
          break;
        case "categories":
          paginationCategory.totalPages = totalPages;
          setPaginationCategory({ ...paginationCategory });
          break;
        case "products":
          paginationProduct.totalPages = totalPages;
          setPaginationProduct({ ...paginationProduct });
          break;
        case "packages":
          paginationPackage.totalPages = totalPages;
          setPaginationPackage({ ...paginationPackage });
          break;
        default:
          break;
      }
    }
  };

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
        }
        else {
          setWholesalerOptions([...wholesalerOptions, ...res]);
        }

        paginationWholesaler.current++;
        setPaginationWholesaler({...paginationWholesaler});
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
        }
        else {
          setPackageOptions([...packageOptions, ...res]);
        }

        paginationPackage.current++;
        setPaginationPackage({...paginationPackage});
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
        }
        else {
          setCategoryOptions([...categoryOptions, ...res]);
        }
      }

      paginationCategory.current++;
      setPaginationCategory({...paginationCategory});
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  const getProducts = async (categoryId, _value?) => {
    try {
      if (paginationProduct.current < paginationProduct.totalPages) {
        const res = await fetchAPI("GET", "products", {
          limit: constants.LIMIT_RECORDS_PER_PAGE,
          skip: paginationProduct.current * constants.LIMIT_RECORDS_PER_PAGE,
          where: {
            deleted: false,
          },
        });
        
        if (productOptions.length === 0) {
          setProductOptions(res);
        }
        else {
          setProductOptions([...productOptions, ...res]);
        }

        paginationProduct.current++;
        setPaginationProduct({...paginationProduct});
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error);
    }
  };

  // const loadMoreProduct = async (categoryId: string) => {
  //   try {
  //     if (paginationProduct['current'] < paginationProduct['page']) {
  //       const ret = await fetchAPI('GET', {
  //         path: 'products',
  //         params: {
  //           page: paginationProduct['current'] + 1,
  //           filter: [
  //             {
  //               where: {
  //                 deleted: false,
  //                 categoryId,
  //               },
  //             },
  //           ],
  //         },
  //       });
  //       if (ret.res.data.length !== 0) {
  //         setPaginationProduct(ret.res.pagination);
  //         setProductOptions([...productOptions, ...ret.res.data]);
  //       }
  //     }
  //   } catch (error) {
  //     // tslint:disable-next-line: no-console
  //     console.log(error);
  //   }
  // };

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

  const addContract = async (values: any) => {
    try {
      const res = await fetchAPI("POST", "contracts", values);

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
    await addContract(values);
    setIsDisabled(false);
  };

  const handleScrollPackage = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      //loadMore('Packages', packageOptions, paginationPackage);
    }
  };

  const handleScrollWholesaler = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      //loadMore('wholesalers', wholesalerOptions, paginationWholesaler);
    }
  };

  const handleScrollProduct = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      // loadMoreProduct(selectedCategoryId);
    }
  };

  const handleScrollCategory = (e) => {
    const ele = e.target;
    if (ele.scrollTop + ele.clientHeight === ele.scrollHeight) {
      //loadMore('categories', categoryOptions, paginationCategory);
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
            <Form.Item name="packagesId" label="Gói chiết khấu">
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
                onSelect={getProducts}
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
              icon={<PlusOutlined />}
              type="primary"
              htmlType="submit"
            >
              Thêm mới
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Card>
  );
};

export const AddContractScreen = Screen;
