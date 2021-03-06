var raw = require('raw-socket');
var net = require('net');
var struct = require('ref-struct');
var ref = require('ref');
//var _ = require('struct-fu');
var _ = require('c-struct');
var checksum = require('crc32');
var sum = require('crc');
var tls = require('tls');


var packet = new _.Schema({
	//version: _.type.uint16,
	version: _.type.string(),
	//type: _.type.uint16,
	type: _.type.string(),
	crc: _.type.uint32,
	result: _.type.uint16,
	data: _.type.string()
});


console.log(packet);

var myStr = 'check_load';
while (myStr.length<1024) {
	myStr+= '\0';
};

myStr += '\x6e\x62';

//console.log('++++++##################', myStr.length);




var unpacked = {
	version: '\x00\x02',
	//version: 2,
	type: '\x00\x01',
	//type: 1,
	crc: '\x00\x00',
	result: 3662,
	data: myStr
};


_.register('packet', packet);


var packed = _.packSync('packet', unpacked,'b');
 
/*
unpacked.crc = checksum(packed, true);
_.register('rawPacket', unpacked);
var buf =  _.packSync('rawPacket', unpacked);
*/
//var p = _.packSync(buf);
//console.log('++',checksum(packed,true), crc.crc32(packed))
var crc = new Buffer(checksum(packed),'hex').readUInt32BE(0);
//var t = new Buffer(sum.crc32(packed),'hex').readUInt32BE(0);
console.log('##',checksum(packed, true), checksum(packed), checksum.direct(packed).toString(16));


//console.log(packed.toString('hex'));//, unpacked, packed);

packed.writeUInt32BE(crc, 4);
//console.log(packed.toString('hex'));//, unpacked, packed);

var buf = packed;
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

var tlsOpts = {
	secureProtocol: 'SSLv2_method',
	rejectUnauthorized: false
}


var tlsCon = tls.connect('5666',tlsOpts, '188.40.95.17', function() {
	console.log('TLS CLIENT connected');

	tlsCon.write(buf);
});

tlsCon.on('data', function(data) {
	console.log('TLS DATA: ', data);
});

tlsCon.on('secureConnect', function() {
	console.log('secure conncet');
})

tlsCon.on('error', function(err) {
	console.log('TLS ERROR', err);
})

var b = '00020001ce0fe8fe4e76636865636b5f757365727300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006e62';
buff = new Buffer(b,'hex');

//var s = new net.Socket (opts);

//var con = s.connect('5666', '188.40.61.216');

/*
con.on('connect', function() {
	console.log('Connected...');
	//console.log('################',buff.toString('hex'), buff.length);
	//console.log('################',buf.toString('hex'), buf.length);

	con.write(buf);
	// var res = con.write(buf, function(val) {
	// 	console.log('VAL: ', val)
	// });
	//console.log('RES: ', res);
})

con.on('data', function(data) {
	console.log('--------------data: ', data.toString());
});

con.on('drain', function() {
	console.log('drain');
});

con.on('error', function(err) {
	console.log('error', err);
});*/