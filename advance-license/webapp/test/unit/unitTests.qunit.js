/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zproskmittalcoineximadvancelicense/advance-license/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
