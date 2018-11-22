/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'libs/RoutingUtils',
        'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojinputnumber',
        'ojs/ojdatetimepicker', 'ojs/ojlabel', 'ojs/ojbutton'],
 function(oj, ko, $, RoutingUtils) {
  
    function DashboardViewModel() {
      var self = this;
	  self.RoutingUtils = RoutingUtils;
	  
	  self.inputNumber = ko.observable(1);
	  self.isoDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
	  
	  self.routers = [
		{
			name: "inputNumber",
			type: "int",
			observable: self.inputNumber

		}, {
			name: "isoDate",
			type: "string",
			observable: self.isoDate
		}
	];
	  
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here. 
       * This method might be called multiple times - after the View is created 
       * and inserted into the DOM and after the View is reconnected 
       * after being disconnected.
       */
      self.connected = function() {
        // Implement if needed

      };
	  	  
	  self.doFilter = function () {
		let _inputNumberAsString = '' + self.inputNumber();
		self.RoutingUtils.go([_inputNumberAsString, self.isoDate()]);	
	  };


      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        return self.RoutingUtils.initRouters(self.routers).then();
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);
