const express = require("express");
const {
  isSignedIn,
  isAuthenticated,
} = require("../controllers/auth.controller");
const {
  getPollById,
  createPoll,
  voteOnPoll,
  allPolls,
  getPoll,
  updatePoll,
  deletePoll,
} = require("../controllers/poll.controller");
const { getUserById } = require("../controllers/user.controller");

const router = express.Router();

router.param("userId", getUserById);
router.param("pollId", getPollById);

router.post("/create/poll/:userId", isSignedIn, isAuthenticated, createPoll);

router.put("/vote/:pollId/:optionId/:userId", isSignedIn, isAuthenticated, voteOnPoll);

router.get("/polls", isSignedIn, allPolls);

router.get("/poll/:pollId", isSignedIn, getPoll);

router.put("/update/poll/:userId/:pollId", isSignedIn, isAuthenticated, updatePoll);

router.delete("/delete/poll/:userId/:pollId", isSignedIn, isAuthenticated, deletePoll);

module.exports = router;
