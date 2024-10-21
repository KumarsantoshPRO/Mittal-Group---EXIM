sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
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

],
    function (Controller, Fragment, JSONModel, Filter, FilterOperator, MenuM, MenuItemM, ColumnMenu, ActionItem, ToolbarSpacer, jQuery, Device, UI5Dat, Engine, SelectionController, SortController, GroupController, MetadataHelper, Sorter, CoreLibrary, ColumnWidthController, FilterController, Spreadsheet, exportLibrary) {
        "use strict";
        var EdmType = exportLibrary.EdmType;

        return Controller.extend("zpro.sk.mittalcoin.exim.loc.export.locexport.controller.View1", {
            onInit: function () {
                this.getCallForTable([]);
                this._registerForP13n();
                this.getOwnerComponent()
                    .getRouter()
                    .attachRoutePatternMatched(this.onRouteMatched, this);
            },

            onRouteMatched: function (oEvent) {
                this.getCallForTable([]);
            },

            // Get call for Table entries
            getCallForTable: function (aFilters) {
                var sPath = "/ZRC_LCEXP_HEAD";
                this.getView().setBusy(true);

                this.getOwnerComponent().getModel().read(sPath, {
                    filters: aFilters,
                    success: function (Data) {
                        this.getView().setModel(new JSONModel(), "oModelForTable")
                        this.getView().getModel("oModelForTable").setData(Data.results);
                        var heading = "LOC-export";
                        if (Number(Data.results.length) > 0) {
                            heading = "LOC-export items(" + Data.results.length + ")"
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
            // On Add new LOC-export
            onAddNewLOC: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("View2", {
                    LCNo: "null"
                });
            },
            // On click of LOC-export item
            onShowLCDetails: function (oEvent) {
                var sPathClickedItem, selectedRowLCNo;
                if (oEvent.getParameter('rowContext')) {
                    sPathClickedItem = oEvent.getParameter('rowContext').sPath;
                    selectedRowLCNo = this.getView().getModel('oModelForTable').getContext(sPathClickedItem).getProperty("LcNo");
                } else if (oEvent.getParameter('row')) {
                    sPathClickedItem = oEvent.getParameter('row').getRowBindingContext().sPath;
                    selectedRowLCNo = this.getView().getModel('oModelForTable').getContext(sPathClickedItem).getProperty("LcNo");
                }



                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("View2", {
                    LCNo: selectedRowLCNo
                });
            },


            // Start: Menu
            _registerForP13n: function () {
                const oTable = this.byId("table");

                this.oMetadataHelper = new MetadataHelper([{
                    key: "LcNo",
                    label: "LC Number",
                    path: "LcNo"
                },
                {
                    key: "SalesContract",
                    label: "Sales Contract",
                    path: "SalesContract"
                },
                {
                    key: "SalesOrder",
                    label: "Sales Order",
                    path: "SalesOrder   "
                },
                {
                    key: "ShipmetLastDateOri",
                    label: "Shipping Last Date - original",
                    path: "ShipmetLastDateOri"
                },
                {
                    key: "LatestDocumentDateOri",
                    label: "Latest document date - Original",
                    path: "LatestDocumentDateOri"
                }, {
                    key: "ShipmetLastDate",
                    label: "Shipment Last date",
                    path: "ShipmetLastDate"
                }, {

                    key: "ShipmetLastDateAmend",
                    label: "Shipment Last Date - Amendment",
                    path: "ShipmetLastDateAmend"
                }, {

                    key: "LatestDocumentDateAmend",
                    label: "FLatest document date - Amendment",
                    path: "LatestDocumentDateAmend"
                }, {

                    key: "LcIssueDateAmend",
                    label: "LC Issue Date - Amendment",
                    path: "LcIssueDateAmend"
                }




                ]);
                this._mIntialWidth = {

                    "LcNo": "8rem",
                    "ContractNo": "8rem",
                    "PiNo": "8rem",
                    "PiDate": "8rem",
                    "Po": "8rem",
                    "ShipmetLastDate": "8rem",
                    "PortOfLoading": "8rem",
                    "FinalIcdLocation": "8rem",
                    "LcIssuingBank": "8rem"
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
