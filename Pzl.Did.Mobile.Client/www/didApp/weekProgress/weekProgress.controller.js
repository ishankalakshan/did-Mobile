angular.module('didApp.weekProgressController', ['angularMoment'])

.controller('weekProgressCtrl', ['$scope',
                                 '$rootScope',
                                 '$state',
                                 '$stateParams',
                                 '$ionicLoading',
                                 '$ionicPopup',
                                 '$ionicActionSheet',
                                 '$timeout',
                                 '$ionicLoading',
                                 'didAppDataService',
                                 'didApploginService',
                                 'didAppDataStoreService', weekProgressCtrl])

function weekProgressCtrl($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicPopup, $ionicActionSheet, $timeout, $ionicLoading,didAppDataService, didApploginService, didAppDataStoreService) {

    $scope.timesheet = [];
    $scope.weekCount = moment().format('WW') * 1;
    $scope.yearCount = moment().format('YYYY') * 1;
    $scope.weekStartend = getWeekStartEnd($scope.weekCount, $scope.yearCount);
    $scope.weeklyTimesheet = [];
    $scope.projectList = [];
    $scope.customerList = [];

    var allWeekTimeEntries = [];
    var noOfWeeksInYear = '';
    var isNotInitialLoad = false;

    function requestProjects() {
        didAppDataService.getProjects()
            .then(function (result) {
                result.data.forEach(function (b) {
                    $scope.projectList.push({
                        id: b.Id,
                        title: b.Title,
                        customerKeyId: b.CustomerKeyId,
                        customerKey: b.CustomerKey,
                        key: b.Key
                    });
                });
            })
            .then(function () {
                didAppDataStoreService.loadTolocalStorageProjects($scope.projectList);
            });
    } //load project data to localDataStorage Service

    function requestCustomers() {
        didAppDataService.getCustomers()
            .then(function (result) {
                result.data.forEach(function (b) {
                    $scope.customerList.push({
                        id: b.Id,
                        title: b.Title,
                        key: b.Key
                    });
                });
            })
            .then(function () {
                didAppDataStoreService.loadTolocalStorageCustomers($scope.customerList);
            });
    } //load customers data to localDataStorage Service

    function requestTimesheet() {
        $ionicLoading.show({
                  template: "<div><i class='fa fa-spinner fa-spin'></i> Loading...</div>"
                });
        didAppDataService.getTimeEntries()
            .then(function (result) {
                console.log(result)
                result.data.forEach(function (b) {
                    $scope.timesheet.push({
                        id: b.Id,
                        title: b.Title,
                        startTime: b.StartTime,
                        endTime: b.EndTime,
                        duration: b.Duration,
                        timezone: b.Timezone,
                        description: b.Description,
                        state: b.State,                   
                        customerKeyId: b.CustomerKeyId,
                        projectKeyId: b.ProjectKeyId,
                        resourceKeyId: b.ResourceKeyId,
                        weekNumber: b.WeekNumber,
                        yearNumber: b.YearNumber
                    });
                });
            })
            .then(function () {
                didAppDataStoreService.loadTolocalStorageTimesheet($scope.timesheet);
                getAllWeekEntries($scope.weekCount, $scope.yearCount);
                setWeekTimeSheet($scope.weekCount, $scope.yearCount);
                $scope.stateWeek = getStateOfWeek();
                isNotInitialLoad = true;
                $scope.summaryHours = getConfirmedHoursPerWeek();
                $ionicLoading.hide();
            });
    } //load timesheet data to localDataStorage Service
    
    requestTimesheet()
    requestCustomers()
    requestProjects()

    function weeksInYear(year) {
        noOfWeeksInYear = Math.max(
            moment(new Date(year, 11, 31)).isoWeek(), moment(new Date(year, 11, 31 - 7)).isoWeek()
        );
        return noOfWeeksInYear
    } //end of weeksInYear

    function getWeekStartEnd(weekNumber, yearNumber) {
        var weekStartEnd = {
            weekNumber: weekNumber,
            weekStart: moment(String(weekNumber) + ' ' + yearNumber, 'WW YYYY').startOf('isoWeek').format('MMM, dddd DD'),
            weekEnd: moment(String(weekNumber) + ' ' + yearNumber, 'WW YYYY').endOf('isoWeek').day(-2).format('MMM, dddd DD')
        };
        return weekStartEnd;
    }; //end of getWeekStartEnd()

    function getAllWeekEntries(weekNumber, yearNumber) {
        allWeekTimeEntries = [];
        $scope.weekStartend = getWeekStartEnd(weekNumber, yearNumber);
        $scope.timesheet.forEach(function (entry) {
            if (entry.weekNumber == weekNumber && entry.yearNumber == yearNumber) {
                allWeekTimeEntries.push(entry);
            } //end if
        }); //end forEach
        $scope.$broadcast('scroll.refreshComplete');
        return allWeekTimeEntries;
    }; //end of getAllWeekEntries

    function getTotalHoursPerDay(date) {
        var totalHours = 0;

        if (allWeekTimeEntries.length == 0) {
            return '-';
        } else {
            allWeekTimeEntries.forEach(function (day) {
                if (moment(day.startTime).format('MMM, dddd DD YYYY') == date) {
                    totalHours += day.duration * 1
                }
            }); //end foreach
            return totalHours;
        }
    }; //end of getTotalHoursPerDay

    function getStateOfDay(date) {
        var suggestCount = 0;
        if (allWeekTimeEntries.length !== 0) {
            allWeekTimeEntries.forEach(function (day) {
                if (moment(day.startTime).format('MMM, dddd DD YYYY') == date && day.state == 'Suggested') {
                    suggestCount += 1
                }
            }); //end foreach
            if (suggestCount > 0) {
                return false;
            } else {
                return true;
            }
        } else {
            true
        }


    }; //end of getStateOfDay

    function getStateOfWeek() {
        var suggestedCount = 0;
        var approvedCount = 0;

        if (allWeekTimeEntries.length !== 0) {
            allWeekTimeEntries.forEach(function (day) {
                if (day.state == 'Suggested') {
                    suggestedCount += 1
                }
                if (day.state == 'Approved') {
                    approvedCount += 1
                }
            }); //end foreach
            if (approvedCount > 0) {
                console.log('Display already confirmed');
                return 'Confirmed';
            } else if (suggestedCount > 0) {
                console.log('dont display button');
                return 'Suggested';
            } else if (suggestedCount == 0 && approvedCount == 0) {
                console.log('Display this is what i DId button');
                return 'DidIt';
            }
        } else {
            return 'Suggested';
        }
    }; //end of getStateOfWeek

    function setWeekTimeSheet(weekNumber, yearNumber) {
        for (var i = 1; i < 6; i++) {

            var weekStartDate = moment(String(weekNumber) + ' ' + yearNumber, 'WW YYYY').startOf('isoWeek').day(i).format('MMM, dddd DD YYYY')
            $scope.weeklyTimesheet.push({
                date: moment(weekStartDate, 'MMM, dddd DD YYYY').format('ddd'),
                dateFull: weekStartDate,
                hours: getTotalHoursPerDay(weekStartDate),
                state: getStateOfDay(weekStartDate)
            });
        }; //end for
    }; //end of setWeekTimeSheet

    function getConfirmedHoursPerWeek() {
        var totalConfirmedHours = 0;
        var totalUnconfirmedHours = 0;
        var totalIgnoredHours = 0;

        if (allWeekTimeEntries.length == 0) {
            return [0, 0, 0];
        } else {
            for (var i = 0; i < allWeekTimeEntries.length; i++) {
                if (allWeekTimeEntries[i].state == 'SystemConfirmed' || allWeekTimeEntries[i].state == 'UserConfirmed' || allWeekTimeEntries[i].state == 'Approved') {
                    totalConfirmedHours += allWeekTimeEntries[i].duration * 1
                }
                if (allWeekTimeEntries[i].state == 'Suggested' || allWeekTimeEntries[i].state == 'Imported') {
                    totalUnconfirmedHours += allWeekTimeEntries[i].duration * 1
                }
                if (allWeekTimeEntries[i].state == 'SystemIgnored' || allWeekTimeEntries[i].state == 'UserIgnored') {
                    totalIgnoredHours += allWeekTimeEntries[i].duration * 1
                }
            }; //end for
            return [totalConfirmedHours, totalUnconfirmedHours, totalIgnoredHours];
        }
    }; //end of getConfirmedHoursPerWeek

    $scope.refreshData = function () {
        $scope.timesheet = [];
        allWeekTimeEntries = [];
        $scope.weeklyTimesheet = [];
        requestTimesheet();
        requestCustomers();
        requestProjects();
    }; //end of refreshData

    $scope.addOneWeek = function () {
        weeksInYear($scope.yearCount)

        if ($scope.weekCount == noOfWeeksInYear) {
            $scope.weekCount = 0;
            $scope.yearCount += 1;
        }

        $scope.weekCount += 1;
        console.log($scope.weekCount);
        $scope.weeklyTimesheet = [];
        //$scope.weekStartend = getWeekStartEnd($scope.weekCount, $scope.yearCount);
        getAllWeekEntries($scope.weekCount, $scope.yearCount);
        setWeekTimeSheet($scope.weekCount, $scope.yearCount);
        $scope.stateWeek = getStateOfWeek();
        $scope.summaryHours = getConfirmedHoursPerWeek();

    }; //end of addOneWeek()

    $scope.substractOneWeek = function () {
        weeksInYear($scope.yearCount - 1)

        if ($scope.weekCount == 1) {
            $scope.weekCount = noOfWeeksInYear + 1
            $scope.yearCount -= 1;
        }

        $scope.weekCount -= 1;
        console.log($scope.weekCount);
        $scope.weeklyTimesheet = [];
        // $scope.weekStartend = getWeekStartEnd($scope.weekCount, $scope.yearCount);
        getAllWeekEntries($scope.weekCount, $scope.yearCount);
        setWeekTimeSheet($scope.weekCount, $scope.yearCount);
        $scope.stateWeek = getStateOfWeek();
        $scope.summaryHours = getConfirmedHoursPerWeek();
    }; //end of substractOneWeek()

    $scope.showActionSheet = function () {

        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
               ],
            destructiveText: 'Logout',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            destructiveButtonClicked: function () {
                    $rootScope.$broadcast("logout");
                    $state.go('login')
                
            }
        });

        //hide the sheet after two seconds
        $timeout(function () {
            hideSheet();
        }, 2000);
    }

}; //end of weekProgressCtrl