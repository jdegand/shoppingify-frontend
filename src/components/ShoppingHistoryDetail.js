import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import chevronLeft from "../chevron-left.svg";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import calendar from "../calendar-text.svg";

const ShoppingHistoryDetail = (props) => {
  const { auth } = useAuth();

  const [searchParams] = useSearchParams();

  const [list, setList] = useState({});
  const [formattedData, setFormattedData] = useState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await axios.get(`/lists/${searchParams.get("list")}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
            withCredentials: true,
          },
        });

        await setList(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getList();
  }, [auth.accessToken, searchParams]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      props.setTabToHistory();
    }
  };

  useEffect(() => {
    if (list.items === undefined) return;

    const array = groupBy(list.items, (list) => list.categoryName);

    setFormattedData(Array.from(array));
  }, [list]);

  useEffect(() => {
    if (formattedData) {
      setReady((prev) => !prev);
    }
  }, [formattedData]);

  function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  const date = new Date(list.updatedAt);

  const daysOfWeek = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"];

  const day = date.getDay();

  return (
    <div className="shopping__history__detail__container">
      <div className="flex align-center mbe-50">
        <img
          tabIndex={0}
          className="shopping__history__icon"
          src={chevronLeft}
          alt="History"
          onClick={props.handleTab}
          onKeyDown={handleKeyDown}
        />
        <span>Back</span>
      </div>
      {ready ? (
        <section className="shopping__history__overflow">
          <h1>{list.listName}</h1>
          <div className="flex align-center">
            <img className="shopping__history__icon" src={calendar} alt="" />
            <span className="gray-text">
              {daysOfWeek[day]} {date.toISOString().substring(0, 10)}
            </span>
          </div>
          {formattedData.map((item, index) => (
            <div key={index}>
              <h2>{item[0]}</h2>
              {item[1].map((nested, index) => (
                <div
                  key={index}
                  className={
                    nested.purchased === true
                      ? "shopping__history__item line-through"
                      : "shopping__history__item"
                  }
                >
                  {nested.itemName}{" "}
                  <span className="orange">
                    {nested.quantity > 1
                      ? `${nested.quantity} pcs`
                      : `${nested.quantity} pc`}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </section>
      ) : (
        <section>
          <h1>Loading...</h1>
        </section>
      )}
    </div>
  );
};

export default ShoppingHistoryDetail;
