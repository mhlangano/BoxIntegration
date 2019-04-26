trigger TIS_FinSummary on Financial_Summary__c (after insert, after update) {

    List<ID> IDs = new List<ID>();
    
	for (Financial_Summary__c fc : Trigger.new) {
    	IDs.add(fc.Product_Commission__c);    
    }
    
    TIS_Utility.Financial_Summary_Rollup(IDs);
    
}