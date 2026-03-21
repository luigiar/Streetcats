const catRepo = require('../repositories/catRepository.js');

const addCat = async (title, description, latitude, longitude, imageUrl, userId) => {
  return await catRepo.insertCat(title, description, latitude, longitude, imageUrl, userId);

};

const getAllCats = async () => {
  return await catRepo.findAllCats();
};

module.exports = {addCat, get property () {
  
}}
