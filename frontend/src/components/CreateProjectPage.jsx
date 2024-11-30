const CreateProjectPage = () => {
  return (
    <div className="max-w-xl px-8 mx-auto lg:px-20 lg:mx-0 lg:max-w-4xl">
      <h1 className="text-3xl font-extrabold uppercase mb-4 lg:mb-8 text-center lg:text-left">
        Create a <span className="text-primary">New Project</span>
      </h1>
      <div className="w-full bg-neutral-800 rounded-md">
        <form className="p-8 flex flex-col space-y-6">
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
            />
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
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-sm text-neutral-800 py-2 rounded-md w-full lg:max-w-36"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateProjectPage;
