// Script de test pour l'intégration IA
import { aiService } from './src/lib/aiService.js'

async function testAIIntegration() {
  console.log('🧪 Test d\'intégration IA - GemCraft V2')
  console.log('=========================================')
  
  // Test 1: Vérifier les modèles disponibles
  console.log('\n📋 Modèles disponibles:')
  const models = aiService.getAvailableModels()
  models.forEach(model => {
    console.log(`  - ${model}`)
  })
  
  // Test 2: Vérifier la configuration des clés API
  console.log('\n🔑 Configuration des clés API:')
  const openrouterKey = process.env.VITE_OPENROUTER_API_KEY
  const openaiKey = process.env.VITE_OPENAI_API_KEY
  
  console.log(`  - OpenRouter: ${openrouterKey ? '✅ Configurée' : '❌ Manquante'}`)
  console.log(`  - OpenAI: ${openaiKey ? '✅ Configurée' : '❌ Manquante'}`)
  
  // Test 3: Tester une requête IA simple (si clé disponible)
  if (openrouterKey) {
    console.log('\n🤖 Test de requête IA simple...')
    try {
      const response = await aiService.generateResponse({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          { role: 'user', content: 'Réponds simplement "OK" pour tester la connexion.' }
        ],
        systemPrompt: 'Tu es un assistant de test. Réponds brièvement.',
        temperature: 0.1,
        maxTokens: 10
      })
      
      console.log('✅ Réponse reçue:', response.content)
      console.log('📊 Usage:', response.usage)
      console.log('🎯 Modèle utilisé:', response.model)
      
    } catch (error) {
      console.log('❌ Erreur lors du test:', error.message)
      console.log('Type d\'erreur:', error.type)
    }
  } else {
    console.log('\n⚠️  Clé OpenRouter manquante, test de requête ignoré')
    console.log('   Ajoutez VITE_OPENROUTER_API_KEY dans votre fichier .env')
  }
  
  console.log('\n✨ Test terminé!')
}

// Simuler l'environnement de variables
if (!globalThis.process) {
  globalThis.process = { env: {} }
}

// Simuler import.meta.env pour Node.js
if (!globalThis.import) {
  globalThis.import = {
    meta: {
      env: {
        VITE_OPENROUTER_API_KEY: process.env.VITE_OPENROUTER_API_KEY,
        VITE_OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY
      }
    }
  }
}

// Simuler l'objet window pour les headers
if (!globalThis.window) {
  globalThis.window = {
    location: {
      origin: 'http://localhost:5173'
    }
  }
}

// Simuler fetch pour Node.js (utiliser node-fetch si disponible)
if (!globalThis.fetch) {
  try {
    const { default: fetch } = await import('node-fetch')
    globalThis.fetch = fetch
  } catch (e) {
    console.log('⚠️  node-fetch non disponible, test de requête sera ignoré')
    globalThis.fetch = () => Promise.reject(new Error('fetch non disponible'))
  }
}

// Exécuter le test
testAIIntegration().catch(console.error)