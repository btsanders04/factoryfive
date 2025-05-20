import {
  Home,
  Image,
  CreditCard,
  DollarSign,
  Drill,
  Settings,
  HelpCircle,
  Calendar,
  CircleDashed,
  Puzzle,
  BookText,
  BarChart2,
  Scroll,
  Book
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
    icon: <Scroll size={20} />,
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
  inventory: {
    link: "/inventory",
    name: "Inventory",
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
  altStats: {
    link: "/alt-stats",
    name: "Alt Stats",
    icon: <BarChart2 size={20} />,
  },
  manual: {
    link: "/manual",
    name: "Manual",
    icon: <BookText size={20} />,
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

export const PUBLIC_ROUTES = {
  dashboard: {
    link: "/public/dashboard",
    name: "Dashboard",
    icon: <Home size={20} />,
  },
  buildlog: {
    link: "/public/buildlog",
    name: "Build Log",
    icon: <Scroll size={20} />,
  },
  photos: {
    link: "/public/photos",
    name: "Photo Gallery",
    icon: <Image size={20} />,
  },
  guestbook: {
    link: "/public/guestbook",
    name: "Guestbook",
    icon: <Book size={20} />,
  },
};