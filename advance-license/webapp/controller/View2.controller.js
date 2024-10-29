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

        return Controller.extend("zpro.sk.mittalcoin.exim.advance.license.advancelicense.controller.View2", {
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




                } else {
                    this.propertyValues.setProperty("/edit", false);
                    var sPathOfLCDetails = "/ZRC_ADV_LIC_HEAD('" + LcNo + "')";
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
                    "Advlicno": "",
                    "Company": "",
                    "Plant": "",
                    "Category": "",
                    "Rcmcno": "",
                    "Bondno": "",
                    "Gstin": "",
                    "Iecno": "",
                    "FileNo": "",
                    "AuthorisationNo": "",
                    "Status": "",
                    "PortOfReg": "",
                    "BondValidTo": "",
                    "RegistrationNo": "",
                    "MinValueAdd": "",
                    "DocCurrency": "",
                    "AdvLicFee": "",
                    "BondValue": "",
                    "FcCurrency": "",
                    "DateOfIssue": "",
                    "ImpValidFrm": "",
                    "ImpValidTo": "",
                    "ExpValidFrm": "",
                    "ExpValidTo": "",
                    "EopExtExpValidFrm": "",
                    "EopExtExpValidTo": "",
                    "RevalidLicImpFrm": "",
                    "RevalidLicImpTo": "",
                    "CreatedBy": "",
                    "CreatedOn": "",
                    "CreatedAt": "",
                    "LastChangedBy": "",
                    "LocalLastChangedAt": ""

                }
                this.getView().setModel(new JSONModel(headerPayload), "oModelForHeader");

                var itemPayload = {
                    "results": [{
                        "Advlicno": "",
                        "Type": "",
                        "LineNumber": "10",
                        "LineType": "",
                        "LineStatus": "",
                        "SionNo": "",
                        "ExportItem": "",
                        "ExportHsn": "",
                        "UnitField": "",
                        "ExportExQty": "",
                        "ExportExchangeRate": "",
                        "ImportItem": null,
                        "ImportHsn": null,
                        "ImportWastageQtyMt": null,
                        "NetContent": null,
                        "ImportQty": null,
                        "ImportRateFc": null,
                        "ImportTotalValFc": null,
                        "ImportExchangeRate": null,
                        "ImportTotalValDc": null,
                        "AssValue": null,
                        "Bcd": null,
                        "BcdVal": null,
                        "Sws": null,
                        "SwsVal": null,
                        "Igst": null,
                        "IgstVal": null,
                        "AntDempDuty": null,
                        "OtherDuty": null,
                        "Va": null,
                        "TotalDuty": null
                    }
                    ]
                };
                this.getView().setModel(new JSONModel(itemPayload), "oModelForItemTable");

                var properties = {
                    "title": "Advance License Item",
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
                this.setCurrentDateTime();
            },
            setCurrentDateTime: function () {


                var currentDateTime = new Date();

                this.getView().getModel("oModelForHeader").setProperty("/CreatedOn", currentDateTime);
                this.getView().getModel("oModelForHeader").setProperty("/CreatedAt", currentDateTime);
                this.getView().getModel("oModelForHeader").setProperty("/LocalLastChangedAt", currentDateTime);


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
                        this.propertyValues.setProperty("/title", "Advance License Items(" + Data.results.length + ")");
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            //Start:All F4 Logic

            // Start: CompanyCode
            // on Value Help(F4)
            onCompanyCodeValuelHelp: function () {
                if (!this.CompanyCodeFrag) {
                    this.CompanyCodeFrag = sap.ui.xmlfragment(
                        "zpro.sk.mittalcoin.exim.advance.license.advancelicense.view.fragments.View2.valueHelps.valueHelp_CompanyCode",
                        this
                    );
                    this.getView().addDependent(this.CompanyCodeFrag);


                    var sService = "/sap/opu/odata/sap/ZRC_ADV_LIC_HEAD_SRV";
                    var oModelCompanyCode = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.CompanyCodeFrag.setModel(oModelCompanyCode);
                    this._CompanyCodeTemp = sap.ui
                        .getCore()
                        .byId("idSLCompanyCodeValueHelp")
                        .clone();

                }

                this.CompanyCodeFrag.open();
                var aFilter = [];
                var sPath = "/I_CompanyCode";
                sap.ui.getCore().byId("idSDCompanyCodeF4").bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._CompanyCodeTemp,
                });


            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_CompanyCode: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var sPath = "/I_CompanyCode";
                var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));
                var aFilter = [];
                var oFilter = new Filter(
                    [new Filter("CompanyCode", FilterOperator.Contains, sValue)],
                    false
                );

                aFilter.push(oFilter);
                oSelectDialog.bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._CompanyCodeTemp,
                });
            },

            // on Value Help - Confirm
            onValueHelpConfirm_CompanyCode: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("oModelForHeader").setProperty("/Company", sSelectedValue.toString());
            },
            // End: CompanyCode

            // Start: Plant
            // on Value Help(F4)
            onPlantValuelHelp: function () {
                if (!this.PlantFrag) {
                    this.PlantFrag = sap.ui.xmlfragment(
                        "zpro.sk.mittalcoin.exim.advance.license.advancelicense.view.fragments.View2.valueHelps.valueHelp_Plant",
                        this
                    );
                    this.getView().addDependent(this.PlantFrag);


                    var sService = "/sap/opu/odata/sap/ZRC_ADV_LIC_HEAD_SRV";
                    var oModelPlant = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.PlantFrag.setModel(oModelPlant);
                    this._PlantTemp = sap.ui
                        .getCore()
                        .byId("idSLPlantValueHelp")
                        .clone();

                }

                this.PlantFrag.open();
                var aFilter = [];
                var sPath = "/I_Plant";
                sap.ui.getCore().byId("idSDPlantF4").bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._PlantTemp,
                });


            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_Plant: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var sPath = "/I_Plant";
                var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));
                var aFilter = [];
                var oFilter = new Filter(
                    [new Filter("Plant", FilterOperator.Contains, sValue)],
                    false
                );

                aFilter.push(oFilter);
                oSelectDialog.bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._PlantTemp,
                });
            },

            // on Value Help - Confirm
            onValueHelpConfirm_Plant: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("oModelForHeader").setProperty("/Plant", sSelectedValue.toString());
            },
            // End: Plant

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

            onAddNewItem: function () {
                var JSONData = this.getView()
                    .getModel("oModelForItemTable")
                    .getData();
                var tableLen = this.getView().getModel("oModelForItemTable").getData().results.length;
                var LineNumber = 10 * (tableLen + 1);
                var payloadForItem = {
                    "Advlicno": "",
                    "Type": "",
                    "LineNumber": LineNumber.toString(),
                    "LineType": "",
                    "LineStatus": "",
                    "SionNo": "",
                    "ExportItem": "",
                    "ExportHsn": "",
                    "UnitField": "",
                    "ExportExQty": "",
                    "ExportExchangeRate": "",
                    "ImportItem": null,
                    "ImportHsn": null,
                    "ImportWastageQtyMt": null,
                    "NetContent": null,
                    "ImportQty": null,
                    "ImportRateFc": null,
                    "ImportTotalValFc": null,
                    "ImportExchangeRate": null,
                    "ImportTotalValDc": null,
                    "AssValue": null,
                    "Bcd": null,
                    "BcdVal": null,
                    "Sws": null,
                    "SwsVal": null,
                    "Igst": null,
                    "IgstVal": null,
                    "AntDempDuty": null,
                    "OtherDuty": null,
                    "Va": null,
                    "TotalDuty": null
                };

                JSONData.results.push(payloadForItem);
                this.getView()
                    .getModel("oModelForItemTable")
                    .setData(JSON.parse(JSON.stringify(JSONData)));
            },
            onDelete: function (oEvent) {

                var selectedItem = oEvent.getParameter('row').getAggregation('cells')[0].getText();

                var JSONData = this.getView().getModel("oModelForItemTable").getData();
                if (JSONData.results.length > 1) {
                    for (var i = 0; i < JSONData.results.length; i++) {
                        if (JSONData.results[i].LineNumber === selectedItem) {
                            var k = i;
                            sap.m.MessageBox.error("Delete Line Number  " + selectedItem + "?", {
                                actions: ["Delete", sap.m.MessageBox.Action.CLOSE],
                                emphasizedAction: "Delete",
                                onClose: function (sAction) {
                                    if (sAction === "Delete") {
                                        JSONData.results.splice(k, 1);
                                        for (var j = 0; j < JSONData.results.length; j++) {
                                            JSONData.results[j].LineNumber = (10 * (j + 1)).toString();
                                        }
                                        // this.getView()
                                        //     .getModel("oModelForItemTable")
                                        //     .setData(JSON.parse(JSON.stringify(JSONData)));
                                        this.getView()
                                            .getModel("oModelForItemTable")
                                            .setData(JSONData);
                                    }
                                }.bind(this)
                            })

                        }
                    }

                } else {
                    MessageBox.error("Atlease one entry is required");
                }


            },


            // All post call
            // On Create
            onCreateButtonPress: function () {
                var oModel = this.getOwnerComponent().getModel();
                var sPath = '/ZRC_ADV_LIC_HEAD'
                var payload = this.getView().getModel("oModelForHeader").getData();
                // const dt = DateFormat.getDateTimeInstance({ pattern: "PThh'H'mm'M'ss'S'" });
                // payload.CreatedAt = dt.format(new Date());

                payload.LocalLastChangedAt = ODataUtils.formatValue(new Date(), "Edm.DateTime");

                this.postCallForHeader(oModel, sPath, payload);


            },


            validation: function (headerPayload) {
                if (!headerPayload.Company) {
                    MessageBox.error("Please select Company Code");
                    return false;
                }
                else if (!headerPayload.Plant) {
                    MessageBox.error("Please enter Plant");
                    return false;
                }
                else if (!headerPayload.BondValidTo) {
                    MessageBox.error("Please enter Bond Validity To date");
                    return false;
                }
                else if (!headerPayload.MinValueAdd) {
                    MessageBox.error("Please enter Minimum value addtion %Age ");
                    return false;
                } else if (!headerPayload.AdvLicFee) {
                    MessageBox.error("Please enter Advance License Free");
                    return false;
                }

                else if (!headerPayload.BondValue) {
                    MessageBox.error("Please enter Bond Value");
                    return false;
                }
                else if (!headerPayload.DateOfIssue) {
                    MessageBox.error("Please enter Date Of Issue ");
                    return false;
                }

                else if (!headerPayload.ImpValidFrm) {
                    MessageBox.error("Please enter Import Validity From ");
                    return false;
                }
                else if (!headerPayload.ImpValidTo) {
                    MessageBox.error("Please enter Import Validity To ");
                    return false;
                }
                else if (!headerPayload.ExpValidFrm) {
                    MessageBox.error("Please enter Export Valid From ");
                    return false;
                }
                else if (!headerPayload.ExpValidTo) {
                    MessageBox.error("Please enter Export Valid TO ");
                    return false;
                }
                else if (!headerPayload.EopExtExpValidFrm) {
                    MessageBox.error("Please enter EOP Extension-Export Valid From Date ");
                    return false;
                }
                else if (!headerPayload.EopExtExpValidTo) {
                    MessageBox.error("Please enter EOP Extension-Export Valid TO Date ");
                    return false;
                }
                else if (!headerPayload.RevalidLicImpFrm) {
                    MessageBox.error("Please enter Revalidation-License Import Validity From Date ");
                    return false;
                }
                else if (!headerPayload.RevalidLicImpTo) {
                    MessageBox.error("Please enter Revalidation-License Import Validity TO Date ");
                    return false;
                }
                else if (!headerPayload.RevalidLicImpTo) {
                    MessageBox.error("Please enter Revalidation-License Import Validity TO Date ");
                    return false;
                }
                else {

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
                            var sPathItems = "/ZRC_ADV_LIC_HEAD('" + oData.Advlicno + "')/to_Item";
                            this.LcNo = oData.Advlicno;
                            for (let index = 0; index < payloadItem.length; index++) {
                                const element = payloadItem[index];
                                element.Advlicno = this.LcNo;
                            }

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
                    sap.m.MessageBox.success("Advance License " + that.LcNo + " created", {
                        actions: [sap.m.MessageBox.Action.OK],
                        emphasizedAction: "OK",
                        onClose: function (sAction) {
                            if (sAction === "OK") {
                                window.history.go(-1);
                            }
                        }
                    });
                })
                    .catch(function () {

                    })

            },
            _promisecreateCallForEachItem: function (oModel, sPath, Payload) {
                var that = this;
                // this.getView().setBusy(true);
                oModel.create(sPath, Payload, {
                    success: function (oData, response) {
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
                this.LcNo = payload.Advlicno;
                var sPath = "/ZRC_ADV_LIC_HEAD('" + payload.Advlicno + "')"
                this.updateCallForHeader(oModel, sPath, payload);
            },
            updateCallForHeader: function (oModel, sPath, payload) {
                var that = this;
                delete payload['to_item'];

                // const dt = DateFormat.getDateTimeInstance({ pattern: "PThh'H'mm'M'ss'S'" });
                // payload.CreatedAt = dt.format(new Date());
                payload.LocalLastChangedAt = ODataUtils.formatValue(new Date(), "Edm.DateTime");
                //update Call
                this.getView().setBusy(true);
                oModel.update(sPath, payload, {
                    success: function (oData, response) {

                        var aPayload = this.getView().getModel("oModelForItemTable").getData().results;
                        this.updateCallForItem(oModel, aPayload)

                    }.bind(this),
                    error: function (oError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },

            updateCallForItem: function (oModel, aPayload) {

                var that = this;
                var promise = Promise.resolve();
                aPayload.forEach(function (Payload, i) { //copy local variables
                    //Chain the promises
                    var Advlicno = that.LcNo, Type = Payload.Type, LineNumber = Payload.LineNumber, LineType = Payload.LineType;
                    var sPath = "/ZC_ADV_LIC_ITEM(Advlicno='" + Advlicno + "',Type='" + Type + "',LineNumber='" + LineNumber + "',LineType='" + LineType + "')";
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
                var that = this;
                // this.getView().setBusy(true);
                oModel.update(sPath, Payload, {
                    success: function (oData, response) {

                        sap.m.MessageBox.success("Advance License " + that.LcNo + " updated", {
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

        })
    });