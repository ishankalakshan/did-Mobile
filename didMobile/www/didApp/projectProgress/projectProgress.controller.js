angular.module('didApp.projectProgressController', ['angularMoment'])

.controller('projectProgressCtrl', ['$scope', '$stateParams', 'didAppDataStoreService', projectProgressCtrl])

function projectProgressCtrl($scope, $stateParams, didAppDataStoreService) {

    $scope.id = $stateParams.selectedId;
    $scope.project = {};
    $scope.timesheet = didAppDataStoreService.getlocalStorageTimesheet();
    $scope.projectList = didAppDataStoreService.getlocalStorageProjects();
    $scope.customerList = didAppDataStoreService.getlocalStorageCustomers();
    $scope.filteredProjects = [];

    var customerTitle = '';
    var projectTitle = '';


    (function () {
        setProjectDetails();
        getCustomerTitle($scope.project.customerKeyId);
        getProjecTitle($scope.project.projectKeyId)
    })();

    function setProjectDetails() {
        $scope.timesheet.forEach(function (result) {
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
        $scope.projectList.forEach(function (result) {
            if (result.customerKeyId == customerKey) {
                $scope.filteredProjects.push(result);
            }
        })
    };

    function getCustomerTitle(key) {
        $scope.customerList.forEach(function (result) {
            if (result.id == key) {
                customerTitle = result.title;
                return customerTitle;
            }
        })
    };

    function getProjecTitle(projectKey) {
        $scope.projectList.forEach(function (result) {
            if (result.id == projectKey) {
                projectTitle = result.title;
                return projectTitle;
            }
        })
    };

    $scope.customerTitle = projectTitle;
    $scope.projectTitle = customerTitle;

    console.log($scope.customerTitle);
    console.log($scope.projectTitle);

    $scope.getDuration = function (start, end) {
        return moment.utc(moment(end, "hh:mm A").diff(moment(start, "hh:mm A"))).format("HH:mm")
    };


    $scope.setSelectedCustomer = function (customer) {
        $scope.customerTitle = customer;
        $scope.project.customerKeyId = customer.id;
        $scope.filteredProjects = [];
        getProjects(customer.id)
    }

    $scope.setSelectedProject = function (project) {
        $scope.projectTitle = project;
        $scope.project.projectKeyId = project.id;
    }

};