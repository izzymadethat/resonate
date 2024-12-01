import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="container w-full p-8 mx-auto space-y-4">
      <hr />
      <div className="flex items-center justify-between">
        <a href="https://isaiahvickers.online" target="_blank" rel="noreferrer" className="font-bold hover:text-primary">Isaiah Vickers</a>
        <a href="https://github.com/izzymadethat/resonate" target="_blank" rel="noreferrer">View this site's source code</a>
        <div className="flex gap-2">
          <a href="https://github.com/izzymadethat" target="_blank" rel="noreferrer">
            <Github />
          </a>
          <a href="https://linkedin.com/in/isaiah-vickers" target="_blank" rel="noreferrer">
            <Linkedin />
          </a>
          <a href="mailto:isaiah.vickers@outlook.com" target="_blank" rel="noreferrer">
            <Mail />
          </a>
        </div>
      </div>
      <hr />
    </footer>
  );
};
export default Footer;
