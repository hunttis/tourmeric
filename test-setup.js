/* eslint-disable @typescript-eslint/no-var-requires */
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const EnzymeToJson = require('enzyme-to-json');

enzyme.configure({ adapter: new Adapter() });
expect.addSnapshotSerializer(EnzymeToJson.createSerializer({ noKey: false, mode: 'deep' }));
