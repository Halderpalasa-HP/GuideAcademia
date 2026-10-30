# 🎓 EduSphere - Plateforme d'Apprentissage & Monétisation de Cours

EduSphere est une plateforme e-learning moderne (type Udemy) conçue pour l'Afrique et l'international, intégrant les paiements par **Mobile Money** (Wave, Orange Money, MTN MoMo, Moov) et **Cartes bancaires**, un **Tuteur IA contextuel**, un **Studio Formateur** et une **Gouvernance Administrateur**.

---

## 🚀 1. Télécharger le Projet sur votre Disque Local

Vous avez 2 façons simples de récupérer le code source :

### Option A : Via l'interface Google AI Studio (Le plus rapide)
1. Dans le menu en haut ou en haut à droite de Google AI Studio Build, cliquez sur **"Export"** ou l'icône de téléchargement.
2. Choisissez **"Download ZIP"** (ou **"Push to GitHub"** si connecté à votre compte GitHub).
3. Décompressez le fichier `.zip` dans le dossier de votre choix sur votre ordinateur (ex: `C:\Users\VotreNom\Projects\edusphere` ou `/Users/VotreNom/edusphere`).

---

## 🐙 2. Mettre le Projet sur votre GitHub

Ouvrez un terminal (PowerShell, Git Bash ou Terminal macOS/Linux) dans le dossier du projet décompressé :

```bash
# 1. Allez dans le dossier du projet
cd edusphere

# 2. Initialisez le dépôt Git
git init

# 3. Ajoutez tous les fichiers
git add .

# 4. Créez le premier commit
git commit -m "feat: initialisation EduSphere platform"

# 5. Renommez la branche par défaut en main
git branch -M main

# 6. Liez avec votre dépôt GitHub
# (Remplacez l'URL ci-dessous par celle de votre dépôt créé sur github.com)
git remote add origin https://github.com/VOTRE_PSEUDO_GITHUB/edusphere.git

# 7. Poussez le code sur GitHub
git push -u origin main
```

---

## 💻 3. Lancer le Projet en Local sur votre Machine

Assurez-vous d'avoir **Node.js** (version 18 ou supérieure) installé sur votre machine.

```bash
# 1. Installez les dépendances
npm install

# 2. (Optionnel) Configurez vos clés d'environnement
cp .env.example .env

# 3. Lancez le serveur de développement local
npm run dev
```

L'application sera accessible dans votre navigateur à l'adresse : **`http://localhost:3000`** (ou `http://localhost:5173`).

---

## ☁️ 4. Déployer sur Vercel en 1 Clic

1. Rendez-vous sur [vercel.com](https://vercel.com) et connectez-vous avec votre compte GitHub.
2. Cliquez sur **"Add New..."** puis **"Project"**.
3. Sélectionnez votre dépôt **`edusphere`**.
4. Vercel détecte automatiquement la configuration **Vite** :
   - **Framework Preset :** `Vite`
   - **Build Command :** `npm run build`
   - **Output Directory :** `dist`
5. *(Optionnel)* Dans **Environment Variables**, ajoutez si souhaité :
   - `VITE_GEMINI_API_KEY` = votre clé API Gemini (pour le Tuteur IA en direct).
6. Cliquez sur **"Deploy"**. Votre plateforme sera en ligne avec son URL personnalisée en moins de 60 secondes !

---

## 🧩 Rôles & Fonctionnalités Disponibles

- **Étudiant (ex: Aminata Diallo) :**
  - Catalogue avec filtres de niveaux et catégories
  - Salle de cours : Vidéos HD, visionneuse de diapositives PDF, articles markdown
  - Quizz et exercices interactifs avec notation immédiate
  - Tuteur IA Gemini 2.5 contextuel
  - Achat de cours via Wave, Orange Money, MTN MoMo, Carte
  - Notation et avis sur les cours

- **Professeur (ex: Dr. Kwesi Mensah) :**
  - Studio de création de cours modulaire (vidéos, PDF, quizz)
  - Paiement d'abonnement / pass de publication de cours (15 000 FCFA)
  - Tableau de bord de suivi de la progression des étudiants
  - Envoi d'emails et d'annonces groupées à la promotion
  - Portefeuille des gains (80% des ventes) et demandes de retrait Mobile Money

- **Administrateur (ex: Malick Ndiaye) :**
  - Ajout manuel d'étudiants
  - Bannissement et blocage temporaire d'utilisateurs
  - Attribution des rôles (Étudiant ↔ Professeur ↔ Admin)
  - Nomination d'un autre administrateur
  - Publication de cours officiels de la plateforme
  - Diffusion de codes promotionnels et bannières d'alertes
  - Encaissement des abonnements formateurs + 20% de commission sur ventes
  - Validation des virements de retraits formateurs
