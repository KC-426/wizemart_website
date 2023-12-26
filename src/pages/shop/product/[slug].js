import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import products from "../../../data/products.json";
import { getProductBySlug } from "../../../common/productSelect";
import ProductDetail from "../../../components/ProductDetail/ProductDetail";
import InstagramTwo from "../../../components/Sections/Instagram/InstagramTwo";
import LayoutFour from "../../../components/Layout/LayoutOne";
import { baseUrl } from "../../../../config.js";
import axios from "axios";
import {
  Breadcrumb,
  BreadcrumbItem,
} from "../../../components/Other/Breadcrumb";
import ProductSlideTwo from "../../../components/Sections/ProductThumb/ProductSlide/ProductSlideTwo";
import Loading from "../../../components/Other/Loading";
import { toast } from "react-toastify";

export default function () {
  const router = useRouter();
  const { slug } = router.query;
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(slug);
  const [foundProduct, setFoundProduct] = useState({
    productID: "",
    id: "",
    category: "",
    name: "",
    rate: 0,
    price: 0,
    new: true,
    brand: "",
    code: "",
    point: 0,
    quantity: 0,
    variation: [],
    thumbImage: [],
    images: [],
    description: "",
    slug: "",
  });
  const [originalData, setOriginalData] = useState();
  const [ productColor , setProductColor ] = useState();
  const [ productVariant1 , setProductVariant1 ] = useState('');
  const [ productVariant2 , setProductVariant2 ] = useState('');


  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `${baseUrl}/api/website/front/get/single/product/${slug}`;

      const res = await axios.get(url, { withCredentials: true });
      setOriginalData(res?.data);
      console.log("SINGLE PROUDUCT=>",res?.data);
      setFoundProduct({
        productID: res?.data._id,
        id: res?.data.product_id,
        category: res?.data.product_main_category,
        name: res?.data.product_name,
        rate: 4,
        regular_price: res?.data.product_regular_price,
        price: res?.data.product_sale_price,
        new: res?.data.new_arrival,
        brand: res?.data?.product_brand,
        code: res?.data.product_code,
        point: 0,
        quantity: res?.data?.quantity,
        is_variant_true: res?.data?.is_variant_true,
        variant_option: res?.data?.variant_option,
        available_variants: res?.data?.available_variants,
        thumbImage: res?.data.product_images,
        images: res?.data.product_images,
        description: res?.data.product_description,
        slug: res?.data.product_slug,

      });

      // if one variant is true
      if(res?.data?.is_variant_true && res?.data?.variant_option?.length == 1){
        setFoundProduct({
          productID: res?.data._id,
          id: res?.data.product_id,
          category: res?.data.product_main_category,
          name: res?.data.product_name,
          rate: 4,
          regular_price: res?.data.product_regular_price,
          price: res?.data.product_sale_price,
          new: res?.data.new_arrival,
          brand: res?.data?.product_brand,
          code: res?.data.product_code,
          point: 0,
          quantity: res?.data?.quantity,
          is_variant_true: res?.data?.is_variant_true,
          variant_option: res?.data?.variant_option,
          available_variants: res?.data?.available_variants,
          thumbImage: res?.data.product_images,
          images: res?.data.product_images,
          description: res?.data.product_description,
          slug: res?.data.product_slug,
          selected_variation:[res?.data?.variant_option[0]?.option_values[0]]
        });
      }

      // if two variant is true

      if(res?.data?.is_variant_true && res?.data?.variant_option?.length == 2){
        setFoundProduct({
          productID: res?.data._id,
          id: res?.data.product_id,
          category: res?.data.product_main_category,
          name: res?.data.product_name,
          rate: 4,
          regular_price: res?.data.product_regular_price,
          price: res?.data.product_sale_price,
          new: res?.data.new_arrival,
          brand: res?.data?.product_brand,
          code: res?.data.product_code,
          point: 0,
          quantity: res?.data?.quantity,
          is_variant_true: res?.data?.is_variant_true,
          variant_option: res?.data?.variant_option,
          available_variants: res?.data?.available_variants,
          thumbImage: res?.data.product_images,
          images: res?.data.product_images,
          description: res?.data.product_description,
          slug: res?.data.product_slug,
          selected_variation:[res?.data?.variant_option[0]?.option_values[0],res?.data?.variant_option[1]?.option_values[0]]
        });
      }

      if(res?.data?.is_variant_true && res?.data?.variant_option?.length == 1){
        if(res?.data?.variant_option[0]?.option_name == 'color picker'){
          setProductColor(res?.data?.variant_option[0]?.option_values[0])
        }
        setProductVariant1(res?.data?.variant_option[0]?.option_values[0])

      }
      if(res?.data?.is_variant_true && res?.data?.variant_option?.length == 2){
        if(res?.data?.variant_option[0]?.option_name == 'color picker'){
          setProductColor(res?.data?.variant_option[0]?.option_values[0])
        }
        if(res?.data?.variant_option[1]?.option_name == 'color picker'){
          setProductColor(res?.data?.variant_option[1]?.option_values[0])
        }
        setProductVariant1(res?.data?.variant_option[0]?.option_values[0])
        setProductVariant2(res?.data?.variant_option[1]?.option_values[0])

      }



      await fetchrec();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };


