const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const { PORT } = require('./config/config');

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 