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

            var androidVersion = result.widget.$['android-versionCode'];
            var iosVersion = result.widget.$['ios-CFBundleVersion'];

            var newAndroidVersion = parseInt(androidVersion) + 1;
            var newIosVersion = parseInt(iosVersion) + 1;

            result.widget.$['android-versionCode'] = newAndroidVersion.toString();
            result.widget.$['ios-CFBundleVersion'] = newIosVersion.toString();

            var builder = new xml2js.Builder();
            var xml = builder.buildObject(result);

            fs.writeFile(configPath, xml, function(err) {
                if (err) {
                    deferral.reject(err);
                    return;
                }

                console.log('\x1b[33m%s\x1b[0m', '[cordova-plugin-increase-build-number] {ANDROID} build number increased to ' + newAndroidVersion);
                console.log('\x1b[33m%s\x1b[0m', '[cordova-plugin-increase-build-number] {iOS} build number increased to ' + newIosVersion);
                deferral.resolve();
            });
        });
    });

    return deferral.promise;
};