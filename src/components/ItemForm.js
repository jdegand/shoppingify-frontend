const ItemForm = (props) => {
  return (
    <section>
      <h2>Add a new item</h2>
      <form onSubmit={props.handleItemSubmit}>
        <label htmlFor="item__name">Name</label>
        <input
          id="itemName"
          type="text"
          placeholder="Enter a name"
          name="itemName"
          value={props.item.itemName}
          onChange={props.handleChange}
          required
        />
        <label htmlFor="item__note">Note (Optional)</label>
        <textarea
          id="item__note"
          placeholder="Enter a note"
          name="note"
          value={props.item.note}
          onChange={props.handleChange}
          maxLength={500}
        />
        <label htmlFor="item__image">Image (Optional)</label>
        <input
          id="item__image"
          type="text"
          placeholder="Enter a url"
          name="picture"
          value={props.item.picture}
          onChange={props.handleChange}
        />
        <label htmlFor="item__categoryName">Category</label>
        <input
          id="item__categoryName"
          type="text"
          placeholder="Enter a category"
          name="categoryName"
          value={props.item.categoryName}
          onChange={props.handleChange}
          required
        />
        <div className="flex">
          <button type="button" onClick={props.handleToggleAddItem}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </section>
  );
};

export default ItemForm;
