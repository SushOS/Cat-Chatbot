import axios from 'axios';
import { Message, Cat, CatBreed } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const initializeChat = async (): Promise<{ threadId: string }> => {
    const response = await axios.post(`${API_BASE_URL}/chat/initialize`);
    return response.data;
};

export const sendMessage = async (
    threadId: string, 
    message: string, 
    breed?: string
): Promise<{ messages: Message[] }> => {
    const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        threadId,
        message,
        breed
    });
    return response.data;
};

export const getBreeds = async (): Promise<CatBreed[]> => {
    const response = await axios.get(`${API_BASE_URL}/cats/breeds`);
    return response.data;
};

export const streamMessage = async (
    threadId: string, 
    message: string, 
    onUpdate: (data: any) => void
): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadId, message }),
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = JSON.parse(line.slice(5));
                onUpdate(data);
            }
        }
    }
}; 