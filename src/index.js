global.$ = global.jQuery = require('jquery');
require('class-component');

require('./component/todo-item');
require('./component/new-todo');
require('./component/todo-list');
require('./component/clear-completed');
require('./component/filters');
require('./component/todo-edit');
require('./component/todo-count');
require('./component/toggle-all');
require('./service/router');
require('./service/todoapp');
