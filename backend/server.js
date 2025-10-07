const express = require('express');
const dotenv = require('dotenv');

dotenv.config(); // Load biến môi trường từ .env

const app = express();
app.use(express.json()); // Parse JSON body từ request

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});