# Guide de Configuration IA - GemCraft V2

Ce guide vous aidera à configurer les services IA pour utiliser de vraies réponses d'IA dans GemCraft V2.

## 🚀 Aperçu

GemCraft V2 supporte plusieurs providers IA :
- **OpenRouter** (Recommandé) : Accès aux modèles Gemini 2.0 Flash et DeepSeek R1 **gratuits**
- **OpenAI** (Optionnel) : Accès direct aux modèles GPT (payant)

## 📋 Étapes de Configuration

### 1. Obtenir une clé API OpenRouter (Gratuit)

1. Rendez-vous sur [OpenRouter](https://openrouter.ai/keys)
2. Créez un compte gratuit
3. Générez une nouvelle clé API
4. Copiez votre clé (elle commence par `sk-or-v1-...`)

### 2. Configurer les Variables d'Environnement

1. Dans le dossier racine du projet, créez un fichier `.env` (s'il n'existe pas)
2. Ajoutez vos clés API :

```bash
# Configuration Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Configuration OpenRouter (Recommandé)
VITE_OPENROUTER_API_KEY=sk-or-v1-votre-cle-openrouter

# Configuration OpenAI (Optionnel)
VITE_OPENAI_API_KEY=sk-votre-cle-openai
```

### 3. Redémarrer le Serveur de Développement

```bash
npm run dev
# ou
bun dev
```

## 🤖 Modèles Disponibles

### Modèles Gratuits (via OpenRouter)

| Modèle | Provider | Context | Max Tokens | Description |
|--------|----------|---------|------------|-------------|
| `google/gemini-2.0-flash-exp:free` | Google | 1M | 8K | Gemini 2.0 Flash - Rapide et performant |
| `deepseek/deepseek-r1-0528:free` | DeepSeek | 128K | 4K | DeepSeek R1 - Excellence en raisonnement |

### Modèles Payants (via OpenRouter)

| Modèle | Provider | Context | Max Tokens | Prix |
|--------|----------|---------|------------|------|
| `openai/gpt-3.5-turbo` | OpenAI | 16K | 4K | $0.0005/$0.0015 per 1K tokens |
| `openai/gpt-4o-mini` | OpenAI | 128K | 16K | $0.00015/$0.0006 per 1K tokens |

## ⚙️ Interface de Configuration

1. Accédez à `/ai-config` dans l'application
2. L'interface comprend 3 onglets :
   - **Configuration** : Gérer vos clés API
   - **Modèles Disponibles** : Voir les spécifications des modèles
   - **Tests de Connexion** : Tester la connectivité

## 🧪 Tester la Connexion

1. Allez dans l'onglet "Tests de Connexion"
2. Cliquez sur "Tester Tous les Modèles" ou testez individuellement
3. Vérifiez que les modèles affichent un statut ✅ vert

## 🔧 Utilisation dans les Gems

1. Lors de la création d'un Gem, choisissez le modèle IA désiré
2. Configurez les paramètres :
   - **Température** : Créativité des réponses (0.1 = conservateur, 0.9 = créatif)
   - **Max Tokens** : Longueur maximale des réponses
3. Le Gem utilisera automatiquement l'IA pour générer des réponses

## 🛠️ Résolution de Problèmes

### Erreur "Clé API invalide"
- Vérifiez que votre clé API est correctement copiée dans `.env`
- Assurez-vous qu'elle commence par `sk-or-v1-` pour OpenRouter
- Redémarrez le serveur de développement

### Erreur "Limite de taux atteinte"
- Attendez quelques minutes avant de refaire des requêtes
- Les modèles gratuits ont des limites de débit

### Erreur "Modèle non disponible"
- Vérifiez que le modèle est bien supporté dans la liste
- Certains modèles peuvent être temporairement indisponibles

### Erreurs réseau
- Vérifiez votre connexion internet
- Certains firewalls peuvent bloquer les requêtes vers OpenRouter

## 💡 Conseils d'Utilisation

### Choix du Modèle
- **Gemini 2.0 Flash** : Excellent pour la plupart des tâches, rapide et gratuit
- **DeepSeek R1** : Parfait pour le raisonnement complexe et l'analyse
- **GPT-4o Mini** : Équilibre qualité/prix pour les cas avancés

### Optimisation des Prompts
- Soyez spécifique dans vos prompts système
- Utilisez des exemples concrets
- Testez différents niveaux de température

### Gestion des Coûts
- Commencez avec les modèles gratuits
- Surveillez votre usage via l'interface OpenRouter
- Ajustez les `maxTokens` selon vos besoins

## 🔐 Sécurité

- Ne jamais exposer vos clés API dans le code source
- Utilisez toujours des variables d'environnement
- Régénérez vos clés si vous soupçonnez une compromission
- Les clés sont stockées côté client - utilisez HTTPS en production

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez cette documentation
2. Testez via l'interface `/ai-config`
3. Consultez les logs de la console browser (F12)
4. Vérifiez la [documentation OpenRouter](https://openrouter.ai/docs)

---

**Bon développement avec GemCraft V2 ! 🚀**