/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

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
        var unitsRecorded = scale.getUnits();
        //a huge number is recorded in sensor goes below the calibrated zero, this code just makes it zero.
        if (unitsRecorded > 500000) {
            unitsRecorded = 0;
        }
		console.log("weight : "+unitsRecorded);
	}, 1000);
}, 1000);