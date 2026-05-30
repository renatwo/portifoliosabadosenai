# Portfólio Pessoal com Painel Admin (Firebase Spark)

Este projeto é um portfólio pessoal moderno com painel administrativo (CRUD) integrado ao Firebase (Authentication e Cloud Firestore) em sua modalidade gratuita (Plano Spark). A aplicação foi construída como uma SPA utilizando **React + Vite** com estilização brutalista geométrica baseada em Vanilla CSS (sem Tailwind/outras dependências pesadas), garantindo carregamento ultrarrápido (Lighthouse > 90) e zero custos de infraestrutura.

---

## 🚀 Tecnologias Utilizadas
- **Frontend:** React (v19) + Vite (v8)
- **Roteamento:** React Router DOM (v7)
- **Ícones:** Lucide React
- **Autenticação:** Firebase Auth (Google OAuth Provider)
- **Banco de Dados:** Cloud Firestore (Modo Nativo)
- **Hospedagem:** Firebase Hosting

---

## 🔒 Configuração Crítica de Autenticação e Segurança

### 1. No Cliente (Frontend React)
O acesso à interface administrativa (/admin) é restrito a **uma única conta Google específica**. O UID dessa conta deve ser configurado na variável de ambiente local `.env`.
Após o login bem-sucedido com a conta Google, o frontend valida se o UID retornado coincide com o UID configurado. Se for diferente, o sistema efetua o logout automático imediatamente e notifica o usuário com uma mensagem de acesso negado.

Crie um arquivo `.env` na raiz do projeto copiando o modelo `.env.example` e preencha as variáveis com as chaves do seu projeto Firebase e o UID autorizado:
```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id

# O UID da única conta Google autorizada a fazer modificações e acessar o CRUD
VITE_ALLOWED_UID=insira_aqui_seu_uid_do_firebase_auth
```

### 2. No Banco de Dados (Firestore Security Rules)
Para evitar que o frontend seja burlado via console do navegador, as regras do Firestore barram qualquer inserção, edição ou exclusão que não venha do UID administrador permitido.

Abra o arquivo `firestore.rules` localizado na raiz do projeto e altere o valor da string `SUBSTITUA_PELO_UID_DO_ADMIN` pelo seu UID real:
```javascript
function isAdmin() {
  return request.auth != null && request.auth.uid == 'SEU_UID_DO_FIREBASE_AUTH_REAL_AQUI';
}
```
*Dica: Você pode encontrar o seu UID de usuário no console do Firebase > Build > Authentication > Users após efetuar o primeiro login administrativo de teste.*

---

## 💻 Como Rodar Localmente

### 1. Instalar as dependências do projeto
No terminal, execute:
```bash
npm install
```

### 2. Rodar o servidor de desenvolvimento
Inicie o Vite localmente:
```bash
npm run dev
```
A aplicação abrirá no endereço local fornecido no terminal (geralmente `http://localhost:5173`).

---

## 📦 Como Fazer Deploy no Firebase Hosting via Google IDX

Como o ambiente do Google IDX já possui as ferramentas necessárias, execute os passos abaixo diretamente pelo terminal integrado:

### 1. Efetuar Login no Firebase CLI (se necessário)
Para autenticar a CLI do Firebase no seu espaço de trabalho, execute:
```bash
npx firebase login
```
*Siga as instruções exibidas no console do navegador para autorizar o acesso.*

### 2. Associar o Projeto Firebase (se não estiver associado)
Caso o projeto não esteja vinculado (verifique o arquivo `.firebaserc`), você pode associá-lo executando:
```bash
npx firebase use --add
```
Selecione o seu ID de projeto correspondente na lista exibida.

### 3. Gerar o Build de Produção do React
Crie o pacote estático otimizado na pasta `dist`:
```bash
npm run build
```

### 4. Publicar Regras e Hospedagem
Envie as regras de segurança do Firestore e publique os arquivos estáticos no Firebase Hosting de uma só vez:
```bash
npx firebase deploy
```

Após a conclusão, a Firebase CLI exibirá a URL pública gerada no formato `https://seu-projeto.web.app` ou `https://seu-projeto.firebaseapp.com`.

---

## 📁 Estrutura do Banco de Dados (Firestore)
Os projetos são armazenados na coleção `projects` com o seguinte esquema de dados validado diretamente na gravação:
- `title` (string) - Título do projeto
- `shortDescription` (string) - Resumo de 1-2 frases para exibição no card
- `description` (string) - Detalhamento completo do projeto
- `technologies` (array de strings) - Tecnologias utilizadas (Tags)
- `category` (string) - Ex: Frontend, Backend, UI/UX
- `status` (string) - Ex: Concluído, Em andamento
- `imageUrl` (string) - URL externa da imagem/thumbnail
- `demoUrl` (string, opcional) - Link do deploy ativo
- `repositoryUrl` (string, opcional) - Link do repositório no GitHub
- `featured` (boolean) - Define se o projeto deve ser destacado
- `order` (number) - Número inteiro para ordenar a listagem manualmente no frontend
- `createdAt` (timestamp) - Data de criação do registro
- `updatedAt` (timestamp) - Data de última atualização
