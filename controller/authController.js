const Encryption = require('../util.js');
const util = new Encryption();

const cremential = {
    name : "admin",
    password : "002968392b901e9305d87e3"
  //'123',"
};

exports.authenticate = (req,res,next) => {
  if(req.session.users){
    next();
  }
  else{
    res.redirect('/login');
  }
};

exports.logout  = (req,res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

exports.showLoginPage = (req,res,next) => {
  res.render('login',{error : req.query.error || null});
};

exports.login = (req,res) => {
  const {name,password} = req.body;
  const Users = require('../models/userModel.js');
  const UsersModel = new Users();

  try{
    UsersModel.loadUsersFromFile('./users.json');

    const user = UsersModel.findUserByName(name);
    if(!user){
      const error = `Invalid Username: ${name}`;
      console.log(error);
      res.render('login',{error});
      return;
    }


    const encryptionPassword = util.encrypt(password);
    if(user.password === encryptionPassword){
      req.session.users = {name : user.name };
      console.log(`${name} Log-in`);
      res.redirect('/issues');
      return;
    }
    else{
      const error = "Invalid Password";
      console.log(error);
      res.render('login',{ error : error });

  }
  }catch(error){
    console.error("Error during login:",error);
    res.render ('login',{error : 'An error occurred during login. Please try again.'});
  }   
};

exports.showRegisterPage = (req,res,next) => {
  res.render('register',{error : req.query.error || null});
};


exports.register = async (req,res) => {
  const {name,password} = req.body;
  const Users = require('../models/userModel.js');
  const UsersModel = new Users();

  try{
    UsersModel.loadUsersFromFile('./users.json');
    const existUser = UsersModel.findUserByName(name);

    if(existUser){
      const error = `Username ${name} already exists.`;
      console.log(error);
      res.render('register',{error});
      return;
    }
    else{
      const encryptionPassword = util.encrypt(password);
      UsersModel.AddUsers({name , password : encryptionPassword});
      UsersModel.saveUsersToFile("./users.json");
      console.log(`Username ${name} registered successfully.`);
      res.redirect('/login');
    }

  }catch(error){
    console.error('Error during registration:', error);
    res.render('register', { error: 'An error occurred during registration. Please try again.' });
  }


}
