sap.ui.define([
  "project1/controller/BaseController",
  "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
  "use strict";

  return BaseController.extend("project1.controller.Master", {
      onInit() {
        const oViewModel = new JSONModel({
				  currency: "EUR"
        });
        this.getView().setModel(oViewModel, "view");
      },

      onProductPress(oEvent){
        const oCtx = oEvent.getSource().getBindingContext("ODataV2")
        const sProductId = oCtx.getObject().ID
        this._showDetail(sProductId)
      },

      _showDetail(sProductId){
        this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
        this.getOwnerComponent().getRouter().navTo("object", {objectId: sProductId})
      }
  });
});