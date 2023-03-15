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

            var oldVersion = result.widget.$['android-versionCode'];
            var newVersion = parseInt(oldVersion) + 1;

            result.widget.$['android-versionCode'] = newVersion.toString();

            var builder = new xml2js.Builder();
            var xml = builder.buildObject(result);

            fs.writeFile(configPath, xml, function(err) {
                if (err) {
                    deferral.reject(err);
                    return;
                }

                console.log('Build number increased to ' + newVersion);
                deferral.resolve();
            });
        });
    });

    return deferral.promise;
};
