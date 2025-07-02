const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ✅ Precisa vir logo após o app ser criado para evitar erro do rate-limit
app.set('trust proxy', 1);

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo de 100 requisições por IP
});
app.use(limiter);

// Middlewares padrão
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Conexão com MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    });

    console.log(`🔗 Conectado ao MongoDB: ${conn.connection.host}`);

    // Criar usuário admin se não existir
    await createAdminUser();

  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    process.exit(1);
  }
};

// Função para criar usuário admin
const createAdminUser = async () => {
  try {
    const User = require('./src/models/User');
    const bcrypt = require('bcryptjs');

    const adminExists = await User.findOne({ username: 'admin' });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Lima12345', 12);

      const admin = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        name: 'Administrador',
        email: 'admin@processflow.com'
      });

      await admin.save();
      console.log('✅ Usuário admin criado com sucesso');
    } else {
      console.log('✅ Usuário admin já existe');
    }
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error.message);
  }
};

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'ProcessFlow backend em execução',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api', require('./src/routes/auth'));
app.use('/api/processes', require('./src/routes/processes'));
app.use('/api/tasks', require('./src/routes/tasks'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/teams', require('./src/routes/teams'));

// Middleware global de erro
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

module.exports = app;
