import { FileBox, Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeleteProject, fetchProjects } from "../store/projects";
import { useNavigate } from "react-router-dom";
import OpenModalButton from "./OpenModalButton";
import DeleteProjectPopup from "./DeleteProjectPopup";
import { logout } from "../store/session";
const menuLinks = [
  {
    id: 1,
    title: "Create a Project",
    href: "/projects/new",
  },
  // {
  //   id: 2,
  //   title: "Create a Client",
  //   href: "/clients/new",
  // },
  // {
  //   id: 3,
  //   title: "View Clients",
  //   href: "/clients",
  // },
];

const truncateText = (text, limit) =>
  text.length > limit ? `${text.slice(0, limit)}...` : text;

const ProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();
  return (
    <article className="flex justify-between w-full px-4 py-6 rounded-md cursor-pointer bg-neutral-800 hover:bg-neutral-800/80">
      <div>
        <h3 className="uppercase text-neutral-300">{project.title}</h3>
        <div className="space-y-2 md:flex md:gap-4 md:items-center">
          {project.description && (
            <p className="text-sm text-neutral-500">{truncateText(project.description, 25)}</p>
          )}

          <button
            className="px-2 py-1 text-xs rounded-md bg-primary text-neutral-900 hover:bg-primary/90"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            View Project
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button>
          <Pencil
            size={32}
            className="p-2 rounded-md hover:text-neutral-300/80 text-neutral-300"
            onClick={() => navigate(`/projects/${project.id}/edit`)}
          />
        </button>
        {/* TODO: Add delete functionality as open modal button */}
        <OpenModalButton
          modalComponent={<DeleteProjectPopup projectId={project.id} onDelete={onDelete} />}
          buttonText={
            <Trash2
              size={32}
              className="p-2 bg-red-800 rounded-md hover:bg-red-800/90 text-neutral-300"
            />
          }
        />

      </div>
    </article>
  );
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.allProjects);
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = async (projectId) => {
    await dispatch(fetchDeleteProject(projectId));
    await dispatch(fetchProjects());
  };

  const handleLogout = () => {
    dispatch(logout()).then(() => navigate("/"));
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 px-8 lg:px-12 lg:grid-cols-3 xl:max-w-9xl">
      <section className="xl:ml-24 lg:col-span-2 lg:max-w-2xl">
        <h1 className="mb-8 text-3xl font-extrabold text-center uppercase md:text-left">
          My<span className="text-primary">Projects</span>
        </h1>
        <div className="flex flex-col space-y-2">
          {projects.length > 0 ? (
            <>
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDelete}
                />
              ))}
            </>
          ) : (
            <div className="p-8 text-center bg-neutral-800">
              <div className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-neutral-500">
                <FileBox className="text-primary" />
                <p className="text-sm text-neutral-500">
                  You have no projects yet! Get started by creating a new
                  project
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <aside className="flex flex-col justify-between h-full gap-2 p-12 bg-neutral-800 xl:mr-24">
        <div>
          <h3 className="text-xl font-extrabold uppercase">Quick Menu</h3>
          <hr className="w-full h-1 border-0 border-t border-neutral-700" />
          <ul className="my-4 space-y-2 text-sm">
            {menuLinks.map((link) => (
              <li
                key={link.id}
                className="w-full px-4 py-2 transition-colors duration-200 rounded-md cursor-pointer hover:bg-primary hover:text-neutral-800"
                onClick={() => navigate(link.href)}
              >
                {link.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center w-full gap-2 p-8 rounded-md bg-neutral-700">
          <p>Logged In As: {user?.username}</p>
          <button className="px-4 py-2 text-xs rounded-md bg-primary text-neutral-900 hover:bg-primary/90" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
};
export default ProjectsPage;
