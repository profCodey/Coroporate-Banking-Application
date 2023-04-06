const AuthQuestions = require("../../model/authQuestions");


const createAuthQuestions = async (req, res) => {
    try {
        // let authQuestions = [];
        // console.log("oooooo")
        // const questions = await AuthQuestions.create({
        //    authQuestions: authQuestions.push(req.body.secretQuestion)
        // });
        // console.log("ssssss")

        // let secret_question = await questions.save()
  
        return res
          .status(200)
          .json({
              message: "You have successfully created a new secret question",
              data: secret_question, 
            status: "success",
          });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};


module.exports = createAuthQuestions;