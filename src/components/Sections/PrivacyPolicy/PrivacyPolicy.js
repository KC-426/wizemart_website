import axios from "axios";
import { baseUrl } from "../../../../config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactHtmlParser from "react-html-parser";


export default function PrivacyPolicy() {
  const [data, setData] = useState([]);
  const router = useRouter();

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
      <div className="Privacy_policy">
        <h2>Privacy Policy</h2>
        <div className="bordered-data privacy_policy">{ReactHtmlParser(data?.privacy_policy)}</div>
      </div>
    </div>
  );
}
