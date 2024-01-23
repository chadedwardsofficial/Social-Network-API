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
  async deleteThought(req, res) {

    try { 
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought){
        res.status(404).json({message:"Cannot find thought"})

      } 
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      
      res.status(200).json({message: "Thought has been deleted"})
      res.json({thought, user})
      
    } catch (error) {
      
    }

  },



    async updateThought(req, res){
      try {
        const thoughtData = await Thought.findByIdAndUpdate(req.params.userId,
        {$set: req.body},
        {new: true, runValidators:true })
        if (!thoughtData){
          return res.status(404).json({message: "No thought found by this ID"})
      }
      return res.status(200).json(thoughtData) 
    } 
      catch (error) {
        console.error(error);
        res.status(500).json(error);
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


  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionsId: req.params.assignmentId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'no thought found' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },



















}
