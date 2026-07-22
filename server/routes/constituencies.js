const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorizeHead = require('../middlewares/authorizeHead');
const Constituency = require('../models/constituency');

router.use(authenticate, authorizeHead);

// Election-scoped lookup used when assigning an administrator.
router.get('/election/:electionId', async (req, res) => {
  try {
    const constituencies = await Constituency.find({ electionId: req.params.electionId })
      .sort({ constituencyNumber: 1, constituencyName: 1 });
    res.json(constituencies);
  } catch (error) {
    res.status(400).json({ message: 'Invalid election id' });
  }
});

module.exports = router;
