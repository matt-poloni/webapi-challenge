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

const checkDescription = (req, res, next) => {
  if(!req.body.description) { return next() }
  typeof req.body.description !== 'string'
    ? res.status(400).json({ error: 'The description value must be a string'})
    : next();
}

const checkDescLength = (req, res, next) => {
  if(!req.body.description) { return next() }
  req.body.description.length > 128
    ? res.status(400).json({ error: 'Please provide a description that does not exceed a length of 128 characters.' })
    : next();
}

const hasNotes = (req, res, next) => {
  !req.body.notes
    ? res.status(400).json({ error: 'Please provide notes for the action.' })
    : next();
};

const checkNotes = (req, res, next) => {
  if(!req.body.notes) { return next() }
  typeof req.body.notes !== 'string'
    ? res.status(400).json({ error: 'The notes value must be a string'})
    : next();
}

const checkCompleted = (req, res, next) => {
  if(!req.body.completed) { return next() }
  typeof req.body.completed !== 'boolean'
    ? res.status(400).json({ error: 'The completed value must be a boolean'})
    : next();
}

const stripReqBody = (req, res, next) => {
  const newReqBody = {};
  const allowed = ['project_id', 'description', 'notes', 'completed'];
  Object.keys(req.body).forEach(key => {
    if(allowed.includes(key)) {
      newReqBody[key] = req.body[key]
    }
  });
  req.body = newReqBody;
  next();
}

// ENDPOINTS

router.get('/', (req, res) => {
  db.get()
    .then(actions => res.status(200).json(actions))
    .catch(err => res.status(500).json({ error: 'The actions data could not be retrieved.' }))
})

router.post('/', stripReqBody, hasProjectID, validProjectID, hasDescription, checkDescription, checkDescLength, hasNotes, checkNotes, checkCompleted, (req, res) => {
  const newAction = req.body;
  db.insert(newAction)
    .then(insterted => res.status(201).json(insterted))
    .catch(err => res.status(500).json({ error: 'There was an error while creating the new action.' }))
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

router.put('/:id', stripReqBody, validProjectID, checkDescription, checkDescLength, checkNotes, checkCompleted, (req, res) => {
  const changes = req.body;
  const actionID = req.params.id;
  db.update(actionID, changes)
    .then(updated => {
      !updated
        ? res.status(404).json({ error: 'The action with the specified ID does not exist.' })
        : res.status(202).json(updated);
    })
    .catch(err => res.status(500).json({ error: 'There was an error while updating the specified action.' }))
})

router.delete('/:id', (req, res) => {
  const actionID = req.params.id;
  db.remove(actionID)
    .then(async count => {
      !count
        ? res.status(404).json({ error: 'The action with the specified ID does not exist.' })
        : res.status(204).end();
    })
    .catch(err => res.status(500).json({ error: 'The action could not be removed.' }));
})

module.exports = router;