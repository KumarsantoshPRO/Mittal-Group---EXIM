sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Menu",
    "sap/m/MenuItem",
    "sap/m/table/columnmenu/Menu",
    "sap/m/table/columnmenu/ActionItem",
    "sap/m/ToolbarSpacer",
    "sap/ui/thirdparty/jquery",
    "sap/ui/Device",
    "sap/ui/core/date/UI5Date",
    'sap/m/p13n/Engine',
    'sap/m/p13n/SelectionController',
    'sap/m/p13n/SortController',
    'sap/m/p13n/GroupController',
    'sap/m/p13n/MetadataHelper',
    'sap/ui/model/Sorter',
    'sap/ui/core/library',
    'sap/m/table/ColumnWidthController',
    'sap/m/p13n/FilterController',
    'sap/ui/export/Spreadsheet',
    "sap/ui/export/library",
    "sap/ui/integration/designtime/baseEditor/validator/MaxLength",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/odata/ODataUtils"

],
    function (Controller,
        JSONModel,
        Menu,
        MenuItem,
        Menu,
        ActionItem,
        ToolbarSpacer,
        jquery,
        Device,
        UI5Date,
        Engine,
        SelectionController,
        SortController,
        GroupController,
        MetadataHelper,
        Sorter,
        library,
        ColumnWidthController,
        FilterController,
        Spreadsheet,
        library,
        MaxLength,
        MessageBox, DateFormat, ODataUtils) {

        return Controller.extend("zpro.sk.mittalcoin.exim.loc.export.locexport.controller.View2", {
            onInit: function () {
                this.getOwnerComponent()
                    .getRouter()
                    .attachRoutePatternMatched(this.onRouteMatched, this);
            },
            onRouteMatched: function (oEvent) {
                var LcNo = oEvent.getParameter("arguments").LCNo;
                this.createLocalJOSNPayload();
                this.page = LcNo;
                if (LcNo === "null") {
                    this.propertyValues.setProperty("/edit", true);
                    this.propertyValues.setProperty("/view", false);
                    this.propertyValues.setProperty("/editButton", false);
                    this.propertyValues.setProperty("/footer", true);
                    this.propertyValues.setProperty("/update", false);
                    this.propertyValues.setProperty("/new", true);
                    this.propertyValues.setProperty("/po", true);
                    var currentDateTime = new Date();
                    // const dt = DateFormat.getDateTimeInstance({ pattern: "PThh'H'mm'M'ss'S'" });

                    // var currentTime = dt.format(new Date());
                    // var currentTime = ODataUtils.formatValue(new Date(), "Edm.Time")
                    this.getView().getModel("oModelForHeader").setProperty("/ZcreateDate", currentDateTime)
                    this.getView().getModel("oModelForHeader").setProperty("/ZcreateTime", currentDateTime)
                } else {
                    this.propertyValues.setProperty("/edit", false);
                    var sPathOfLCDetails = "/ZRC_LCEXP_HEAD('" + LcNo + "')";
                    var sPathOfLCItemsDetails = sPathOfLCDetails + "/to_Item";
                    // var sPathOfLCDetails = "/ZC_LCIMP_ITEM(LcNo='" + LcNo + "',Ebelp='" + Ebelp + "')/to_head";
                    this.getCallForLCDetails(sPathOfLCDetails, sPathOfLCItemsDetails);
                }
            },

            // On edit button action
            onEditPress: function () {
                this.propertyValues.setProperty("/edit", true);
                this.propertyValues.setProperty("/view", false);
                this.propertyValues.setProperty("/editButton", false);
                this.propertyValues.setProperty("/footer", true);
                this.propertyValues.setProperty("/update", true);
                this.propertyValues.setProperty("/new", false);
                this.propertyValues.setProperty("/po", false);

            },
            // Local payloads
            createLocalJOSNPayload: function () {
                var headerPayload = {
                    "LcNo": "",
                    "SalesContract": "",
                    "SalesOrder": "",
                    "ShipmetLastDateOri": "",
                    "LatestDocumentDateOri": "",
                    "ShipmetLastDateAmend": "",
                    "LatestDocumentDateAmend": "",
                    "LcIssueDateAmend": "",
                    "LcIssuanceBankAccountNumbe": "",
                    "LcIssuanceBankName": "",
                    "LcIssuanceSwiftCode": "",
                    "BeneficiaryBankDetailsWith_": "",
                    "NegotiatingBankDetailsWith_": "",
                    "PortOfLoading": "",
                    "FinalDestination": "",
                    "IssueChargesBySeller": "",
                    "ConfirmationChargesBySeller": "",
                    "DiscountingChargesBySeller": "",
                    "IssueChargesByBuyer": "",
                    "ConfirmationChargesByBuyer": "",
                    "DiscountingChargesByBuyer": "",
                    "PaymentTerms": "",
                    "ToleranceQtyP": "",
                    "ShipmentType": "",
                    "LcType": "",
                    "Pi": "",
                    "LcExpiryDateOriginal": "",
                    "LcIssueDateOriginal": "",
                    "LcRecevingDateOriginal": "",
                    "LcExpiryDateAmendment": "",
                    "LcRecevingDateAmendment": "",
                    "LcRecieivingBankAccountNum": "",
                    "LcReceivingBankName": "",
                    "LcRecevingSwiftCode": "",
                    "ConfirmationBankDetailsWith": "",
                    "PortOfDischarge": "",
                    "LcCurrency": "",
                    "LcValue": "",
                    "ListOfDocumentsUnderLc": "",
                    "AmendmentChargesBySeller": "",
                    "DiscrepencyChargesBySeller": "",
                    "TotalChargesBySeller": "",
                    "Amendment_ChargesBySeller": "",
                    "DiscrepencyChargesByBuyer": "",
                    "TotalChargesByBuyer": "",
                    "LcChargesInIndia": "",
                    "ToleranceValueP": "",
                    "TransShipment": ""
                };
                this.getView().setModel(new JSONModel(headerPayload), "oModelForHeader");

                var itemPayload = {
                    "results": [{
                        "LcNo": "",
                        "Ebelp": "",
                        "Matnr": "",
                        "Mtart": "",
                        "Meins": "",
                        "Menge": "",
                        "PoCurr": "",
                        "UnitPrice": "",
                        "TotValue": "",
                        "ExcRate": "",
                        "InrValue": "",
                        "ZcreateDate": "",
                        "ZcreateTime": "",
                        "ZcreateBy": ""

                    }
                    ]
                };
                this.getView().setModel(new JSONModel(itemPayload), "oModelForItemTable");

                var properties = {
                    "title": "LC export Item",
                    "view": false,
                    "edit": false,
                    "editButton": false,
                    "footer": false,
                    "new": false,
                    "update": false,
                    "itemTableVisiblity": false,
                    "po": false
                };
                this.getView().setModel(new JSONModel(properties), "myPropertyValues");
                this.propertyValues = this.getView().getModel("myPropertyValues");
            },

            // All get calls
            getCallForLCDetails: function (sPathOfLCDetails, sPathOfLCItemsDetails) {
                this.getView().setBusy(true);
                this.getOwnerComponent().getModel().read(sPathOfLCDetails, {
                    success: function (Data) {

                        this.getView().getModel("oModelForHeader").setData(Data);
                        this.getCallForLCItemsDetails(sPathOfLCItemsDetails);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            getCallForLCItemsDetails: function (sPathOfLCItemsDetails) {
                this.getOwnerComponent().getModel().read(sPathOfLCItemsDetails, {
                    success: function (Data) {
                        this.propertyValues.setProperty("/view", true);
                        this.propertyValues.setProperty("/editButton", true);
                        this.getView().getModel("oModelForItemTable").setData(Data);
                        this.propertyValues.setProperty("/title", "LC export Item(" + Data.results.length + ")");
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            //Start:All F4 Logic
            // Start: PO
            // on Value Help(F4)
            onPOValueHelp: function () {
                if (!this.InvoiceNumFrag) {
                    this.InvoiceNumFrag = sap.ui.xmlfragment(
                        "zpro.sk.mittalcoin.exim.loc.export.locexport.view.fragments.View2.valueHelps.valueHelp_PO",
                        this 
                    );
                    this.getView().addDependent(this.InvoiceNumFrag);
                    var sService = "/sap/opu/odata/sap/ZF4_RI_PO_SERV";
                    var oModelPO = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.InvoiceNumFrag.setModel(oModelPO);
                    this._POTemp = sap.ui
                        .getCore()
                        .byId("idSLPOValueHelp")
                        .clone();

                }

                this.InvoiceNumFrag.open();
                var aFilter = [];
                var sPath = "/ZF4_RI_PURCHASEORDERITEMS";
                sap.ui.getCore().byId("idSDPOF4").bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._POTemp,
                });


            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_PO: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var sPath = "/ZF4_RI_PURCHASEORDERITEMS";
                var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));
                var aFilter = [];
                var oFilter = new Filter(
                    [new Filter("PurchaseOrder", FilterOperator.Contains, sValue)],
                    false
                );

                aFilter.push(oFilter);
                oSelectDialog.bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._POTemp,
                });
            },

            // on Value Help - Confirm
            onValueHelpConfirm_PO: function (oEvent) {
                // this.JSONModelPayload = this.getView().getModel("oModelForHeader");

                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("oModelForHeader").setProperty("/Po", sSelectedValue.toString());


                this.getView().addDependent(this.InvoiceNumFrag);
                var sService = "/sap/opu/odata/sap/ZF4_RI_PO_SERV";
                var oModelItem = new sap.ui.model.odata.ODataModel(
                    sService,
                    true
                );

                var sPath = oEvent.getParameter('selectedItem').getBindingContextPath()
                this.getView().setBusy(true);
                oModelItem.read(sPath, {

                    success: function (Data) {
                        var index = 0;
                        var aItemsPayload = this.getView().getModel("oModelForItemTable").getData().results;
                        aItemsPayload[index].LcNo = this.getView().getModel("oModelForHeader").getProperty("/LcNo");
                        aItemsPayload[index].Ebelp = Data.PurchaseOrderItem;
                        aItemsPayload[index].Matnr = Data.Material;
                        aItemsPayload[index].Mtart = Data.PurchaseOrderItemText;
                        aItemsPayload[index].Meins = Data.PurchaseOrderQuantityUnit;
                        aItemsPayload[index].Menge = Data.OrderQuantity;
                        aItemsPayload[index].UnitPrice = Data.NetPriceQuantity;
                        aItemsPayload[index].PoCurr = Data.DocumentCurrency;
                        var TotValue = (Data.OrderQuantity * Data.NetPriceQuantity).toFixed(2);
                        aItemsPayload[index].TotValue = TotValue.toString();
                        aItemsPayload[index].ExcRate = Data.ExchangeRate;
                        aItemsPayload[index].ZcreateBy = Data.CreatedByUser
                        var InrValue = (Number(TotValue) * Data.ExchangeRate).toFixed(2).toString();
                        aItemsPayload[index].InrValue = InrValue;

                        const dt = DateFormat.getDateTimeInstance({ pattern: "PThh'H'mm'M'ss'S'" });
                        var createdTime = dt.format(new Date());
                        var createdDate = new Date();
                        aItemsPayload[index].ZcreateDate = createdDate
                        aItemsPayload[index].ZcreateTime = createdTime

                        this.getView().getModel("oModelForItemTable").refresh();
                        this.propertyValues.setProperty("/itemTableVisiblity", true);
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },
            // End: PO

            // On Cancel button action
            onCancel: function () {
                if (this.page === "null") {
                    sap.m.MessageBox.warning("Discard this object?", {
                        actions: ["Discard", sap.m.MessageBox.Action.CANCEL],
                        emphasizedAction: "Discard",
                        onClose: function (sAction) {
                            if (sAction === "Discard") {
                                window.history.go(-1);
                            }
                        }
                    });
                } else {
                    this.propertyValues.setProperty("/edit", false);
                    this.propertyValues.setProperty("/view", true);
                    this.propertyValues.setProperty("/editButton", true);
                    this.propertyValues.setProperty("/footer", false);
                }

            },

            // Start: Menu
            openPersoDialog: function (oEvt) {
                const oTable = this.byId("table");

                Engine.getInstance().show(oTable, ["Columns", "Sorter", "Groups", "Filter"], {
                    contentHeight: "35rem",
                    contentWidth: "32rem",
                    source: oEvt.getSource()
                });
            },
            // End: Menu

            // All post call
            // On Create
            onCreateButtonPress: function () {
                var oModel = this.getOwnerComponent().getModel();
                var sPath = '/ZRC_LCEXP_HEAD'
                var payload = this.getView().getModel("oModelForHeader").getData();
                const dt = DateFormat.getDateTimeInstance({ pattern: "PThh'H'mm'M'ss'S'" });
                payload.ZcreateTime = dt.format(new Date());
                this.postCallForHeader(oModel, sPath, payload);


            },


            validation: function (headerPayload) {
                if (!headerPayload.Po) {
                    MessageBox.error("Please select PO");
                    return false;
                } else if (!headerPayload.PiDate) {
                    MessageBox.error("Please enter PI Date");
                    return false;
                } else if (!headerPayload.ShipmetLastDate) {
                    MessageBox.error("Please enter Shipment Date");
                    return false;
                } else if (!headerPayload.LcIssueDate) {
                    MessageBox.error("Please enter LC Issue Date ");
                    return false;
                } else if (!headerPayload.LcExpiryDate) {
                    MessageBox.error("Please enter LC Expiry Date");
                    return false;
                } else if (!headerPayload.ToleranceValue) {
                    MessageBox.error("Please enter Tolerance Quantity");
                    return false;
                } else if (!headerPayload.ZcreateDate) {
                    MessageBox.error("Please enter Created Date ");
                    return false;
                } else if (!headerPayload.ZcreateTime) {
                    MessageBox.error("Please enter Created Time ");
                    return false;
                } else {

                    return true;
                }


            },
            // All post calls
            postCallForHeader: function (oModel, sPath, payload) {
                var validation = this.validation(payload);
                if (validation === true) {
                    //Create Call
                    this.getView().setBusy(true);
                    oModel.create(sPath, payload, {
                        success: function (oData, response) {
                            var payloadItem = this.getView().getModel("oModelForItemTable").getData().results;
                            var sPathItems = "/ZRC_LCEXP_HEAD('" + oData.LcNo + "')/to_Item";
                            this.LcNo = oData.LcNo;
                            this.postCallForItem(oModel, sPathItems, payloadItem)
                            this.getView().setBusy(false);
                        }.bind(this),
                        error: function (oError) {
                            this.getView().setBusy(false);
                        }.bind(this)
                    });
                }
            },
            postCallForItem: function (oModel, sPath, aPayload) {
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
                var that = this;
                // this.getView().setBusy(true);
                oModel.create(sPath, Payload, {
                    success: function (oData, response) {
                        sap.m.MessageBox.success("LC Number  " + that.LcNo + " created", {
                            actions: [sap.m.MessageBox.Action.OK],
                            emphasizedAction: "OK",
                            onClose: function (sAction) {
                                if (sAction === "OK") {
                                    window.history.go(-1);
                                }
                            }
                        });


                    }.bind(this),
                    error: function (oError) {

                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            // All update calls

            // Header
            onSaveButtonPress: function () {
                var oModel = this.getOwnerComponent().getModel();
                var payload = this.getView().getModel("oModelForHeader").getData();
                this.LcNo = payload.LcNo;
                var sPath = "/ZRC_LCEXP_HEAD('" + payload.LcNo + "')"
                this.updateCallForHeader(oModel, sPath, payload);
            },
            updateCallForHeader: function (oModel, sPath, payload) {
                var that = this;
                delete payload['to_item'];
                // const dt = DateFormat.getDateTimeInstance({ pattern: "PThh'H'mm'M'ss'S'" });
                // payload.ZcreateTime = dt.format(new Date());
                //update Call
                this.getView().setBusy(true);
                oModel.update(sPath, payload, {
                    success: function (oData, response) {
                        sap.m.MessageBox.success("LC Number  " + that.LcNo + " updated", {
                            actions: [sap.m.MessageBox.Action.OK],
                            emphasizedAction: "OK",
                            onClose: function (sAction) {
                                if (sAction === "OK") {
                                    window.history.go(-1);
                                }
                            }
                        });
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

        })
    });