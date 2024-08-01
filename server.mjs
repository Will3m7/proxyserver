import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
const cors = require('cors');

app.use(cors());

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON
app.use(express.json());

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const corsOptions = {
    origin: '*',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  };

// Proxy route to fetch content
app.post('/webparser', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await fetch('https://uptime-mercury-api.azurewebsites.net/webparser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching article content:', error);
        res.status(500).json({ error: 'Unable to load content.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
