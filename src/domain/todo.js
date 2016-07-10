/**
 * Todo class is the model of single todo item.
 */
class Todo {
	/**
	 * @param {String} id The todo's id
	 * @param {String} title The todo's title
	 * @param {Boolean} completed The flag indicates if it's done or not
	 */
	constructor(id, title, completed) {
		this.id = id;
		this.title = title;
		this.completed = completed;
	}
}

module.exports = Todo;
