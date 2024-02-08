const User = require("../models/userSchema");

exports.register = async (req, res) => {
    try {
     console.log(req)
        if(req.isAuthenticated()){
            res.json(req.user);
        } else {
            res.json("user not logged in");
        }
    //   res.status(200).json({
    //     success:true,
    //     newuser
    //   });
    } catch (error) {
      return res.status(500).send(error);
    }
  };

