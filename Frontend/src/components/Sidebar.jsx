
import { NavLink } from "react-router-dom";
import {
  House,
  ClipboardList,
  FileText,
} from "lucide-react";

const menuItems = [
  {
    name: "Home",
    path: "/",
    icon: House,
  },
  {
    name: "My Analyses",
    path: "/analyses",
    icon: ClipboardList,
  },
  {
    name: "Saved Resumes",
    path: "/resumes",
    icon: FileText,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 border-r border-slate-200 bg-white md:min-h-screen md:w-52">
      <nav className="space-y-2 p-4">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
              }`
            }
          >
            <Icon size={19} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
