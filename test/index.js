var should = require('chai').should();
var ObjectID = require('mongodb').ObjectID;
var bsonify = require('../index');

describe('#convert', function() {

	it('given an ObjectID, convert returns the same ObjectID', function() {
		var obj = ObjectID('52db2cc9be4481a0047d4649');
		bsonify.convert(obj).should.equal(obj);
	});

	it('given a 24 character hex string, convert returns an ObjectID', function() {
		bsonify.convert('52db2cc9be4481a0047d4649').should.be.an.instanceof(ObjectID);
	});

	it('given an object with property _id that is a 24 character hex-string, convert returns an object with _id property that is an ObjectID', function() {
		var result = bsonify.convert({
			_id: '52db2cc9be4481a0047d4649'
		});
		result.should.be.an.instanceof(Object);
		result.should.have.property('_id');
		result._id.should.be.an.instanceof(ObjectID);
	});

	it('given an object with custom id property that is a 24 character hex-string, convert returns an object with custom property that is an ObjectID', function() {
		var result = bsonify.convert({
			_gg: '52db2cc9be4481a0047d4649'
		}, { idRegExp: /_gg$/ });
		result.should.be.an.instanceof(Object);
		result.should.have.property('_gg');
		result._gg.should.be.an.instanceof(ObjectID);
	});

	it('given an object with id property that is a 24 character hex-string and idRegExp set to false, convert returns an object with _id property that is a string', function() {
		var result = bsonify.convert({
			_id: '52db2cc9be4481a0047d4649'
		}, { idRegExp: false });
		result.should.be.an.instanceof(Object);
		result.should.have.property('_id');
		result._id.should.be.a('string');
	});

	it('given an object with _id property that is a 24 character hex-string and an invalid idRegExp option, convert returns an object with _id property that is an ObjectID', function() {
		var result = bsonify.convert({
			_id: '52db2cc9be4481a0047d4649'
		}, { idRegExp: 'invalid' });
		result.should.be.an.instanceof(Object);
		result.should.have.property('_id');
		result._id.should.be.a('string');
	});

	it('given an object with an _ids array of 24 character hex strings, convert returns an object with that property that is an ObjectID array', function() {
		var result = bsonify.convert({
			_ids: ['52db2cc9be4481a0047d4649', '52db2cc9be4481a0047d4648']
		});
		result.should.have.property('_ids');
		result._ids.should.be.an.instanceof(Array);
		result._ids.should.have.length(2);
		result._ids[0].should.be.an.instanceof(ObjectID);
		result._ids[1].should.be.an.instanceof(ObjectID);
	});

	it('given an object with a custom ids array of 24 character hex strings, convert returns an object with that property that is an ObjectID array', function() {
		var result = bsonify.convert({
			_ggs: ['52db2cc9be4481a0047d4649', '52db2cc9be4481a0047d4648']
		}, { idsRegExp: /_ggs$/ });
		result.should.have.property('_ggs');
		result._ggs.should.be.an.instanceof(Array);
		result._ggs.should.have.length(2);
		result._ggs[0].should.be.an.instanceof(ObjectID);
		result._ggs[1].should.be.an.instanceof(ObjectID);
	});

	it('given an object with an _ids array of 24 character hex strings and idsRegExp set to false, convert returns an object with that property that is a string array', function() {
		var result = bsonify.convert({
			_ids: ['52db2cc9be4481a0047d4649', '52db2cc9be4481a0047d4648']
		}, { idsRegExp: false });
		result.should.have.property('_ids');
		result._ids.should.be.an.instanceof(Array);
		result._ids.should.have.length(2);
		result._ids[0].should.be.a('string');
		result._ids[1].should.be.a('string');
	});

	it('given an object with an _ids array of 24 character hex strings and an invalid idsRegExp, convert returns an object with that property that is a string array', function() {
		var result = bsonify.convert({
			_ids: ['52db2cc9be4481a0047d4649', '52db2cc9be4481a0047d4648']
		}, { idsRegExp: 'invalid' });
		result.should.have.property('_ids');
		result._ids.should.be.an.instanceof(Array);
		result._ids.should.have.length(2);
		result._ids[0].should.be.a('string');
		result._ids[1].should.be.a('string');
	});

	it('given an object with an _ids array, convert returns the array elements to ObjectIDs when they are conforming 24 character hex strings', function() {
		var result = bsonify.convert({
			_ids: ['52db2cc9be4481a0047d4649', '52db2cc9be4481a0047d4648g']
		});
		result.should.have.property('_ids');
		result._ids.should.be.an.instanceof(Array);
		result._ids.should.have.length(2);
		result._ids[0].should.be.an.instanceof(ObjectID);
		result._ids[1].should.be.a('string');
	});

	it('given arbitrarily deep _id properties, convert will return ObjectIDs when they are conforming 24 character hex strings', function() {
		var result = bsonify.convert({
			_id: '52db2cc9be4481a0047d4649',
			sub: {
				_id: '52db2cc9be4481a0047d4648',
				subsub: {
					_id: '52db2cc9be4481a0047d4647'
				}
			}
		});
		result.should.be.an.instanceof(Object);
		result.should.have.property('_id');
		result._id.should.be.an.instanceof(ObjectID);
		result.should.have.property('sub');
		result.sub.should.have.property('_id');
		result.sub._id.should.be.an.instanceof(ObjectID);
		result.sub.should.have.property('subsub');
		result.sub.subsub.should.have.property('_id');
		result.sub.subsub._id.should.be.an.instanceof(ObjectID);
	});

	it('given an array of objects containing _id properties, convert will return an array of objects with _id properties set to ObjectIDs', function() {
		var result = bsonify.convert([{
			_id: '52db2cc9be4481a0047d4649'
		}, {
			_id: '52db2cc9be4481a0047d4648'
		}, {
			_id: '52db2cc9be4481a0047d4647'
		}]);

		result.should.be.an.instanceof(Array);
		result.should.have.length(3);
		for (var i = 0; i < 3; i++) {
			result[i].should.be.an.instanceof(Object);
			result[i].should.have.property('_id');
			result[i]._id.should.be.an.instanceof(ObjectID);
		}
	});

	it('given an array of arrays of 24 character hex strings, convert will return an array of arrays of ObjectIDs', function() {
		var result = bsonify.convert([
			[{_ids: ['52db2cc9be4481a0047d4645']}, '1234']
		]);

		result.should.be.an.instanceof(Array);
		result.should.have.length(1);
		result[0].should.be.an.instanceof(Array);
		result[0].should.have.length(2);
		result[0][0].should.be.an.instanceof(Object);
		result[0][0].should.have.property('_ids');
		result[0][0]._ids.should.be.an.instanceof(Array);
		result[0][0]._ids.should.have.length(1);
		result[0][0]._ids[0].should.be.an.instanceof(ObjectID);
		result[0][1].should.be.a('string');
	});

	it('given a 23 character hex string, convert returns the string', function() {
		bsonify.convert('52db2cc9be4481a0047d464').should.be.a('string');
	});

	it('given a non-conforming string, convert returns the string', function() {
		var result = bsonify.convert('52db2cc9be4481a0047d464g');
		result.should.be.a('string');
		result.should.equal('52db2cc9be4481a0047d464g');
	});

	it('given an object with a non-conforming key, convert returns the string', function() {
		var result = bsonify.convert({_gg: '52db2cc9be4481a0047d4644'});
		result.should.be.an.instanceof(Object);
		result.should.have.property('_gg');
		result._gg.should.equal('52db2cc9be4481a0047d4644');
	});

	it('given a complex object, convert should return an object where only conforming fields have been converted to ObjectID', function() {
		var result = bsonify.convert({
			_id: '52db2cc9be4481a0047d4648',
			widget_ids: ['52db2cc9be4481a0047d4647', '52db2cc9be4481a0047d4646', '52db2cc9be4481a0047d4645'],
			comments: [{
					_id: '52db2cc9be4481a0047d4645',
					user_id: '52db2cc9be4481a0047d4645',
					comment: 'Here is a comment'
				}, {
					_id: '52db2cc9be4481a0047d4645',
					user_id: '52db2cc9be4481a0047d4645',
					comment: 'Another comment'
				}
			]
		});
		result.should.be.an.instanceof(Object);
		result.should.have.property('_id');
		result._id.should.be.an.instanceof(ObjectID);
		result.should.have.property('widget_ids');
		result.widget_ids.should.have.length(3);

		for(var i = 0; i < 3; i++) {
			result.widget_ids[i].should.be.an.instanceof(ObjectID);
		}

		result.should.have.property('comments');
		result.comments.should.be.an.instanceof(Array);
		result.comments.should.have.length(2);

		for(var j = 0; j < 2; j++) {
			result.comments[j].should.have.property('_id');
			result.comments[j]._id.should.be.an.instanceof(ObjectID);
			result.comments[j].should.have.property('user_id');
			result.comments[j].user_id.should.be.an.instanceof(ObjectID);
			result.comments[j].should.have.property('comment');
			result.comments[j].comment.should.be.a('string');
		}
	});
});
