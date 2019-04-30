const express = require('express');
const cors = require('cors');

const projectsRouter = require('./routers/projects');
const actionsRouter = require('./routers/actions');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("Everything's up and running");
})

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

module.exports = server;