sap.ui.define([
  "project1/controller/BaseController",
  "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
  "use strict";

  return BaseController.extend("project1.controller.App", {
      onInit() {
        const oViewModel = new JSONModel({
				  layout : "OneColumn",
				  previousLayout : "",
          actionButtonsInfo : {
					midColumn : {
						fullScreen : false
					}
				}
			  });
        this.getView().setModel(oViewModel, "appView");
      }
  });
});