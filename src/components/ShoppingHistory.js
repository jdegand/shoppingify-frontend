import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import calendar from "../calendar-text.svg";
import chevronRight from "../chevron-right.svg";
import { Link, useSearchParams } from "react-router-dom";
import { nanoid } from "nanoid";

const ShoppingHistory = (props) => {
  const [lists, setLists] = useState([]);

  const { auth } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const removeQueryParams = () => {
      const param = searchParams.get("list");

      if (param) {
        // delete each query param & update state after
        searchParams.delete("list");

        setSearchParams(searchParams);
      }
    };

    removeQueryParams();
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const getLists = async () => {
      try {
        const response = await axios.get("/lists", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
            withCredentials: true,
          },
        });

        // have to filter response for logged-in user only otherwise you get data for all lists
        // const filteredListsForUser = response.data.filter(data => data.user._id === auth.id)
        // changed backend to filter lists - potential to get all list data this way ?

        setLists(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getLists();
  }, [auth.accessToken, auth.id]);

  return (
    <section className="shopping__history__container">
      <h1 className="mbe-50" data-cy="history">
        Shopping History
      </h1>
      <div className="shopping__history__overflow">
        {lists.length === 0 && <h2>No Lists</h2>}
        {lists.map((list) => {
          const date = new Date(list.updatedAt);

          const daysOfWeek = [
            "Sun",
            "Mon",
            "Tues",
            "Weds",
            "Thurs",
            "Fri",
            "Sat",
          ];

          const day = date.getDay();

          return (
            <div
              className="flex space-between align-center shopping__history__list__item"
              key={nanoid()}
            >
              <div>
                <h2>{list.listName}</h2>
              </div>
              <div className="flex space-between align-center shopping__history__list__grid">
                <div className="shopping__history__icon">
                  <img src={calendar} alt="" />
                </div>
                <div className="gray-text">
                  {daysOfWeek[day]} {date.toISOString().substring(0, 10)}
                </div>
                <div
                  className={
                    list.state === "active"
                      ? "shopping__history__list__grid__state red-text"
                      : "shopping__history__list__grid__state blue-text"
                  }
                >
                  {list.state}
                </div>
                <Link to={`/?list=${list._id}`} onClick={props.handleTab}>
                  <img
                    className="shopping__history__icon"
                    src={chevronRight}
                    alt="Details"
                  />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ShoppingHistory;
