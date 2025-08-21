# GemCraft V2 - Assistants IA Personnalisés

GemCraft V2 est une plateforme SaaS complète pour créer, gérer et partager des assistants IA personnalisés. Chaque "Gem" devient un assistant expert configurable avec données, prompt et interface dédiée.

## ✨ Fonctionnalités Principales

### 🔐 Authentification & Comptes
- Connexion via email avec Supabase Auth
- Dashboard personnalisé par utilisateur
- Gestion privée et sécurisée des Gems

### 💎 Gestion des Gems
- Création d'assistants IA personnalisés
- Templates prédéfinis (Analyseur de produits, Conseiller financier, etc.)
- Configuration avancée (modèles IA, température, style de réponse)
- Gems publics partageables dans la galerie communautaire

### 💬 Chat Intelligent
- Interface de chat moderne et responsive
- Historique complet des conversations
- Sessions nommées et organisées
- Support multi-tours avec contexte

### 📊 Multi-datasets (à venir)
- Import de fichiers CSV, Excel, PDF, TXT
- Base de connaissances unifiée
- Recherche sémantique avec RAG
- Visualisations automatiques

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ et bun
- Compte Supabase
- Clés API pour les modèles IA (optionnel)

### Installation

1. **Cloner et installer les dépendances**
```bash
cd gemcraft-v2
bun install
```

2. **Configuration Supabase**

Créez un projet Supabase et configurez :

a) **Créer les tables** : Exécutez le script SQL dans `supabase-schema.sql`

b) **Variables d'environnement** : Copiez `.env.example` vers `.env`
```bash
cp .env.example .env
```

Remplissez avec vos valeurs Supabase :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

3. **Lancer l'application**
```bash
bun dev
```

L'application sera disponible sur `http://localhost:5173`

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── auth/           # Authentification
│   ├── chat/           # Interface de chat
│   ├── layout/         # Layout et navigation
│   └── ui/             # Composants UI (Shadcn)
├── contexts/           # Contextes React
├── hooks/              # Hooks personnalisés
├── lib/                # Configuration et utilitaires
├── pages/              # Pages principales
├── types/              # Types TypeScript
└── App.tsx             # Point d'entrée
```

## 🗄️ Architecture Technique

### Frontend
- **React 19** + **Vite** pour le développement moderne
- **TypeScript** pour la sécurité des types
- **Tailwind CSS V4** + **Shadcn/UI** pour le design
- **React Router** pour la navigation
- **React Query** pour la gestion d'état serveur

### Backend
- **Supabase** pour :
  - Authentification utilisateur
  - Base de données PostgreSQL
  - Stockage de fichiers
  - Recherche vectorielle (à venir)
  - Row Level Security (RLS)

### IA
- Support multi-modèles via OpenRouter :
  - `google/gemini-2.0-flash-exp:free`
  - `deepseek/deepseek-r1-0528:free`
- Système de prompts dynamiques par Gem
- RAG avec indexation vectorielle (à venir)

## 📋 Roadmap de Développement

### ✅ Phase 1 - Base (Terminé)
- [x] Configuration projet React/Vite + Tailwind + Shadcn
- [x] Configuration Supabase complète
- [x] Système d'authentification
- [x] Dashboard utilisateur
- [x] Création et gestion des Gems
- [x] Interface de chat fonctionnelle
- [x] Galerie communautaire

### 🚧 Phase 2 - IA & Données (En cours)
- [ ] Intégration modèles IA (Gemini, DeepSeek)
- [ ] Upload et gestion multi-formats (CSV, PDF, Excel)
- [ ] Indexation vectorielle avec Supabase Vector
- [ ] Recherche sémantique (RAG)
- [ ] Génération de graphiques automatique

### 📅 Phase 3 - Avancé (À venir)
- [ ] Personnalisation avancée des réponses
- [ ] Export des conversations (PDF, Markdown)
- [ ] Système de partage et clonage de Gems
- [ ] Thème sombre complet
- [ ] Animations et micro-interactions
- [ ] Système de notifications

## 🎨 Design System

GemCraft utilise un design system cohérent basé sur :
- **Palette de couleurs** : Système OKLCH pour les couleurs modernes
- **Typographie** : Inter (sans-serif) + Playfair Display (serif)
- **Composants** : Shadcn/UI avec customisations
- **Responsive** : Mobile-first avec breakpoints optimisés
- **Accessibilité** : Support complet ARIA et navigation clavier

## 🔧 Configuration Avancée

### Variables d'Environnement Complètes

```env
# Supabase (Obligatoire)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key

# OpenAI (Optionnel)
VITE_OPENAI_API_KEY=sk-votre-cle-openai

# OpenRouter (Optionnel)
VITE_OPENROUTER_API_KEY=sk-or-votre-cle-openrouter
```

### Configuration Supabase

1. **Activer les extensions** (dans SQL Editor) :
```sql
CREATE EXTENSION IF NOT EXISTS "vector";
```

2. **Configurer l'authentification** :
   - Aller dans Authentication > Settings
   - Activer "Enable email confirmations" si souhaité
   - Configurer les URLs de redirection

3. **Row Level Security** : Déjà configurée dans le schema SQL

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Issues** : [GitHub Issues](https://github.com/votre-repo/gemcraft-v2/issues)
- **Documentation** : Ce README et les commentaires dans le code
- **Community** : Discussions GitHub

---

## 🚀 Prochaines Étapes

Pour continuer le développement :

1. **Intégrer les modèles IA** : Connecter OpenAI/OpenRouter API
2. **Upload de fichiers** : Implémenter le système d'upload avec Supabase Storage
3. **RAG & Vector Search** : Ajouter l'indexation et recherche vectorielle
4. **Charts automatiques** : Intégrer Chart.js pour les visualisations
5. **Thème sombre** : Finaliser le système de thème

Le projet est structuré pour faciliter ces ajouts avec une architecture modulaire et des types TypeScript complets.