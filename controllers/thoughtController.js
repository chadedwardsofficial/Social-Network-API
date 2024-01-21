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

  }



















}
