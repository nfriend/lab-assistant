module.exports = {
  options: {
    debug: true,
    func: {
      list: ['i18next.t', 'i18n.t', 'mft'],
    },
    removeUnusedKeys: true,
    sort: true,

    // The list of all languages codes supported by this skill
    lngs: ['en'],

    defaultLng: 'en',
    defaultValue: (lng: string, ns: string, key: string) =>
      lng === 'en' ? key : '',
    nsSeparator: false,
    keySeparator: false,
  },
};
