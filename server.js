require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!JWT_SECRET || !ADMIN_PASSWORD_HASH) {
    console.error("FATAL ERROR: JWT_SECRET and ADMIN_PASSWORD_HASH must be set in the environment.");
    process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/content.json', express.static(path.join(__dirname, 'content.json')));

const contentPath = path.join(__dirname, 'content.json');

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/login');
        }
        req.user = user;
        next();
    });
};

// --- Login and Logout Routes ---
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
    const { password } = req.body;
    if (bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
        const token = jwt.sign({ user: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid password');
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).send('Logged out');
});


// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Read content from JSON file
const readContent = () => {
    const data = fs.readFileSync(contentPath, 'utf8');
    return JSON.parse(data);
};

// Write content to JSON file
const writeContent = (content) => {
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
};

// --- API Endpoints (Protected) ---

// Get all projects
app.get('/api/projects', authenticateToken, (req, res) => {
    const content = readContent();
    res.json(content.projects);
});

// Create a new project
app.post('/api/projects', authenticateToken, (req, res) => {
    const content = readContent();
    const newProject = {
        title: req.body.title,
        description: req.body.description,
        images: []
    };
    content.projects.unshift(newProject); // Add to the beginning of the array
    writeContent(content);
    res.status(201).json(newProject);
});

// Update a project
app.put('/api/projects/:index', authenticateToken, (req, res) => {
    const content = readContent();
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < content.projects.length) {
        content.projects[index].title = req.body.title;
        content.projects[index].description = req.body.description;
        writeContent(content);
        res.json(content.projects[index]);
    } else {
        res.status(404).send('Project not found');
    }
});

// Delete a project
app.delete('/api/projects/:index', authenticateToken, (req, res) => {
    const content = readContent();
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < content.projects.length) {
        const deletedProject = content.projects.splice(index, 1);
        writeContent(content);
        res.json(deletedProject);
    } else {
        res.status(404).send('Project not found');
    }
});

// Upload images to a project
app.post('/api/projects/:index/images', authenticateToken, upload.array('images'), (req, res) => {
    const content = readContent();
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < content.projects.length) {
        const filepaths = req.files.map(file => `images/${file.filename}`);
        content.projects[index].images.push(...filepaths);
        writeContent(content);
        res.json(content.projects[index]);
    } else {
        res.status(404).send('Project not found');
    }
});

// Delete an image from a project
app.delete('/api/projects/:projectIndex/images/:imageIndex', authenticateToken, (req, res) => {
    const content = readContent();
    const projectIndex = parseInt(req.params.projectIndex, 10);
    const imageIndex = parseInt(req.params.imageIndex, 10);

    if (projectIndex >= 0 && projectIndex < content.projects.length) {
        const project = content.projects[projectIndex];
        if (imageIndex >= 0 && imageIndex < project.images.length) {
            project.images.splice(imageIndex, 1);
            writeContent(content);
            res.json(project);
        } else {
            res.status(404).send('Image not found');
        }
    } else {
        res.status(404).send('Project not found');
    }
});

// Serve the admin panel (protected)
app.get('/admin', authenticateToken, (req, res) => {
    fs.readFile(path.join(__dirname, 'admin.html'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading admin file');
        }
        const result = data.replace('YOUR_TINYMCE_API_KEY_PLACEHOLDER', process.env.TINYMCE_API_KEY);
        res.send(result);
    });
});

app.listen(port, () => {
    console.log(`Admin server running at http://localhost:${port}`);
    console.log(`Login at http://localhost:${port}/login`);
});