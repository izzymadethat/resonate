import { Pencil, Trash2 } from "lucide-react";

const menuLinks = [
  {
    id: 1,
    title: "Create a Project",
    href: "/projects/new",
  },
  {
    id: 2,
    title: "Create a Client",
    href: "/clients/new",
  },
  {
    id: 3,
    title: "View Clients",
    href: "/clients",
  },
];

const ProjectCard = () => {
  return (
    <article className="w-full bg-neutral-800 hover:bg-neutral-800/80 flex justify-between py-6 px-4  cursor-pointer rounded-md">
      <div>
        <h3 className="text-neutral-300 uppercase">Project Title</h3>
        <div className="space-y-2 md:flex md:gap-4 md:items-center">
          <p className="text-sm text-neutral-500">Project Description</p>
          <button className="bg-primary px-2 py-1 text-xs text-neutral-900 rounded-md hover:bg-primary/90">
            View Project
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button>
          <Pencil
            size={32}
            className="hover:text-neutral-300/80 p-2 text-neutral-300 rounded-md"
          />
        </button>
        <button>
          <Trash2
            size={32}
            className="bg-red-800 hover:bg-red-800/90 p-2 text-neutral-300 rounded-md"
          />
        </button>
      </div>
    </article>
  );
};

const ProjectsPage = () => {
  return (
    <div className="w-full px-8 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-4">
      <section className="md:col-span-2">
        <h1 className="text-3xl font-extrabold uppercase mb-8 text-center md:text-left">
          My<span className="text-primary">Projects</span>
        </h1>
        <div className="flex flex-col space-y-2">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
      </section>
      <aside className="bg-neutral-800 h-full flex flex-col justify-between p-12 gap-2">
        <div>
          <h3 className="text-xl font-extrabold uppercase">Quick Menu</h3>
          <hr className="w-full h-1 border-0 border-t border-neutral-700" />
          <ul className="space-y-2 my-4 text-sm">
            {menuLinks.map((link) => (
              <li
                key={link.id}
                className="hover:bg-primary hover:text-neutral-800 transition-colors duration-200 cursor-pointer rounded-md  w-full py-2 px-4"
              >
                {link.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full flex flex-col gap-2  items-center rounded-md p-8 bg-neutral-700">
          <p>Logged In As: User First Name</p>
          <button className="bg-primary px-4 py-2 text-xs text-neutral-900 rounded-md hover:bg-primary/90">
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
};
export default ProjectsPage;
