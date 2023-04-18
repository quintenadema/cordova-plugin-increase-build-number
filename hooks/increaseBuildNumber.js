#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var Q = require('q');

module.exports = function(context) {
	var deferral = Q.defer();

	var configPath = path.join(context.opts.projectRoot, 'config.xml');
	var parser = new xml2js.Parser();

	fs.readFile(configPath, function(err, data) {
		if (err) {
			deferral.reject(err);
			return;
		}

		parser.parseString(data, function(err, result) {
			if (err) {
				deferral.reject(err);
				return;
			}

			var androidVersion = null;
			var iosVersion = null;
			if (result && result.widget) {
				androidVersion = result.widget.$['android-versionCode'];
				iosVersion = result.widget.$['ios-CFBundleVersion'];
			}

			var newAndroidVersion = parseInt(androidVersion || 0) + 1;
			var newIosVersion = parseInt(iosVersion || 0) + 1;

			if (result && result.widget) {
				result.widget.$['android-versionCode'] = newAndroidVersion.toString();
				result.widget.$['ios-CFBundleVersion'] = newIosVersion.toString();
			}

			var builder = new xml2js.Builder();
			var xml = builder.buildObject(result);

			fs.writeFile(configPath, xml, function(err) {
				if (err) {
					deferral.reject(err);
					return;
				}

				console.log('\x1b[35m%s\x1b[0m', '[cordova-plugin-increase-build-number] {ANDROID} build number increased to ' + newAndroidVersion);
				console.log('\x1b[35m%s\x1b[0m', '[cordova-plugin-increase-build-number] {iOS} build number increased to ' + newIosVersion);
				deferral.resolve();
			});
		});
	});


	return deferral.promise;
};