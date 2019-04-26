({
    init : function(component, event, helper) {
        // Populate upgrade checkboxes
        helper.populateUpgradeData(component, event);
         
        // Set the default base rate
        var product_info = JSON.parse(JSON.stringify(component.get('v.ProductInfo')));
        component.set('v.TotalCost', product_info.baseRate);
        
        // Get the various scripts for this Product from Salesforce
        var action = component.get('c.getPlanScripts');
        action.setParams({formNumber: product_info.formNumber});
        action.setCallback(this, function(response){
            if(response.getState() !== "SUCCESS") {
                console.log('[EnrollmentProduct->Controller->init] Error retrieving plan scripts.');
                return;
            }
            
            component.set('v.ProductScripts', response.getReturnValue());
        });
        $A.enqueueAction(action);
        
        // Set the default coverage options
        component.find("coverage_select").set("v.value", product_info.selectedCoverage.coverageID);
        for(let c of product_info.selectedCoverage.flightAccidentCoverages) {
            if(c.isDefault) {
                component.find("flight_coverage_select").set("v.value", c.flightAccidentCoverageId);
            }
        } 
    },
    handleUpgradeSelection  : function(component, event, helper) {
        var upgrade_map = component.get('v.UpgradeMap');
        var previous_upgrade_list = component.get('v.PreviouslySelectedUpgrades');
        var current_upgrade_list = event.getParam('value');
       
        
        var new_upgrade = current_upgrade_list.filter(upgrade_id => !previous_upgrade_list.includes(upgrade_id));
        
        if(new_upgrade.length > 0) {
            // An upgrade was just checked
            var selected_upgrade = upgrade_map[new_upgrade[0]];
            
            // Special ID's we need to act on
            var special_cases = {
                1: helper.handleCFARSelection,
                13: helper.handleCRCSelection,
            };
            
            if(selected_upgrade.upgradeID in special_cases) {
                special_cases[selected_upgrade.upgradeID](component, event);
            }
            
            // Recalculate our product total
            helper.calculateTotalCost(component, event);
            
            component.set('v.LastSelectedUpgrade', selected_upgrade);
        } else {
            // An upgrade was just unchecked, filter out which
            var removed_upgrade = previous_upgrade_list.filter(upgrade_id => !current_upgrade_list.includes(upgrade_id));
            var selected_upgrade = upgrade_map[removed_upgrade[0]];
            
            if(selected_upgrade) {
            	component.set('v.LastSelectedUpgrade', selected_upgrade);
            }
                        
            // Set the Modal options for display of upgrade confirmation
            var last_selected = component.get('v.LastSelectedUpgrade');
            component.set('v.ModalLayout', true);
            component.set('v.ModalTitle', 'Remove Upgrade Confirmation');
            component.set('v.ModalText', 'Are you sure you want to remove the ' + last_selected.shortDescription + ' upgrade?');
            component.set('v.ModalIdentifier', last_selected.upgradeID);
            component.set('v.ModalVisibilityClass', 'slds-show');
            
            // Don't act at all, let the modal response handle acting if needed
        }

        // Final step is always to record new list for later comparison
        component.set('v.PreviouslySelectedUpgrades', current_upgrade_list);
    },
    purchaseButtonHandler: function(component, event, helper) {
        if (helper.validateCRCDates(component, event)) {
            alert('Fix CRV date validation before continuing.');
            return;
        }
        var selected_product = component.get('v.ProductInfo');
        var total_cost = component.get('v.TotalCost');
        var sent_event = component.getEvent("ProductEvent");

        helper.gatherUpgrades(component, event);
        var upgrades = component.get("v.APIUpgrades");
        var crcdates = component.get("v.APICRCDates");
        
        var delivery_script = component.get('v.ProductScripts').Delivery_Script__c;
        
        sent_event.setParams({
            "ProductInfo": selected_product,
            "TotalCost": total_cost,
            "Upgrades": upgrades,
            "CRCDates": crcdates,
            "DeliveryScript": delivery_script,
            "Action": "Selected"
        });
        sent_event.fire();
        
        component.find('purchase_button').set('v.label', 'Purchased');       
    },
    travelerRateButtonHandler: function(component, event, helper) {
        if (helper.validateCRCDates(component, event)) {
            alert('Fix CRV date validation before continuing.');
            return;
        }       
        
        var selected_product = component.get('v.ProductInfo');
        
        console.log(' sel product:: '+JSON.stringify(selected_product));
        var sent_event = component.getEvent("ProductEvent");
        
        helper.gatherUpgrades(component, event);
        var upgrades = component.get("v.APIUpgrades");
        var crcdates = component.get("v.APICRCDates");        
        
        sent_event.setParams({
            "ProductInfo": selected_product,
            "Upgrades": upgrades,
            "CRCDates": crcdates,
            "Action": "RateTravelers"
        });
        sent_event.fire();
    },
    addCRCDate: function(component, event, helper) {
        var crc_dates = component.get("v.CRCDatesList");
        
        // validate all existing CRC date entries first
        for(let d of crc_dates) {
            if(!(d.CRC_End_Date__c && d.CRC_Start_Date__c)) {
                // Identify errors to report on
                if(!d.CRC_End_Date__c && !d.CRC_Start_Date__c) {
                    alert('Error: From Date and To Date required');
                } else if(!d.CRC_End_Date__c) {
                    alert('Error: To Date required');
                } else if(!d.CRC_Start_Date__c) {
                    alert('Error: From Date required');
                }
                
                // Do nothing further, existing errors
                return;
            }
        }
        
        // All records valdiated, add new empty date
        crc_dates.push({
            'sobjectType': 'Car_Rental_Collision__c',
            'Car_Rental_Collision_Cost__c': 0.00,
            'Car_Rental_Collision_Upgrade__c': false,
            'Confirmation_Number__c': '',
            'CRC_End_Date__c': '',
            'CRC_Start_Date__c': ''
        });
        
        component.set("v.CRCDatesList", crc_dates);
    },
    handleModalResponseEvent: function(component, event, helper) {
        var value = event.getParam("reply");
        var upgrade_id = event.getParam("auraId");
        
        // If user responded no, pop the upgrade back to selected and don't do anything else
        if(value == "false") {
            var last_selected_upgrade = component.get('v.LastSelectedUpgrade');
            var selected_upgrades = component.get('v.SelectedUpgrades');
            
            selected_upgrades.push(last_selected_upgrade.upgradeID.toString());
            component.set('v.SelectedUpgrades', selected_upgrades);
            
            return;
        }
        
        // If user responded yes, then handle any special cases
        var special_cases = {
            13: helper.handleCRCDeselection,  
        };
        
        if(upgrade_id in special_cases) {
            special_cases[upgrade_id](component, event);
        }
        
        // Recalculate our totals
        helper.calculateTotalCost(component, event);
    },
    handleCRCDateEvent: function(component, event, helper) {
        var crc_dates = component.get("v.CRCDatesList");
        
        var date_index = event.getParam("index");
        var instance = event.getParam("instance");
        var action = event.getParam("Action");
        
        if(action === "delete") {
            crc_dates.splice(date_index, 1);
        }
        if(action === "change") {
            crc_dates[date_index] = instance;
        }
        
        component.set("v.CRCDatesList", crc_dates);

    },
    calculateCRCCosts: function(component, event, helper) {
        // First, validate
        if (helper.validateCRCDates(component, event)) {
            //alert('Error: Rental Vehicle dates cannot overlap.');
            return;
        }
        
        var cost_per_day = component.get("v.ProductInfo.rentalVehicleCostPerDay");
        var crc_dates = component.get("v.CRCDatesList");
        var ms_per_day = 24 * 60 * 60 * 1000;
        var total_days = 0;

        // Iterate over date list, calculate # of days for each, add to total
        for(let x of crc_dates) {
            let start = new Date(x.CRC_Start_Date__c);
            let end = new Date(x.CRC_End_Date__c);
            
            // If either of these is invalid dates, skip this range entirely
            if(start == "Invalid Date" || end == "Invalid Date" ) {
                continue;
            }
            
            // Deal with dates as UTC
            start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
            end.setMinutes(end.getMinutes() - end.getTimezoneOffset());
            
            total_days += Math.ceil(((end - start) / ms_per_day) + 1);
            //console.log('Days Apart: ', ((end -start) / ms_per_day), 'Date Obj: ', JSON.parse(JSON.stringify(x)));
        }
        
		// Using total-days and cost-per-day, calculate estimated cost and display
		component.set("v.CRCCost", total_days * cost_per_day);
        component.set("v.CRCDays", total_days);
        helper.calculateTotalCost(component, event);
    },
    coverageSelectHandler: function(component, event, helper) {
        var product = component.get("v.ProductInfo");
        var coverages = component.get("v.ProductInfo.coverages");
        var selected_coverage_id = component.find("coverage_select").get("v.value");
        
        for(let c of coverages) {
            if(c.coverageID.toString() === selected_coverage_id) {
                product.selectedCoverage = c;
            }
        }
        
        // Set our product back with the new coverage and upgrade possibilities
        component.set("v.ProductInfo", product);
        helper.populateUpgradeData(component, event);
        
        // Set a new default Flight Accident Coverage if applicable
        for(let c of product.selectedCoverage.flightAccidentCoverages) {
            if(c.isDefault) {
                component.find("flight_coverage_select").set("v.value", c.flightAccidentCoverageId);
            }
        }
        
        // Recalculate costs with new base rate
        helper.calculateTotalCost(component, event);
    },
    flightCoverageSelectHandler: function(component, event, helper) {
        var product = component.get("v.ProductInfo");
        var flight_coverages = component.get("v.ProductInfo.selectedCoverage.flightAccidentCoverages");
        var selected_flight_coverage_id = component.find("flight_coverage_select").get("v.value");
        
        for(let c of flight_coverages) {
            if(c.flightAccidentCoverageId.toString() === selected_flight_coverage_id) {
                product.selectedFlightAccidentCoverage = c;
            }
        }
        
        component.set("v.ProductInfo", product);
        helper.calculateTotalCost(component, event);
    },
    checkDeselection: function(component, event, helper) {
        // Get the id of the just-purchased product from the event sent by parent wizard
        var purchased_product_id = event.getParam('arguments').ProductId;
        
        // Compare this id to our internal product, if it's different, unpurchase ourselves
        if(component.get('v.ProductInfo.productID') !== purchased_product_id) {
            component.find('purchase_button').set('v.label', 'Purchase');     
        }
    },
    scriptButtonHandler: function(component, event, helper) {
        var type = event.getSource().getLocalId();
        var scripts = component.get('v.ProductScripts');
        
        switch(type) {
            case 'product_script':
                component.set('v.ModalTitle', 'Product Script');
                component.set('v.ModalText', scripts.Product_Script__c);
                break;
            case 'restriction_script':
                component.set('v.ModalTitle', 'Restriction Script');
                component.set('v.ModalText', scripts.Restriction_Script__c);
                break;
            case 'delivery_script':
                component.set('v.ModalTitle', 'Delivery Script');
                component.set('v.ModalText', scripts.Delivery_Script__c);
                break;
        }
        
		component.set('v.ModalLayout', false);
        component.set('v.ModalIdentifier', 'script');
        component.set('v.ModalVisibilityClass', 'slds-show');
    }
})