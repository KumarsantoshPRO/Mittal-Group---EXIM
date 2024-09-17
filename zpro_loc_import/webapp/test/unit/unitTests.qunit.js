/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zmgproexim/zpro_loc_import/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
