import type { CSSProperties } from "react";
import type { IconType } from "react-icons";

import { FaCss3Alt, FaHtml5, FaJava } from "react-icons/fa";

import {
  SiAndroid,
  SiFirebase,
  SiJavascript,
  SiKotlin,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
  SiBootstrap,
} from "react-icons/si";

import { TbBrandCSharp } from "react-icons/tb";

import { cn } from "@/lib/utils";

type TechnologyDefinition = {
  icon: IconType;
  color: string;
  darkColor?: string;
  aliases: readonly string[];
};

const technologies: TechnologyDefinition[] = [
  {
    icon: SiBootstrap,
    color: "#7952B3",
    aliases: ["bootstrap", "bootstrap css"],
  },
  {
    icon: SiPython,
    color: "#3776AB",
    aliases: ["python", "py"],
  },

  {
    icon: SiFirebase,
    color: "#FFCA28",
    aliases: ["firebase", "firebase database", "firebase db"],
  },
  {
    icon: SiNodedotjs,
    color: "#5FA04E",
    aliases: ["node", "nodejs", "node.js", "node js"],
  },

  {
    icon: SiTypescript,
    color: "#3178C6",
    aliases: ["typescript", "type script", "ts"],
  },

  {
    icon: SiJavascript,
    color: "#F7DF1E",
    aliases: ["javascript", "java script", "js", "ecmascript"],
  },

  {
    icon: SiPhp,
    color: "#777BB4",
    aliases: ["php"],
  },

  {
    icon: TbBrandCSharp,
    color: "#512BD4",
    aliases: ["c#", "csharp", "c sharp"],
  },

  {
    icon: SiReact,
    color: "#61DAFB",
    aliases: ["react", "reactjs", "react.js", "react js"],
  },

  {
    icon: SiNextdotjs,
    color: "#000000",
    darkColor: "#FFFFFF",
    aliases: ["next", "nextjs", "next.js", "next js"],
  },

  {
    icon: SiTailwindcss,
    color: "#06B6D4",
    aliases: ["tailwind", "tailwindcss", "tailwind css"],
  },

  {
    icon: FaHtml5,
    color: "#E34F26",
    aliases: ["html", "html5", "html 5"],
  },

  {
    icon: FaCss3Alt,
    color: "#1572B6",
    aliases: ["css", "css3", "css 3"],
  },

  {
    icon: SiAndroid,
    color: "#3DDC84",
    aliases: ["android", "android sdk"],
  },

  {
    icon: FaJava,
    color: "#ED8B00",
    aliases: ["java"],
  },

  {
    icon: SiKotlin,
    color: "#7F52FF",
    aliases: ["kotlin", "kt"],
  },

  {
    icon: SiTensorflow,
    color: "#FF6F00",
    aliases: ["tensorflow", "tensor flow", "tf"],
  },

  {
    icon: SiPostgresql,
    color: "#4169E1",
    aliases: ["postgresql", "postgres", "postgres sql", "pgsql"],
  },

  {
    icon: SiMysql,
    color: "#4479A1",
    aliases: ["mysql", "my sql"],
  },

  {
    icon: SiMongodb,
    color: "#47A248",
    aliases: ["mongodb", "mongo", "mongo db"],
  },
];

function normalizeTechnologyName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/#/g, "sharp")
    .replace(/[^a-z0-9]+/g, "");
}

const technologyAliases = new Map<string, TechnologyDefinition>();

for (const technology of technologies) {
  for (const alias of technology.aliases) {
    technologyAliases.set(normalizeTechnologyName(alias), technology);
  }
}

function findTechnology(iconKey?: string, name?: string) {
  const candidates = [iconKey, name];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const technology = technologyAliases.get(
      normalizeTechnologyName(candidate),
    );

    if (technology) {
      return technology;
    }
  }

  return null;
}

type TechIconProps = {
  iconKey?: string;
  name?: string;
  className?: string;
};

export function TechIcon({ iconKey, name, className }: TechIconProps) {
  const technology = findTechnology(iconKey, name);

  /*
   * Don't show an incorrect generic
   * </> icon for unknown technologies.
   *
   * Add the technology to the registry
   * above when introducing a new one.
   */
  if (!technology) {
    return null;
  }

  const Icon = technology.icon;

  const style = {
    "--technology-light": technology.color,

    "--technology-dark": technology.darkColor ?? technology.color,
  } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      style={style}
      className="inline-flex shrink-0 items-center justify-center text-[var(--technology-light)] dark:text-[var(--technology-dark)]"
    >
      <Icon className={cn("size-4", className)} />
    </span>
  );
}
