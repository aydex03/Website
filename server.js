const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Ordner für Uploads sicherstellen
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Speicherkonfiguration für Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <h2>Datei hochladen</h2>
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Hochladen</button>
    </form>
  `);
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.send("Keine Datei ausgewählt.");
  const link = `/uploads/${req.file.filename}`;
  res.send(`Datei erfolgreich hochgeladen: <a href="${link}" target="_blank">${req.file.originalname}</a>`);
});

app.listen(PORT, () => console.log(`Upload-Server läuft auf Port ${PORT}`));
