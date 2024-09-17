sap.ui.define([
    "sap/ui/core/mvc/Controller",
    
],
    function (Controller) {
        "use strict";

        return Controller.extend("zmg.pro.exim.zprolocimport.controller.Details", {
            onInit: function () {
                
            },
            onBack:function(){
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("RouteView1");
            }
        });
    });
