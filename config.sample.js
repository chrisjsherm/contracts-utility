'use strict';
const Region = require('@chrisjsherm/region');

module.exports = {
  csvConfiguration: {
    ignoreEmpty: true,
  },
  nodeEnvironmentProduction: 'production',
  propertyBuyerContact: 'buyerContact',
  propertySupplierZipCode: 'supplierZip',
  regexEmailAddress: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  regexPhoneNumber: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
  regions: [
    new Region(
      'New River Valley',
      new Set(['24068', '24073', '24061', '24060', '24141', '24142', '24143']),
    ),
    new Region(
      'Roanoke Valley',
      new Set([
        '24011',
        '24012',
        '24013',
        '24014',
        '24015',
        '24016',
        '24017',
        '24018',
        '24019',
      ]),
    ),
  ],
};
