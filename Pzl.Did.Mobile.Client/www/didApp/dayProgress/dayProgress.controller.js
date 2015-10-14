angular.module('didApp.dayProgressController', ['angularMoment'])

.controller('dayProgressCtrl', ['$scope', '$rootScope', '$stateParams', 'didAppDataService', 'didAppDataStoreService', dayprogressCtrl])

function dayprogressCtrl($scope, $rootScope, $stateParams, didAppDataService, didAppDataStoreService) {

    $scope.date = $stateParams.selectedDate;
    var timesheet = didAppDataStoreService.getlocalStorageTimesheet();
    var projectList = didAppDataStoreService.getlocalStorageProjects();
    var customerList = didAppDataStoreService.getlocalStorageCustomers();

    $scope.dayTimeSheet = [];

    function initialize() {
        setDayTimeSheet($scope.date);
        //console.log(moment($scope.date).endOf('year').format('YYYY-MM-DD'))
    }

    initialize();

    $scope.refreshData = function () {
        $scope.dayTimeSheet = [];
        timesheet = [];
        projectList = [];
        customerList = [];
        timesheet = didAppDataStoreService.getlocalStorageTimesheet();
        projectList = didAppDataStoreService.getlocalStorageProjects();
        customerList = didAppDataStoreService.getlocalStorageCustomers();
        setDayTimeSheet($scope.date);
    }
    
    $rootScope.$on('RefreshComplete', function () {
        $scope.refreshData();
    });
    function setDayTimeSheet(date) {
        timesheet.forEach(function (entry) {
            if (moment(entry.startTime).format('MMM, dddd DD YYYY') == date) {
                $scope.dayTimeSheet.push({
                    id: entry.id,
                    title: entry.title,
                    hours: entry.duration,
                    customerKey: getCustomerKey(entry.customerKeyId),
                    projectKey: getProjectKey(entry.projectKeyId),
                    state: entry.state
                });
            } //end if
        }); //end forEach
        $scope.$broadcast('scroll.refreshComplete');
    };

    function getCustomerKey(customerId) {
        for (var i = 0; i < customerList.length; i++) {
            if (customerList[i].id == customerId) {
                return customerList[i].key
            }
        }
    };

    function getProjectKey(projectId) {
        for (var i = 0; i < projectList.length; i++) {
            if (projectList[i].id == projectId) {
                console.log(projectList[i])
                return projectList[i].key
            }
        }
    };

};