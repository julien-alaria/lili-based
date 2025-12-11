import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/config";

export default function Restaurateurs() {
  // user connecté
  const {
    data: currentUser,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/api/auth/me");
      return res.data;
    },
  });

  // liste des restaurateurs
  const {
    data: restaurateurs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurateurs"],
    queryFn: async () => {
      const res = await api.get("/api/restaurateurs");
      return res.data;
    },
  });

  if (isLoading || userLoading) return <p>Chargement...</p>;
  if (isError || userError)
    return <p>Erreur lors de la récupération des restaurateurs</p>;

  return (
    <div className="px-10 py-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Liste des restaurateurs</h1>
        {currentUser && (
          <div className="flex items-center gap-4">
            <span>Connecté en tant que : {currentUser.name}</span>
          </div>
        )}
      </div>

      <ul className="mt-4">
        {restaurateurs.map((resto) => (
          <li
            key={resto.id}
            className="py-2 border-b flex justify-between items-center"
          >
            <span>
              {resto.raison_sociale} ({resto.ville} {resto.code_postal})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
