import bottle from "../source.svg";
import emptyCart from "../undraw_shopping_app_flsj 1.svg";
import pencil from "../pencil.svg";
import minus from "../minus.svg";
import orangePlus from "../plus-orange.svg";
import { useState } from "react";
import ItemForm from "./ItemForm";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import ItemPanel from "./ItemPanel";
import { nanoid } from "nanoid";
import trashcan from "../delete-outline.svg";

const ListPanel = (props) => {
  const { auth } = useAuth();

  const [togglePanel, setTogglePanel] = useState(false);

  // addItem functionality

  const handleToggleAddItem = () => {
    setTogglePanel((prev) => !prev);
  };

  const [item, setItem] = useState({
    itemName: "",
    note: "",
    picture: undefined, // mongoose 'default' requires undefined
    categoryName: "",
  });

  const handleChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`/items`, JSON.stringify(item), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });

      setItem({
        itemName: "",
        note: "",
        picture: undefined,
        categoryName: "",
      });

      props.setFetchCategories((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };
  // end of addItem functionality

  const [listName, setListName] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [originalList, setOriginalList] = useState([]); // list before editing

  const toggleItemEditing = (e, index) => {
    let list = [...props.list];

    let item = { ...list[index] };

    item.editing = !item.editing;

    list[index] = item;

    props.setList(list);
  };

  const handleDelete = (e, index) => {
    let list = [...props.list];

    const newList = list
      .map((item, idx) => (idx !== index ? item : null))
      .filter((item) => item !== null);

    props.setList(newList);
  };

  const handleMinus = (e, index) => {
    let list = [...props.list];

    let item = { ...list[index] };

    item.quantity = item.quantity - 1;

    if (item.quantity < 1) {
      item.quantity = 1;
    }

    list[index] = item;

    props.setList(list);
  };

  const handlePlus = (e, index) => {
    let list = [...props.list];

    let item = { ...list[index] };

    item.quantity = item.quantity + 1;

    list[index] = item;

    props.setList(list);
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    // save props.list -> revert back to on cancel
    setOriginalList([...props.list]);
  };

  const handleListName = (e) => {
    setListName(e.target.value);
  };

  const handleUpdateListItems = (e, index) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    let list = [...props.list];

    let item = { ...list[index] };

    item.purchased = value;

    list[index] = item;

    props.setList(list);
  };

  const handleListNameSubmit = async (e) => {
    e.preventDefault();

    const allPurchased = [...props.list].every(
      (item) => item.purchased === true
    );

    // have to check for list length - otherwise, you can save an empty list to the database
    // since updated to disable the save button when list length is 0

    if (props.list.length) {
      try {
        await axios.post(
          "/lists",
          JSON.stringify({
            listName: listName,
            items: [...props.list],
            state: allPurchased ? "completed" : "active",
          }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
            withCredentials: true,
          }
        );
      } catch (err) {
        console.log(err);
      }
      // reset everything back
      setListName("");
      props.setList([]);
    } else {
      // error message to the user ?
      setListName("");
    }
  };

  const handleCancel = (e) => {
    setEditMode(prev => !prev);
    props.setList(originalList);
  };

  const handleComplete = (e) => {
    e.preventDefault();
    // don't have to do anything - list is already updated
    setEditMode(prev => !prev);
  };

  const handleDeleteList = (e) => {
    e.preventDefault();
    setOriginalList([]);
    props.setList([]);
    setEditMode(prev => !prev);
  };

  const handleQuantityKeyDown = (e, index) => {
    if (e.key === "Enter") {
      toggleItemEditing(e, index);
    }
  };

  const handleKeyDownEdit = (e) => {
    if (e.key === "Enter") {
      toggleEditMode(prev => !prev);
    }
  };

  /* Problem with CSS containers - fixed by using same class list__panel__itemForm  */
  return (
    <>
      {togglePanel && !props.showItemDetail && (
        <div className="list__panel__itemForm">
          <ItemForm
            handleToggleAddItem={handleToggleAddItem}
            item={item}
            handleChange={handleChange}
            handleItemSubmit={handleItemSubmit}
          />
        </div>
      )}

      {props.showItemDetail && (
        <div className="list__panel__itemForm">
          <ItemPanel
            setShowItemDetail={props.setShowItemDetail}
            clickedItemId={props.clickedItemId}
            setList={props.setList}
          />
        </div>
      )}

      {!togglePanel && (
        <div className="list__panel__container">
          <section className="list__panel__top__section">
            <div>
              <img src={bottle} alt="" />
            </div>
            <div>
              <h1>Didn't find what you need?</h1>
              <button
                onClick={handleToggleAddItem}
                className="list__panel__top__section__button"
                type="button"
              >
                Add Item
              </button>
            </div>
          </section>
          {props.list.length ? (
            <div>
              <div className="flex align-center space-between">
                <h1>Shopping Cart</h1>
                {!editMode && (
                  <div
                    onClick={toggleEditMode}
                    onKeyDown={handleKeyDownEdit}
                    tabIndex={0}
                  >
                    <img
                      className="shopping__cart__img"
                      src={pencil}
                      alt="Edit"
                    />
                  </div>
                )}
              </div>
              <div className="shopping__list__overflow">
                {props.list.map((item, index) => {
                  return (
                    <div
                      key={nanoid()}
                      className={`flex align-center space-between mb-20 padding-right-30`}
                      index={index}
                    >
                      {editMode && (
                        <div>
                          <input
                            className="purchased"
                            type="checkbox"
                            name="purchased"
                            checked={item.purchased}
                            onChange={(e) => handleUpdateListItems(e, index)}
                          />
                        </div>
                      )}
                      <h2 className={item.purchased ? "line-through" : ""}>
                        {item.itemName}
                      </h2>
                      <button
                        type="button"
                        className={
                          item.editing
                            ? "hide"
                            : "shopping__cart__quantity__btn"
                        }
                        onClick={(e) => toggleItemEditing(e, index)}
                      >
                        {item.quantity > 1
                          ? `${item.quantity} pcs`
                          : `${item.quantity} pc`}
                      </button>
                      <div
                        className={!item.editing ? "hide" : "quantity__panel"}
                      >
                        <button
                          type="button"
                          className="quantity__panel__trashcan"
                          onClick={(e) => handleDelete(e, index)}
                        >
                          <img
                            className="shopping__cart__img"
                            src={trashcan}
                            alt="Delete"
                          />
                        </button>
                        <button
                          type="button"
                          className="quantity__panel__button"
                          onClick={(e) => handleMinus(e, index)}
                        >
                          <img
                            className="shopping__cart__img"
                            src={minus}
                            alt="minus"
                          />
                        </button>
                        <span
                          className="pointer shopping__cart__quantity__btn"
                          onClick={(e) => toggleItemEditing(e, index)}
                          tabIndex={0}
                          onKeyDown={(e) => handleQuantityKeyDown(e, index)}
                        >
                          {item.quantity > 1
                            ? `${item.quantity} pcs`
                            : `${item.quantity} pc`}
                        </span>
                        <button
                          type="button"
                          className="quantity__panel__button"
                          onClick={(e) => handlePlus(e, index)}
                        >
                          <img
                            className="shopping__cart__img"
                            src={orangePlus}
                            alt="plus"
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="shopping__list__no__items__container">
              <h1 className="shopping__list__no__items__heading">No Items</h1>
              <div>
                <img
                  className="shopping__list__no__items__img"
                  src={emptyCart}
                  alt=""
                />
              </div>
            </div>
          )}
          {editMode ? (
            <div>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" onClick={handleDeleteList}>
                Reset
              </button>
              <button type="button" onClick={handleComplete}>
                Continue
              </button>
            </div>
          ) : (
            <div>
              <form className="floatingGroup" onSubmit={handleListNameSubmit}>
                <input
                  id="list__panel__input"
                  type="text"
                  name="listName"
                  value={listName}
                  onChange={handleListName}
                  className={
                    props.list.length === 0
                      ? "list__panel__input__disabled"
                      : "list__panel__input"
                  }
                  required
                />
                <label htmlFor="list__panel__input" className="floatingLabel">
                  Enter a list name
                </label>
                <button
                  className="list__panel__save__btn"
                  type="submit"
                  disabled={props.list.length === 0}
                >
                  Save
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ListPanel;
