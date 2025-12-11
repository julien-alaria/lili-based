import React, { useState } from "react";
// import axios from "axios";
import api from "@/api/config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const API_URL = "http://localhost:3000/api/associations";
const API_URL = "/api/associations";


export default function Associations() {
  const queryClient = useQueryClient();

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

  // état du formulaire
  const [form, setForm] = useState({
    id: null,
    user_id: "",
    raison_sociale: "",
    siret: "",
    tva: "",
    numero_rue: "",
    rue: "",
    ville: "",
    code_postal: "",
  });

  const isEditing = form.id !== null;

  // LIST
  const {
    data: associations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["associations"],
    queryFn: async () => {
      const res = await api.get("/api/associations");
      return res.data;
    },
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post(API_URL, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["associations"]);
      resetForm();
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await api.put(`${API_URL}/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["associations"]);
      resetForm();
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["associations"]);
    },
  });

  const resetForm = () =>
    setForm({
      id: null,
      user_id: "",
      raison_sociale: "",
      siret: "",
      tva: "",
      numero_rue: "",
      rue: "",
      ville: "",
      code_postal: "",
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Utilisateur non chargé");
      return;
    }

    const payload = {
      user_id: currentUser.id,
      raison_sociale: form.raison_sociale,
      siret: form.siret || null,
      tva: form.tva || null,
      numero_rue: form.numero_rue || null,
      rue: form.rue || null,
      ville: form.ville || null,
      code_postal: form.code_postal || null,
    };

    if (!payload.raison_sociale) {
      alert("raison_sociale est obligatoire");
      return;
    }

    if (isEditing) {
      updateMutation.mutate({ id: form.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (asso) => {
    setForm({
      id: asso.id,
      user_id: asso.user_id || "",
      raison_sociale: asso.raison_sociale || "",
      siret: asso.siret || "",
      tva: asso.tva || "",
      numero_rue: asso.numero_rue || "",
      rue: asso.rue || "",
      ville: asso.ville || "",
      code_postal: asso.code_postal || "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette association ?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors de la récupération des associations</p>;

  return (
    <div className="px-10 py-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Associations</h1>
        {currentUser && !userLoading && !userError && (
          <div className="flex items-center gap-4">
            <span>Connecté en tant que : {currentUser.name}</span>
          </div>
        )}
      </div>

      {/* Formulaire create / update */}
      <div className="mb-6 border p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Modifier une association" : "Créer une association"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* <div>
            <label className="block text-sm font-medium">User ID *</label>
            <input
              type="number"
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium">Raison sociale *</label>
            <input
              type="text"
              name="raison_sociale"
              value={form.raison_sociale}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">SIRET</label>
            <input
              type="text"
              name="siret"
              value={form.siret}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">TVA</label>
            <input
              type="text"
              name="tva"
              value={form.tva}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Numéro de rue</label>
            <input
              type="text"
              name="numero_rue"
              value={form.numero_rue}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Rue</label>
            <input
              type="text"
              name="rue"
              value={form.rue}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Ville</label>
            <input
              type="text"
              name="ville"
              value={form.ville}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Code postal</label>
            <input
              type="text"
              name="code_postal"
              value={form.code_postal}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </div>

          <div className="col-span-2 flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {isEditing ? "Mettre à jour" : "Créer"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-1 rounded"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste */}
      <h2 className="text-xl font-semibold mb-2">Liste des associations</h2>
      <ul className="mt-2">
        {associations.map((asso) => (
          <li
            key={asso.id}
            className="py-2 border-b flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{asso.raison_sociale}</div>
              <div className="text-sm text-gray-600">
                ID: {asso.id} • User: {asso.user_id} • {asso.ville} {asso.code_postal}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                onClick={() => handleEdit(asso)}
              >
                Éditer
              </button>
              <button
                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                onClick={() => handleDelete(asso.id)}
                disabled={deleteMutation.isLoading}
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
