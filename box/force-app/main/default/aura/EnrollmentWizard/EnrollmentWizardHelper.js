({  
    enrollAgainHelper: function(component, event,confirmationNumber, recordId){
        var self = this;
        self.showProcessingSpinner(component, event);        
        
        var action = component.get('c.getEnrollment');
        action.setParams({
            "recordId": recordId,
            "isEnrollAgain": true
        });        
        action.setCallback(this, function(a) {
            self.hideProcessingSpinner(component, event);
            var state = a.getState();
            if (state !== "SUCCESS") {
                return; 
            }           
            
            var response = a.getReturnValue();
            
            var account = response.objectList.account[0];
            var enrollment = response.objectList.enrollment[0];
            //enrollment.Company_DBA__c.Name = account.Name;
            enrollment.Location_Number__c = account.Location_Number__c;
            //enrollment.Company_DBA__r.BillingPostalCode = account.BillingPostalCode;

            var travelers = response.objectList.travelers;
            var policy_trans = response.objectList.policy_trans;
            
            component.set("v.account", account);
            component.set("v.enrollment", enrollment);

            
            //polulate Travelers
			var TravelersList = component.get("v.TravelersList");    
            component.set("v.TravelersList", null);  
            
            //coming from server not api.
            for (let at of travelers) {          
                TravelersList.push({'sobjectType': 'Enrollments__c',
                                    'Date_of_Birth__c': at.Date_of_Birth__c,
                                    'Calculated_Age__c' : at.Calculated_Age__c,
                                    'Is_Primary__c' : at.Is_Primary__c,
                                    'First_Name__c' : at.First_Name__c,
                                    'Last_Name__c' : at.Last_Name__c,
                                    'Zip_Code__c' : at.Zip_Code__c,
                                    'Country__c' : at.Country__c,
                                    'Phone__c' : at.Phone__c,
                                    'Traveler_Email__c' : at.Traveler_Email__c,
                                    'Address_1__c' : at.Address_1__c,
                                    'Address_2__c' : at.Address_2__c,
                                    'City__c' : at.City__c,
                                    'State__c' : at.State__c});
                                    //'CFAR__c' : at.CFAR__c
                if(at.Is_Primary__c && !enrollment.Zip_Code__c){
                    component.set("v.enrollment.Zip_Code__c", at.Zip_Code__c); 
                }
            }                                     
            component.set("v.TravelersList", TravelersList);  
                                               
            //Populate policy transactions
            var policyTransList = component.get("v.policyTransList"); 
            for (var i = 0; i < policy_trans.length; i++) {   
                policyTransList.push({'sobjectType': 'Policy_Transaction__c',
                     'Payment_Type__c': policy_trans[i].Payment_Type__c,
                     'Status__c': policy_trans[i].Status__c,
                     'Amount__c': policy_trans[i].Amount__c,                                                  
                     'Ra_Payment_ID__c': policy_trans[i].Ra_Payment_ID__c,
                     'Name_on_Check__c': policy_trans[i].Name_on_Check__c,
                     'Card_Holder_Name__c': policy_trans[i].Card_Holder_Name__c,
                     'Check_Number__c': policy_trans[i].Check_Number__c,
                     'Encrypted_Card_Number__c': policy_trans[i].Encrypted_Card_Number__c                                                
                    });
            }
            component.set("v.policyTransList", policyTransList);
            
            component.set("v.enrollment.Departure_Date__c", null);
            component.set("v.enrollment.Return_Date__c", null);
            
            //Populate all look up fields
           if(account.Id){
                component.set("v.selectedLookUpRecordName.name", account.Name +' - '+account.Location_Number__c); 
                component.set("v.selectedLookUpRecordName.recordId", account.Id); 
                component.set("v.selectedLookUpRecordName.code", account.Location_Number__c);
        	}
  			 
         /*  if(enrollment.Destination__c){
                component.set("v.selectedLookUpRecordDestination.name", enrollment.Destination__r.List_Item_Description__c);
                component.set("v.selectedLookUpRecordDestination.recordId", enrollment.Destination__c); 
                component.set("v.selectedLookUpRecordDestination.identifier ", enrollment.Destination__r.List_Item_ID__c);                      
        	}  */
            
            //Clear fields not required
            //component.set("v.");
            
            if(enrollment.Airline__c){ 
                component.set("v.selectedLookUpRecordAirline.name", enrollment.Airline__r.List_Item_Description__c);
                component.set("v.selectedLookUpRecordAirline.recordId", enrollment.Airline__c);   
                component.set("v.selectedLookUpRecordAirline.identifier", enrollment.Airline__r.List_Item_ID__c);                                           
        	}              
            if(enrollment.Cruise_Line__c){
                component.set("v.selectedLookUpRecordCruiseLine.name", enrollment.Cruise_Line__r.List_Item_Description__c);
                component.set("v.selectedLookUpRecordCruiseLine.recordId", enrollment.Cruise_Line__c);     
                component.set("v.selectedLookUpRecordCruiseLine.identifier", enrollment.Cruise_Line__r.List_Item_ID__c);                                                                
        	}               
            
            if(enrollment.Tour_Operator__c){
                component.set("v.selectedLookUpRecordTourOperator.name", enrollment.Tour_Operator__r.List_Item_Description__c);
                component.set("v.selectedLookUpRecordTourOperator.recordId", enrollment.Tour_Operator__c);
                component.set("v.selectedLookUpRecordTourOperator.identifier", enrollment.Tour_Operator__r.List_Item_ID__c);                   
        	}               
  
            if(enrollment.Departing_Airport__c){
                component.set("v.selectedLookUpRecordTourOperator.name", enrollment.List_Item_Description__c);
                component.set("v.selectedLookUpRecordTourOperator.recordId", enrollment.Departing_Airport__c);
                component.set("v.selectedLookUpRecordTourOperator.identifier", enrollment.Departing_Airport__r.List_Item_ID__c);                   
        	}
        	console.log('here');
        });          
        $A.enqueueAction(action);
    }, 
    editEnrollmentHelper: function(component, event,confirmationNumber,recordId) { 

        var self = this;
        self.showProcessingSpinner(component, event);
        
        var firstChar = confirmationNumber.charAt(0);
        var data = null;
        if(firstChar == 'Q'){
            data = { "policyQuoteNo": confirmationNumber} ;
        }else{
            data = { "confirmationId": confirmationNumber};
        }
        
        
        component.set('v.loadPostSalePolicyPayload', data);        
        
        var url = component.get('v.BaseURL') + '/LoadPostSalePolicy';
        console.log('URL --- '+url);
        var self = this;
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(function(response) {
            console.log('[LoadPostSalePolicy] Request Payload ', JSON.stringify(data));
            console.log('[LoadPostSalePolicy] Full Response ', JSON.stringify(response));
            self.hideProcessingSpinner(component, event);
            
            if (response.status == "Failure") {
                if (response.policy) {
                    component.set('v.errorModalTitle', response.message);
                    component.set('v.errorModalMessage', response.policy.validationErrors);
                } else {
                    component.set('v.errorModalTitle', response.status);
                    component.set('v.errorModalMessage', [{"errorMessages": [response.message]}]);
                }
                
                self.errorModalToggle(component, event);
                return;
            }
            
            console.log('[status] LoadPostSalePolicy API | Success. '+JSON.stringify(response));
            component.set('v.loadPostSalePolicyResponse', JSON.stringify(response));         
            
            //RESPONSE FROM API             
            component.set("v.policy", response);
            
            
            var enrollment = component.get("v.enrollment");
            
            //Source
            if(response.policy.enrollmentSource){
                component.set("v.enrollment.Source_c__c",response.policy.enrollmentSource);      
            }
            
            component.set("v.validateAgencyId",response.policy.agencyId);
            component.set("v.enrollment.Agent_Code__c", response.policy.agentId.toString());             
            component.set("v.enrollment.Policy_Status__c",response.policy.policyStatus);
            component.set("v.enrollment.Confirmation_Number__c",response.policy.confirmationNumber);
            component.set("v.enrollment.Inbound_Sales_Rep__c",response.policy.inboundSalesRep);  
            
            //Set policy trans 
            component.set('v.policy_trans.Amount__c', response.policyCostPaymentSummary.totalOutstandingAmount);
            
            // Set the total cost and amount outstanding
            component.set('v.TotalCost', response.policyCostPaymentSummary.totalPolicyCost);
            component.set('v.enrollment.Amount_Outstanding__c', response.policyCostPaymentSummary.totalOutstandingAmount);
            
            //Payment Tab IsGroup amount, visible upon edit enrollment
            component.set('v.policy_trans.Total_Due__c', response.policyCostPaymentSummary.totalClientCost);            
            component.set('v.policy_trans.Total_Client_Paid__c', response.policyCostPaymentSummary.totalClientPaid);
            component.set('v.policy_trans.Total_Paid__c', response.policyCostPaymentSummary.totalPaid);            
            component.set('v.policy_trans.Client_Outstanding_Amount__c', response.policyCostPaymentSummary.clientOutstandingAmount);
            component.set('v.policy_trans.Outstanding__c', response.policyCostPaymentSummary.totalOutstandingAmount); 
            
            if(response.policy.departureDate){  
                component.set("v.enrollment.Departure_Date__c",  self.getFormattedDate(response.policy.departureDate)); 
            }
            
            if(response.policy.returnDate){   
                component.set("v.enrollment.Return_Date__c",  self.getFormattedDate(response.policy.returnDate)); 
            }
            
            if(response.policy.purchaseDate){   
                component.set("v.enrollment.Purchase_Date__c",  self.getFormattedDate(response.policy.purchaseDate));  
            }
            
            if(response.policy.effectiveDate){   
                component.set("v.enrollment.Effective_Date__c",  self.getFormattedDate(response.policy.effectiveDate)); 
            }                
            if(response.policy.postMarkedDate){   
                component.set("v.enrollment.Postmarked_Date__c",  self.getFormattedDate(response.policy.postMarkedDate)); 
            }             
            
            if (response.policy.policyProduct.selectedFlightAccidentCoverage) { 
                component.set("v.enrollment.Flight_Accident_Coverage__c", response.policy.policyProduct.selectedFlightAccidentCoverage.amount);  	 
            } 
            
            //Set Group Info
            if(response.policy.groupInfo){ 
                component.set("v.enrollment.Group_Name__c", response.policy.groupInfo.groupName); 
                component.set("v.enrollment.Group_ID__c", response.policy.groupInfo.groupId); 
                component.set("v.enrollment.Group_Email__c", response.policy.groupInfo.email);                 
                component.set("v.enrollment.Group_Phone__c", response.policy.groupInfo.phone);                  
                component.set("v.enrollment.Payment_Due_Date__c", self.getFormattedDate(response.policy.groupInfo.paymentDueDate));                  
                component.set("v.enrollment.Group_Departure_Date__c", self.getFormattedDate(response.policy.departureDate)); 
                component.set("v.enrollment.Group_Return_Date__c", self.getFormattedDate(response.policy.returnDate));  
            }
            
            // Set the Payment and Refund lists on a Post Sale Edit
            component.set('v.payment_type', response.productPaymentList);
            component.set('v.refund_type', response.refundPaymentList);
            
            var policyProduct = response.policy.policyProduct; 
            
            var coverages = policyProduct.coverages;  
            var selectedCoverage = policyProduct.selectedCoverage;
            
            //var setProducts = {"products": [{"productID": policyProduct.productID,"formNumber": policyProduct.formNumber,"productName": policyProduct.productName,"processingFee": policyProduct.processingFee,"isGroupProduct": policyProduct.isGroupProduct,"isBasicGroupProduct": policyProduct.isBasicGroupProduct,"isStudentGroupProduct": policyProduct.isStudentGroupProduct,"allowDirectLinkingOnly": policyProduct.allowDirectLinkingOnly,"customerService": policyProduct.customerService,"underWriterID": policyProduct.underWriterID,"allowFulfillment": policyProduct.underWriterID,"showMail": policyProduct.showMail,"validatePhone": policyProduct.validatePhone,"hasMedicalUpgradePerTraveler": policyProduct.hasMedicalUpgradePerTraveler,"productCode": "SCS","coverages": [{"coverageID": 1,"isDefault": true,"flightAccidentGroupID": 0,"coverageCode": "TC","description": "Trip Cancellation","upgrades": [{"upgradeID": 1,"upgrade2ProductID": 427,"isSelected": false,"minTripCost": null,"shortDescription": "Cancel for Any Reason","maxTripCost": 10000,"warning": null,"info": null,"rate": 43.55,"upgradeType": "Optional"},{"upgradeID": 16,"upgrade2ProductID": 428,"isSelected": false,"minTripCost": null,"shortDescription": "AD&D","maxTripCost": null,"warning": null,"info": null,"rate": 20,"upgradeType": "Optional"},{"upgradeID": 18,"upgrade2ProductID": 430,"isSelected": false,"minTripCost": null,"shortDescription": "Adventure Sports","maxTripCost": null,"warning": null,"info": null,"rate": 11,"upgradeType": "Optional"}],"flightAccidentCoverages": [],"effectiveDate": response.policy.effectiveDate,"baseRate": 67},{"coverageID": 2,"isDefault": false,"flightAccidentGroupID": 0,"coverageCode": "NTC","description": "Post Departure Only","upgrades": [{"upgradeID": 16,"upgrade2ProductID": 428,"isSelected": false,"minTripCost": null,"shortDescription": "AD&D","maxTripCost": null,"warning": null,"info": null,"rate": 20,"upgradeType": "Optional"},{"upgradeID": 18,"upgrade2ProductID": 430,"isSelected": false,"minTripCost": null,"shortDescription": "Adventure Sports","maxTripCost": null,"warning": null,"info": null,"rate": 11,"upgradeType": "Optional"}],"flightAccidentCoverages": [],"effectiveDate": response.policy.effectiveDate,"baseRate": 37}],"selectedCoverage": {"coverageID": 1,"isDefault": true,"flightAccidentGroupID": 0,"coverageCode": "TC","description": "Trip Cancellation","upgrades": [{"upgradeID": 1,"upgrade2ProductID": 427,"isSelected": false,"minTripCost": null,"shortDescription": "Cancel for Any Reason","maxTripCost": 10000,"warning": null,"info": null,"rate": 43.55,"upgradeType": "Optional"},{"upgradeID": 16,"upgrade2ProductID": 428,"isSelected": false,"minTripCost": null,"shortDescription": "AD&D","maxTripCost": null,"warning": null,"info": null,"rate": 20,"upgradeType": "Optional"},{"upgradeID": 18,"upgrade2ProductID": 430,"isSelected": false,"minTripCost": null,"shortDescription": "Adventure Sports","maxTripCost": null,"warning": null,"info": null,"rate": 11,"upgradeType": "Optional"}],"flightAccidentCoverages": [],"effectiveDate": "2019-03-06T00:00:00","baseRate": 67},"selectedFlightAccidentCoverage": policyProduct.selectedFlightAccidentCoverage,"sortOrder": policyProduct.sortOrder,"pointsValue": policyProduct.pointsValue,"allowQuickQuotes": policyProduct.allowQuickQuotes,"enableSavedQuotes": policyProduct.enableSavedQuotes,"maxTravelers": policyProduct.maxTravelers,"minTravelers": policyProduct.minTravelers,"ageOfAdulthood": policyProduct.ageOfAdulthood,"showMailDelivery": policyProduct.showMailDelivery,"showDestination": policyProduct.showDestination,"showAirline": policyProduct.showAirline,"showCruiseAndTour": policyProduct.showCruiseAndTour,"planTypeId": policyProduct.planTypeId,"enableDOB": policyProduct.enableDOB,"requireDOB": policyProduct.requireDOB,"rentalVehicleCostPerDay": policyProduct.rentalVehicleCostPerDay,"baseRate": policyProduct.baseRate,"maxTripLength": policyProduct.maxTripLength,"isAddressRequired": policyProduct.isAddressRequired,"isPrimaryTravelerEmailRequired": policyProduct.isPrimaryTravelerEmailRequired,"validateSamePurchaseDepartureDate": policyProduct.validateSamePurchaseDepartureDate,"isFlight": policyProduct.isFlight,"isRetail": policyProduct.isRetail,"isAnnual": policyProduct.isAnnual,"isUseYear": policyProduct.isUseYear,"useYearList": [],"requireState": policyProduct.requireState,"balanceOnNet": policyProduct.balanceOnNet,"requireInvoice": policyProduct.requireInvoice}]};
            var setProducts = {"products": [{"productID": policyProduct.productID,"formNumber": policyProduct.formNumber,"productName": policyProduct.productName,"processingFee": policyProduct.processingFee,"isGroupProduct": policyProduct.isGroupProduct,"isBasicGroupProduct": policyProduct.isBasicGroupProduct,"isStudentGroupProduct": policyProduct.isStudentGroupProduct,"allowDirectLinkingOnly": policyProduct.allowDirectLinkingOnly,"customerService": policyProduct.customerService,"underWriterID": policyProduct.underWriterID,"allowFulfillment": policyProduct.underWriterID,"showMail": policyProduct.showMail,"validatePhone": policyProduct.validatePhone,"hasMedicalUpgradePerTraveler": policyProduct.hasMedicalUpgradePerTraveler,"productCode": "SCS","coverages": coverages,"selectedCoverage": selectedCoverage,"selectedFlightAccidentCoverage": policyProduct.selectedFlightAccidentCoverage,"sortOrder": policyProduct.sortOrder,"pointsValue": policyProduct.pointsValue,"allowQuickQuotes": policyProduct.allowQuickQuotes,"enableSavedQuotes": policyProduct.enableSavedQuotes,"maxTravelers": policyProduct.maxTravelers,"minTravelers": policyProduct.minTravelers,"ageOfAdulthood": policyProduct.ageOfAdulthood,"showMailDelivery": policyProduct.showMailDelivery,"showDestination": policyProduct.showDestination,"showAirline": policyProduct.showAirline,"showCruiseAndTour": policyProduct.showCruiseAndTour,"planTypeId": policyProduct.planTypeId,"enableDOB": policyProduct.enableDOB,"requireDOB": policyProduct.requireDOB,"rentalVehicleCostPerDay": policyProduct.rentalVehicleCostPerDay,"baseRate": policyProduct.baseRate,"maxTripLength": policyProduct.maxTripLength,"isAddressRequired": policyProduct.isAddressRequired,"isPrimaryTravelerEmailRequired": policyProduct.isPrimaryTravelerEmailRequired,"validateSamePurchaseDepartureDate": policyProduct.validateSamePurchaseDepartureDate,"isFlight": policyProduct.isFlight,"isRetail": policyProduct.isRetail,"isAnnual": policyProduct.isAnnual,"isUseYear": policyProduct.isUseYear,"useYearList": [],"requireState": policyProduct.requireState,"balanceOnNet": policyProduct.balanceOnNet,"requireInvoice": policyProduct.requireInvoice}]};
            
            component.set('v.planSelectionProducts', setProducts.products); 
            
            console.log(' --- products '+JSON.stringify(setProducts.products));                             
            console.log(' --- products[0] '+JSON.stringify(setProducts.products[0])); 
            
            component.set("v.validateAgencyId", response.policy.agencyId); 
            component.set("v.PurchasedProduct",setProducts.products[0]);                 
            
            console.log('purchased prod: '+JSON.stringify(component.get("v.PurchasedProduct")));     
            self.productSelectionCreateTabs(component, event);  
            
            //Load Travelers List
            var TravelersList = component.get("v.TravelersList");
            if (response.policy.travelers.length > 0) {
                self.convertAPITravelers(component, event, response.policy.travelers);
                
                console.log('travelers list: '+JSON.stringify(component.get("v.TravelersList")));  
            } else {
                console.log("load enrollment with no travellers set travelers default");
                component.set('v.TravelersList', [{'sobjectType': 'Enrollments__c','Date_of_Birth__c': null,'Trip_Cost__c': 0.00,'Id' : null,'Is_Primary__c' : null,'First_Name__c' : null,'Last_Name__c' : null,'Return_Date__c' : null,'Deposit_Date__c' : null,'Premium_Paid_Date__c' : null,'CFAR__c' : null,'Address_1__c' : null,'Address_2__c' : null,'City__c' : null, 'State__c' : null,'Zip_Code__c' : null,'Country__c' : null,'Phone__c' : '','Traveler_Email__c' : ''}]);                                        
            }             
            
            //Add Policy transaction
            if (response.policy.payments.length > 0) {
                component.set("v.PaymentsList", response.policy.payments);
                var policyTransList = component.get("v.policyTransList");
                
                for (var i = 0; i < response.policy.payments.length; i++) {
                    policyTransList.push({'sobjectType': 'Policy_Transaction__c',
                                          'Payment_Type__c': response.policy.payments[i].paymentType,
                                          'Status__c': response.policy.payments[i].paymentStatus,
                                          'Amount__c': response.policy.payments[i].amount,                                                  
                                          'Ra_Payment_ID__c': response.policy.payments[i].paymentId,
                                          'Name_on_Check__c': response.policy.payments[i].payerName,
                                          'Card_Holder_Name__c': response.policy.payments[i].cardHolderName,
                                          'Check_Number__c': response.policy.payments[i].checkNumber,
                                          'Encrypted_Card_Number__c': response.policy.payments[i].maskedCardNumber                                                
                                         });                                                                                 
                }
            }                
            
            
            //Set policy
            self.getEnrollmentDetails(component, response);  
            self.setProductFieldVisibility(component, event);
            
        }).catch(function(error) {
            console.error('[loadPostSalePolicyPayload] Error: ', error);
            
            component.set('v.errorModalTitle', 'Network Error');
            component.set('v.errorModalMessage', error);
            self.errorModalToggle(component, event);  
        });   
        
        component.set("v.recordId", recordId);        
        
        //Show All Tabs
        component.set("v.startEnrollmentTab",true); 
        component.set("v.travelDetailsTab",true);
        component.set("v.productSelectionTab",true);        		
        component.set("v.goFowardButton",true);   
        
        //HIDE NON APPLICABLE TABS WHEN EDITING ENROLLMENT
        
        var traveldetTab = component.find('traveldet');
         var summaryTab = component.find('summary');
         
         var recordStatus = component.get("v.enrollment.Record_Status__c");
         if(recordStatus == 'Quote'){
	         //hide travel details tab
	         $A.util.addClass(traveldetTab, 'slds-hide');  
	        //hide travel summary Tab
	        $A.util.addClass(summaryTab, 'slds-hide'); 
         }
        
        //hide travel savequote Tab
        var savequoteTab = component.find('savequote');
        $A.util.addClass(savequoteTab, 'slds-hide');
        
        //Hide next button
        var nextButton = component.find('nextButton');
        $A.util.addClass(nextButton, 'slds-hide');  
        
        //Hide back button
        var prevButton = component.find('prevButton');
        $A.util.addClass(prevButton, 'slds-hide');  
        
        //Show Save Button        
        var saveEnrollmentBtn = component.find('saveEnrollmentBtn');
        $A.util.removeClass(saveEnrollmentBtn, 'slds-hide');                
        
        //Hide Zip field
        var zip_codeDiv = component.find('zip_codeDiv');
        $A.util.addClass(zip_codeDiv, 'slds-hide');        
        
        //Render all fields which shoud be visible under Div
        var edit_startEnrollmentTabDiv = component.find('edit_startEnrollmentTabDiv');
        $A.util.removeClass(edit_startEnrollmentTabDiv, 'slds-hide'); 
        
        //Hide Validate button
        var enrollmentTabValidateBtn = component.find('enrollmentTabValidateBtn');
        $A.util.addClass(enrollmentTabValidateBtn, 'slds-hide');  
        
        //show flight number and departing airport
        component.set("v.flight_numberClass" , "slds-show");
        component.set("v.departing_airportClass" , "slds-show");                        
    } ,
    getEnrollmentDetails: function(component, response) { 
        
        console.log("GETTING ENROLLMENT DETAILS");
        //alert("Agency Id: "+response.policy.agencyId+" destinationId: "+response.policy.destinationId+" airlineId: "+response.policy.airlineId+" cruiseLineId: "+response.policy.cruiseLineId+" tourOperatorId: "+response.policy.tourOperatorId);
        var url = new URL(window.location.href);
        var confirmationNumber = url.searchParams.get("confirmationNumber"); //Edit Mode          
        var recordId = url.searchParams.get("enrollmentId");
   
        var action = component.get('c.getEnrollmentDetail');
        action.setParams({
            "recordId" : recordId, 
            "locationNumber": response.policy.locationNumber,
            "destinationId": response.policy.destinationId,
            "airlineId": response.policy.airlineId,
            "cruiseLineId": response.policy.cruiseLineId,
            "tourOperatorId" : response.policy.tourOperatorId
        });        
        action.setCallback(this, function(a) {
            var state = a.getState();
            console.log("ENROLLMENT DETAILS GOTTEN");
            if (state !== "SUCCESS") {
                return;
 
            }           
            console.log("ENROLLMENT DETAILS SUCCESS");             
            var res = a.getReturnValue();
            
            var account = res.objectList.account[0];
            var enrollment = res.objectList.enrollment[0];
            var list_item = res.objectList.list_item; 

            console.log("ENROLLMENT DETAILS RETURN: ", JSON.parse(JSON.stringify(res)));
            if(res.IsSuccess){ 	
     
                for (var i = 0; i < list_item.length; i++) {   
                    //Destination 
                    if(list_item[i].List_Type__c == 'Destination'){
                        component.set("v.selectedLookUpRecordDestination.name", list_item[i].List_Item_Description__c);
                        component.set("v.selectedLookUpRecordDestination.recordId", list_item[i].Id); 
                        component.set("v.selectedLookUpRecordDestination.identifier", list_item[i].List_Item_ID__c);    
                    }       
                    if(list_item[i].List_Type__c == 'Airline'){ 
                        component.set("v.selectedLookUpRecordAirline.name", list_item[i].List_Item_Description__c);
                        component.set("v.selectedLookUpRecordAirline.recordId", list_item[i].Id);   
                        component.set("v.selectedLookUpRecordAirline.identifier", list_item[i].List_Item_ID__c);   
                    }    
                    if(list_item[i].List_Type__c == 'Cruiseline'){
                        component.set("v.selectedLookUpRecordCruiseLine.name", list_item[i].List_Item_Description__c);
                        component.set("v.selectedLookUpRecordCruiseLine.recordId", list_item[i].Id);     
                        component.set("v.selectedLookUpRecordCruiseLine.identifier", list_item[i].List_Item_ID__c);   
                    } 
                    if(list_item[i].List_Type__c == 'Tour Operator'){
                        component.set("v.selectedLookUpRecordTourOperator.name", list_item[i].List_Item_Description__c);
                        component.set("v.selectedLookUpRecordTourOperator.recordId", list_item[i].Id);
                        component.set("v.selectedLookUpRecordTourOperator.identifier", list_item[i].List_Item_ID__c);   
                    }                    
                }
                                      
                //Company
                if(account){ 
                    component.set("v.selectedLookUpRecordName.name", account.Name +' - '+account.Location_Number__c); 
                    component.set("v.selectedLookUpRecordName.recordId",account.Id); 
                    component.set("v.selectedLookUpRecordName.code", account.Location_Number__c);
  					
                    component.set("v.account.Name", account.Name);
            
                    //Set Location   
                    component.set("v.account.Location_Number__c", account.Location_Number__c);
                    
                    //Account Owner
                    component.set("v.account.Owner.Name", account.Owner.Name);     
                    component.set("v.account.OwnerId", account.OwnerId);
                     
                    component.set("v.initial_account.Id", account.Id);    
                    component.set("v.initial_account.Name", account.Name +' - '+account.Location_Number__c);    
                    component.set("v.initial_account.Location_Number__c", account.Location_Number__c);
                    
                    console.log("ENRLDTLS ---- Setting Account Info! ", JSON.parse(JSON.stringify(component.get("v.selectedLookUpRecordName"))));
                }
                              
            }                            
        }); 
        
        $A.enqueueAction(action);    	        
    },
    goForwardBtnHelper: function(component, event) { 
        var theMap = component.get("v.tabMap");
        var currentTab = component.get("v.currentTab");
        var nextTab = theMap[currentTab + 1];
        component.set("v.selTabId", nextTab);
        component.set("v.currentTab", currentTab + 1);
        this.navigationHandler(component, event, nextTab);
    },
    activateTab: function(component, tab) {
        var tabId = component.find(tab);
        var tab_div = component.find(tab + "_div");
        $A.util.addClass(tabId, 'slds-active');
        $A.util.addClass(tab_div, 'slds-show');
        $A.util.removeClass(tab_div, 'slds-hide');
    },
    deActivateTab: function(component, tab) {
        var tabId = component.find(tab);
        var tab_div = component.find(tab + "_div");
        $A.util.removeClass(tabId, 'slds-active');
        $A.util.removeClass(tab_div, 'slds-show');
        $A.util.addClass(tab_div, 'slds-hide'); 
    },
    navigationHandler: function(component, event, tab) {
        var tabList = component.get("v.tabList");
        for (var i = 0; i < tabList.length; i++) {
            if (tabList[i] == tab) {

                component.set("v.selTabId", tab);
                component.set("v.currentTab", i + 1);
                this.activateTab(component, tab);

                var priorTabId = component.get("v.priorTabId");
                var tabMapRev = component.get("v.tabMapRev");
                var priorTabIndex = tabMapRev[priorTabId];
				
                var AllValid = true;
                                                
                if(priorTabId == 'agenttrip'){
                 	AllValid = this.validateAgentTripInformationTabHelper(component, event);
                }
                
                 if (tab == 'startenrollment') {
                    component.set("v.transferButton", false);
                 }
                
                /*TOBE USED LATER                
                 if(priorTabId == 'traveldet'){
                 	 AllValid = this.validateTravelDetailsTabHelper(component, event);
                 }
                
                if (tab == 'productsel') {
                    this.getPickListOptions(component, "Coverage_Type__c", "v.enrollment", "coverage_type");
                }
                
                if (tab == 'traveler') {
                    this.primaryTravelerTabFunctions(component, event);
                }
                if(priorTabId == 'traveler'){
                    AllValid = this.validatePrimaryTravelerTab(component, event); 
                }    
                */
				
                //Validae Dates (This logic to be moved to helper.)
                var crc_dates = component.get("v.CRCDatesList");
                var car_rent_coll_upgrade = component.get("v.carRentalCollisionUpgrade");

                if (priorTabId == 'productsel' && car_rent_coll_upgrade && crc_dates.length == 0) {
                    component.set("v.addCRCDatesError", 'slds-show');
                    var tabs = document.getElementsByClassName('slds-tabs--default__link');
                    tabs[2].setAttribute('data-visited', 'false');
                    return;
                }
                if (car_rent_coll_upgrade && crc_dates.length > 0) {
                    component.set("v.addCRCDatesError", 'slds-hide');
                }
                //End Validate dates 
                
                if(priorTabId == 'payment'){
					AllValid = this.validatePaymentTab(component, event);                    
                }
                
				//Tab Marker
                var tabs = document.getElementsByClassName('slds-tabs--default__link');
                if (priorTabIndex !== undefined) {
                    if(AllValid){
                        tabs[priorTabIndex - 1].setAttribute('data-visited', 'true');
                    }else{
                    	tabs[priorTabIndex - 1].setAttribute('data-visited', 'false');
                    }
                }
            } else {
               this.deActivateTab(component, tabList[i]);  
            }
        }
    },    
    validatePostMarkedDate: function(component, event) {
         var isValid = true;
        
        //Validate PostMarked Date Is Populated
        var source = component.get("v.enrollment.Source_c__c");                
        if(source == 'Mail' || source=='Fax' || source =='Roster'){            
            var postmarked_date = component.get("v.enrollment.Postmarked_Date__c");
            var postmarked_date_id  = component.find('postmarked_date');
            if(!postmarked_date){
            	isValid = false;                                  
                postmarked_date_id.set("v.errors", [{message:"Postmarked Date required"}]);
            }else{
                postmarked_date_id.set("v.errors", null);
            }
        }
        return isValid;        
    },
    validateAgentTripInformationTabHelper: function(component, event) {
         var isValid = true;
        
        //Validate PostMarked Date Is Populated
        isValid = this.validatePostMarkedDate(component, event); 
        
        return isValid;
    },
    getFormattedDate: function(component, input_date) {
        var output_date = new Date(input_date);
        return output_date.getFullYear()+"-"+("0" + (output_date.getMonth() + 1)).slice(-2)+"-"+("0" + (output_date.getDate())).slice(-2)

    },
    calculateAge : function(component, dob) {
        if(!dob) {
            console.log('There was no date...');
            // Somehow we have no date of birth, do nothing
            return;
        }
        var current_date = new Date();
        var birth_date = new Date(dob);
        var age = current_date.getFullYear() - birth_date.getFullYear();
        
        
        if(current_date.getMonth() < (birth_date.getMonth() - 1)) {
            age -= 1;
        }
        
        if((birth_date.getMonth() -1) == current_date.getMonth() && (current_date.getDate() < birth_date.getDate())) {
            age -= 1;
        }
        
        return age
    },
    cancelValidatePolicyTransaferHelper: function(component, event) {

		        
        $A.util.removeClass(component.find('policy_transfer_window'), 'slds-fade-in-open');
        $A.util.removeClass(component.find('policy_transfer_window_backdrop'), 'slds-backdrop--open');      

		var ini_account = component.get("v.initial_account");
       
        if(ini_account.Name){
            component.set("v.selectedLookUpRecordName.name", ini_account.Name); 
            component.set("v.selectedLookUpRecordName.recordId", ini_account.Id); 
            component.set("v.selectedLookUpRecordName.code", ini_account.Location_Number__c); 
            component.set("v.account.Location_Number__c", ini_account.Location_Number__c); 
        }

          
    },
    validateTravelDetailsTabHelper: function(component, event) {
        var isValid = true;
        
        // Determine if the State field is required based on Country
        var country = component.get("v.enrollment.Country_of_residency__c");
        var state = component.get("v.enrollment.State_of_Residency__c");
        
        if((country === "United States" || country === "Canada") && !state) {
            // We should have a state but don't, tab is invalid
            $A.util.addClass(component.find('state_of_residency'), 'slds-has-error');
            $A.util.removeClass(component.find('state_required_label'), 'slds-hide');
            isValid = false;
            //console.log('Invalidated Travel Details based on no state');
        } else {
            // No state is required, valid so far, remove any previous State errors
            $A.util.removeClass(component.find('state_of_residency'), 'slds-has-error');
            $A.util.addClass(component.find('state_required_label'), 'slds-hide');
        }
        
        //Disable State of Residency if Country not US/Canada
        if(country){
            if(country !== "United States" && country !== "Canada"){
            	component.set("v.disabledState",true);
            }else{
                component.set("v.disabledState",false);
            }
        }
        
        // Determine if we care about the Departure Date compared to today
        var departure_date = component.get("v.enrollment.Departure_Date__c");
        if(!departure_date) {
            // No departure date at all, mark invalid
            isValid = false;
            //console.log('Invalidated Travel Details based on no departure date');
        } else {
            var source = component.get("v.enrollment.Source_c__c");
            if(['Mail', 'Fax', 'Roster'].indexOf(source) < 0) {
                // Departure date needs to be in the future for this source
                var today = new Date(); today.setDate(today.getDate() - 1);
                
                if(new Date(departure_date) < today) {
                    $A.util.removeClass(component.find('validate_departure_date'), 'slds-hide');
                    $A.util.addClass(component.find('departure_date_tra'), 'slds-has-error');
                    isValid = false;
                    //console.log('Invalidated travel details due to departure in past');
                } else {
                    $A.util.addClass(component.find('validate_departure_date'), 'slds-hide');
                    $A.util.removeClass(component.find('departure_date_tra'), 'slds-has-error');
                }
            }
        }
        var return_date = component.get("v.enrollment.Return_Date__c");
        
        //Validate that return date is not less than departure date
        if(departure_date){
            if(return_date){
                if(return_date <= departure_date) {
                    $A.util.removeClass(component.find('validate_return_date'), 'slds-hide');
                    $A.util.addClass(component.find('return_date_tra'), 'slds-has-error');
                    isValid = false;
                    //console.log('Invalidated travel details due to return date being less then departure date');
                } else {
                    $A.util.addClass(component.find('validate_return_date'), 'slds-hide');
                    $A.util.removeClass(component.find('return_date_tra'), 'slds-has-error');
                }                
            }
        }
       
        // All field dependant validations passed, check remaining fields for data        
        var destination = component.get("v.selectedLookUpRecordDestination");
        if(!return_date || !destination.name) {
            // Missing return date or destination, not valid yet
            isValid = false;
            //console.log('Invalidated travel details based on no return date or destination');
        }
        
        // All of our current travelers should have a DoB and Trip Cost 
        var travelers = component.get("v.TravelersList");
        for(let i in travelers) {
            if(!travelers[i].Date_of_Birth__c) { //} || !travelers[i].Trip_Cost__c) {
                // This traveler is missing required data, invalidate tab
                isValid = false;
                //console.log('Invalidated travel details based on missing Traveler data');
            }
            
            //Set State for validateTravelerRates api call
            if(state && travelers.length > 0){  
                travelers[0].State__c = state;
            }
        }
        component.set("v.TravelersList", travelers); 
        
        // We've validated everything we need to, now determine if button is live
        var userIntent = component.get("v.userIntent");
        if(userIntent =='NewEnrollment' || userIntent == 'EnrollAgain'){            
            component.set("v.getQuoteButton", !isValid); 
        }
 
        //console.log('Setting GetQuote button disabled to ' + !isValid);        
    },    
    leaveHandler: function(event) {
        event.returnValue = "Are you sure you want to exit this enrollment? Any changes you have made will be lost.";
    },
    preventLeaving: function() {
        window.addEventListener("beforeunload", this.leaveHandler);  
    },
    allowLeaving: function() {
        window.removeEventListener("beforeunload", this.leaveHandler);
    },      
    validatePaymentTab : function(component, event) {
        var payment_refund = component.get("v.payment_refund");
       
        var payment_type_id = component.find("payment_type"); 
        if(payment_refund=="Payment"){            
            $A.util.removeClass(payment_type_id, 'slds-hide'); 
			//clear refund val      
			component.set("v.policy_trans.Refund_To__c","");      
        }else{
            $A.util.addClass(payment_type_id, 'slds-hide'); 
        }
        
        var refund_to_id = component.find("refund_to"); 
        if(payment_refund=="Refund"){            
            $A.util.removeClass(refund_to_id, 'slds-hide');   
            //clear payment val
            component.set("v.policy_trans.Payment_Type__c",""); 
        }else{
            $A.util.addClass(refund_to_id, 'slds-hide'); 
        }         
       
        var payment_type = component.get("v.policy_trans.Payment_Type__c");
        var refund_to = component.get("v.policy_trans.Refund_To__c");    
        var AllValid = true;
        
        //Validate Payment/Refund toggle radio buttion
        var payment_refund_error = component.find('payment_refund_error');
        if(payment_refund == undefined || payment_refund=="" || payment_refund==null){                        
 			$A.util.removeClass(payment_refund_error, 'slds-hide');
            return false;
        }
		else{
         	$A.util.addClass(payment_refund_error, 'slds-hide');   
        }         

        var payment_Div = component.find('payment_Div');
        var refund_to_Div = component.find('refund_to_Div');
        
        var payment_type_error = component.find('payment_type_error');
        $A.util.addClass(payment_Div, 'slds-has-error');
        $A.util.addClass(refund_to_Div, 'slds-has-error');

       var refund_to_error = component.find('refund_to_error');
        
        if(payment_refund == "Payment" && payment_type == ""){      
            $A.util.removeClass(payment_type_error, 'slds-hide');
            $A.util.addClass(refund_to_error, 'slds-hide');
            return false;
        }else{
            $A.util.addClass(payment_type_error, 'slds-hide'); 
 			$A.util.removeClass(payment_Div, 'slds-has-error');           
        }
                
        if(payment_refund == "Refund" && refund_to == ""){            
            $A.util.removeClass(refund_to_error, 'slds-hide');  
            $A.util.addClass(payment_type_error, 'slds-hide');
            return false;
        }else{
            $A.util.addClass(refund_to_error, 'slds-hide');  
            $A.util.removeClass(refund_to_Div, 'slds-has-error');
        } 
        
		//Require Name on Check and Check Number if Payment Type = check for both Payments and Refunds
        if(payment_type){
            if(payment_type == "Check"){
                component.set("v.require_check_fields", true);
                var name_on_check = component.get("v.policy_trans.Name_on_Check__c");
                var check_number = component.get("v.policy_trans.Check_Number__c");
                if(name_on_check == undefined || name_on_check=="" || name_on_check==null || check_number == undefined || check_number=="" || check_number==null ){
                    AllValid = false;                  
                }
            }else{
                component.set("v.require_check_fields", false);
            }
        }
        return AllValid;
    },
    cancelModalHelper : function(component, event, helper) { 
        $A.util.removeClass(component.find('back_date_policy_window'), 'slds-fade-in-open');
        $A.util.removeClass(component.find('back_date_policy_backdrop'), 'slds-backdrop--open');  

        $A.util.removeClass(component.find('valid_agency_window'), 'slds-fade-in-open');
        $A.util.removeClass(component.find('valid_agency_backdrop'), 'slds-backdrop--open');   
        
        $A.util.removeClass(component.find('policy_transfer_window'), 'slds-fade-in-open');
        $A.util.removeClass(component.find('policy_transfer_window_backdrop'), 'slds-backdrop--open');
        
        $A.util.removeClass(component.find('post_edit_save_window'), 'slds-fade-in-open');
        $A.util.removeClass(component.find('post_edit_save_backdrop'), 'slds-backdrop--open');
        
        $A.util.removeClass(component.find('calculate_rate_window'), 'slds-fade-in-open');
        $A.util.removeClass(component.find('calculate_rate_backdrop'), 'slds-backdrop--open'); 
        
        component.set("v.CalculateRateModalShow", false); 
    },
    populateStateOfResidency : function(component, event, helper) {
		var zip_code = component.get("v.enrollment.Zip_Code__c");
        var action = component.get('c.getStateOfResidency');
        action.setParams({
            "zip_code": zip_code
        });        
        action.setCallback(this, function(response) {
            var state = response.getState();
            var state_of_residency = response.getReturnValue(); 
         
            if(state_of_residency){            	
                var statesOptions = component.get("v.statesOptions");
                
                for (var i = 0; i < statesOptions.length; i++) {
                    if (statesOptions[i].selected) {
                       statesOptions[i].label = state_of_residency;
                       statesOptions[i].value = state_of_residency; 
                       break;
                    }
                }                
                component.set("v.statesOptions", statesOptions);
                component.set("v.enrollment.State_of_Residency__c", state_of_residency ); 
            }
        });
        
        $A.enqueueAction(action);        
    },  
    getPickListOptions: function(component, fieldName, objectAttribute, attributeId) {
        var action = component.get("c.getselectOptions");
        action.setParams({
            "objectType": component.get(objectAttribute),
            "field": fieldName
        });
        action.setCallback(this, function(response) {
            var test = response.getState();
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
                
                var opts = [];
               if (fieldName == 'State__c') { 
                    var country_of_residency = component.get("v.enrollment.Country_of_residency__c"); 
                    var state_of_residency = component.get("v.enrollment.State_of_Residency__c");               
                    
                    if(country_of_residency){                    
                        if(country_of_residency =="United States" || country_of_residency =="Canada"){        
                            opts.push({
                                class: "optionClass",
                                label: "Choose one...",
                                value: "",
                                selected: true
                            });                                                                   
                            
                        }else{   
                            opts.push({
                                class: "optionClass",
                                label: "",
                                value: "",
                                selected: true 
                            });  
                        }                    
                    }else{
                        opts.push({
                            class: "optionClass",
                            label: "Choose one...",
                            value: "",
                            selected: true
                        });                    
                    }  
               }

                if (allValues != undefined && allValues.length > 0 && fieldName != 'Source_c__c' && fieldName != 'Country__c' && fieldName != 'State__c' && fieldName !='Policy_Fulfillment__c' && fieldName !='Authorization_Status__c') { 
                    opts.push({
                        class: "optionClass",
                        label: "Choose one...",
                        value: "",
                        selected: true
                    });
                }
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
                
                //Move code below to Helper
                if (fieldName == 'Country__c') {
                    opts.push({
                        class: "optionClass",
                        label: "United States",
                        value: "United States", 
                        selected: true
                    });
                }

                if (fieldName == 'Source_c__c') {
                    opts.push({
                        class: "optionClass",
                        label: "Phone",
                        value: "Phone",
                        selected: true
                    });
                }     
                if (fieldName == 'Policy_Fulfillment__c') {
                    for (var i = 0; i < opts.length; i++) {
                        if(opts[i].value == 'Email'){
                           	opts[i].selected = true;  
                            component.set("v.enrollment.Policy_Fulfillment__c","Email"); 
                        }
                	}                    
                } 

               if (fieldName == 'Authorization_Status__c') {
                    for (var i = 0; i < opts.length; i++) {    
                        if(opts[i].value == 'Online'){  
                           	opts[i].selected = true; 
                            component.set("v.policy_trans.Authorization_Status__c","Online");
                        }
                	}                    
                }                       
                var val = attributeId.charAt(1);
                if (val == '.') {
                    component.set(attributeId, opts);
                } else {
                    component.find(attributeId).set("v.options", opts);
                }
            }
        });
        $A.enqueueAction(action);
    },
    saveEnrollment: function(component, event) {
        console.log('start of saveEnrollment');
        
        try {
            var purchasedProduct = component.get("v.PurchasedProduct");
            var plan_type_map = component.get('v.PlanTypeMap');
            var enrollment = component.get("v.enrollment");

            
            
            // Gather enrollment data from various fields and attributes
            enrollment.Company_DBA__c = component.get("v.selectedLookUpRecordName").recordId;
            enrollment.Airline__c = component.get("v.selectedLookUpRecordAirline").recordId;
            enrollment.Cruise_Line__c = component.get("v.selectedLookUpRecordCruiseLine").recordId;
            enrollment.Tour_Operator__c = component.get("v.selectedLookUpRecordTourOperator").recordId;
            enrollment.Departing_Airport__c = component.get("v.selectedLookUpRecordDepartingAirport").recordId;
            enrollment.Destination__c = component.get("v.selectedLookUpRecordDestination").recordId;
            enrollment.Base_Plan_Cost__c = purchasedProduct.baseRate;
            enrollment.Enable_Date_of_Birth__c = purchasedProduct.enableDOB;
            enrollment.Enable_Save_Quote__c = purchasedProduct.enableSavedQuotes;
            if (purchasedProduct.selectedFlightAccidentCoverage) {
                var flightCoverage = purchasedProduct.selectedFlightAccidentCoverage.description;
                if(flightCoverage=='$300,000' || flightCoverage=='$500,000' || flightCoverage=='$1 Million'){}else{
                    flightCoverage = null;
                } 
                enrollment.Flight_Accident_Coverage__c = flightCoverage; 
            }
            enrollment.Plan_Type__c = plan_type_map[purchasedProduct['planTypeId']];
            enrollment.Coverage_Type__c = purchasedProduct.selectedCoverage.description;
            enrollment.Is_Flight__c = purchasedProduct.isFlight;
            enrollment.Is_Group__c = purchasedProduct.isGroupProduct;
            enrollment.Is_Student_Group__c = purchasedProduct.isStudentGroup;
            enrollment.Is_Use_Year__c = purchasedProduct.isUseYear;
            enrollment.Address_Required__c = purchasedProduct.isAddressRequired;
            enrollment.State_Required__c = purchasedProduct.requireState;
            enrollment.Total_Plan_Cost__c = component.get("v.TotalCost");
            
            // Translate dates as needed
           // enrollment.Purchase_Date__c= this.getFormattedDate(enrollment.Purchase_Date__c); 
            //if (enrollment.Departure_Date__c) enrollment.Departure_Date__c = new Date(enrollment.Departure_Date__c).toLocaleDateString();
            //if (enrollment.Return_Date__c) enrollment.Return_Date__c = new Date(enrollment.Return_Date__c).toLocaleDateString();
            //                        
            var travelers = component.get('v.TravelersList');   

            var summaryComments = component.find("comments_sum").get("v.value");
            
            if (summaryComments) {
                var EnrollmentNotes = component.get("v.EnrollmentNotes");
                EnrollmentNotes.push(summaryComments);
                component.set("v.EnrollmentNotes", EnrollmentNotes);
            }
            
            // If this is a Quote being saved, remove the Traveler IDs
            if(enrollment.Record_Status__c === "Quote") {
                console.log("Stripping traveler IDs out of a Quote save.");
                for(let t of travelers) {
                    //t.RA_Traveler_ID__c = '';  
                }
            }
            
            console.log('saveEnrollment, enrollment: ', JSON.stringify(enrollment));
            console.log('saveEnrollment, travelers: ', JSON.stringify(travelers));
            console.log('saveEnrollment, transactions: ', JSON.stringify(component.get("v.PaymentsList")));
            console.log('saveEnrollment, ProductUpgrades: ', JSON.stringify(component.get("v.ProductUpgrades")));
            console.log('saveEnrollment, CRCDatesList: ', JSON.stringify(component.get("v.CRCDatesList")));
            console.log('saveEnrollment, formNumber: ', JSON.stringify(purchasedProduct.formNumber));
            console.log('saveEnrollment, EnrollmentNotes: ', JSON.stringify(component.get("v.EnrollmentNotes")));
            //works: {"sobjectType": "Enrollments__c","Source_c__c": "Phone","Country_of_residency__c": "United States","Record_Status__c": "Quote","Beneficiary_Details__c": "Policy Designated","Policy_Status__c": "Active","Inbound_Sales_Rep__c": "","Policy_Fulfillment__c": "Email","Zip_Code__c": "53202","State_of_Residency__c": "Wisconsin","Departure_Date__c": "2019-04-21","Return_Date__c": "2019-04-30","Email1__c": "maria.barnett@canpango.com","Is_Use_Year__c": false,"Effective_Date__c": "2019-04-18","Policy_Document__c": "https://test2.travelexinsurance.com/documentation/displaydocument.ashx?filename=TBB-1117_0204_53207.pdf","Amount_Outstanding__c": 0,"Confirmation_Number__c": "TBB93113","Purchase_Date__c": "2019-04-17","Company_DBA__c": "001m000000pAFXQAA4","Destination__c": "a1Mm000000238GREAY","Base_Plan_Cost__c": 287,"Enable_Date_of_Birth__c": true,"Enable_Save_Quote__c": true,"Plan_Type__c": "Leisure Package Plans","Coverage_Type__c": "Trip Cancellation","Is_Flight__c": false,"Is_Group__c": false,"Address_Required__c": true,"State_Required__c": true,"Total_Plan_Cost__c": 287},
            //does not work: {"sobjectType": "Enrollments__c","Source_c__c": "Phone","Country_of_residency__c": "United States","Record_Status__c": "Enrollment","Beneficiary_Details__c": "Policy Designated","Policy_Status__c": "Incomplete","Inbound_Sales_Rep__c": "DIANNE LUSERO","Policy_Fulfillment__c": "Email","State_of_Residency__c": "","Is_Use_Year__c": false,"Agent_Code__c": 0,"Confirmation_Number__c": "FIPB04358","Amount_Outstanding__c": -10,"Departure_Date__c": "2019-05-19","Return_Date__c": "2019-05-23","Purchase_Date__c": "2019-04-07","Effective_Date__c": "2019-05-19","Postmarked_Date__c": "2019-04-08","Flight_Accident_Coverage__c": "$300,000","Company_DBA__c": "001m000000ozBZyAAM","Airline__c": "a1Mm000000237tgEAA","Destination__c": "a1Mm000000238HxEAI","Base_Plan_Cost__c": 0,"Enable_Date_of_Birth__c": true,"Enable_Save_Quote__c": true,"Plan_Type__c": "Leisure Package Plans","Coverage_Type__c": "Post Departure","Is_Flight__c": true,"Is_Group__c": false,"Address_Required__c": true,"State_Required__c": true,"Total_Plan_Cost__c": 39}
             //was there {"sobjectType": "Enrollments__c","Source_c__c": "Phone","Country_of_residency__c": "United States","Record_Status__c": "Enrollment","Beneficiary_Details__c": "Policy Designated","Policy_Status__c": "Incomplete","Inbound_Sales_Rep__c": "DIANNE LUSERO","Policy_Fulfillment__c": "Email","State_of_Residency__c": "","Is_Use_Year__c": false,"Agent_Code__c": "0","Confirmation_Number__c": "FIPB04358","Amount_Outstanding__c": -10,"Departure_Date__c": "2019-05-19","Return_Date__c": "2019-05-23","Purchase_Date__c": "2019-04-07","Effective_Date__c": "2019-05-19","Postmarked_Date__c": "2019-04-08","Flight_Accident_Coverage__c": "$300,000","Company_DBA__c": "001m000000ozBZyAAM","Airline__c": "a1Mm000000237tgEAA","Destination__c": "a1Mm000000238HxEAI","Base_Plan_Cost__c": 0,"Enable_Date_of_Birth__c": true,"Enable_Save_Quote__c": true,"Plan_Type__c": "Leisure Package Plans","Coverage_Type__c": "Post Departure","Is_Flight__c": true,"Is_Group__c": false,"Address_Required__c": true,"State_Required__c": true,"Total_Plan_Cost__c": 39},
            // Send to Salesforce backend to save records
            var action = component.get('c.saveEnrollmentRecords');
            action.setParams({
                enrollment:enrollment,
                travelers: travelers,
                transactions: component.get("v.PaymentsList"),
                upgrades: component.get("v.ProductUpgrades"),
                CRCDates: component.get("v.CRCDatesList"),
                productFormNo: purchasedProduct.formNumber,
                enrollmentNotes: component.get("v.EnrollmentNotes")
            });               
            var self = this;
            action.setCallback(this, function(response) {
                console.log("saveEnrollment callback finished");
                console.log(JSON.parse(JSON.stringify(response.getState())), response.getError());
                if (response.getState() !== "SUCCESS") {
                    console.error("state " + response.getState());
                    //console.error(response.getReturnValue().Message);
                    console.log('There was a problem saving the Enrollment to Salesforce.');
                    
                    console.error("[Save To Salesforce Errors] ", JSON.parse(JSON.stringify(response.getError())));
                    alert('There was a problem saving the Enrollment to Salesforce.');
                    self.hideProcessingSpinner(component, event);
                    return;
                }
                self.hideProcessingSpinner(component, event);
                
                var responseObject = response.getReturnValue();
                
                if(!responseObject.IsSuccess){
                    component.set('v.errorModalTitle', 'Error: '+responseObject.Message);
                    self.errorModalToggle(component, event);  
                    
                    return;
                }
                
                
                // Success, empty the comments list as they already exist in Salesforce
                component.set("v.EnrollmentNotes", []);
                
				console.log(' -----------------------  ', JSON.parse(JSON.stringify(responseObject)));
                component.set("v.enrollment", responseObject.objectList.Enrollments__c[0]);

                
                console.log('Saved Enrollment to Salesforce.');
                alert('Enrollment Saved to Salesforce.');
                
            });
            
            $A.enqueueAction(action);
            
        } catch (error) {
            console.error(error);
        }
        
        console.log('end saveEnrollment');
        
        
    }, 
    generatePolicyObject: function(component) {
        // Gather data points for the payload
        var product = component.get("v.PurchasedProduct");
        var enrollment = component.get("v.enrollment");
        
        console.log(' prod: '+JSON.stringify(product));
        console.log('flight coverage: '+JSON.stringify(product.selectedFlightAccidentCoverage));
        
        // From the "Start Enrollment" tab
        var agencyId = component.get("v.validateAgencyId");
        var source = component.get("v.enrollment.Source_c__c");
        var location_number = component.find('location_number').get('v.value');
        
        
        var testDestination = parseInt(component.get('v.selectedLookUpRecordDestination').identifier);
		var testDestination2 = parseInt(component.get('v.selectedLookUpRecordDestination.identifier'));
        var testDestination3 = component.get('v.selectedLookUpRecordDestination.name');
        var testDestination4 = component.get('v.selectedLookUpRecordDestination').recordId;
        var testDestination5 = component.get('v.selectedLookUpRecordName').name;
        
        // From the "Travel Details" tab
        var destination = parseInt(component.get('v.selectedLookUpRecordDestination').identifier);
        var travelers = component.get('v.TravelersList');
        
        // From the "Agent/Trip Information" tab
        var airline = parseInt(component.get('v.selectedLookUpRecordAirline').identifier);
        var cruise_line = parseInt(component.get('v.selectedLookUpRecordCruiseLine').identifier);
        var tour_operator = parseInt(component.get('v.selectedLookUpRecordTourOperator').identifier);
        var airport = parseInt(component.get('v.selectedLookUpRecordDepartingAirport').identifier);
        
        // Product-specific additions
        var upgrades = component.get("v.ProductUpgrades");
        var crc_dates = component.get("v.ProductCRCDates");
        
        var policy = { 
            "confirmationNumber": enrollment.Confirmation_Number__c,
            "productId": product.productID,
            "agencyId": agencyId,
            "agentId": enrollment.Agent_Code__c,
            "enrollmentSource": source,
            "formNumber": product.selectedCoverage.formNumber,
            "locationNumber": location_number,
            "departureDate": this.getFormattedDate(enrollment.Departure_Date__c),
            "returnDate": this.getFormattedDate(enrollment.Return_Date__c),
            "purchaseDate": this.getFormattedDate(enrollment.Purchase_Date__c),
            "effectiveDate": this.getFormattedDate(enrollment.Effective_Date__c), 
            "postMarkedDate": this.getFormattedDate(enrollment.Postmarked_Date__c),
            "initialDepositDate": this.getFormattedDate(enrollment.Deposit_Date__c), 
            "destinationId": destination,
            "airlineId": airline,
            "cruiseLineId": cruise_line,
            "tourOperatorId": tour_operator,
            "coverageId": product.selectedCoverage.coverageID,
            "invoiceNumber": enrollment.Invoice_Number__c,
            "travelers": [],
            "upgrades": upgrades,
            "rentalVehicleDates": crc_dates,
            "groupInfo": null,
            "payments": [],
            "policyRateDetails": {},
            "policyEmails": [],
            "flightNumber": enrollment.Flight_Number__c,
            "departingAirport": airport,
            "printInNextBatch": false
        };
        
        // Generate the Traveler objects
        for(let i = 1; i <= travelers.length; i++) {
            var traveler = travelers[i-1];
            
            var traveler_data = {                
                "firstName": traveler.First_Name__c,
                "lastName": traveler.Last_Name__c,
                "dateOfBirth": this.getFormattedDate(traveler.Date_of_Birth__c),
                "tripCost": traveler.Trip_Cost__c,
                "address1": traveler.Address_1__c,
                "address2": traveler.Address_2__c,
                "city": traveler.City__c,
                "postalCode": traveler.Zip_Code__c,
                "countryName": traveler.Country__c,
                "stateName":  traveler.State__c,
                "isPrimary": traveler.Is_Primary__c,
                "travelerSequenceNumber": i
            };
            
            console.log('[generatepolicy] Traveler ID: ', JSON.parse(JSON.stringify(traveler)));
            if(traveler.RA_Traveler_ID__c) {
                traveler_data.travelerId = traveler.RA_Traveler_ID__c;
            }
            
            if(traveler.Is_Primary__c) {
                traveler_data.email = traveler.Traveler_Email__c; 
                traveler_data.dayPhone = traveler.Phone__c; 
            }
            
            policy.travelers.push(traveler_data);
        }
        
        // Generate the Policy Email objects
        var seq_num = 0;
        var emails = {
            'email1': component.find('email1').get('v.value'),
            'email2': component.find('email2').get('v.value'),
            'agent_email': component.find('agent_email').get('v.value')
        };
        
        if(emails.email1) {
            policy.policyEmails.push({
                'policyMailId': 0,
                'sequenceNo': ++seq_num,
                'eMailAddress': emails.email1,
                'emailTypeId': 0,
                'deliveryTime': null,
            });
        }
        if(emails.email2) {
            policy.policyEmails.push({
                'policyMailId': 0,
                'sequenceNo': ++seq_num,
                'eMailAddress': emails.email2,
                'emailTypeId': 1,
                'deliveryTime': null,
            });
        }
        if(emails.agent_email) {
            policy.policyEmails.push({
                'policyMailId': 0,
                'sequenceNo': ++seq_num,
                'eMailAddress': emails.agent_email,
                'emailTypeId': 3,
                'deliveryTime': null,
            });
        }
        
        // Handle adding the flight accident coverage if a plan is selected
        if(product.selectedFlightAccidentCoverage) {
            policy.flightAccidentCoverageId = product.selectedFlightAccidentCoverage.flightAccidentCoverageId;
        }
        
        return policy;
    }, 
    getFormattedDate : function (date){
        if(date){ 
            var x = new Date(date);            
            var y = x.getFullYear().toString();
            var m = (x.getMonth() + 1).toString();
            var d = x.getDate().toString();            
            (d.length == 1) && (d = '0' + d);
            (m.length == 1) && (m = '0' + m);
            return y +"-"+ m +"-"+ d;     
        } else {
            return null;
        }
    },    
    /*** VVV ***/
    errorModalToggle: function(component, helper) {
        component.set('v.errorModalToggle', !component.get('v.errorModalToggle'));
    },
    resetProductFieldVisibility: function(component, event) {
        var product = component.get('v.PurchasedProduct');
        
        if(!product.isRetail) {                        
            //Agent /Trip
            $A.util.addClass(component.find("invoice_numberDiv"), "slds-hide");           
            $A.util.addClass(component.find("agent_codeDiv"), "slds-hide"); 
            
            $A.util.addClass(component.find("departure_dateDiv"), "slds-hide");
            $A.util.addClass(component.find("return_dateDiv"), "slds-hide");           
            $A.util.addClass(component.find("deposit_dateDiv"), "slds-hide");            
            
            $A.util.addClass(component.find("postmarked_dateDiv"), "slds-hide");
            
            $A.util.addClass(component.find("destinationDiv"), "slds-hide");
            $A.util.addClass(component.find("travelDiv"), "slds-hide");                 
            
            //Primary Traveler  
            $A.util.addClass(component.find("beneficiary_detailsDiv"), "slds-hide");   
            $A.util.addClass(component.find("add_traveler_btn"), "slds-hide"); 
            
            //Policy Document Delivery
            $A.util.addClass(component.find("email1Div"), "slds-hide");
            $A.util.addClass(component.find("email2Div"), "slds-hide");
            $A.util.addClass(component.find("agent_emailDiv"), "slds-hide");
            
            //Summary       
            $A.util.addClass(component.find("trip_datesDiv"), "slds-hide");
            $A.util.addClass(component.find("destination_sumDiv"), "slds-hide");
            $A.util.addClass(component.find("transOpDiv"), "slds-hide");
            $A.util.addClass(component.find("phonesumDiv"), "slds-hide");
            $A.util.addClass(component.find("emailsumDiv"), "slds-hide");
            $A.util.addClass(component.find("recipients_sumDiv"), "slds-hide");
            $A.util.addClass(component.find("tripCostsumDiv"), "slds-hide"); 
            $A.util.addClass(component.find("addressDiv"), "slds-hide");                        
            
        } 
        
        // isFlight
        if(!product.isFlight) {
            $A.util.addClass(component.find("invoice_numberDiv"), "slds-hide");          
            $A.util.addClass(component.find("agent_codeDiv"), "slds-hide"); 
            
            $A.util.addClass(component.find("departure_dateDiv"), "slds-hide");
            $A.util.addClass(component.find("return_dateDiv"), "slds-hide");           
            $A.util.addClass(component.find("deposit_dateDiv"), "slds-hide");            
            
            $A.util.addClass(component.find("postmarked_dateDiv"), "slds-hide");
            
            $A.util.addClass(component.find("destinationDiv"), "slds-hide");
            $A.util.addClass(component.find("travelDiv"), "slds-hide");                   
            $A.util.addClass(component.find("is_flightDiv"), "slds-hide");  
            
            //Primary Traveler
            $A.util.addClass(component.find("beneficiary_detailsDiv"), "slds-hide");   
            $A.util.addClass(component.find("add_traveler_btn"), "slds-hide");                        				            
            
            //Policy Document Delivery
            $A.util.addClass(component.find("email1Div"), "slds-hide");
            $A.util.addClass(component.find("email2Div"), "slds-hide");
            $A.util.addClass(component.find("agent_emailDiv"), "slds-hide");
            
            //Summary       
            $A.util.addClass(component.find("trip_datesDiv"), "slds-hide");
            $A.util.addClass(component.find("destination_sumDiv"), "slds-hide");
            $A.util.addClass(component.find("transOpDiv"), "slds-hide");
            $A.util.addClass(component.find("phonesumDiv"), "slds-hide");
            $A.util.addClass(component.find("emailsumDiv"), "slds-hide");
            $A.util.addClass(component.find("recipients_sumDiv"), "slds-hide");
            $A.util.addClass(component.find("tripCostsumDiv"), "slds-hide");
            $A.util.addClass(component.find("addressDiv"), "slds-hide");            
        }                    
        // isUseYear
        if(!product.isUseYear) {
            $A.util.addClass(component.find("invoice_numberDiv"), "slds-hide");           
            $A.util.addClass(component.find("agent_codeDiv"), "slds-hide"); 
            
            //Effective Date and Purchase Date Post Marked always exist            
            $A.util.addClass(component.find("postmarked_dateDiv"), "slds-hide");
            
            $A.util.addClass(component.find("is_use_yearDiv"), "slds-hide"); 
            
            //Primary Traveler   
            $A.util.addClass(component.find("traveler_emailDiv"), "slds-hide");     
            $A.util.addClass(component.find("beneficiary_detailsDiv"), "slds-hide");   
            
            //Policy Document Delivery
            $A.util.addClass(component.find("email1Div"), "slds-hide");
            $A.util.addClass(component.find("email2Div"), "slds-hide");
            $A.util.addClass(component.find("agent_emailDiv"), "slds-hide");    
            
            //Summary     
            $A.util.addClass(component.find("useYearDatesDiv"), "slds-hide");
            $A.util.addClass(component.find("emailsumDiv"), "slds-hide"); 
            $A.util.addClass(component.find("recipients_sumDiv"), "slds-hide"); 
            $A.util.addClass(component.find("phonesumDiv"), "slds-hide");
        }        
        
        // isGroup
        if(!product.isGroupProduct) {        
            $A.util.addClass(component.find("agent_codeDiv"), "slds-hide"); //add = hide.            
            
	        //$A.util.addClass(component.find("deposit_dateDiv"), "slds-hide");            
            
            //Effective Date and Purchase Date always active
            $A.util.addClass(component.find("postmarked_dateDiv"), "slds-hide");
            
            $A.util.addClass(component.find("destinationDiv"), "slds-hide");               
            $A.util.addClass(component.find("is_groupDiv"), "slds-hide");
            //$A.util.addClass(component.find("is_collectionDiv"), "slds-hide"); ;
            
            //Primary Traveler
            $A.util.addClass(component.find("ageDiv"), "slds-hide");        
            $A.util.addClass(component.find("traveler_emailDiv"), "slds-hide");     
            $A.util.addClass(component.find("isGroupDatesDiv"), "slds-hide");    
            $A.util.addClass(component.find("add_traveler_btn"), "slds-hide");
            
            //Policy Document Delivery
            $A.util.addClass(component.find("email1Div"), "slds-hide");
            $A.util.addClass(component.find("email2Div"), "slds-hide");
            $A.util.addClass(component.find("agent_emailDiv"), "slds-hide"); 
            
            //Summary
            $A.util.addClass(component.find("destination_sumDiv"), "slds-hide");
            $A.util.addClass(component.find("transOpDiv"), "slds-hide");
            $A.util.addClass(component.find("emailsumDiv"), "slds-hide");
            $A.util.addClass(component.find("tripCostsumDiv"), "slds-hide");    
            
            //Payment
            var url = new URL(window.location.href);
            var confirmationNumber = url.searchParams.get("confirmationNumber"); //Edit Mode               
            if(confirmationNumber){
                $A.util.addClass(component.find("show_group_plans"), "slds-hide");
            } 
        }  
        // isStudentGroup
        if(!product.isStudentGroupProduct) {       
            $A.util.addClass(component.find("agent_codeDiv"), "slds-hide");
            
            //$A.util.addClass(component.find("deposit_dateDiv"), "slds-hide");            
            
            $A.util.addClass(component.find("postmarked_dateDiv"), "slds-hide");
            
            //Primary Traveler
            $A.util.addClass(component.find("age_categoryDiv"), "slds-hide");     
            $A.util.addClass(component.find("cfarDiv"), "slds-hide");     
            $A.util.addClass(component.find("isGroupDatesDiv"), "slds-hide");            
            $A.util.addClass(component.find("add_traveler_btn"), "slds-hide");
            
            $A.util.addClass(component.find("traveler_emailDiv"), "slds-hide");                 
            
            $A.util.addClass(component.find("destinationDiv"), "slds-hide");                 
            $A.util.addClass(component.find("is_groupDiv"), "slds-hide");
            //$A.util.addClass(component.find("is_collectionDiv"), "slds-hide"); 
            
            //Policy Document Delivery
            $A.util.addClass(component.find("email1Div"), "slds-hide");
            $A.util.addClass(component.find("email2Div"), "slds-hide");
            $A.util.addClass(component.find("agent_emailDiv"), "slds-hide");          
            
            //Summary
            $A.util.addClass(component.find("destination_sumDiv"), "slds-hide");
            $A.util.addClass(component.find("emailsumDiv"), "slds-hide"); 
            $A.util.addClass(component.find("tripCostsumDiv"), "slds-hide"); 
            
            var url = new URL(window.location.href);
            var confirmationNumber = url.searchParams.get("confirmationNumber"); //Edit Mode  
            
            if(confirmationNumber){
                $A.util.addClass(component.find("show_group_plans"), "slds-hide");
            }        
        }
        // enableDateOfBirth
        if(!product.enableDOB){
            $A.util.addClass(component.find("dateOfBirthDiv"), "slds-hide");                      
        }         
        // enableSavedQuotes
        if(!product.enableSavedQuotes){ 
            component.set("v.PurchasedProduct.enableSavedQuotes", false);
            
            //Hide Quote Tab            
			$A.util.addClass(component.find('savequote'), 'slds-hide');          
        } 
        if(!product.isAddressRequired){                         
            
        } 
        if(!product.requireState){        
            
        }          
    },     
    setProductFieldVisibility : function(component, event) {
        // Clear all fields before processing new product
        this.resetProductFieldVisibility(component, event); 
        // Grab the last selected product
        
        var product = component.get('v.PurchasedProduct');
        
        console.log('--- '+JSON.stringify(product));
        
        component.set('v.PurchasedProduct',product);
        
        //alert('NB TESTING:\n IsRetail: '+product.isRetail+'\n IsFlight: '+product.isFlight+'\n IsUseYear: '+product.isUseYear+'\n IsGroup: '+product.isGroupProduct+'\n isStudentGroupProduct: '+product.isStudentGroupProduct+'\n enableDOB: '+product.enableDOB+'\n enableSavedQuotes: '+product.enableSavedQuotes+'\n isAddressRequired: '+product.isAddressRequired+'\n requireState: '+product.requireState);
        // isRetail
        if(product.isRetail) {
            
            //Agent /Trip
            $A.util.removeClass(component.find("invoice_numberDiv"), "slds-hide");           
            $A.util.removeClass(component.find("agent_codeDiv"), "slds-hide"); 
            
            $A.util.removeClass(component.find("departure_dateDiv"), "slds-hide");
            $A.util.removeClass(component.find("return_dateDiv"), "slds-hide");           
            $A.util.removeClass(component.find("deposit_dateDiv"), "slds-hide");            
            
            $A.util.removeClass(component.find("postmarked_dateDiv"), "slds-hide");
            
            $A.util.removeClass(component.find("destinationDiv"), "slds-hide");
            $A.util.removeClass(component.find("travelDiv"), "slds-hide");                 
            
            //Primary Traveler  
            $A.util.removeClass(component.find("beneficiary_detailsDiv"), "slds-hide");   
            $A.util.removeClass(component.find("add_traveler_btn"), "slds-hide"); 
            
            //Policy Document Delivery
            //$A.util.removeClass(component.find("emailsDiv"), "slds-hide");
            
            $A.util.removeClass(component.find("email1Div"), "slds-hide");
            $A.util.removeClass(component.find("email2Div"), "slds-hide");
            $A.util.removeClass(component.find("agent_emailDiv"), "slds-hide");
            
            //Summary       
            $A.util.removeClass(component.find("trip_datesDiv"), "slds-hide");
            $A.util.removeClass(component.find("destination_sumDiv"), "slds-hide");
            $A.util.removeClass(component.find("transOpDiv"), "slds-hide");
            $A.util.removeClass(component.find("phonesumDiv"), "slds-hide");
            $A.util.removeClass(component.find("emailsumDiv"), "slds-hide");
            $A.util.removeClass(component.find("recipients_sumDiv"), "slds-hide");
            $A.util.removeClass(component.find("tripCostsumDiv"), "slds-hide"); 
            $A.util.removeClass(component.find("addressDiv"), "slds-hide");                        
            
        }    
        // isFlight
        if(product.isFlight) {
            $A.util.removeClass(component.find("invoice_numberDiv"), "slds-hide");          
            $A.util.removeClass(component.find("agent_codeDiv"), "slds-hide"); 
            
            $A.util.removeClass(component.find("departure_dateDiv"), "slds-hide");
            $A.util.removeClass(component.find("return_dateDiv"), "slds-hide");           
            $A.util.removeClass(component.find("deposit_dateDiv"), "slds-hide");            
            
            $A.util.removeClass(component.find("postmarked_dateDiv"), "slds-hide");
            
            
            $A.util.removeClass(component.find("destinationDiv"), "slds-hide");
            $A.util.removeClass(component.find("travelDiv"), "slds-hide");                   
            $A.util.removeClass(component.find("is_flightDiv"), "slds-hide");  
            
            //Primary Traveler
            $A.util.removeClass(component.find("beneficiary_detailsDiv"), "slds-hide");   
            $A.util.removeClass(component.find("add_traveler_btn"), "slds-hide");                        				            
            
            
            //Policy Document Delivery
            $A.util.removeClass(component.find("email1Div"), "slds-hide");
            $A.util.removeClass(component.find("email2Div"), "slds-hide");
            $A.util.removeClass(component.find("agent_emailDiv"), "slds-hide");
            
            //Summary       
            $A.util.removeClass(component.find("trip_datesDiv"), "slds-hide");
            $A.util.removeClass(component.find("destination_sumDiv"), "slds-hide");
            $A.util.removeClass(component.find("transOpDiv"), "slds-hide");
            $A.util.removeClass(component.find("phonesumDiv"), "slds-hide");
            $A.util.removeClass(component.find("emailsumDiv"), "slds-hide");
            $A.util.removeClass(component.find("recipients_sumDiv"), "slds-hide");
            $A.util.removeClass(component.find("tripCostsumDiv"), "slds-hide");
            $A.util.removeClass(component.find("addressDiv"), "slds-hide");            
            
        }        
        // isUseYear
        if(product.isUseYear) {
            $A.util.removeClass(component.find("invoice_numberDiv"), "slds-hide");           
            $A.util.removeClass(component.find("agent_codeDiv"), "slds-hide"); 
            
            //Effective Date and Purchase Date Post Marked always exist            
            $A.util.removeClass(component.find("postmarked_dateDiv"), "slds-hide");
            
            $A.util.removeClass(component.find("is_use_yearDiv"), "slds-hide"); 
            
            
            //Primary Traveler   
            $A.util.removeClass(component.find("traveler_emailDiv"), "slds-hide");     
            $A.util.removeClass(component.find("beneficiary_detailsDiv"), "slds-hide");   
            //
            
            //Policy Document Delivery
            $A.util.removeClass(component.find("email1Div"), "slds-hide");
            $A.util.removeClass(component.find("email2Div"), "slds-hide");
            $A.util.removeClass(component.find("agent_emailDiv"), "slds-hide");    
            
            //Summary     
            $A.util.removeClass(component.find("useYearDatesDiv"), "slds-hide");
            $A.util.removeClass(component.find("emailsumDiv"), "slds-hide"); 
            $A.util.removeClass(component.find("recipients_sumDiv"), "slds-hide"); 
            $A.util.removeClass(component.find("phonesumDiv"), "slds-hide");
            
        }
        
        if(product.isGroupProduct) {         
            $A.util.removeClass(component.find("agent_codeDiv"), "slds-hide"); //add = hide.            
            
           // $A.util.removeClass(component.find("deposit_dateDiv"), "slds-hide");            
            
            //Effective Date and Purchase Date always active
            $A.util.removeClass(component.find("postmarked_dateDiv"), "slds-hide");
            
            $A.util.removeClass(component.find("destinationDiv"), "slds-hide");               
            $A.util.removeClass(component.find("is_groupDiv"), "slds-hide");
            //$A.util.removeClass(component.find("is_collectionDiv"), "slds-hide");
            
            
            //Primary Traveler
            $A.util.removeClass(component.find("ageDiv"), "slds-hide");        
            $A.util.removeClass(component.find("traveler_emailDiv"), "slds-hide");     
            $A.util.removeClass(component.find("isGroupDatesDiv"), "slds-hide");    
            $A.util.removeClass(component.find("add_traveler_btn"), "slds-hide");
            
            //Policy Document Delivery
            $A.util.removeClass(component.find("email1Div"), "slds-hide");
            $A.util.removeClass(component.find("email2Div"), "slds-hide");
            $A.util.removeClass(component.find("agent_emailDiv"), "slds-hide");
            
            //Summary
            $A.util.removeClass(component.find("destination_sumDiv"), "slds-hide");
            $A.util.removeClass(component.find("transOpDiv"), "slds-hide");
            $A.util.removeClass(component.find("emailsumDiv"), "slds-hide");
            $A.util.removeClass(component.find("tripCostsumDiv"), "slds-hide");    
            
            //Payment
            var url = new URL(window.location.href);
            var confirmationNumber = url.searchParams.get("confirmationNumber"); //Edit Mode               
            if(confirmationNumber){
                $A.util.removeClass(component.find("show_group_plans"), "slds-hide");
            }            
        }
        // isStudentGroup 
        if(product.isStudentGroupProduct) {            
            $A.util.removeClass(component.find("agent_codeDiv"), "slds-hide");
            
           // $A.util.removeClass(component.find("deposit_dateDiv"), "slds-hide");             
            
            $A.util.removeClass(component.find("postmarked_dateDiv"), "slds-hide");
            
            //Primary Traveler
            $A.util.removeClass(component.find("age_categoryDiv"), "slds-hide");     
            $A.util.removeClass(component.find("cfarDiv"), "slds-hide");     
            $A.util.removeClass(component.find("isGroupDatesDiv"), "slds-hide");            
            $A.util.removeClass(component.find("add_traveler_btn"), "slds-hide");
            
            $A.util.removeClass(component.find("traveler_emailDiv"), "slds-hide");                 
            
            $A.util.removeClass(component.find("destinationDiv"), "slds-hide");                 
            $A.util.removeClass(component.find("is_groupDiv"), "slds-hide");
            //$A.util.removeClass(component.find("is_collectionDiv"), "slds-hide");   
            
            //Policy Document Delivery
            $A.util.removeClass(component.find("email1Div"), "slds-hide");
            $A.util.removeClass(component.find("email2Div"), "slds-hide");
            $A.util.removeClass(component.find("agent_emailDiv"), "slds-hide");        
            
            //Summary
            $A.util.removeClass(component.find("destination_sumDiv"), "slds-hide");
            $A.util.removeClass(component.find("emailsumDiv"), "slds-hide"); 
            $A.util.removeClass(component.find("tripCostsumDiv"), "slds-hide"); 
            
            var url = new URL(window.location.href);
            var confirmationNumber = url.searchParams.get("confirmationNumber"); //Edit Mode  
            
            if(confirmationNumber){
                $A.util.removeClass(component.find("show_group_plans"), "slds-hide");
            }              
        }  
        
        // enableDateOfBirth
        if(product.enableDOB){
            $A.util.removeClass(component.find("dateOfBirthDiv"), "slds-hide");                        
        } 
        // enableSavedQuotes
        if(product.enableSavedQuotes){
            component.set("v.PurchasedProduct.enableSavedQuotes", true);
               
            $A.util.removeClass(component.find('savequote'), 'slds-hide');   
        }
        if(product.isAddressRequired){                           
            
        }
        if(product.requireState){      
            
        }        
    },
    
    /*** Product Selection Methods ***/
    productSelectionCreateTabs: function(component, event) {
        // Trash old product tabs first, to be replaced by latest API data        
        component.set('v.ProductFamilyTabs', []);
        
        // Pull latest product list
        var product_list = component.get('v.planSelectionProducts');
        
        var plan_type_map = component.get('v.PlanTypeMap');
        
        // Iterate over products to create a unique list of "plan types" for tabs
        var product_family_map = product_list.reduce(function(fam_map, product) {
            var key = plan_type_map[product['planTypeId']];
            
            fam_map[key] ? fam_map[key].push(product) : fam_map[key] = [product];
            return fam_map;
        }, {});
        
        var tab_components = {};
        var enrollment_data = {
            'departureDate': component.get('v.enrollment.Departure_Date__c'),
            'returnDate': component.get('v.enrollment.Return_Date__c'),
            'haveDefaulted': false
        };
        
        // For each family, generate the tab and the underlying product components
        for (let family of Object.keys(product_family_map)) {
            
            // Create a tab for the family
            var tab_id = "product_tab"; // + family;
            tab_components[family] = [];
            tab_components[family].push(["lightning:tab", {
                "aura:id": tab_id,
                //"label": family.toString(),
                "onactive": null
            }]);
            tab_components[family].push(['aura:text', {"value": family.toString()}]);
            
            for (let product of product_family_map[family]) {
                // Create the product components beneath it
                var product_id = "product_" + product['productID'];
                tab_components[family].push([
                    "c:EnrollmentProduct",
                    {
                        "aura:id": 'product_card', //product_id,
                        "ProductInfo": product,
                        "FamilyId": family,
                        "EnrollmentData": enrollment_data
                    }
                ]);
            }
        }
        
        // For each family, create the tab and it's contents - set the hierarchy, then add to our big "tab-body"
        for (let family of Object.keys(tab_components)) {
            $A.createComponents(tab_components[family], function(components, status, error) {
                if (status != "SUCCESS") {
                    console.log('[##] ERROR | Problem encountered during Product tab creation.', error);
                    return;
                }
                
                // Pop the first component off the list, that's our tab, add the rest to it's body
                var tab_element = components.shift();
                var tab_label = components.shift();
                tab_element.set("v.label", tab_label);
                tab_element.set("v.body", components);
                
                // Add our product components to the global list
                var product_components = component.get('v.productComponents');
                product_components = product_components.concat(components);
                component.set('v.productComponents', product_components);
                
                // Get our ProductFamilyTabs section and append this tab to it
                var tabset = component.get('v.ProductFamilyTabs');
                tabset.push(tab_element);
                component.set('v.ProductFamilyTabs', tabset);
            });
        }
    },
    compareReturnedLocationNumber: function(component, event) {
        var returned_loc = component.get('v.validateLocationNumber');
        var original_loc = component.find('location_number').get('v.value');
        
        if(returned_loc == original_loc) {
            // The returned LocationNumber matched what we sent, just enable moving forward
            component.set('v.startEnrollmentTab', true); // Show Travel Details tab
            component.set("v.goFowardButton", false);    // Enable the 'Next' button
            
            this.hideProcessingSpinner(component, event);
            return;
        }
        
        if(!returned_loc || !original_loc){
            return;
        }
        var self = this;
        var action = component.get("c.getAccountByLocation");
        
        action.setParams({
            'locationNumber': returned_loc
        });
        action.setCallback(this, function(response) {
            var returned_account = response.getReturnValue();
            component.set("v.account", returned_account); 
            component.set("v.selectedLookUpRecordName.name", returned_account.Name+' - '+returned_account.Location_Number__c); 
            component.set("v.selectedLookUpRecordName.recordId", returned_account.Id);
            
            component.find('location_number').set('v.value', returned_loc);
            component.set('v.startEnrollmentTab', true); // Show Travel Details tab
            component.set("v.goFowardButton", false);    // Enable the 'Next' button
            
            self.hideProcessingSpinner(component, event);
        });
        
        $A.enqueueAction(action);   
    },
    showProcessingSpinner: function(component, event) {
        $A.util.removeClass(component.find('processing-spinner'), 'slds-hide');
    },
    getEnZip: function(component, recordId) {
        let action = component.get("c.getEnZipCon");
        action.setParams({recordId: recordId});
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                component.set("v.enrollment.Zip_Code__c", response.getReturnValue());
                console.log(component.get("v.enrollment.Zip_Code__c"));
            } else if (response.getState() === "INCOMPLETE") {} else if (response.getState() === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    hideProcessingSpinner: function(component, event) {
        $A.util.addClass(component.find('processing-spinner'), 'slds-hide');  
    },
    
    backDatePolicyTransferHelper: function(component, event) {
        //Get response
        var response = component.get("v.PolicyTransferResponse");
        //Find out if its process
        
        //pop out a moday asking the user if they want to  back date        
        $A.util.removeClass(component.find('policy_transfer_window'), 'slds-fade-in-open');
        $A.util.removeClass(component.find('policy_transfer_window_backdrop'), 'slds-backdrop--open');      
        //alert("response.rolloverMessage: "+response.rolloverMessage); 
        response.rolloverMessage = 'test';
        if(response.rolloverMessage){
            $A.util.addClass(component.find('back_date_policy_window'), 'slds-fade-in-open');
            $A.util.addClass(component.find('back_date_policy_backdrop'), 'slds-backdrop--open');
        }        
    },
    /*******************************************************************************
     *******************************************************************************
     *******************************************************************************/    
    validateTransferApiHelper: function(component, event) {
        var url = component.get('v.BaseURL') + '/validatePolicyTransfer';
        
        var confirmationNumber = component.get("v.confirmationNumber"); 
        var locationNumber = component.get("v.account.Location_Number__c");
        
        var data = {"confirmationNumber": confirmationNumber,"newLocationNumber": locationNumber};
        
        var self = this;
        self.showProcessingSpinner(component, event);
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(function(response) {
            console.log('[validatePolicyTransfer] Request Payload: ', JSON.stringify(data));
            console.log('[validatePolicyTransfer] Full Response:', JSON.stringify(response));
            component.set("v.PolicyTransferResponse",response);
            
            if (response.status == "Failure") {
                self.hideProcessingSpinner(component, event);
                component.set('v.errorModalTitle', response.status);
                component.set('v.errorModalMessage', [{"errorMessages": [response.message]}]);
                self.errorModalToggle(component, event);
                
                self.cancelValidatePolicyTransaferHelper(component, event);
                return;
            }
            
            component.set("v.PolicyTransferStatus",response.status);
            var res = " Agency Id: "+response.agencyId+"\n Can Be Back Dated Message: "+response.canBeBackDatedMessage+"\n Location Number:"+response.locationNumber+"\n Message: "+response.message+"\n New Product Form Number: "+response.newProductFormNumber+"\n Product Id: "+response.productId+"\n rolloverMessage: "+response.rolloverMessage;
            component.set("v.PolicyTransferMessage",res);
            
            var product_info = JSON.parse(JSON.stringify(response));
            
            
            
            $A.util.addClass(component.find('policy_transfer_window'), 'slds-fade-in-open');
            $A.util.addClass(component.find('policy_transfer_window_backdrop'), 'slds-backdrop--open'); 
            
            self.hideProcessingSpinner(component, event);                       
            self.compareReturnedLocationNumber(component, event);
            
        }).catch(function(error) {
            self.hideProcessingSpinner(component, event);
            console.error('[validate] Error: ', error);
            
            component.set('v.errorModalTitle', 'Network Error');
            component.set('v.errorModalMessage', [{"errorMessages": [error]}]);
            
            self.errorModalToggle(component, event);
        });        
    },
    
    
    /*** Travelex API Callouts ***/
    gatherValidationErrors: function (component, response) {
        var validation_errors = [];
        if(!response.policy) {
            component.set('v.errorModalTitle', response.status);
            component.set('v.errorModalMessage', [{"errorMessages": [response.message]}]);
            return;
        }
        
        var policy = response.policy;
        validation_errors.push(...policy.validationErrors);
        
        if(policy.travelers && policy.travelers.length) {
            for(let t of policy.travelers) {
                validation_errors.push(...(t.validationErrors || []));
                for(let u of t.upgrades) {
                    validation_errors.push(...(u.validationErrors|| []));
                }
            }
        }
        
        if(policy.upgrade && policy.upgrade.length) {
            for(let u of policy.upgrades) {
                validation_errors.push(...(u.validationErrors || []));
            }
        }
        
        if(policy.rentalVehicleDates && policy.rentalVehicleDates.length) {
            for(let d of policy.rentalVehicleDates) {
                validation_errors.push(...(d.validationErrors || []));
            }
        }
        
        if(policy.groupInfo) {
            valdiation_errors.push(...policy.groupInfo.validationErrors);
        }
        
        if(policy.payments && policy.payments.length) {
            for(let p of policy.payments) {
                validation_errors.push(...(p.validationErrors|| []));
            }
        }
        
        if(policy.policyEmails && policy.policyEmails.length) {
            for(let e of policy.policyEmails) {
                validation_errors.push(... (e.validationErrors || []));
            }
        }
        
        component.set('v.errorModalTitle', response.message);
        component.set('v.errorModalMessage', validation_errors);
    },
    travelexAPIValidateLocationNumber: function(component, event) {
        var url = component.get('v.BaseURL') + '/validatelocationnumber';
        var data = component.get('v.validatePayload');
        component.set('v.validateResponseFlag', false);
        
        var self = this;
        self.showProcessingSpinner(component, event);
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(function(response) {
            console.log('[validate] Request Payload: ', JSON.stringify(data));
            console.log('[validate] Full Response:', response);
            
            if (response.status == "Failure") {
                self.hideProcessingSpinner(component, event);
                //component.set('v.errorModalTitle', response.status);
                //component.set('v.errorModalMessage', [{"errorMessages": [response.message]}]);
                self.gatherValidationErrors(component, response);
                self.errorModalToggle(component, event);
                return;
            }
            
            console.log('[status] Validate API | Success. Setting flag and location number.');
            
            component.set('v.validateResponseFlag', true);
            component.set('v.validateAgencyId', response.agencyId);
            component.set('v.validateLocationNumber', response.locationNumber);
            
            self.compareReturnedLocationNumber(component, event);
            
        }).catch(function(error) {
            self.hideProcessingSpinner(component, event);
            console.error('[validate] Error: ', error);
            
            component.set('v.errorModalTitle', 'Error');
            component.set('v.errorModalMessage', [{"errorMessages": [error]}]);
            self.errorModalToggle(component, event);
        });
    },
    travelexAPIGetPlanSelection: function(component, event) {
        var url = component.get('v.BaseURL') + '/getplanselection';
        var data = component.get('v.planSelectionPayload');
        
        var self = this;
        window.scrollTo(0, 0);
        self.showProcessingSpinner(component, event);
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(function(response) {
            console.log('[getplanselection] Request Payload: ', JSON.stringify(data));
            console.log('[getplanselection] Full Response: ', response);
            
            if (response.status == "Failure") {
                self.hideProcessingSpinner(component, event);
                //component.set('v.errorModalTitle', response.status);
                //component.set('v.errorModalMessage', [{"errorMessages": [response.message]}]);
                self.gatherValidationErrors(component, response);
                self.errorModalToggle(component, event);
                
                return;
            }
            
            if (response.noProductMessage != null) {
                self.hideProcessingSpinner(component, event);
                
                component.set('v.errorModalTitle', 'Product Retrieval Error');
                component.set('v.errorModalMessage', [{"errorMessages": [response.noProductMessage]}]);
                self.errorModalToggle(component, event);
                
                return;
            }
            
            console.log('[status] GetPlanSelection API | Success. Saving available products and advancing to next tab.');
            component.set('v.planSelectionProducts', response.products);
            
            // We got data back, let's generate our tabs/product cards
            self.productSelectionCreateTabs(component, event);
            
            $A.enqueueAction(component.get('c.goForward'));
            self.hideProcessingSpinner(component, event);
            
            
        }).catch(function(error) {
            console.error('[getplanselection] Error: ', error);
            component.set('v.errorModalTitle', 'Error');
            component.set('v.errorModalMessage', [{"errorMessages": [error]}]);
            self.errorModalToggle(component, event);
        });
    },
    travelexAPIValidateAndRatePolicy: function(component, event) {
        var url = component.get('v.BaseURL') + '/validateandratepolicy';
        var data = component.get('v.validateAndRatePolicyPayload');
        
        var self = this;
        self.showProcessingSpinner(component, event);
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(function(response) {
            console.log('[validateandratepolicy] Request Payload ', JSON.stringify(data));
            console.log('[validateandratepolicy] Full Response ', response);
            
            if (response.status == "Failure") {
                self.hideProcessingSpinner(component, event);

                self.gatherValidationErrors(component, response);
                self.errorModalToggle(component, event);
                return;
            }
            

            console.log('[status] ValidateAndRatePolicy API | Success.');
            
            // Find the right DOC document
            var document = null;
            for(var x in response.documents) {
                if(response.documents[x].documentTypeId === 2) {
                    document = response.documents[x];
                }
            }
            
            // Set the document where needed
            component.find('document_display').set('v.items', response.documents);
            component.set('v.enrollment.Policy_Document__c', document.url);
            component.set('v.policyDocument', document);
            
            // Set the total cost and amount outstanding
            component.set('v.TotalCost', response.policyCostPaymentSummary.totalPolicyCost);
            component.set('v.policy_trans.Amount__c', response.policyCostPaymentSummary.totalOutstandingAmount);
            component.set('v.enrollment.Amount_Outstanding__c', response.policyCostPaymentSummary.totalOutstandingAmount);

            //Payment Tab IsGroup amount, visible upon edit enrollment
            component.set('v.policy_trans.Total_Due__c', response.policyCostPaymentSummary.totalClientCost);            
            component.set('v.policy_trans.Total_Client_Paid__c', response.policyCostPaymentSummary.totalClientPaid);
            component.set('v.policy_trans.Total_Paid__c', response.policyCostPaymentSummary.totalPaid);            
            component.set('v.policy_trans.Client_Outstanding_Amount__c', response.policyCostPaymentSummary.clientOutstandingAmount);
            component.set('v.policy_trans.Outstanding__c', response.policyCostPaymentSummary.totalOutstandingAmount); 
            
            // Set the email on Save Quote tab
            var sq_email = component.get('v.enrollment.Email1__c');
            console.log('SQ Email ', sq_email);
            component.find('saveQuoteEmail').set('v.value', sq_email);
            
            // Set the payment options list
            component.set('v.payment_type', response.productPaymentList);
            component.set('v.refund_type', response.refundPaymentList);
            

            //Calculate Rate Button
            if(component.get("v.calculateRate")){             	           
                self.hideProcessingSpinner(component, event);
                component.set("v.calculateRate", false);
                                 
                //Show
                component.set("v.CalculateRateModalShow", true);         
                 
                return;
            }
            
            // Advance forward a tab
            $A.enqueueAction(component.get('c.goForward'));            
            
            self.hideProcessingSpinner(component, event);
        }).catch(function(error) {
            self.hideProcessingSpinner(component, event);
            
            console.error('[validateandratepolicy] Error: ', error);
            
            component.set('v.errorModalTitle', 'Error');
            component.set('v.errorModalMessage', [{"errorMessages": [error]}]);
            self.errorModalToggle(component, event);
        });
    },
    travelexAPISendVirtualObserverCommand: function(component, event) {
        var url = component.get('v.BaseURL') + '/sendvirtualobservercommand';
        
        // Need to gather SF or Conf# if we have it
        var data = {"command": "STOP"};  //, "salesForceId": "TBB74730"};
        var enroll = component.get("v.enrollment");
        if(enroll.Confirmation_Number__c) {
            data.salesForceId = enroll.confirmation_Number__c;
        }
        
        if(enroll.Id) { 
            data.salesForceId = enroll.Id;
        }
        
        var self = this;
        self.showProcessingSpinner(component, event);
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(function(response) {
            console.log('[sendvirutalobservercommand] Request Payload ', JSON.stringify(data));
            console.log('[sendvirutalobservercommand] Full Response ', response);
            
            self.hideProcessingSpinner(component, event);
            if (response.status == "Failure") {
                self.gatherValidationErrors(component, response);
                self.errorModalToggle(component, event);
                return;
            }
            
            /*
            component.set('v.errorModalTitle', response.status);
            component.set('v.errorModalMessage', [{"errorMessages": ['The phone recording has been halted, free to collect credit card details. '+JSON.stringify(response)]}]);
            self.errorModalToggle(component, event);
            */
            
            console.log('[status] SendVirtualObserverCommand API | Success. Phone Recording Halted.');
        }).catch(function(error) {    	
            console.error('[sendvirtualobservercommand] Error: ', error);
            component.set('v.errorModalTitle', 'Error');
            component.set('v.errorModalMessage', error);
            self.errorModalToggle(component, event);
        });
    },
    travelexAPISavePolicyQuote: function(component, event) {
        var url = component.get('v.BaseURL') + '/savepolicyquote';
        var data = component.get('v.savePolicyQuotePayload');
        
        var self = this;
        self.showProcessingSpinner(component, event);
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(function(response) {
            console.log('[savePolicyQuote] Request Payload ', JSON.stringify(data));
            console.log('[savePolicyQuote] Full Response ', response);
            
            self.hideProcessingSpinner(component, event);
            if (response.status == "Failure") {
                self.gatherValidationErrors(component, event);
                self.errorModalToggle(component, event);
                return;
            }
            
            console.log('[status] SavePolicyQuote API | Success.');
            component.set('v.SaveQuoteMessage', response.message);
            
            // Put the quote number on the Enrollment object
            component.set('v.enrollment.Quote_Number__c', response.savedQuote.policyQuoteNo);

            self.convertAPITravelers(component, event, response.savedQuote.policy.travelers);
			self.convertAPICRCDates(component, event, response.savedQuote.policy.rentalVehicleDates);

			console.log(JSON.parse(JSON.stringify(component.get("v.enrollment"))));
            
            // self.saveEnrollment(component, event);
        }).catch(function(error) {
            console.error('[savePolicyQuote] Error: ', error);
            
            component.set('v.errorModalTitle', 'Error');
            component.set('v.errorModalMessage', error);
            self.errorModalToggle(component, event);
        });
    },
    travelexAPIValidateTravelerRates: function(component, event) {
        var url = component.get('v.BaseURL') + '/validatetravelerrates';
        var data = component.get('v.validateTravelerRatesPayload');
        
        var self = this;
		self.showProcessingSpinner(component, event);
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(function(response) {
            console.log('[validatetravelerrates] Request Payload ', JSON.stringify(data));
            console.log('[validatetravelerrates] Full Response ', response); 
            
            self.hideProcessingSpinner(component, event);
            if (response.status == "Failure") {               
                self.gatherValidationErrors(component, response);
                self.errorModalToggle(component, event);
                return;
            }
            
            console.log('[status] ValidateTravelerRates API | Success. Showing TravelerRates modal.');

            // Show the modal
            $A.util.removeClass(component.find('traveler_rates_modal'), 'slds-hide');            
            
            // Set policy data to populate modal
            component.set("v.policyRateDetail", response.policyRateDetailByTraveler);
            
            // Update our total plan cost with new data
            component.set("v.TotalCost", response.policyRateDetailByTraveler.totalPolicyCost);
            
            // Call helper method to push data back into product card
            self.processTravelerRateInfo(component, event);
            
            
        }).catch(function(error) {    	
            console.error('[validatetravelerrates] Error: ', error);
            component.set('v.errorModalTitle', 'Error');
            component.set('v.errorModalMessage', error);
            self.errorModalToggle(component, event);
        });
    },
    travelexAPISavePolicy: function(component, event) {
    	var url = component.get('v.BaseURL') + '/savepolicy';
        var data = component.get('v.savePolicyPayload');
        var errorMessage = '';
        
        var self = this;
        self.showProcessingSpinner(component, event);
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(function(response) {
            console.log('[savepolicy] Request Payload ', JSON.stringify(data));
            console.log('[savepolicy] Full Response ', response);
            console.log('[savepolicy] Full Response JSON String ', JSON.stringify(response));

            self.hideProcessingSpinner(component, event);
            if (response.status == "Failure") {   
                component.set('v.errorModalTitle', 'Network Error');
                component.set('v.errorModalMessage', response);                       
                self.gatherValidationErrors(component, response);
                self.errorModalToggle(component, event);                
        
                return;
            }
            
            console.log('[status] SavePolicy API | Success.');
            
            // Set the total cost and amount outstanding
            component.set('v.TotalCost', response.policyCostPaymentSummary.totalPolicyCost);
            component.set('v.TotalClientPaid', response.policyCostPaymentSummary.totalPaid);
            component.set('v.policy_trans.Amount__c', response.policyCostPaymentSummary.totalOutstandingAmount);
            component.set('v.enrollment.Amount_Outstanding__c', response.policyCostPaymentSummary.totalOutstandingAmount);
            
            // Save our Confirmation Number for future calls and save
            component.set('v.enrollment.Confirmation_Number__c', response.policy.confirmationNumber);
            component.set('v.enrollment.Policy_Status__c', response.policy.policyStatus);
            component.set('v.enrollment.Purchase_Date__c', self.getFormattedDate(response.policy.purchaseDate));

            console.log('enrollment post tvlxApiSave');
            console.log(JSON.parse(JSON.stringify(component.get('v.enrollment'))));
            // Update payments list (for table)
            component.set('v.PaymentsList', response.policy.payments);
			
            // Set the payment options list
            component.set('v.refund_type', response.refundPaymentList);
            
            // Put the TravelerId's on our list
            self.convertAPITravelers(component, event, response.policy.travelers);
            self.convertAPICRCDates(component, event, response.policy.rentalVehicleDates);
            
            var url = new URL(window.location.href);
            var confirmationNumber = url.searchParams.get("confirmationNumber");
            var userIntent = url.searchParams.get("action"); 
            
            if(confirmationNumber) {
                if(userIntent == 'Edit'){
                    self.cancelModalHelper(component, event);                     
                    //component.set('v.errorModalTitle', 'SAVE POLICY');                    
                    //self.errorModalToggle(component, event);
                    
                    self.runPostPaymentPostEditFlow(component, event, response);
                }
            } else {
                self.runPostPaymentFlow(component, event, response);
            }
        }).catch(function(error) {    	
            console.error('[savepolicy] Error: ', error);
            component.set('v.errorModalTitle', 'Error');
            component.set('v.errorModalMessage', error);  
            self.errorModalToggle(component, event);
        });
        
        // Any Save Policy request should clear out the payment fields
        component.find("refund_type").set("v.value", "Choose one...");
        component.find("payment_type").set("v.value", "Choose one...");
        component.find("card_holder_name").set("v.value", "");
        component.find("encrypted_card_number").set("v.value", "");
        component.find("expiration_date").set("v.value", "");
        component.find("name_on_check").set("v.value", "");
        component.find("check_number").set("v.value", "");
    },
    hideAllPaymentFlowButtons: function(component, event) {
        console.log('HIDING PAYMENT FLOW BUTTONS');
        component.set("v.PaymentModalOption", null);
        
    	// $A.util.addClass(component.find('pf_save_button'), 'slds-hide');
    	// $A.util.addClass(component.find('pf_back_button'), 'slds-hide');
    },
    runPostPaymentPostEditFlow: function(component, event, response) {
        var totalOutstandingAmount = 0;
        
        if(totalOutstandingAmount === 0) {           
			this.saveEnrollment(component, event);
            return;
        }
        if(totalOutstandingAmount < 1 ){
             
            //Route to payment tab   
            var currentTab = component.get("v.currentTab");
            var nextTab = 'payment';
            component.set("v.selTabId", 'payment');
            component.set("v.currentTab", currentTab - 1);
            this.navigationHandler(component, event, nextTab);
            
            return;
        }        
    },
    runPostPaymentFlow: function(component, event, response) {
        // Use the response to determine what flow path to go down
        if(response.policyCostPaymentSummary.totalOutstandingAmount === 0 && !response.paymentStatus.paymentFailed) {
            // The payment was a success, no amount left outstanding, set our Saving message
            component.set("v.PaymentModalTitle", "Saving Enrollment");
            if(response.policy.policyStatus === "Cancelled") {
                component.set("v.PaymentModalMessage", "Confirmation Number: " + response.policy.confirmationNumber + "\n\nThe refund was successful, policy cancelled.");
            } else {
            	component.set("v.PaymentModalMessage", "Confirmation Number: " + response.policy.confirmationNumber);
            }
            
            // Show our modal & buttons
            component.set("v.PaymentModalOption", 'save');
            component.set("v.PaymentModalShow", true);
            
            component.set("v.LastPaymentDeclined", false);
            return;
        }
        
        if(response.paymentStatus.paymentFailed) {
        	// Payment declined, show failure modal and send back to payment screen
        	component.set("v.PaymentModalTitle", "Payment Failure");
            component.set("v.PaymentModalMessage", response.paymentStatus.message);
            
            // Show our modal & buttons
            component.set("v.PaymentModalOption", 'back');
            component.set("v.PaymentModalShow", true);
            
            component.set("v.LastPaymentDeclined", true);
            return;
        }
    },
    processTravelerRateInfo: function(component, event) {
        var response = component.get("v.policyRateDetail");
        var selected_product_id = component.get('v.PurchasedProduct.productID');
        
        // Total up all CRC coverage costs
        var total_crc_cost = 0;
        for(let c of response.policyUpgradeRates) {
            if(c.code.includes('RVD')) {
                total_crc_cost += c.rate;
            }
        }
        
        // Find our Product card and pass in relevant info from response
        var product_cards = component.get('v.productComponents');
        for(let pc of product_cards) {
            // We need to find the selected product's card
            if(pc.get("v.ProductInfo.productID") === selected_product_id) {
                pc.set("v.TotalCost", response.totalPolicyCost);
                pc.set("v.CRCCost", total_crc_cost);
            }
        }
        
        component.set("v.CRCCost", total_crc_cost);
    },
	openConfirmationModal : function(component, event, helper) {
		var cmpTarget = component.find('confirm_window');
		var cmpBack = component.find('confirm_window_backdrop');
		$A.util.addClass(cmpTarget, 'slds-fade-in-open');
		$A.util.addClass(cmpBack, 'slds-backdrop--open');
	},

    convertAPITravelers: function(component, event, api_travelers) {
        
        var response = component.get("v.policy");
               
        var totalPolicyCost = null;
        if(response){
        	totalPolicyCost = response.policyCostPaymentSummary.totalPolicyCost;
        }
	        
        //console.log('travelers::: '+JSON.stringify(response));
    	var travelers = [];
        for(let at of api_travelers) {
            
            var travelerType = null, age = null,departureDate = null, returnDate = null,depositDate=null,premiumPaidDate=null, isClaimInitiated=null, totalPolicyCost=null;
            if(api_travelers.travelerGroupInfo){
                travelerType = api_travelers.travelerType;
                age = api_travelers.age;
                departureDate = api_travelers.departureDate;
                returnDate = api_travelers.returnDate;
                depositDate = api_travelers.depositDate;
                premiumPaidDate = api_travelers.premiumPaidDate;
            }
            travelers.push({
                "First_Name__c": at.firstName,
                "Last_Name__c": at.lastName,
                "Age__c" : age,
				"Trip_Cost__c": at.tripCost,                
                "Total_Plan_Cost__c" : (totalPolicyCost == '' || totalPolicyCost == null) ? 0 : totalPolicyCost ,
                "Departure_Date__c" : (departureDate == '' || departureDate == null) ? '' : this.getFormattedDate(departureDate),
                "Return_Date__c" : (returnDate == '' || returnDate == null) ? '' : this.getFormattedDate(returnDate ),
                "Deposit_Date__c" : depositDate,
                "Premium_Paid_Date__c" : premiumPaidDate,
                "Age_Category__c" : travelerType,
                //CFAR__c
                //Cancel_for_Any_Reason_Cost__c                
                "Address_1__c": at.address1,
                "Address_2__c": at.address2,
                "City__c": at.city,
				"State__c": at.stateName,   
                "Zip_Code__c": at.postalCode,                
                "Country__c": at.countryName,
                "Traveler_Email__c": at.email,                
                "Date_of_Birth__c": this.getFormattedDate(at.dateOfBirth), 
                "Phone__c": at.dayPhone,
                "Is_Primary__c": at.isPrimary,
                "Are_you_a_US_Citizen__c": at.isUSCitizen,                
                "RA_Traveler_ID__c": (at.travelerId == '' || at.travelerId == null) ? '' : at.travelerId,                             
                "Calculated_Age__c": this.calculateAge(component, at.dateOfBirth)                
            });
        }
         
        console.log("Setting internal traveler list to: ", JSON.parse(JSON.stringify(travelers)));
        component.set("v.TravelersList", travelers);
        console.log("[convertapitravelers] Refresh List: ", JSON.parse(JSON.stringify(component.get("v.TravelersList"))));
	},
    convertAPICRCDates: function(component, event, api_dates) {
    	var dates = [];
        for(let d of api_dates) {
            dates.push({
                "RA_CRC_ID__c": d.rentalVehicleId,
                "CRC_Start_Date__c": this.getFormattedDate(d.rvdDateRange.fromDate),
                "CRC_End_Date__c": this.getFormattedDate(d.rvdDateRange.toDate) 
            });            
        }
        
        component.set("v.CRCDatesList", dates);
    }
})