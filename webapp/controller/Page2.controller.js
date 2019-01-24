sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";
   
	return BaseController.extend("com.sap.build.standard.untitledPrototype.controller.Page2", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App5c404e36a812130111d6a15e";
     
			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		onDelete: function(){
		
		var oEntry = {};
		
		var oBindingContext = this.getView().getBindingContext();
		var oModel = this.getView().getModel();
		
		oEntry.CustId = oBindingContext.getProperty("CustId");
		oEntry.TelNum = oBindingContext.getProperty("TelNum");
  //      oEntry.CustName = oBindingContext.getProperty("CustName");
		// oEntry.CustSur = oBindingContext.getProperty("CustSur");
		// oEntry.CustAdd = oBindingContext.getProperty("CustAdd");
		// oEntry.CustCity = oBindingContext.getProperty("CustCity");
		// oEntry.CustProv = oBindingContext.getProperty("CustProv");
		// oEntry.CustCAP = oBindingContext.getProperty("CustCAP");
		// oEntry.CustStat = oBindingContext.getProperty("CustStat");
		
		
		// oModel.remove('/AnagraficaSet',oEntry,null,this.onCreateOk,this.onCreateKo);
		
		var sPath = oBindingContext.getPath();
		oModel.remove(sPath,{success:this.onCreateOk(),error:this.onCreateKo});
		
			
		},
		  onCreateOk: function(oEvent) {
   	var msg = 'Eliminato';
   	var that = this;
   	// MessageBox.show(msg,{ onClose:this.navBack() });
   MessageBox.show(msg,{ onClose: function(oAction){
   	if (oAction === 'OK'){
   	    var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
    oRouter.navTo("Page1");}
   } });
   },
   onCreateKo: function(oEvent) {
   var msg = 'Errore';
   	sap.m.MessageBox.show(msg);	
   	
   },
   navBack: function(oAction){
   	
   	    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    oRouter.navTo("Page1");
   },
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
            
		}
	});
}, /* bExport= */ true);
