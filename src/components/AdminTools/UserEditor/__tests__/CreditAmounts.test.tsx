import React from 'react';
import { shallow } from 'enzyme';
import { CreditAmounts } from '../CreditAmounts';
import toJson from 'enzyme-to-json';

describe('CreditAmounts Tests', () => {

  it('Compares CreditAmounts to snapshot', () => {

    const storecreditcategories = { green: 'Purchase', red: 'Sales', white: 'Generic', yellow: 'Reward' };

    const creditAmounts = shallow(<CreditAmounts
      userId="mockuserid"
      storecredit={storecredit}
      storecreditcategories={storecreditcategories}
    />);

    expect(creditAmounts.exists()).toBe(true);
    expect(toJson(creditAmounts)).toMatchSnapshot();
  });
});

const storecredit = { mockuserid: { testEvent1: {
  category: 'red',
  creditAddedBy: '1N7UUK1EBrZBtPYRfblnKaadtGN2',
  creditAddedByName: 'Sales person',
  date: 'Thu, 13 Sep 2018 20:05:13 GMT',
  note: 'Credited cards',
  value: 139,
},
testEvent2: {
  category: 'red',
  creditAddedBy: '37WQdFDt7MPw7SIY8nIPj3mZLUf1',
  creditAddedByName: 'C E O',
  date: 'Sun, 30 Sep 2018 09:53:23 GMT',
  note: 'Participation',
  value: -50,
},
testEvent3: {
  category: 'red',
  creditAddedBy: '1N7UUK1EBrZBtPYRfblnKaadtGN2',
  creditAddedByName: 'Sales person',
  date: 'Tue, 02 Oct 2018 16:05:39 GMT',
  note: 'Bought singles',
  value: -48,
},
testEvent4: {
  category: 'red',
  creditAddedBy: '1N7UUK1EBrZBtPYRfblnKaadtGN2',
  creditAddedByName: 'Sales person',
  date: 'Thu, 04 Oct 2018 14:22:22 GMT',
  note: 'Bought singles',
  value: -17.9,
},
testEvent5: {
  category: 'red',
  creditAddedBy: '1N7UUK1EBrZBtPYRfblnKaadtGN2',
  creditAddedByName: 'Sales person',
  date: 'Fri, 05 Oct 2018 15:44:19 GMT',
  note: 'Bought singles',
  value: -0.4,
},
testEvent6: {
  category: 'red',
  creditAddedBy: '1N7UUK1EBrZBtPYRfblnKaadtGN2',
  creditAddedByName: 'Sales person',
  date: 'Fri, 09 Nov 2018 14:58:55 GMT',
  note: 'Tournament participation',
  value: -5,
},
testEvent7: {
  category: 'red',
  creditAddedBy: '1N7UUK1EBrZBtPYRfblnKaadtGN2',
  creditAddedByName: 'Sales person',
  date: 'Fri, 09 Nov 2018 18:04:52 GMT',
  note: 'Bought accessories',
  value: -5,
},
testevent8: {
  category: 'white',
  creditAddedBy: '1N7UUK1EBrZBtPYRfblnKaadtGN2',
  creditAddedByName: 'Sales person',
  date: 'Sat, 01 Dec 2018 10:53:41 GMT',
  note: 'Bought cards',
  value: -12.7,
} } };