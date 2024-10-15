sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/Item"

],
    function (Controller,
        Fragment,
        JSONModel,
        Filter,
        FilterOperator,
        MessageBox,
        DateFormat,
        Item) {
        "use strict";

        return Controller.extend("zmg.pro.exim.transactionalshippingbill.exim.controller.shippingBill_Details", {

            onInit: function () {

                this.createLocalJSONModels();
                this.getOwnerComponent()
                    .getRouter()
                    .attachRoutePatternMatched(this.onRouteMatched, this);

            },
            onRouteMatched: function (oEvent) {
                var billNo = oEvent.getParameter("arguments").billNo;
                this.page = billNo;
                if (billNo === "null") {
                    this.createLocalJSONModels();
                    this.setCurrentDateTime();
                    this.onEditPress();
                    this.getView().byId("_IDGenObjectPageHeader1").setObjectTitle("Creat new shipping bill");
                    this.getView().getModel("oEditableModel").setProperty("/update", false);
                    this.getView().getModel("oEditableModel").setProperty("/save", true);
                } else {
                    this.getView().byId("_IDGenObjectPageHeader1").setObjectTitle(billNo);
                    var oModel = this.getOwnerComponent().getModel();
                    var sPath = "/ZRC_SHIP_BILL_HEAD('" + billNo + "')";
                    this.getCall(oModel, sPath);
                    this.onCancel();
                    this.getView().getModel("oEditableModel").setProperty("/update", true);
                    this.getView().getModel("oEditableModel").setProperty("/save", false);
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
                    "ZfobValue": "",
                    // "ZexchangeRate": "",
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
                // for Items and Licenses details

                // for Licenses details
                var aEachItemsLic = {
                    "results": [{
                        "Item": "",
                        "Material": "",
                        "Licences": "",
                        "Quantity": "",
                        "Value": ""
                    }]
                };
                var payloadForItem = {
                    "results": [
                        {
                            "Item": "",
                            "Material": "",
                            "ItemDescription": "",
                            "Uom": "",
                            "InvoiceQty": "",
                            "InvoiceValue": "",
                            "Commission": "",
                            "Insurance": "",
                            "Freight": "",
                            "Licenses": aEachItemsLic
                        }
                    ]
                };
                var oModelForItems = new JSONModel(payloadForItem);
                this.getView().setModel(oModelForItems, "oModelForItems");



                var oModelForLicenses = new JSONModel();
                this.getView().setModel(oModelForLicenses, "oModelForLicenses");

                var oEditableModel = new JSONModel({
                    "sEditable": false,
                    "edit": false,
                    "view": false,
                    "save": false,
                    "update": false
                });
                this.getView().setModel(oEditableModel, "oEditableModel");

            },
            setCurrentDateTime: function () {


                var currentDateTime = new Date();
                this.getView().getModel("oModelForHeader").setProperty("/ZcreateDate", currentDateTime)
                this.getView().getModel("oModelForHeader").setProperty("/ZcreateTime", currentDateTime)



            },
            onEditPress: function () {
                this.screenType = "edit";

                this.getView().byId("idBtnEdit").setVisible(false);
                this.getView().byId("IdOPSHeaderDetailsSubSection1").setVisible(false);
                this.getView().byId("IdOPSHeaderDetailsSubSection1Edit").setVisible(true);
                this.getView().byId("IdOPSHeaderDetailsSubSection2View").setVisible(false);
                this.getView().byId("IdOPSHeaderDetailsSubSection2Edit").setVisible(true);
                this.getView().byId("AssignmentDetailsSubSectionView").setVisible(false);
                this.getView().byId("AssignmentDetailsSubSection").setVisible(true);
                // this.getView().byId("idBtnCreateItem").setVisible(true);
                this.getView().byId("idV2Bar").setVisible(true);
                this.getView().getModel("oEditableModel").setProperty("/sEditable", true);
                this.getView().getModel("oEditableModel").setProperty("/edit", true);
                this.getView().getModel("oEditableModel").setProperty("/view", false);



            },
            onCancel: function () {
                this.screenType = "cancel";

                if (this.page === "null") {
                    window.history.go(-1);
                } else {
                    this.getView().byId("idBtnEdit").setVisible(true);
                    this.getView().byId("IdOPSHeaderDetailsSubSection1").setVisible(true);
                    this.getView().byId("IdOPSHeaderDetailsSubSection1Edit").setVisible(false);
                    this.getView().byId("IdOPSHeaderDetailsSubSection2View").setVisible(true);
                    this.getView().byId("IdOPSHeaderDetailsSubSection2Edit").setVisible(false);

                    this.getView().byId("AssignmentDetailsSubSectionView").setVisible(true);
                    this.getView().byId("AssignmentDetailsSubSection").setVisible(false);
                    // this.getView().byId("idBtnCreateItem").setVisible(false);
                    this.getView().byId("idV2Bar").setVisible(false);
                    this.getView().getModel("oEditableModel").setProperty("/sEditable", false);
                    this.getView().getModel("oEditableModel").setProperty("/edit", false);
                    this.getView().getModel("oEditableModel").setProperty("/view", true);
                }




            },

            //Start:All F4 Logic
            // Start: Invoice Number
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

                        // oModelForItems

                        var aHeadLen = Data.results.length;

                        for (let index = 0; index < aHeadLen; index++) {

                            var aItemsPayload = this.getView().getModel("oModelForItems").getData().results;
                            aItemsPayload[index].Item = Data.results[index].BillingDocumentItem;
                            aItemsPayload[index].Material = Data.results[index].Material;
                            aItemsPayload[index].ItemDescription = Data.results[index].ProductDescription;
                            aItemsPayload[index].Uom = Data.results[index].BaseUnit;
                            aItemsPayload[index].InvoiceQty = Data.results[index].BillingQuantity;
                            aItemsPayload[index].InvoiceValue = Data.results[index].GrossAmount;



                        }
                        this.getView().getModel("oModelForItems").refresh();


                        // oModelForHeader
                        this.getView().getModel("oModelForHeader").getData().Zcustomer = Data.results[0].SoldToParty;
                        this.getView().getModel("oModelForHeader").getData().ZfobValue = Data.results[0].TotalNetAmount
                        this.getView().getModel("oModelForHeader").getData().FobValueFc = Data.results[0].TransactionCurrency
                        this.getView().getModel("oModelForHeader").refresh();


                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            // End: Invoice Number

            // Start: Country of BL
            // on Value Help(F4)
            onCountryOfBLValueHelp: function () {
                if (!this.CountryOfBLFrag) {
                    this.CountryOfBLFrag = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_CountryOfBL",
                        this
                    );
                    this.getView().addDependent(this.CountryOfBLFrag);
                    var sService = "/sap/opu/odata/sap/ZV_BILLING_INV_DET_SERV_B";
                    var oModelCountryOfBL = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.CountryOfBLFrag.setModel(oModelCountryOfBL);
                    this._CountryOfBLTemp = sap.ui
                        .getCore()
                        .byId("idSLCountryOfBLValueHelp")
                        .clone();
                    this._oTempCountryOfBL = sap.ui
                        .getCore()
                        .byId("idSLCountryOfBLValueHelp")
                        .clone();
                }

                this.CountryOfBLFrag.open();
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
            onValueHelpSearch_CountryOfBL: function (oEvent) {
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
            onValueHelpConfirm_CountryOfBL: function (oEvent) {
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
            // End: Country of BL

            // Start: Port Of Loading
            onPortOfLoadingValueHelp: function () {
                if (!this.PortOfLoadingFrag) {
                    this.PortOfLoadingFrag = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_PortOfLoading",
                        this
                    );
                    this.getView().addDependent(this.PortOfLoadingFrag);
                    var sService = "/sap/opu/odata/sap/ZV_BILLING_INV_DET_SERV_B";
                    var oModelPortOfLoading = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.PortOfLoadingFrag.setModel(oModelPortOfLoading);
                    this._PortOfLoadingTemp = sap.ui
                        .getCore()
                        .byId("idSLPortOfLoadingValueHelp")
                        .clone();
                    this._oTempPortOfLoading = sap.ui
                        .getCore()
                        .byId("idSLPortOfLoadingValueHelp")
                        .clone();
                }

                this.PortOfLoadingFrag.open();
                var aFilter = [];
                // var oFilter = new Filter(
                //     [new Filter("BillingDocument", FilterOperator.EQ, "90000000")],
                //     false
                // );

                // aFilter.push(oFilter);

                sap.ui.getCore().byId("idSDPortOfLoadingF4").bindAggregation("items", {
                    path: "/ZV_BILLING_INV_DETAILS",
                    filters: aFilter,
                    template: this._PortOfLoadingTemp,
                });


            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_PortOfLoading: function (oEvent) {
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
            onValueHelpConfirm_PortOfLoading: function (oEvent) {
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
            // End: Port Of Loading

            // Start: Country
            onDestinationCountryValueHelp: function () {
                if (!this.DestinationCountryFrag) {
                    this.DestinationCountryFrag = sap.ui.xmlfragment(
                        "zmg.pro.exim.transactionalshippingbill.exim.view.fragments.valueHelp_DestinationCountry",
                        this
                    );
                    this.getView().addDependent(this.DestinationCountryFrag);
                    var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                    var oModelDestinationCountry = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.DestinationCountryFrag.setModel(oModelDestinationCountry);
                    this._DestinationCountryTemp = sap.ui
                        .getCore()
                        .byId("idSLDestinationCountryValueHelp")
                        .clone();

                }

                this.DestinationCountryFrag.open();
                var aFilter = [];
                var sPath = "/I_CountryText";
                sap.ui.getCore().byId("idSDDestinationCountryF4").bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._DestinationCountryTemp,
                });


            },
            // on Value Help - Search/liveChange
            onValueHelpSearch_DestinationCountry: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter(
                    [new Filter("Country", FilterOperator.Contains, sValue)],
                    false
                );
                aFilter.push(oFilter);
                oEvent.getSource().getBinding("items").filter(aFilter);
            },
            // on Value Help - Confirm
            onValueHelpConfirm_DestinationCountry: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("oModelForHeader").setProperty("/ZdestinationCountry", sSelectedValue.toString());

            },
            // End: Country


            //End:All F4 Logic

            diff: function (obj1, obj2) {
                const result = {};
                if (Object.is(obj1, obj2)) {
                    return undefined;
                }
                if (!obj2 || typeof obj2 !== 'object') {
                    return obj2;
                }

                Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
                    if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
                        debugger;
                        result[key] = obj2[key];
                    }
                    if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
                        const value = this.diff(obj1[key], obj2[key]);
                        if (value !== undefined) {
                            debugger;
                            result[key] = value;
                        }
                    }
                });
                return result;
            },
            onLicenseDetails: function (oEvent) {

                var oView = this.getView();
                if (!this._oFragmentavail) {
                    this._oFragmentavail = sap.ui.xmlfragment("zmg.pro.exim.transactionalshippingbill.exim.view.fragments.eachItemLicenseDetails", this);
                    oView.addDependent(this._oFragmentavail);
                }

                this._oFragmentavail.open();
                var oHeaderPaylod = this.getView().getModel("oModelForHeader").getData();
                var ZshippingBillNo = oHeaderPaylod.ZshippingBillNo;
                var Item;
                if (this.screenType === "edit") {
                    Item = oEvent.getSource().getParent().getCells()[0].getValue();
                } else {
                    Item = oEvent.getSource().getParent().getCells()[0].getText();
                }



                if (this.page === "null") {

                    var aItemPayload = this.getView().getModel("oModelForItems").getData();
                    for (let index = 0; index < aItemPayload.results.length; index++) {
                        const element = aItemPayload.results[index];
                        if (element.Item === Item) {

                            var aItemLicPayload = element.Licenses.results;
                            for (var i = 0; i < aItemLicPayload.length; i++) {
                                aItemLicPayload[i].Item = Item;
                            }
                            this.getView().getModel("oModelForLicenses").setData(element.Licenses);
                        }

                    }



                    // var nLicItemLen = 0;
                    // if (this.getView().getModel("oModelForLicenses").getData().results) {

                    //     var aLicTemp = this.getView().getModel("oModelForLicenses").getData();
                    //     var nLicTempLen = aLicTemp.length;
                    //     var nLicFinalPayloadLen = this.oLicFinalPayload;
                    //     // if (_.isEqual(aLicTemp, this.oLicFinalPayload)) {

                    //     // } else {
                    //     //     var diff = this.diff(aLicTemp, this.oLicFinalPayload);
                    //     // }
                    //     // debugger;
                    //     this.getView().getModel("oModelForLicenses").setData(this.oLicFinalPayload);
                    //     nLicItemLen = this.getView().getModel("oModelForLicenses").getData().results.length;
                    // } else {

                    //     // for Licenses details
                    //     var aEachItemsLic = {
                    //         "results": [{
                    //             "Item": Item,
                    //             "Material": "",
                    //             "Licences": "",
                    //             "Quantity": "",
                    //             "Value": ""
                    //         }]
                    //     };

                    //     this.oLicFinalPayload = aEachItemsLic;
                    //     this.getView().getModel("oModelForLicenses").setData(aEachItemsLic);
                    // }
                    // // come back here
                    // if (nLicItemLen > 0) {
                    //     var aLicItems = this.getView().getModel("oModelForLicenses").getData();
                    //     this.oLicFinalPayload = aLicItems;
                    //     var oClickedLicItem = {
                    //         "results": []
                    //     }
                    //     for (let index = 0; index < nLicItemLen; index++) {
                    //         const element = aLicItems.results[index];
                    //         if (element.Item === Item) {
                    //             // this.oLicFinalPayload.results.push(element);
                    //             oClickedLicItem.results.push(element);
                    //         }
                    //     }
                    //     if (oClickedLicItem.results.length > 0) {

                    //         this.getView().getModel("oModelForLicenses").setData(oClickedLicItem);
                    //     } else {
                    //         var oLicItem = {
                    //             "Item": Item,
                    //             "Material": "",
                    //             "Licences": "",
                    //             "Quantity": "",
                    //             "Value": ""
                    //         }
                    //         oClickedLicItem.results.push(oLicItem);
                    //         this.oLicFinalPayload.results.push(oLicItem);
                    //         this.getView().getModel("oModelForLicenses").setData(oClickedLicItem);

                    //     }

                    //     this.getView().getModel("oModelForLicenses").refresh();
                    // }


                } else {
                    var sPath = "/ZC_SHIP_BILL_ITEM(ZshippingBillNo='" + ZshippingBillNo + "',Item='" + Item + "')/to_SubItem";
                    this.getView().setBusy(true);
                    this.getView().getModel().read(sPath, {
                        success: function (Data) {
                            this.getView().getModel("oModelForLicenses").setData(Data);
                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function (oError) {
                            this.getView().setBusy(false);
                        }.bind(this)
                    });
                }

            },

            onLicenseDialogClose: function () {
                //Start: For multiple licenses 
                // var oLicItems = this.getView().getModel("oModelForLicenses").getData()
                // for (var i = 0; i < oLicItems.results.length; i++) {
                //     this.oLicFinalPayload.results.push(oLicItems.results[i])
                // }

                // for (var j = 0; j < this.oLicFinalPayload.results.length; j++) {
                //     for (var k = 0; k < this.oLicFinalPayload.results.length; k++) {
                //         if (j != k) {
                //             if (JSON.stringify(this.oLicFinalPayload.results[j]) === JSON.stringify(this.oLicFinalPayload.results[k])) {
                //                 this.oLicFinalPayload.results.splice(k, 1);
                //             }
                //         }
                //     }
                // }
                // const filteredArray = this.removeObjectWithEmptyString(this.oLicFinalPayload.results)
                // this.oLicFinalPayload.results = filteredArray;
                //End: For multiple licenses
                // come back here
                if (this.page != "null") {
                    var aItemPaylod = this.getView().getModel("oModelForItems").getData();
                    var aLicePayload = this.getView().getModel("oModelForLicenses").getData();
                    for (var i = 0; i < aItemPaylod.results.length; i++) {
                        if (aLicePayload.results[0].Item === aItemPaylod.results[i].Item) {
                            aItemPaylod.results[i].Licenses = aLicePayload;
                        }
                    }
                }

                this._oFragmentavail.close();

            },

            removeObjectWithEmptyString: function (array) {
                return array.filter(obj => {
                    for (const value of Object.values(obj)) {
                        if (value === '') {
                            return false;
                        }
                    }
                    return true;
                })
            },



            getCall: function (oModel, sPath) {
                this.getView().setBusy(true);
                // Get call
                oModel.read(sPath, {
                    success: function (Data) {

                        this.getView().getModel("oModelForHeader").setData(Data);
                        var sPath = "/ZRC_SHIP_BILL_HEAD('" + Data.ZshippingBillNo + "')/to_item"

                        this.getView().getModel().read(sPath, {
                            success: function (Data) {
                                this.getView().getModel("oModelForItems").setData(Data);
                                this.getView().setBusy(false);
                            }.bind(this),
                            error: function (oError) {
                                this.getView().setBusy(false);
                            }.bind(this)
                        });

                        // this.getView().setBusy(false);
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
                    var Item = 10 * (JSONData.results.length + 1);
                // for Licenses details
                var aEachItemsLic = {
                    "results": [{
                        "Item": "",
                        "Material": "",
                        "Licences": "",
                        "Quantity": "",
                        "Value": ""
                    }]
                };
                var payloadForItem = {
                    "Item": Item.toString(),
                    "Material": "",
                    "ItemDescription": "",
                    "Uom": "",
                    "InvoiceQty": "",
                    "InvoiceValue": "",
                    "Commission": "",
                    "Insurance": "",
                    "Freight": "",
                    "Licenses": aEachItemsLic
                }

                    ;
                JSONData.results.push(payloadForItem);
                this.getView()
                    .getModel("oModelForItems")
                    .setData(JSON.parse(JSON.stringify(JSONData)));
            },

            onDelete: function (oEvent) {

                var selectedItem = oEvent.getParameter('row').getAggregation('cells')[0].getValue();

                var JSONData = this.getView().getModel("oModelForItems").getData();
                if (JSONData.results.length > 1) {
                    for (var i = 0; i < JSONData.results.length; i++) {
                        if (JSONData.results[i].Item === selectedItem) {
                            var j = i;
                            sap.m.MessageBox.error("Delete item  " + selectedItem + "?", {
                                actions: ["Delete", sap.m.MessageBox.Action.CLOSE],
                                emphasizedAction: "Delete",
                                onClose: function (sAction) {
                                    if (sAction === "Delete") {
                                        JSONData.results.splice(j, 1);
                                        this.getView()
                                            .getModel("oModelForItems")
                                            .setData(JSON.parse(JSON.stringify(JSONData)));
                                    }
                                }.bind(this)
                            })

                        }
                    }

                } else {
                    MessageBox.error("Atlease one entry is required");
                }


            },

            onAddNewEmptyLicense: function () {
                var Item = this.getView().getModel("oModelForLicenses").getData().results[0].Item;
                var aItemPayload = this.getView().getModel("oModelForItems").getData();
                for (let index = 0; index < aItemPayload.results.length; index++) {
                    const element = aItemPayload.results[index];
                    if (element.Item === Item) {
                        var JSONData = aItemPayload.results[index].Licenses;
                    }

                }

                // var JSONData = this.getView()
                //     .getModel("oModelForLicenses")
                //     .getData();


                // var Item = this.getView().getModel("oModelForLicenses").getData().results[0].Item;

                var oEachItemsLic = {
                    "Item": Item,
                    "Material": "",
                    "Licences": "",
                    "Quantity": "",
                    "Value": ""

                };
                JSONData.results.push(oEachItemsLic);

                this.getView()
                    .getModel("oModelForLicenses")
                    .setData(JSONData);

                // this.oLicFinalPayload.results.push(oEachItemsLic);
            },

            onDeleteLicenseItem: function (oEvent) {

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

                var JSONData = this.getView().getModel("oModelForLicenses").getData();
                if (JSONData.length > 1) {
                    JSONData.splice(index, 1);
                } else {
                    MessageBox.error("Atlease one entry is required");
                }

                this.getView()
                    .getModel("oModelForLicenses")
                    .setData(JSON.parse(JSON.stringify(JSONData)));
            },

            onAddNewItem: function () {
                var JSONData = this.getView()
                    .getModel("oModelForItems")
                    .getData();
                if (JSONData.length > 0) {
                    MessageBox.error("Only 1 item is allowed for now")
                } else {
                    JSONData.push({ "Item": "10" });
                    this.getView()
                        .getModel("oModelForItems")
                        .setData(JSON.parse(JSON.stringify(JSONData)));
                }

            },

            onItemDeletePress: function () {

            },
            // On Save button action
            onSave: function () {
                var oModel = this.getOwnerComponent().getModel();
                var sPath = '/ZRC_SHIP_BILL_HEAD'
                var payload = this.getView().getModel("oModelForHeader").getData();

                this.postCallForHeader(oModel, sPath, payload);


            },

            // All post calls
            postCallForHeader: function (oModel, sPath, payload) {
                delete payload['to_item'];

                const dt = DateFormat.getDateTimeInstance({ pattern: "PThh'H'mm'M'ss'S'" });
                // if (payload.ZcreateTime === "") {
                payload.ZcreateTime = dt.format(new Date());
                // } else {
                //     payload.ZcreateTime = dt.format(payload.ZcreateTime);
                // }


                //Create Call
                this.getView().setBusy(true);
                oModel.create(sPath, payload, {
                    success: function (oData, response) {

                        //var sService = "/sap/opu/odata/sap/ZV_BILLING_INV_DET_SERV_B";
                        var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                        var oModelForItems = new sap.ui.model.odata.ODataModel(
                            sService,
                            true
                        );

                        this.getView().getModel("oModelForItems").setProperty('oModelForItems>ZshippingBillNo', oData.ZshippingBillNo)
                        // var sPathForItem = "/ZC_SHIP_BILL_ITEM";

                        var payloadOfItems = this.getView().getModel("oModelForItems").getData().results;
                        var _Item = 10;
                        var aPayload = [];
                        for (let index = 0; index < payloadOfItems.length; index++) {
                            Item = _Item * (index + 1);
                            const element = payloadOfItems[index];
                            var payloadOfItem = {
                                "Item": Item.toString(),
                                "Material": element.Material,
                                "ItemDescription": element.ItemDescription,
                                "Uom": element.Uom,
                                "InvoiceQty": element.InvoiceQty,
                                "InvoiceValue": element.InvoiceValue,
                                // "FobCurrency": "INR",
                                "Commission": element.Commission,
                                "Insurance": element.Insurance,
                                "Freight": element.Freight,
                                // "FobValue": "106",
                                // "FobValueFc": "107",
                                // "FobCurrecnyFc": "INR",
                                // "RodtepPer": "108",
                                // "RodtepAmount": "109",
                                // "ZcreateDate": "\/Date(1728604800000)\/",
                                // "ZcreateTime": "P00DT13H11M55S",
                                // "ZcreateBy": "Santosh",
                                // "RodtepCurrency": "INR"
                            }
                            aPayload.push(payloadOfItem);
                        }

                        var sPathForItem = "ZRC_SHIP_BILL_HEAD('" + oData.ZshippingBillNo + "')/to_item";

                        this.postCallForItem(oModelForItems, sPathForItem, aPayload)
                        // this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            postCallForItem: function (oModel, sPath, aPayload) {

                // for (let i = 0; i < aPayload.length; i++) {
                //     if (i === aPayload.length - 1) {
                //         this.getView().setBusy(false);
                //     }
                //     setTimeout(function demo() {
                //         this.createCallForEachItem(i, oModel, sPath, aPayload);
                //     }.bind(this), 10000);

                // }
                var that = this;
                var promise = Promise.resolve();
                aPayload.forEach(function (Payload, i) { //copy local variables
                    //Chain the promises
                    promise = promise.then(function () { return that._promisecreateCallForEachItem(oModel, sPath, Payload) });
                });
                promise.then(function () {

                })
                    .catch(function () {

                    })

            },
            _promisecreateCallForEachItem: function (oModel, sPath, Payload) {

                // this.getView().setBusy(true);
                oModel.create(sPath, Payload, {
                    success: function (oData, response) {

                        //this.callLicenseSave(oModel, sShippingBillingNo, sItemNo);
                        this.onLicenseSave(oData.Item);

                    }.bind(this),
                    error: function (oError) {

                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            // createCallForEachItem: function (index, oModel, sPath, aPayload) {

            //     this.getView().setBusy(true);
            //     oModel.create(sPath, aPayload[index], {
            //         success: function (oData, response) {

            //             //this.callLicenseSave(oModel, sShippingBillingNo, sItemNo);
            //             this.onLicenseSave(oData.Item);

            //         }.bind(this),
            //         error: function (oError) {

            //             this.getView().setBusy(false);
            //         }.bind(this)
            //     });
            // },

            onLicenseSave: function (Item) {
                var oHeaderPaylod = this.getView().getModel("oModelForHeader").getData();
                var aItemPaylod = this.getView().getModel("oModelForItems").getData();
                // var aLicensePaylod = this.getView().getModel("oModelForLicenses").getData();

                this.shippingBillNo = oHeaderPaylod.ZshippingBillNo;
                var aLicPayload = [];
                var aPath = []
                for (let index = 0; index < aItemPaylod.results.length; index++) {
                    if (aItemPaylod.results[index].Item === Item) {
                        const oItemPaylod = aItemPaylod.results[index];
                        var aLicensePaylod = aItemPaylod.results[index].Licenses
                        for (let j = 0; j < aLicensePaylod.results.length; j++) {
                            const oLicensePaylod = aLicensePaylod.results[j];
                            var sPath = "ZC_SHIP_BILL_ITEM(ZshippingBillNo='" + oHeaderPaylod.ZshippingBillNo + "',Item='" + oItemPaylod.Item + "')/to_SubItem";
                            var oLicPayload = {
                                "Item": oItemPaylod.Item,
                                "ZshippingBillNo": oHeaderPaylod.ZshippingBillNo,
                                "Licences": oLicensePaylod.Licences
                            };
                            aLicPayload.push(oLicPayload);
                            aPath.push(sPath);
                        }

                    }


                }
                this.getView().setBusy(true);
                var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                var oModelForLicense = new sap.ui.model.odata.ODataModel(
                    sService,
                    true
                );



                // for (let i = 0; i < aLicPayload.length; i++) {
                //     if (i === aLicPayload.length - 1) {
                //         this.getView().setBusy(false);
                //     }
                //     setTimeout(function demo() {

                //         this.createCallForEachItemLic(oModelForLicense, aPath[i], aLicPayload[i]);
                //     }.bind(this), 1500);
                // }

                var that = this;
                var promise = Promise.resolve();
                aLicPayload.forEach(function (Payload, i) { //copy local variables
                    //Chain the promises
                    promise = promise.then(function () { return that.createCallForEachItemLic(oModelForLicense, aPath[i], Payload) });

                });
                promise.then(function () {
                    that.getView().setBusy(false);
                    sap.m.MessageBox.success("Shipping bill  " + that.shippingBillNo + " created", {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: "OK",
                        onClose: function (sAction) {
                            if (sAction === "OK") {
                                window.history.go(-1);

                            }
                        }
                    });
                    // Create ends here
                })
                    .catch(function () {

                    })

            },
            createCallForEachItemLic: function (oModelForLicense, sPath, ItemLicPayload) {

                oModelForLicense.create(sPath, ItemLicPayload, {
                    success: function (oData, response) {
                        // this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            // All update calls

            // Header
            onUpdate: function () {
                var oModel = this.getOwnerComponent().getModel();
                var payload = this.getView().getModel("oModelForHeader").getData();
                var sPath = "/ZRC_SHIP_BILL_HEAD('" + payload.ZshippingBillNo + "')"
                this.updateCallForHeader(oModel, sPath, payload);
            },
            updateCallForHeader: function (oModel, sPath, payload) {
                delete payload['to_item'];
                const dt = DateFormat.getDateTimeInstance({ pattern: "PThh'H'mm'M'ss'S'" });
                payload.ZcreateTime = dt.format(new Date());
                //update Call
                this.getView().setBusy(true);
                oModel.update(sPath, payload, {
                    success: function (oData, response) {
                        var payloadOfItems = this.getView().getModel("oModelForItems").getData().results;
                        var _Item = 10;
                        var aPayload = [];
                        for (let index = 0; index < payloadOfItems.length; index++) {
                            Item = _Item * (index + 1);
                            const element = payloadOfItems[index];
                            var payloadOfItem = {
                                "Item": Item.toString(),
                                "Material": element.Material,
                                "ItemDescription": element.ItemDescription,
                                "Uom": element.Uom,
                                "InvoiceQty": element.InvoiceQty,
                                "InvoiceValue": element.InvoiceValue,
                                // "FobCurrency": "INR",
                                "Commission": element.Commission,
                                "Insurance": element.Insurance,
                                "Freight": element.Freight,
                                // "FobValue": "106",
                                // "FobValueFc": "107",
                                // "FobCurrecnyFc": "INR",
                                // "RodtepPer": "108",
                                // "RodtepAmount": "109",
                                // "ZcreateDate": "\/Date(1728604800000)\/",
                                // "ZcreateTime": "P00DT13H11M55S",
                                // "ZcreateBy": "Santosh",
                                // "RodtepCurrency": "INR"
                            }
                            aPayload.push(payloadOfItem);
                        }
                        // ZC_SHIP_BILL_ITEM(ZshippingBillNo = 'SKT006', Item = '10')

                        // var sPathForItem = "ZRC_SHIP_BILL_HEAD('" + oData.ZshippingBillNo + "')/to_item";
                        var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                        var oModelForItems = new sap.ui.model.odata.ODataModel(
                            sService,
                            true
                        );
                        var oData = this.getView().getModel("oModelForHeader").getData();
                        this.updateCallForItem(oModelForItems, oData.ZshippingBillNo, aPayload)

                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            updateCallForItem: function (oModel, shippingBillNo, aPayload) {

                var that = this;
                var promise = Promise.resolve();
                aPayload.forEach(function (Payload, i) { //copy local variables
                    //Chain the promises
                    var sPath = "ZC_SHIP_BILL_ITEM(ZshippingBillNo='" + shippingBillNo + "',Item='" + Payload.Item + "')";
                    promise = promise.then(function () { return that._promiseUpdateCallForEachItem(oModel, sPath, Payload) });
                });
                promise.then(function () {
                    that.getView().setBusy(false);
                })
                    .catch(function () {
                        that.getView().setBusy(false);
                    })

            },
            _promiseUpdateCallForEachItem: function (oModel, sPath, Payload) {
                var Item = Payload.Item;
                // this.getView().setBusy(true);
                oModel.update(sPath, Payload, {
                    success: function (oData, response) {

                        //this.callLicenseSave(oModel, sShippingBillingNo, sItemNo);
                        this.onLicenseUpdate(Item);

                    }.bind(this),
                    error: function (oError) {

                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            onLicenseUpdate: function (Item) {
                var oHeaderPaylod = this.getView().getModel("oModelForHeader").getData();
                var aItemPaylod = this.getView().getModel("oModelForItems").getData();
                // var aLicensePaylod = this.getView().getModel("oModelForLicenses").getData();

                this.shippingBillNo = oHeaderPaylod.ZshippingBillNo;
                var aLicPayload = [];
                var aPath = []
                for (let index = 0; index < aItemPaylod.results.length; index++) {
                    if (aItemPaylod.results[index].Item === Item) {
                        const oItemPaylod = aItemPaylod.results[index];
                        if (aItemPaylod.results[index].Licenses) {
                            var aLicensePaylod = aItemPaylod.results[index].Licenses
                            for (let j = 0; j < aLicensePaylod.results.length; j++) {
                                const oLicensePaylod = aLicensePaylod.results[j];
                                // ZC_SHIP_BILL_LIC(ZshippingBillNo='SKT006',Item='10',Licences='101')
                                var licenseNo = this.getView().getModel("oModelForLicenses").getData().results[0].Licences;
                                var sPath = "ZC_SHIP_BILL_LIC(ZshippingBillNo='" + oHeaderPaylod.ZshippingBillNo + "',Item='" + oItemPaylod.Item + "',Licences='" + licenseNo + "')";
                                var oLicPayload = {
                                    "Item": oItemPaylod.Item,
                                    "ZshippingBillNo": oHeaderPaylod.ZshippingBillNo,
                                    "Licences": oLicensePaylod.Licences,
                                    "Quantity": oLicensePaylod.Quantity
                                };
                                aLicPayload.push(oLicPayload);
                                aPath.push(sPath);
                            }
                        }
                    }


                }
                this.getView().setBusy(true);
                var sService = "/sap/opu/odata/sap/ZRC_SHIP_BILL_HEAD_SRV_B";
                var oModelForLicense = new sap.ui.model.odata.ODataModel(
                    sService,
                    true
                );





                var that = this;
                var promise = Promise.resolve();
                aLicPayload.forEach(function (Payload, i) { //copy local variables
                    //Chain the promises
                    promise = promise.then(function () { return that.updateCallForEachItemLic(oModelForLicense, aPath[i], Payload) });

                });
                promise.then(function () {
                    that.getView().setBusy(false);
                    sap.m.MessageBox.success("Shipping bill  " + that.shippingBillNo + " updated", {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: "OK",
                        onClose: function (sAction) {
                            if (sAction === "OK") {
                                window.history.go(-1);

                            }
                        }
                    });
                    // Create ends here
                })
                    .catch(function () {

                    })

            },
            updateCallForEachItemLic: function (oModelForLicense, sPath, ItemLicPayload) {

                oModelForLicense.update(sPath, ItemLicPayload, {
                    success: function (oData, response) {
                        // this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

        });
    });
