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
      }
  });
});