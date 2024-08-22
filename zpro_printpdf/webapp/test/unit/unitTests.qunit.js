/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zmceximproskzpro_printpdf/zpro_printpdf/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
