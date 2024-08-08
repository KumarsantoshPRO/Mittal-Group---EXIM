sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";
  return Controller.extend("zgm.pro.exim.pdfprint.pdf.controller.S1", {
    onInit: function () {
      // JSON model....
      var json = new sap.ui.model.json.JSONModel($.sap.getModulePath("zgm.pro.exim.pdfprint.pdf", "/model/Data.json"));
      // Setting model to view....
      this.getView().setModel(json, 'genericAlias');
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
      var headertable1 = "<table  border='1' style='margin-top:150px;width: 1000px;' align='center'>" +
        "<caption style='color:green;font-weight: bold;font-size: large;'>Student Details</caption>" +
        "<tr><th style='color:green'>Document Number</th>" +
        "<th style='color:green'>Company Name</th>" +
        "<th style='color:green'>Company Code</th>" +
        "<th style='color:green'>Year</th>" +
        "<th style='color:green'>Amount</th></tr>";
      //Adding row dynamically to student table....
      for (var i = 0; i < modelData.studentDetails.length; i++) {
        headertable1 += "<tr>" +
          "<td> " + modelData.studentDetails[i].stuId + "</td>" +
          "<td>  " + modelData.studentDetails[i].stuName + "  </td>" +


          "<td>  " + modelData.studentDetails[i].stuMobNo + "  </td>" +
          "<td>  " + modelData.studentDetails[i].stuEmail + "  </td>" +
          "<td>  " + modelData.studentDetails[i].stuStand + "  </td>" +
          "</tr>";
      }
      headertable1 += "</table>";
      // fullHtml += headertable1;
      // Making branch table....
      var headertable2 = "<table  border='1' style='margin-top:50px;width: 1000px;' align='center'>" +
        "<caption style='color:green;font-weight: bold;font-size: large;'>Branch Details</caption>" +
        "<tr><th style='color:green'>Item</th>" +
        "<th style='color:green'>Item Text</th>" +
        "<th style='color:green'>Account</th>" +
        "<th style='color:green'>Description</th>" +
        "<th style='color:green'>Amount</th>" +
        "<th style='color:green'>Currency</th>" +
        "<th style='color:green'>Clearing Doc</th></tr>";
      //Adding row dynamically to branch table....
      for (var j = 0; j < modelData.branchDetails.length; j++) {
        headertable2 += "<tr>" +
          "<td> " + modelData.branchDetails[j].BRCode + "</td>" +
          "<td>  " + modelData.branchDetails[j].BRPRName + "  </td>" +
          "<td>  " + modelData.branchDetails[j].Location + "  </td>" +
          "<td>  " + modelData.branchDetails[j].Email + "  </td>" +
          "<td>  " + modelData.branchDetails[j].TelephoneNo + "  </td>" +
          "</tr>";
      }
      headertable2 += "</table>";
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
      var modulePath = $.sap.getModulePath("zgm.pro.exim.pdfprint.pdf", "/image/");
      modulePath = modulePath + "logo.jpg";
      return "<h1 style='text-align:center'> Mittal Coins <Img  src=" + modulePath + " style='margin-left:60rem' width='100px' height='80px'/> <br/> <h2 style='text-align:center'>Unnamed Road, Pithampur Industrial Area, Khandwa, Madhya Pradesh 454774 </h2> </h1>" + 
        " </div> <hr/><div>" +
        "<div style=float:left>" +
        "<p>Document Number        : " + modelData.scName + "</p>" +
        "<p>Document Date        : " + modelData.ownName + "</p>" +

        "<p>Currency     : " + modelData.ownMail + "</p>" +
        "</div><div style=float:right>" +
        "<p>Fiscal Year    : " + modelData.ownMobile + "</p>" +
        "<p>Period      : " + modelData.ownStatus + "</p>" +
        "<p>Company Code    : " + modelData.scaddress + "</p>" +
        "</div></div>";
    }
  });
});
