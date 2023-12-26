import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Paginator from "react-hooks-paginator";
import { Breadcrumb, BreadcrumbItem } from "../../components/Other/Breadcrumb";
import { getProductbyFilter } from "../../common/productSelect";
import LayoutOne from "../../components/Layout/LayoutOne";
// import productData from "../../data/products.json";
import ShopProducts from "../../components/Shop/ShopProducts";
import ShopHeader from "../../components/Shop/ShopHeader";
import Product from "../../components/Product";
import InstagramTwo from "../../components/Sections/Instagram/InstagramTwo";
import ShopSidebar from "../../components/Shop/ShopSidebar";
import AllProductsCard from "../../components/Shop/AllProductCards";
import { baseUrl } from "../../../config";
import axios from "axios";
import Loading from "../../components/Other/Loading";
import { useMediaQuery } from "react-responsive";
import { MobileSidebar } from "../../components/Shop/MobileSidebar";

export default function () {
  const filterData = useSelector((state) => state.shopReducers.filter);
  const pageLimit = 12;
  const [offset, setOffset] = useState(0);
  const [currentView, setCurrentView] = useState();
  const [currentSort, setCurrentSort] = useState();
  const [count, setCount] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const url_pro = `${baseUrl}/api/website/front/all/products?page=${currentPage}&size=12`;
      const res_pro = await axios.get(url_pro, { withCredentials: true });
      setProductData(res_pro.data.allProducts);
      setTotal(res_pro?.data?.count);
      setCurrentPage(res_pro?.data?.page);
      const url = `${baseUrl}/api/website/front/get/all/brands`;
      const arr = await axios.get(url, { withCredentials: true });
      const res = arr.data.filter(
        (arr, index, self) =>
          index ===
          self.findIndex((t) => t.main_category_name === arr.main_category_name)
      );
      setCategoriesData(res);
      setLoading(false);
      console.log("productData---", res_pro.data.allProducts);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useState(() => {
    fetchData();
  }, []);

  async function PageData(page) {
    try {
      setLoading(true);
      const url_pro = `${baseUrl}/api/website/front/all/products?page=${page}&size=12`;
      const res_pro = await axios.get(url_pro, { withCredentials: true });
      setProductData(res_pro.data.allProducts);
      //  setCurrentPage(parseInt(res_pro?.data?.page));
      setTotal(res_pro.data.count);
      setLoading(false);
      // const url = `${baseUrl}/api/website/front/get/all/brands`;
      // const arr = await axios.get(url, { withCredentials: true });
      // const res = arr.data.filter(
      //   (arr, index, self) =>
      //     index ===
      //     self.findIndex((t) => t.main_category_name === arr.main_category_name)
      // );
      // setCategoriesData(res);
      console.log("productData---", res_pro.data.allProducts);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  // const categoriesData =[
  //   {id:0,title:'All'},
  //   {id:1,title:'Dilutions'},
  //   {id:2,title:'Unani'},
  //   {id:3,title:'Ayurveda'},
  //   {id:4,title:'Trituration'},
  //   {id:5,title:'Lm Potencies'},
  //   {id:6,title:'Homoeopathic Medicines'},
  // ]

  // ----------------------- logic for dropdown menu -----------------------------------
  // const optionMenu = document.getElementsByClassName(".select-menu");
  // const selectBtn = document.getElementsByClassName(".select-btn");
  // const options = document.getElementsByClassName(".option");

  // options.forEach((option) => {
  //   option.addEventListener("click", () => {
  //     let selectedOption = option.getElementsByClassName(".option-text").innerText;
  //     sBtn_text.innerText = selectedOption;
  //     optionMenu.classList.remove("active");
  //   });
  // });

  useEffect(() => {
    let sortedProduct = getProductbyFilter(
      productData,
      currentSort,
      filterData.category,
      filterData.priceRange.from,
      filterData.priceRange.to,
      filterData.brand
    );
    console.log(sortedProduct);
    setCurrentData(sortedProduct);
  }, [offset, currentSort, filterData]);

  console.log(total);
  console.log(currentPage === Math.round(total / 12));

  return (
    // <LayoutOne title="Shop Fullwidth Left Sidebar" container="wide">
    <LayoutOne title="Shop Fullwidth Left Sidebar">
      <Breadcrumb title="Shop Products">
        <BreadcrumbItem name="Home" />
        <BreadcrumbItem name="Shop" current />
      </Breadcrumb>
      {isTabletOrMobile ? (
        <div>
          <MobileSidebar categoriesData={categoriesData} />
          {loading ? (
            <Loading />
          ) : (
            <div className="col-12 col-md-8 col-lg-9 col-xl-10">
              {!productData || productData.length === 0 ? (
                <h1>No product found</h1>
              ) : (
                <>
                  <AllProductsCard
                    gridColClass="col-12 col-sm-6 col-lg-4 col-xl-3"
                    listColClass="col-12 col-xl-6"
                    view="grid"
                    data={currentData.length === 0 ? productData : currentData}
                  />

                  {total >= 12 && (
                    <div id="app" class="container">
                      {Math.round(total / 12) < 8 ? (
                        <ul class="page">
                          <li class="page__btn">
                            <i
                              className="fas fa-angle-left"
                              onClick={() => {
                                setCurrentPage(currentPage - 1);
                                PageData(currentPage - 1);
                              }}
                            />
                          </li>
                          {[0 + 1, 1 + 1, 2 + 1, 3 + 1, 4 + 1, 5 + 1].map(
                            (i) => {
                              if (currentPage === i) {
                                return (
                                  <li class="page__numbers active">{i}</li>
                                );
                              } else {
                                return (
                                  <li
                                    class="page__numbers"
                                    onClick={() => {
                                      setCurrentPage(i);
                                      PageData(i);
                                    }}
                                  >
                                    {i}
                                  </li>
                                );
                              }
                            }
                          )}

                          <li
                            class="page__btn"
                            onClick={() => {
                              setCurrentPage(currentPage + 1);
                              PageData(currentPage + 1);
                            }}
                          >
                            <i className="fas fa-angle-right"></i>
                          </li>
                        </ul>
                      ) : (
                        <ul class="page">
                          <li class="page__btn">
                            <i
                              className="fas fa-angle-left"
                              onClick={() => {
                                setCurrentPage(currentPage - 1);
                                PageData(currentPage - 1);
                              }}
                            />
                          </li>
                          {currentPage === Math.round(total / 12)
                            ? [
                                currentPage - 5,
                                currentPage - 4,
                                currentPage - 3,
                                currentPage - 2,
                                currentPage - 1,
                                currentPage
                              ].map((i) => {
                                if (currentPage === i) {
                                  return (
                                    <li class="page__numbers active">{currentPage}</li>
                                  );
                                } else {
                                  return (
                                    <li
                                      class="page__numbers"
                                      onClick={() => {
                                        setCurrentPage(i);
                                        PageData(i);
                                      }}
                                    >
                                      {i}
                                    </li>
                                  );
                                }
                              })
                            : [
                                currentPage + 0,
                                currentPage + 1,
                                currentPage + 2,
                                currentPage + 3,
                                currentPage + 4,
                                currentPage + 5,
                              ].map((i) => {
                                if (currentPage === i) {
                                  return (
                                    <li class="page__numbers active">{i}</li>
                                  );
                                } else {
                                  return (
                                    <li
                                      class="page__numbers"
                                      onClick={() => {
                                        setCurrentPage(i);
                                        PageData(i);
                                      }}
                                    >
                                      {i}
                                    </li>
                                  );
                                }
                              })}
                          {currentPage < total / 12 - 3 && (
                            <li class="page__dots">...</li>
                          )}
                          {currentPage === Math.round(total / 12) ? (
                            <li class="page__numbers active">
                              {Math.round(productData.length / 12)}
                            </li>
                          ) : (
                            <li
                              class="page__numbers"
                              onClick={() => {
                                setCurrentPage(Math.round(total / 12));
                                PageData(productData.length / 12);
                              }}
                            >
                              {Math.round(total / 12)}
                            </li>
                          )}
                          <li
                            class="page__btn"
                            onClick={() => {
                              setCurrentPage(currentPage + 1);
                              PageData(currentPage + 1);
                            }}
                          >
                            <i className="fas fa-angle-right"></i>
                          </li>
                        </ul>
                      )}
                    </div>
                  )}

                  {/* <Paginator
                    pageContainerClass="paginator"
                    totalRecords="837"
                    offset={offset}
                    setOffset={setOffset}
                    pageLimit={pageLimit}
                    pageNeighbours={2}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  /> */}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="">
          <div className="shop -five-col">
            <div className="container-full-half">
              <div className="row">
                <div className="col-12 col-md-4 col-lg-3 col-xl-2">
                  <ShopSidebar categoriesData={categoriesData} />
                </div>
                {loading ? (
                  <>
                    {" "}
                    <Loading />{" "}
                  </>
                ) : (
                  <div className="col-12 col-md-8 col-lg-9 col-xl-10">
                    {/* <ShopHeader
                view={currentView}
                getCurrentSort={setCurrentSort}
                getCurrentView={(view) => setCurrentView(view)}
              /> */}
                    {!productData || productData.length === 0 ? (
                      <h1>No product found</h1>
                    ) : (
                      <>
                        <AllProductsCard
                          gridColClass="col-12 col-sm-6 col-lg-4 col-xl-3"
                          listColClass="col-12 col-xl-6"
                          view="grid"
                          data={
                            currentData.length === 0 ? productData : currentData
                          }
                        />

                        {total >= 12 && (
                          <div id="app" class="container">
                            {Math.round(total / 12) < 8 ? (
                              <ul class="page">
                                <li class="page__btn">
                                  <i
                                    className="fas fa-angle-left"
                                    onClick={() => {
                                      setCurrentPage(currentPage - 1);
                                      PageData(currentPage - 1);
                                    }}
                                  />
                                </li>
                                {[0 + 1, 1 + 1, 2 + 1, 3 + 1, 4 + 1, 5 + 1].map(
                                  (i) => {
                                    if (currentPage === i) {
                                      return (
                                        <li class="page__numbers active">
                                          {i}
                                        </li>
                                      );
                                    } else {
                                      return (
                                        <li
                                          class="page__numbers"
                                          onClick={() => {
                                            setCurrentPage(i);
                                            PageData(i);
                                          }}
                                        >
                                          {i}
                                        </li>
                                      );
                                    }
                                  }
                                )}

                                <li
                                  class="page__btn"
                                  onClick={() => {
                                    setCurrentPage(currentPage + 1);
                                    PageData(currentPage + 1);
                                  }}
                                >
                                  <i className="fas fa-angle-right"></i>
                                </li>
                              </ul>
                            ) : (
                              <ul class="page">
                                <li class="page__btn">
                                  <i
                                    className="fas fa-angle-left"
                                    onClick={() => {
                                      setCurrentPage(currentPage - 1);
                                      PageData(currentPage - 1);
                                    }}
                                  />
                                </li>
                                {currentPage === Math.round(total / 12)
                                  ? [
                                      currentPage - 5,
                                      currentPage - 4,
                                      currentPage - 3,
                                      currentPage - 2,
                                      currentPage - 1,
                                      currentPage
                                    ].map((i) => {
                                      if (currentPage === i) {
                                        return (
                                          <li class="page__numbers active">
                                            {currentPage}
                                          </li>
                                        );
                                      } else {
                                        return (
                                          <li
                                            class="page__numbers"
                                            onClick={() => {
                                              setCurrentPage(i);
                                              PageData(i);
                                            }}
                                          >
                                            {i}
                                          </li>
                                        );
                                      }
                                    })
                                  : [
                                      currentPage + 0,
                                      currentPage + 1,
                                      currentPage + 2,
                                      currentPage + 3,
                                      currentPage + 4,
                                      currentPage + 5,
                                    ].map((i) => {
                                      if (currentPage === i) {
                                        return (
                                          <li class="page__numbers active">
                                            {i}
                                          </li>
                                        );
                                      } else {
                                        return (
                                          <li
                                            class="page__numbers"
                                            onClick={() => {
                                              setCurrentPage(i);
                                              PageData(i);
                                            }}
                                          >
                                            {i}
                                          </li>
                                        );
                                      }
                                    })}
                                {currentPage < total / 12 - 3 && (
                                  <li class="page__dots">...</li>
                                )}
                                {currentPage === Math.round(total / 12) ? (
                                  <li class="page__numbers active">
                                    {Math.round(productData.length / 12)}
                                  </li>
                                ) : (
                                  <li
                                    class="page__numbers"
                                    onClick={() => {
                                      setCurrentPage(Math.round(total / 12));
                                      PageData(productData.length / 12);
                                    }}
                                  >
                                    {Math.round(total / 12)}
                                  </li>
                                )}
                                <li
                                  class="page__btn"
                                  onClick={() => {
                                    setCurrentPage(currentPage + 1);
                                    PageData(currentPage + 1);
                                  }}
                                >
                                  <i className="fas fa-angle-right"></i>
                                </li>
                              </ul>
                            )}
                          </div>
                        )}

                        {/* <Paginator
                          pageContainerClass="paginator"
                          totalRecords="837"
                          offset={offset}
                          setOffset={setOffset}
                          pageLimit={pageLimit}
                          pageNeighbours={2}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                        /> */}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <InstagramTwo /> */}
    </LayoutOne>
  );
}
