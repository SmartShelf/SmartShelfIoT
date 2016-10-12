/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*Requires registration on Bluemix. Edit the following to your Bluemix registration values:
ORG
TYPE
ID
AUTHTOKEN
*/

var ORG = 'm6f8l5';
var TYPE = 'SmartScale';
var ID = 'SmartScale-001';
var AUTHTOKEN = 'AfRQse+X7tLf)sypqN';

//Uses mqtt.js, see package.json. More info at:
//https://www.npmjs.com/package/mqtt
var mqtt    = require('mqtt');

var PROTOCOL = 'mqtt';
var BROKER = ORG + '.messaging.internetofthings.ibmcloud.com';
var PORT = 1883;

//Create the url string
var URL = PROTOCOL + '://' + BROKER;
URL += ':' + PORT;
//URL is e.g. 'mqtt://xrxlila.messaging.internetofthings.ibmcloud.com:1883'

var CLIENTID= 'd:' + ORG;
CLIENTID += ':' + TYPE;
CLIENTID += ':' + ID;
//CLIENTID -s e.g. d:xrxila:edison-air:784b87a801e9

var AUTHMETHOD = 'use-token-auth';

var client  = mqtt.connect(URL, { clientId: CLIENTID, username: AUTHMETHOD, password: AUTHTOKEN });

var TOPIC = 'iot-2/evt/status/fmt/json';
console.log(TOPIC);

client.on('connect', function () {
  setInterval(function(){
    client.publish(TOPIC, '{"d":{"weight":' + weight() + '}}');//Payload is JSON
  }, 2000);//Keeps publishing every 2000 milliseconds.
});

/*
A simple node.js application intended to read data from Digital pins on the Intel based development boards such as the Intel(R) Galileo and Edison with Arduino breakout board.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client:
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
*/

var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var hx711 = require('jsupm_hx711');// Instantiate a HX711 data on digital pin D3 and clock on digital pin D2
var scale = new hx711.HX711(3, 2);

setTimeout(function(){
	// 2837: value obtained via calibration
	//scale.setScale(5837);
    scale.setScale(8000);
	scale.tare(2);
	setInterval(function(){
        weight();
	}, 1000);
}, 1000);

function weight(){
    var unitsRecorded = scale.getUnits();
        //a huge number is recorded in sensor goes below the calibrated zero, this code just makes it zero.
        if (unitsRecorded > 500000) {
            unitsRecorded = 0;
        }
		console.log("weight : "+unitsRecorded);
    
    return unitsRecorded;
}


