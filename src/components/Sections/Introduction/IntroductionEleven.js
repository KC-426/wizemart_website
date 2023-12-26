import axios from "axios";
import { baseUrl } from "../../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function TermsAndConditions() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const url = `${baseUrl}/api/admin/get/about/app`;
      const response = await axios.get(url, { withCredentials: true });
      setData(response.data.details);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      {/* <div className="phone_main_header">
        <div className="phone_number">
          <label>Phone Number</label>
          <div className="bordered-data phone_number">{data?.phone_number}</div>
        </div>

        <div className="app_link">
          <label>Share App Link</label>
          <div className="bordered-data app_link">{data?.app_link}</div>
        </div>
      </div> */}

      {/* <div className="about_us_data">
        <label>About Us</label>
        <div className="bordered-data about_us">{data?.aboutus}</div>
      </div> */}

      <div className="terms_n_conditions">
        <h2>About Us</h2>
        <div className="bordered-data terms_and_conditions">{data?.aboutus}</div>
      </div>

      {/* <div className="Privacy_policy">
        <label>Privacy Policy</label>
        <div className="bordered-data privacy_policy">{data?.privacy_policy}</div>
      </div> */}
    </div>
  );
}
