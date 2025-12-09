import React, { useState, useEffect } from 'react';
import { listUsersExample } from '@/api/auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function Admin() {
    const queryClient = useQueryClient();

        // Nouveau user
        const [newUser, setNewUser] = useState({ email: '', password: '', name: '' });

        const createUserMutation = useMutation({
            mutationFn: async (user) => {
                const token = localStorage.getItem('accessToken');
                return await axios.post('http://localhost:3000/api/users', user, {
                headers: { Authorization: `Bearer ${token}` }
                });
            },
            onSuccess: () => {
                // v5 accepte queryKey directement
                queryClient.invalidateQueries(['listUser']);
                setNewUser({ email: '', password: '', name: '' });
            },
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

    // Récupérer la liste des utilisateurs
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['listUser'],
        queryFn: listUsersExample
    });

    useEffect(() => {
        console.log("DATA", users);
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
                    <li key={user.id}>{user?.name}, Email: {user.email}</li>
                ))}
            </ol>

            {/* FORMULAIRE CREATE */}
            <h2 className='text-xl mt-4'>Créer un utilisateur</h2>
                <input placeholder="Nom" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                <input type="password" placeholder="Mot de passe" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
            <button onClick={() => createUserMutation.mutate(newUser)}>Créer</button>

            {/* Bouton pour revenir à /me */}
            <Link
                to="/me"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Retour à Mon Profil
            </Link>
        </div>
    );
}
