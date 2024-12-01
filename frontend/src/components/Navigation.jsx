import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "./OpenModalButton";
import LoginFormPopup from "./LoginFormPopup";
import SignupFormPopup from "./SignupFormPopup";
import Logo from "./Logo";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionLinks = sessionUser ? (
    <div className="flex items-center gap-4 mt-4 lg:mt-0">
      <li className="relative ">
        <ProfileButton user={sessionUser} />
      </li>
      <span>|</span>
      <li>
        <Link to="/projects" className="uppercase hover:text-primary">Projects</Link>
      </li>
    </div>
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
    <ul className="flex flex-col items-center justify-between p-8 lg:flex-row">
      <li className="flex gap-2">
        <NavLink to="/" className="flex items-center gap-2">
          <Logo className="transform size-9 rotate-12" />
          <span className="text-3xl font-extrabold text-transparent uppercase bg-gradient-to-r from-primary via-amber-600 to-amber-800 bg-clip-text">
            Resonate
          </span>
        </NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
