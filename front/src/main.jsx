import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./layout/Header";
import Login from "./page/auth/login";
import Home from "./page/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Register from "./page/auth/register";
import Admin from "./page/admin/Admin.jsx";
import Associations from "./page/users/Associations.jsx";
import Restaurateurs from "./page/users/Restaurateurs.jsx";
import { AuthProvider } from "./context/AuthContext";

// QueryClient d'abord
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

// puis root
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/association" element={<Associations />} />
          <Route path="/restaurateur" element={<Restaurateurs />} />
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
