const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send({ response: "I am alive" }).status(200);
  });

router.post('/', (req, res) => {
  console.log('POST DATA', req, res)
});

 module.exports = router;