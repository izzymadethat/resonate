import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProject } from "../store/projects";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const projectData = {
        title,
        description
      };

      const result = await dispatch(createProject(projectData));
      navigate(`/projects/${result.id}`);
    } catch (error) {
      const data = await error.json();
      setErrors(data.errors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl px-8 mx-auto lg:px-20 lg:mx-0 lg:max-w-4xl">
      <h1 className="mb-4 text-3xl font-extrabold text-center uppercase lg:mb-8 lg:text-left">
        Create a <span className="text-primary">New Project</span>
      </h1>
      <Link to={".."} className="text-sm text-center underline text-neutral-400 hover:text-primary">Go back</Link>
      <div className="w-full rounded-md bg-neutral-800">
        <form className="flex flex-col p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="projectTitle"
              className="text-sm uppercase text-neutral-400"
            >
              Project Title
            </label>
            <input
              type="text"
              id="projectTitle"
              placeholder="Add a unique project title..."
              className="w-full p-2 text-sm bg-transparent border-b outline-none border-neutral-500 text-neutral-400 focus:border-primary"
              maxLength={50}
              minLength={3}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors?.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="projectDescription"
              className="text-sm uppercase text-neutral-400"
            >
              Project Description
            </label>
            <textarea
              placeholder="Add your project description here..."
              rows={3}
              minLength={5}
              maxLength={250}
              className="w-full p-2 text-sm bg-transparent border-b outline-none border-neutral-500 text-neutral-400 focus:border-primary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors?.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 text-sm rounded-md cursor-pointer bg-primary hover:bg-primary/90 text-neutral-800 lg:max-w-36 disabled:bg-primary/50 disabled:cursor-default"
            disabled={
              !title ||
              title.length < 3 ||
              (description && description.length < 5) ||
              submitting
            }
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" />
                <span className="ml-2">Creating Project...</span>
              </>
            ) : (
              "Create Project"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateProjectPage;
