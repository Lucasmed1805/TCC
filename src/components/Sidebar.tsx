import { Link, useLocation } from "react-router-dom";
import { BookOpen, LayoutDashboard, GraduationCap, FolderOpen, Bookmark, BarChart2, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/ThemeContext";

const sideItems = [
  { icon: LayoutDashboard, label: "Início",      path: "/" },
  { icon: GraduationCap,  label: "TCCs",         path: "/tccs" },
  { icon: FolderOpen,     label: "Categorias",   path: "/categorias" },
  { icon: Bookmark,       label: "Salvos",       path: "/perfil" },
  { icon: BarChart2,      label: "Estatísticas", path: "/admin", adminOnly: true },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { isDark } = useTheme();

  const handleLogout = () => { logout(); navigate("/"); };

  const bg       = isDark ? "#0b1220"                    : "#ffffff";
  const border   = isDark ? "rgba(255,255,255,0.08)"     : "rgba(15,23,42,0.08)";
  const iconCol  = isDark ? "rgba(255,255,255,0.4)"      : "rgba(15,23,42,0.4)";
  const iconAct  = "#1d4ed8";
  const logoBg   = "#1d4ed8";
  const logoIcon = "#ffffff";

  return (
    <aside
      className="hidden md:flex flex-col items-center py-4 gap-2 shrink-0"
      style={{
        width: 64,
        minHeight: "100vh",
        background: bg,
        borderRight: `1px solid ${border}`,
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center justify-center mb-4 mt-1">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: logoBg, boxShadow: "0 0 0 1px rgba(29,78,216,0.3)" }}
        >
          <BookOpen style={{ height: 18, width: 18, color: logoIcon }} />
        </div>
      </Link>

      {/* Nav items */}
      <nav className="flex flex-col items-center gap-1 flex-1 w-full px-2">
        {sideItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                title={label}
                className="relative flex items-center justify-center rounded-xl w-full transition-all"
                style={{
                  height: 44,
                  background: active ? "rgba(29,78,216,0.1)" : "transparent",
                  color: active ? iconAct : iconCol,
                }}
                onMouseEnter={e => {
                  if (!active) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.05)";
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                    style={{ background: "#1d4ed8" }}
                  />
                )}
                <Icon style={{ height: 19, width: 19 }} />
              </Link>
            );
          })}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-1 w-full px-2 mb-2">
        {isAdmin && (
          <Link
            to="/admin"
            title="Admin"
            className="flex items-center justify-center rounded-xl w-full transition-all"
            style={{ height: 44, color: iconCol }}
            onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.05)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Settings style={{ height: 19, width: 19 }} />
          </Link>
        )}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            title="Sair"
            className="flex items-center justify-center rounded-xl w-full transition-all"
            style={{ height: 44, color: "rgba(239,68,68,0.6)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut style={{ height: 19, width: 19 }} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;