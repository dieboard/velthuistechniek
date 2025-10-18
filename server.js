require('dotenv').config(); // This line loads the .env file
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/content.json', express.static(path.join(__dirname, 'content.json')));

const contentPath = path.join(__dirname, 'content.json');

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

// --- API Endpoints ---

// Get all projects
app.get('/api/projects', (req, res) => {
    const content = readContent();
    res.json(content.projects);
});

// Create a new project
app.post('/api/projects', (req, res) => {
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
app.put('/api/projects/:index', (req, res) => {
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
app.delete('/api/projects/:index', (req, res) => {
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
app.post('/api/projects/:index/images', upload.array('images'), (req, res) => {
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
app.delete('/api/projects/:projectIndex/images/:imageIndex', (req, res) => {
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

// Serve the admin panel and inject the API key
app.get('/admin', (req, res) => {
    fs.readFile(path.join(__dirname, 'admin.html'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading admin file');
        }
        // Replace a placeholder with the actual API key
        const result = data.replace('YOUR_TINYMCE_API_KEY_PLACEHOLDER', process.env.TINYMCE_API_KEY);
        res.send(result);
    });
});

app.listen(port, () => {
    console.log(`Admin server running at http://localhost:${port}/admin`);
});