import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDeleteProject, fetchProject, fetchProjects } from "../store/projects";
import { UserCircle2 } from "lucide-react";
import OpenModalButton from "./OpenModalButton";
import DeleteProjectPopup from "./DeleteProjectPopup";

const ClientCard = () => {
  return (
    <article className="flex flex-col items-center w-full px-4 py-6 space-y-2 rounded-md cursor-pointer bg-neutral-800 hover:bg-neutral-800/80 lg:flex-row justify-evenly lg:justify-between">
      <div className="flex items-center gap-2">
        <UserCircle2 size={56} />
        <div>
          <h3>Client Name</h3>
          <p>Client Email</p>
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        <button>Edit Client</button>
        <button>Delete Client</button>
      </div>
    </article>
  );
};

const ViewSingleProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.projects.currentProject);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchProject(projectId));
  }, [dispatch, projectId]);

  const handleDelete = async (projectId) => {
    try {
      await dispatch(fetchDeleteProject(projectId));
      await dispatch(fetchProjects());
      navigate("/projects"); // Navigate to the projects page
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container px-12 py-8 mx-auto space-y-8">
      <section className="flex flex-col items-center lg:flex-row lg:justify-between">
        <div className="text-center lg:text-left">
          <h2>{project.title}</h2>
          <p className="text-sm">
            {project.description || "No description provided."}
          </p>
        </div>
        <div className="flex gap-2 mt-4 text-sm lg:mt-0">
          <a href={`/projects/${project.id}/edit`} className="px-2 py-1 rounded-lg bg-neutral-700 hover:bg-neutral-700/80">Edit Project</a>
          <button>Share Project</button>
          <OpenModalButton
            modalComponent={<DeleteProjectPopup projectId={project.id} onDelete={handleDelete} />}
            buttonText={<span className="flex items-center gap-2 px-2 py-1 bg-red-600 rounded-md hover:bg-red-600/80">
              Delete Project
            </span>}
          />
        </div>
      </section>
      <section className="space-y-4">
        <div
          className="flex justify-between items:center lg:justify-start lg:gap-4"
        >
          <h2 className="mb-2 text-xl font-extrabold uppercase text-neutral-300">
            Client(s)
          </h2>
          <button>Add Client</button>
        </div>
        <div className="w-full h-4 mb-4 bg-gradient-to-r from-primary via-amber-600 to-transparent" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ClientCard />
          <ClientCard />
          <ClientCard />
        </div>
      </section>
    </div>
  );
};
export default ViewSingleProjectPage;
