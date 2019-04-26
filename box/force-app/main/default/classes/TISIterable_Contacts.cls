global class TISIterable_Contacts implements Iterator<TISMerge__c>{ 

   List<TISMerge__c> merg {get; set;} 
   Integer i {get; set;} 

   public TISIterable_Contacts(){ 
       merg = 
       [SELECT Master_Record_Contact__c, 
        Merge_Record_Contact__c, Status__c 
        FROM TISMerge__c 
        WHERE Status__c = 'Ready' Limit 10]; 
       i = 0; 
   }   

   global boolean hasNext(){ 
       if(i >= merg.size()) {
           return false; 
       } else {
           return true; 
       }
   }    

   global TISMerge__c next(){ 
       // 10 is an arbitrary 
       // constant in this example
       // that represents the 
       // maximum size of the list.
       if(i == 10){return null;} 
       i++; 
       return merg[i-1]; 
   } 
}