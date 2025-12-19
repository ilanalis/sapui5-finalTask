sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";

  return Controller.extend("project1.controller.BaseController", {
    onInit() {},

    getModel(oModel) {
      return this.getView().getModel(oModel);
    },

    submitODataChanges(oModel) {
      return new Promise((resolve, reject) => {
        oModel.submitChanges({
          success: resolve,
          error: reject,
        });
      });
    },
  });
});
