import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="container w-full p-8 mx-auto space-y-4">
      <hr />
      <div className="flex flex-col items-center justify-between gap-4 lg:gap-0 lg:flex-row">
        <a href="https://isaiahvickers.online" target="_blank" rel="noreferrer" className="font-bold hover:text-primary">Isaiah Vickers</a>
        <a href="https://github.com/izzymadethat/resonate" target="_blank" rel="noreferrer">View this site&apos;s source code</a>
        <div className="flex gap-2">
          <a href="https://github.com/izzymadethat" target="_blank" rel="noreferrer" className="hover:text-primary">
            <Github />
          </a>
          <a href="https://linkedin.com/in/isaiah-vickers" target="_blank" rel="noreferrer" className="hover:text-primary" >
            <Linkedin />
          </a>
          <a href="mailto:isaiah.vickers@outlook.com" target="_blank" rel="noreferrer" className="hover:text-primary">
            <Mail />
          </a>
        </div>
      </div>
      <hr />
    </footer>
  );
};
export default Footer;
