import { useSelector } from "react-redux";
import OpenModalButton from "./OpenModalButton";
import SignupFormPopup from "./SignupFormPopup";
import { useNavigate } from "react-router-dom";
import WhatsIncluded from "./Home/WhatsIncluded";
const HomePage = () => {
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  return (
    <div className="container w-full py-12 mx-auto md:py-24 lg:py-32">
      <section className="w-full mx-auto text-center h-[80vh] flex flex-col mt-32">
        <h1 className="text-5xl font-bold text-primary sm:text-4xl md:text-7xl">
          Connect. Collaborate. Resonate.
        </h1>
        <h2 className="mt-4 text-xl md:text-xl">
          Resonate is the place for audio professionals to keep <em>forever</em>{" "}
          clients.
        </h2>
        {user ? (
          <button
            className="px-5 py-2 mx-auto mt-5 rounded-md w-1/8 bg-primary text-neutral-800 hover:bg-primary/90"
            onClick={() => navigate("/projects")}
          >
            Go to your dashboard
          </button>
        ) : (
          <div className="flex items-center justify-center gap-4 mt-5">
            <OpenModalButton
              buttonText={"Sign Up"}
              modalComponent={<SignupFormPopup />}
              className="px-5 py-2 rounded-md bg-primary text-neutral-800 hover:bg-primary/90"
            />
            <a href="#whats-included" className="px-5 py-2 border rounded-md border-primary hover:border-primary/80">
              Learn more
            </a>
          </div>
        )}
      </section>

      <WhatsIncluded />

      <section className="w-full space-y-8">
        <div className="flex flex-col items-center justify-center max-w-5xl mx-auto lg:text-center">
          <h2 className="px-3 mb-4 text-base font-semibold leading-7 uppercase transition-transform duration-300 rounded-lg cursor-default text-neutral-800 bg-primary lg:mb-8 hover:scale-105">
            How it Works
          </h2>


          <div>
            <div className="flex flex-col gap-8 mb-4">
              <h2 className="text-2xl">Build a project...</h2>
              <p>Build a project to manage your work and clients.</p>
              <hr />
            </div>
            <div className="flex flex-col gap-8 mb-4">
              <h2 className="text-2xl">...Then add clients!</h2>
              <p>Connect with your clients and have them attached to your project.</p>

              <hr />
            </div>
          </div>
        </div>


      </section>
    </div>
  );
};
export default HomePage;
