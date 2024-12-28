export interface Message {
    role: 'user' | 'assistant';
    content: string | MessageContent[];
}

export interface MessageContent {
    type: 'text' | 'image_url';
    text?: { value: string };
    image_url?: { url: string };
}

export interface Cat {
    id: string;
    url: string;
    breeds: CatBreed[];
}

export interface CatBreed {
    id: string;
    name: string;
    description: string;
} 