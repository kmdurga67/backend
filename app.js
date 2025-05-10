require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { initializeAdmin } = require('./adminSetUp');
const authRoutes = require('./routes/authRoute');
const documentRoutes = require('./routes/documentRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const multer = require('multer');
const artifactRoutes = require('./routes/artifactRoute');
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/userRoutes');
const userAppointmwnt = require('./routes/appointmentRoute');
const topTechnologiesRoute = require('./routes/topTechnologiesRoute');
const visitorRoutes = require('./routes/visitorRoute');

const app = express();
const PORT = process.env.PORT || 4000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(helmet());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

app.use(cookieParser());
app.use(cors(corsOptions))
// app.use(cors());
app.options("*", cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadsPath = path.join(__dirname, 'uploads');

app.use('/uploads', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // res.setHeader("Content-Type", "image/jpg"); 
  next();
}, express.static(uploadsPath));


initializeAdmin();

app.use('/api/auth', authRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/artifacts', authMiddleware, artifactRoutes);
app.use('/user', userRoutes);
app.use('/appointment', userAppointmwnt);
app.use('/api', topTechnologiesRoute);
app.use('/api/visitor', visitorRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});