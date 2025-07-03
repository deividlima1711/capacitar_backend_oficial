const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas deste arquivo serão acessadas com o prefixo '/api'
// definido em app.js

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validação básica
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar se usuário está ativo
    if (!user.isActive) {
      return res.status(401).json({ error: 'Usuário inativo' });
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });

  } catch (error) {
    console.error('Erro no login:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cadastro de novo usuário
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Validação básica
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Usuário, senha e e-mail são obrigatórios' });
    }

    // Verificar se usuário ou e-mail já existem
    const existingUser = await User.findOne({ $or: [ { username: username.toLowerCase() }, { email: email.toLowerCase() } ] });
    if (existingUser) {
      return res.status(409).json({ error: 'Usuário ou e-mail já cadastrado' });
    }

    // Criar novo usuário
    const user = new User({
      username: username.toLowerCase(),
      password,
      email: email.toLowerCase(),
      name: username // ou ajuste conforme necessário
    });
    await user.save();

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Erro no cadastro:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar token
router.get('/verify', auth, async (req, res) => {
  try {
    res.json({
      valid: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department
      }
    });
  } catch (error) {
    console.error('Erro na verificação:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Logout (invalidar token no frontend)
router.post('/logout', auth, async (req, res) => {
  try {
    // Em uma implementação mais robusta, você poderia manter uma blacklist de tokens
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Alterar senha
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });
    }

    const user = await User.findById(req.user._id);
    
    // Verificar senha atual
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    // Atualizar senha
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Senha alterada com sucesso' });

  } catch (error) {
    console.error('Erro ao alterar senha:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

