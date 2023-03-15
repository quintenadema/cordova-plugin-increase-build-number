## cordova-plugin-increase-build-number

This Cordova plugin provides a simple way to automatically increment the build number for your Android and iOS apps every time you run the Cordova `build` command. 

When you run the `cordova build` command with this plugin installed, the plugin will read the current build number from the `config.xml` file, increment it by one, and update the `android-versionCode` and `ios-CFBundleVersion` attributes in the `config.xml` file with the new values. 

This plugin can save you time and ensure that your app's build number is always up to date.


## Installation

    cordova plugin add cordova-plugin-increase-build-number


## Removal

    cordova plugin remove cordova-plugin-increase-build-number
