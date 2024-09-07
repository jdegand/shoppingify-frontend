import Navbar from "./Navbar";
import Items from "./Items";
import ListPanel from "./ListPanel";
import { useEffect, useState } from "react";
import ShoppingHistory from "./ShoppingHistory";
import Stats from "./Stats";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ShoppingHistoryDetail from "./ShoppingHistoryDetail";
import useWindowDimensions from "../hooks/useWindowDimensions";

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const [categories, setCategories] = useState([]);
  const [fetchCategories, setFetchCategories] = useState(false);
  const [tab, setTab] = useState("Items");
  const [list, setList] = useState([]);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [clickedItemId, setClickedItemId] = useState("");

  const handleKeyDownFirstChild = (e) => {
    if (e.key === "Enter") {
      setTab(e.target.firstChild.alt);
    }
  };

  const setTabToHistory = () => {
    setTab("History");
  };

  const handleTab = (e) => {
    setTab(e.target.alt);
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
      let allItems = categories.map((cat) => cat.items);

      let itemDetailsOfItemClicked = allItems
        .flat()
        .find(
          (item) =>
            item.itemName ===
            e.target.parentElement.parentElement.parentElement.innerText
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
