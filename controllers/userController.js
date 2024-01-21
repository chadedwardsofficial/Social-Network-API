const { User } = require("../models");

// This is an aggregate function to add all the users together and return their value to get a sum of all users
const userCount = async () => {
  const numberOfUsers = await User.aggregate().count("userCount");
  return numberOfUsers;
};

module.exports = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find();

      const userObj = {
        users,
        userCount: await userCount(),
      };

      res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // This Will return a single user based off their ID and also use SubDoc Population to return their friends and also their associated Thoughts
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("thoughts")
        .populate("friends");

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // This operation Creates a User with the data pulled from the req.body
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // This operation will find a user by their ID and then delete that User
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res
          .status(404)
          .json({ message: "There is no user of that ID that exist" });
      } 
      res.json({message: "User has been deleted"});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

    async updateUser(req, res){
      try{
        const userData = await User.findByIdAndUpdate(req.params.userId, {
          $set: req.body
        }, {
          new: true, runValidators: true
        })
      if (!userData){
        return res.status(404).json({message: "No user found by this ID"})
      } 
      return res.status(200).json(userData)
      }
      catch (err) {
        console.error(err);
        res.status(500).json(err);
    
      }
     },






  async addFriend(req, res) {
    try {
      const { userId } = req.params;
      const { friendId } = req.body;
      if (!friendId) {
        return res.status(400).json({ message: "Friend ID is required" });
      }
      if (!mongoose.Types.ObjectId.isValid(friendId)) {
        return res.status(400).json({ message: "Invalid friend ID" });
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { friends: friendId } },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async deleteFriend(req, res) {
    try {
      const { userId } = req.params;
      const { friendId } = req.body;

      if (!friendId) {
        return res.status(400).json({ message: "Friend ID is required" });
      }

      if (!mongoose.Types.ObjectId.isValid(friendId)) {
        return res.status(400).json({ message: "Invalid friend ID" });
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { friends: friendId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
};
