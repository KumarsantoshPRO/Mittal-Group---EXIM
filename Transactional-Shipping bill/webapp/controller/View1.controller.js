sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    function (Controller, Fragment, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("zmg.pro.exim.transactionalshippingbill.exim.controller.View1", {
            onInit: function () {
                this.getCallForTable([]);
            },
            // On Click of search
            onSearch: function () {

                var nShipping_Number = this.getView().byId("idInpF4_SBNumber").getValue()
                var aFilters = [];
                var oFilter = new Filter(
                    [new Filter("ZshippingBillNo", FilterOperator.EQ, nShipping_Number)],
                    false
                );

                aFilters.push(oFilter);

                this.getCallForTable(aFilters);
            },

            // On Click of clear
            onClearFilters: function () {
                this.getView().byId("idInpF4_SBNumber").setValue();
                this.getView().byId("idInpF4_InvoiceNumber").setValue();
                this.getView().byId("idDP_CreatedDate").setValue();

            },
            // getViewSettingsDialog: function (sDialogFragmentName) {
            //     var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

            //     if (!pDialog) {
            //         pDialog = Fragment.load({
            //             id: this.getView().getId(),
            //             name: sDialogFragmentName,
            //             controller: this,
            //         }).then(function (oDialog) {
            //             if (Device.system.desktop) {
            //                 oDialog.addStyleClass("sapUiSizeCompact");
            //             }
            //             return oDialog;
            //         });
            //         this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
            //     }
            //     return pDialog;
            // },
            // // On shipping bill F4
            // onShippingBillHelp: function () {
            //     this.getViewSettingsDialog(
            //         "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_shippingBill"
            //     ).then(function (oViewSettingsDialog) {
            //         oViewSettingsDialog.open();
            //     });
            // },
            //Shipping Number on Value Help(F4)
            onShippingBillHelp: function () {
                if (!this.ShippingNumber) {
                    this.ShippingNumber = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_shippingBill",
                        this
                    );
                    this.getView().addDependent(this.ShippingNumber);
                    this._InvoiceNumberTemp = sap.ui
                        .getCore()
                        .byId("idSLShippingBillValueHelp")
                        .clone();
                }


                sap.ui.getCore().byId("idSDShippingBillF4").bindAggregation("items", {
                    path: "/ZRC_SHIP_BILL_HEAD",
                    template: this._InvoiceNumberTemp,
                });

                this.ShippingNumber.open();
            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_shippingBillNumber: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var sPath = "/ZRC_SHIP_BILL_HEAD";
                var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));
                var aFilters = [];
                var oFilter = new Filter(
                    [new Filter("ZshippingBillNo", FilterOperator.Contains, sValue)],
                    false
                );

                aFilters.push(oFilter);
                oSelectDialog.bindAggregation("items", {
                    path: sPath,
                    filters: aFilters,
                    template: this._InvoiceNumberTemp,
                });
            },

            // on Value Help - Confirm
            onValueHelpConfirm_shippingBillNumber: function (oEvent) {


                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getProperty("title");

                this
                    .getView()
                    .byId("idInpF4_SBNumber").setValue(sSelectedValue);
            },

            // Get call for Table entries
            getCallForTable: function (aFilters) {

                this.sDate = this.getView().byId("idDP_CreatedDate").getValue();

                var sPath = "/ZRC_SHIP_BILL_HEAD"
                var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                var oModelForHeader = new sap.ui.model.odata.ODataModel(
                    sService,
                    true
                );



                this.getView().setBusy(true);
                oModelForHeader.read(sPath, {
                    filters: aFilters,
                    success: function (Data) {
                        var aDataForHeaderTable;
                        this.getView().setModel(new JSONModel(aDataForHeaderTable), "oModelForTable")

                        if (this.sDate) {
                            var aItems = [];
                            var nTemp = 0;

                            var sDateFromFE =
                                new Date(this.sDate).getDate().toString() +
                                new Date(this.sDate).getMonth().toString() +
                                new Date(this.sDate).getFullYear().toString();
                            for (let index = 0; index < Data.results.length; index++) {
                                var sDateFromBE =
                                    new Date(Data.results[index].ZletExportDate).getDate().toString() +
                                    new Date(Data.results[index].ZletExportDate).getMonth().toString() +
                                    new Date(Data.results[index].ZletExportDate).getFullYear().toString();
                                if (sDateFromBE === sDateFromFE) {
                                    aItems.push(Data.results[index]);
                                    nTemp = 1;
                                }
                            }

                            if (nTemp === 1) {
                                Data.results = aItems;
                            } else {
                                Data.results = [];
                            }
                        }
                        this.getView().getModel("oModelForTable").setData(Data.results);
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            // On Add new
            onAddNew: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("shippingBill_Details", {
                    billNo: "null"
                });
            },
            // On click of table row
            onShowDetails: function (oEvent) {


                // var selectedRowBillNo = oEvent.getSource().getBindingContext().getProperty("oModelForTable>ZshippingBillNo");
                var selectedRowBillNo =oEvent.getSource().getAggregation("cells")[0].getText()
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("shippingBill_Details", {
                    billNo: selectedRowBillNo
                });
            }

        });
    });
