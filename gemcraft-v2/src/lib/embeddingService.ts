import { 
  ChunkData, 
  EmbeddingProvider, 
  EMBEDDING_PROVIDERS,
  IndexingStats
} from '../types/rag.types'

export class EmbeddingService {
  private static instance: EmbeddingService
  private openaiApiKey: string | null = null
  private geminiApiKey: string | null = null

  constructor() {
    // Récupérer les clés API depuis les variables d'environnement ou le localStorage
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai_api_key')
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key')
  }

  static getInstance(): EmbeddingService {
    if (!this.instance) {
      this.instance = new EmbeddingService()
    }
    return this.instance
  }

  // Configuration des clés API
  setOpenAIApiKey(apiKey: string): void {
    this.openaiApiKey = apiKey
    localStorage.setItem('openai_api_key', apiKey)
  }

  setGeminiApiKey(apiKey: string): void {
    this.geminiApiKey = apiKey
    localStorage.setItem('gemini_api_key', apiKey)
  }

  getOpenAIApiKey(): string | null {
    return this.openaiApiKey
  }

  getGeminiApiKey(): string | null {
    return this.geminiApiKey
  }

  // Vérifier si un provider est configuré
  isProviderConfigured(providerKey: keyof typeof EMBEDDING_PROVIDERS): boolean {
    const provider = EMBEDDING_PROVIDERS[providerKey]
    if (provider.name === 'OpenAI') {
      return !!this.openaiApiKey
    } else if (provider.name === 'Google Gemini') {
      return !!this.geminiApiKey
    }
    return false
  }

  // Vérifier si l'API key est configurée (pour compatibilité)
  isConfigured(): boolean {
    return !!this.openaiApiKey || !!this.geminiApiKey
  }

  // Générer des embeddings pour une liste de chunks
  async generateEmbeddings(
    chunks: ChunkData[],
    providerKey: keyof typeof EMBEDDING_PROVIDERS = 'gemini-embedding-004'
  ): Promise<{
    embeddings: number[][]
    stats: IndexingStats
  }> {
    const provider = EMBEDDING_PROVIDERS[providerKey]
    
    if (!this.isProviderConfigured(providerKey)) {
      throw new Error(`Clé API ${provider.name} non configurée`)
    }
    const startTime = Date.now()
    const embeddings: number[][] = []
    const errors: string[] = []
    let totalTokens = 0

    console.log(`🔗 Génération des embeddings pour ${chunks.length} chunks avec ${provider.model}`)

    // Traiter les chunks par batch pour éviter les limites de rate
    const batchSize = 100
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      
      try {
        const batchEmbeddings = await this.generateBatch(batch, provider, providerKey)
        embeddings.push(...batchEmbeddings)
        totalTokens += batch.reduce((sum, chunk) => sum + chunk.metadata.tokens, 0)
        
        // Petite pause entre les batches pour respecter les rate limits
        if (i + batchSize < chunks.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(chunks.length/batchSize)} traité`)
      } catch (error) {
        const errorMsg = `Erreur batch ${Math.floor(i/batchSize) + 1}: ${error}`
        console.error(errorMsg)
        errors.push(errorMsg)
        
        // Ajouter des embeddings vides pour maintenir l'alignement
        for (let j = 0; j < batch.length; j++) {
          embeddings.push(new Array(provider.dimensions).fill(0))
        }
      }
    }

    const processingTime = Date.now() - startTime
    const costEstimate = (totalTokens / 1000) * provider.costPer1KTokens

    const stats: IndexingStats = {
      total_chunks: chunks.length,
      total_embeddings: embeddings.length,
      total_tokens: totalTokens,
      processing_time_ms: processingTime,
      cost_estimate: costEstimate,
      errors
    }

    console.log(`📊 Statistiques d'indexation:`, stats)

    return { embeddings, stats }
  }

  // Générer un batch d'embeddings
  private async generateBatch(
    chunks: ChunkData[],
    provider: EmbeddingProvider,
    providerKey: keyof typeof EMBEDDING_PROVIDERS
  ): Promise<number[][]> {
    if (provider.name === 'OpenAI') {
      return this.generateOpenAIBatch(chunks, provider)
    } else if (provider.name === 'Google Gemini') {
      return this.generateGeminiBatch(chunks, provider)
    } else {
      throw new Error(`Provider non supporté: ${provider.name}`)
    }
  }

  // Générer un batch avec OpenAI
  private async generateOpenAIBatch(
    chunks: ChunkData[],
    provider: EmbeddingProvider
  ): Promise<number[][]> {
    const inputs = chunks.map(chunk => chunk.content)
    
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`
      },
      body: JSON.stringify({
        input: inputs,
        model: provider.model,
        encoding_format: 'float'
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
      throw new Error(`API OpenAI: ${response.status} - ${errorData.error?.message || errorData.error}`)
    }

    const data = await response.json()
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Format de réponse invalide de l\'API OpenAI')
    }

    return data.data.map((item: any) => item.embedding)
  }

  // Générer un batch avec Gemini
  private async generateGeminiBatch(
    chunks: ChunkData[],
    provider: EmbeddingProvider
  ): Promise<number[][]> {
    const embeddings: number[][] = []
    
    // Gemini API traite un texte à la fois
    for (const chunk of chunks) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:embedContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: `models/${provider.model}`,
          content: {
            parts: [{
              text: chunk.content
            }]
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        throw new Error(`API Gemini: ${response.status} - ${errorData.error?.message || errorData.error}`)
      }

      const data = await response.json()
      
      if (!data.embedding || !data.embedding.values) {
        throw new Error('Format de réponse invalide de l\'API Gemini')
      }

      embeddings.push(data.embedding.values)
      
      // Petite pause pour respecter les rate limits
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    return embeddings
  }

  // Générer un embedding simple pour une requête
  async generateSingleEmbedding(
    text: string,
    providerKey: keyof typeof EMBEDDING_PROVIDERS = 'gemini-embedding-004'
  ): Promise<number[]> {
    const provider = EMBEDDING_PROVIDERS[providerKey]
    
    if (!this.isProviderConfigured(providerKey)) {
      throw new Error(`Clé API ${provider.name} non configurée`)
    }

    if (provider.name === 'OpenAI') {
      return this.generateSingleOpenAIEmbedding(text, provider)
    } else if (provider.name === 'Google Gemini') {
      return this.generateSingleGeminiEmbedding(text, provider)
    } else {
      throw new Error(`Provider non supporté: ${provider.name}`)
    }
  }

  // Générer un embedding simple avec OpenAI
  private async generateSingleOpenAIEmbedding(
    text: string,
    provider: EmbeddingProvider
  ): Promise<number[]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`
      },
      body: JSON.stringify({
        input: text,
        model: provider.model,
        encoding_format: 'float'
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
      throw new Error(`API OpenAI: ${response.status} - ${errorData.error?.message || errorData.error}`)
    }

    const data = await response.json()
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Format de réponse invalide de l\'API OpenAI')
    }

