global class DeleteQuotes implements Database.Batchable<sObject>{
    global final String Query;
    global DeleteQuotes(String q){
        Query=q;
    }

    global Database.QueryLocator start(Database.BatchableContext BC){
        return Database.getQueryLocator(query);
    }

    global void execute(Database.BatchableContext BC,List<Quote> scope){
        delete scope;
    }

    global void finish(Database.BatchableContext BC){}
}