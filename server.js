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

// --- Environment Variable Validation ---
const { JWT_SECRET, ADMIN_PASSWORD_HASH, TINYMCE_API_KEY } = process.env;
if (!JWT_SECRET || !ADMIN_PASSWORD_HASH) {
    console.error("FATAL ERROR: JWT_SECRET and ADMIN_PASSWORD_HASH must be set in the .env file.");
    process.exit(1);
}

// --- App Configuration ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// --- Static File Serving ---
app.use(express.static(__dirname)); // Serve root files like script.js, style.css
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// --- Content Management ---
const contentPath = path.join(__dirname, 'content.json');
const readContent = () => JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const writeContent = (data) => fs.writeFileSync(contentPath, JSON.stringify(data, null, 2), 'utf8');

// --- Main Page Route ---
app.get('/', (req, res) => {
    try {
        const content = readContent();
        res.render('index', { projects: content.projects || [] });
    } catch (error) {
        console.error("Error reading content for main page:", error);
        res.status(500).send("Could not load page content.");
    }
});

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.redirect('/login');
        req.user = user;
        next();
    });
};

// --- Login/Logout Routes ---
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));

app.post('/login', (req, res) => {
    const { password } = req.body;
    if (bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
        const token = jwt.sign({ user: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.status(200).send('Login successful');
    }
    return res.status(401).send('Invalid password');
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').status(200).send('Logged out');
});

// --- Admin Panel Route ---
app.get('/admin', authenticateToken, (req, res) => {
    fs.readFile(path.join(__dirname, 'admin.html'), 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading admin file');
        const result = data.replace('YOUR_TINYMCE_API_KEY_PLACEHOLDER', TINYMCE_API_KEY || '');
        res.send(result);
    });
});

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'images/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// --- Protected API Endpoints ---

// Get all projects
app.get('/api/projects', authenticateToken, (req, res) => {
    res.json(readContent().projects || []);
});

// Create a new project
app.post('/api/projects', authenticateToken, (req, res) => {
    const content = readContent();
    const newProject = {
        title: req.body.title || "Nieuw Project",
        tileSummary: req.body.tileSummary || "",
        tileImage: "", // Uploaded separately
        modalDescription: req.body.modalDescription || "",
        modalImages: [] // Uploaded separately
    };
    content.projects.unshift(newProject);
    writeContent(content);
    res.status(201).json(newProject);
});

// Update a project's text content
app.put('/api/projects/:index', authenticateToken, (req, res) => {
    const content = readContent();
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < content.projects.length) {
        const project = content.projects[index];
        project.title = req.body.title ?? project.title;
        project.tileSummary = req.body.tileSummary ?? project.tileSummary;
        project.modalDescription = req.body.modalDescription ?? project.modalDescription;
        writeContent(content);
        return res.json(project);
    }
    return res.status(404).send('Project not found');
});

// Delete a project
app.delete('/api/projects/:index', authenticateToken, (req, res) => {
    const content = readContent();
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < content.projects.length) {
        const [deletedProject] = content.projects.splice(index, 1);
        writeContent(content);
        return res.json(deletedProject);
    }
    return res.status(404).send('Project not found');
});

// Upload tile image
app.post('/api/projects/:index/tile-image', authenticateToken, upload.single('tileImage'), (req, res) => {
    const content = readContent();
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < content.projects.length) {
        if (!req.file) return res.status(400).send('No tile image file uploaded.');
        content.projects[index].tileImage = `images/${req.file.filename}`;
        writeContent(content);
        return res.json(content.projects[index]);
    }
    return res.status(404).send('Project not found');
});

// Upload modal images
app.post('/api/projects/:index/modal-images', authenticateToken, upload.array('modalImages'), (req, res) => {
    const content = readContent();
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < content.projects.length) {
        const project = content.projects[index];
        if (!Array.isArray(project.modalImages)) project.modalImages = [];
        const filepaths = req.files.map(file => `images/${file.filename}`);
        project.modalImages.push(...filepaths);
        writeContent(content);
        return res.json(project);
    }
    return res.status(404).send('Project not found');
});

// Delete a modal image
app.delete('/api/projects/:projectIndex/modal-images/:imageIndex', authenticateToken, (req, res) => {
    const content = readContent();
    const projectIndex = parseInt(req.params.projectIndex, 10);
    const imageIndex = parseInt(req.params.imageIndex, 10);

    if (projectIndex >= 0 && projectIndex < content.projects.length) {
        const project = content.projects[projectIndex];
        if (project.modalImages && imageIndex >= 0 && imageIndex < project.modalImages.length) {
            project.modalImages.splice(imageIndex, 1);
            writeContent(content);
            return res.json(project);
        }
        return res.status(404).send('Image not found');
    }
    return res.status(404).send('Project not found');
});

// --- Server Start ---
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Admin login at http://localhost:${port}/login`);
});
