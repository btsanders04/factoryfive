import {
  Home,
  User,
  Image,
  CreditCard,
  DollarSign,
  Drill,
  Settings,
  HelpCircle,
  Calendar,
  CircleDashed,
  Puzzle,
} from "lucide-react";

export const comingsoon = {
  link: "/comingsoon",
  name: "Coming Soon",
};

export const MAIN_ROUTES = {
  dashboard: {
    link: "/dashboard",
    name: "Dashboard",
    icon: <Home size={20} />,
  },
  progress: {
    link: "/progress",
    name: "Progress",
    icon: <CircleDashed size={20}></CircleDashed>,
  },
  calendar: {
    link: "/calendar",
    name: "Calendar",
    icon: <Calendar size={20} />,
  },
  buildlog: {
    link: "/buildlog",
    name: "Build Log",
    icon: <User size={20} />,
  },
  budget: {
    link: "/budget",
    name: "Budget",
    icon: <DollarSign size={20} />,
  },
  transactions: {
    link: "/transactions",
    name: "Transactions",
    icon: <CreditCard size={20} />,
  },
  parts: {
    link: "/parts",
    name: "Parts",
    icon: <Puzzle size={20} />,
  },
  tools: {
    link: "/tools",
    name: "Tools",
    icon: <Drill size={20} />,
  },
  photos: {
    link: "/photos",
    name: "Photos",
    // eslint-disable-next-line jsx-a11y/alt-text
    icon: <Image size={20} />,
  },
  settings: {
    link: "/settings",
    name: "Settings",
    icon: <Settings size={20} />,
  },
  help: {
    link: "/help",
    name: "Help & Support",
    icon: <HelpCircle size={20} />,
  },
};
