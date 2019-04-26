const express = require('express');

const db = require('../data/helpers/actionModel');

const router = express.Router();

router.get('/', (req, res) => {
  db.get()
    .then(actions => res.status(200).json(actions))
    .catch(err => res.status(500).json({ error: 'The actions data could not be retrieved.' }))
})

router.post('/', (res, req) => {})
router.put('/', (res, req) => {})
router.delete('/', (res, req) => {})

module.exports = router;