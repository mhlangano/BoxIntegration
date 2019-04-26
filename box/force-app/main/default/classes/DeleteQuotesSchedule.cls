global class DeleteQuotesSchedule implements Schedulable{
    global void execute(SchedulableContext sc){
        String savedQuoteStatus = 'Saved Quote'; 
        String query = 'select Id From Quote Where Status = \'Saved Quote\' AND Departure_Date__c = YESTERDAY';
        System.debug('Query String: '+query);
        DeleteQuotes delBatch = new DeleteQuotes(query);
        Id BatchProcessId = Database.ExecuteBatch(delBatch);
    }
}