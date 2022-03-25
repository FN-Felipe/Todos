const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
    const verificar = users.find((verificar)=> verificar.username === username);

    if(!verificar){
        return response.status(404).json({error: "Usuário não encontrado"});
    }

    request.us = verificar;
    return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const verificarExisteUsername = users.find((verificar) => verificar.username === username)
  if(verificarExisteUsername){
    return response.status(400).json({error: "Username já cadastrado!"})
  }
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  }
  users.push(user);
  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { us } = request;
  return response.json(us.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const {us} = request;
  const todo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date(),
  };
  us.todos.push(todo);
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { us } = request;
  const { id } = request.params;

  const verificarID = us.todos.find(verificarID => verificarID.id === id)

  if(!verificarID){
    return response.status(404).json({error: "Obejeto não encontrado"});
  }

  verificarID.title = title;
  verificarID.deadline = new Date(deadline);
  return response.status(201).json(verificarID);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { us } = request;
  const { id } = request.params;

  const verificarAlterar = us.todos.find(verificarAlterar =>verificarAlterar.id === id)
  if(!verificarAlterar){
    return response.status(404).json({error: "Obejeto não encontrado"});
  }
  us.done = true;
  return response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { us } = request;
  const { id } = request.params;

  const paraExcluir = us.todos.find(paraExcluir => paraExcluir.id === id)
  if(paraExcluir === -1){
    return response.status(404).json({error: "Obejeto não encontrado"});
  }
  us.todos.splice(paraExcluir, 1)
  return response.status(204).send();
});

module.exports = app;