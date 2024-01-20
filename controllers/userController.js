const { User } = require('../models');


// This is an aggregate function to add all the users together and return their value to get a sum of all users
const userCount = async () => {
    const numberOfUsers = await User.aggregate()
      .count('userCount');
    return numberOfUsers;
  };

  module.exports = {
    async getUsers(req, res) {
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

    // This Will return a single user based off their ID and also use SubDoc Population to return their friends and also their assoaciated Thoughts
    async getSingleUser(req, res) {
        try {
          const user = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friends');
    
          if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
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
              return res.status(404).json({ message: 'There is no user of that ID that exist' });
            }
            }  catch (err) {
                console.log(err);
                res.status(500).json(err);}
        }
  },

























};

