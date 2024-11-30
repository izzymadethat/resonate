import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "./OpenModalButton";
import LoginFormPopup from "./LoginFormPopup";
import SignupFormPopup from "./SignupFormPopup";
import Logo from "./Logo";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionLinks = sessionUser ? (
    <li>
      <ProfileButton user={sessionUser} />
    </li>
  ) : (
    <div className="flex gap-4">
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormPopup />}
        />
      </li>
      <li>
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormPopup />}
        />
      </li>
    </div>
  );

  return (
    <ul className="flex justify-between items-center p-8">
      <li className="flex gap-2">
        <NavLink to="/" className="flex gap-2 items-center">
          <Logo className="size-9 transform rotate-12" />
          <span className="text-3xl uppercase font-extrabold text-transparent bg-gradient-to-r from-primary via-amber-600 to-amber-800 bg-clip-text">
            Resonate
          </span>
        </NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