// ON CHANGE PRODUCT VARIANTS  
useEffect(()=>{
  changePriceOfVariant()
 },[productColor,productVariant1,productVariant2])

 const changePriceOfVariant=()=>{
  let newData = foundProduct
  // console.log("ENTERED--->")
  // let variantsCombination = [productVariant1,productVariant2]
  let variantsCombination ;
  if(newData?.variant_option?.length == 1){
    if(newData?.variant_option[0]?.option_name == 'color picker'){
      variantsCombination = [productColor]
    }
    variantsCombination = [productVariant1]

  }
  if(newData?.variant_option?.length == 2){
    // console.log("LENGTH -2")
    if(newData?.variant_option[0]?.option_name == 'color picker'){
      // console.log("?.variant_option[0]?.option_name -")
      variantsCombination = [productColor,productVariant2]
    }
    if(newData?.variant_option[1]?.option_name == 'color picker'){
      // console.log("?.variant_option[1]?.option_name -")
      variantsCombination = [productVariant1,productColor]
    }
    if(newData?.variant_option[0]?.option_name != 'color picker' && newData?.variant_option[1]?.option_name != 'color picker'){
      variantsCombination = [productVariant1,productVariant2]
    }
    
  }
  // console.log("variantsCombination==>",variantsCombination)
  newData?.available_variants?.map((ele,index)=>{
    // console.log("ele",ele)
    if(JSON.stringify(ele?.attributes) === JSON.stringify(variantsCombination)){
      // console.log("MATCH FOUND--->",ele?.product_regular_price,  ele?.product_sale_price)
      setFoundProduct(prev=>({...prev,regular_price:ele?.product_regular_price,
        price:ele?.product_sale_price,
        selected_variation:variantsCombination
      }))
    }

  })
 }



// HANDLE PRODUCT VARIANT FUNC
const selectedProductVariantColorFunc=(value)=>{
  setProductColor(value)
  // setRender(prev=>!prev)
 }
 const selectedProductVariant1Func=(value)=>{
  setProductVariant1(value)
  // setRender(prev=>!prev)


 }
 const selectedProductVariant2Func=(value)=>{
  setProductVariant2(value)
  // setRender(prev=>!prev)
 
 }
// HANDLE PRODUCT VARIANT FUNC




  async function fetchrec() {
    try {
      const url = `${baseUrl}/api/website/front/related_products`;
      console.log(foundProduct?.category);
      const res = await axios.post(
        url,
        {
          id: slug,
        },
        { withCredentials: true }
      );
      setSimilar(res.data?.allProducts);
    } catch (error) {
      console.log(error);
    }
  }

  useState(() => {
    fetchData();
    // fetchrec();
  }, []);

  useEffect(() => {
    fetchData();
    // fetchrec();
  }, [slug]);
  // let foundProduct = getProductBySlug(products, slug);
  console.log(foundProduct);
  const onReviewSubmit = (data) => {
    console.log(data);
  };
  return (
    <>
      {loading ? (
        <>
          {" "}
          <Loading />{" "}
        </>
      ) : (
        <LayoutFour title={foundProduct.name}>
          <Breadcrumb title="Product Detail">
            <BreadcrumbItem name="Home" />
            <BreadcrumbItem name="Shop" />
            <BreadcrumbItem name={foundProduct.name} current />
          </Breadcrumb>
          <ProductDetail
            original={originalData}
            data={foundProduct}
            productColor={productColor}
            productVariant1={productVariant1}
            productVariant2={productVariant2}
            selectedProductVariantColorFunc={selectedProductVariantColorFunc}
            selectedProductVariant1Func={selectedProductVariant1Func}
            selectedProductVariant2Func={selectedProductVariant2Func}
            onReviewSubmit={onReviewSubmit}
          />
          <ProductSlideTwo data={similar} />
          {/* <InstagramTwo /> */}
        </LayoutFour>
      )}
    </>
  );
}
