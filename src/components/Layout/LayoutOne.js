import React from "react";
import Head from "next/head";

import FooterOne from "../Footer/FooterOne";
import withScrollFixed from "../../common/withScrollFixed";
import HeaderOne from "../Header/HeaderOne";
import { web_title } from "../../../config";

let ScrollFixedHeader = withScrollFixed(HeaderOne);

export default function LayoutOne(props) {
  return (
    <>
      <Head>
        <title>{web_title}</title>
      </Head>
      <ScrollFixedHeader container={props.container} />
      {props.children}
      <FooterOne />

      
    </>
  );
}
