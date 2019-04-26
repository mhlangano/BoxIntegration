/* 
*Author : Mhlangano Khumalo - Canpango SA
* Description : 
* Test Class : ContractHelperTest
* Original Version Date: 11 April 2018 
* Version : 01 
*/

trigger ContractTrigger on Contract (before insert, before update) {

    if((Trigger.isUpdate && Trigger.isBefore) || (Trigger.isInsert && Trigger.isBefore)){ 
        List <Contract> RetailExhi = new List<Contract>();
        List <Contract> SRExhi = new List<Contract>();
        List <Contract> Total= new List<Contract>();
        
        RecordType contractRecordTypeId = [Select id from RecordType where sObjectType = 'Contract' and developername =: 'Current_Contract'] ;
        
        for(Contract con : Trigger.New){            
                if(con.RecordTypeId==contractRecordTypeId.id){
                    if(con.Product_Type__c == NULL){
                        con.Product_Type__c .addError('Product Type Field Required');
                    }else{ 
                        if(con.Product_Type__c.ContainsIgnoreCase('Retail') == true || con.Product_Type__c.ContainsIgnoreCase('Group')  || con.Product_Type__c.ContainsIgnoreCase('Custom Travel Secure')){
                            RetailExhi.add(con);
                        }                
                        if((con.Product_Type__c.ContainsIgnoreCase('Specialty Risk') == true || con.Product_Type__c.ContainsIgnoreCase('VO, Club, or Resort')) ){
                            SRExhi.add(con);
                        }   
                        Total.add(con);   
                    }     
                }
            
        } 
        System.debug('Size: '+RetailExhi.size()+'  RetailExhi object: '+RetailExhi);
        System.debug('Size: '+SRExhi.size() +'  SRExhi object: '+SRExhi );
        System.debug('Size: '+Total.size()+'  Total object: '+Total);
   
        ContractHelper.updateDocuSignAssetProductInfo(Total,RetailExhi, SRExhi);                    
    }         
}