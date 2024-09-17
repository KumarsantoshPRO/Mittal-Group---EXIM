sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("zmg.pro.exim.zprolocimport.controller.View1", {
            onInit: function () {
                var oViewModel=new JSONModel({
                    textedit:false,
                    btnvisible:false,
                    btnEdit:true

                });
                this.getView().setModel(oViewModel, "oViewModel");
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
                this.oRouter.navTo("Details_D2");
            },
            // On Table Item Click
            onShowLCDetails: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("Details");
            },
            onEdit:function(){
                this.getView().getModel("oViewModel").setProperty("/btnvisible", true);
                this.getView().getModel("oViewModel").setProperty("/btnEdit", false);
                this.getView().getModel("oViewModel").setProperty("/textedit", true);
            },
            onCancel:function(){
                this.getView().getModel("oViewModel").setProperty("/btnEdit", true);
             this.getView().getModel("oViewModel").setProperty("/btnvisible", false);
             this.getView().getModel("oViewModel").setProperty("/textedit", false);
            },
            onBack:function(){
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("RouteView1");
            }
        });
    });
