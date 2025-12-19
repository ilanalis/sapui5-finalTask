sap.ui.define(
  [
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  (BaseController, JSONModel, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("project1.controller.Detail", {
      onInit() {
        this._oResourceBundle = this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle();
        this._oViewModel = new JSONModel({
          currency: "EUR",
          isEditMode: false,
        });
        this.getView().setModel(this._oViewModel, "view");
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("object")
          .attachPatternMatched(this._onObjectMatched, this);
      },

      _onObjectMatched(oEvent) {
        if (
          this.getModel("appView").getProperty("/layout") !==
          "MidColumnFullScreen"
        ) {
          this.getModel("appView").setProperty(
            "/layout",
            "TwoColumnsMidExpanded"
          );
        }

        var oArguments = oEvent.getParameter("arguments");
        this._sObjectId = oArguments.objectId;

        if (this._sObjectId === "new") {
          this._openCreateProduct();
          this._setTitle(this._oResourceBundle.getText("addNewProduct"));
        } else if (this._sObjectId) {
          this._openExistingProduct();
          const oCtx = this.getView().getBindingContext("ODataV2");
          const sProductName = oCtx.getProperty("Name");
          this._setTitle(sProductName);
        }
      },

      _setTitle(sTitle) {
        const oHeader = this.byId("objHeader");
        oHeader.setTitle(sTitle);
      },

      _openCreateProduct() {
        this._oViewModel.setProperty("/isEditMode", true);
        const oModel = this.getModel("ODataV2");
        const oNewProductCntx = oModel.createEntry("/Products").getPath();

        this.getView().bindElement({
          path: oNewProductCntx,
          model: "ODataV2",
        });
      },

      _openExistingProduct() {
        this._oViewModel.setProperty("/isEditMode", false);
        this.getView().bindElement({
          path: `/Products(${this._sObjectId})`,
          model: "ODataV2",
        });
      },

      onTextInputLiveChange(oEvent) {
        const oControl = oEvent.getSource();
        const sValue = oControl.getValue()?.trim();

        oControl.setValueState(sValue ? "None" : "Error");
      },

      onPriceInputLiveChange(oEvent) {
        const oControl = oEvent.getSource();
        const iValue = parseFloat(oControl.getValue());
        const bIsInputValid = iValue > 0;

        oControl.setValueState(bIsInputValid ? "None" : "Error");
      },

      onReleaseDateChange(oEvent) {
        const oControl = oEvent.getSource();
        const bIsValid = oEvent.getParameter("valid");

        oControl.setValueState(bIsValid ? "None" : "Error");
      },

      onRatingChange(oEvent) {
        const nValue = oEvent.getParameter("value");

        if (nValue < 1) {
          oEvent.getSource().setValue(1);
        }
      },

      _validateForm() {
        const aControls = sap.ui.getCore().byFieldGroupId("productUpdate");
        let bIsValid = true;

        aControls.forEach(function (oControl) {
          if (oControl.getRequired && oControl.getRequired()) {
            const sValue = oControl.getValue && oControl.getValue();

            if (!sValue) {
              oControl.setValueState("Error");
              bIsValid = false;
            } else {
              oControl.setValueState("None");
            }
          }
        });
        return bIsValid;
      },

      _resetForm() {
        const oProductForm = this.byId("productForm");
        const aInputs = oProductForm.getContent();

        aInputs.forEach(function (oControl) {
          if (oControl.getValueState) {
            oControl.setValueState("None");
          }
        });
      },

      async onAddButtonPress() {
        const oModel = this.getModel("ODataV2");

        if (!this._validateForm()) {
          return;
        }

        try {
          await oModel.submitChanges({
            success: () => {
              this._oViewModel.setProperty("/isEditMode", false);
              const oCtx = this.getView().getBindingContext("ODataV2");
              const sId = oCtx.getProperty("ID");

              this.getOwnerComponent()
                .getRouter()
                .navTo("object", { objectId: sId });
              this._showMessageToast("productCreatedSuccess");
            },
          });
        } catch (oError) {
          MessageBox.error(oError.message);
        }
      },

      _showMessageToast(sKey) {
        MessageToast.show(this._oResourceBundle.getText(sKey));
      },

      onCloseProductButtonPress() {
        this.getModel("appView").setProperty("/layout", "OneColumn");
        this.getOwnerComponent().getRouter().navTo("");
      },

      toggleFullScreen() {
        var bFullScreen = this.getModel("appView").getProperty(
          "/actionButtonsInfo/midColumn/fullScreen"
        );
        this.getModel("appView").setProperty(
          "/actionButtonsInfo/midColumn/fullScreen",
          !bFullScreen
        );
        if (!bFullScreen) {
          this.getModel("appView").setProperty(
            "/previousLayout",
            this.getModel("appView").getProperty("/layout")
          );
          this.getModel("appView").setProperty(
            "/layout",
            "MidColumnFullScreen"
          );
        } else {
          this.getModel("appView").setProperty(
            "/layout",
            this.getModel("appView").getProperty("/previousLayout")
          );
        }
      },
    });
  }
);
