import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/hooks/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const pageBg = isDark ? "#060e1f" : "#f0f4f8";
  const textMain = isDark ? "#ffffff" : "#0d1b2a";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";

  return (
    <div className="flex min-h-screen items-center justify-center transition-colors" style={{ background: pageBg }}>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold" style={{ color: textMain }}>404</h1>
        <p className="mb-4 text-xl" style={{ color: textMuted }}>Oops! Página não encontrada</p>
        <Link to="/" className="text-sm font-semibold underline" style={{ color: "#3b82f6" }}>
          Voltar ao início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
