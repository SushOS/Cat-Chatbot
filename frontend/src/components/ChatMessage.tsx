import React from 'react';
import styled from '@emotion/styled';
import { Message } from '../types';

const MessageContainer = styled.div<{ role: 'user' | 'assistant' }>`
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    max-width: 70%;
    ${props => props.role === 'user' ? `
        background-color: #e3f2fd;
        margin-left: auto;
    ` : `
        background-color: #f5f5f5;
        margin-right: auto;
    `}
`;

const CatImage = styled.img`
    max-width: 100%;
    border-radius: 4px;
    margin-top: 10px;
`;

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const renderContent = () => {
        if (typeof message.content === 'string') {
            // Check if the content contains markdown image syntax
            if (message.content.includes('![')) {
                const urlMatch = message.content.match(/\((.*?)\)/);
                if (urlMatch && urlMatch[1]) {
                    return (
                        <>
                            <p>Here's a cute cat for you! 😺</p>
                            <CatImage src={urlMatch[1]} alt="Cat" loading="lazy" />
                        </>
                    );
                }
            }
            return <p>{message.content}</p>;
        }

        return message.content.map((item, index) => {
            if (item.type === 'text') {
                return <p key={index}>{item.text?.value}</p>;
            } else if (item.type === 'image_url') {
                return (
                    <div key={index}>
                        <CatImage src={item.image_url?.url} alt="Cat" loading="lazy" />
                    </div>
                );
            }
            return null;
        });
    };

    return (
        <MessageContainer role={message.role}>
            {renderContent()}
        </MessageContainer>
    );
}; 