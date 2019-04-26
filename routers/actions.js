const express = require('express');

const db = require('../data/helpers/actionModel');
const dbProjects = require('../data/helpers/projectModel');

const router = express.Router();

// MIDDLEWARE

const hasProjectID = (req, res, next) => {
  !req.body.project_id
    ? res.status(400).json({ error: 'Please provide a project id for the action.' })
    : next();
}

const validProjectID = async (req, res, next) => {
  if(!req.body.project_id) { return next() }
  const invalid = await dbProjects.get(req.body.project_id);
  !invalid
  ? res.status(400).json({ error: 'The specified project id does not exist. Please provide a valid project id.' })
  : next();
}

const hasDescription = (req, res, next) => {
  !req.body.description
    ? res.status(400).json({ error: 'Please provide a description for the action.' })
    : next();
};

const checkDescLength = (req, res, next) => {
  req.body.description.length > 128
    ? res.status(400).json({ error: 'Please provide a description that does not exceed a length of 128 characters.' })
    : next();
}

const hasNotes = (req, res, next) => {
  !req.body.notes
    ? res.status(400).json({ error: 'Please provide notes for the action.' })
    : next();
};

// ENDPOINTS

router.get('/', (req, res) => {
  db.get()
    .then(actions => res.status(200).json(actions))
    .catch(err => res.status(500).json({ error: 'The actions data could not be retrieved.' }))
})

router.get('/:id', (req, res) => {
  const actionID = req.params.id;
  db.get(actionID)
  .then(action => {
    !action
      ? res.status(404).json({ error: 'The action with the specified ID does not exist.' })
      : res.status(200).json(action);
  })
    .catch(err => res.status(500).json({ error: 'The action at the specified ID could not be retrieved.' }))
})

router.post('/', hasProjectID, validProjectID, hasDescription, checkDescLength, hasNotes, (req, res) => {
  const newAction = req.body;
  db.insert(newAction)
    .then(insterted => res.status(201).json(insterted))
    .catch(err => res.status(500).json({ error: 'There was an error while creating the new action.' }))
})

router.put('/:id', validProjectID, (req, res) => {
  const changes = req.body;
  const actionID = req.params.id;
  db.update(actionID, changes)
    .then(updated => {
      !updated
        ? res.status(400).json({ error: 'The action with the specified ID does not exist.' })
        : res.status(202).json(updated);
    })
    .catch(err => res.status(500).json({ error: 'There was an error while updating the specified action.' }))
})

router.delete('/', (res, req) => {})

module.exports = router;