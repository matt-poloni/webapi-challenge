const express = require('express');

const db = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', (req, res) => {
  db.get()
    .then(projects => res.status(200).json(projects))
    .catch(err => res.status(500).json({ error: 'The projects data could not be retrieved.' }))
})

router.post('/', (req, res) => {})
router.put('/', (req, res) => {})
router.delete('/', (req, res) => {})
router.get('/:id', (req, res) => {})

module.exports = router;