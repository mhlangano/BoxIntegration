global class MergeContacts implements iterable<TISMerge__c>{
   global Iterator<TISMerge__c> Iterator(){
      return new TISIterable_Contacts();
   }
}