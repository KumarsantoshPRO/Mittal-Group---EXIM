sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
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
    "sap/ui/core/format/DateFormat",

],
    function (Controller, JSONModel, Filter, FilterOperator, Engine, SelectionController, SortController, GroupController, MetadataHelper, Sorter, CoreLibrary, ColumnWidthController, FilterController, Spreadsheet, exportLibrary, DateFormat) {
        "use strict";
        var EdmType = exportLibrary.EdmType;

        return Controller.extend("zpro.sk.mittalcoin.exim.bill.of.entry.billofentry.controller.View1", {
            onInit: function () {
                this.getCallForTable([]);
                this._registerForP13n();
                this.getOwnerComponent()
                    .getRouter()
                    .attachRoutePatternMatched(this.onRouteMatched, this);

                this.getView().setModel(new JSONModel(), "oModelForFilters");
            },

            onRouteMatched: function (oEvent) {
                this.getCallForTable([]);
            },

            // Get call for Table entries
            getCallForTable: function (aFilters) {
                var sPath = "/ZRC_BOE_HEAD";
                this.getView().setBusy(true);
                this.getOwnerComponent().getModel().read(sPath, {
                    filters: aFilters,
                    success: function (Data) {
                        this.getView().setModel(new JSONModel(), "oModelForTable")
                        this.getView().getModel("oModelForTable").setData(Data.results);
                        var heading = "Bill of entry";
                        if (Number(Data.results.length) > 0) {
                            heading = "Bill of entry(" + Data.results.length + ")"
                            this.getView().byId("title").setText(heading);
                        } else {
                            this.getView().byId("title").setText(heading);
                        }
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            },


            // Excel Export
            onExport: function () {
                var aCols, oSettings;
                aCols = this.createColumnConfig();
                var aData = this.getView().getModel("oModelForTable").getData();
                const dt = DateFormat.getDateTimeInstance({ pattern: "MMM dd, yyyy" });
                // for (let index = 0; index < aData.length; index++) {
                //     aData[index].ShipmetLastDateOri = dt.format(aData[index].ShipmetLastDateOri);
                //     aData[index].LatestDocumentDateOri = dt.format(aData[index].LatestDocumentDateOri);
                //     aData[index].ShipmetLastDateAmend = dt.format(aData[index].ShipmetLastDateAmend);
                //     aData[index].LatestDocumentDateAmend = dt.format(aData[index].LatestDocumentDateAmend);
                //     aData[index].LcIssueDateAmend = dt.format(aData[index].LcIssueDateAmend);
                // }
                var sheetDetails = "BOE(" + DateFormat.getDateTimeInstance({ pattern: "MMM dd, yyyy hh:mm:ss" }).format(new Date()) + ")";
                oSettings = {
                    workbook: {
                        columns: aCols,
                        wrap: true,
                        context: {
                            application: "Bill Of Entry",
                            title: sheetDetails,
                            sheetName: "BOE items"
                        },
                    },
                    dataSource: aData,
                    fileName: sheetDetails
                };
                var oSpreadsheet = new Spreadsheet(oSettings);
                oSpreadsheet.build().finally(function () {
                    oSheet.destroy();
                });
            },

            createColumnConfig: function () {

                return [
                    {
                        label: 'Bill of Entry',
                        property: 'BillEntry'
                    },
                    {
                        label: 'Purchase Order No.',
                        property: 'PoNo'
                    },
                    {
                        label: 'Supplier Invoice No.',
                        property: 'SupplierInvoiceNo'
                    },
                    {
                        label: 'Supplier Code',
                        property: 'SupplierCode'
                    },
                    {
                        label: 'Supplier Name',
                        property: 'SupplierName'
                    },
                    {
                        label: 'BL No',
                        property: 'BlNo'
                    },
                    {
                        label: 'Shipping Line',
                        property: 'ShippingLine'
                    },
                    {
                        label: 'ICD',
                        property: 'Icd'
                    }
                ];
            },
            // All F4 calls

            // Start: AdvanceLicense
            // on Value Help(F4)
            onAdvanceLicenseValuelHelp: function () {
                if (!this.AdvanceLicenseFrag) {
                    this.AdvanceLicenseFrag = sap.ui.xmlfragment(
                        "zpro.sk.mittalcoin.exim.bill.of.entry.billofentry.view.fragments.View1.valueHelps.valueHelp_AdvanceLicense",
                        this
                    );
                    this.getView().addDependent(this.AdvanceLicenseFrag);


                    var sService = "/sap/opu/odata/sap/ZRC_ADV_LIC_HEAD_SRV";
                    var oModelAdvanceLicense = new sap.ui.model.odata.ODataModel(
                        sService,
                        true
                    );
                    this.AdvanceLicenseFrag.setModel(oModelAdvanceLicense);
                    this._AdvanceLicenseTemp = sap.ui
                        .getCore()
                        .byId("idSLAdvanceLicenseValueHelp")
                        .clone();

                }

                this.AdvanceLicenseFrag.open();
                var aFilter = [];
                var sPath = "/ZRC_ADV_LIC_HEAD";
                sap.ui.getCore().byId("idSDAdvanceLicenseF4").bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._AdvanceLicenseTemp,
                });


            },

            // on Value Help - Search/liveChange
            onValueHelpSearch_AdvanceLicense: function (oEvent) {
                var aFilter = [];
                var sValue = oEvent.getParameter("value");
                var sPath = "/ZRC_ADV_LIC_HEAD";
                var oSelectDialog = sap.ui.getCore().byId(oEvent.getParameter("id"));
                var aFilter = [];
                var oFilter = new Filter(
                    [new Filter("Advlicno", FilterOperator.Contains, sValue)],
                    false
                );

                aFilter.push(oFilter);
                oSelectDialog.bindAggregation("items", {
                    path: sPath,
                    filters: aFilter,
                    template: this._AdvanceLicenseTemp,
                });
            },

            // on Value Help - Confirm
            onValueHelpConfirm_AdvanceLicense: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    sSelectedValue = oSelectedItem.getProperty("title");
                this.getView().getModel("oModelForFilters").setProperty("/Advlicno", sSelectedValue.toString());
            },
            // End: AdvanceLicense

            // Start: CompanyCode
            // on Value Help(F4)
            onCompanyCodeValuelHelp: function () {
                if (!this.CompanyCodeFrag) {
                    this.CompanyCodeFrag = sap.ui.xmlfragment(
                        "zpro.sk.mittalcoin.exim.bill.of.entry.billofentry.view.fragments.View1.valueHelps.valueHelp_CompanyCode",
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
                this.getView().getModel("oModelForFilters").setProperty("/CompanyCode", sSelectedValue.toString());
            },
            // End: CompanyCode

            // Start: Plant
            // on Value Help(F4)
            onPlantValuelHelp: function () {
                if (!this.PlantFrag) {
                    this.PlantFrag = sap.ui.xmlfragment(
                        "zpro.sk.mittalcoin.exim.bill.of.entry.billofentry.view.fragments.View1.valueHelps.valueHelp_Plant",
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
                this.getView().getModel("oModelForFilters").setProperty("/Plant", sSelectedValue.toString());
            },
            // End: Plant
            // On filter search
            onSearch: function () {
                var Advlicno = this.getView().getModel("oModelForFilters").getProperty("/Advlicno"),
                    Plant = this.getView().getModel("oModelForFilters").getProperty("/Plant"),
                    CompanyCode = this.getView().getModel("oModelForFilters").getProperty("/CompanyCode");
                var aFilters = [];
                if (Advlicno) {
                    var oFilterAdvlicno = new Filter({
                        path: 'Advlicno',
                        operator: FilterOperator.EQ,
                        value1: Advlicno
                    });
                    aFilters.push(oFilterAdvlicno);
                }
                if (Plant) {
                    var oFilterPlant = new Filter({
                        path: 'Plant',
                        operator: FilterOperator.EQ,
                        value1: Plant
                    });
                    aFilters.push(oFilterPlant);
                }
                if (CompanyCode) {
                    var oFilterCompanyCode = new Filter({
                        path: 'Company',
                        operator: FilterOperator.EQ,
                        value1: CompanyCode
                    });
                    aFilters.push(oFilterCompanyCode);
                }

                var aFilter = new Filter({
                    filters: aFilters,
                    and: true
                });

                this.getCallForTable([aFilter]);

            },

            // On Add new Bill of entry
            onAddNewLOC: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("View2", {
                    LCNo: "null"
                });
            },

            // On click of Bill of entry item
            onShowLCDetails: function (oEvent) {
                var sPathClickedItem, selectedRowLCNo;
                if (oEvent.getParameter('rowContext')) {
                    sPathClickedItem = oEvent.getParameter('rowContext').sPath;
                    selectedRowLCNo = this.getView().getModel('oModelForTable').getContext(sPathClickedItem).getProperty("Advlicno");
                } else if (oEvent.getParameter('row')) {
                    sPathClickedItem = oEvent.getParameter('row').getRowBindingContext().sPath;
                    selectedRowLCNo = this.getView().getModel('oModelForTable').getContext(sPathClickedItem).getProperty("Advlicno");
                }

                this.oRouter = this.getOwnerComponent().getRouter();
                if (selectedRowLCNo) {
                    this.oRouter.navTo("View2", {
                        LCNo: selectedRowLCNo
                    });
                }

            },


            // Start: Menu
            _registerForP13n: function () {
                const oTable = this.byId("table");

                this.oMetadataHelper = new MetadataHelper([{
                    key: "BillEntry",
                    label: "Bill of entry",
                    path: "BillEntry"
                },
                {
                    key: "PoNo",
                    label: "Purchase order no",
                    path: "PoNo"
                },
                {
                    key: "SupplierInvoiceNo",
                    label: "Supplier Invoice No",
                    path: "SupplierInvoiceNo   "
                },
                {
                    key: "SupplierCode",
                    label: "Supplier Code",
                    path: "SupplierCode"
                },
                {
                    key: "SupplierName",
                    label: "Supplier Name",
                    path: "SupplierName"
                }, {
                    key: "BlNo",
                    label: "BL No",
                    path: "BlNo"
                }, {

                    key: "ShippingLine",
                    label: "Shipping Line",
                    path: "ShippingLine"
                }, {

                    key: "Icd",
                    label: "ICD",
                    path: "Icd"
                }



                ]);
                this._mIntialWidth = {

                    "BillEntry": "8rem",
                    "PoNo": "8rem",
                    "SupplierInvoiceNo": "8rem",
                    "SupplierCode": "8rem",
                    "SupplierName": "8rem",
                    "BlNo": "8rem",
                    "ShippingLine": "8rem",
                    "Icd": "8rem"
                };
                Engine.getInstance().register(oTable, {
                    helper: this.oMetadataHelper,
                    controller: {
                        Columns: new SelectionController({
                            targetAggregation: "columns",
                            control: oTable
                        }),
                        Sorter: new SortController({
                            control: oTable
                        }),
                        Groups: new GroupController({
                            control: oTable
                        }),
                        ColumnWidth: new ColumnWidthController({
                            control: oTable
                        }),
                        Filter: new FilterController({
                            control: oTable
                        })
                    }
                });

                Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
            },

            openPersoDialog: function (oEvt) {
                this._openPersoDialog(["Columns", "Sorter", "Groups", "Filter"], oEvt.getSource());
            },

            _openPersoDialog: function (aPanels, oSource) {
                var oTable = this.byId("table");

                Engine.getInstance().show(oTable, aPanels, {
                    contentHeight: aPanels.length > 1 ? "50rem" : "35rem",
                    contentWidth: aPanels.length > 1 ? "45rem" : "32rem",
                    source: oSource || oTable
                });
            },
            openPersoDialog: function (oEvt) {
                const oTable = this.byId("table");

                Engine.getInstance().show(oTable, ["Columns", "Sorter", "Groups", "Filter"], {
                    contentHeight: "35rem",
                    contentWidth: "32rem",
                    source: oEvt.getSource()
                });
            },

            onColumnHeaderItemPress: function (oEvt) {
                const oTable = this.byId("table");


                var sPanel;


                if (oEvt.getSource().getIcon().indexOf("sort") >= 0) {
                    sPanel = "Sorter"
                } else if (oEvt.getSource().getIcon().indexOf("columns") >= 0) {
                    sPanel = "Columns"
                } else if (oEvt.getSource().getIcon().indexOf("groups") >= 0) {
                    sPanel = "Groups"
                } else if (oEvt.getSource().getIcon().indexOf("filter") >= 0) {
                    sPanel = "Filter"
                }

                Engine.getInstance().show(oTable, [sPanel], {
                    contentHeight: "35rem",
                    contentWidth: "32rem",
                    source: oTable
                });
            },

            onSort: function (oEvt) {
                const oTable = this.byId("table");
                const sAffectedProperty = this._getKey(oEvt.getParameter("column"));
                const sSortOrder = oEvt.getParameter("sortOrder");

                //Apply the state programatically on sorting through the column menu
                //1) Retrieve the current personalization state
                Engine.getInstance().retrieveState(oTable).then(function (oState) {

                    //2) Modify the existing personalization state --> clear all sorters before
                    oState.Sorter.forEach(function (oSorter) {
                        oSorter.sorted = false;
                    });
                    oState.Sorter.push({
                        key: sAffectedProperty,
                        descending: sSortOrder === CoreLibrary.SortOrder.Descending
                    });

                    //3) Apply the modified personalization state to persist it in the VariantManagement
                    Engine.getInstance().applyState(oTable, oState);
                });
            },

            onColumnMove: function (oEvt) {
                const oTable = this.byId("table");
                const oAffectedColumn = oEvt.getParameter("column");
                const iNewPos = oEvt.getParameter("newPos");
                const sKey = this._getKey(oAffectedColumn);
                oEvt.preventDefault();

                Engine.getInstance().retrieveState(oTable).then(function (oState) {

                    const oCol = oState.Columns.find(function (oColumn) {
                        return oColumn.key === sKey;
                    }) || {
                        key: sKey
                    };
                    oCol.position = iNewPos;

                    Engine.getInstance().applyState(oTable, {
                        Columns: [oCol]
                    });
                });
            },

            _getKey: function (oControl) {
                return this.getView().getLocalId(oControl.getId());
            },

            handleStateChange: function (oEvt) {
                const oTable = this.byId("table");
                const oState = oEvt.getParameter("state");

                if (!oState) {
                    return;
                }

                oTable.getColumns().forEach(function (oColumn) {

                    const sKey = this._getKey(oColumn);
                    const sColumnWidth = oState.ColumnWidth[sKey];

                    oColumn.setWidth(sColumnWidth || this._mIntialWidth[sKey]);

                    oColumn.setVisible(false);
                    oColumn.setSortOrder(CoreLibrary.SortOrder.None);
                }.bind(this));

                oState.Columns.forEach(function (oProp, iIndex) {
                    const oCol = this.byId(oProp.key);
                    oCol.setVisible(true);

                    oTable.removeColumn(oCol);
                    oTable.insertColumn(oCol, iIndex);
                }.bind(this));

                const aSorter = [];
                oState.Sorter.forEach(function (oSorter) {
                    const oColumn = this.byId(oSorter.key);
                    /** @deprecated As of version 1.120 */
                    oColumn.setSorted(true);
                    oColumn.setSortOrder(oSorter.descending ? CoreLibrary.SortOrder.Descending : CoreLibrary.SortOrder.Ascending);
                    aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oSorter.key).path, oSorter.descending));
                }.bind(this));
                oTable.getBinding("rows").sort(aSorter);
            },

            onColumnResize: function (oEvt) {
                const oColumn = oEvt.getParameter("column");
                const sWidth = oEvt.getParameter("width");
                const oTable = this.byId("table");

                const oColumnState = {};
                oColumnState[this._getKey(oColumn)] = sWidth;

                Engine.getInstance().applyState(oTable, {
                    ColumnWidth: oColumnState
                });
            },
            // End: Menu
        });
    });
