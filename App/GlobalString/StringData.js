import I18n from 'react-native-i18n';
I18n.fallbacks = true;
// English language is the main language for fall back:
I18n.translations = {
 en: require('./en.json')
}
let languageCode = I18n.locale.substr(0, 2)
switch (languageCode) {
  case 'en':
    I18n.translations.af = require('./en.json')
    break
}
export default I18n;
