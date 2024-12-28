const openaiService = require('../services/openaiService');
const catApiService = require('../services/catApiService');

class ChatController {
    async initializeChat(req, res) {
        try {
            const thread = await openaiService.createThread();
            res.json({ threadId: thread.id });
        } catch (error) {
            console.error('Error initializing chat:', error);
            res.status(500).json({ error: 'Failed to initialize chat' });
        }
    }

    async sendMessage(req, res) {
        const { threadId, message, breed } = req.body;
        
        try {
            // Update breed context if provided
            if (breed !== undefined) {
                openaiService.setBreedContext(threadId, breed);
            }

            // Get current breed context
            const currentBreed = openaiService.getBreedContext(threadId);

            // Add message to thread
            await openaiService.addMessage(threadId, message);
            
            // Run assistant with breed context
            const run = await openaiService.runAssistant(threadId);
            
            let runStatus = await openaiService.getRunStatus(threadId, run.id);
            while (runStatus.status !== 'completed') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                runStatus = await openaiService.getRunStatus(threadId, run.id);
                
                if (runStatus.status === 'requires_action') {
                    const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
                    // Pass breed context to handleToolCalls
                    const toolOutputs = await openaiService.handleToolCalls(toolCalls, threadId, currentBreed);
                    await openaiService.submitToolOutputs(threadId, run.id, toolOutputs);
                }
            }

            const messages = await openaiService.getMessages(threadId);
            const latestMessage = messages.data
                .filter(msg => msg.role === 'assistant')[0];
            
            res.json({ messages: latestMessage ? [latestMessage] : [] });
        } catch (error) {
            console.error('Error in sendMessage:', error);
            res.status(500).json({ 
                error: 'Failed to process message',
                details: error.message 
            });
        }
    }

    async handleToolCalls(toolCalls) {
        return await Promise.all(toolCalls.map(async (toolCall) => {
            if (toolCall.function.name === 'show_cat') {
                const args = JSON.parse(toolCall.function.arguments);
                const cats = await catApiService.getRandomCat(args.breed, args.count || 1);
                return {
                    tool_call_id: toolCall.id,
                    output: JSON.stringify(cats)
                };
            }
            return null;
        }));
    }

    async getBreeds(req, res) {
        try {
            const breeds = await catApiService.getBreeds();
            res.json(breeds);
        } catch (error) {
            console.error('Error getting breeds:', error);
            res.status(500).json({ error: 'Failed to get breeds' });
        }
    }

    async streamMessage(req, res) {
        const { threadId, message } = req.body;

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
            await openaiService.addMessage(threadId, message);
            const run = await openaiService.runAssistant(threadId);
            
            let runStatus = await openaiService.getRunStatus(threadId, run.id);
            while (runStatus.status !== 'completed') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                runStatus = await openaiService.getRunStatus(threadId, run.id);
                
                if (runStatus.status === 'requires_action') {
                    const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
                    const toolOutputs = await this.handleToolCalls(toolCalls);
                    
                    await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
                        tool_outputs: toolOutputs
                    });
                }

                // Send status updates to client
                res.write(`data: ${JSON.stringify({ status: runStatus.status })}\n\n`);
            }

            const messages = await openaiService.getMessages(threadId);
            res.write(`data: ${JSON.stringify({ status: 'completed', messages: messages.data })}\n\n`);
            res.end();
        } catch (error) {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    }
}

module.exports = new ChatController(); 