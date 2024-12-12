import HiBeautyLogo from "~/assets/logos/hi_beauty.svg";
import LumLogo from "~/assets/logos/lum_logistic.svg";
import ReempLogo from "~/assets/logos/reemp.svg";
import StartupsLabAgenciaLogo from "~/assets/logos/startups_lab_agencia.svg";
import screenshot1 from "~/assets/screenshots/1.webp";
import screenshot2 from "~/assets/screenshots/2.webp";
import screenshot3 from "~/assets/screenshots/3.webp";
import screenshot4 from "~/assets/screenshots/4.webp";

export const jobs: Job[] = [
  {
    title: "LUM Logistic",
    description:
      "Creating specialized systems for smooth logistics management, making sure resources are used efficiently.",
    role: "Frontend Engineer",
    date: "2023 - Present",
    current: true,
    color: "bg-[#3A3A3A]",
    image: LumLogo
  },
  {
    title: "Hi Beauty",
    description:
      "Played a key role in building and managing the website and internal systems, set up the tech stack, and ensured a smooth workflow for the team.",
    role: "Frontend Developer",
    date: "2022 - 2023",
    color: "bg-[#C23775]",
    image: HiBeautyLogo
  },
  {
    title: "Reemp Group",
    description:
      "Managed Flutter apps, improving performance and adding new features.",
    role: "Flutter Developer",
    date: "2021 - 2022",
    color: "bg-[#263038]",
    image: ReempLogo
  },
  {
    title: "StartupsLab Agency",
    description:
      "Contributed to building the company's website and services, created websites for clients, and worked on internal product development.",
    role: "Frontend Developer",
    date: "2020 - 2022",
    color: "bg-[#EF7D43]",
    image: StartupsLabAgenciaLogo
  }
];

export const projects: Project[] = [
  {
    title: "Hi Beauty homepage",
    image: screenshot1,
    link: "https://hibeauty.com.co/"
  },
  {
    title: "StartupsLab Agency website in progress",
    image: screenshot2,
    link: "https://startupslabagencia.vercel.app/"
  },
  {
    title: "StartupsLab EDU homepage",
    image: screenshot3,
    link: "https://startupslabedu.vercel.app/"
  },
  {
    title: "Hi Beauty app design",
    image: screenshot4,
    link: "https://apps.apple.com/co/app/hibeauty/id6511218761"
  }
];
