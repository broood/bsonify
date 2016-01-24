bsonify
=======

A utility intended to be used in conjunction with MongoDB. Recursively loops through JSON objects and replaces mongo style ids (24 character hex strings) with corresponding ObjectIDs.  This allows for simple conversions of _id fields as well as conversions throughout an arbitrarily deep structure.

## Install
	$ npm install bsonify

## Usage
```javascript

var bsonify = require('bsonify');

var id = bsonify.convert('52db2cc9be4481a0047d4648');

id instanceof ObjectID // true

var result = bsonify.convert({
	_id: '52db2cc9be4481a0047d4648',
	related_ids: ['52db2cc9be4481a0047d4647', '52db2cc9be4481a0047d4646', '52db2cc9be4481a0047d4645'],
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

result.related_ids[1] instanceof ObjectID // true
result.comments[0].user_id instanceof ObjectID // true

```

## Test
```javascript
npm test
```
	


