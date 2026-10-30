import { GoogleGenAI } from '@google/genai';

interface ChatContext {
  courseTitle: string;
  lessonTitle: string;
  lessonContent?: string;
  lessonType: string;
  studentName: string;
}

export async function askGeminiTutor(
  userPrompt: string,
  context: ChatContext,
  history: { role: 'user' | 'model'; text: string }[] = []
): Promise<string> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
                 (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
                 '';

  const systemInstruction = `Tu es le Tuteur IA officiel d'EduSphere, une plateforme d'apprentissage d'excellence de style Udemy.
Tu t'adresses à ${context.studentName || 'l\'étudiant'}.
Tu es bienveillant, pédagogique, ultra-clair, dynamique et concis.
Contexte du cours actuel :
- Cours : "${context.courseTitle}"
- Leçon actuelle : "${context.lessonTitle}" (Format : ${context.lessonType})
${context.lessonContent ? `- Extrait du contenu de la leçon : ${context.lessonContent.slice(0, 1000)}` : ''}

Consignes :
1. Réponds en français clair, précis et structuré avec du formatage Markdown soigné (gras, puces, blocs de code syntaxés).
2. Fournis des explications adaptées aux débutants comme aux développeurs confirmés.
3. Si la question porte sur un problème de code ou un exercice, donne la solution étape par étape avec une astuce mnémotechnique.
4. Reste toujours encourageant et focalisé sur la réussite académique et professionnelle.`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents = [
        ...history.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('Gemini API call returned an error, using intelligent fallback:', err);
    }
  }

  // Fallback intelligent contextual response
  return generateIntelligentFallback(userPrompt, context);
}

function generateIntelligentFallback(prompt: string, context: ChatContext): string {
  const p = prompt.toLowerCase();
  
  if (p.includes('code') || p.includes('exemple') || p.includes('script') || p.includes('pratique')) {
    return `### 💡 Exemple Pratique appliqué à "${context.lessonTitle}"

Voici une illustration concrète pour mettre en pratique ce que nous venons de voir :

\`\`\`typescript
// Exemple de validation et d'appel sécurisé
interface TransactionPayload {
  amount: number;
  currency: 'XOF' | 'EUR';
  provider: 'wave' | 'orange' | 'mtn';
  customerPhone: string;
}

export async function processPayment(payload: TransactionPayload) {
  // 1. Validation locale
  if (payload.amount <= 0) throw new Error("Montant invalide");
  
  // 2. Appel au webhook du provider
  console.log(\`Initiation du paiement de \${payload.amount} \${payload.currency} via \${payload.provider}\`);
  return { status: 'success', reference: 'REF-' + Date.now() };
}
\`\`\`

**Point clé :** N'oubliez jamais d'encapsuler vos appels réseau dans un bloc \`try/catch\` pour gérer les imprévus côté utilisateur. Avez-vous une question sur un point particulier de ce code ?`;
  }

  if (p.includes('résumé') || p.includes('retenir') || p.includes('synthese') || p.includes('essentiel')) {
    return `### 📌 Synthèse rapide de la leçon : "${context.lessonTitle}"

1. **Objectif principal :** Maîtriser les fondations nécessaires pour "${context.courseTitle}".
2. **Notion clé :** Structurer votre code de façon modulaire et sécuriser toutes les données sensibles.
3. **Bonne pratique recommandée :** Tester chaque composant ou fonction unitairement avant de déployer en production.

> *Astuce du Tuteur :* Prenez 5 minutes pour refaire l'exercice interactif associé à cette leçon afin de fixer vos connaissances !`;
  }

  if (p.includes('exercice') || p.includes('quiz') || p.includes('aide') || p.includes('bloqué') || p.includes('pourquoi')) {
    return `### 🎯 Conseils du Tuteur pour réussir l'exercice

Pas de panique ! C'est tout à fait normal de rencontrer une difficulté à cette étape :

- **Étape 1 :** Relisez bien l'énoncé et identifiez précisément l'entrée attendue versus la sortie produite.
- **Étape 2 :** Découpez le problème en 2 sous-problèmes simples.
- **Étape 3 :** Dans le cadre de **"${context.lessonTitle}"**, souvenez-vous des règles de priorité et d'isolation des variables.

Si vous souhaitez que je vous pose une question guidée pour trouver la solution par vous-même, écrivez simplement **"Guide-moi"** !`;
  }

  return `Bonjour **${context.studentName || 'l\'étudiant'}** ! Je suis votre tuteur IA pour la leçon **"${context.lessonTitle}"**.

Votre question est très pertinente concernant le cours **${context.courseTitle}**.

**Pour bien assimiler ce concept :**
1. Visualisez le flux d'informations du début à la fin.
2. N'hésitez pas à relire les diapositives PDF ou revoir la vidéo aux passages clés.
3. Pratiquez directement dans votre éditeur ou dans l'onglet Exercice ci-contre.

Souhaitez-vous que je vous explique un terme spécifique, ou que je vous donne un mini-quiz d'entraînement ?`;
}
