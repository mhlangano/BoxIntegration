//global class BatchMerge implements Database.Batchable<sObject> {
global class BatchMerge implements Database.Batchable<TISMerge__c> {    
            
	global Iterable<TISMerge__c> start(Database.batchableContext ctx){
		return new MergeContacts();
    }
    
    global void execute(Database.BatchableContext ctx, List<TISMerge__c> records) {
        List<TISMerge__c> vList = new List<TISMerge__c>();
        
        for(TISMerge__c record: records) {
            try {
                Database.merge(new Contact(Id=record.Master_Record_Contact__c), record.Merge_Record_Contact__c);       
                record.Status__c = 'Success';
            } catch(exception e) {
                //system.debug(e);
                record.Status__c = 'Failed';
            }
        }
        update records;
    }

    global void finish(Database.BatchableContext ctx) {
    }
}