const express = require('express');
const cors = require('cors');
const { dbAdapter, initDatabase } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize Database (TiDB Cloud or SQLite)
initDatabase().catch(err => {
  console.error('Database initialization error:', err);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: dbAdapter.isTiDB ? 'TiDB Cloud (MySQL Serverless)' : 'SQLite (Local WAL)',
    timestamp: new Date().toISOString(),
    service: 'R4 Portfolio API'
  });
});

// 1. Get complete portfolio data
app.get('/api/portfolio', async (req, res) => {
  try {
    const data = await dbAdapter.getPortfolio();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor al cargar el portfolio.' });
  }
});

// 2. Get projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await dbAdapter.getProjects();
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Like a project (increments like counter in Database)
app.post('/api/projects/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await dbAdapter.likeProject(id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Contact form submission (Stored in Database)
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Por favor completa todos los campos requeridos (nombre, email y mensaje).'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Por favor ingresa un correo electrónico válido.'
    });
  }

  try {
    const result = await dbAdapter.createContactMessage(
      name.trim(),
      email.trim(),
      (subject || 'Consulta desde Portfolio').trim(),
      message.trim()
    );

    // Forward email notification directly to Francisco Robledo
    let emailDispatched = false;
    try {
      const emailResponse = await fetch('https://formsubmit.co/ajax/franciscorobledo0012@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          _subject: `[Portfolio R4] ${subject ? subject.trim() : 'Nuevo mensaje de contacto'} - ${name.trim()}`,
          message: message.trim(),
          _replyto: email.trim(),
          _template: 'table',
          _captcha: 'false'
        })
      });
      if (emailResponse.ok) {
        emailDispatched = true;
      }
    } catch (mailErr) {
      console.warn('Note: Could not dispatch external email via FormSubmit gateway:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: '¡Tu mensaje ha sido recibido con éxito! Se ha guardado en la base de datos y despachado por correo a Francisco.',
      id: result.id,
      emailDispatched
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ success: false, error: 'No se pudo guardar el mensaje en la base de datos.' });
  }
});

// 5. Get all contact messages (Admin / Review)
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await dbAdapter.getContactMessages();
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Guestbook list & submit
app.get('/api/guestbook', async (req, res) => {
  try {
    const entries = await dbAdapter.getGuestbookEntries();
    res.json({ success: true, entries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/guestbook', async (req, res) => {
  const { name, message, role_or_company } = req.body;

  if (!name || !message) {
    return res.status(400).json({
      success: false,
      error: 'Nombre y mensaje son requeridos.'
    });
  }

  const googleColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8AB4F8', '#C58AF9'];
  const avatar_color = googleColors[Math.floor(Math.random() * googleColors.length)];

  try {
    const entry = await dbAdapter.addGuestbookEntry(
      name.trim(),
      message.trim(),
      (role_or_company || 'Visitante Web').trim(),
      avatar_color
    );

    res.status(201).json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Congratulations counter (1 per browser/device enforced via frontend, persisted in DB)
app.get('/api/congratulations', async (req, res) => {
  try {
    const count = await dbAdapter.getCongratulations();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/congratulations', async (req, res) => {
  try {
    const count = await dbAdapter.addCongratulations();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 R4 Portfolio Backend running on port ${PORT}`);
  console.log(`🗄️  Database Engine: ${dbAdapter.isTiDB ? 'TiDB Cloud (Serverless MySQL)' : 'Local SQLite (portfolio.db)'}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/portfolio`);
  console.log(`===============================================`);
});
