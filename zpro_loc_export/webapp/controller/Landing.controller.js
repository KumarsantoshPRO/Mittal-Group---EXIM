sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("zmc.exim.pro.sk.zprolocexport.controller.Landing", {
            onInit: function () {

            },
            // Filter Bar - State Change
            onDPTStateChange: function (oEvent) {
                var obtnDTPFilterGo = this.getView().byId("idBtnDPTFilterGo"),
                    obtnDTPFilterClear = this.getView().byId("idBtnDPTFilterClear");
                if (oEvent.getParameter("isExpanded")) {
                    obtnDTPFilterGo.setVisible(true);
                    obtnDTPFilterClear.setVisible(true);
                } else {
                    obtnDTPFilterGo.setVisible(false);
                    obtnDTPFilterClear.setVisible(false);
                }
            },
            // On Add New button pressed
            onAddNew: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("newDetails", {
                    LCNumber: "null",
                });
            },
            // On Table Item Click
            onShowLCDetails: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("Details", {
                    LCNumber: "null",
                });
            }
        });
    });
