import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDeleteProject, fetchProject, fetchProjects } from "../store/projects";
import { Ban, Download, File, UserCircle2 } from "lucide-react";
import OpenModalButton from "./OpenModalButton";
import DeleteProjectPopup from "./DeleteProjectPopup";
import AddClientFormPopup from "./AddClientFormPopup";
import EditClientFormPopup from "./EditClientFormPopup";
import { fetchDeleteClient } from "../store/clients";
import FileUploader from "./FileUploader";
import { deleteFiles, fetchFiles, fetchFileStreamUrl } from "../store/files";
import AudioPlayer from "./AudioPlayer";

function parseFileType(type) {
  const extension = type.split("/")[1];
  switch (extension) {
    case "mpeg":
      return "mp3";
    case "wave":
    case "wav":
      return "wav";
    case "ogg":
      return "ogg";
    case "m4a":
      return "m4a";
    default:
      return type;
  }
}

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

const FilesTable = ({ projectId, files }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const dispatch = useDispatch();
  const file = useSelector((state) => state.files.file);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFiles(files.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const toggleSelectFile = (e) => {
    const fileId = parseInt(e.target.value, 10); // Ensure value is treated as a number
    if (e.target.checked) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter((id) => id !== fileId));
    }
  };

  const handleGetFileStreamUrl = async (fileName) => {
    dispatch(fetchFileStreamUrl(projectId, fileName));
  };

  const handleDeleteFiles = async () => {
    if (selectedFiles.length === 0) {
      alert("No files selected for deletion.");
      return;
    }

    if (window.confirm("Are you sure you want to delete these files? This action cannot be undone!")) {
      const res = await dispatch(deleteFiles(projectId, selectedFiles));
      if (res.ok) {
        await dispatch(fetchFiles(projectId));
        setSelectedFiles([]);
      } else {
        alert("Failed to delete files.");
      }
    }
  };

  return (
    <section className="container w-full px-4 overflow-x-auto">
      {file && file.streamUrl && (

        <div className="w-full space-y-4">
          <p className="text-sm text-primary">Playing: <span className="italic font-semibold text-neutral-200">{file.metadata.name}</span></p>
          <AudioPlayer />
        </div>

      )}

      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="mb-2 text-xl font-extrabold text-center uppercase pointer-events-none lg:text-left text-neutral-300">
            Files on this Project
          </h2>
          <p className="text-sm italic text-neutral-400">Click a song title to play it </p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          {selectedFiles.length > 0 && (
            <button
              onClick={handleDeleteFiles}
              className="flex items-center w-1/2 px-5 py-2 text-sm transition-colors duration-200 bg-red-600 rounded-md hover:bg-red-600/90 text-neutral-200 sm:w-auto"
            >
              <Ban size={24} className="mr-2 " />
              <span>Delete Selected</span>
            </button>
          )}
          <button className="flex items-center w-1/2 px-5 py-2 text-sm transition-colors duration-200 rounded-md text-neutral-800 bg-primary hover:bg-primary/90 sm:w-auto">
            <Download size={24} className="mr-2 " />
            <span>Download All</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col mt-6 ">
        <div className="overflow-x-auto ">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden border border-neutral-800">
              <table className="min-w-full divide-y rounded-md divide-primary">
                <thead className="bg-neutral-800 ">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 text-sm font-bold text-left  text-neutral-100">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="border rounded text-primary border-primary" onChange={toggleSelectAll} checked={selectedFiles.length === files.length} />
                        <span>File Name</span>
                      </div>
                    </th>
                    <th scope="col" className="px-12 py-3.5 text-sm font-bold text-left text-neutral-100">File Type</th>
                    <th scope="col" className="px-12 py-3.5 text-sm font-bold text-left text-neutral-100">File Size</th>
                    <th scope="col" className="px-12 py-3.5 text-sm font-bold text-left text-neutral-100">Date Uploaded</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-neutral-800 divide-primary/20">
                  {files.map((file) => (
                    <tr key={file.id}>
                      <td className="p-4 text-sm font-medium text-neutral-200 whitespace-nowrap">
                        <div className="inline-flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 border rounded bg-neutral-98d00 border-neutral-700 text-primary checked:bg-neutral-800 checked:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            checked={selectedFiles.includes(file.id)}
                            onChange={toggleSelectFile}
                            value={file.id}
                          />
                          <div className="flex items-center gap-2">
                            <File className="size-4 text-primary" />

                            <span className="transition-transform duration-200 cursor-pointer hover:scale-95" onClick={() => handleGetFileStreamUrl(file.name)}>{file.name}</span>

                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-right border border-primary/50">{parseFileType(file.type)}</td>
                      <td className="px-4 py-2 text-sm font-bold text-right border text-primary border-primary/50">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                      <td className="px-4 py-2 text-sm text-right border border-primary/50">{new Date(file.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>


    </section>
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
              buttonText={<span className="px-2 py-1 text-sm rounded-md bg-primary text-neutral-800">Add Client</span>}
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
        <div className="flex flex-col w-full gap-8">
          {/* View Project Files */}
          <section className="w-full">

            {files.length > 0 ? (
              <FilesTable files={files} projectId={project.id} />
            ) : (
              <section className="flex items-center justify-center h-64 p-8 rounded-md lg:mx-auto bg-neutral-800">
                <div className="flex flex-col items-center w-full h-full gap-4 p-12 text-sm italic border border-dashed rounded-md border-neutral-400 text-neutral-300">
                  <File size={64} className="text-primary/70" />
                  No files uploaded for this project. Shall we start?
                </div>
              </section>
            )}
          </section>
          {/* Upload Files */}
          <section className="container space-y-2">
            <h2 className="mb-6 text-xl font-extrabold text-center uppercase pointer-events-none lg:text-left text-neutral-300">
              Upload File(s)
            </h2>
            <FileUploader className="w-full max-w-2xl p-10 text-sm border border-dashed rounded-md cursor-pointer lg:p-16 border-neutral-200 lg:text-base" projectId={project.id} />
          </section>
        </div>
      </div>
    </div>
  );
};
export default ViewSingleProjectPage;
