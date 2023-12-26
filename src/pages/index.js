import LayoutOne from "../components/Layout/LayoutOne";
import SliderTwo from "../components/Sections/Slider/SliderTwo";
import { SlideThree } from "../components/Sections/Slider/slideThree";
import sliderData from "../data/slider/sliderOne.json";
import IntroductionOne from "../components/Sections/Introduction/IntroductionOne";
import introductionOneData from "../data/introduction/introductionOne.json";
import IntroductionTwo from "../components/Sections/Introduction/IntroductionTwo";
import introductionTwoData from "../data/introduction/introductionTwo.json";
import ProductSlideOne from "../components/Sections/ProductThumb/ProductSlide/ProductSlideOne";
import productSlideOneData from "../data/products.json";
import TestimonialOne from "../components/Sections/Testimonial/TestimonialOne";
import testimonialOneData from "../data/testimonial/data.json";
import TeamOne from "../components/Sections/Team/TeamOne";
import teamOneData from "../data/team/teamOne.json";
import CTAOne from "../components/Sections/CallToAction/CTAOne";
import { useState } from "react";
import { baseUrl } from "../../config";
import axios from "axios";
import ShopProducts from "../components/Shop/ShopProducts";
import BrandsTwo from "../components/Sections/Brands/BrandsTwo";
import ProductCategories from "../components/Sections/ProductCategories/ProductCategories";
import CategoriesTwo from "../components/Sections/Categories/CategoriesTwo";
import MenuFive from "../components/Header/Menu/MenuFive";
import DoctorSection from "../components/Doctor/DoctorSection";

export default function homepage1() {
  console.log(sliderData);

  const [data, setData] = useState([]);
  const [mobile, setMobile] = useState([]);
  const [product, setProduct] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cat, setCat] = useState([]);


  const fetchBrands = async () => {
    try {
      const url = `${baseUrl}/api/website/front/get/all/categories`;
      const res = await axios.get(url, { withCredentials: true });
      console.log("categories ---> ", res?.data);
      const uniqueCategories = {};

      const uniqueData = res?.data?.filter((item) => {
        if (!uniqueCategories[item.main_category_name]) {
          uniqueCategories[item.main_category_name] = true;
          return true;
        }
        return false;
      });
      setCategories(res?.data);
      setCat(uniqueData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const url = `${baseUrl}/api/website/front/get/all/banners`;

      const res = await axios.get(url, { withCredentials: true });
      setData(res.data);

      const mobileurl = `${baseUrl}/api/website/front/mobile/get/all/banners`;

      const resmobile = await axios.get(mobileurl, { withCredentials: true });
      setMobile(resmobile.data);

      const url_pro = `${baseUrl}/api/website/front/gethome`;
      const res_pro = await axios.get(url_pro, { withCredentials: true });
      console.log("res_pro.datares_pro.data===>",res_pro.data)
      setProduct(res_pro.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useState(() => {
    fetchBrands();
    fetchData();

  }, []);
  console.log(data);

//=========== PLEASE REMOVE IN DEVELOPMENT ==============
// console.log=()=>{}
//=========== PLEASE REMOVE IN DEVELOPMENT ==============



  return (
    <>
      <LayoutOne title="Dochomoeo" data={sliderData} className="-style-1">
        <MenuFive data={categories} />
        {/* <ProductCategories data={brandsData}/> */}
        {/* <CategoriesTwo data={brandsData}/> */}
        <SliderTwo data={data} className="-style-1" showDots />
        <SlideThree data={mobile} />
        {/* <IntroductionOne data={introductionOneData} /> */}
        {/* <IntroductionTwo data={introductionTwoData} /> */}
        {/* <ProductSlideOne data={productSlideOneData} /> */}
        {/* <BrandsTwo
          mainHeading={"Our Brands"}
          description={"The Brands you can count upon"}
          data={brandsData}
        /> */}
        <BrandsTwo
          mainHeading={"Categories"}
          description={
            "Explore wide range of products from various categories."
          }
          data={cat}
        />
        {/* <div className="container"> */}
        <ShopProducts
          // gridColClass="col-12 col-sm-6 col-md-4 col-lg-3"
          // listColClass="col-12 col-lg-6"
          // view={"grid"}
          brandsData={categories}
          data={product}
        />
        {/* <div className="container">
             <div className="three">
                <h1>Our Doctorss</h1>
             </div>
        </div> */}
        {/* <DoctorSection data={doctorsData} /> */}
        {/* </div> */}
        {/* <TestimonialOne data={testimonialOneData} /> */}
        {/* <TeamOne data={teamOneData} />  */}
        {/* <CTAOne /> */}
      </LayoutOne>
    </>
  );
}
