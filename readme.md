
1. Authentification et gestion de session
Arrivée sur le site :

L’utilisateur arrive sur /. Le Header lit le token depuis le contexte Auth (initialisé à partir de localStorage.accessToken) et affiche soit “Connexion / Inscription”, soit “Déconnexion”.​

La page Home peut lister les utilisateurs (GET /api/users) via React Query et Axios, en utilisant l’instance api (baseURL + interceptor JWT).​

Inscription (/auth/register) :

Front : register.jsx envoie email, password, firstname, lastname à POST /api/auth/register via register(data).

Back : auth.router valide le body avec Zod, puis auth.service.register :

vérifie que l’email n’existe pas encore (findUserByEmail),

concatène firstname + lastname en name,

hash le mot de passe avec hashPassword,

insère dans users(email, password, name, verified, role) avec verified = 0, role = 'association'.​

Connexion (/auth/login) :

Front : login.jsx envoie email/password à POST /api/auth/login via apiLogin, puis :

reçoit { accessToken, refreshToken, user },

appelle authLogin(token) du contexte pour mettre à jour localStorage.accessToken + l’état global token,

stocke aussi role dans localStorage,

redirige en fonction du rôle : /admin, /association ou /restaurateur.​​

Back : auth.service.login :

récupère l’utilisateur par email,

compare les mots de passe hashés via comparePassword,

génère un JWT avec generateToken(user) contenant userId, email, role et une date d’expiration, plus un refresh token.​​

Session et affichage :

Le contexte Auth garde token à jour et le fournit au Header, qui passe instantanément à “Déconnexion” après login.

L’instance Axios api lit accessToken depuis localStorage dans un interceptor et l’envoie en Authorization: Bearer <token> sur toutes les requêtes.​

Déconnexion :

Header : le bouton “Déconnexion” appelle logout() du contexte, qui vide le localStorage et met token à null, puis navigate("/") redirige vers la page d’accueil.​

2. Sécurisation des routes backend
Middleware authGuard :

Branché sur /api/associations/* (via app.use('/api/associations/*', authGuard())).

Lit l’en-tête Authorization, valide le préfixe Bearer, vérifie le JWT avec verify(token, env.JWT_SECRET).

Récupère l’utilisateur par decoded.email (findUserByEmail) et place l’objet user dans c.set("user").

En cas d’erreur (token manquant, invalide ou expiré), renvoie 401 avec un message JSON.​

Routes principales :

POST /api/auth/register, POST /api/auth/login, GET /api/auth/me (profil connecté).

GET/POST/PUT/DELETE /api/users pour la gestion des comptes par l’admin.

GET/POST/PUT/DELETE /api/associations pour les associations (protégé par JWT).

GET /api/restaurateurs (et plus tard un CRUD complet) pour la partie restaurateurs.

3. Gestion des utilisateurs (Admin)
Côté back :

users (id, email, password, name, role, verified, created_at) stocke tous les comptes.

user.service.js gère le CRUD :

list() → SELECT id, name, email, verified, role,

create() : hash du mot de passe avec bcryptjs, insertion avec un rôle (par défaut association si non fourni),

update() : mise à jour name/email/role,

delete() : suppression par id.​

Côté front (/admin) :

Admin.jsx récupère le user connecté via GET /api/auth/me et la liste des users via GET /api/users.

La création/modification/suppression se fait via POST/PUT/DELETE /api/users en utilisant api, en invalidant le cache ['listUser'] pour rafraîchir automatiquement la liste (React Query).​

L’admin peut ainsi créer des comptes pour les associations et restaurateurs avec les bons rôles.

4. Gestion des associations
Schéma DB :

Table associations(id, user_id, raison_sociale, siret, tva, adresse, ville, code_postal, created_at) avec une clé étrangère user_id → users.id (rôle association).​

Côté back (associations.router.js) :

Toutes les routes sont montées sous /api/associations et protégées par authGuard.

GET /api/associations : renvoie la liste complète des associations.

GET /api/associations/:id : renvoie une association par id.

POST /api/associations : insère une nouvelle association avec user_id, raison_sociale et les infos d’adresse.

PUT /api/associations/:id : met à jour les champs fournis, en fusionnant avec les valeurs existantes.

DELETE /api/associations/:id : supprime une association par id.

Côté front (/association) :

Associations.jsx :

useQuery(["me"]) → /api/auth/me pour afficher “Connecté en tant que : …”.

useQuery(["associations"]) → /api/associations pour la liste.

Le formulaire de création/édition ne demande plus de user_id : handleSubmit construit le payload avec user_id = currentUser.id et envoie la requête POST ou PUT.

useMutation pour créer, mettre à jour et supprimer, en invalidant ["associations"] après chaque succès.​

5. Gestion des restaurateurs et restaurants
Schéma DB :

restaurateurs(id, user_id, raison_sociale, siret, tva, adresse, type_cuisine, nb_repas_emporte, nb_repas_sur_place, created_at).

restaurant(id, restaurateur_id, type, takeaway_stock, onsite_stock, created_at).

availability(id, restaurateur_id, date, hour, takeaway_count, onsite_count, created_at) pour les créneaux proposés.​

Côté back :

Tu as déjà les tables, et le flux est prêt pour exposer des routes /api/restaurateurs (liste CRUD similaire à associations) et /api/availability pour les créneaux.

Côté front (/restaurateur) :

Restaurateurs.jsx :

useQuery(["me"]) → /api/auth/me.

useQuery(["restaurateurs"]) → /api/restaurateurs via api pour la liste des restaurateurs.

Cette page pourra être enrichie plus tard avec du CRUD, comme pour les associations.

6. Gestion des bénéficiaires et réservations
Schéma DB :

beneficiary(id, association_id, name, birthdate, created_at) : les personnes que chaque association peut réserver.

booking(id, restaurant_id, association_id, availability_id, takeaway_count, onsite_count, created_at) : une réservation d’un créneau par une association chez un restaurateur.

booking_beneficiary(id, booking_id, beneficiary_id) : lien N:N entre réservation et bénéficiaires.​

Flux prévu (prochaines étapes) :

Un restaurateur crée des disponibilités (availability) pour un restaurant donné.

Une association connectée :

crée des bénéficiaires,

voit les disponibilités d’un ou plusieurs restaurants,

crée des booking sur ces disponibilités, en liant plusieurs bénéficiaires via booking_beneficiary.

Les contraintes de clé étrangère et les compteurs (takeaway_count, onsite_count) permettent de vérifier que les stocks ne sont pas dépassés.​

En résumé, ton projet implémente :

Un système d’auth complet avec JWT (access + refresh), Zod et Hono.

Une séparation nette des rôles (admin / association / restaurateur) et des responsabilités (Admin gère les users, associations gèrent leurs données et leurs réservations).

Un front React structuré par pages et domaines, qui consomme l’API via Axios + React Query + un contexte Auth, avec un flux de navigation propre après login/logout.