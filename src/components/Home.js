import Navbar from "./Navbar";
import Items from "./Items";
import ListPanel from "./ListPanel";
import { useEffect, useState } from "react";
import ShoppingHistory from "./ShoppingHistory";
import Stats from "./Stats";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ShoppingHistoryDetail from "./ShoppingHistoryDetail";
import useWindowDimensions from "../hooks/useWindowDimensions";

const Home = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const [categories, setCategories] = useState([]);
  const [fetchCategories, setFetchCategories] = useState(false);
  const [tab, setTab] = useState("Items");
  const [list, setList] = useState([]);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [clickedItemId, setClickedItemId] = useState("");

  const handleKeyDownFirstChild = (e) => {
    if (e.key === "Enter") {
      // || e.key === " "
      setTab((prev) => e.target.firstChild.alt);
    }
  };

  const setTabToHistory = (e) => {
    setTab((prev) => "History");
  };

  const handleTab = (e) => {
    setTab((prev) => e.target.alt);
  };

  const { width } = useWindowDimensions();

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleKeyDownPlusClick = (e) => {
    if (e.key === "Enter") {
      // || e.key === " "
      // replaced listDuplicate - can't get the id
      if (
        list.some(
          (item) =>
            item.itemName === e.target.parentElement.firstChild.innerText
        )
      ) {
        return;
      } else {
        let allItems = categories.map((cat) => cat.items);

        let itemDetailsOfItemClicked = allItems
          .flat()
          .find(
            (item) =>
              item.itemName === e.target.parentElement.firstChild.innerText
          );

        setList((prev) => {
          return [
            ...prev,
            {
              ...itemDetailsOfItemClicked,
              quantity: 1,
              purchased: false,
              editing: false,
              categoryName:
                e.target.parentElement.parentElement.parentElement.firstChild
                  .firstChild.innerText,
            },
          ];
        });
      }
    }
  };

  const handleItemClick = (e) => {
    setClickedItemId(e.target.id);
    setShowItemDetail(false);
    setShowItemDetail(true);
    width < 700 && scrollToBottom();
  };

  const listDuplicate = (id) => {
    return list.some((item) => item._id === id);
  };

  const handlePlusClick = (e) => {
    e.preventDefault();

    if (listDuplicate(e.target.parentElement.parentElement.parentElement.id)) {
      // change quantity of existing item on same click - or not allow this?
      return;
    } else {
      // use the e target ______ to filter categories to get item details

      //console.log('categories',categories) // need to map thru items to find the correct item and pass that item's details into the list

      // quick hack to get category name
      //console.log('category?', e.target.parentElement.parentElement.parentElement.parentElement.firstChild.innerText)

      let allItems = categories.map((cat) => cat.items);

      let itemDetailsOfItemClicked = allItems
        .flat()
        .find(
          (item) =>
            item.itemName ===
            e.target.parentElement.parentElement.parentElement.innerText
        );

      //console.log('itemDetailsOfItemClicked', itemDetailsOfItemClicked)

      /* bad idea to derive state from categories - need to use categories to get item details 
            for(let items of categories) {
                setListItems(prev => [...prev, ...items.items])
            }

            console.log('listItems', listItems)
            // for in loop to get all items and add the items to list array
      */

      setList((prev) => {
        return [
          ...prev,
          {
            ...itemDetailsOfItemClicked,
            quantity: 1,
            purchased: false,
            editing: false,
            categoryName:
              e.target.parentElement.parentElement.parentElement.parentElement
                .firstChild.innerText,
          },
        ];
      });
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axiosPrivate.get("/categories");

        setCategories(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getCategories();
  }, [fetchCategories, axiosPrivate]);

  return (
    <div className="home__grid">
      <Navbar
        list={list}
        handleTab={handleTab}
        tab={tab}
        handleKeyDown={handleKeyDownFirstChild}
      />
      {tab === "Items" ? (
        <Items
          categories={categories}
          handleItemClick={handleItemClick}
          handlePlusClick={handlePlusClick}
          handleKeyDownPlusClick={handleKeyDownPlusClick}
        />
      ) : tab === "Stats" ? (
        <Stats />
      ) : tab === "History" ? (
        <ShoppingHistory handleTab={handleTab} />
      ) : (
        <ShoppingHistoryDetail
          handleTab={handleTab}
          setTabToHistory={setTabToHistory}
        />
      )}
      <ListPanel
        list={list}
        setList={setList}
        clickedItemId={clickedItemId}
        setShowItemDetail={setShowItemDetail}
        showItemDetail={showItemDetail}
        setFetchCategories={setFetchCategories}
      />
    </div>
  );
};

export default Home;
