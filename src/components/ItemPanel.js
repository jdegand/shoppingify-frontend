import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import leftArrow from "../arrow-left-thin.svg";

const ItemPanel = (props) => {
  const [item, setItem] = useState({});

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const getItem = async () => {
      try {
        const response = await axiosPrivate.get(
          `/items/details?${searchParams}`
        );

        setItem(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getItem();
  }, [searchParams]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBackBtn();
    }
  };

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBackBtn = () => {
    props.setShowItemDetail(false);
    goToTop();
  };

  const handleAddList = () => {
    props.setList((prev) => [
      ...prev,
      {
        ...item,
        itemId: searchParams.get("item"),
        quantity: 1,
        editing: false,
        purchased: false,
        categoryName: item.category.categoryName,
      },
    ]); // need to check all properties
    handleBackBtn();
  };

  return (
    <div className="item__panel__container">
      <Link
        to="/"
        onClick={handleBackBtn}
        onKeyDown={handleKeyDown}
        className="flex align-center fs-28"
      >
        <img className="item__panel__back__arrow" src={leftArrow} alt="Items" />{" "}
        Back
      </Link>
      {item && (
        <div>
          <div>
            <img src={item.picture} alt="" />
          </div>
          <div>
            <dl>
              <dt className="gray-text">name</dt>
              <dd>{item.itemName}</dd>
              <dt className="gray-text">category</dt>
              <dd>{item.category?.categoryName}</dd>
              {item.note?.length > 0 && (
                <>
                  <dt className="gray-text">note</dt>
                  <dd className="item__panel__note">{item.note}</dd>
                </>
              )}
            </dl>
          </div>
          <div className="flex align-center space-between">
            <Link to="/" className="fs-20" onClick={handleBackBtn}>
              cancel
            </Link>
            <button onClick={handleAddList}>Add to list</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemPanel;
