const CommonBilling = {
  getBusinessList: () => {
    const businessList = [
      {
        period: 'Month',
        package: 'Basic',
        price: {
          USD: '9',
          EUR: '9',
          SEK: '129',
        },
      },
      {
        period: 'Month',
        package: 'Super',
        price: {
          USD: '17',
          EUR: '35',
          SEK: '320',
        },
      },
      {
        period: 'Month',
        package: 'Ultra',
        price: {
          USD: '29',
          EUR: '70',
          SEK: '640',
        },
      },
      {
        period: 'Month',
        package: 'Ultimate',
        price: {
          USD: 2.9,
          EUR: 2.9,
          SEK: 29,
        },
      },
      {
        period: 'Year',
        package: 'Basic',
        price: {
          USD: '84',
          EUR: '84',
          SEK: '1188',
        },
      },
      {
        period: 'Year',
        package: 'Super',
        price: {
          USD: '168',
          EUR: '360',
          SEK: '3360',
        },
      },
      {
        period: 'Year',
        package: 'Ultra',
        price: {
          USD: '300',
          EUR: '720',
          SEK: '6720',
        },
      },
      {
        period: 'Year',
        package: 'Ultimate',
        price: {
          USD: '480',
          EUR: '1080',
          SEK: '9660',
        },
      },
    ];
    return businessList;
  },
  getExtraBusinessList: () => {
    const extraList = [
      {
        period: 'Monthly',
        package: 'LeadClipper',
        price: {
          USD: '9',
          EUR: '9',
          SEK: '129',
        },
      },
      {
        period: 'Yearly',
        package: 'LeadClipper',
        price: {
          USD: '84',
          EUR: '84',
          SEK: '1188',
        },
      },
    ];
    return extraList;
  },
  SEKCountries: ['Sweden', 'Norway'],
  EURCountries: [
    'Austria',
    'Belgium',
    'Bulgaria',
    'Croatia',
    'CyprusCzech Republic',
    'Denmark',
    'Estonia',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'Hungary',
    'Ireland',
    'Italy',
    'Latvia',
    'Lithuania',
    'Luxembourg',
    'Malta',
    'Netherlands',
    'Poland',
    'Portugal',
    'Romania',
    'Slovakia',
    'Slovenia',
    'Spain',
    'United Kingdom',
  ],
};
export default CommonBilling;
