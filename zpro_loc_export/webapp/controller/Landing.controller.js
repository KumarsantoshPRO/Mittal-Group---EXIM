sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("zmc.exim.pro.sk.zprolocexport.controller.Landing", {
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel()
                this.getTableData()
            },
            getTableData:function(){
                var oTabledata = new JSONModel();
                this.getView().setModel(oTabledata, "oTableData")
                this.oModel.read("/ZRC_LCEXP_HEAD",{
                    success:function(oData){
                        this.getView().getModel("oTableData").setData(oData.results);
                        console.log(oData.results[0]);
                    }.bind(this),
                    Error:function(oError){
                        console.log(oError)
                    }
                })
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
