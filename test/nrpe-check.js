var raw = require('raw-socket');
var net = require('net');
var struct = require('ref-struct');
var ref = require('ref');
//var _ = require('struct-fu');
var _ = require('c-struct');
var checksum = require('crc32');


var packet = new _.Schema({
	version: _.type.uint16,
	type: _.type.uint16,
	crc: _.type.uint32,
	result: _.type.uint16,
	data: _.type.string()
});


console.log(packet);
var unpacked = {
	version: 2,
	type: 1,
	crc: '\x00\x00\x00\x00',
	result: 0,
	data: 'check_load'
};

_.register('packet', packet);


var packed = _.packSync('packet', unpacked);

unpacked.crc = checksum(packed, true);
_.register('rawPacket', unpacked);
var buf =  _.packSync('rawPacket', unpacked);

//var p = _.packSync(buf);



console.log(buf, unpacked, packed);
//console.log(buf);


/*var version = ref.alloc('uint16');

ref.writeUInt16BE(version,0,2);

console.log(version);

console.log(ref.readUInt16BE(version));

var packet = struct({
		
});*/



/*
var socket = raw.createSocket({protocol: raw.Protocol.TCP, generateChecksum:true});

var buf = new Buffer(['65432'.toString('hex'),
					  '5666'.toString('hex'),
					  '1'.toString('hex'),
					  ]);


console.log('Buffer', buf.toString());
socket.send(buf, 0, buf.length, '188.40.61.216', function(error,bytes) {
	console.log(error,bytes);
});*/



var opts = {
	readable: true,
	writeable: true
}

var s = new net.Socket (opts);

var con = s.connect('5666', '188.40.61.216', opts);

//var packet = [2,1,'check_load'].toString(2);

//con.write(b);
con.write(buf);

con.on('connect', function() {
	console.log('Connected...');
}
)
con.on('data', function(data) {
	console.log('data: ', data);
});

con.on('drain', function() {
	console.log('drain');
});

con.on('error', function(err) {
	console.log('error', err);
});