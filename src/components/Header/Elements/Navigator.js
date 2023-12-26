import Link from "next/link";
import classNames from "classnames";

import menuData from "../../../data/header/navigation.json";
import { app_download_link } from "../../../../config";


const menuDataForHeader=
[
  {"title": "Home","to": "/"},
  { "title": "Shop", "to": "/shop/products" },
  { "title": "About", "to": "/about" },
 


]

export default function Navigator({ disableSubmenu, className }) {
  function renderMenu() {
    return menuDataForHeader.slice(0,5).map((item, index) => {
      return (
        <li key={index}>
          <Link href={process.env.PUBLIC_URL + item.to}>
            <a>{item.title}</a>
          </Link>
        </li>
      );
    });
  }
  // if (disableSubmenu) {
  //   return (
  //     <div className={`navigator -off-submenu ${classNames(className)}`}>
  //       <ul>
  //         {menuDataForHeader.map((item, index) => (
  //           <li key={index}>
  //             <Link href={process.env.PUBLIC_URL + item.to}>
  //               <a>{item.title}</a>
  //             </Link>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // }
  return (
    <div className={`navigator ${classNames(className)}`}>
      <ul>{renderMenu()}
      <li >
            <a  href="/privacyPolicy" target="_blank" >Privacy Policy</a>
        </li>
      <li >
            <a  href='/terms' target="_blank" >Terms & Conditions</a>
        </li>
      <li >
            <a  href={app_download_link} target="_blank" >Download App</a>
        </li>
      </ul>
    </div>
  );
}
