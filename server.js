
const express = require('express');

const roomRoutes = require('./routes/roomRoutes');
const app = express();

app.use(express.json());

app.use('/', roomRoutes);  

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


