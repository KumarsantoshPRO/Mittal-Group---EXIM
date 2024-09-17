/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zmceximpro/zpro_printcheque/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
