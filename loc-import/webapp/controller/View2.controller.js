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
    "sap/ui/integration/designtime/baseEditor/validator/MaxLength"
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
        MaxLength) {

        return Controller.extend("zpro.sk.mittalcoin.exim.loc.import.locimport.controller.View2", {
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
                } else {
                    this.propertyValues.setProperty("/edit", false);
                    var sPathOfLCDetails = "/ZRC_LCIMP_HEAD('" + LcNo + "')";
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
            },
            // Local payloads
            createLocalJOSNPayload: function () {
                var headerPayload = {
                    "LcNo": "",
                    "ContractNo": "",
                    "PiNo": "",
                    "PiDate": "",
                    "Po": "",
                    "ShipmetLastDate": "",
                    "PortOfLoading": "",
                    "FinalIcdLocation": "",
                    "LcIssuingBank": "",
                    "ShipmentType": "",
                    "LcType": "",
                    "LcIssueDate": "",
                    "LcExpiryDate": "",
                    "PortOfDischarge": "",
                    "LcChargesOutsideIndia": "",
                    "LcRecievingBank": "",
                    "IncoTerms": "",
                    "TollCurr": "",
                    "ToleranceValue": "",
                    "ZcreateDate": "",
                    "ZcreateTime": "",
                    "ZcreateBy": ""
                }
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
                    "title": "LC Import Item",
                    "view": false,
                    "edit": false,
                    "editButton": false,
                    "footer": false,
                    "new": false,
                    "update": false,
                    "itemTableVisiblity": false
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
                        this.getView().getModel("oModelForItemTable").setData(Data.results);
                        this.propertyValues.setProperty("/title", "LC Import Item(" + Data.results.length + ")");
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
                        "zpro.sk.mittalcoin.exim.loc.import.locimport.view.fragments.View2.valueHelps.valueHelp_PO",
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
                debugger;

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

                        // oModelForItems

                        // var aHeadLen = Data.results.length;

                        // for (let index = 0; index < aHeadLen; index++) {

                        //     var aItemsPayload = this.getView().getModel("oModelForItems").getData().results;
                        //     aItemsPayload[index].LcNo = Data.results[index].BillingDocumentItem;
                        //     aItemsPayload[index].Ebelp = Data.results[index].Material;
                        //     aItemsPayload[index].Matnr = Data.results[index].ProductDescription;
                        //     aItemsPayload[index].Mtart = Data.results[index].BaseUnit;
                        //     aItemsPayload[index].Meins = Data.results[index].BillingQuantity;
                        //     aItemsPayload[index].Menge = Data.results[index].GrossAmount;
                        //     aItemsPayload[index].UnitPrice = Data.results[index].GrossAmount;
                        //     aItemsPayload[index].PoCurr = Data.results[index].GrossAmount;
                        //     aItemsPayload[index].TotValue = Data.results[index].GrossAmount;

                        // }
                        // this.getView().getModel("oModelForItems").refresh();
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


        })
    });