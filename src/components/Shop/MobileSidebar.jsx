import React, { useState } from "react";
import {
  setFilterCategory,
  setFilterBrand,
  setFilterPriceRange,
  resetFilter,
} from "../../redux/actions/shopActions";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export const MobileSidebar = ({ categoriesData }) => {
  const [isOptionMenuActive, setOptionMenuActive] = useState(false);

  const toggleOptionMenu = () => {
    setOptionMenuActive(!isOptionMenuActive);
  };

  const dispatch = useDispatch();
  const filterData = useSelector((state) => state.shopReducers.filter);
  useEffect(() => {
    dispatch(resetFilter());
  }, []);

  return (
    <div className={`select-menu ${isOptionMenuActive ? "active" : ""}`}>
      <div onClick={toggleOptionMenu} className="select-btn">
        <span className="sBtn-text">Filter by Categories</span>
        <i className="fa fa-angle-down"></i>
      </div>
      <ul className="options">
        <li className="option">
          <button
            style={{ background: "none", border: "none" }}
            onClick={(e) => {
              e.preventDefault();
              dispatch(resetFilter());
            }}
          >
            <span className="option-text">All</span>
          </button>
        </li>
        {categoriesData.map((it, index) => (
              <li className="option" key={index}>
                <button
                  style={{ background: "none", border: "none" }}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setFilterCategory(it.main_category_name));
                  }}
                >
                  <span className="option-text" >{it.main_category_name}</span>
                </button>
              </li>
            ))}
      </ul>
    </div>
  );
};
