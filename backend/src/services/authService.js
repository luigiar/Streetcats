const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepo = require('../repositories/authRepository'); 


const registerUser = async (username, email, password) => {
//chiedo al repo se esiste già un utente 
const existingUser = await authRepo.findUserByEmailOrUsername(email, username);

if (existingUser.length > 0) {
    throw new Error('Email o username già in uso');

  }

//logica di business, criptazione password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

//chiedo al repo di salvare i dati
  const newUser = await authRepo.createUser(username, email, hashedPassword);
  return newUser;
};


const loginUser = async (email,password) => {
  //cerchiamo l'utente nel db tramite email 
const user = await authRepo.findUserByEmail(email);

if (!user) {
  throw new Error('Credenziali non valide');
  }

  //confrontiamo le password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if(!isMatch) {
      throw new Error('Credenziali non valide');
  }


 //creamo un token JWT
  const token = jwt.sign(
    {userId: user.id, username: user.username}, //dati da inserire nel token (dati sicuri, non la password)
    process.env.JWT_SECRET, //chiave segreta per firmare il token in setInterval
    {expiresIn: '24h'} //scadenza del token
  );
  
  //restituisco il token e i dati dell'utente
  return {
    token,
    user: { id: user.id, username: user.username, email: user.email }
  };

}
  module.exports = {
registerUser,
loginUser
  };
