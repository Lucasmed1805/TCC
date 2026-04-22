import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/AuthContext";
import Navbar from "@/components/Navbar";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"           element={<Index />} />
                <Route path="/tccs"       element={<TCCList />} />
                <Route path="/tcc/:id"    element={<TCCDetail />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/login"      element={<Login />} />
                <Route path="/cadastro"   element={<Cadastro />} />
                <Route path="/solicitar"  element={<Solicitar />} />
                <Route path="/admin"      element={<Admin />} />
                <Route path="/perfil"     element={<Perfil />} />
                <Route path="*"           element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;