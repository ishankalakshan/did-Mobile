angular.module('didApp.EntryProgressController', ['angularMoment'])

.controller('EntryProgressCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', 'didAppDataStoreService', 'EntryProgressService', EntryProgressCtrl])

function EntryProgressCtrl($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicPopup, didAppDataStoreService, EntryProgressService) {

    $scope.id = $stateParams.selectedId;
    $scope.project = {};

    var timesheet = didAppDataStoreService.getlocalStorageTimesheet();
    var projectList = didAppDataStoreService.getlocalStorageProjects();
    $scope.customerList = didAppDataStoreService.getlocalStorageCustomers();
    $scope.filteredProjects = [];

    var customerTitle = '';
    var projectTitle = '';
    var date;


    (function () {
        setProjectDetails();
        getCustomerTitle($scope.project.customerKeyId)
        getProjecTitle($scope.project.projectKeyId)
        getProjects($scope.project.customerKeyId)
    })();

    function setProjectDetails() {
        timesheet.forEach(function (result) {
            if (result.id == $scope.id) {
                date = moment(result.startTime).format('MMM, dddd DD YYYY')
                $scope.project.title = result.title;
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
        $scope.customerKey = customer.key;
        $scope.filteredProjects = [];
        getProjects(customer.id)
    }

    $scope.setSelectedProject = function (project) {
        if (project != null) {
            $scope.projectTitle = project;
            $scope.project.projectKeyId = project.id;
            $scope.projectKey = project.key;
        }
    }

    $scope.updateStateConfirm = function () {
        console.log($scope.project.customerKeyId)
        if ($scope.project.customerKeyId == null) {
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: 'Select a Customer'
            });
            return
        }
        if ($scope.project.projectKeyId == null) {
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: 'Select a Project'
            });
            return
        }
        if ($scope.id == null) {
            console.log('Error 3')
            return
        }
        $ionicLoading.show({
            template: "<div><i class='fa fa-spinner fa-spin'></i> Updating...</div>"
        });
        EntryProgressService.confirmEntry($scope.id, $scope.project.customerKeyId, $scope.project.projectKeyId)
            .then(function (result) {
                if (result.data) {
                    didAppDataStoreService.updateEntryCustomerProjectState($scope.id, $scope.project.customerKeyId, $scope.project.projectKeyId, "UserConfirmed")
                    $rootScope.$broadcast("refreshData");
                    $ionicLoading.hide()
                    $state.go('dayProgress', {
                        selectedDate: date
                    })
                }

            }, function (err) {
                $ionicLoading.hide()
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Error occured while updaing informaion.Please try again later.'
                });
                console.log(err)
            })
    }

    $scope.ignoreEntry = function () {
        $ionicLoading.show({
            template: "<div><i class='fa fa-spinner fa-spin'></i> Updating...</div>"
        });
        EntryProgressService.ignoreEntry($scope.id)
            .then(function (result) {
                didAppDataStoreService.updateEntryState($scope.id,"UserIgnored")
                    $rootScope.$broadcast("refreshData");
                    $ionicLoading.hide()
                    $state.go('dayProgress', {
                        selectedDate: date
                    })     
            }, function (err) {
                $ionicLoading.hide()
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Error occured while updaing informaion.Please try again later.'
                });
                console.log(err)
            })
    }

    $scope.privateEntry = function () {
        $ionicLoading.show({
            template: "<div><i class='fa fa-spinner fa-spin'></i> Updating...</div>"
        });
        EntryProgressService.privateEntry($scope.id)
            .then(function (result) {
                didAppDataStoreService.updateEntryState($scope.id,"UserIgnored")
                    $rootScope.$broadcast("refreshData");
                    $ionicLoading.hide()
                    $state.go('dayProgress', {
                        selectedDate: date
                    })
            }, function (err) {
                $ionicLoading.hide()
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Error occured while updaing informaion.Please try again later.'
                });
                console.log(err)
            })
    }
};