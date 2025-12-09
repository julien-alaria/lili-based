import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useRouteError } from "react-router-dom";
import './index.css'
import Header from "./layout/Header";
import Login from "./page/auth/login";
import Home from "./page/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Register from "./page/auth/register";
import Admin from "./page/admin/Admin.jsx"
import Me from "./page/Me.jsx"
// Point d’entrée React / Router

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient} >
      <Header />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/me" element={<Me />} />

      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>
);
