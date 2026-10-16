
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronDown } from "lucide-react";
import { getCurrentUser, logoutUser } from "../services/auth.service";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      if (!localStorage.getItem("accessToken")) return;

      try {
        const response = await getCurrentUser();
        const body = response?.data ?? response;
        const currentUser =
          body?.user ?? body?.data?.user ?? body?.data ?? body;

        if (active && (currentUser?.name || currentUser?.fullName)) {
          setUser({
            ...currentUser,
            name: currentUser.name ?? currentUser.fullName,
          });
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
        if (active) setUser(null);
      }
    };

    loadUser();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
          <FileText size={19} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          ResuMatch
        </span>
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        <Link to="/" className="text-sm font-medium text-blue-700">
          Home
        </Link>
      </nav>

      {user ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
              {user.name.trim().charAt(0).toUpperCase()}
            </span>
            <span className="hidden text-sm text-slate-700 sm:inline">
              {user.name}
            </span>
            <ChevronDown size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
}
