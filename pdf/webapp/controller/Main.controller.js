sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/m/Menu",
    "sap/m/MenuItem",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/Element",
    "sap/m/table/columnmenu/MenuBase",
    "sap/m/table/columnmenu/Menu",
    "sap/m/table/columnmenu/QuickSort",
    "sap/m/table/columnmenu/QuickSortItem",
  ],
  function (
    Controller,
    Device,
    Filter,
    Sorter,
    JSONModel,
    Menu,
    MenuItem,
    MessageToast,
    Fragment,
    Element,
    MenuBase,
    ColumnMenu,
    QuickSort,
    QuickSortItem
  ) {
    "use strict";
    /**
     * Constructor for a new Menu adapter that implements the IColumnHeaderMenu interface.
     */
    var CustomMenuAdapter = MenuBase.extend("MenuToColumnMenuAdapter", {
      metadata: {
        aggregations: {
          menu: { type: "sap.m.Menu", multiple: false },
        },
      },
    });

    /**
     * Opens the menu at the specific target element.
     *
     * @param {sap.ui.core.Control | HTMLElement} oAnchor This is the control or HTMLElement where the menu is placed.
     */
    CustomMenuAdapter.prototype.openBy = function (oAnchor) {
      const oMenu = this.getMenu();
      const fnResetBlocked = () => {
        if (this._blocked) {
          clearTimeout(this._blocked);
          this._blocked = null;
        }
      };

      if (
        !oMenu ||
        ((this.isOpen() || this._blocked) && oAnchor === this._oIsOpenBy)
      ) {
        fnResetBlocked();
        return;
      }

      fnResetBlocked();

      var oControl = oAnchor;
      if (!(oAnchor instanceof Element)) {
        oControl = Element.closestTo(oAnchor, true);
      }

      if (!this.fireBeforeOpen({ openBy: oControl })) {
        return;
      }

      // On click outside the menu, the sap.m.Menu closes automatically
      // to prevent reopening on column header click, we need to block the openBy call for a short time (200ms)
      oMenu.attachEventOnce("closed", () => {
        fnResetBlocked();
        this._blocked = setTimeout(fnResetBlocked, 200);
        this.fireAfterClose();
      });

      oMenu.openBy(oAnchor);
      this._oIsOpenBy = oAnchor;
    };

    /**
     * Determines whether the menu is open.
     *
     * @returns {boolean} Whether the menu is open.
     */
    CustomMenuAdapter.prototype.isOpen = function () {
      return this.getMenu()?.isOpen() || false;
    };

    /**
     * Closes the menu.
     */
    CustomMenuAdapter.prototype.close = function () {
      this.getMenu()?.close();
    };

    /**
     * Returns the type of the menu.
     *
     * @returns {sap.ui.core.aria.HasPopup} Type of the menu
     * @public
     */
    CustomMenuAdapter.prototype.getAriaHasPopupType = function () {
      return "Menu";
    };

    return Controller.extend("zgm.pro.exim.pdfprint.pdf.controller.S1", {
      onInit: function () {
        // JSON model....
        var json = new sap.ui.model.json.JSONModel(
          $.sap.getModulePath("zgm.pro.exim.pdfprint.pdf", "/model/Data.json")
        );
        // Setting model to view....
        this.getView().setModel(json, "genericAlias");
        //Alias Name = genericAlias....

        var oView = this.getView();

        // Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
        this._mViewSettingsDialogs = {};

        this.mGroupFunctions = {
          SupplierName: function (oContext) {
            var name = oContext.getProperty("SupplierName");
            return {
              key: name,
              text: name,
            };
          },
          Price: function (oContext) {
            var price = oContext.getProperty("Price");
            var currencyCode = oContext.getProperty("CurrencyCode");
            var key, text;
            if (price <= 100) {
              key = "LE100";
              text = "100 " + currencyCode + " or less";
            } else if (price <= 1000) {
              key = "BT100-1000";
              text = "Between 100 and 1000 " + currencyCode;
            } else {
              key = "GT1000";
              text = "More than 1000 " + currencyCode;
            }
            return {
              key: key,
              text: text,
            };
          },
        };

        Fragment.load({
          id: this.getView().getId(),
          name: "zgm.pro.exim.pdfprint.pdf.view.fragments.ColumnMenu",
          controller: this,
        }).then(function (oMenu) {
          oView.addDependent(oMenu);
          return oMenu;
        });

        this.createHeaderMenus();
      },

      createHeaderMenus: function () {
        const oTable = this.getView().byId("idTableDocumentDetails");
        const aColumns = oTable.getColumns();
        const oColumnDocNo = aColumns[0];
        const oColumnCompany = aColumns[1];
        const oColumnYear = aColumns[2];
        const oColumnAmount = aColumns[3];

        var customMenuSort = new CustomMenuAdapter({
          menu: new Menu({
            items: [
              new MenuItem({
                icon: "sap-icon://sort-ascending",
                text: "Sort Ascending",
                press: function () {
                  const oBinding = oTable.getBinding("items");
                  oBinding.sort([new Sorter("Price", false)]);
                  oColumnPrice.setSortIndicator("Ascending");
                  oColumnProduct
                    .getHeaderMenuInstance()
                    .getQuickActions()[0]
                    .getItems()[0]
                    .setSortOrder("None");
                  oColumnProduct.setSortIndicator("None");
                },
              }),
              new MenuItem({
                icon: "sap-icon://sort-descending",
                text: "Sort Descending",
                press: function () {
                  const oBinding = oTable.getBinding("items");
                  oBinding.sort([new Sorter("Price", true)]);
                  oColumnPrice.setSortIndicator("Descending");
                  oColumnProduct
                    .getHeaderMenuInstance()
                    .getQuickActions()[0]
                    .getItems()[0]
                    .setSortOrder("None");
                  oColumnProduct.setSortIndicator("None");
                },
              }),
            ],
          }),
        });

        var customMenuSortYear = new CustomMenuAdapter({
          menu: new Menu({
            items: [
              new MenuItem({
                icon: "sap-icon://sort-ascending",
                text: "Sort Ascending",
                press: function () {
                  const oBinding = oTable.getBinding("items");
                  oBinding.sort([new Sorter("Price", false)]);
                  oColumnPrice.setSortIndicator("Ascending");
                  oColumnProduct
                    .getHeaderMenuInstance()
                    .getQuickActions()[0]
                    .getItems()[0]
                    .setSortOrder("None");
                  oColumnProduct.setSortIndicator("None");
                },
              }),
              new MenuItem({
                icon: "sap-icon://sort-descending",
                text: "Sort Descending",
                press: function () {
                  const oBinding = oTable.getBinding("items");
                  oBinding.sort([new Sorter("Price", true)]);
                  oColumnPrice.setSortIndicator("Descending");
                  oColumnProduct
                    .getHeaderMenuInstance()
                    .getQuickActions()[0]
                    .getItems()[0]
                    .setSortOrder("None");
                  oColumnProduct.setSortIndicator("None");
                },
              }),
              new MenuItem({
                icon: "sap-icon://group-2",
                text: "Group",
                press: function () {
                  var oBinding = oTable.getBinding("items");
                  if (!oBinding.isGrouped()) {
                    oBinding.sort([
                      new Sorter("year", false, function (oContext) {
                        return {
                          key: oContext.getProperty("year"),
                          text: oContext.getProperty("year"),
                        };
                      }),
                    ]);
                  } else {
                    oBinding.sort([]);
                  }
                  oColumnProduct
                    .getHeaderMenuInstance()
                    .getQuickActions()[0]
                    .getItems()[0]
                    .setSortOrder("None");
                  oColumnProduct.setSortIndicator("None");
                  oColumnPrice.setSortIndicator("None");
                },
              }),
            ],
          }),
        });

        var customMenuGroup = new CustomMenuAdapter({
          menu: new Menu({
            items: [
              new MenuItem({
                icon: "sap-icon://group-2",
                text: "Group",
                press: function () {
                  var oBinding = oTable.getBinding("items");
                  if (!oBinding.isGrouped()) {
                    oBinding.sort([
                      new Sorter("companyCode", false, function (oContext) {
                        return {
                          key: oContext.getProperty("companyCode"),
                          text: oContext.getProperty("companyCode"),
                        };
                      }),
                    ]);
                  } else {
                    oBinding.sort([]);
                  }
                  oColumnProduct
                    .getHeaderMenuInstance()
                    .getQuickActions()[0]
                    .getItems()[0]
                    .setSortOrder("None");
                  oColumnProduct.setSortIndicator("None");
                  oColumnPrice.setSortIndicator("None");
                },
              }),
            ],
          }),
        });

        oColumnDocNo.setHeaderMenu(customMenuSort);
        oColumnYear.setHeaderMenu(customMenuSortYear);
        oColumnAmount.setHeaderMenu(customMenuSort);

        oColumnCompany.setHeaderMenu(customMenuGroup);
      },

      // When you click on 'Print' button then this method will call....
      handlePrint: function (oEvent) {
        var modelData = this.getView().getModel("genericAlias").getData();
        var fullHtml = "";
        //Calling method....
        var header = this.getHeaderForm(modelData);
        fullHtml += header;
        //Making student table....
        var headertable1 =
          "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
          "<caption style='color:green;font-weight: bold;font-size: large;'>Student Details</caption>" +
          "<tr><th style='color:green'>Document Number</th>" +
          "<th style='color:green'>Company Name</th>" +
          "<th style='color:green'>Company Code</th>" +
          "<th style='color:green'>Year</th>" +
          "<th style='color:green'>Amount</th></tr>";
        //Adding row dynamically to student table....
        for (var i = 0; i < modelData.items.length; i++) {
          headertable1 +=
            "<tr>" +
            "<td> " +
            modelData.items[i].documentNumber +
            "</td>" +
            "<td>  " +
            modelData.items[i].companyCode +
            "  </td>" +
            "<td>  " +
            modelData.items[i].year +
            "  </td>" +
            "<td>  " +
            modelData.items[i].amount +
            "  </td>" +
            "</tr>";
        }
        headertable1 += "</table>";
        // fullHtml += headertable1;
        // Making branch table....
        var headertable2 =
          "<table  border='1' style='margin-top:50px;width: 1000px;' align='center'>" +
          "<caption style='color:green;font-weight: bold;font-size: large;'>Details</caption>" +
          "<tr><th style='color:green'>Item</th>" +
          "<th style='color:green'>Item Text</th>" +
          "<th style='color:green'>Account</th>" +
          "<th style='color:green'>Description</th>" +
          "<th style='color:green'>Amount</th>" +
          "<th style='color:green'>Currency</th>" +
          "<th style='color:green'>Clearing Doc</th></tr>";
        //Adding row dynamically to branch table....
        for (var j = 0; j < modelData.details.length; j++) {
          headertable2 +=
            "<tr>" +
            "<td> " +
            modelData.details[j].Item +
            "</td>" +
            "<td>  " +
            modelData.details[j].ItemText +
            "  </td>" +
            "<td>  " +
            modelData.details[j].Account +
            "  </td>" +
            "<td>  " +
            modelData.details[j].Description +
            "  </td>" +
            "<td>  " +
            modelData.details[j].Amount +
            "  </td>" +
            "<td>  " +
            modelData.details[j].Currency +
            "  </td>" +
            "<td>  " +
            modelData.details[j].ClearingDoc +
            "  </td>" +
            "</tr>";
        }
        headertable2 += "</table>";

        var signature =
          "<div style='position: absolute; width: 900px; height: 800px;'>" +
          "<p style='position: absolute; bottom: 6px; left: 0px; background-color: black'>" +
          "Receiver's Signature" +
          "<br/><br/><br/>Prepared By" +
          "<br/><br/><br/>Checked By " +
          "</p>" +
          "<p style='position: absolute; bottom: 6px; right: 0px; background-color: black'>" +
          "Authorized Signature" +
          "<br/><br/><br/>Verified By " +
          "</p>" +
          "</div>";

        headertable2 += signature;

        fullHtml += headertable2;
        // window.open(URL, name, specs, replace)
        var wind = window.open("", "  ");
        wind.document.write(fullHtml);
        setTimeout(function () {
          wind.print();
          wind.close();
        }, 1000);
      },

      //Returing header data(Called method)....
      getHeaderForm: function (modelData) {
        var modulePath = $.sap.getModulePath(
          "zgm.pro.exim.pdfprint.pdf",
          "/image/"
        );
        modulePath = modulePath + "logo.jpg";
        return (
          "<span style='display: flex; justify-content: center'>Mittal Coins</span>" +
          "<span style='display: flex; justify-content: center'>Addess</span>" +
          "<Img  src=" +
          modulePath +
          " style='margin-left:60rem' width='100px' height='80px'/> " +
          " </div> <hr/><div>" +
          "<div style=float:left>" +
          "<p>Document Number        : " +
          modelData.documentNumber +
          "</p>" +
          "<p>Document Date        : " +
          modelData.documentDate +
          "</p>" +
          "<p>Currency     : " +
          modelData.currency +
          "</p>" +
          "</div><div style=float:right>" +
          "<p>Fiscal Year    : " +
          modelData.fiscalYear +
          "</p>" +
          "<p>Period      : " +
          modelData.period +
          "</p>" +
          "<p>Company Code    : " +
          modelData.companyCode +
          "</p>" +
          "</div></div>"
        );
      },

      resetGroupDialog: function (oEvent) {
        this.groupReset = true;
      },

      getViewSettingsDialog: function (sDialogFragmentName) {
        var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

        if (!pDialog) {
          pDialog = Fragment.load({
            id: this.getView().getId(),
            name: sDialogFragmentName,
            controller: this,
          }).then(function (oDialog) {
            if (Device.system.desktop) {
              oDialog.addStyleClass("sapUiSizeCompact");
            }
            return oDialog;
          });
          this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
        }
        return pDialog;
      },
      onShowDocumentItems: function () {
        var that = this;
        this.getViewSettingsDialog(
          "zgm.pro.exim.pdfprint.pdf.view.fragments.ShowDocumentItems"
        ).then(function (oViewSettingsDialog) {
          oViewSettingsDialog.setModel(
            that.getView().getModel("genericAlias"),
            "genericAlias"
          );
          oViewSettingsDialog.open();
        });
      },
      onBack: function () {
        this.getViewSettingsDialog(
          "zgm.pro.exim.pdfprint.pdf.view.fragments.ShowDocumentItems"
        ).then(function (oViewSettingsDialog) {
          oViewSettingsDialog.close();
        });
      },
      handleMultiSelectButtonPressed: function () {
        var oTable = this.getView().byId("idTableDocumentDetails"),
          oBtnShowDocItems = this.getView().byId("idBtnShowDocItems"),
          oBtnClearSelection = this.getView().byId("idBtnClearSelection");

        if (oTable.getMode() === "None") {
          oTable.setMode("MultiSelect");
          oBtnClearSelection.setVisible(true);
          oBtnShowDocItems.setVisible(true);
        } else {
          oTable.setMode("None");
          oBtnClearSelection.setVisible(false);
          oBtnShowDocItems.setVisible(false);
        }
      },

      onDPTStateChange: function (oEvent) {
        var obtnDTPFilterGo = this.getView().byId("idBtnDPTFilterGo"),
          obtnDTPFilterClear = this.getView().byId("idBtnDPTFilterClear");
        if (oEvent.getParameter("isExpanded")) {
          obtnDTPFilterGo.setVisible(true);
          obtnDTPFilterClear.setVisible(true);
        } else {
          obtnDTPFilterGo.setVisible(false);
          obtnDTPFilterClear.setVisible(false);
        }
      },
      handleSortButtonPressed: function () {
        this.getViewSettingsDialog(
          "zgm.pro.exim.pdfprint.pdf.view.fragments.SortDialog"
        ).then(function (oViewSettingsDialog) {
          oViewSettingsDialog.open();
        });
      },

      handleFilterButtonPressed: function () {
        this.getViewSettingsDialog(
          "zgm.pro.exim.pdfprint.pdf.view.fragments.FilterDialog"
        ).then(function (oViewSettingsDialog) {
          oViewSettingsDialog.open();
        });
      },

      handleGroupButtonPressed: function () {
        this.getViewSettingsDialog(
          "zgm.pro.exim.pdfprint.pdf.view.fragments.GroupDialog"
        ).then(function (oViewSettingsDialog) {
          oViewSettingsDialog.open();
        });
      },

      handleSortDialogConfirm: function (oEvent) {
        var oTable = this.byId("idProductsTable"),
          mParams = oEvent.getParameters(),
          oBinding = oTable.getBinding("items"),
          sPath,
          bDescending,
          aSorters = [];

        sPath = mParams.sortItem.getKey();
        bDescending = mParams.sortDescending;
        aSorters.push(new Sorter(sPath, bDescending));

        // apply the selected sort and group settings
        oBinding.sort(aSorters);
      },

      handleFilterDialogConfirm: function (oEvent) {
        var oTable = this.byId("idProductsTable"),
          mParams = oEvent.getParameters(),
          oBinding = oTable.getBinding("items"),
          aFilters = [];

        mParams.filterItems.forEach(function (oItem) {
          var aSplit = oItem.getKey().split("___"),
            sPath = aSplit[0],
            sOperator = aSplit[1],
            sValue1 = aSplit[2],
            sValue2 = aSplit[3],
            oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
          aFilters.push(oFilter);
        });

        // apply filter settings
        oBinding.filter(aFilters);

        // update filter bar
        this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
        this.byId("vsdFilterLabel").setText(mParams.filterString);
      },

      handleGroupDialogConfirm: function (oEvent) {
        var oTable = this.byId("idProductsTable"),
          mParams = oEvent.getParameters(),
          oBinding = oTable.getBinding("items"),
          sPath,
          bDescending,
          vGroup,
          aGroups = [];

        if (mParams.groupItem) {
          sPath = mParams.groupItem.getKey();
          bDescending = mParams.groupDescending;
          vGroup = this.mGroupFunctions[sPath];
          aGroups.push(new Sorter(sPath, bDescending, vGroup));
          // apply the selected group settings
          oBinding.sort(aGroups);
        } else if (this.groupReset) {
          oBinding.sort();
          this.groupReset = false;
        }
      },

      onActionItemPress: function () {
        MessageToast.show("Action Item Pressed");
      },
    });
  }
);
