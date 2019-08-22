module.exports = {
  options: {
    debug: true,
    lngs: ['en'],
    defaultLng: 'en',
    defaultValue: (lng: string, ns: string, key: string) => key,
    nsSeparator: false,
    keySeparator: false,
  },
};
