sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";
  return Controller.extend("zgm.pro.exim.pdfprint.pdf.controller.S1", {
    onInit: function () {
      // JSON model....
      var json = new sap.ui.model.json.JSONModel(
        $.sap.getModulePath("zgm.pro.exim.pdfprint.pdf", "/model/Data.json")
      );
      // Setting model to view....
      this.getView().setModel(json, "genericAlias");
      //Alias Name = genericAlias....
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
      var wind = window.open("", "prntExample");
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
  });
});
