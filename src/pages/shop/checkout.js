import Link from "next/link";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { baseUrl } from "../../../config";
import LayoutFour from "../../components/Layout/LayoutFour";
import LayoutOne from "../../components/Layout/LayoutOne";
import { Breadcrumb, BreadcrumbItem } from "../../components/Other/Breadcrumb";
import InstagramTwo from "../../components/Sections/Instagram/InstagramTwo";
import {
  formatCurrency,
  formatDate,
  formatSingleNumber,
} from "../../common/utils";
import {
  calculateTotalPriceAfterCoupon,
  calculateDiscountPrice,
  calculateSubTotalPrice,
  calculateDiscountPriceAfterCoupon,
  calculateTotalPrice,
} from "../../common/shopUtils";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/Other/Loading";
import { removeAllFromCart } from "../../redux/actions/cartActions";
import styled from "styled-components";
import Swal from "sweetalert2";
import { FaCircleDot } from "react-icons/fa6";

export default function () {
  const cartState = useSelector((state) => state.cartReducer);
  const [couponAmount, setCouponAmount] = useState(0);
  const [couponType, setCouponType] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [show, setShow] = useState(false);
  const [showPayNowButton, setShowPayNowButton] = useState(false);
  const isAuthenticated = useSelector(
    (state) => state.userReducer.isAuthenticated
  );

  const currentUser = useSelector((state) => state.userReducer.user);
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();
  const {
    register: couponRegister,
    handleSubmit: couponHandleSubmit,
    errors: couponErrors,
  } = useForm();

  console.log("cartState =>", cartState);
  console.log("currentUser =>", currentUser);
  console.log(
    "calculateTotalPriceAfterCoupon =>",
    calculateTotalPriceAfterCoupon(cartState, true, couponAmount, couponType)
  );

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let allCartProducts = [];
      for (let i = 0; i < cartState?.length; i++) {
        console.log("cartState[i] one by one", cartState[i]);
        allCartProducts.push({
          product_id: cartState[i]?.productID,
          product_code: cartState[i]?.code,
          product_name: cartState[i]?.name,
          product_main_category: cartState[i]?.category,
          // product_category:cartState[i]?.productID,
          // product_subcategory:cartState[i]?.productID,
          // product_variant:cartState[i]?.productID,
          selected_variation: cartState[i]?.selected_variation,
          product_quantity: cartState[i]?.cartQuantity,
          product_regular_price: cartState[i]?.regular_price,
          product_sale_price: cartState[i]?.price,
          product_images: cartState[i]?.images,
        });
      }
      let orderTotal = calculateTotalPriceAfterCoupon(
        cartState,
        true,
        couponAmount,
        couponType
      );
      const response = await axios.post(
        `${baseUrl}/api/website/front/create/new/order/from/website`,
        {
          customer_name: data.firstName + " " + data.lastName,
          customer_email: data.contact,
          customer_phone_number: currentUser?.user?.phone_number,
          customer_id: currentUser?.user?.user_id,
          order_status: "pending",
          products: allCartProducts,
          order_total: orderTotal?.slice(1),
          shipping_address: data.streetAddress,
          state: data.state,
          pincode: data.zip,
        },
        {
          withCredentials: true,
        }
      );

      console.log("ORDER SUCCESS", response);

      // const auth = await axios.post(
      //   "https://apiv2.shiprocket.in/v1/external/auth/login",
      //   {
      //     email: "contact.dochomoeo@gmail.com",
      //     password: "Dochomoeo@123456",
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // console.log(auth);

      // localStorage.setItem("token", auth?.data?.token);

      // const authToken = localStorage.getItem("token");

      // console.log(authToken);

      // const newArray = response?.data?.result?.products?.map((item) => ({
      //   name: item.name,
      //   sku: item.code,
      //   units: item.cartQuantity,
      //   selling_price: item.price.toString(), // Convert price to string
      //   discount: "",
      //   tax: "",
      //   hsn: 441122,
      // }));

      // console.log(newArray);

      // const numericPrice = parseFloat(
      //   response?.data?.result?.total_amount.replace(/[^\d.]/g, "")
      // );

      // try {
      //   const shipping = await axios.post(
      //     "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      //     {
      //       order_id: response?.data?.result?.order_id,
      //       order_date: formatDate(response?.data?.result?.createdAt),
      //       billing_customer_name: response?.data?.result?.customer_name,
      //       billing_last_name: "",
      //       billing_address: response?.data?.result?.shipping_address,
      //       billing_city: data?.town,
      //       billing_pincode: response?.data?.result?.pincode,
      //       billing_state: response?.data?.result?.state,
      //       billing_country: "India",
      //       billing_email: response?.data?.result?.customer_email,
      //       billing_phone: response?.data?.result?.customer_phone_number,
      //       shipping_is_billing: true,
      //       order_items: newArray,
      //       payment_method: "prepaid",
      //       sub_total: numericPrice,
      //       length: 10,
      //       breadth: 15,
      //       height: 20,
      //       weight: 0.5,
      //     },
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${authToken}`,
      //       },
      //     }
      //   );
      //   console.log(shipping);
      //   if (shipping?.status !== parseInt(200)) {
      //     setLoading(false);
      //     console.log("orderid===========================",response?.data?.result?._id);
      //     await axios.delete(
      //       `${baseUrl}/api/website/front/order/${response?.data?.result?._id}`
      //     );

      //   }
      // } catch (error) {
      //   console.log(error);
      //   console.log("orderid===========================",response?.data?.result?._id);
      //   await axios.delete(`${baseUrl}/api/website/front/order/${response?.data?.result?._id}`);
      //   setLoading(false);
      //   return toast.error(error?.response?.data?.message);
      // }
      setLoading(false);
      dispatch(removeAllFromCart());
      toast.success("Your order has been placed");
      Router.push("/");
      return;
    } catch (error) {
      setLoading(false);
      return toast.error("An error occured");
    }
  };

  const onCouponSubmit = async (data) => {
    console.log(data.coupon);

    // if(!isAuthenticated) {
    //   return toast.error("Please login first!");
    // }
    try {
      const c = data.coupon.toUpperCase();
      setLoading(true);
      const total = calculateTotalPrice(cartState, false);
      const response = await axios.get(
        `${baseUrl}/api/website/front/coupon/title/${c}/${total}`
      );
      setLoading(false);
      if (response?.data?.message) {
        return toast.error(`coupon has expired`);
      }
      setCouponAmount(response?.data?.discountValue);
      setCoupon(response?.data?.title);
      setCouponType(response?.data?.discountType);
      return toast.success("Coupon applied successfully!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      return toast.error(error?.response?.data?.message);
    }
  };

  // useEffect(() => {
  //   onCouponSubmit();
  // },[cartState]);

  //payment by razorpay
  const router = useRouter();
  console.log("start", cartState);

  //razorpay details of key id and secret

  const [razorpayData, setRazorpayData] = useState([]);

  const razorpayKeyDetails = async () => {
    const app_id = "appid-7151-099964-7311";
    try {
      console.log("razorpay data-========>");
      const res = await axios.get(
        `${baseUrl}/api/admin/get/plugin/razorpay/detail_web/${app_id}`
      );
      setRazorpayData(res?.data?.plugin_details);
      console.log("razorpay key id", res?.data?.plugin_details?.razorpay_key_id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    razorpayKeyDetails();
  }, []);

  const createOrder = async () => {
    try {
      console.log('start=====> ');
      if (!currentUser) {
        return toast.warning("Please login and try again !");
      }
      const url = `${baseUrl}/api/make_product_order`;

      const res = await axios.post(
        url,
        {
          order_total: calculateTotalPriceAfterCoupon(
            cartState,
            true,
            couponAmount,
            couponType
          ),
          customer: currentUser,
          product: cartState,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        var options = {
          key: razorpayData?.razorpay_key_id, // Enter the Key ID generated from the Dashboard
          amount: res.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Acme Corp", //your business name
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: res.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: async function (response) {
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature);

            // console.log(handleClose, singleCourse);
            console.log(response);

            const url = `${baseUrl}/api/payment_done`;
            const res = await axios.post(url, {
              product: cartState,
              currentUser,
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_total: calculateTotalPriceAfterCoupon(
                cartState,
                true,
                couponAmount,
                couponType
              ),
            });

            console.log("payment order =============> ", res);

            if (res.data.success) {
              Swal.fire({
                position: "top-center",
                icon: "success",
                title: `Payment of ${calculateTotalPriceAfterCoupon(
                  cartState,
                  true,
                  couponAmount,
                  couponType
                )} is Successful`,
                text: "Your order has been placed.",
              });

              router.push("/");
            }
          },
          prefill: {
            //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            name: "Gaurav Kumar", //your customer's name
            email: "gaurav.kumar@example.com",
            contact: "9000090000", //Provide the customer's phone number for better conversion rates
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        console.log(window);
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.log(error);
      // if (error?.response?.status == 400) {
      //   Swal.fire({
      //     position: "top-center",
      //     icon: "warning",
      //     title: error?.response?.data?.message,
      //   });
      // }
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <LayoutOne title="Checkout">
      <Breadcrumb title="Checkout">
        <BreadcrumbItem name="Home" />
        <BreadcrumbItem name="Shop" />
        <BreadcrumbItem name="Checkout" current />
      </Breadcrumb>
      {loading ? (
        <Loading />
      ) : (
        <div className="checkout">
          <div className="container">
            <div className="row">
              <div className="col-12  col-lg-8">
                <form>
                  <div className="checkout__form">
                    <div className="checkout__form__contact">
                      <div className="checkout__form__contact__title">
                        <h5 className="checkout-title">Contact information</h5>
                        {!isAuthenticated && (
                          <Link href="/login">
                            <p
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              Please login to place your order!
                              <a
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                Login
                              </a>
                            </p>
                          </Link>
                        )}
                      </div>
                      <div className="input-validator">
                        <input
                          type="text"
                          name="contact"
                          ref={register({ required: true })}
                          placeholder="Email"
                        />
                        {errors.contact && (
                          <span className="input-error">
                            Please provide a name or email
                          </span>
                        )}
                      </div>
                      {/* <label className="checkbox-label" htmlFor="subcribe-news">
                      <input
                        type="checkbox"
                        id="subcribe-news"
                        name="subcribeNews"
                        ref={register}
                      />
                      Keep me up to dateon news and exclusive offers
                    </label> */}
                    </div>
                    <div className="checkout__form__shipping">
                      <h5 className="checkout-title">Shipping address</h5>
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <div className="input-validator">
                            <label>
                              First name <span>*</span>
                              <input
                                type="text"
                                name="firstName"
                                ref={register({ required: true })}
                              />
                            </label>
                            {errors.firstName && (
                              <span className="input-error">
                                Please provide your first name
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="input-validator">
                            <label>
                              Last name <span>*</span>
                              <input
                                type="text"
                                name="lastName"
                                ref={register({ required: true })}
                              />
                            </label>
                            {errors.lastName && (
                              <span className="input-error">
                                Please provide your last name
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-validator">
                            <label>
                              Country <span>*</span>
                              <input
                                type="text"
                                name="country"
                                ref={register({ required: true })}
                              />
                            </label>
                            {errors.country && (
                              <span className="input-error">
                                Please provide your country
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-validator">
                            <label>
                              Address <span>*</span>
                              <input
                                type="text"
                                name="streetAddress"
                                ref={register({ required: true })}
                                placeholder="Steet address"
                              />
                              {/* <input
                                type="text"
                                name="apartment"
                                ref={register({ required: true })}
                                placeholder="Apartment, suite, unite ect ( optinal )"
                              /> */}
                            </label>
                            {errors.streetAddress || errors.apartment ? (
                              <span className="input-error">
                                Please provide your address
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-validator">
                            <label>
                              Town/City <span>*</span>
                              <input
                                type="text"
                                name="town"
                                ref={register({ required: true })}
                              />
                            </label>
                            {errors.town && (
                              <span className="input-error">
                                Please provide your town/city
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-validator">
                            <label>
                              Country/State <span>*</span>
                              <input
                                type="text"
                                name="state"
                                ref={register({ required: true })}
                              />
                            </label>
                            {errors.state && (
                              <span className="input-error">
                                Please provide your country/State
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-validator">
                            <label>
                              Postcode/ZIP <span>*</span>
                              <input
                                type="text"
                                name="zip"
                                ref={register({ required: true })}
                              />
                            </label>
                            {errors.zip && (
                              <span className="input-error">
                                Please provide your postcode/ZIP
                              </span>
                            )}
                          </div>
                        </div>
                        {/* <div className="col-12">
                          <div className="input-validator">
                            <label>
                              Order note
                              <input
                                type="text"
                                name="note"
                                placeholder="Note about your order, e.g, special noe for delivery"
                                ref={register()}
                              />
                            </label>
                          </div>
                        </div> */}
                        <div className="col-12">
                          <img
                            style={{
                              width: "100%",
                              height: "100%",
                              marginRight: "5px",
                            }}
                            src={
                              process.env.PUBLIC_URL + "/assets/images/ch.jpeg"
                            }
                          />
                        </div>
                      </div>
                      {/* <label className="checkbox-label" htmlFor="save">
                      <input
                        type="checkbox"
                        id="save"
                        name="saveInfo"
                        ref={register()}
                      />
                      Save this infomation for next time
                    </label> */}
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-12 col-lg-4">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-12 ml-auto">
                    <div className="checkout__total">
                      <h5 className="checkout-title">Your order</h5>
                      {/* <form
                        className="checkout__total__coupon"
                        onSubmit={couponHandleSubmit(onCouponSubmit)}
                      >
                        <h5>Coupon Code</h5>
                        <div className="input-validator">
                          <input
                            type="text"
                            placeholder="Your code here"
                            name="coupon"
                            ref={couponRegister({ required: true })}
                            style={{
                              textTransform: "uppercase",
                            }}
                          />
                          {couponErrors.coupon && (
                            <span className="input-error">
                              Please provide a coupon code
                            </span>
                          )}
                        </div>
                        <button type="submit" className="btn -dark">
                          Apply
                        </button>
                      </form>
                      <button
                        onClick={() => {
                          setShow(!show);
                        }}
                        className="btn -dark"
                      >
                        Coupons available
                      </button>
                      <div
                        style={{
                          marginBottom: "10px",
                        }}
                      ></div> */}
                      <div className="checkout__total__price">
                        <h5>Product</h5>
                        <table>
                          <colgroup>
                            <col style={{ width: "70%" }} />
                            <col style={{ width: "30%" }} />
                          </colgroup>
                          <tbody>
                            {cartState.map((item) => (
                              <tr key={item.cartId}>
                                <td>
                                  <span>
                                    {formatSingleNumber(item.cartQuantity)}
                                  </span>{" "}
                                  x {item.name}
                                  <div
                                    style={{ display: "flex", paddingTop: 2 }}
                                  >
                                    {item?.selected_variation &&
                                      item?.selected_variation[0] && (
                                        <h5
                                          style={{
                                            fontSize: 12,
                                            fontWeight: "500",
                                          }}
                                        >
                                          {item?.selected_variation[0]}
                                        </h5>
                                      )}
                                    {item?.selected_variation &&
                                      item?.selected_variation[1] && (
                                        <h5
                                          style={{
                                            paddingLeft: 6,
                                            fontSize: 12,
                                            fontWeight: "500",
                                          }}
                                        >
                                          {item?.selected_variation[1]}
                                        </h5>
                                      )}
                                  </div>
                                </td>
                                <td>
                                  <h3 className="product-price--main">
                                    <h3
                                      style={{
                                        marginBottom: 10,
                                      }}
                                      className="product-price--discount"
                                    >
                                      {formatCurrency(item.regular_price)}
                                    </h3>
                                    {formatCurrency(item.price)}
                                  </h3>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="checkout__total__price__total-count">
                          <table>
                            <tbody>
                              {coupon !== "" && couponAmount > 0 && (
                                <tr>
                                  <td>Coupon Applied : </td>
                                  <td
                                    style={{
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {" "}
                                    {coupon}{" "}
                                  </td>
                                </tr>
                              )}
                              <tr>
                                <td>Subtotal</td>
                                <td>
                                  {calculateSubTotalPrice(cartState, true)}
                                </td>
                              </tr>
                              <tr>
                                <td>Discount</td>
                                <td>
                                  {" "}
                                  - {calculateDiscountPrice(
                                    cartState,
                                    true
                                  )}{" "}
                                </td>
                              </tr>
                              {couponAmount > 0 && (
                                <tr>
                                  <td>Coupon Discount</td>
                                  <td>
                                    {" "}
                                    -{" "}
                                    {calculateDiscountPriceAfterCoupon(
                                      cartState,
                                      true,
                                      couponAmount,
                                      couponType
                                    )}{" "}
                                  </td>
                                </tr>
                              )}
                              <tr>
                                <td>Total</td>
                                <td>
                                  {calculateTotalPriceAfterCoupon(
                                    cartState,
                                    true,
                                    couponAmount,
                                    couponType
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="checkout__total__price__payment">
                          <label className="checkbox-label" htmlFor="payment">
                            Payment Mode : COD
                          </label>
                        </div>
                      </div>
                      {!isAuthenticated ? (
                        <>
                          <Link href="/login">
                            <button className="btn -red">Login</button>
                          </Link>
                        </>
                      ) : (
                        <>
                          {/* <button
                            className="btn -red"
                            onClick={() => {
                              handleSubmit(onSubmit)
                              // createOrder()
                            }}
                          >
                            Place order
                          </button> */}

                          <div>
                            <input
                              type="radio"
                              id="payNowOption"
                              name="paymentOption"
                              style={{ marginTop: "10px" }}
                              // className="btn -red"
                              onChange={() => {
                                handleSubmit(onSubmit);
                                // createOrder();
                                setShowPayNowButton(false);
                              }}
                            />
                            <label
                              htmlFor="payNowOption"
                              style={{ marginLeft: "10px" }}
                            >
                              Cash on delivery
                            </label>
                          </div>

                          {/* <button
                            style={{ marginTop: "10px" }}
                            className="btn -red"
                            onClick={() => {
                              handleSubmit(onSubmit)
                              createOrder()
                            }}
                          >
                            Pay Now{" "}
                            {
                              <span>
                                {calculateTotalPriceAfterCoupon(
                                  cartState,
                                  true,
                                  couponAmount,
                                  couponType
                                )}
                              </span>
                            }
                          </button> */}

                          {/* <div>
                            <input
                              type="radio"
                              id="payNowOption"
                              name="paymentOption"
                              style={{ marginTop: "10px" }}
                              onChange={() => {
                                handleSubmit(onSubmit);
                                createOrder();
                              }}
                            />
                            <label htmlFor="payNowOption" style={{ marginLeft: "10px"}}>
                              Online Payment
                            </label>
                          </div> */}

                          <div>
                            <div>
                              <input
                                type="radio"
                                id="payNowOption"
                                name="paymentOption"
                                style={{ marginTop: "10px" }}
                                onChange={() => {
                                  handleSubmit(onSubmit);
                                  // createOrder();
                                  setShowPayNowButton(true);
                                }}
                              />
                              <label
                                htmlFor="payNowOption"
                                style={{ marginLeft: "10px" }}
                              >
                                Online Payment
                              </label>
                            </div>

                            {showPayNowButton && (
                              <button
                                style={{ marginTop: "10px" }}
                                className="btn -red"
                                onClick={() => {
                                  handleSubmit(onSubmit);
                                  createOrder();
                                }}
                              >
                                Pay Now{" "}
                                <span>
                                  {calculateTotalPriceAfterCoupon(
                                    cartState,
                                    true,
                                    couponAmount,
                                    couponType
                                  )}
                                </span>
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AllCoupons show={show} setShow={setShow} />
        </div>
      )}
      {/* <InstagramTwo /> */}
    </LayoutOne>
  );
}

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 50vh;
  width: 30vw;
  padding: 20px;
  background-color: white;
  //box-shadow: -2px 3px 22px 8px rgba(201, 201, 201, 1);
  color: black;
  z-index: 10;
  display: flex;
  flex-direction: column;
  //align-items: center;
  // justify-content: center;

  @media (max-width: 576px) {
    width: 80%;
  }
`;

function AllCoupons({ show, setShow }) {
  const [data, setData] = useState([]);

  async function getCoupons() {
    try {
      const res = await axios.get(`${baseUrl}/api/website/front/coupon/to`);
      // console.log(res);
      setData(res?.data?.coupons);
    } catch (error) {
      //  console.log(error);
    }
  }

  const copyToClipboard = (title) => {
    const el = document.createElement("textarea");
    el.value = title;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return toast.success("Coupon Code copied");
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      // Click outside the component, close it
      setShow(!show);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  console.log(data);

  if (show) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          zIndex: 10,
        }}
        onClick={handleBackdropClick} // Call setShow(false) on click outside the component
      >
        <Modal>
          {data.map((item) => (
            <div
              key={item.id} // Add a unique key for each item
              style={{
                marginBottom: "10px",
                boxShadow: "-2px 3px 22px 8px rgba(201, 201, 201, 1)",
                width: "100%",
                padding: 10,
                cursor: "pointer",
              }}
              onClick={() => copyToClipboard(item.title)}
            >
              <div
                style={{
                  color: "black",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {item?.title}
              </div>
              <div style={{}}>{item?.description.toLowerCase()}</div>
            </div>
          ))}
        </Modal>
      </div>
    );
  } else {
    return <></>;
  }
}
