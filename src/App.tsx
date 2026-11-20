import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/AuthContext";
import { ThemeProvider } from "@/hooks/ThemeContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import TCCList from "./pages/TCCList";
import TCCDetail from "./pages/TCCDetail";
import Categorias from "./pages/Categorias";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Solicitar from "./pages/Solicitar";
import Admin from "./pages/Admin";
import Perfil from "./pages/Perfil";
import Sobre from "./pages/Sobre";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PUBLIC_ROUTES = ["/login", "/cadastro", "/solicitar"];

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const isPublic = PUBLIC_ROUTES.includes(location.pathname);

  if (!isLoggedIn && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  if (isLoggedIn && isPublic) {
    return <Navigate to="/" replace />;
  }

  if (isPublic) {
    return (
      <Routes>
        <Route path="/login"     element={<Login />} />
        <Route path="/cadastro"  element={<Cadastro />} />
        <Route path="/solicitar" element={<Solicitar />} />
        <Route path="*"          element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"           element={<Index />} />
            <Route path="/tccs"       element={<TCCList />} />
            <Route path="/tcc/:id"    element={<TCCDetail />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/sobre"      element={<Sobre />} />
            <Route path="/admin"      element={<Admin />} />
            <Route path="/perfil"     element={<Perfil />} />
            <Route path="/perfil/:id" element={<Perfil />} />
            <Route path="*"           element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;