const { User, Thought } = require("../models");

module.exports = {


  async createThought(req, res) {

    try { 
      const thought = await Thought.create(req.body)
      const updatedUser = await User.findByIdAndUpdate(req.body.userId, {
        $addToSet: {thoughts: thought._id}
      }, {new:true}) 
      if (!updatedUser){
        res.status(404).json({message:"Cannot Find Associated User"})
      } res.json({thought, updatedUser})
      
    } catch (error) {
      
    }

  },
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },



  async getSingleThought(req, res){
    try {
      const thought = await Thought.findOne({_id: req.params.thoughtId})
      
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
       res.json(thought)
    } catch (error) {
      res.status(500).json(err);
    }
  },







  async addReaction(req, res) {

    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },






















}
