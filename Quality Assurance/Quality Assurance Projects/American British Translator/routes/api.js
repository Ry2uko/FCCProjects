'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let text = req.body.text,
      locale = req.body.locale,
      localeArr = [
        'american-to-british',
        'british-to-american'
      ],
      translation;

      if (text === undefined || locale === undefined) {
        return res.json({
          error: "Required field(s) missing"
        });
      } else if (text === '') {
        return res.json({
          error: "No text to translate"
        });
      } else if (!localeArr.includes(locale)) {
        return res.json({
          error: "Invalid value for locale field"
        });
      }

      switch (locale) {
        case 'american-to-british':
          translation = translator.britishTranslate(text);
          break;
        case 'british-to-american':
          translation = translator.americanTranslate(text);
      }
      
      if (!translation) translation = 'Everything looks good to me!';
      res.json({ text, translation });

    });
};
