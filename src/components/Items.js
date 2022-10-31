import { useState } from "react";
import ItemDetail from "./ItemDetail";
import { Link } from "react-router-dom";
import plus from "../plus.svg";
import { nanoid } from "nanoid";

const Items = (props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="items__container">
      <div className="items__overflow">
        <section className="items__top__section">
          <h1>
            <span className="orange">Shoppingify</span> allows you take your
            shopping list whenever you go
          </h1>
          <div className="floatingGroup">
            <input
              id="items__search"
              type="text"
              maxLength={20}
              name="search"
              value={searchTerm}
              onChange={handleSearch}
              required
            />
            <label htmlFor="items__search" className="floatingLabel">
              Search item
            </label>
          </div>
        </section>
        <div>
          {props.categories.map((category) => {
            return (
              <div key={nanoid()}>
                {searchTerm ? (
                  <div key={nanoid()}>
                    {category.items.filter((item) =>
                      item.itemName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ).length !== 0 && <h2>{category.categoryName}</h2>}
                    {category.items
                      .filter((item) =>
                        item.itemName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((item) => {
                        return (
                          <div className="item" id={item._id} key={nanoid()}>
                            <div>
                              <Link
                                to={`/details?item=${item._id}`}
                                className={`${category.categoryName}__${item.itemName}`}
                                onClick={props.handleItemClick}
                              >
                                <ItemDetail item={item} />
                              </Link>
                            </div>
                            <div
                              onClick={props.handlePlusClick}
                              onKeyDown={props.handleKeyDownPlusClick}
                              tabIndex={0}
                              data-cy={`plus-btn-${item.itemName}`}
                            >
                              <span>
                                {" "}
                                <img
                                  className="item__plus__img"
                                  src={plus}
                                  alt="Add"
                                />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div key={nanoid()}>
                    <h2>{category.categoryName}</h2>
                    {category.items.map((item) => {
                      return (
                        <div className="item" id={item._id} key={nanoid()}>
                          <div>
                            <Link
                              to={`/details?item=${item._id}`}
                              className={`${category.categoryName}__${item.itemName}`}
                              onClick={props.handleItemClick}
                            >
                              <ItemDetail item={item} />
                            </Link>
                          </div>
                          <div
                            onClick={props.handlePlusClick}
                            onKeyDown={props.handleKeyDownPlusClick}
                            tabIndex={0}
                          >
                            <span>
                              {" "}
                              <img
                                className="item__plus__img"
                                src={plus}
                                alt="Add"
                              />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Items;
