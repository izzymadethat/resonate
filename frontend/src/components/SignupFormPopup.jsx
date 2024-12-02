import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../context/Modal";
import * as sessionActions from "../store/session";

function SignupFormPopup() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      email,
      username,
      firstName,
      lastName,
      password
    };

    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup(newUser)
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="relative w-full max-w-md p-12 space-y-6 min-h-80">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label className="flex flex-col">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-transparent border rounded-md border-neutral-500 text-neutral-400"
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label className="flex flex-col">
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={4}
            maxLength={30}
            required
            className="w-full px-4 py-2 bg-transparent border rounded-md border-neutral-500 text-neutral-400"
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label className="flex flex-col">
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            minLength={1}
            maxLength={100}
            required
            className="w-full px-4 py-2 bg-transparent border rounded-md border-neutral-500 text-neutral-400"
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label className="flex flex-col">
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            minLength={1}
            maxLength={100}
            required
            className="w-full px-4 py-2 bg-transparent border rounded-md border-neutral-500 text-neutral-400"
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label className="flex flex-col">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            maxLength={20}
            className="w-full px-4 py-2 bg-transparent border rounded-md border-neutral-500 text-neutral-400"
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label className="flex flex-col">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            maxLength={20}
            required
            className="w-full px-4 py-2 bg-transparent border rounded-md border-neutral-500 text-neutral-400"
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit" className="p-2 rounded-md bg-neutral-600 hover:bg-neutral-600/80">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPopup;
