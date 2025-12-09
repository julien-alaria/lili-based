```
npm install
npm run dev
```

```
open http://localhost:3000


```
## 🗂️ Arborescence du dossier `back/`

back/
├── node_modules/
├── src/
│ ├── config/
│ │ ├── database.js
│ │ └── env.js
│ │
│ ├── controllers/
│ │ └── auth.controller.js
│ │
│ ├── middlewares/
│ │ └── authguard.js
│ │
│ ├── routes/
│ │ ├── auth.router.js
│ │ ├── auth.test.js
│ │ └── index.js
│ │
│ ├── services/
│ │ └── auth.services.js
│ │
│ ├── test/
│ │ └── setup.js
│ │
│ ├── utils/
│ │ ├── email.js
│ │ ├── email.test.js
│ │ ├── jwt.js
│ │ ├── mailer.js
│ │ └── password.js
│ │
│ └── index.js
│
├── .env
├── .gitignore
├── mydb.db
├── package-lock.json
├── package.json
├── README.md
└── vitest.config.js


1.Structure générale

projet qui suit une structure assez standard pour un backend REST moderne :

séparation config / controllers / services / routes

usage d’une base SQLite (mydb.db)

utilitaires dédiés (JWT, email, password hashing)

middleware d’authentification

tests via Vitest

                               ┌───────────────┐
                               │   Frontend    │
                               │(React, Postman)│
                               └───────┬───────┘
                                       │ HTTP Request (ex: /api/register)
                                       ▼
┌────────────────────────────────────────────────────────────┐
│                     [🟦 ROUTES]                             │
│ back/src/routes/index.js                                    │
│   • /api → authRouter                                      │
│   • /authenticated → authGuard                              │
└───────────────┬────────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────┐
│                  [🟦 AUTH ROUTER]                            │
│ back/src/routes/auth.router.js                               │
│   • POST /register, /login                                   │
│   • POST /forgot-password, /reset-password                  │
│   • POST /send-verification                                  │
│   • GET /verify/:token                                        │
│   • Valide JSON via Zod                                       │
└───────────────┬────────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────┐
│               [🟦 CONTROLLER]                                 │
│ back/src/controllers/auth.controller.js                     │
│   • register / login / forgotPassword / resetPassword       │
│   • sendVerification / verifyUserEmail                      │
│   • Appelle [🟩 authService]                                  │
│   • Retourne JSON succès / erreur                             │
└───────────────┬────────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────┐
│                [🟩 SERVICE]                                   │
│ back/src/services/auth.service.js                            │
│   • createUser / updateUser / deleteUser                     │
│   • register / login / verifyEmail                            │
│   • forgotPassword / resetPassword                            │
│   • sendEmailVerification                                     │
│   • Interagit avec :                                         │
│       - [🟥 DB] database.js                                   │
│       - [🟨 password.js]                                      │
│       - [🟨 jwt.js]                                           │
│       - [🟨 email.js] → [🟧 mailer.js]                        │
└───────────────┬────────────────────────────────────────────┘
                │
 ┌──────────────┴───────────────┐
 ▼                              ▼
[🟥 DATABASE]                  [🟨 UTILITAIRES]
back/src/config/database.js   back/src/utils/password.js
• SQLite mydb.db              • hashPassword / comparePassword
• Table users                 back/src/utils/jwt.js
• CRUD users                   • generateToken / decodeToken
                               back/src/utils/email.js
                               • sendVerificationEmail
                               • sendPasswordResetEmail
                               back/src/utils/mailer.js
                               • Nodemailer / SMTP
                               back/src/middlewares/authguard.js
                               • Vérifie JWT Bearer
                               • Injecte user dans contexte
