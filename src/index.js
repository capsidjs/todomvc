const $ = global.$ = require('jquery');
const cc = require('classcaps');
const ccj = require('classcaps/jquery');

ccj(cc, $);

require('./component/todo-item');
require('./component/new-todo');
require('./component/todo-list');
require('./component/clear-completed');
require('./component/filters');
require('./component/edit');
require('./component/todo-count');
require('./component/toggle-all');
require('./service/router');
require('./service/todoapp');
