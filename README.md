# ProcessFlow Backend

Backend completo para o sistema ProcessFlow - SaaS de gerenciamento de processos e tarefas.

## 🚀 Funcionalidades

- ✅ **Autenticação JWT** completa com login/logout
- ✅ **Gerenciamento de Usuários** com diferentes níveis de acesso
- ✅ **CRUD de Processos** com status, prioridades e equipes
- ✅ **CRUD de Tarefas** com checklist, comentários e dependências
- ✅ **Estatísticas e Relatórios** em tempo real
- ✅ **Gerenciamento de Equipes** e produtividade
- ✅ **Segurança** com rate limiting e validações
- ✅ **MongoDB** com Mongoose ODM

## 📋 Pré-requisitos

- Node.js 18+ 
- MongoDB Atlas ou MongoDB local
- NPM ou Yarn

## ⚙️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd capacitar-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/capacitar
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
PORT=5000
NODE_ENV=production
```

4. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 🔐 Usuário Padrão

O sistema cria automaticamente um usuário administrador:

- **Username:** `admin`
- **Password:** `Lima12345`
- **Role:** `admin`

## 📚 Endpoints da API

### Autenticação
- `POST /auth/login` - Login do usuário
- `GET /auth/verify` - Verificar token
- `POST /auth/logout` - Logout
- `PUT /auth/change-password` - Alterar senha

### Usuários
- `GET /api/users` - Listar usuários (admin/manager)
- `GET /api/users/:id` - Buscar usuário por ID
- `POST /api/users` - Criar usuário (admin)
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário (admin)
- `GET /api/users/profile/me` - Perfil do usuário logado

### Processos
- `GET /api/processes` - Listar processos
- `GET /api/processes/:id` - Buscar processo por ID
- `POST /api/processes` - Criar processo
- `PUT /api/processes/:id` - Atualizar processo
- `DELETE /api/processes/:id` - Deletar processo (manager)
- `POST /api/processes/:id/comments` - Adicionar comentário
- `GET /api/processes/stats/dashboard` - Estatísticas

### Tarefas
- `GET /api/tasks` - Listar tarefas
- `GET /api/tasks/:id` - Buscar tarefa por ID
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa (manager)
- `POST /api/tasks/:id/comments` - Adicionar comentário
- `GET /api/tasks/my/tasks` - Tarefas do usuário logado
- `GET /api/tasks/stats/dashboard` - Estatísticas

### Equipes
- `GET /api/teams/members` - Listar membros da equipe
- `GET /api/teams/stats` - Estatísticas da equipe
- `GET /api/teams/member/:id/performance` - Performance individual
- `GET /api/teams/departments` - Listar departamentos

## 🔒 Níveis de Acesso

### Admin
- Acesso total ao sistema
- Gerenciar usuários
- Deletar processos e tarefas
- Ver todas as estatísticas

### Manager
- Gerenciar processos e tarefas
- Ver estatísticas da equipe
- Deletar processos e tarefas
- Não pode gerenciar usuários

### User
- Ver e editar próprios processos/tarefas
- Comentar em processos/tarefas
- Ver próprio perfil

## 🛡️ Segurança

- **JWT** para autenticação
- **Bcrypt** para hash de senhas (salt 12)
- **Rate Limiting** (100 requests/15min)
- **Helmet** para headers de segurança
- **CORS** configurado
- **Validação** de dados de entrada

## 📊 Modelos de Dados

### User
```javascript
{
  username: String (único),
  password: String (hash),
  name: String,
  email: String (único),
  role: ['admin', 'manager', 'user'],
  department: String,
  isActive: Boolean,
  lastLogin: Date
}
```

### Process
```javascript
{
  title: String,
  description: String,
  status: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'],
  priority: ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'],
  responsible: ObjectId (User),
  team: [ObjectId (User)],
  progress: Number (0-100),
  dueDate: Date,
  category: String,
  tags: [String]
}
```

### Task
```javascript
{
  title: String,
  description: String,
  status: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'],
  priority: ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'],
  assignedTo: ObjectId (User),
  process: ObjectId (Process),
  progress: Number (0-100),
  estimatedHours: Number,
  actualHours: Number,
  checklist: [{ item: String, completed: Boolean }]
}
```

## 🚀 Deploy

### Railway
1. Conecte seu repositório ao Railway
2. Configure as variáveis de ambiente
3. Deploy automático

### Heroku
1. `heroku create capacitar-backend`
2. `heroku config:set MONGODB_URI=...`
3. `heroku config:set JWT_SECRET=...`
4. `git push heroku main`

### Vercel
1. `vercel --prod`
2. Configure as variáveis de ambiente no dashboard

## 🧪 Testes

```bash
# Testar endpoint de login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Lima12345"}'

# Testar endpoint protegido
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 📝 Logs

O sistema gera logs detalhados para:
- Conexão com MongoDB
- Criação do usuário admin
- Erros de autenticação
- Operações CRUD
- Erros do servidor

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para o ProcessFlow**

