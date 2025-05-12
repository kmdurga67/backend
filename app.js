require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { initializeAdmin } = require('./adminSetUp');
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const authRoutes = require('./routes/authRoute');
const documentRoutes = require('./routes/documentRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const artifactRoutes = require('./routes/artifactRoute');
const userRoutes = require('./routes/userRoutes');
const userAppointment = require('./routes/appointmentRoute');
const topTechnologiesRoute = require('./routes/topTechnologiesRoute');
const visitorRoutes = require('./routes/visitorRoute');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.disable('x-powered-by');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later'
});

app.use(limiter);

const corsOptions = {
  origin: [
    "http://localhost:3000", 
    "https://archives-phi.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'build')));

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', 
  express.static(uploadsPath, {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    }
  })
);

if (process.env.NODE_ENV !== 'production') {
  initializeAdmin();
}

app.use('/api/auth', authRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/artifacts', authMiddleware, artifactRoutes);
app.use('/user', userRoutes);
app.use('/appointment', userAppointment);
app.use('/api', topTechnologiesRoute);
app.use('/api/visitor', visitorRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});