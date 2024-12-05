import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../store/session";
import OpenModalButton from "./OpenModalButton";
import LoginFormPopup from "./LoginFormPopup";
import SignupFormPopup from "./SignupFormPopup";
import { UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);
  const closeMenu = () => setShowMenu(false);
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/");
  };

  const ulClassName = "w-56 px-4 py-2 rounded-md absolute top-12 -left-48 bg-neutral-800" + (showMenu ? "" : " hidden");

  return (
    <div className="relative">
      <button onClick={toggleMenu}>
        <UserCircle size={32} />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div className="flex flex-col items-center">
              <li className="text-xl font-semibold">{user.username}</li>
              {user.email == "reso-nator@demo.com" && <li className="w-[100px] px-2 py-1 text-sm text-center rounded-md text-neutral-800 hover:scale-95 cursor-default transition-all bg-gradient-to-r from-primary to-amber-600 my-2">Trial User</li>}
              <li className="text-sm text-neutral-400">{user.email}</li>
              <li className="my-4 text-sm text-neutral-400">
                <button onClick={logout} className="px-2 py-1 rounded-md cursor-pointer bg-primary hover:bg-primary/90 text-neutral-800">Log Out</button>
              </li>
            </div>

          </>
        ) : (
          <>
            <li>
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormPopup />}
              />
            </li>
            <li>
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormPopup />}
              />
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
