```
npm install
npm run dev
```

```
open http://localhost:3000


```
## 🗂️ Arborescence du dossier `back/`

lili-based/
├─ back/
│  ├─ src/
│  │  ├─ config/
│  │  │  ├─ database.js
│  │  │  ├─ env.js
│  │  │  └─ seed.js
│  │  ├─ controllers/
│  │  │  ├─ auth.controller.js
│  │  │  └─ user.controller.js
│  │  ├─ middlewares/
│  │  │  └─ authguard.js
│  │  ├─ routes/
│  │  │  ├─ associations.router.js
│  │  │  ├─ auth.router.js
│  │  │  ├─ auth.test.js
│  │  │  ├─ index.js
│  │  │  └─ users.router.js
│  │  ├─ services/
│  │  │  ├─ associations.service.js
│  │  │  ├─ auth.service.js
│  │  │  └─ user.service.js
│  │  ├─ test/
│  │  │  └─ setup.js
│  │  ├─ utils/
│  │  │  ├─ email.js
│  │  │  ├─ email.test.js
│  │  │  ├─ jwt.js
│  │  │  ├─ mailer.js
│  │  │  └─ password.js
│  │  ├─ db.js
│  │  └─ index.js
│  ├─ .env
│  ├─ .gitignore
│  ├─ mydb.db
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  └─ vitest.config.js
├─ front/
│  ├─ public/
│  │  └─ vite.svg
│  ├─ src/
│  │  ├─ api/
│  │  │  ├─ auth.js
│  │  │  └─ config.js
│  │  ├─ assets/
│  │  │  └─ react.svg
│  │  ├─ components/
│  │  │  └─ ui/
│  │  │     ├─ button.jsx
│  │  │     ├─ card.jsx
│  │  │     └─ input.jsx
│  │  ├─ layout/
│  │  │  └─ Header.jsx
│  │  ├─ lib/
│  │  │  └─ utils.js
│  │  ├─ page/
│  │  │  ├─ admin/
│  │  │  │  └─ Admin.jsx
│  │  │  ├─ auth/
│  │  │  │  ├─ login.jsx
│  │  │  │  └─ register.jsx
│  │  │  ├─ users/
│  │  │  │  ├─ Associations.jsx
│  │  │  │  └─ Restaurateurs.jsx
│  │  │  └─ home.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ .env
│  ├─ .gitignore
│  ├─ components.json
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ jsconfig.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ README.md
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ .gitignore
├─ package-lock.json
├─ package.json
└─ readme.md
