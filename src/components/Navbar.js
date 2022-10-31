import logo from "../logo.svg";
import logoutIcon from "../logout-variant.svg";
import cart from "../cart-outline.svg";
import chart from "../chart-box-outline.svg";
import itemsList from "../format-list-bulleted-square.svg";
import historyLogo from "../history.svg";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import Tooltip from "./Tooltip";

const Navbar = (props) => {
  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav>
      <ul className="navbar_main_ul">
        <li>
          <ul>
            <li>
              <img className="navbar_img" src={logo} alt="Home" />
            </li>
          </ul>
        </li>
        <li className="navbar__tabs__li">
          <ul>
            <Tooltip content="Items" direction="right">
              <li
                tabIndex={0}
                onClick={props.handleTab}
                onKeyDown={props.handleKeyDown}
                className={
                  props.tab === "Items"
                    ? "active-tab pointer"
                    : "normal-tab pointer"
                }
              >
                <img className="navbar_img" src={itemsList} alt="Items" />
              </li>
            </Tooltip>
            <Tooltip content="History" direction="right">
              <li
                tabIndex={0}
                onClick={props.handleTab}
                onKeyDown={props.handleKeyDown}
                className={
                  props.tab === "History"
                    ? "active-tab pointer"
                    : "normal-tab pointer"
                }
              >
                <img className="navbar_img" src={historyLogo} alt="History" />
              </li>
            </Tooltip>
            <Tooltip content="Stats" direction="right">
              <li
                tabIndex={0}
                onClick={props.handleTab}
                onKeyDown={props.handleKeyDown}
                className={
                  props.tab === "Stats"
                    ? "active-tab pointer"
                    : "normal-tab pointer"
                }
              >
                <img className="navbar_img" src={chart} alt="Stats" />
              </li>
            </Tooltip>
          </ul>
        </li>
        <li>
          <ul>
            <li className="navbar__shopping__cart__icon">
              <img className="navbar_img cart__icon" src={cart} alt="Cart" />
              {props.list.length >= 1 && (
                <div className="navbar__shopping__icon__count">
                  {props.list.length}
                </div>
              )}
            </li>
            <li className="nav-btn log-out pointer" onClick={signOut}>
              <img className="navbar_img" src={logoutIcon} alt="Logout" />
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
