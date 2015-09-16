angular.module('didApp.service', [])

.service('didAppDataService',['$http','$rootScope',didAppDataService]);

function didAppDataService($http,$rootScopescope){
  this.loadData = function($scope){
    return $http.get('http://localhost/didmobiledata/sp_Timeentries.json?callback=JSON_CALLBACK')
      .success(function(result){
        result.feed.entry.forEach(function(b){
          $scope.timesheet.push({
              id:b.content.properties.Id.__text,
              title:b.content.properties.Title.__text,
              startTime:b.content.properties.PzlStartTime.__text,
              endTime:b.content.properties.PzlEndTime.__text,
              duration:b.content.properties.PzlDurationHours.__text,

              timezone:b.content.properties.PzlTimeZone.__text,
              description:b.content.properties.PzlDescription.__text,
              state:b.content.properties.PzlState.__text,
              category:b.content.properties.PzlCategory.__text,
              location:b.content.properties.PzlLocation.__text,

              organizer:b.content.properties.PzlOrganizer.__text,
              customerKeyId:b.content.properties.PzlCustomerKeyId.__text,
              resourceKeyId:b.content.properties.PzlResourceKeyId.__text,
              dateImported:b.content.properties.PzlDateImported.__text,
              lastUpdatedOn:b.content.properties.PzlLastUpdatedOn.__text,

              sourceSystemId:b.content.properties.PzlSourceSystemId.__text,
              weekNumber:b.content.properties.PzlWeekNumber.__text,
              yearNumber:b.content.properties.PzlYearNumber.__text,
              modified:b.content.properties.Modified.__text,
              created:b.content.properties.Created.__text
          });
        });
        //$rootScope.$broadcast('didApp.didmobiledata',result);
        $scope.$broadcast('scroll.refreshComplete');
      });

  };
};
