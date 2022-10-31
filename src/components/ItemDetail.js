// import plus from '../plus.svg'

/* removed className="item" */

/* this component became useless - originally had plus sign inside - but I switched to link tag */

/* <h3 id={props.item._id} onClick={props.handleItemClick}>{props.item.itemName}</h3>*/

/* having onClick={props.handleItemClick} on this component instead of Link component in Items Component prevents accessible tabbing thru the item list */

const ItemDetail = (props) => {
  return <h3>{props.item.itemName}</h3>;
};

export default ItemDetail;
