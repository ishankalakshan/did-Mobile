angular.module('didApp.WeekProgressService', [])

.service('WeekProgressService', ['$http', WeekProgressService]);

function WeekProgressService($http) {
    
    var uri = 'http://localhost:52882/api/timeentries/approve'
    
    this.ApproveThisWeek = function(confirmedIds,IgnoredIds){
        var Indata = {confirmed:confirmedIds,ignored:IgnoredIds}
        return $http({
                  method  : 'POST',
                  url     : uri,
                  data    : JSON.stringify(Indata)
                 })
    } 
    
    this.addExpressImport = function(resourceId,startDate,endDate){
        var Indata = {resourceId:resourceId,startDate:startDate,endDate:endDate}
        console.log(Indata)
        /*return $http({
                  method  : 'POST',
                  url     : uri,
                  data    : JSON.stringify(Indata)
                 })*/
        
    } 
    
};