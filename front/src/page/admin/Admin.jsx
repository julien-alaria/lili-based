import { listUsersExample } from '@/api/auth'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';

export default function Admin() {
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
