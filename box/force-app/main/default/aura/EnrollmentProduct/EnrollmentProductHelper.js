({
    populateUpgradeData : function(component, event) {
        // When upgrades change, clear out any previously selected upgrades
        component.set("v.SelectedUpgrades", []);
        
        // Get the list of upgrades available in our currently selected coverage
        var upgrades = JSON.parse(JSON.stringify(component.get('v.ProductInfo.selectedCoverage.upgrades')));
        
        var upgrade_list = [];
        var upgrade_map = {};
        var SelectedUpgrades = [];
        
        for(let i of upgrades) {
            let select = {
                'label': i.shortDescription + ' ($' + i.rate + ')',
                'value': i.upgradeID.toString()
            }
            if(upgrades.isSelected){
                SelectedUpgrades.push(i.upgradeID.toString());
            } 
                        
            // If this is a CRC date, show base-cost-per-day instead of rate
            if(i.upgradeID === 13) {
                select.label = i.shortDescription + ' ($' + component.get('v.ProductInfo.rentalVehicleCostPerDay') + '/day)';
            }
            
            upgrade_list.push(select);
            upgrade_map[i.upgradeID.toString()] = i;
        }
		component.set("v.SelectedUpgrades",SelectedUpgrades);
        component.set('v.UpgradeList', upgrade_list);
        component.set('v.UpgradeMap', upgrade_map); 
    },
    handleCRCSelection : function(component, event) {
        console.log('A CRC Dates Product Upgrade was selected.');
        $A.util.removeClass(component.find('crc_dates_display'),  'slds-hide');
    },
    handleCRCDeselection : function(component, event) {
        console.log('A CRC Dates Product Upgrade was deselected.');
        $A.util.addClass(component.find('crc_dates_display'),  'slds-hide');
        
        component.set("v.CRCDatesList", []);
        component.set("v.EnrollmentData.haveDefaulted", false);
    },
    validateCRCDates : function(component, event) {
        var crc_dates = component.get("v.CRCDatesList");
        var dates = [];
        var error_text = "";  // Blank string clears existing errors
        
        
        // Create list of actual dates
        for(let c of crc_dates) {
            dates.push({'start': new Date(c.CRC_Start_Date__c), 'end': new Date(c.CRC_End_Date__c)});
        }
        
        if(!dates.length) {
            component.set("v.CRCErrorText", error_text);
            return false;
        }
        
        // sort them
        dates = dates.sort(function (previous, current) {
            var previous_time = previous.start.getTime();
            var current_time = current.start.getTime();
            
            if(previous_time < current_time) { return -1; }
            if(previous_time === current_time) { return 0; }
        	
            return 1;          
        });
    
        // check for overlaps
    	var oresult = dates.reduce(function (result, current, idx, arr) {
            if (idx === 0) { return result; }
            var previous = arr[idx-1];
            
            var previous_end = previous.end.getTime();
            var current_start = current.start.getTime();
            
            return (previous_end >= current_start);
        }, false); // set result to false, becomes true if there is an overlap
        
        // If there were overlaps, set that error message
        if(oresult) {
            error_text = "Rental vehicle coverage dates must not overlap each other.";
        }
        
        // check against departure/return dates
        var enroll = component.get("v.EnrollmentData");
        var depart_date = new Date(enroll.departureDate);
        var return_date = new Date(enroll.returnDate);
        
        var cresult = dates.reduce(function (result, current, idx, arr) {
            return (result || (current.start < depart_date) || (current.end > return_date));
        }, false);
        
        // If there were dates outside travel range, set error message
        if(cresult) {
            error_text = "Rental vehicle coverage dates must be within departure/return of trip."
        }
        
        // Set whatever error message has taken precedence and return
        component.set("v.CRCErrorText", error_text);
        return cresult || oresult;
    },
    handleCFARSelection: function(component, event) {
        var cfar_text = "There are purchase requirements for our Cancel for Any Reason upgrade. Eligibility for this coverage is determined at the time of claim, and in order to qualify for this benefit, you must: - Purchase the plan within 21 days of your initial trip cost payment or deposit and at the time of initial plan payment. - Insure all prepaid non-refundable trip costs subject to cancellation penalties or restrictions. - Have a maximum Trip Cost of not more than $10,000 per person. - Report your cancellation with all travel suppliers as well as our claims administrator 48 hours or more before your scheduled departure date. Provide these requirements are following, you will be reimbursed up to 75% of your trip cost (FL State residents: reimbursed up to 50% of your trip cost).";
        
        component.set('v.ModalLayout', false);
        component.set('v.ModalTitle', 'Advise Caller of the Following');
        component.set('v.ModalText', cfar_text);
        component.set('v.ModalIdentifier', 'cfar');
        component.set('v.ModalVisibilityClass', 'slds-show');
    },
    calculateTotalCost: function(component, event) {
        // Base cost of the product
        var base_rate = component.get('v.ProductInfo.selectedCoverage.baseRate');
        
        // Gather the price of selected upgrades
        var selected_upgrade_ids = component.get('v.SelectedUpgrades');
        var upgrade_map = component.get('v.UpgradeMap');
        
        var upgrades_total = selected_upgrade_ids.reduce(function(accumulator, current) {
			return accumulator + (upgrade_map[current].rate);
        }, 0.00);
        
        // Is there a Flight Accident Coverage cost
        var flight_rate = 0;
        var selected_flight_coverage = component.get('v.ProductInfo.selectedFlightAccidentCoverage');
        if(selected_flight_coverage && selected_flight_coverage.rate) {
        	flight_rate = selected_flight_coverage.rate
        }
        
        // Include CRC costs
        var crc_total = component.get("v.CRCCost")
        
        // Set the total back to attribute to display
        component.set('v.TotalCost', (base_rate + upgrades_total + flight_rate + crc_total));
    },
    gatherUpgrades: function(component, event) {
        var selected_product = component.get("v.ProductInfo");
        
        // Select the appropriate upgrades on the Product object
        var selected_upgrades = component.get('v.SelectedUpgrades');
        var upgrade_list = [];
        for(let upgrade of selected_product.selectedCoverage.upgrades) {
            if(selected_upgrades.includes(upgrade.upgradeID.toString())) {
                upgrade.isSelected = true;
                console.log('Flagging upgrade ' + upgrade.shortDescription + ' as selected.');
                upgrade_list.push(upgrade);
            } else {
                upgrade.isSelected = false;
            }
        }
        
        // Add the appropriate CRC dates to the Product object
        var crc_dates = component.get('v.CRCDatesList');
        var crc_list = [];
        var sequence = 1;
        for(let d of crc_dates) {
            crc_list.push({
                "rvdDateRange": {
                    "fromDate": d.CRC_Start_Date__c,
                    "toDate": d.CRC_End_Date__c,
                },
                "RentalVehicleSequenceNo": sequence
            });
            sequence += 1;
        }
        
        component.set("v.APIUpgrades", upgrade_list);
        component.set("v.APICRCDates", crc_list);
    }
})