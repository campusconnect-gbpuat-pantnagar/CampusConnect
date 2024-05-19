const Poll = require("../models/Poll")
const { getUserById } = require("../controllers/user.controller")

exports.getPollById = (req, res, next, Id) => {
  Poll.findById(Id)
    .populate("options.votes", "name")  
    .exec((err, poll) => {
      if (err || !poll) {
        return res.status(400).json({
          errorMsg: "Poll not found or an error occurred",
        });
      }
      req.poll = poll;
      next();
    });
};


exports.createPoll = (req, res) => {
  const { user, title, options } = req.body;
  const poll = new Poll({
    user,
    title,
    options: options.map(option => ({ text: option, votes: [] }))
  });
  poll.save((err, savedPoll) => {
    if (err) {
      return res.status(400).json({ errorMsg: "Failed to create poll" });
    }
    res.json(savedPoll);
  });
};


exports.voteOnPoll = (req, res) => {
  const { pollId, optionId, userId } = req.params;
  Poll.findOneAndUpdate(
    { "_id": pollId, "options._id": optionId },
    { 
      $addToSet: { "options.$.votes": userId },
      $inc: { "totalVotes": 1 }
    },  
    { new: true }
  ).exec((err, poll) => {
    if (err || !poll) {
      return res.status(400).json({ errorMsg: "Failed to register vote" });
    }
    res.json(poll);
  });
};


exports.allPolls = (req, res) => {
  Poll.find()
    .populate("user", "name")  
    .exec((err, polls) => {
      if (err) {
        return res.status(400).json({ errorMsg: "An error occurred" });
      }
      res.json(polls);
    });
};


exports.getPoll = (req, res) => {
  res.json(req.poll);
};


exports.updatePoll = (req, res) => {
  const update = { title: req.body.title, options: req.body.options };
  Poll.findByIdAndUpdate(req.poll._id, update, { new: true })
    .exec((err, updatedPoll) => {
      if (err || !updatedPoll) {
        return res.status(400).json({
          errorMsg: "Failed to update poll"
        });
      }
      res.json(updatedPoll);
    });
};


exports.deletePoll = (req, res) => {
  Poll.findByIdAndRemove(req.poll._id)
    .exec((err, poll) => {
      if (err || !poll) {
        return res.status(400).json({
          errorMsg: "Failed to delete poll"
        });
      }
      res.status(200).json({ message: "Poll deleted successfully" });
    });
};

