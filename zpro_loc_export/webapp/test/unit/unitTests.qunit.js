/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zmceximprosk/zpro_loc_export/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
