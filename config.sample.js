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
};
