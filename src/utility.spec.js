const assert = require('chai').assert;
const Utility = require('./utility');
const utilityConfig = require('../config.sample');
const Region = require('@chrisjsherm/region');

describe('Utility service', () => {
  let UtilityService;

  beforeEach(() => {
    UtilityService = new Utility(utilityConfig);
  });

  // addBuyerEmailAddressAndPhoneNumberProperties.
  it(
    'should add buyerEmailAddress and buyerPhoneNumber properties on the ' +
      'supplied vendor parameter.',
    () => {
      const emailAddress = 'wilsont@vt.edu';
      const phoneNumber = '(540) 231-7402';
      const vendor = UtilityService.addBuyerEmailAddressAndPhoneNumberProperties(
        {
          buyerContact: `${emailAddress}, ${phoneNumber}`,
        }
      );
      assert.isTrue(vendor.hasOwnProperty('buyerEmailAddress'));
      assert.isTrue(vendor.hasOwnProperty('buyerPhoneNumber'));
      assert.strictEqual(vendor.buyerEmailAddress, emailAddress);
      assert.strictEqual(vendor.buyerPhoneNumber, phoneNumber);
    }
  );

  // addObjectIDPropertyWithContractNumberValue.
  it(
    'should add an objectID property to a object if the object has ' +
      'a contractNumber property',
    () => {
      const vendors = [
        {
          contractNumber: 'TG-001-08',
        },
        {
          supplierZip: '24068',
        },
      ];

      assert.deepStrictEqual(
        UtilityService.addObjectIDPropertyWithContractNumberValue(vendors[0]),
        {
          contractNumber: 'TG-001-08',
          objectID: 'TG-001-08',
        }
      );

      assert.deepStrictEqual(
        UtilityService.addObjectIDPropertyWithContractNumberValue(vendors[1]),
        {
          supplierZip: '24068',
        }
      );
    }
  );

  // addRegionProperty.
  it('should add a region property to each vendor with a matching region', () => {
    const vendors = [
      {
        supplierZip: '24068',
      },
      {
        supplierZip: '22152',
      },
      {
        supplierZip: '24068',
      },
    ];

    const regions = [
      new Region(
        'New River Valley',
        new Set(['24068', '24073', '24061', '24060', '24141', '24142', '24143'])
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
        ])
      ),
    ];

    assert.deepStrictEqual(
      UtilityService.addRegionProperty(vendors, regions)[0],
      {
        supplierZip: '24068',
        region: 'New River Valley',
      }
    );

    assert.deepStrictEqual(
      UtilityService.addRegionProperty(vendors, regions)[1],
      {
        supplierZip: '22152',
      }
    );
  });

  // convertPropertiesToBoolean.
  it('should convert each property to a boolean value.', () => {
    assert.deepStrictEqual(
      UtilityService.convertPropertiesToBoolean(
        {
          name: 'Zobel',
          professor: 'Emeritus',
        },
        ['professor']
      ),
      {
        name: 'Zobel',
        professor: true,
      }
    );
  });

  // splitBuyerContactField.
  it(
    'should split the buyerContact field into emailAddress and ' +
      'phone number values.',
    () => {
      const wilsonPhoneNumberEmailTuple = UtilityService.splitBuyerContactField(
        {
          buyerContact: 'wilsont@vt.edu, (540) 231-7402',
        }
      );
      assert.strictEqual(wilsonPhoneNumberEmailTuple[0], 'wilsont@vt.edu');
      assert.strictEqual(wilsonPhoneNumberEmailTuple[1], '(540) 231-7402');
    }
  );

  it(
    'should return null values when a contract missing the buyer contact ' +
      'field is passed to splitBuyerContactField',
    () => {
      assert.deepStrictEqual(UtilityService.splitBuyerContactField({}), [
        null,
        null,
      ]);
    }
  );

  it('should throw an error when invalid data is passed to splitBuyerContactField', () => {
    // Number instead of string.
    assert.throws(
      () =>
        UtilityService.splitBuyerContactField({
          buyerContact: 23,
        }),
      TypeError
    );

    // Only has a phone number.
    assert.throws(
      () =>
        UtilityService.splitBuyerContactField({
          buyerContact: '(540) 231-5555,',
        }),
      Error
    );

    // Has an invalid phone number.
    assert.throws(
      () =>
        UtilityService.splitBuyerContactField({
          buyerContact: 'jsumpter@vt.edu, abc',
        }),
      Error
    );
  });
});
