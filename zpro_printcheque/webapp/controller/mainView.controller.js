sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
function (Controller, JSONModel,MessageBox) {
    "use strict";

    return Controller.extend("zmc.exim.pro.zproprintcheque.controller.mainView", {
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel();
            this.getViewDetails();
        },
        getViewDetails:function(){
            var oViewModel = new JSONModel({
                documentNumberfrm: "",
                documentNumberto: "",
                datefrm:"",
                dateto:"",
                cmpnycodefrm:"",
                cmpnycodeto:"",
                fisccalyrfrm:"",
                fiscalyrto:"",
                documenttypefrm:"",
                documenttypeto:"",
                clearbtn: false
            });
            this.getView().setModel(oViewModel,"oViewModel");//getformData

        },
        getChequeData:function(){
            var chequedata = new JSONModel();
            this.getView().setModel(chequedata,"oChequeDataModel");
            //Get Selected Values//
            var docuNumFrm = this.getView().getModel("oViewModel").getProperty("/documentNumberfrm");
            var docuNumTo = this.getView().getModel("oViewModel").getProperty("/documentNumberto");
            var dateFrm = this.getView().getModel("oViewModel").getProperty("/datefrm");
            var dateto = this.getView().getModel("oViewModel").getProperty("/dateto");
            var cmpnycdefrm = this.getView().getModel("oViewModel").getProperty("/cmpnycodefrm");
            var cmpnycdeto = this.getView().getModel("oViewModel").getProperty("/cmpnycodeto");
            var fiscyrfrm = this.getView().getModel("oViewModel").getProperty("/fisccalyrfrm");
            var fiscyrto = this.getView().getModel("oViewModel").getProperty("/fiscalyrto");
            var doctypefrm = this.getView().getModel("oViewModel").getProperty("/documenttypefrm");
            var doctypeto = this.getView().getModel("oViewModel").getProperty("/documenttypeto");
            //Setting Filter Values
            //   var CustomerCodeFilter = new sap.ui.model.Filter({
            //     path: "CustomerCode",
            //     operator: "EQ",
            //     value1: CustomerCode,
            //   });
            //   var AssignmentTypeNumFilter = new sap.ui.model.Filter({
            //     path: "AssignmentType",
            //     operator: "EQ",
            //     value1: AssignmentTypeNum,
            //   });
      
            //   var FilterArray = new Array();
            //   FilterArray.push(
            //     new sap.ui.model.Filter({
            //         filters: [
            //             new sap.ui.model.Filter("AccountingDocument", sap.ui.model.FilterOperator.GE, docuNumFrm),
            //             new sap.ui.model.Filter("AccountingDocument", sap.ui.model.FilterOperator.LE, docuNumTo),
            //             new sap.ui.model.Filter("CompanyCode", sap.ui.model.FilterOperator.GE, cmpnycdefrm),
            //             new sap.ui.model.Filter("CompanyCode", sap.ui.model.FilterOperator.LE, cmpnycdeto),
            //             new sap.ui.model.Filter("FiscalYear", sap.ui.model.FilterOperator.GE, fiscyrfrm),
            //             new sap.ui.model.Filter("FiscalYear", sap.ui.model.FilterOperator.LE, fiscyrto),
            //         ],
            //         and: true
            //     })
            // );
            // //   FilterArray.push(ProjectCodeFilter);
            // this.getView().setBusy(true);
            // this.oModel.read("/ZCDS_FI_PAY_CHEQUE_PRINT",{
            //     filters:FilterArray,
            //     success:function(oData){
            //         this.getView().getModel("oChequeDataModel").setData(oData.results);
            //         this.getView().getModel("oChequeDataModel").setSizeLimit(oData.results.length);
            //         this.getView().getModel("oChequeDataModel").getData().length;
                    
            //         this.getView().setBusy(false)
            //     }.bind(this),
            //     error:function(oError){
            //         console.log(oError)
            //         this.getView().setBusy(false);
            //     }.bind(this)
            // })

            //new try to pass filters
            var filterData = [
                { path: "AccountingDocument", operator: sap.ui.model.FilterOperator.GE, value: docuNumFrm },
                { path: "AccountingDocument", operator: sap.ui.model.FilterOperator.LE, value: docuNumTo },
                { path: "CompanyCode", operator: sap.ui.model.FilterOperator.GE, value: cmpnycdefrm },
                { path: "CompanyCode", operator: sap.ui.model.FilterOperator.LE, value: cmpnycdeto },
                { path: "FiscalYear", operator: sap.ui.model.FilterOperator.GE, value: fiscyrfrm },
                { path: "FiscalYear", operator: sap.ui.model.FilterOperator.LE, value: fiscyrto },
                { path: "AccountingDocumentItem", operator: sap.ui.model.FilterOperator.GE, value: doctypefrm },
                { path: "AccountingDocumentItem", operator: sap.ui.model.FilterOperator.LE, value: doctypeto },
                { path: "DocumentDate", operator: sap.ui.model.FilterOperator.GE, value: dateFrm },
                { path: "DocumentDate", operator: sap.ui.model.FilterOperator.LE, value: dateto },
            ];
            
            var FilterArray = filterData
                .filter(item => item.value) 
                .map(item => new sap.ui.model.Filter(item.path, item.operator, item.value));
            
            this.getView().setBusy(true);
            
            var readOptions = {
                success: function(oData) {
                    this.getView().getModel("oChequeDataModel").setData(oData.results);
                    this.getView().setBusy(false);
                }.bind(this),
                error: function(oError) {
                    console.log(oError);
                    this.getView().setBusy(false);
                }.bind(this)
            };
            
            if (FilterArray.length > 0) {
                readOptions.filters = [new sap.ui.model.Filter({ filters: FilterArray, and: true })];
            }
            
            this.oModel.read("/ZCDS_FI_PAY_CHEQUE_PRINT", readOptions);
        },
        onClearDataSearch:function(){
            var oViewModel = new JSONModel({
                documentNumberfrm: "",
                documentNumberto: "",
                datefrm:"",
                dateto:"",
                cmpnycodefrm:"",
                cmpnycodeto:"",
                fisccalyrfrm:"",
                fiscalyrto:"",
                documenttypefrm:"",
                documenttypeto:"",
            });
            this.getView().setModel(oViewModel,"oViewModel");
            this.onChequeDataSearch();
        },
        onChequeDataSearch:function(){
            var oViewModel = this.getView().getModel("oViewModel");
            var inputFields = 0;
            //GET FORM INPUTS
            var documentNumberfrm = oViewModel.getProperty("/documentNumberfrm");
            var documentNumberto = oViewModel.getProperty("/documentNumberto");
            var datefrm = oViewModel.getProperty("/datefrm");
            var dateto = oViewModel.getProperty("/dateto");
            var cmpnycodefrm = oViewModel.getProperty("/cmpnycodefrm");
            var cmpnycodeto = oViewModel.getProperty("/cmpnycodeto");
            var fisccalyrfrm = oViewModel.getProperty("/fisccalyrfrm");
            var fiscalyrto = oViewModel.getProperty("/fiscalyrto");
            var documenttypefrm = oViewModel.getProperty("/documenttypefrm");
            var documenttypeto = oViewModel.getProperty("/documenttypeto");

            //VALIDATION CODE
            // if(!documentNumberfrm){
            //     MessageBox.error("Please Fill a Document Number");
            //     inputFields =1
            // }
            // else if(!documentNumberto){
            //     MessageBox.error("Please Fill a Document Number");
            //     inputFields =1
            // }
            // else if(!datefrm){
            //     MessageBox.error("Please Select a Date");
            //     inputFields =1
            // }
            // else if(!dateto){
            //     MessageBox.error("Please Select a Date");
            //     inputFields =1
            // }
            // else if(!cmpnycodefrm){
            //     MessageBox.error("Please Fill Company code");
            //     inputFields =1
            // }
            // else if(!cmpnycodeto){
            //     MessageBox.error("Please Fill  Company code");
            //     inputFields =1
            // }
            // else if(!fisccalyrfrm){
            //     MessageBox.error("Please Select a Fiscal Year");
            //     inputFields =1
            // }
            // else if(!fiscalyrto){
            //     MessageBox.error("Please Select a Fiscal Year");
            //     inputFields =1
            // }
            // else if(!documenttypefrm){
            //     MessageBox.error("Please Fill document type");
            //     inputFields =1
            // }
            // else if(!documenttypeto){
            //     MessageBox.error("Please Fill document type");
            //     inputFields =1
            // }
            // if(inputFields>0){
            //     return;
            // }else{
            this.getChequeData();
            // }
        },
        //******PDF SECTION*****//
        onPrintCheque:function(){
            var oTable = this.getView().byId("idChequeTable");
            var selection = oTable.getSelectedItems();
            if(selection.length !==1){
                MessageBox.show("Please Select One Item to Print");
                return;
            }  else{
                this.loadPdfMakeLibrary();
                // this.downloadpdf();
            }
        },
        loadPdfMakeLibrary: function () { //load Library files for PDF 
            var oController = this;
            jQuery.sap.includeScript("https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.72/pdfmake.min.js", "pdfMakeLib", function () {
              jQuery.sap.includeScript("https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.72/vfs_fonts.js", "pdfMakeFonts", function () {
                oController.pdfMake = pdfMake;
                oController.downloadpdf();
              });
            });
          },
          downloadpdf: function () {
            var oTable = this.getView().byId("idChequeTable");
            var selection = oTable.getSelectedItems();
            // var oRequestModel = this.getView().getModel("RequestModel");
            var jsonData = selection[0].getCells();  
            var supplierName = jsonData[4].getText();
            var amnt = jsonData[3].getText();
            var dateInput = jsonData[5].getText();
            
            
        
            var docDefinition = {
                pageSize: {
                    width: 152.4,  // 6 inches in mm
                    height: 69.85  // 2¾ inches in mm
                },
                pageMargins: [5, 5, 5, 5],  // Slight margins to fit content
                content: [
                    {
                        columns: [
                            { 
                                text: '', 
                                alignment: 'center', 
                                width: '50%', 
                                fontSize: 3 
                            },
                            { 
                                text: this.convertDateToDDMMYYYY(dateInput), 
                                alignment: 'right', 
                                width: '50%', 
                                fontSize: 3 
                            }
                        ],
                        margin: [0, 0, 0, 1]  // Tighter margin between elements
                    },
                    // {
                    //     text: supplierName,
                    //     style: 'header',
                    //     alignment: 'Left',
                    //     fontSize: 3,
                    //     margin: [0, 0, 0, 1]
                    // },
                    {
                        columns: [
                            { text: '', width: 10, alignment: 'left', fontSize: 3 },
                            [
                                { text: supplierName , fontSize: 3 }
                            ],
                            
                            { text: '', alignment: 'right', fontSize: 3 },  // Amount from data
                        ],
                        margin: [0, 0, 0, 1]
                    },
                    {
                        columns: [
                            { text: '', width: 10, alignment: 'left', fontSize: 3 },
                            [
                                { text:  '' , fontSize: 3 }
                            ],
                            
                            { text: '', alignment: 'right', fontSize: 3 },  // Amount from data
                        ],
                        margin: [0, 0, 0, 1]
                    },
                    {
                        columns: [
                            { text: '' + '' + '', width: 10, alignment: 'left', fontSize: 3 },
                            [
                                {text: this.convertAmountToWords(amnt) + ' Rupees Only', fontSize: 3 }
                            ],
                            
                            { text: '', alignment: 'right', fontSize: 3 },  // Amount from data
                        ],
                        margin: [5, 0, 0, 1]
                    },
                    {
                        columns: [
                            { text: '', width: 10, alignment: 'left', fontSize: 3 },
                            [
                                { text: '', fontSize: 3 }
                            ],
                            
                            { text: amnt, alignment: 'right', fontSize: 3 },  // Amount from data
                        ],
                        margin: [0, 0, 0, 1]
                    },
                    
                ],
                styles: {
                    header: {
                        fontSize: 3,  // Smaller font size for the header
                        bold: true
                    },
                    defaultStyle: {
                        fontSize: 3  // General text font size further reduced to fit everything
                    }
                }
            };
            
            var pdfDocGenerator = this.pdfMake.createPdf(docDefinition);
            pdfDocGenerator.download("cheque.pdf");
        }
        
        ,   
            
        convertAmountToWords: function (amount) {
            var units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
            var teens = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
            var tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
            var scales = ["", "Thousand", "Lakh", "Crore"];
        
            // Function to convert three digits to words
            function convertThreeDigits(n) {
                var hundred = Math.floor(n / 100);
                var remainder = n % 100;
                var words = "";
        
                if (hundred > 0) {
                    words += units[hundred] + " Hundred ";
                }
        
                if (remainder > 10 && remainder < 20) {
                    words += teens[remainder - 11] + " ";
                } else {
                    var ten = Math.floor(remainder / 10);
                    var unit = remainder % 10;
        
                    if (ten > 0) {
                        words += tens[ten] + " ";
                    }
                    if (unit > 0) {
                        words += units[unit] + " ";
                    }
                }
        
                return words.trim();
            }
        
            // Converting the amount to an integer (ignoring any decimal points for paise)
            var rupees = Math.floor(amount);
        
            if (rupees === 0) {
                return "Zero";
            }
        
            var wordArray = [];
            var scaleIndex = 0;
        
            // Breaking rupees into groups of thousands
            while (rupees > 0) {
                var group = rupees % 1000;
                if (group > 0) {
                    var groupWords = convertThreeDigits(group);
                    wordArray.unshift(groupWords + (scales[scaleIndex] ? " " + scales[scaleIndex] : ""));
                }
                rupees = Math.floor(rupees / 1000);
                scaleIndex++;
            }
        
            var words = wordArray.join(", ");
        
            return words;
        },
        convertDateToDDMMYYYY: function (dateInput) {
            // Check if dateInput is a string, if so, convert it to a Date object
            var date;
            if (typeof dateInput === 'string') {
                date = new Date(dateInput);
            } else {
                date = dateInput; // Assuming dateInput is already a Date object
            }
        
            // Check for valid date
            if (isNaN(date.getTime())) {
                throw new Error("Invalid date");
            }
        
            // Extract day, month, and year
            var day = date.getDate();
            var month = date.getMonth() + 1; // Months are zero-indexed
            var year = date.getFullYear();
        
            // Pad day and month with leading zeros if necessary
            day = (day < 10 ? '0' : '') + day;
            month = (month < 10 ? '0' : '') + month;
        
            // Format to ddmmyyyy
            var formattedDate = day + month + year;
        
            // Add spaces between each character
            var spacedDate = formattedDate.split('').join(' ');
        
            return spacedDate;
        }
    });
});
