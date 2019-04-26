const express = require('express');

const db = require('../data/helpers/projectModel');

const router = express.Router();

// MIDDLEWARE

const hasName = (req, res, next) => {
  !req.body.name
    ? res.status(400).json({ error: 'Please provide a name for the project.' })
    : next();
}

const hasDescription = (req, res, next) => {
  !req.body.description
    ? res.status(400).json({ error: 'Please provide a description for the project.' })
    : next();
}

// ENDPOINTS

router.get('/', (req, res) => {
  db.get()
    .then(projects => res.status(200).json(projects))
    .catch(err => res.status(500).json({ error: 'The projects data could not be retrieved.' }))
})

router.post('/', hasName, hasDescription, (req, res) => {
  const newProject = req.body;
  db.insert(newProject)
    .then(insterted => res.status(201).json(insterted))
    .catch(err => res.status(500).json({ error: 'There was an error while creating the new project.' }))
})

router.get('/:id', (req, res) => {
  const projectID = req.params.id;
  db.get(projectID)
    .then(project => {
      !project
        ? res.status(404).json({ error: 'The project with the specified ID does not exist.' })
        : res.status(200).json(project);
    })
      .catch(err => res.status(500).json({ error: 'The project at the specified ID could not be retrieved.' }))
})

router.put('/:id', (req, res) => {
  const changes = req.body;
  const projectID = req.params.id;
  db.update(projectID, changes)
    .then(updated => {
      !updated
        ? res.status(404).json({ error: 'The project with the specified ID does not exist.' })
        : res.status(202).json(updated);
    })
    .catch(err => res.status(500).json({ error: 'There was an error while updating the specified project.' }))
})

router.delete('/:id', (req, res) => {
  const projectID = req.params.id;
  db.remove(projectID)
    .then(async count => {
      !count
        ? res.status(404).json({ error: 'The project with the specified ID does not exist.' })
        : res.status(204).end();
    })
    .catch(err => res.status(500).json({ error: 'The project could not be removed.' }));
})

router.get('/:id/actions', (req, res) => {
  const projectID = req.params.id;
    db.getProjectActions(projectID)
    .then(actions => {
      !actions
        ? res.status(404).json({ error: 'The project with the specified ID does not exist.' })
        : res.status(200).json(actions);
    })
      .catch(err => res.status(500).json({ error: 'The actions for the project at the specified ID could not be retrieved.' }))
})

module.exports = router;