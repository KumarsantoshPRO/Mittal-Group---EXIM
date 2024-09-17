sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    function (Controller, Fragment, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("zmg.pro.exim.transactionalshippingbill.exim.controller.shippingBill_Details", {

            onInit: function () {

                this.createLocalJSONModels();
                this.setCurrentDateTime();

                this.getOwnerComponent()
                    .getRouter()
                    .attachRoutePatternMatched(this.onRouteMatched, this);

            },
            onRouteMatched: function (oEvent) {
                var billNo = oEvent.getParameter("arguments").billNo;

                if (billNo === "null") {
                    this.getView().getModel("oModelForHeader").setData({});
                } else {
                    var oModel = this.getOwnerComponent().getModel();
                    var sPath = "/ZRC_SHIP_BILL_HEAD('" + billNo + "')";
                    this.getCall(oModel, sPath);


                }


            },

            createLocalJSONModels: function () {

                // for Header details
                var payloadForHeader = {
                    "ZshippingBillNo": "",
                    "ZinvoiceDocument": "",
                    "ZportOfLoading": "",
                    "Zcha": "",
                    "Zcustomer": "",
                    "ZletExportDate": "",
                    "Zschemes": "",
                    "Zepcg": "",
                    "Zloc": "",
                    "ZshippingBillStatus": "",
                    "ZshippingBillDate": "",
                    "ZstateOfOrigin": "",
                    "ZdestinationCountry": "",
                    "ZforeignCurrency": "",
                    "FobValueFc": "",
                    "ZfobValue": " ",
                    "ZexchangeRate": " ",
                    "Zrodtep": "",
                    "ZcontainerNo": "",
                    "ZcreateDate": "",
                    "ZcreateTime": "",
                    "ZcreateBy": "",
                    "to_item": {

                    }

                }
                var oModelForHeader = new JSONModel(payloadForHeader);
                this.getView().setModel(oModelForHeader, "oModelForHeader");

                var oModelForItems = new JSONModel();
                this.getView().setModel(oModelForItems, "oModelForItems");

                var oModelForLicenses = new JSONModel();
                this.getView().setModel(oModelForLicenses, "oModelForLicenses");

            },
            setCurrentDateTime: function () {


                var currentDateTime = new Date();
                this.getView().getModel("oModelForHeader").setProperty("/ZcreateDate", currentDateTime)
                this.getView().getModel("oModelForHeader").setProperty("/ZcreateTime", currentDateTime)



            },

            // on Value Help(F4)
            onInvoiceNumberValueHelp: function () {
                if (!this.InvoiceNumFrag) {
                    this.InvoiceNumFrag = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_InvoiceNumber",
                        this
                    );
                    this.getView().addDependent(this.InvoiceNumFrag);
                    var sService = "/sap/opu/odata/sap/ZV_BILLING_INV_DET_SERV_B";
                    var oModelInvoiceNumber = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.InvoiceNumFrag.setModel(oModelInvoiceNumber);
                    this._InvoiceNumberTemp = sap.ui
                        .getCore()
                        .byId("idSLInvoiceNumberValueHelp")
                        .clone();
                    this._oTempInvoiceNumber = sap.ui
                        .getCore()
                        .byId("idSLInvoiceNumberValueHelp")
                        .clone();
                }

                this.InvoiceNumFrag.open();
                var aFilter = [];
                // var oFilter = new Filter(
                //     [new Filter("BillingDocument", FilterOperator.EQ, "90000000")],
                //     false
                // );

                // aFilter.push(oFilter);

                sap.ui.getCore().byId("idSDInvoiceNumberF4").bindAggregation("items", {
                    path: "/ZV_BILLING_INV_DETAILS",
                    filters: aFilter,
                    template: this._InvoiceNumberTemp,
                });


            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_invoiceNumber: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var sPath = "/ZV_BILLING_INV_DETAILS";
                var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));
                var aFilter = [];
                var oFilter = new Filter(
                    [new Filter("BillingDocument", FilterOperator.Contains, sValue)],
                    false
                );

                aFilter.push(oFilter);
                oSelectDialog.bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._oTempInvoiceNumber,
                });
            },

            // on Value Help - Confirm
            onValueHelpConfirm_invoiceNumber: function (oEvent) {
                // this.JSONModelPayload = this.getView().getModel("oModelForHeader");

                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getProperty("title");
                var sPath = "/ZV_BILLING_INV_DETAILS";
                var sService = "/sap/opu/odata/sap/ZV_BILLING_INV_DET_SERV_B";
                var oModelForItems = new sap.ui.model.odata.ODataModel(
                    sService,
                    true
                );

                this.getView().getModel("oModelForHeader").setProperty("/ZinvoiceDocument", sSelectedValue.toString());

                // To get Items details
                var aFilters = [];
                var oFilter = new Filter(
                    [new Filter("BillingDocument", FilterOperator.EQ, sSelectedValue)],
                    false
                );

                aFilters.push(oFilter);





                this.getView().setBusy(true);
                oModelForItems.read(sPath, {
                    filters: aFilters,
                    success: function (Data) {

                        this.getView().getModel("oModelForItems").setData(Data);
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },


            onLicenseDetails: function () {

                var oView = this.getView();
                if (!this._oFragmentavail) {
                    this._oFragmentavail = sap.ui.xmlfragment("zmg.pro.exim.transactionalshippingbill.exim.view.fragments.eachItemLicenseDetails", this);
                    oView.addDependent(this._oFragmentavail);
                }
                this._oFragmentavail.open();
                var ZshippingBillNo = '000000001';
                var Item = '000010';
                var sPath = "/ZC_SHIP_BILL_ITEM(ZshippingBillNo='" + ZshippingBillNo + "',Item='" + Item + "')/to_SubItem";
                this.getView().setBusy(true);
                this.getView().getModel().read(sPath, {
                    success: function (Data) {
                        debugger;
                        this.getView().getModel("oModelForLicenses").setData(Data.results);

                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);

                    }.bind(this)
                });
            },

            onLicenseDialogClose: function () {

                this._oFragmentavail.close();
            },
            // On Save button action
            onSave: function () {
                var oModel = this.getOwnerComponent().getModel();
                var sPath = '/ZRC_SHIP_BILL_HEAD'
                var payload = this.getView().getModel("oModelForHeader").getData();

                this.postCallForHeader(oModel, sPath, payload);


            },

            onCancel: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("TargetView1");
            },

            getCall: function (oModel, sPath) {

                // Get call
                oModel.read(sPath, {
                    success: function (Data) {

                        this.getView().getModel("oModelForHeader").setData(Data);
                        var sPath = "/ZRC_SHIP_BILL_HEAD('" + Data.ZshippingBillNo + "')/to_item"

                        this.getView().getModel().read(sPath, {
                            success: function (Data) {
                                this.getView().getModel("oModelForItems").setData(Data.results);
                                this.getView().setBusy(false);
                            }.bind(this),
                            error: function (oError) {
                                this.getView().setBusy(false);

                            }.bind(this)
                        });

                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);

                    }.bind(this)
                });
            },
            onAddNewEmptyItem: function () {
                var JSONData = this.getView()
                    .getModel("oModelForItems")
                    .getData();
                JSONData.push({});
                this.getView()
                    .getModel("oModelForItems")
                    .setData(JSON.parse(JSON.stringify(JSONData)));
            },
            onDelete: function (oEvent) {
                debugger;
                var vLen = oEvent
                    .getSource()
                    .getParent()
                    .getBindingContextPath()
                    .split("/").length;

                var index = Number(
                    oEvent.getSource().getParent().getBindingContextPath().split("/")[
                    vLen - 1
                    ]
                );

                var JSONData = this.getView().getModel("oModelForItems").getData();
                if (JSONData.length > 1) {
                    JSONData.splice(index, 1);
                } else {
                    MessageBox.error("Atlease one entry is required");
                }

                this.getView()
                    .getModel("oModelForItems")
                    .setData(JSON.parse(JSON.stringify(JSONData)));
            },
            postCallForHeader: function (oModel, sPath, payload) {
                //Create Call
                this.getView().setBusy(true);
                oModel.create(sPath, payload, {
                    success: function (oData, response) {

                        var sService = "/sap/opu/odata/sap/ZV_BILLING_INV_DET_SERV_B";
                        var oModelForItems = new sap.ui.model.odata.ODataModel(
                            sService,
                            true
                        );

                        this.getView().getModel("oModelForItems").setProperty('oModelForItems>ZshippingBillNo', oData.ZshippingBillNo)
                        var sPathForItem = "/ZV_BILLING_INV_DETAILS";
                        var payloadOfItem = this.getView().getModel("oModelForItems").getData();

                        this.postCallForItem(oModelForItems, sPathForItem, payloadOfItem)
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            postCallForItem: function (oModel, sPath, payload) {
                //Create Call
                this.getView().setBusy(true);
                oModel.create(sPath, payload.results, {
                    success: function (oData, response) {
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            }
        });
    });