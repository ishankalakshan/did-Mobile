angular.module('didApp.dayProgressController', ['angularMoment'])

.controller('dayProgressCtrl', ['$scope', '$stateParams','didAppDataService', 'didAppDataStoreService', dayprogressCtrl])

function dayprogressCtrl($scope, $stateParams,didAppDataService, didAppDataStoreService) {

    $scope.date = $stateParams.selectedDate;
    var timesheet = didAppDataStoreService.getlocalStorageTimesheet();
    var projectList = didAppDataStoreService.getlocalStorageProjects();
    var customerList = didAppDataStoreService.getlocalStorageCustomers();

    $scope.dayTimeSheet = [];

    function initialize() {
        setDayTimeSheet($scope.date);
    }

    initialize();
    
//    console.log(timesheet)
 //   console.log(customerList)
//    console.log(projectList)

    $scope.refreshData = function () {
        $scope.dayTimeSheet = [];
        setDayTimeSheet($scope.date);
    }

    function setDayTimeSheet(date) {
        timesheet.forEach(function (entry) {
            if (moment(entry.startTime).format('MMM, dddd DD YYYY') == date) {
                $scope.dayTimeSheet.push({
                    id : entry.id,
                    title:entry.title,
                    hours:entry.duration,
                    customerKey:getCustomerKey(entry.customerKeyId),
                    projectKey:getProjectKey(entry.projectKeyId),
                    state:entry.state
                });
            } //end if
        }); //end forEach
        $scope.$broadcast('scroll.refreshComplete');
    };

    function getCustomerKey(customerId) {
        for(var i=0;i<customerList.length;i++){
            if(customerList[i].id==customerId){
                console.log(customerList[i])
                return customerList[i].key
            }
        }
    };

    function getProjectKey(projectId) {
        for(var i=0;i<projectList.length;i++){
            if(projectList[i].id==projectId){
                console.log(projectList[i])
                return projectList[i].key
            }
        }
    };

};