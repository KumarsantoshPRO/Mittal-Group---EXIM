sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("zmc.exim.pro.sk.zprolocexport.controller.Landing", {
            onInit: function () {
                // debugger;
               this.oModel = this.getOwnerComponent().getModel()
               //model for header Data
               var oHead = new JSONModel();
               this.getView().setModel(oHead,"oHeaderModel")
            //    this.getHeaderData()
            var oViewModel=new JSONModel({
                "EditVisible":false,
                "TextVisible":true
            })
            this.getView().setModel(oViewModel,"oViewModel")
            },
            getHeaderData:function(){
                this.oModel().read("/ZRC_LCEXP_HEAD",{
                    success:function(oData){
                        this.getView().getModel("oHeaderModel").setData(oData);
                    }.bind(this),
                    Error:function(oError){
                        console.log(oError)
                    }
                })
            },
            onEdit: function(){
                var oViewModel = this.getView().getModel("oViewModel")
                oViewModel.setProperty("/TextVisible",false)
                oViewModel.setProperty("/EditVisible",true)
            },
            onCancel: function(){
                var oViewModel = this.getView().getModel("oViewModel")
                oViewModel.setProperty("/TextVisible",true)
                oViewModel.setProperty("/EditVisible",false)

            },
            onBack:function(){
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("RouteLanding");
            }

        });
    });
