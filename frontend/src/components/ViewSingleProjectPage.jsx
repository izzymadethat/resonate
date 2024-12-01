import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProject } from "../store/projects";
import { UserCircle2 } from "lucide-react";

const ClientCard = () => {
  return (
    <article className="w-full bg-neutral-800 hover:bg-neutral-800/80 flex py-6 px-4 flex-col lg:flex-row justify-evenly lg:justify-between items-center  cursor-pointer rounded-md space-y-2">
      <div className="flex gap-2 items-center">
        <UserCircle2 size={56} />
        <div>
          <h3>Client Name</h3>
          <p>Client Email</p>
        </div>
      </div>
      <div className="text-sm flex gap-4">
        <button>Edit Client</button>
        <button>Delete Client</button>
      </div>
    </article>
  );
};

const ViewSingleProjectPage = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.projects.currentProject);

  useEffect(() => {
    dispatch(fetchProject(projectId));
  }, [dispatch, projectId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container px-12 py-8 mx-auto space-y-8">
      <section className="flex flex-col lg:flex-row items-center lg:justify-between">
        <div className="text-center lg:text-left">
          <h2>{project.title}</h2>
          <p className="text-sm">
            {project.description || "No description provided."}
          </p>
        </div>
        <div className="flex gap-2 text-sm mt-4 lg:mt-0">
          <button>Edit Project</button>
          <button>Share Project</button>
          <button>Delete Project</button>
        </div>
      </section>
      <section className="space-y-4">
        <div
          className="flex justify-between items:center
         lg:justify-start lg:gap-4"
        >
          <h2 className="text-xl mb-2 uppercase text-neutral-300 font-extrabold">
            Client(s)
          </h2>
          <button>Add Client</button>
        </div>
        <div className="h-4 w-full bg-gradient-to-r from-primary via-amber-600 to-transparent mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ClientCard />
          <ClientCard />
          <ClientCard />
        </div>
      </section>
    </div>
  );
};
export default ViewSingleProjectPage;
