sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, Filter, FilterOperator, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.untitledPrototype.controller.Page1", {
		
		    
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
		_onTableItemPress: function(oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function(fnResolve) {
				this.doNavigate("Page2",oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onSort: function(oEvent) {
		
		
		var oList = this.getView().byId("idTab");
		var oBinding = oList.getBinding("items");
		var order;
		var sSortParams = oBinding.sSortParams;
		if (sSortParams) {
	    if  (sSortParams.endsWith("desc")){
	    order = false;
	    }else{ 
	    order = true;
	    }
		}
		var oSort = new sap.ui.model.Sorter("TelNum", order,false);
		oBinding.sort(oSort);
			
		},
		onLiveChange: function(oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("newValue");
			if (sQuery) {
				aFilter.push(new Filter("TelNum", FilterOperator.Contains,sQuery));
			}
                        // filter binding
			var oList = this.getView().byId("idTab");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
				sNavigationPropertyName = ""; // capire come mai serve svuotare , non deve essere null per funzionare
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var that = this;
						                  var oButton2 = new sap.m.Button('Save', {

                    text: 'Save',

                   tap: [ that.onSave, that ]

             });

             var oButton3 = new sap.m.Button('Cancel', {

                    text: 'Cancel',

                    tap: [ that.onCancel, that ]

             });
             var oButton = new sap.m.Button('Save2', {

                    text: 'Applica',

                   tap: [ that.onFiltApply, that ]

             });

             var oButton1 = new sap.m.Button('Cancel2', {

                    text: 'Cancel',

                    tap: [ that.onCancel2, that ]

             });
			var oDialog = new sap.m.Dialog('Dialog1',{

                    title:'Details ofNew Entry',

                    modal: true,

                    contentWidth:'2em',

                    buttons: [ oButton2, oButton3 ],

             content:[

                      new sap.m.Label({text:'Nome'}),

                      new sap.m.Input({

                    maxLength: 20,

                    id: 'FName'

                      }),

                      new sap.m.Label({text:'Cognome'}),

                      new sap.m.Input({

                   maxLength: 20,

                     id: 'LName'

                       }),

                      new sap.m.Label({text:'Numero di telefono'}),

                      new sap.m.Input({

                   maxLength: 12,

                   id: 'Num' 

                    })
                    

                      ]

             });
             	var oDialog2 = new sap.m.Dialog('Dialog2',{

                    title:'Filtri',

                    modal: true,

                    contentWidth:'2em',

                    buttons: [ oButton, oButton1 ],

             content:[

                      new sap.m.Label({text:'Filtra per:'}),

                      new sap.m.Input({

                    maxLength: 20,

                    id: 'idFilter'

                      }),

                      
                    

                      ]

             });

		},
		
		onPressNew: function(oEvent) {
			var that = this;

             sap.ui.getCore().byId('Dialog1').open();
		},
		onFilter: function(oEvent) {
			var that = this;


             sap.ui.getCore().byId('Dialog2').open();
		},
	onSave: function(oEvent) {
		     var that = this;
		     var fName = sap.ui.getCore().byId('FName').getValue();

             var lName = sap.ui.getCore().byId('LName').getValue();

             var nTel = sap.ui.getCore().byId('Num').getValue();
             
             var oEntry = {};
             oEntry.CustName = fName;
             oEntry.CustSur = lName;
             oEntry.TelNum = nTel;
             oEntry.CustId = this.strRandom();
             
             var oModel = this.getView().getModel();
             oModel.create('/AnagraficaSet',oEntry,{success:this.onCreateOk()});
		
	},
		onFiltApply: function(oEvent) {
		     var that = this;
		     var sFilt = sap.ui.getCore().byId('idFilter').getValue();
             var oList = this.getView().byId('idTab') ;
             var oBinding = oList.getBinding('items');
             var aFilter = [];
             if (sFilt) {
				aFilter.push(new Filter("CustName", FilterOperator.Contains, sFilt));
			}
			oBinding.filter(aFilter);
			
		
	},

  strRandom: function(oEvent) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 13; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
   },
   onCreateOk: function(oEvent) {
   	var msg = 'Inserito';
   	var oDialog = sap.ui.getCore().byId('Dialog1');
   	oDialog.close();
   	sap.m.MessageBox.show(msg);
   	
   },
   onCreateKo: function(oError) {
   var msg = 'Errore';
   	sap.m.MessageBox.show(msg);	
   	
   },
	onCancel: function(oEvent) {  
		
		sap.ui.getCore().byId('Dialog1').close();
	},
		onCancel2: function(oEvent) {  
		
		sap.ui.getCore().byId('Dialog2').close();
	}
	});
}, /* bExport= */ true);
