import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDeleteProject, fetchProject, fetchProjects } from "../store/projects";
import { UserCircle2 } from "lucide-react";
import OpenModalButton from "./OpenModalButton";
import DeleteProjectPopup from "./DeleteProjectPopup";
import AddClientFormPopup from "./AddClientFormPopup";
import EditClientFormPopup from "./EditClientFormPopup";
import { fetchDeleteClient } from "../store/clients";
import FileUploader from "./FileUploader";
import { fetchFiles } from "../store/files";

const ClientCard = ({ client, onDelete }) => {
  const deleteClient = () => {
    onDelete(client.id);
  };
  return (
    <article className="flex flex-col items-center w-full px-4 py-6 space-y-2 rounded-md cursor-pointer bg-neutral-800 hover:bg-neutral-800/80 lg:flex-row justify-evenly lg:justify-between">
      <div className="flex flex-col items-center gap-2 lg:flex-row">
        <UserCircle2 className="size-8 lg:size-14" />
        <div className="text-center lg:text-left">
          <h3 className="font-semibold">{client.name}</h3>
          <p className="text-sm">{client.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-sm lg:flex-row">
        <OpenModalButton
          buttonText={<span className="text-primary">Edit Client</span>}
          modalComponent={<EditClientFormPopup projectId={client.projectId} clientId={client.id} />}
        />

        <button onClick={deleteClient} className="p-2 bg-red-600 rounded-md hover:bg-red-600/80">Delete Client</button>
      </div>
    </article>
  );
};

const ViewSingleProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.projects.currentProject);
  const files = useSelector(state => state.files.files);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchProject(projectId));
    dispatch(fetchFiles(projectId));
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

  const handleDeleteClient = async (clientId) => {
    try {
      await dispatch(fetchDeleteClient(clientId));
      await dispatch(fetchProject(projectId));
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container px-24 py-8 mx-auto space-y-8">
      <section className="flex flex-col items-center lg:flex-row lg:justify-between">
        <div className="text-center lg:text-left">
          <h2 className="mb-4 text-3xl lg:mb-0">{project.title}</h2>
          <p className="text-sm">
            {project.description || "No description provided."}
          </p>
        </div>
        <div className="flex gap-2 mt-4 text-sm lg:mt-0">
          <a href={`/projects/${project.id}/edit`} className="px-2 py-1 rounded-lg bg-neutral-700 hover:bg-neutral-700/80">Edit Project</a>
          <OpenModalButton
            modalComponent={<DeleteProjectPopup projectId={project.id} onDelete={handleDelete} />}
            buttonText={<span className="flex items-center gap-2 px-2 py-1 bg-red-600 rounded-md hover:bg-red-600/80">
              Delete Project
            </span>}
          />
        </div>
      </section>
      <div className="flex flex-col gap-8">
        {/* View Clients */}
        <section className="h-full space-y-4">
          <div
            className="flex justify-between items:center lg:justify-start lg:gap-4"
          >
            <h2 className="mb-2 text-xl font-extrabold uppercase pointer-events-none text-neutral-300">
              Clients
            </h2>
            <OpenModalButton
              buttonText={<button className="px-2 py-1 text-sm rounded-md bg-primary text-neutral-800">Add Client</button>}
              modalComponent={<AddClientFormPopup projectId={project.id} />}

            />
          </div>
          <div className="w-full h-4 mb-4 bg-gradient-to-r from-primary via-amber-600 to-transparent" />

          {project.Clients.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {project.Clients.map(client => (
                <ClientCard key={client.id} client={client} onDelete={handleDeleteClient} />
              ))}
            </div>
          ) : (
            <>
              <section className="flex items-center justify-center h-64 p-8 rounded-md lg:mx-auto bg-neutral-800">
                <div className="flex flex-col items-center w-full h-full p-12 border border-dashed rounded-md border-neutral-400 text-neutral-300">
                  <UserCircle2 size={64} className="text-primary/70" />
                  No clients for this project
                </div>
              </section>
            </>
          )
          }

        </section>
        {/* View Project Files */}

        {/* Upload Files */}
        <section className="container space-y-2">
          <h2 className="mb-6 text-xl font-extrabold text-center uppercase pointer-events-none lg:text-left text-neutral-300">
            Upload File(s)
          </h2>
          <FileUploader className="w-full max-w-2xl p-10 text-sm border border-dashed rounded-md cursor-pointer lg:p-16 border-neutral-200 lg:text-base" projectId={project.id} />
        </section>
      </div>
    </div>
  );
};
export default ViewSingleProjectPage;
