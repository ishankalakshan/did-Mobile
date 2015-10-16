angular.module('didApp.weekProgressController', ['angularMoment'])

.controller('weekProgressCtrl', ['$scope',
                                 '$rootScope',
                                 '$state',
                                 '$stateParams',
                                 '$ionicPopup',
                                 '$ionicActionSheet',
                                 '$timeout',
                                 '$ionicLoading',
                                 'didAppDataService',
                                 'didApploginService',
                                 'didAppDataStoreService',
                                 'WeekProgressService',
                                  weekProgressCtrl]);

function weekProgressCtrl($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicActionSheet, $timeout, $ionicLoading, didAppDataService, didApploginService, didAppDataStoreService, WeekProgressService) {


    $scope.timesheet = [];
    $scope.weekCount = moment().format('WW') * 1;
    var YearCount = moment().format('YYYY') * 1;
    $scope.weekStartend = getWeekStartEnd($scope.weekCount, YearCount);
    $scope.weeklyTimesheet = [];
    $scope.projectList = [];
    $scope.customerList = [];

    var allWeekTimeEntries = [];
    
    function getFutureWeeks(weekNumber, yearNumber) {
            var weeks = [];
            var noOfWeeksInYear = weeksInYear(yearNumber);
            for (i = 0; i < 4; i++) {
                ++weekNumber;
                if (weekNumber > noOfWeeksInYear) {
                    weekNumber = 1;
                    yearNumber = yearNumber + 1;
                    noOfWeeksInYear = weeksInYear(yearNumber);
                }
                weeks.push({
                        week: weekNumber,
                        year: yearNumber
                    })
                    
            }
            return weeks;
        }

    function getPastWeeks(weekNumber, yearNumber) {
            var weeks = [];
            var noOfWeeksInPreviousYear = weeksInYear(yearNumber - 1);

            for (i = 0; i < 4; i++) {

                if (weekNumber == 0) {
                    weekNumber = noOfWeeksInPreviousYear;
                    yearNumber = yearNumber - 1;
                    noOfWeeksInPreviousYear = weeksInYear(yearNumber - 1);
                }
                weeks.push({
                        week: weekNumber,
                        year: yearNumber
                    })
                    --weekNumber;
            }
            return weeks;
        }

    function requestTimesheet(weekNumber, yearNumber) {
        $ionicLoading.show({
            template: "<div><i class='fa fa-spinner fa-spin'></i> Loading...</div>"
        });
        
        var initialWeeks= (getPastWeeks(weekNumber, yearNumber)).concat(getFutureWeeks(weekNumber, yearNumber));

        console.log(initialWeeks)

        didAppDataService.getTimeEntries(initialWeeks)
            .then(function (result) {
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

            }, function (err) {
                console.log(err)
                $ionicLoading.hide();
            })
            .then(function () {
                didAppDataStoreService.loadTolocalStorageTimesheet($scope.timesheet);
                getAllWeekEntries($scope.weekCount, YearCount);
                setWeekTimeSheet($scope.weekCount, YearCount);
                $scope.stateWeek = getStateOfWeek();
                $scope.summaryHours = getConfirmedHoursPerWeek();
                $rootScope.$broadcast("RefreshComplete");
                $ionicLoading.hide();
            }, function (err) {
                console.log(err);
                $ionicLoading.hide()
            });
    } //load timesheet data to localDataStorage Service
    
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

            }, function (err) {
                console.log(err);
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

            }, function (err) {
                console.log(err)
            })
            .then(function () {
                didAppDataStoreService.loadTolocalStorageCustomers($scope.customerList);
            });
    } //load customers data to localDataStorage Service

    requestTimesheet($scope.weekCount, YearCount)
    requestCustomers()
    requestProjects()

    function weeksInYear(year) {
        return Math.max(
            moment(new Date(year, 11, 31)).isoWeek(), moment(new Date(year, 11, 31 - 7)).isoWeek()
        );
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
                return 'Confirmed';
            } else if (suggestedCount > 0) {
                return 'Suggested';
            } else if (suggestedCount == 0 && approvedCount == 0) {
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
                if (allWeekTimeEntries[i].state == 'IgnoreApproved') {
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
        $scope.projectList = [];
        $scope.customerList = [];
        requestTimesheet($scope.weekCount, YearCount);
        requestCustomers();
        requestProjects();
    }; //end of refreshData

    function refreshDataFromLocalStorage() {
        console.log('ok')
        $scope.timesheet = [];
        allWeekTimeEntries = [];
        $scope.weeklyTimesheet = [];
        $scope.projectList = [];
        $scope.customerList = [];

        $scope.timesheet = didAppDataStoreService.getlocalStorageTimesheet();
        $scope.projectList = didAppDataStoreService.getlocalStorageProjects();
        $scope.customerList = didAppDataStoreService.getlocalStorageCustomers();

        getAllWeekEntries($scope.weekCount, YearCount);
        setWeekTimeSheet($scope.weekCount, YearCount);
        $scope.stateWeek = getStateOfWeek();
        $scope.summaryHours = getConfirmedHoursPerWeek();

        $rootScope.$broadcast("RefreshComplete")

    }

    $scope.addOneWeek = function () {
        var noOfWeeksInYear = weeksInYear(YearCount)

        if ($scope.weekCount == noOfWeeksInYear) {
            $scope.weekCount = 0;
            YearCount += 1;
        }

        $scope.weekCount += 1;
        $scope.weeklyTimesheet = [];
        getAllWeekEntries($scope.weekCount, YearCount);
        setWeekTimeSheet($scope.weekCount, YearCount);
        $scope.stateWeek = getStateOfWeek();
        $scope.summaryHours = getConfirmedHoursPerWeek();

    }; //end of addOneWeek()

    $scope.substractOneWeek = function () {
        var noOfWeeksInYear = weeksInYear(YearCount - 1)

        if ($scope.weekCount == 1) {
            $scope.weekCount = noOfWeeksInYear + 1
            YearCount -= 1;
        }

        $scope.weekCount -= 1;
        $scope.weeklyTimesheet = [];
        // $scope.weekStartend = getWeekStartEnd($scope.weekCount, YearCount);
        getAllWeekEntries($scope.weekCount, YearCount);
        setWeekTimeSheet($scope.weekCount, YearCount);
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

    $scope.ApproveWeek = function () {
        $ionicLoading.show({
            template: "<div><i class='fa fa-spinner fa-spin'></i> Updating...</div>"
        });
        var thisWeeksConfirmedIds = [];
        var thisWeeksIgnoredIds = [];

        allWeekTimeEntries.forEach(function (result) {
            if (result.state == 'UserConfirmed' || result.state == 'SystemConfirmed') {
                thisWeeksConfirmedIds.push({
                    id: result.id
                })
            } else if (result.state == 'UserIgnored' || result.state == 'SystemIgnored') {
                thisWeeksIgnoredIds.push({
                    id: result.id
                })
            }

        })

        WeekProgressService.ApproveThisWeek(thisWeeksConfirmedIds, thisWeeksIgnoredIds)
            .then(function (result) {
                if (result.data) {
                    didAppDataStoreService.updateEntryApproved(thisWeeksConfirmedIds, thisWeeksIgnoredIds)
                    $ionicLoading.hide()
                }
            }, function (err) {
                console.log(err)
                $ionicLoading.hide()
            })
            .then(function (result) {
                $rootScope.$broadcast("refreshData")
            })
    }

    $rootScope.$on('refreshData', function () {
        refreshDataFromLocalStorage();
    });

}; //end of weekProgressCtrl