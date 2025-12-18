sap.ui.define([
  "project1/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
], (BaseController, JSONModel, Filter, FilterOperator) => {
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
      },

      onFilterProductsByProductName(oEvent){
        const aFilter = [];
        const sQuery = oEvent.getParameter("newValue");
        if (sQuery) {
          aFilter.push(new Filter("Name", FilterOperator.Contains, sQuery));
        }

        const oList = this.byId("ODataV2List");
        const oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);
      }
  });
});