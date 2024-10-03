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
               var oHeaderModel = new JSONModel();
               this.getView().setModel(oHeaderModel,"oHeaderModel")
               this.getHeaderData();
               this.getTableData();
            var oViewModel=new JSONModel({
                "EditVisible":false,
                "TextVisible":true
            })
            this.getView().setModel(oViewModel,"oViewModel")
            },
            getHeaderData:function(){
                var oHeaderdata = new JSONModel();
                this.getView().setModel(oHeaderdata, "oHeaderData")
                this.oModel.read("/ZRC_LCEXP_HEAD",{
                    success:function(oData){
                        this.getView().getModel("oHeaderData").setData(oData.results[0]);
                        this.getView().byId("idCoreTitle").setText("LC Number: " + oData.results[0].LcNo);
                        this.getView().byId("idCoreTitle2").setText("LC Number: " + oData.results[0].LcNo);
                        console.log(oData.results[0]);
                    }.bind(this),
                    Error:function(oError){
                        console.log(oError)
                    }
                })
            },
            getTableData:function(){
                var oTabledata = new JSONModel();
                this.getView().setModel(oTabledata, "oTableData")
                this.oModel.read("/ZC_LCEXP_ITEM",{
                    success:function(oData){
                        this.getView().getModel("oTableData").setData(oData.results);
                        console.log(oData.results[0]);
                    }.bind(this),
                    Error:function(oError){
                        console.log(oError)
                    }
                })
            },
            getHeaderData:function(){
                var oHeaderdata = new JSONModel();
                this.getView().setModel(oHeaderdata, "oHeaderData")
                this.oModel.read("/ZRC_LCEXP_HEAD",{
                    success:function(oData){
                        this.getView().getModel("oHeaderData").setData(oData.results[0]);
                        this.getView().byId("idCoreTitle").setText("LC Number: " + oData.results[0].LcNo);
                        this.getView().byId("idCoreTitle2").setText("LC Number: " + oData.results[0].LcNo);
                        console.log(oData.results[0]);
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
