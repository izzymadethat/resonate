import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        description,
      };

      const result = await dispatch(createProject(projectData));
      const data = await result.json();
      console.log(data);
      //   navigate(`/projects/${result.id}`);
    } catch (error) {
      const data = await error.json();
      setErrors(data.errors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl px-8 mx-auto lg:px-20 lg:mx-0 lg:max-w-4xl">
      <h1 className="text-3xl font-extrabold uppercase mb-4 lg:mb-8 text-center lg:text-left">
        Create a <span className="text-primary">New Project</span>
      </h1>
      <div className="w-full bg-neutral-800 rounded-md">
        <form className="p-8 flex flex-col space-y-6" onSubmit={handleSubmit}>
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
              className="w-full p-2 bg-transparent text-sm outline-none border-b border-neutral-500 text-neutral-400 focus:border-primary"
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
              className="w-full p-2 bg-transparent text-sm outline-none border-b border-neutral-500 text-neutral-400 focus:border-primary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors?.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-sm text-neutral-800 py-2 rounded-md w-full cursor-pointer lg:max-w-36 disabled:bg-primary/50 disabled:cursor-default"
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
          {errors.message && (
            <p className="text-red-500 text-xs text-center">{errors.message}</p>
          )}
        </form>
      </div>
    </div>
  );
};
export default CreateProjectPage;
