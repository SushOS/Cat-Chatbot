const axios = require('axios');
const { CAT_API_KEY } = require('../config/config');

const CAT_API_BASE_URL = 'https://api.thecatapi.com/v1';

class CatApiService {
    constructor() {
        this.api = axios.create({
            baseURL: CAT_API_BASE_URL,
            headers: {
                'x-api-key': CAT_API_KEY
            }
        });
    }

    async getRandomCat(breed = '', limit = 2) {
        try {
            const params = {
                limit,
                ...(breed && { breed_id: breed })
            };

            const response = await this.api.get('/images/search', { params });
            
            if (!response.data || response.data.length === 0) {
                throw new Error(`No cats found for breed: ${breed}`);
            }

            if (breed) {
                const breedInfo = await this.getBreedInfo(breed);
                return response.data.map(cat => ({
                    ...cat,
                    breedInfo: {
                        name: breedInfo?.name || 'Unknown Breed',
                        description: breedInfo?.description || 'Information unavailable'
                    }
                }));
            }

            return response.data.map(cat => ({
                ...cat,
                breedInfo: {
                    name: cat.breeds?.[0]?.name || 'Random Breed',
                    description: cat.breeds?.[0]?.description || 'A lovely cat'
                }
            }));
        } catch (error) {
            console.error('Error in getRandomCat:', error);
            throw new Error(`Failed to fetch cat images: ${error.message}`);
        }
    }

    async getBreedInfo(breedId) {
        try {
            const response = await this.api.get(`/breeds/${breedId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching breed info:', error);
            return null;
        }
    }

    async getBreeds() {
        try {
            const response = await this.api.get('/breeds');
            return response.data;
        } catch (error) {
            console.error('Error fetching breeds:', error);
            throw new Error('Failed to fetch cat breeds');
        }
    }
}

module.exports = new CatApiService(); 