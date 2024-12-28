require('dotenv').config();

module.exports = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    CAT_API_KEY: process.env.CAT_API_KEY,
    PORT: process.env.PORT || 3001
};
