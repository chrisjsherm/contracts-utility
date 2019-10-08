'use strict';
const Region = require('@chrisjsherm/region');

class Utility {
  /**
   * Config object matching the object shape of the ./config.sample.js file.
   *
   * @param {Object} config
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Create property buyerEmailAddress and property buyerPhoneNumber on the
   * supplied vendor parameter.
   *
   * @param {Object} vendor Object representing a contract vendor.
   *
   * @returns {Object} The updated vendor object.
   */
  addBuyerEmailAddressAndPhoneNumberProperties(vendor) {
    const emailAddressPhoneNumberTuple = this.splitBuyerContactField(vendor);
    vendor.buyerEmailAddress = emailAddressPhoneNumberTuple[0];
    vendor.buyerPhoneNumber = emailAddressPhoneNumberTuple[1];

    return vendor;
  }

  /**
   * Add an objectID property to a vendor object.
   *
   * @param {Object} vendor Object representing a contract vendor.
   */
  addObjectIDPropertyWithContractNumberValue(vendor) {
    if (vendor.contractNumber) {
      vendor.objectID = vendor.contractNumber;
    }

    return vendor;
  }

  /**
   * Add a region property to an Array of vendor objects.
   *
   * @param {Array} vendors Array of vendor objects.
   * @param {Array<Region>} regions Array of region objects
   *
   * @returns {Array} Map of vendor objects with a region property, where applicable.
   *
   * @throws {TypeError} vendors must be of type Array and regions must be an
   *  Array of Regions.
   * @throws {RangeError} Zip code entries must be strings of length five.
   */
  addRegionProperty(vendors, regions) {
    if (!Array.isArray(vendors)) {
      throw new TypeError('Parameter vendors must be of type Array.');
    }

    if (!Array.isArray(regions)) {
      throw new TypeError(
        'Parameter regions must be an Array. ' +
          `Invalid value: ${JSON.stringify(regions)}`,
      );
    }

    const regionByZipCode = new Map();
    for (const vendor of vendors) {
      // Get region information from memoized Map if we've already
      // seen this zip code.
      if (regionByZipCode.has(vendor[this.config.propertySupplierZipCode])) {
        vendor.region = regionByZipCode.get(
          vendor[this.config.propertySupplierZipCode],
        ).name;
        continue;
      }

      // We haven't seen this zip code yet.
      let matchingRegion;
      try {
        matchingRegion = Region.getMatchingRegion(
          vendor,
          this.config.propertySupplierZipCode,
          regions,
        );
      } catch (err) {
        if (err instanceof TypeError) {
          console.error(
            `Error getting matching region: \n${JSON.stringify(err, null, 2)}`,
          );
        }
      }

      if (matchingRegion) {
        // Memoize the region match.
        regionByZipCode.set(
          vendor[this.config.propertySupplierZipCode],
          matchingRegion,
        );

        // Set the region property on the vendor.
        vendor.region = matchingRegion.name;
      }
    }

    return vendors;
  }

  /**
   * For a given object, convert the supplied properties to boolean values.
   *
   * @param {Object} obj Object on which to convert properties.
   * @param {string[]} properties List of properties to convert to boolean values.
   *
   * @returns {Object} Memory reference to original object with converted properties.
   *
   * @throws {TypeError} If obj is not an Object or properties is not an Array of strings.
   */
  convertPropertiesToBoolean(obj, properties) {
    if (typeof obj !== 'object' || obj === null) {
      throw new TypeError(
        `Parameter 'obj' must be of type Object. Invalid value: ${JSON.stringify(
          obj,
        )}`,
      );
    }

    if (!Array.isArray(properties)) {
      throw new TypeError(
        `Parameter 'properties' must be an Array of strings. Invalid value: ${JSON.stringify(
          properties,
        )}`,
      );
    }

    for (let prop of properties) {
      if (typeof prop !== 'string') {
        throw new TypeError(
          `Each property must be a string. Invalid value: ${JSON.stringify(
            prop,
          )}`,
        );
      }
      obj[prop] = !!obj[prop];
    }

    return obj;
  }

  /**
   * Given a contract vendor, split its buyerContact field, which contains
   * email address and phone number information, into two separate fields.
   *
   * @param {Object} vendor Object representing a contract vendor.
   *
   * @returns {Array} The first element is the buyer's email address and the
   *  second element is the buyer's phone number.
   *
   * @throws Error The vendor must have a buyerContact property.
   * @throws TypeError The buyerContact property must be a {string}.
   * @throws Error The buyerContact value must contain a valid email address
   *  and phone number.
   */
  splitBuyerContactField(vendor) {
    if (!vendor.hasOwnProperty(this.config.propertyBuyerContact)) {
      // Allow contracts without buyer contact information.
      return [null, null];
    }

    const buyerContactValue = vendor[this.config.propertyBuyerContact];

    if (typeof buyerContactValue !== 'string') {
      throw new TypeError(
        'Parameter vendor must have a property ' +
          this.config.propertyBuyerContact +
          ' of type {string}.',
      );
    }

    const indexOfComma = buyerContactValue.indexOf(',');

    const emailAddress = buyerContactValue.substring(0, indexOfComma);
    if (!this.config.regexEmailAddress.test(emailAddress)) {
      throw new Error(
        `The value of ${this.config.propertyBuyerContact} ` +
          `must have a valid email address. Invalid value: ${emailAddress}`,
      );
    }

    const phoneNumber = buyerContactValue.substring(indexOfComma + 2);
    if (!this.config.regexPhoneNumber.test(phoneNumber)) {
      throw new Error(
        `The value of ${this.config.propertyBuyerContact} ` +
          `must have a valid phone number. Invalid value: ${phoneNumber}`,
      );
    }

    return [emailAddress, phoneNumber];
  }
}

module.exports = Utility;
