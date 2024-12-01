import { useState } from "react";
import * as sessionActions from "../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../context/Modal";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoLogin = () => {
    setErrors({});
    return dispatch(sessionActions.login({ credential: 'reso-nator', password: 'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="relative w-full max-w-md p-12 space-y-6 min-h-80">
      <h1 className="text-2xl font-bold"> Log In</h1 >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label className="flex flex-col">
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className="w-full px-4 py-2 bg-transparent border rounded-md border-neutral-500 text-neutral-400"
          />
        </label>
        <label className="flex flex-col">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border rounded-md border-neutral-500 text-neutral-400"
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit" className="p-2 rounded-md bg-primary text-neutral-900 hover:bg-primary/90">Log In</button>
        <button type="button" onClick={demoLogin}>Login as a Demo User</button>
      </form>
    </div >
  );
}

export default LoginFormModal;
