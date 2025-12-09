import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Me() {
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        return res.data;
      } catch (err) {
        throw new Error(err.response?.data?.error || "Failed to fetch user");
      }
    },
  });

  if (isLoading) return <p>Loading user data...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="px-20 py-5">
      <h1 className="text-2xl font-bold">Mon Profil</h1>
      <p>Bienvenue, {user.firstname} {user.lastname}</p>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.verified || "Utilisateur"}</p>

      {user.verified === 1 && (
        <Link
          to="/admin"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Passer en mode Admin
        </Link>
      )}
    </div>
  );
}

