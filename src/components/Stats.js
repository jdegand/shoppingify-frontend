import axios from "../api/axios";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { nanoid } from "nanoid";

const Stats = () => {
  const [lists, setLists] = useState([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [categoriesObject, setCategoriesObject] = useState({});
  const [totalUsedCategories, setTotalUsedCategories] = useState(0);
  const [data, setData] = useState([]);
  const [topItems, setTopItems] = useState([]);

  const { auth } = useAuth();

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

        setLists(response.data);

        const arr = response.data.map((el) => el.items).flat();

        /*
        // There's a bug - Items Count is off - using forEach causes a mutation? I thought it was copied

        var output = [];
        arr.forEach((elem) => {
          var found = false;
          for (var i = 0; i < output.length; i++) {
            if (output[i].itemName === elem.itemName) {
              output[i].quantity += elem.quantity;
              found = true;
              break;
              }
            }
            if (!found) {
              output.push(elem);
            }
        });
        */
        const output = arr.map((elem) => {
          var result = [];
          var found = false;

          if (!found) {
            result.push(elem);
          }

          for (var i = 0; i < result.length; i++) {
            if (result[i].itemName === elem.itemName) {
              result[i].quantity = elem.quantity; //  += here - causes doubling since I add the quantity together again later - remove later sum function?
              found = true;
              break;
            }
          }
          return result;
        });

        setTopItems(output.flat());

        // have to filter response for logged-in user only otherwise you get data for all lists
        // const filteredListsForUser = response.data.filter(data => data.user._id === auth.id)
        // changed backend to filter lists - potential to get all list data this way ?
      } catch (err) {
        console.error(err);
      }
    };
    getLists();
  }, [auth.accessToken, auth.id]);

  useEffect(() => {
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    /*
    const totalItems = lists
      .reduce((prev, curr) => prev.concat(curr.items), [])
      .map((item) => item.quantity);
    */

    const totalCategories = lists
      .reduce((prev, curr) => prev.concat(curr.items), [])
      .map((item) => item.categoryName);

    const sum = topItems.reduce((accumulator, value) => {
      return accumulator + value.quantity;
    }, 0);

    const totalItemsByMonth = lists.map((list) => ({
      count: `${list.items
        .map((item) => item.quantity)
        .reduce((accumulator, value) => {
          return accumulator + value;
        }, 0)}`,
      date: `${month[new Date(list.updatedAt).getMonth()]}`,
    }));

    let monthsOfItemsPurchased = [
      ...new Set(totalItemsByMonth.map((el) => el.date)),
    ];

    // have to make sure order of object is correct
    // I manipulated mongo timestamps of lists to get different months to render in the chart & chart was wrong

    let chartData = [];

    for (let i = 0; i < monthsOfItemsPurchased.length; i++) {
      let obj = {};
      obj["name"] = monthsOfItemsPurchased[i];
      obj["items"] = totalItemsByMonth
        // problem with indexOf conditional item.date.indexOf(monthsOfItemsPurchased[i]) !== -1 ?
        .filter((item) => item.date.indexOf(monthsOfItemsPurchased[i]) > -1) // .filter((item) => item.date.indexOf(monthsOfItemsPurchased[i]) !== -1)
        .map((item) => item.count)
        .reduce((acc, value) => Number(acc) + Number(value), 0);
      //.reduce((acc,value)=> acc + value.count, 0)
      obj["order"] = month.indexOf(monthsOfItemsPurchased[i]);
      chartData.push(obj);
    }

    const sortedChartData = chartData.sort(function (a, b) {
      return a.order - b.order;
    });

    setData(sortedChartData);
    //const januaryItems = totalItemsByMonth.filter(item => item.date.indexOf('January') !== -1).map(item => item.count).reduce((acc, value) => Number(acc) + Number(value),0)

    setCategoriesCount(new Set(totalCategories).size);

    setItemsCount(sum); //  sum might not be necessary?  - if you had add the quantity together in the map ?

    const count = {};

    for (const element of totalCategories) {
      if (count[element]) {
        count[element] += 1;
      } else {
        count[element] = 1;
      }
    }

    setCategoriesObject(count);

    setTotalUsedCategories(totalCategories.length);
  }, [lists, topItems]);

  /* 
  style={{ width: (obj[1] / categoriesCount) * 100 }} uses px 

  only 1 item -> bar doesn't go the whole way - meter is 200px 

  added additional check to get bar to go the full width 

  className={obj[1] === 1 ? "full-width" : ""}
  */

  return (
    <div className="stats__container">
      <div className="stats__overflow">
        <div className="stats__grid">
          <section>
            <h1 className="mbe-20">Top Items</h1>
            {topItems.map((item) => {
              return (
                <div key={nanoid()}>
                  <div className="flex align-center space-between">
                    <h2>{item.itemName}</h2>
                    <span>
                      {Math.floor((item.quantity / itemsCount) * 100) + " %"}
                    </span>
                  </div>
                  {itemsCount && (
                    <div className="meter">
                      <span
                        className={
                          itemsCount === 1
                            ? "full-width top__items__meter"
                            : "top__items__meter"
                        }
                        style={{
                          width: (item.quantity / itemsCount) * 100,
                        }}
                      ></span>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
          <section>
            <h1 className="mbe-20">Top Categories</h1>
            {categoriesObject &&
              Object.entries(categoriesObject).map((obj, i) => {
                return (
                  <section key={nanoid()}>
                    <div className="flex align-center space-between">
                      <h2>{obj[0]}</h2>
                      <span>
                        {Math.floor((obj[1] / totalUsedCategories) * 100) +
                          " %"}
                      </span>
                    </div>
                    <div className="meter">
                      <span
                        style={{ width: (obj[1] / categoriesCount) * 100 }}
                        className={itemsCount === 1 ? "full-width" : ""}
                      ></span>
                    </div>
                  </section>
                );
              })}
          </section>
        </div>
        <section className="yearly__summary__section">
          <h1>Yearly Summary</h1>
          <div className="yearly__summary__chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <Line
                  type="monotone"
                  dataKey="items"
                  stroke="rgb(249,161,9)"
                  strokeWidth={3}
                />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Stats;
