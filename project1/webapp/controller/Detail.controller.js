sap.ui.define([
  "project1/controller/BaseController",
  "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
  "use strict";

  return BaseController.extend("project1.controller.Detail", {
      onInit() {
        const oViewModel = new JSONModel({
				  currency: "EUR"
        });
        this.getView().setModel(oViewModel, "view");
        this.getOwnerComponent().getRouter().getRoute('object').attachPatternMatched(this._onObjectMatched, this)
      },

      _onObjectMatched(oEvent){
        var oArguments = oEvent.getParameter("arguments");
		    this._sObjectId = oArguments.objectId;
        if (this.getModel("appView").getProperty("/layout") !== "MidColumnFullScreen") {
          this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
        }
        this.getView().bindElement({
          path: `/Products(${this._sObjectId})`,
          model: "ODataV2",
          parameters: { expand: "Supplier" },
        });
      },

      onCloseProductButtonPress(){
        this.getModel("appView").setProperty("/layout", "OneColumn");
        this.getOwnerComponent().getRouter().navTo("")
      },

      toggleFullScreen(){
       var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
        this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
        if (!bFullScreen) {
          this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
          this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
        } else {
          this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
        }
      }
  });
});