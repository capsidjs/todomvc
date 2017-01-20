const $ = global.$ = require('jquery');
const capsid = require('capsid');

require('capsid/jquery')(capsid, $);

require('./component');
require('./service');
