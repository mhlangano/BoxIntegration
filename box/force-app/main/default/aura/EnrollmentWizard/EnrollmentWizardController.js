({
    init: function(component, event, helper) {
        helper.getPickListOptions(component, "Country__c", "v.traveler", "v.countriesOptions");
        helper.getPickListOptions(component, "State__c", "v.traveler", "v.statesOptions");
        helper.getPickListOptions(component, "Source_c__c", "v.enrollment", "v.source");
        helper.getPickListOptions(component, "Policy_Status__c", "v.enrollment", "v.policyStatus");
        helper.getPickListOptions(component, "Policy_Fulfillment__c", "v.enrollment", "v.policy_fulfillment");
        helper.getPickListOptions(component, "Authorization_Status__c", "v.policy_trans", "v.authorization_status");
        helper.getPickListOptions(component, "Inbound_Sales_Rep__c", "v.enrollment", "v.inbound_sales_rep");       
        helper.getPickListOptions(component, "Age_Category__c", "v.traveler", "v.age_category");   

        // Call the Apex Controller to return the Base URL for API from Custom Setting
        var self = helper;
        var action = component.get('c.getBaseUrl');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state !== "SUCCESS") {
                return;
            }
            
            component.set('v.BaseURL', response.getReturnValue());
                    
            var url = new URL(window.location.href);
            var confirmationNumber = url.searchParams.get("confirmationNumber"); //Edit Mode          
            var recordId = url.searchParams.get("enrollmentId");
            var userIntent = url.searchParams.get("action"); 
            var recordStatus = url.searchParams.get("status"); 
            
            if(confirmationNumber) {
                component.set("v.confirmationNumber", confirmationNumber);
                component.set("v.userIntent", userIntent);
                component.set("v.recordId", recordId);
                component.set("v.enrollment.Record_Status__c", recordStatus);
                
                // Load the various lookup data
				//self.getEnrollmentDetails(component, event);
                
                if(userIntent == 'Edit'){
                    $A.util.removeClass(component.find('transferButton'), 'slds-hide');
                    self.editEnrollmentHelper(component, event,confirmationNumber,recordId);
                }       
                if(userIntent == 'EnrollAgain'){
                    $A.util.addClass(component.find('saveButton'), 'slds-hide');
                                        
                    self.enrollAgainHelper(component, event,confirmationNumber,recordId);                
                }
                if(recordStatus == 'Saved Quote'){
                	console.log(component.get('v.enrollment.Zip_Code__c'));
                    $A.util.addClass(component.find('transferButton'), 'slds-hide');  
                    $A.util.removeClass(component.find('zip_codeDiv'), 'slds-hide'); 
                    $A.util.removeClass(component.find('enrollmentTabValidateBtn'), 'slds-hide');
                    $A.util.addClass(component.find('account_owner'), 'slds-hide'); 
                    $A.util.addClass(component.find('confirmation_number_enr'), 'slds-hide'); 
                    $A.util.addClass(component.find('inbound_sales_rep'), 'slds-hide'); 
                    $A.util.addClass(component.find('doc_link'), 'slds-hide'); 
                    component.set('v.recordStatus','Saved Quote');
                    
                    helper.getEnZip(component,url.searchParams.get("enrollmentId"));
                }
            }else{ //New Enrollments
                // Set an initial Traveler
                console.log("setting an initial traveller");
                component.set("v.TravelersList", [{'sobjectType': 'Traveler__c','Is_Primary__c': true,'Calculated_Age__c': null,'Date_of_Birth__c': null,'Trip_Cost__c': 0.00,'First_Name__c': null,'Last_Name__c': null,'Address_1__c': null,'Address_2__c': null,'Zip_Code__c': null,'Country__c': 'United States','State__c': null,'Phone__c': null,'Traveler_Email__c': null}]);
            }                        
        });        
        $A.enqueueAction(action);         
        
        component.set("v.currentTabId", "startenrollment");
        
        //Set enrollment Beneficiary Details value displayed on Primary Traveler Tab
        component.set("v.enrollment.Beneficiary_Details__c", "Policy Designated");
        
        helper.preventLeaving();         
    }, 
    afterSave: function(component, event, helper) {
        helper.allowLeaving();
    },     
    goForward: function(component, event, helper) {
        console.log('enable saved quote?');
        console.log(component.get('v.PurchaseProduct.enableSavedQuotes'));

		helper.goForwardBtnHelper(component, event);
    },
    goBackward: function(component, event, helper) {
        var theMap = component.get("v.tabMap");
        var currentTab = component.get("v.currentTab");
        var nextTab = theMap[currentTab - 1];
        component.set("v.selTabId", nextTab);
        component.set("v.currentTab", currentTab - 1);
        helper.navigationHandler(component, event, nextTab);
    },
    cloneButton: function(component, event, helper) {
        
        //Navigate to Enrollment Info Tab
        var theMap = component.get("v.tabMap");
        var currentTab = component.get("v.currentTab");
        var nextTab = 'startenrollment';
        component.set("v.selTabId", nextTab);
        component.set("v.currentTab", currentTab - 1);
        helper.navigationHandler(component, event, nextTab);

        //Clear out fields not required.
        component.set("v.enrollment.Confirmation_Number__c", null);
        component.set("v.enrollment.Id", null);
        component.set("v.enrollment.Quote_Number__c", null);  
        component.set("v.EnrollmentNotes", []); 
    },    
    validateTransferHandler: function(component, event, helper) {
    	 helper.validateTransferApiHelper(component, event);
	},
    cancelValidatePolicyTransaferHandler: function(component, event, helper) {
        helper.cancelValidatePolicyTransaferHelper(component, event);        
    }, 
    backDatePolicyTransferHandler: function(component, event, helper) {
        component.set("v.backDatedPolicy", true); 
        helper.backDatePolicyTransferHelper(component, event);         
    }, 
    backDateCancel: function(component, event, helper) {
        $A.util.removeClass(component.find('back_date_policy_window'), 'slds-fade-in-open');
        $A.util.removeClass(component.find('back_date_policy_backdrop'), 'slds-backdrop--open');    
    },
    cancelAgencyValidationHandler: function(component, event, helper) {
        $A.util.removeClass(component.find('valid_agency_window'), 'slds-fade-in-open');
        $A.util.removeClass(component.find('valid_agency_backdrop'), 'slds-backdrop--open');
        helper.cancelValidatePolicyTransaferHelper(component, event);
    },
    doNotBackDatePolicyTransferHandler: function(component, event, helper) {        
        $A.util.addClass(component.find('do_not_back_date_policy_btn'), 'slds-hide');
        $A.util.addClass(component.find('back_date_policy_btn'), 'slds-hide');        
        $A.util.removeClass(component.find('save_back_date_policy_btn'), 'slds-hide');
    },
    backDatePolicyTransferToLastMonthHandler: function(component, event, helper) {        
        $A.util.addClass(component.find('do_not_back_date_policy_btn'), 'slds-hide');
        $A.util.addClass(component.find('back_date_policy_btn'), 'slds-hide');        
        $A.util.removeClass(component.find('save_back_date_policy_btn'), 'slds-hide');        
    },
    cancelModalHandler: function(component, event, helper) {   
    	helper.cancelModalHelper(component, event);  
    },     
    modalSaveUnBackDatedPolicyBtn: function(component, event, helper) {  
    	var policyTypeToSave = component.get("v.policyTypeToSave"); 
        component.set("v.policyTypeToSave", "Not Back Dated Policy");            
        $A.enqueueAction(component.get('c.openPolicyNotesModal'));	
	},
    modalSaveBackDatedPolicyBtn: function(component, event, helper) {
    	var policyTypeToSave = component.get("v.policyTypeToSave"); 
        component.set("v.policyTypeToSave", "Back Dated Policy");            
        $A.enqueueAction(component.get('c.openPolicyNotesModal'));	
    },    
    saveButtonHandler: function(component, event, helper) {       
    	var policyTypeToSave = component.get("v.policyTypeToSave"); 
        component.set("v.policyTypeToSave", "With No Transfer"); 
        $A.enqueueAction(component.get('c.openPolicyNotesModal'));       
   	},   
    openPolicyNotesModal: function(component, event, helper) {     
        helper.cancelModalHelper(component, event);
        component.set("v.PolicyNotesModal", "");          
    },
    /*******************************************************************/
    /*****************POST EDIT SAVE POLICY API CALL********************/
    /*******************************************************************/   
    postEditSavePolicyHandler: function(component, event, helper) {
     
        var policy_notes = event.getParam("policyNote"); 		
        var product = component.get("v.PurchasedProduct");
        var agencyId = component.get("v.validateAgencyId");
        
        
        console.log('------- '+JSON.stringify(product));
        if (policy_notes) {
		    var EnrollmentNotes = component.get("v.EnrollmentNotes");
		    EnrollmentNotes.push(policy_notes);
		    component.set("v.EnrollmentNotes", EnrollmentNotes);
        }
        
        var response = component.get("v.PolicyTransferResponse");
        var policyTypeToSave = component.get("v.policyTypeToSave");
        
        //Create Object
        var pt = component.get('v.policy_trans');
        var amount = component.find('amount').getElement().value;
    
        var expiration_date = null;
        var expiration_month = null;
        var expiration_year = null;
                
        if (pt.Expiration_Date__c) {
            expiration_date = new Date(pt.Expiration_Date__c);
            expiration_month = expiration_date.getMonth() + 1;
            expiration_year = expiration_date.getFullYear();
        }
        
        var payment = {
            "paymentType": pt.Payment_Type__c,
            "maskedCardNumber": null,
            "encryptedCardNumber": pt.Encrypted_Card_Number__c,
            "cardHolderName": pt.Card_Holder_Name__c || pt.Name_on_Check__c,
            "expirationMonth": expiration_month,
            "expirationYear": expiration_year,
            "authorizationNumber": pt.Authorization_Number__c,
            "checkNumber": pt.Check_Number__c,
            "amount": amount,
            "originalTransactionId": null
        };	

        // var transfer = {"newAgencyId": agencyId, "newProductFormNumber":  product.formNumber, "mustBeBackdated": false}; 
        var transfer = null; 
        
        //If User Transfered the policy
        if(response){
            //Un Back Dated Policy
            if(policyTypeToSave == 'Not Back Dated Policy'){   		
                transfer = { "newAgencyId": response.agencyId , "newProductFormNumber": response.newProductFormNumber, "mustBeBackdated": false}; 
            }
            //Back Dated Policy
            if(policyTypeToSave == 'Back Dated Policy'){ 
                transfer = { "newAgencyId": response.agencyId , "newProductFormNumber": response.newProductFormNumber, "mustBeBackdated": true};
            }
        }
        
        var data = {
            "policy": helper.generatePolicyObject(component),
            "isPostSaleEdit": true,
            "newPolicyPayment": null,
            "proposedPolicyStatus": component.get("v.enrollment.Policy_Status__c"),
            "savePolicyNote": policy_notes,
            "policyTransferRequest": transfer
        };
        component.set('v.savePolicyPayload', data);
        component.set("v.policyTypeToSave", "");
        
        console.log('Post Edit Save Policy Request: '+JSON.stringify(data));
        
        helper.cancelModalHelper(component, event);
        
        helper.travelexAPISavePolicy(component, event);       
        return;
     },
    trackPriorTab: function(component, event, helper) {
        var currentTabId = event.getParam("value");
        var priorTabId = event.getParam("oldValue");
        
        component.set("v.currentTabId", currentTabId);
        component.set("v.priorTabId", priorTabId); 
                
        //for controlling tab visibility
        var startEnrollmentTab = component.get("v.startEnrollmentTab");
        var travelDetailsTab = component.get("v.travelDetailsTab");
        
        //Control navigation buttons visibility      
        if (currentTabId == "startenrollment") {
            component.set("v.goBackButton", true);
            if (startEnrollmentTab == true) {
                component.set("v.goFowardButton", false);
                
            }
            if (startEnrollmentTab == false) {
                component.set("v.goFowardButton", true);
            }            
        }
        
        if (currentTabId == "traveldet") {
            component.set("v.goFowardButton", true);
            component.set("v.goBackButton", false);
            if (travelDetailsTab == true) {
                component.set("v.goFowardButton", false);
            }
        }
        
        if (currentTabId == "payment") {
            component.set("v.goFowardButton", true);
        }
        if (priorTabId == "payment" && travelDetailsTab==true) {
            component.set("v.goFowardButton", false);
        }
        if (priorTabId == "startenrollment"  && travelDetailsTab==true) {
            // component.set("v.goBackButton", false);
        }        
        
    },
    paymentSelectionHandler: function(component, event, helper) {
        // Whenever we change payment type, clear all fields
        component.find("refund_type").set("v.value", "Choose one...");
        component.find("card_holder_name").set("v.value", "");
        component.find("encrypted_card_number").set("v.value", "");
        component.find("expiration_date").set("v.value", "");
        component.find("name_on_check").set("v.value", "");
        component.find("check_number").set("v.value", "");
        
        var payment_selection = component.find('Payment_RadioBtn').getElement().value;
        component.set("v.payment_refund" ,"Payment");
        
        var payment_type = component.get("v.policy_trans.Payment_Type__c");
        
        var payment_type_id = component.find("payment_type"); 
        $A.util.removeClass(payment_type_id, 'slds-hide');  	
        
        var refund_to_id = component.find('refund_to');
        $A.util.addClass(refund_to_id, 'slds-hide');  
        
        var card_holder_name = component.find('card_holder_name');
        var encrypted_card_number = component.find('encrypted_card_number');
        var expiration_date_Div = component.find('expiration_date_Div');
        
        var name_on_check = component.find('name_on_check');
        var check_number = component.find('check_number');
        
        var take_net_payment_only = component.find('take_net_payment_only');
        
        // Is this a Credit Card type?
        var payment_types = component.get('v.payment_type');
        for(var pt of payment_types) {
            if(payment_type === pt.description) {
                // We found our PaymentType object, deal with it
                if(pt.isCreditCard) {
                    $A.util.removeClass(card_holder_name, 'slds-hide');                              
                    $A.util.removeClass(encrypted_card_number, 'slds-hide');                                            
                    $A.util.removeClass(expiration_date_Div, 'slds-hide');  	
                    
                    $A.util.addClass(name_on_check, 'slds-hide');                                            
                    $A.util.addClass(check_number, 'slds-hide');
                    
                    //alert(pt.isCreditCard+' --pt.isCreditCard --Init -- pt.paymentTypeId: '+pt.paymentTypeId);
                    
                    // Payment happening with credit card, stop the phone recording
                    helper.travelexAPISendVirtualObserverCommand(component, event);
                } else if(pt.isCreditCard == false && pt.paymentTypeId !== 5) {
                     //alert(pt.isCreditCard+' --pt.isCreditCard --REmove -- pt.paymentTypeId: '+pt.paymentTypeId);
                    $A.util.addClass(card_holder_name, 'slds-hide');  
                    $A.util.addClass(encrypted_card_number, 'slds-hide'); 
                    $A.util.addClass(expiration_date_Div, 'slds-hide'); 
                	
                    $A.util.addClass(name_on_check, 'slds-hide');                                            
                    $A.util.addClass(check_number, 'slds-hide');
                    
                } else if (pt.paymentTypeId === 5) {
                    //alert(pt.isCreditCard+' --pt.isCreditCard --require name -- pt.paymentTypeId: '+pt.paymentTypeId);
                    // Check payment selected
                    $A.util.removeClass(name_on_check, 'slds-hide');                                            
                    $A.util.removeClass(check_number, 'slds-hide');
                    
                    $A.util.addClass(card_holder_name, 'slds-hide');                              
                    $A.util.addClass(encrypted_card_number, 'slds-hide');
                    $A.util.addClass(expiration_date_Div, 'slds-hide');
                }
            }
        }

        $A.util.addClass(take_net_payment_only, 'slds-hide');
        
        //validate
        helper.validatePaymentTab(component, event);
    },
    refundSelectionHandler: function(component, event, helper) {
        // Whenever we change payment type, clear all fields
        component.find("payment_type").set("v.value", "Choose one...");
        component.find("card_holder_name").set("v.value", "");
        component.find("encrypted_card_number").set("v.value", "");
        component.find("expiration_date").set("v.value", "");
        component.find("name_on_check").set("v.value", "");
        component.find("check_number").set("v.value", ""); 
        
        var refund_selection = component.find('Refund_RadioBtn').getElement().value;
        component.set("v.payment_refund" ,"Refund");
        
        var refund_to = component.get("v.policy_trans.Refund_To__c");   
        
        var payment_type_id = component.find('payment_type'); 
        $A.util.addClass(payment_type_id, 'slds-hide');  	
        
        var refund_to_id = component.find('refund_to'); 
        $A.util.removeClass(refund_to_id, 'slds-hide');   
        
        var expiration_date_Div = component.find('expiration_date_Div');
        var name_on_check = component.find('name_on_check');
        var check_number_Div = component.find('check_number_Div');
        var take_net_payment_only = component.find('take_net_payment_only');
        
        var card_holder_name = component.find('card_holder_name');
        var encrypted_card_number = component.find('encrypted_card_number');
                
        var refund_type = component.get("v.policy_trans.Refund_To__c");
        var refund_types = component.get('v.refund_type');
            
        for(var rt of refund_types) {            
           
            if(refund_type == rt.description){ //Cut Check
                $A.util.addClass(card_holder_name, 'slds-hide');
                $A.util.addClass(encrypted_card_number, 'slds-hide');                 
            }else{
                if(refund_type.includes("Visa")){ //VISA 
                    $A.util.removeClass(card_holder_name, 'slds-hide');
                    $A.util.removeClass(encrypted_card_number, 'slds-hide');	
                }else{ //if blank remove
                    $A.util.addClass(card_holder_name, 'slds-hide');
                    $A.util.addClass(encrypted_card_number, 'slds-hide');                      
                }
            }                       
        }        
        
        
        $A.util.addClass(expiration_date_Div, 'slds-hide'); 
        $A.util.addClass(name_on_check, 'slds-hide');
        $A.util.addClass(check_number_Div, 'slds-hide');
        $A.util.addClass(take_net_payment_only, 'slds-hide');  
        
        helper.validatePaymentTab(component, event);
    },
    launchNewEnrollmentHandler : function(component, event, helper) {
         
         var cmpTarget = component.find('new_enrollment_window');
         var cmpBack = component.find('new_enrollment_window_backdrop');
         $A.util.removeClass(cmpBack,'slds-backdrop--open');
         $A.util.removeClass(cmpTarget, 'slds-fade-in-open');  
        
         helper.showProcessingSpinner(component, event);        
		 helper.allowLeaving();
         location.reload();                      
	},
    openNewEnrollmentModal : function(component, event, helper) {
        var cmpTarget = component.find('new_enrollment_window');
        var cmpBack = component.find('new_enrollment_window_backdrop');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open'); 
    },    
    openConfirmationModal : function(component, event, helper) {
        var cmpTarget = component.find('confirm_window');
        var cmpBack = component.find('confirm_window_backdrop');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open'); 
    },
    closeTravelerRatesModal: function(component, event, helper) {
        console.log('Hiding traveler rates modal');
        $A.util.addClass(component.find('traveler_rates_modal'), 'slds-hide');
    },
    exitWizard:function(component,event,helper){            
        var recordId =  component.get("v.recordId");                                              
        if(recordId==null || recordId==undefined || recordId==""){
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": "/lightning/o/Enrollments__c/list?filterName=Recent"
            });
            urlEvent.fire();            
        }else{ 
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": recordId,
                "slideDevName": "related"
            });
            navEvt.fire();            
        }                                                                    
    },  
    stayOnWizard: function(component,event,helper){    
        var cmpTarget = component.find('confirm_window');
        var cmpBack = component.find('confirm_window_backdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
        
        var cmpTarget1 = component.find('new_enrollment_window');
        var cmpBack1 = component.find('new_enrollment_window_backdrop');
        $A.util.removeClass(cmpBack1,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget1, 'slds-fade-in-open');        
    },           
    startenrollmentTab: function(component, event, helper) {
        helper.navigationHandler(component, event, "startenrollment");
    },
    traveldetTab: function(component, event, helper) {
        helper.navigationHandler(component, event, "traveldet");
    },
    productselTab: function(component, event, helper) {
        helper.navigationHandler(component, event, "productsel");
    },
    agenttripTab: function(component, event, helper) {
        helper.navigationHandler(component, event, "agenttrip");
    },
    travelerTab: function(component, event, helper) {
        helper.navigationHandler(component, event, "traveler");
    },
    policydocTab: function(component, event, helper) {
        helper.navigationHandler(component, event, "policydoc");
    },
    summaryTab: function(component, event, helper) {
        helper.navigationHandler(component, event, "summary");
    },
    savequoteTab: function(component, event, helper) {
        helper.navigationHandler(component, event, "savequote");
    },
    paymentTab: function(component, event, helper) {
        helper.navigationHandler(component, event, "payment");
    },
    validateTravelDetailsTab: function(component, event, helper) {
        //Moved this logic to the helper for reuse when validating tabs-MK
		 helper.validateTravelDetailsTabHelper(component, event);          
    },
    enrollmentInfoTabHandler: function(component, event, helper) { 
                    
        var source = component.get("v.enrollment.Source_c__c");
        var pdate = component.find('postmarked_dateDiv');
        if(source =="Mail" || source =="Fax" || source == "Roster" ){                
            $A.util.removeClass(pdate, 'slds-hide');                
        }else{
            $A.util.addClass(pdate, 'slds-hide');         
        } 

        var url = new URL(window.location.href);
        var recordId = url.searchParams.get("recordId");            
        var appendedUrl = url.search;
        if(appendedUrl =='' || appendedUrl == undefined || appendedUrl == null){    
            //Require Validation
            if(component.get("v.startEnrollmentTab")){
                component.set("v.startEnrollmentTab", false);
                component.set("v.travelDetailsTab", false);
                component.set("v.productSelectionTab", false);
                component.set("v.goFowardButton" , true);                                    
            }
        }
    },
    renderPaymentFields: function(component, event, helper) {
        var auth_status = component.get("v.policy_trans.Authorization_Status__c");
        if(auth_status=="Manual"){
			$A.util.removeClass(component.find('expiration_date_Div'), 'slds-hide');            
            $A.util.removeClass(component.find('auth_numberDiv'), 'slds-hide');
        }
        if(auth_status=="Online" || auth_status==""){
			$A.util.addClass(component.find('expiration_date_Div'), 'slds-hide');          
            $A.util.addClass(component.find('auth_numberDiv'), 'slds-hide');
        }                        
	},
    changeStates: function(component, event, helper) {
        var country = component.get("v.enrollment.Country_of_residency__c");
        var inputField = component.find('state_of_residency');
        var stateRequiredLabel = component.find('state_required_label');
        
        if (country == "Canada") {
            helper.getPickListOptions(component, "Canada_States__c", "v.traveler", "v.statesOptions");
        } else {
            helper.getPickListOptions(component, "State__c", "v.traveler", "v.statesOptions");
        }
        
        $A.enqueueAction(component.get('c.validateTravelDetailsTab'));
    },
    purchaseButtonHandler: function(component, event, helper) {
        var theMap = component.get("v.tabMap");
        var currentTab = component.get("v.currentTab");
        var nextTab = theMap[currentTab + 2];
        component.set("v.selTabId", nextTab);
        component.set("v.currentTab", currentTab + 2);
        helper.navigationHandler(component, event, nextTab);      
    },
    clearPaymentData: function(component, event, helper) {                         
        component.set("v.policy_trans.Amount__c","");  
        component.set("v.policy_trans.Auth_Number__c","");  
        component.set("v.policy_trans.Card_Holder_Name__c",""); 
        component.set("v.policy_trans.Encrypted_Card_Number__c","");         
        component.set("v.policy_trans.Expiration_Date__c","");  
        component.set("v.policy_trans.Check_Number__c","");  
        component.set("v.policy_trans.Take_Net_Payment_Only__c","");  
        component.set("v.policy_trans.Refund_Type__c","");  

        helper.getPickListOptions(component, "Authorization_Status__c", "v.policy_trans", "v.authorization_status");
    }, 
    handleCustomLookupEvent: function(component, event, helper) {
        var action = event.getParam("Action");
        
        if(action === "clear") {
            var object_type = event.getParam("ObjectType");
            
            // Clear fields based on ObjectType of event
            switch(object_type) {
                case 'account':
                    component.set("v.account", {
                        'sobjectType': 'Account',
                        'Location_Number__c': ''
                    });
                    break;
                case 'Enrollments__c':
                    var field_name = event.getParam("FieldName");
                    
                    switch(field_name) {
                        case 'Destination__c': 
                            component.set("v.selectedLookUpRecordDestination", {});
                            break;
                        case 'Airline__c':
                            component.set("v.selectedLookUpRecordAirline", {});
                            break;
                        case 'Cruise_Line__c':
                            component.set("v.selectedLookUpRecordCruiseLine", {});
                            break;
                        case 'Tour_Operator__c':
                            console.log('**************** TOUR OPERATOR CLEARED **********************');
                            component.set("v.selectedLookUpRecordTourOperator", {});
                            break;
                        case 'Departing_Airport__c':
                            component.set("v.selectedLookUpRecordDepartingAirport", {});
                            break;
                    }
                    break;
                default:
                    console.log('[DEBUG] CustomLookupEvent "clear" action with no associated object type');
            }
        }
        
        if(action === "select") {
            var selected_record = event.getParam("SelectedRecord");
            
            if(selected_record.recordId.startsWith('001')) {
                // If it's an account record, set our account and move on
                component.set("v.account", {
                    'sobjectType': 'Account',
                    'Location_Number__c': selected_record.code,
                    'Name': selected_record.name,
                    'Id': selected_record.recordId
                });
            } else {
                // If not an account, it's one of Destination, Airline, Cruiseline, Tour Operator, so check for alerts
                if(selected_record.alert) {
                    component.set("v.errorModalTitle", "Alerts");
                    component.set("v.errorModalMessage", [{"errorMessages": [selected_record.alert]}]);
                    helper.errorModalToggle(component, event);
                }
            }
        }
        
        // Determine if we need to (re)validate a tab
        if(component.get("v.currentTab") === 2) {
            console.log('Queueing ValidateTravelDetailsTab');
            $A.enqueueAction(component.get('c.validateTravelDetailsTab'));
        }        
    },
    openEnrollmentModal: function(component, event, helper) {
        component.set("v.showHideModal_enrollmentModal", 'slds-show');
    },
    openAdviceCallerModal: function(component, event, helper) {
        component.set("v.showHideModal_adviceCallerModal", 'slds-show');
    },
    tabSelected: function(component, event, helper) {
        var selTab = component.get("v.selTabId");
        
        if (selTab === 'productsel') {
            helper.getPickListOptions(component, 'Coverage_Type__c', 'v.enrollment', 'coverage_type');
        }
    },

    // ** Traveler Component Methods ** //
    processTravelerEvent: function(component, event, helper) {
        var action = event.getParam('Action');
        var traveler = event.getParam('Traveler');
        var index = event.getParam('RowIndex');
        
        var travelers = component.get("v.TravelersList");
        // Process a Traveler delete event
        if(action == "delete") {
            var deleted_last = false;
            travelers.splice(index, 1);
            
            // Was this the last traveler? Then add a blank primary
            if(!travelers.length) {
                travelers.push({
                    'sobjectType': 'Traveler__c',
                    'Is_Primary__c': true,
                    'Calculated_Age__c': null,
                    'Date_of_Birth__c': null,
                    'Trip_Cost__c': 0.00,
                    'First_Name__c': null,
                    'Last_Name__c': null,
                    'Address_1__c': null,
                    'Address_2__c': null,
                    'Zip_Code__c': null,
                    'Country__c': 'United States',
                    'State__c': null,
                    'Traveler_Email__c': null,
                    'Phone__c': null
                });
                
                // If we're deleting the last traveler, mark to re-run validation
                deleted_last = true;
            }
            
            console.log("traveler deleted event set travelers");
            component.set("v.TravelersList", travelers);
            
            // If we deleted the last traveler, we need to revalidate TravelDetails (disable Get Quote button)
            if(deleted_last) { helper.validateTravelDetailsTabHelper(component, event); }
            
            return;
        }
        
        // Process a Traveler change event
        if(action == "change") {
            // Reset the overall traveler list to force updates
            console.log("change event set travelers list");
            component.set("v.TravelersList", travelers);
            
            // Find the Primary traveler and save it out for easy reference
            for(let t in travelers) {
                if(travelers[t].Is_Primary__c) {
                    //Set Zip Code
                    component.set("v.traveler", travelers[t]);
                    
                    //Card Holder Name should must be prepopulated with Primary Traveler Name
                    component.set("v.policy_trans.Card_Holder_Name__c", travelers[t].First_Name__c +" "+travelers[t].Last_Name__c);
                    
                    //Email from the primary traveler should map to Email 1 on the Policy Document Delivery tab
                    component.set("v.enrollment.Email1__c", travelers[t].Traveler_Email__c);
                    
                }
            }
            
            // Revalidate the Travel Details tab (should we check if past?)
            //$A.enqueueAction(component.get('c.validateTravelDetailsTab'));
            helper.validateTravelDetailsTabHelper(component, event);
        }
        
        // Process a Traveler promoted to primary
        if(action == "promoted") {
            // Set all to non-primary
            for(let t of travelers) {
                t.Is_Primary__c = false;
                console.log("[promoted event] "  + t.State__c);
            }
            
            // Reset current (new) primary
            traveler.Is_Primary__c = true;
            travelers[index] = traveler;
            
            // Set overall list to force component updates
            console.log("promoted action setting travelers list");
            component.set("v.TravelersList", travelers);
        }
    },
    addTraveler: function(component, event, helper) {
        var travelers = component.get("v.TravelersList");
        
        // Are there any current travelers?
        if(travelers.length) {
            for(let index in travelers) {
                let traveler = travelers[index];
                
                // Validate that existing travelers are complete
                if(!traveler.Date_of_Birth__c && (!traveler.Trip_Cost__c && traveler.Trip_Cost__c !== 0.00)) {
                    alert('Error: Existing travelers require a Date of Birth and a Trip Cost');
                    return;
                } else if (!traveler.Date_of_Birth__c) {
                    alert('Error: Existing travelers require a Date of Birth');
                    return;
                } else if (!traveler.Trip_Cost__c && traveler.Trip_Cost__c !== 0.00) {
                    alert('Error: Existing travelers require a Trip Cost');
                    return;
                }
            }
        }
        
        // Validation passed, add a new empty Traveler to the list
        travelers.push({
            'sobjectType': 'Traveler__c',
            'Is_Primary__c': false,
            'Calculated_Age__c': null,
            'Date_of_Birth__c': null,
            'Trip_Cost__c': 0.00,
            'First_Name__c': null,
            'Last_Name__c': null,
            'Address_1__c': null,
            'Address_2__c': null,
            'Zip_Code__c': null,
            'Country__c': 'United States',
            'State__c': null,
            'Traveler_Email__c': null,
            'Phone__c': null            
        });
        
        // Write the list of travelers back to the component
        console.log("add traveler button setting travelerlist");
        component.set("v.TravelersList", travelers);
    },
    toggleErrorModal: function(component, event, helper) {
        helper.errorModalToggle(component, event);
    },
    summaryCommentButtonHandler: function(component, event, helper) {
        var comment_box = component.find('comments_sum');
        var comments = comment_box.get('v.value');
        var button_id = event.getSource().getLocalId();
        
        var new_text = ''; // [' + new Date().toLocaleString() + '] ';
        
        switch(button_id) {
            case 'swagentBtn':
                new_text += 'Spoke with Agent.';
                break;
            case 'swapxBtn':
                new_text += 'Spoke with Passenger.';
                break;
            case 'prewaiveBtn':
                new_text += 'Advised pre-ex limitation waiver.';
                break;
            case 'findefBtn':
                new_text += 'Advised of financial default purchase requirement.';
                break;
            case 'upgradedecBtn':
                new_text += 'Offered upgrades; Caller declined.';
                break;
            case 'visaBtn':
                new_text += 'Pax purchasing for VISA purposes.';
                break;
            case 'cfbrBtn':
                new_text += 'Advised of CFBR purchase requirement.';
                break;
            case 'effdtBtn':
                new_text += 'Advised pax of the effective date.';
                break;
            case 'upgrdaccBtn':
                new_text += 'Offered Upgrades; Caller accepted.';
                break;
            case 'kipBtn':
                new_text += 'Advised of KIP';
                break;
            case 'docsBtn':
                new_text += 'Advised to review documents in entirety and approximate delivery time.';
                break;
            case 'cfarBtn':
                new_text += 'Advised of all CFAR requirements.';
                break;
            case 'cubaBtn':
                new_text += 'Travel to Cuba.';
                break;
            default:
                return;
        }
        
        if(comments === undefined) {
            console.log('Fresh write to comment box.');
            comment_box.set('v.value', new_text);
        } else {
            console.log('Appended write to comment box.');
            //comment_box.set('v.value', comments + '\n' + new_text);
            comment_box.set('v.value', comments + '; ' + new_text);
        }
    },
    /*** Data setters for static displays ***/
    setDestinationName: function(component, event, helper) {
        var destination = component.get('v.selectedLookUpRecordDestination');
        if(destination) {
            component.set("v.destinationName", destination.name);
        }
    },
    /*** Catch event from the Product component ***/
    handleProductEvent: function(component, event, helper) {
        var action = event.getParam("Action");
        var product = event.getParam("ProductInfo");

        // Set the event product as PurchasedProduct in the wizard
        component.set("v.PurchasedProduct", product);

        if(action === "Selected") {
            component.set("v.TotalCost", event.getParam("TotalCost"));
            component.set("v.ProductUpgrades", event.getParam("Upgrades"));
            component.set("v.ProductCRCDates", event.getParam("CRCDates"));
            component.set("v.ProductDeliveryScript", event.getParam("DeliveryScript"));
            
            // List of all our product cards
            var product_cards = component.get('v.productComponents');
            
            // Un-purchase any other products
            for(let pc of product_cards) {
                pc.deselectCheck(product.productID);
            } 
            
            // Move the Effective Date up to the Enrollment
            component.set('v.enrollment.Effective_Date__c',  helper.getFormattedDate(product.selectedCoverage.effectiveDate)); 
            
            helper.setProductFieldVisibility(component, event);
            
            //Activate rest of the tabs and advance forward
            component.set("v.productSelectionTab", true);
            $A.enqueueAction(component.get('c.goForward'));
        }
        
        if(action === "RateTravelers") {
            component.set("v.ProductUpgrades", event.getParam("Upgrades"));
            component.set("v.ProductCRCDates", event.getParam("CRCDates"));
            
            // Craft a payload for ValidateTravelerRates
            var data = {
                "policy": helper.generatePolicyObject(component)
            };
            
            // Save the payload out
            component.set('v.validateTravelerRatesPayload', data);
            
            // Execute the HTTP callout
            helper.travelexAPIValidateTravelerRates(component, event);
        }
    },
    /***  Travelex API | Tab Button Callout Handlers  ***/
    enrollmentTabValidateButtonHandler: function(component, event, helper) {
        console.log('enrollmentTabValidateButtonHandler');
        
        // Gather data points from the fields on the tab
        var zip_code = component.get("v.enrollment.Zip_Code__c");
        var location_number = component.get("v.account.Location_Number__c");
        var source = component.get("v.enrollment.Source_c__c");
        var company_dba = component.get('v.selectedLookUpRecordName');
        
        if (zip_code === undefined || source === undefined) {
            console.log('zip or source undefined?');
            component.find('zip_code').showHelpMessageIfInvalid();
            component.find('source').showHelpMessageIfInvalid();
            return;
        }
        
       //set Zip on Primary Traveler Traveler
        var travelers = component.get('v.TravelersList');
        for(let i in travelers) {
            if(travelers[i].Is_Primary__c) {
                travelers[i].Zip_Code__c = zip_code;
            }
        }
        console.log("enrollmenttabvalidatebuttonhandler setting travelers list");
        component.set('v.TravelersList',travelers);        
        
        // Craft our payload and save it
        var data = {
            "locationNumber": location_number,
            "enrollmentSource": source,
            "primaryTravelerResidency": {
                "zipCode": zip_code,
            }
        };
        component.set('v.validatePayload', data);
        
        // Execute the HTTP callout
        helper.travelexAPIValidateLocationNumber(component, event);
        helper.populateStateOfResidency(component, event);
    },
    getQuoteButtonHandler: function(component, event, helper) {
        // Gather data points from the fields we need
        var location_number = component.get("v.account.Location_Number__c");
        var source_id = component.get("v.enrollment.Source_c__c");
        
        // trip info
        var departure_date = component.find('departure_date_tra').get('v.value');
        var return_date = component.find('return_date_tra').get('v.value');
        var destination = parseInt(component.get('v.selectedLookUpRecordDestination').identifier);
        
        // primary traveler residency
        var zip_code = component.get("v.enrollment.Zip_Code__c");
        var country = component.get("v.enrollment.Country_of_residency__c");
        var state = component.get("v.enrollment.State_of_Residency__c");
        
        // TravelDetailsTab valid, therefore Show rest of the tabs in Wizard.                
        component.set('v.travelDetailsTab', true);
        var travelers = component.get('v.TravelersList');
        
        // Enable next button
        component.set("v.goFowardButton", false);
        
        // Craft our payload and save it (new)
        var data = {
            "selectedFormNumber": null,
            "tripInfo": {
                "departureDate": departure_date,
                "returnDate": return_date,
                "destinationId": destination
            },
            "travelers": [],
            "locationNumber": location_number,
            "primaryTravelerResidency": {
                "zipCode": zip_code,
                "countryName": country,
                "stateName": state
            },
            "enrollmentSource": source_id,
            "postMarkedDate": null
        };
        
        for (var traveler of travelers) {
            var traveler_data = {
                "dateOfBirth": traveler.Date_of_Birth__c,
                "tripCost": traveler.Trip_Cost__c                
            };
            data.travelers.push(traveler_data);
        }
        
        // HACK: Set first traveler as Primary
        // data.travelers[0].isPrimary = true;
        
        component.set('v.planSelectionPayload', data);
        
        // Execute the HTTP callout
        helper.travelexAPIGetPlanSelection(component, event);
    },
    continueButtonHandler: function (component, event, helper) {
        var working_payload = {"policy":{"productId":10035,"agencyId":166827,"enrollmentSource":"Phone","timeStamp":"2019-02-12T22:42:31.380Z","locationNumber":"05-1283","departureDate":"2019-02-17","returnDate":"2019-02-23","destinationId":1602,"coverageId":1,"flightAccidentCoverageId":null,"travelers":[{"lastName":"McTesterson","firstName":"Testy","countryName":"United States","stateName":"Wisconsin","dateOfBirth":"1991-02-05","tripCost":"423","isPrimary":true,"travelerSequenceNumber":1}],"upgrades":[],"rentalVehicleDates":[],"groupInfo":null,"payments":[],"policyRateDetails":null,"policyEmails":[],"flightNumber":null,"printInNextBatch":false},"isPostSaleEdit":false,"proposedPolicyStatus":"Active"};        
        // Craft our payload and save it

        var data = {
            "policy": helper.generatePolicyObject(component),
            "isPostSaleEdit": false,
            "proposedPolicyStatus": "Active"
        }; 
        
        component.set('v.validateAndRatePolicyPayload', data);
        
        // Execute the HTTP callout
        helper.travelexAPIValidateAndRatePolicy(component, event);
    },
    calculateRateHandler: function (component, event, helper) {
		
        component.set("v.calculateRate", true);
        
        var isPostSaleEdit = false;
        
        var url = new URL(window.location.href);
        var confirmationNumber = url.searchParams.get("confirmationNumber");    
        if(confirmationNumber){
            isPostSaleEdit = true;
        }
        
		var policy_status = 'Active'
        if(!policy_status){
       	 	policy_status = component.get("v.enrollment.Policy_Status__c");
        }
        
        var data = {
            "policy": helper.generatePolicyObject(component),
            "isPostSaleEdit": isPostSaleEdit,
            "proposedPolicyStatus": policy_status
        }; 

        console.log('[validateAndRatePolicyPayload] request: '+JSON.stringify(data));
        
        component.set('v.validateAndRatePolicyPayload', data);
          
        // Execute the HTTP callout
        helper.travelexAPIValidateAndRatePolicy(component, event);        
    },
    addPaymentButtonHandler: function(component, event, helper) {
        // Grab the current Policy Transaction object
        var pt = component.get('v.policy_trans');
        
        // Always grab latest entered amount instead of relying on Policy Transaction obj
        var amount = component.find('amount').getElement().value;
        
        // Is this a payment or a refund
        var transaction_type = component.get("v.payment_refund");
        var payment = null;
        
		// Craft our payload
        var data = {
            "policy": helper.generatePolicyObject(component),
            "isPostSaleEdit": false,
            "newPolicyPayment": null,
            "proposedPolicyStatus": "Active",
            "savePolicyNote": "",
            "policyTransferRequest": null
        };

        if(transaction_type === "Payment") {
            var expiration_date = null;
            var expiration_month = null;
            var expiration_year = null;
                    
            if (pt.Expiration_Date__c) {
                expiration_date = new Date(pt.Expiration_Date__c);
                expiration_month = expiration_date.getMonth() + 1;
                expiration_year = expiration_date.getFullYear();
            }
            
            // Create the payment object
            data.newPolicyPayment = {
                "paymentType": pt.Payment_Type__c,
                "maskedCardNumber": null,
                "encryptedCardNumber": pt.Encrypted_Card_Number__c,
                "cardHolderName": pt.Card_Holder_Name__c || pt.Name_on_Check__c,
                "expirationMonth": expiration_month,
                "expirationYear": expiration_year,
                "authorizationNumber": pt.Authorization_Number__c,
                "checkNumber": pt.Check_Number__c,
                "amount": amount,
                "originalTransactionId": null
            };
            data.savePolicyNote = "payment";
        } else if(transaction_type === "Refund") {
            var refund_type = component.get("v.policy_trans.Refund_To__c");
            var refund_types = component.get("v.refund_type");
            
            // Find the appropriate refund_type
            for(let rt of refund_types) {
                if(rt.description === refund_type) {
                    refund_type = rt;
                }
            }
            
            data.newPolicyPayment = {
                "paymentType": refund_type.paymentType,
                "maskedCardNumber": refund_type.cardNumberMasked,
                "encryptedCardNumber": null,
                "cardHolderName": null,
                "expirationMonth": null,
                "expirationYear": null,
                "authorizationNumber": null,
                "checkNumber": null,
                "amount": amount > 0 ? -amount : amount,
                "originalTransactionId": refund_type.originalTransactionId
            };
            
            data.proposedPolicyStatus = "Cancelled";
            data.savePolicyNote = "Cancel enrollment";
            
            if(refund_type.description === "Cut Check") {
                data.newPolicyPayment.paymentType = "Check";
            }
        }
        
        component.set('v.savePolicyPayload', data);
        
        // Execute the HTTP callout
        helper.travelexAPISavePolicy(component, event);
    },
    saveQuoteRecordHandler: function(component, event, helper) {
        helper.showProcessingSpinner(component, event);
        helper.saveEnrollment(component, event);
    },
    saveQuoteButtonHandler: function(component, event, helper) {
        console.log("in savequotebuttonhandler");
        var save_quote_emails = component.find("saveQuoteEmail").get("v.value");
		var quote_number = component.get('v.enrollment.Quote_Number__c');

        if (save_quote_emails) {
			var data = {
            "savedQuote": {
                "policy": helper.generatePolicyObject(component),
                "emails" : save_quote_emails.split(';'),
                "userId" : "0"
            },
            "sendQuoteEmails": true
        	};

        } else {
            var data = {
				"savedQuote": {
					"policy": helper.generatePolicyObject(component),
					"emails" : [],
					"userId" : "0"
				},
				"sendQuoteEmails": false
				};
        }


        
        if (quote_number) {
            data.policyQuoteNo = quote_number;
        }

        component.set("v.savePolicyQuotePayload", data);
        helper.travelexAPISavePolicyQuote(component, event);
		helper.navigationHandler(component, event, "savequote");
		component.find("saveQuoteEmail").set("v.value", "");


    },
    handlePaymentModalBack: function(component, event, helper) {
        // hide the payment flow modal
        helper.hideAllPaymentFlowButtons(component, event);             
        component.set("v.PaymentModalShow", false);
    },
    handlePaymentModalSave: function(component, event, helper) {
        // hide the payment flow modal
        helper.hideAllPaymentFlowButtons(component, event);             
        component.set("v.PaymentModalShow", false);
        
        // save the enrollment
        helper.showProcessingSpinner(component, event);
        helper.saveEnrollment(component, event);
    },
    handlePaymentModalSaveUnpaid: function(component, event, helper) {
        // hide the payment flow modal
        helper.hideAllPaymentFlowButtons(component, event);
        component.set("v.PaymentModalShow", false);
        
        // set the enrollment status to Declined
        // component.set("v.enrollment.Policy_Status__c", "Declined");
        component.set("v.enrollment.Policy_Status__c", "Cancelled");
        
        // save the enrollment
        helper.showProcessingSpinner(component, event);
        helper.saveEnrollment(component, event);
    },
    donePayingHandler: function(component, event, helper) {
        var amount_outstanding = component.get("v.enrollment.Amount_Outstanding__c");
        if(amount_outstanding === 0) {
            // No outsanding amount, we can save the record
            helper.saveEnrollment(component, event);
            return;
        }
         
        // There is some amount outstanding, has there been anything paid against this policy?
        var total_paid = component.get("v.TotalClientPaid");
        if(total_paid > 0) {
            // If there was anything paid already, user needs to refund before saving
            component.set("v.PaymentModalTitle", "Partial Payment");
            component.set("v.PaymentModalMessage", "Policy is partially paid. Collect full payment or refund existing payments if possible. Done anyway?");
            
            // Show our modal & buttons
            component.set("v.PaymentModalOption", 'save-unpaid');  // 'back');
            component.set("v.PaymentModalShow", true);
        } else {
            // Nothing was paid yet, can be done anyway if or pay
            component.set("v.PaymentModalTitle", "Unpaid Policy");
            component.set("v.PaymentModalMessage", "Policy is not paid. Done anyway?");
            
            // Show our modal & buttons
            component.set("v.PaymentModalOption", 'save-unpaid');
            component.set("v.PaymentModalShow", true);
        }
    },
    debugPrintout: function(component, event, helper) {
        function desafe(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
        console.log(desafe(component.get('v.enrollment')));
    }
})