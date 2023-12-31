import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useForm } from "react-hook-form";
import Review from "../../Control/Review";
import { useState,useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { baseUrl } from "../../../../config";
import { useSelector } from "react-redux";
import parse from 'html-react-parser';

export default function ProductDetailInfoTab({ original, data }) {
  const { register, handleSubmit, errors, reset } = useForm();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [desc, setDesc] = useState("");
  const isAuthenticated = useSelector(
    (state) => state.userReducer.isAuthenticated
  );
  const router = useRouter();
  const { slug } = router.query;
  const [show, setShow] = useState(false);
  const [reviewid,setReviewid] = useState('');

  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Add a useEffect hook to watch for changes in the reviewSubmitted state
  useEffect(() => {
    // You can perform any actions here that you want to happen
    // when a review is submitted successfully, such as fetching
    // updated data or refreshing the component's content.
    // For example, you can fetch updated reviews.

    // In this example, I'm just logging a message to the console.
    if (reviewSubmitted) {
      console.log("Review submitted successfully. Triggering a re-render.");
    }
  }, [reviewSubmitted]);


  // Function to toggle show/hide full description
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncatedDescription = showFullDescription
    ? data?.description // Show full description if showFullDescription is true
    : data?.description?.slice(0, 200); // Show the first 200 characters if showFullDescription is false

    const onEditReview = async (formData) => {
      const { desc } = formData;
  
      try {
        const response = await axios.put(
          `${baseUrl}/api/website/front/product/edit-review`, // Update with your API endpoint
          { desc: desc,
            productId: slug, 
            reviewId: reviewid,
           }, // Send review data to the server
          {
            withCredentials: true,
          }
        );
  
        // Handle a successful review submission here, e.g., show a success message or refresh the review section
        console.log(response.data.message);
        setReviewSubmitted(!reviewSubmitted);
        toast.success(response.data.message);
        window.location.reload();
        // Reset the form after submission
        reset();
      } catch (error) {
        // Handle errors, e.g., display an error message to the user
        console.error("Error submitting review:", error);
        toast.error(error);
      }
    };

  const onSubmitReview = async (formData) => {
    const { message } = formData;

    try {
      const response = await axios.post(
        `${baseUrl}/api/website/front/product/add-review/${slug}`, // Update with your API endpoint
        { desc: message }, // Send review data to the server
        {
          withCredentials: true,
        }
        
      );

      // Handle a successful review submission here, e.g., show a success message or refresh the review section
      console.log(response.data.message);
      setReviewSubmitted(!reviewSubmitted);
      toast.success(response.data.message);
      window.location.reload();
      // Reset the form after submission
      reset();
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error("Error submitting review:", error);
      toast.error(error);
    }
  };

  return (
    <div className="product-detail__tab">
      <Tabs className="product-detail__tab__content">
        <TabList className="tab__content__header">
          <Tab>Description</Tab>
          {/* <Tab>Shipping & Returns</Tab> */}
          {/* <Tab>Reviews</Tab> */}
        </TabList>

        <TabPanel className="tab__content__item -description">
          <p>
           <div>
           {parse(truncatedDescription)}
           </div>
            {/* Show "show more" link if the description is longer than 200 characters */}
            {data?.description?.length > 200 && (
              <button
                style={{
                  border: "none",
                  background: "none",
                  color: "green",
                }}
                onClick={toggleDescription}
              >
                {showFullDescription ? "Show Less" : "Show More"}
              </button>
            )}
            </p>
        </TabPanel>

        {/* <TabPanel className="tab__content__item -review">
          {original?.review?.map((item) => {
            return (
              <>
                <Review
                  name={item?.username}
                  publicDate={item?.createdAt}
                  productID={slug}
                  id={item?._id}
                  user={item?.userID}
                  show={show}
                  setShow={setShow}
                  desc={desc}
                  setDesc={setDesc}
                  reviewid={reviewid}
                  setReviewid={setReviewid}
                >
                  {item?.desc}
                </Review>
              </>
            );
          })}
          {!isAuthenticated ? (
            <>
              <span
                style={{
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                To review a product please login...
              </span>
            </>
          ) : (
            <>
              {show ? (
                <>
                  <form onSubmit={handleSubmit(onEditReview)}>
                    <h5>Edit your review</h5>
                    <div className="col-12">
                      <div className="input-validator">
                        <textarea
                          name="desc"
                          placeholder="description"
                          rows="5"
                          value={desc || ""}
                          onChange={(e) => {
                            setDesc(e.target.value);
                          } }
                          required
                          ref={register({
                            required: "Review message is required",
                          })}
                        />
                      </div>
                      {errors.message && (
                        <span className="input-error">
                          {errors.message.message}
                        </span>
                      )}
                    </div>
                    <div className="col-12">
                      <button className="btn -dark" type="submit">
                        submit 
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <form onSubmit={handleSubmit(onSubmitReview)}>
                  <h5>write a review</h5>
                  <div className="col-12">
                    <div className="input-validator">
                      <textarea
                        name="message"
                        placeholder="Message"
                        rows="5"
                        required
                        ref={register({
                          required: "Review message is required",
                        })}
                      />
                    </div>
                    {errors.message && (
                      <span className="input-error">
                        {errors.message.message}
                      </span>
                    )}
                  </div>
                  <div className="col-12">
                    <button className="btn -dark" type="submit">
                      Write a review
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </TabPanel> */}
      </Tabs>
    </div>
  );
}

{
  /* <TabPanel className="tab__content__item -ship">
          <h5>
            <span>Ship to </span>New York
          </h5>
          <ul>
            <li>
              Standard Shipping on order over 0kg - 5kg. <span>+10.00</span>
            </li>
            <li>
              Heavy Goods Shipping on oder over 5kg-10kg . <span>+20.00</span>
            </li>
          </ul>
          <h5>Delivery & returns</h5>
          <p>
            We diliver to over 100 countries around the word. For full details
            of the delivery options we offer, please view our Delivery
            information.
          </p>
        </TabPanel> */
}
