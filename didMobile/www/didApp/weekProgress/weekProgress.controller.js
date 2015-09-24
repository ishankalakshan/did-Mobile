angular.module('didApp.weekProgressController', ['angularMoment'])

.controller('weekProgressCtrl', ['$scope', '$stateParams', '$ionicLoading', 'didAppDataService', 'didAppDataStoreService', weekProgressCtrl])

function weekProgressCtrl($scope, $stateParams, $ionicLoading, didAppDataService, didAppDataStoreService) {

    $scope.timesheet = [];
    $scope.weekCount = moment().format('WW') * 1;
    $scope.yearCount = moment().format('YYYY') * 1;
    $scope.weekStartend = getWeekStartEnd($scope.weekCount, $scope.yearCount);
    $scope.weeklyTimesheet = [];
    $scope.projectList = [];
    $scope.customerList = [];

    var allWeekTimeEntries = [];
    var noOfWeeksInYear = '';
    var isInitialLoad = false;

    (function () {
        didAppDataService.getProjects()
            .then(function (result) {
                result.data.feed.entry.forEach(function (b) {
                    $scope.projectList.push({
                        id: b.content.properties.Id.__text,
                        title: b.content.properties.Title.__text,
                        customerKeyId: b.content.properties.PzlCustomerKeyId.__text,
                        key: b.content.properties.PzlKey.__text
                    });
                });
            })
            .then(function () {
                didAppDataStoreService.loadTolocalStorageProjects($scope.projectList);
            });
    })(); //load project data to localDataStorage Service

    (function () {
        didAppDataService.getCustomers()
            .then(function (result) {
                result.data.feed.entry.forEach(function (b) {
                    $scope.customerList.push({
                        id: b.content.properties.Id.__text,
                        title: b.content.properties.Title.__text,
                        key: b.content.properties.PzlKey.__text
                    });
                });
            })
            .then(function () {
                didAppDataStoreService.loadTolocalStorageCustomers($scope.customerList);
            });
    })(); //load customers data to localDataStorage Service

    function initialize() {
        didAppDataService.getTimeEntries()
            .then(function (result) {
                result.data.feed.entry.forEach(function (b) {
                    $scope.timesheet.push({
                        id: b.content.properties.Id.__text,
                        title: b.content.properties.Title.__text,
                        startTime: b.content.properties.PzlStartTime.__text,
                        endTime: b.content.properties.PzlEndTime.__text,
                        duration: b.content.properties.PzlDurationHours.__text,

                        timezone: b.content.properties.PzlTimeZone.__text,
                        description: b.content.properties.PzlDescription.__text,
                        state: b.content.properties.PzlState.__text,
                        category: b.content.properties.PzlCategory.__text,
                        location: b.content.properties.PzlLocation.__text,

                        organizer: b.content.properties.PzlOrganizer.__text,
                        customerKeyId: b.content.properties.PzlCustomerKeyId.__text,
                        projectKeyId: b.content.properties.PzlProjectKeyId.__text,
                        resourceKeyId: b.content.properties.PzlResourceKeyId.__text,
                        dateImported: b.content.properties.PzlDateImported.__text,
                        lastUpdatedOn: b.content.properties.PzlLastUpdatedOn.__text,

                        sourceSystemId: b.content.properties.PzlSourceSystemId.__text,
                        weekNumber: b.content.properties.PzlWeekNumber.__text,
                        yearNumber: b.content.properties.PzlYearNumber.__text,
                        modified: b.content.properties.Modified.__text,
                        created: b.content.properties.Created.__text
                    });
                });
            })
            .then(function () {
                didAppDataStoreService.loadTolocalStorageTimesheet($scope.timesheet);
                getAllWeekEntries($scope.weekCount, $scope.yearCount);
                setWeekTimeSheet($scope.weekCount, $scope.yearCount);
                $scope.stateWeek = getStateOfWeek();
                isInitialLoad = true;
            });
    }

    initialize()

    $scope.$on('home.clicked', function () {
        if (isInitialLoad) {
            $scope.timesheet = [];
            allWeekTimeEntries = [];
            $scope.weeklyTimesheet = [];
            $scope.timesheet = didAppDataStoreService.getlocalStorageTimesheet();
            $scope.weekCount = moment().format('WW') * 1;
            $scope.yearCount = moment().format('YYYY') * 1;
            getAllWeekEntries($scope.weekCount, $scope.yearCount);
            setWeekTimeSheet($scope.weekCount, $scope.yearCount);
            $scope.stateWeek = getStateOfWeek();
        };
    });

    function weeksInYear(year) {
        noOfWeeksInYear = Math.max(
            moment(new Date(year, 11, 31)).isoWeek(), moment(new Date(year, 11, 31 - 7)).isoWeek()
        );
        return noOfWeeksInYear
    }


    $scope.refreshData = function () {
        $scope.timesheet = [];
        allWeekTimeEntries = [];
        //$scope.weekCount = moment().format('WW') * 1;
        //$scope.yearCount = moment().format('YYYY') * 1;
        $scope.weeklyTimesheet = [];
        initialize();
    };

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
    };

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
    };

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
    };

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
    }; //end of substractOneWeek()

    $scope.onLoad = function () {

        getAllWeekEntries('37', '2015');
        setWeekTimeSheet('37', '2015');
    };



}; //end of weekProgressCtrl