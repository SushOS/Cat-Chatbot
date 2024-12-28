import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { BreedSelector } from './BreedSelector';
import { initializeChat, sendMessage, getBreeds } from '../services/api';
import { Message, CatBreed } from '../types';

const ChatContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

const MessagesContainer = styled.div`
    height: 600px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
    color: #ff4444;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: #ffe5e5;
`;

const LoadingIndicator = styled.div`
    text-align: center;
    padding: 10px;
    color: #666;
`;

export const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [threadId, setThreadId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [breeds, setBreeds] = useState<CatBreed[]>([]);
    const [selectedBreed, setSelectedBreed] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                const [chatResponse, breedsResponse] = await Promise.all([
                    initializeChat(),
                    getBreeds()
                ]);
                setThreadId(chatResponse.threadId);
                setBreeds(breedsResponse);
            } catch (error) {
                setError('Failed to initialize chat. Please refresh the page.');
                console.error('Initialization error:', error);
            }
        };
        initialize();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (message: string) => {
        if (!threadId) {
            setError('Chat not initialized. Please refresh the page.');
            return;
        }
    
        setIsLoading(true);
        setError(null);
        setMessages(prev => [...prev, { role: 'user', content: message }]);
        
        try {
            const response = await sendMessage(threadId, message, selectedBreed);
            if (response.messages) {
                const newMessages = response.messages.map(msg => ({
                    ...msg,
                    breedContext: selectedBreed // Add breed context to message
                }));
                setMessages(prev => [...prev, ...newMessages]);
            }
        } catch (error) {
            setError('Failed to send message. Please try again.');
            console.error('Message error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleBreedSelect = (breedId: string) => {
        setSelectedBreed(breedId);
        // Optionally notify the user about the breed selection
        if (breedId) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `I'll now focus on showing you ${breeds.find(b => b.id === breedId)?.name || ''} cats!`
            }]);
        }
    };

    // const handleSendMessage = async (message: string) => {
    //     if (!threadId) {
    //         setError('Chat not initialized. Please refresh the page.');
    //         return;
    //     }

    //     setIsLoading(true);
    //     setError(null);
    //     setMessages(prev => [...prev, { role: 'user', content: message }]);
        
    //     try {
    //         const response = await sendMessage(threadId, message, selectedBreed);
    //         if (response.messages) {
    //             const newMessages = response.messages.map(msg => ({
    //                 ...msg,
    //                 breedContext: selectedBreed
    //             }));
    //             setMessages(prev => [...prev, ...newMessages]);
    //         }
    //     } catch (error) {
    //         setError('Failed to send message. Please try again.');
    //         console.error('Message error:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // const handleBreedSelect = async (breedId: string) => {
    //     setSelectedBreed(breedId);
    //     if (breedId && threadId) {
    //         setIsLoading(true);
    //         try {
    //             // Send a message to get cat images when breed is selected
    //             const response = await sendMessage(
    //                 threadId,
    //                 `Show me at least 2 ${breeds.find(b => b.id === breedId)?.name || ''} cats`,
    //                 breedId
    //             );
    //             if (response.messages) {
    //                 const newMessages = response.messages.map(msg => ({
    //                     ...msg,
    //                     breedContext: breedId
    //                 }));
    //                 setMessages(prev => [...prev, ...newMessages]);
    //             }
    //         } catch (error) {
    //             setError('Failed to load cat images. Please try again.');
    //             console.error('Error loading breed images:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    // };

    return (
        <ChatContainer>
            <BreedSelector
                breeds={breeds}
                selectedBreed={selectedBreed}
                onBreedSelect={handleBreedSelect}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <MessagesContainer>
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                ))}
                {isLoading && (
                    <LoadingIndicator>
                        <span>Thinking... 🐱</span>
                    </LoadingIndicator>
                )}
                <div ref={messagesEndRef} />
            </MessagesContainer>
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </ChatContainer>
    );
}; 