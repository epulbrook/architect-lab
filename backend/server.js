const express = require('express');
const cors = require('cors');
const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', analyzeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📊 SEO API ready at http://localhost:${PORT}/api`);
}); 