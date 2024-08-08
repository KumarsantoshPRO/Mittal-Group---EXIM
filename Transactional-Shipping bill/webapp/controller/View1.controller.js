sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
function (Controller,Fragment) {
    "use strict";

    return Controller.extend("zmg.pro.exim.transactionalshippingbill.exim.controller.View1", {
        onInit: function () {

        },
        onSubScreenForLicense:function(){
            var oView = this.getView();
            if (!this._oFragmentavail) {
              this._oFragmentavail = sap.ui.xmlfragment("zmg.pro.exim.transactionalshippingbill.exim.view.fragments.SubScreenForLicense", this);
              oView.addDependent(this._oFragmentavail);
            }
            this._oFragmentavail.open();
        },
        availResourceClose: function () {
            this._oFragmentavail.close();
          }
    });
});
