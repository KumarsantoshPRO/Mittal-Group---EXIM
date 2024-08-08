/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zgmproeximpdfprint/pdf/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
