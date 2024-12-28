const OpenAI = require('openai');
const { OPENAI_API_KEY } = require('../config/config');
const catApiService = require('../services/catApiService');

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

let assistant = null;

class OpenAIService {
    constructor() {
        this.shownCats = new Map();
        this.breedContext = new Map(); // Store selected breed for each thread
    }

    async getOrCreateAssistant() {
        if (assistant) return assistant;
        
        assistant = await openai.beta.assistants.create({
            name: "Cat Assistant",
            instructions: `You are a friendly cat-loving assistant. Help users with cat-related questions. 
                         When users ask to see cats or when a breed is selected, always use the show_cat function 
                         with a minimum count of 2 images. Be enthusiastic about cats and provide breed-specific 
                         information when a breed is selected. Always respect the user's breed selection when showing cats.`,
            model: "gpt-4o-mini",
            tools: [{
                type: "function",
                function: {
                    name: "show_cat",
                    description: "Display cat images (minimum 2 when breed is selected)",
                    parameters: {
                        type: "object",
                        properties: {
                            breed: {
                                type: "string",
                                description: "The breed of cat to show (required if breed is selected)"
                            },
                            count: {
                                type: "integer",
                                description: "Number of cats to show (minimum: 2)",
                                default: 2,
                                minimum: 2
                            }
                        }
                    }
                }
            }]
        });
        
        return assistant;
    }

    setBreedContext(threadId, breed) {
        this.breedContext.set(threadId, breed);
    }

    getBreedContext(threadId) {
        return this.breedContext.get(threadId);
    }

    async addMessage(threadId, message) {
        const breed = this.getBreedContext(threadId);
        let enhancedMessage = message;
        
        // Add breed context to the message if a breed is selected
        if (breed) {
            enhancedMessage = `[Current breed context: ${breed}] ${message}`;
        }
        
        return await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: enhancedMessage
        });
    }

    async createThread() {
        return await openai.beta.threads.create();
    }

    async runAssistant(threadId) {
        const assistantId = (await this.getOrCreateAssistant()).id;
        return await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId
        });
    }

    async getRunStatus(threadId, runId) {
        return await openai.beta.threads.runs.retrieve(threadId, runId);
    }

    async getMessages(threadId) {
        return await openai.beta.threads.messages.list(threadId);
    }

    async submitToolOutputs(threadId, runId, toolOutputs) {
        return await openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
            tool_outputs: toolOutputs
        });
    }

    async handleToolCalls(toolCalls, threadId) {
        return await Promise.all(toolCalls.map(async (toolCall) => {
            if (toolCall.function.name === 'show_cat') {
                try {
                    const args = JSON.parse(toolCall.function.arguments);
                    // Ensure minimum of 2 cats
                    const count = Math.max(args.count || 2, 2);
                    const cats = await catApiService.getRandomCat(args.breed, count);
                    
                    // Store cats for this thread
                    if (!this.shownCats.has(threadId)) {
                        this.shownCats.set(threadId, []);
                    }
                    this.shownCats.get(threadId).push(...cats);

                    // Create response with breed information
                    const catDescriptions = cats.map((cat, index) => ({
                        url: cat.url,
                        breed: cat.breedInfo.name,
                        description: cat.breedInfo.description
                    }));

                    return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify({
                            content: [
                                {
                                    type: 'text',
                                    text: { 
                                        value: `Here are ${count} beautiful ${cats[0].breedInfo.name} cats for you! 😺 
                                        ${cats[0].breedInfo.description}`
                                    }
                                },
                                ...cats.map(cat => ({
                                    type: 'image_url',
                                    image_url: { url: cat.url }
                                }))
                            ],
                            cats: catDescriptions
                        })
                    };
                } catch (error) {
                    console.error('Error getting cat images:', error);
                    return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify({ error: 'Failed to fetch cat images' })
                    };
                }
            }
            return null;
        }));
    }

    getShownCats(threadId) {
        return this.shownCats.get(threadId) || [];
    }
}

module.exports = new OpenAIService(); 