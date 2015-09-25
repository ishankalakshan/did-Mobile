angular.module('didApp.projectProgressController', ['angularMoment'])

.controller('projectProgressCtrl', ['$scope', '$stateParams', 'didAppDataStoreService', projectProgressCtrl])

function projectProgressCtrl($scope, $stateParams, didAppDataStoreService) {

    $scope.id = $stateParams.selectedId;
    $scope.project = {};

    var timesheet = didAppDataStoreService.getlocalStorageTimesheet();
    var projectList = didAppDataStoreService.getlocalStorageProjects();
    $scope.customerList = didAppDataStoreService.getlocalStorageCustomers();
    $scope.filteredProjects = [];

    var customerTitle = '';
    var projectTitle = '';


    (function () {
        setProjectDetails();
        getCustomerTitle($scope.project.customerKeyId)
        getProjecTitle($scope.project.projectKeyId)
        getProjects($scope.project.customerKeyId)
    })();

    function setProjectDetails() {
        timesheet.forEach(function (result) {
            if (result.id == $scope.id) {
                $scope.project.startTime = moment(result.startTime).format('hh:mm A')
                $scope.project.endTime = moment(result.endTime).format('hh:mm A')
                $scope.project.duration = result.duration
                $scope.project.customerKeyId = result.customerKeyId
                $scope.project.projectKeyId = result.projectKeyId
                $scope.project.state = result.state
            }
        })
    };

    function getProjects(customerKey) {
        projectList.forEach(function (result) {
            if (result.customerKeyId == customerKey) {
                $scope.filteredProjects.push(result);
            }
        })
    };

    function getCustomerTitle(key) {
        var i = 0;
        $scope.customerList.forEach(function (result) {
            ++i;
            if (result.id == key) {
                customerTitle = i;
                return customerTitle;
            }
        })
    };

    function getProjecTitle(projectKey) {
        var j = 0;
        projectList.forEach(function (result) {
            ++j;
            if (result.id == projectKey) {
                projectTitle = j;
                return projectTitle;
            }
        })
    };


    $scope.customerTitle = $scope.customerList[customerTitle - 1]
    $scope.projectTitle = projectList[projectTitle - 1]


    $scope.setSelectedCustomer = function (customer) {
        $scope.customerTitle = customer;
        $scope.project.customerKeyId = customer.id;
        $scope.filteredProjects = [];
        getProjects(customer.id)
    }

    $scope.setSelectedProject = function (project) {
        if (project != null) {
            $scope.projectTitle = project;
            $scope.project.projectKeyId = project.id;
        }
    }

};