    return data.data[0].embedding
  }

  // Générer un embedding simple avec Gemini
  private async generateSingleGeminiEmbedding(
    text: string,
    provider: EmbeddingProvider
  ): Promise<number[]> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:embedContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: `models/${provider.model}`,
        content: {
          parts: [{
            text: text
          }]
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
      throw new Error(`API Gemini: ${response.status} - ${errorData.error?.message || errorData.error}`)
    }

    const data = await response.json()
    
    if (!data.embedding || !data.embedding.values) {
      throw new Error('Format de réponse invalide de l\'API Gemini')
    }

    return data.embedding.values
  }

  // Calculer la similarité cosinus entre deux vecteurs
  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Les vecteurs doivent avoir la même dimension')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }

    normA = Math.sqrt(normA)
    normB = Math.sqrt(normB)

    if (normA === 0 || normB === 0) {
      return 0
    }

    return dotProduct / (normA * normB)
  }

  // Estimer le coût d'indexation
  static estimateCost(
    chunks: ChunkData[],
    providerKey: keyof typeof EMBEDDING_PROVIDERS = 'gemini-embedding-004'
  ): {
    totalTokens: number
    costEstimate: number
    provider: EmbeddingProvider
  } {
    const provider = EMBEDDING_PROVIDERS[providerKey]
    const totalTokens = chunks.reduce((sum, chunk) => sum + chunk.metadata.tokens, 0)
    const costEstimate = (totalTokens / 1000) * provider.costPer1KTokens

    return {
      totalTokens,
      costEstimate,
      provider
    }
  }

  // Valider qu'un embedding est correct
  static validateEmbedding(
    embedding: number[],
    expectedDimensions: number
  ): { isValid: boolean; issues: string[] } {
    const issues: string[] = []

    if (!Array.isArray(embedding)) {
      issues.push('L\'embedding n\'est pas un array')
    } else {
      if (embedding.length !== expectedDimensions) {
        issues.push(`Dimensions incorrectes: ${embedding.length} au lieu de ${expectedDimensions}`)
      }

      if (embedding.some(val => typeof val !== 'number' || isNaN(val))) {
        issues.push('L\'embedding contient des valeurs non numériques')
      }

      const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
      if (norm === 0) {
        issues.push('L\'embedding est un vecteur zéro')
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    }
  }

  // Tester la connexion avec l'API
  async testConnection(providerKey?: keyof typeof EMBEDDING_PROVIDERS): Promise<{ success: boolean; message: string; provider?: string }> {
    // Si pas de provider spécifié, tester le premier disponible
    if (!providerKey) {
      if (this.geminiApiKey) {
        providerKey = 'gemini-embedding-004'
      } else if (this.openaiApiKey) {
        providerKey = 'openai-3-small'
      } else {
        return { success: false, message: 'Aucune clé API configurée' }
      }
    }

    const provider = EMBEDDING_PROVIDERS[providerKey]
    
    if (!this.isProviderConfigured(providerKey)) {
      return { 
        success: false, 
        message: `Clé API ${provider.name} manquante`,
        provider: provider.name
      }
    }

    try {
      await this.generateSingleEmbedding('Test de connexion', providerKey)
      return { 
        success: true, 
        message: `Connexion réussie à l'API ${provider.name}`,
        provider: provider.name
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        provider: provider.name
      }
    }
  }
}

export default EmbeddingService