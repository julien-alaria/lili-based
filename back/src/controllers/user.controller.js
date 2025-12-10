import UserService from '../services/user.service.js';

export async function listUsers(c) {
  try {
    const users = UserService.list();
    return c.json(users);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Impossible de récupérer les utilisateurs' }, 500);
  }
}

export async function getUser(c) {
  try {
    const id = c.req.param('id');
    const user = UserService.get(id);
    if (!user) return c.json({ error: 'Utilisateur non trouvé' }, 404);
    return c.json(user);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Erreur lors de la récupération de l’utilisateur' }, 500);
  }
}

export async function createUser(c) {
  try {
    const data = await c.req.json();
    console.log("Données reçues :", data);

    const user = await UserService.create(data);
    return c.json(user, 201);
  } catch (error) {
    console.error("Erreur dans createUser :", error);
    return c.json({ error: error.message }, 400);
  }
}

export async function updateUser(c) {
  try {
    const id = c.req.param('id');
    const data = await c.req.json(); // { name, email }
    UserService.update({ id, ...data });
    return c.json({ message: 'Utilisateur mis à jour' });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Impossible de mettre à jour l’utilisateur' }, 400);
  }
}

export async function deleteUser(c) {
  try {
    const id = c.req.param('id');
    UserService.delete(id);
    return c.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Impossible de supprimer l’utilisateur' }, 400);
  }
}