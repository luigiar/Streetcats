const sanitizeHtml = require('sanitize-html');

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    //ciclo dinamico su tutto il req.body, se è una stringa la sanitizzo, altrimenti la lascio così com'è
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], {
          //sanificazione base, rimuove tutti i tag e attributi HTML, ma si possono personalizzare in base alle esigenze
          allowedTags: [], 
          allowedAttributes: {}
        });
      }
    }
  }
  next();
};

module.exports = sanitizeMiddleware;
