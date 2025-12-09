import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from "react-router-dom";

export default function Admin() {
    const queryClient = useQueryClient();

    // États pour création et modification
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
    const [editUser, setEditUser] = useState(null);

    // Mutation création
    const createUserMutation = useMutation({
        mutationFn: async (user) => {
            const token = localStorage.getItem('accessToken');
            return await axios.post('http://localhost:3000/api/users', user, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['listUser']);
            setNewUser({ name: '', email: '', password: '' });
        }
    });

    // Mutation modification
    const updateUserMutation = useMutation({
        mutationFn: async (user) => {
            const token = localStorage.getItem('accessToken');
            return await axios.put(`http://localhost:3000/api/users/${user.id}`, user, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['listUser']);
            setEditUser(null);
        }
    });

    // Mutation suppression
    const deleteUserMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('accessToken');
            return await axios.delete(`http://localhost:3000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['listUser']);
        }
    });

    // Récupérer le user connecté
    const { data: currentUser, isLoading: userLoading, isError: userError } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('No token found');
            const res = await axios.get('http://localhost:3000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    // Liste des utilisateurs
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['listUser'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            const res = await axios.get('http://localhost:3000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    useEffect(() => {
        console.log("Users:", users);
    }, [users]);

    if (userLoading || usersLoading) return <p>Loading...</p>;
    if (userError) return <p>Erreur lors de la récupération du profil</p>;

    return (
        <div className='px-20 py-5'>
            <h1 className="text-2xl font-bold">Panel Admin</h1>
            <p>Connecté en tant que : {currentUser.name}</p>

            <h2 className='text-xl mt-4'>Liste d'utilisateurs</h2>
           <ol className='flex gap-4 flex-col mt-4'>
                {users?.length > 0 && users.map(user => (
                    <li key={user.id} className='flex justify-between items-center'>
                    <span>{user.name}, Email: {user.email}</span>
                    <div className='flex gap-2'>
                        <button
                        className='px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600'
                        onClick={() => setEditUser(user)}
                        >
                        Modifier
                        </button>

                        <button
                        className='px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700'
                        onClick={() => {
                            if (window.confirm(`Supprimer ${user.name} ?`)) {
                            deleteUserMutation.mutate(user.id);
                            }
                        }}
                        >
                        Supprimer
                        </button>
                    </div>
                    </li>
                ))}
            </ol>

            {/* FORMULAIRE CREATE / EDIT */}
            <h2 className='text-xl mt-4'>{editUser ? 'Modifier un utilisateur' : 'Créer un utilisateur'}</h2>

            <input
                placeholder="Nom"
                value={editUser ? editUser.name : newUser.name}
                onChange={e => {
                    if (editUser) setEditUser({ ...editUser, name: e.target.value })
                    else setNewUser({ ...newUser, name: e.target.value })
                }}
                className='block my-2 p-2 border'
            />

            <input
                placeholder="Email"
                value={editUser ? editUser.email : newUser.email}
                onChange={e => {
                    if (editUser) setEditUser({ ...editUser, email: e.target.value })
                    else setNewUser({ ...newUser, email: e.target.value })
                }}
                className='block my-2 p-2 border'
            />

            <input
                type="password"
                placeholder="Mot de passe"
                value={editUser ? editUser.password || '' : newUser.password}
                onChange={e => {
                    if (editUser) setEditUser({ ...editUser, password: e.target.value })
                    else setNewUser({ ...newUser, password: e.target.value })
                }}
                className='block my-2 p-2 border'
            />

            <div className='mt-2'>
                <button
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                    onClick={() => {
                        if (editUser) updateUserMutation.mutate(editUser)
                        else createUserMutation.mutate(newUser)
                    }}
                >
                    {editUser ? 'Mettre à jour' : 'Créer'}
                </button>

                {editUser && (
                    <button
                        className='ml-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500'
                        onClick={() => setEditUser(null)}
                    >
                        Annuler
                    </button>
                )}
            </div>

            {/* Bouton pour revenir à /me */}
            <Link
                to="/me"
                className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Retour à Mon Profil
            </Link>
        </div>
    );
}
