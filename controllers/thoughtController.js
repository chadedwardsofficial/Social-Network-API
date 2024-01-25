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
      console.error(error);
        res.status(500).json(error);
    }

  },
  async deleteThought(req, res) {
    try {
      const { userId } = req.params;
      const { thoughtId} = req.body;

      if (!thoughtId) {
        return res.status(400).json({ message: "That thought does not exist" });
      }


      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { thoughts: thoughtId } },
        { new: true }
      );
      

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const thought = await Thought.findByIdAndDelete({_id: thoughtId});


      res.json({message: `The thought has been deleted from the user's thoughts.`});
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },


    async updateThought(req, res){
      try {
        const thoughtData = await Thought.findByIdAndUpdate(req.params.thoughtId,
        {$set: req.body},
        {new: true, runValidators:true })
        if (!thoughtData){
          return res.status(404).json({message: "No thought found by this ID"})
      }
       res.status(200).json(thoughtData) 
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
        { $pull: { reactions: { reactionsId: req.params.reactionsId } } },
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
