var ObjectID = require('mongodb').ObjectID;
var extend = require('extend');

var hexRegExp = /^[a-fA-F0-9]{24}$/;
var digitRegExp = /^[\d]$/;
var defaults = {
	idRegExp: /_id$/,
	idsRegExp: /_ids$/
};

function _convert(item, options, key, parentKey) {
	if (item instanceof ObjectID) {
		return item;
	}
	if (typeof item === 'string') {
		if (key === undefined || (options.idRegExp && options.idRegExp.test(key)) || (options.idsRegExp && digitRegExp.test(key) && options.idsRegExp.test(parentKey))) {
			if (item.length === 24 && hexRegExp.test(item)) {
				return new ObjectID(item);
			}
		}
		return item;
	}
	if (item instanceof Array) {
		return item.map(function(subItem, i) {
			return _convert(subItem, options, i, key);
		});
	}
	if (item instanceof Object) {
		for (var prop in item) {
			if (item.hasOwnProperty(prop)) {
				item[prop] = _convert(item[prop], options, prop);
			}
		}
		return item;
	}
	return item;
}

module.exports = {
	convert: function(item, options) {
		options = extend({}, defaults, options);
		if(!(options.idRegExp instanceof RegExp)) {
			options.idRegExp = false;
		}
		if(!(options.idsRegExp instanceof RegExp)) {
			options.idsRegExp = false;
		}
		return _convert(item, options);
	}
};