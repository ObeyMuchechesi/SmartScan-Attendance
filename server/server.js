require('dotenv').config();
const app = require('./app');

const port = parseInt(process.env.PORT, 10) || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
