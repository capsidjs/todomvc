export default (el, type, detail) => {
	$(el)[0].dispatchEvent(new CustomEvent(type, {detail, bubbles: true}));
};
