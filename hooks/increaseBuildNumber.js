#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');

var configPath = path.join(__dirname, '..', '..', 'config.xml');

// Read the config.xml file
fs.readFile(configPath, 'utf8', function (err, data) {
  if (err) {
    return console.error(err);
  }

  // Parse the XML
  var parser = new xml2js.Parser();
  parser.parseString(data, function (err, result) {
    if (err) {
      return console.error(err);
    }

    // Increase the build number
    var version = result.widget.$.version;
    var buildNumber = result.widget.$['android-versionCode'] || result.widget.$['ios-CFBundleVersion'] || 0;
    result.widget.$['android-versionCode'] = buildNumber + 1;
    result.widget.$['ios-CFBundleVersion'] = buildNumber + 1;

    // Update the config.xml file
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(result);
    fs.writeFile(configPath, xml, function (err) {
      if (err) {
        return console.error(err);
      }
      console.log('Build number increased to ' + (buildNumber + 1) + ' for version ' + version);
    });
  });
});
