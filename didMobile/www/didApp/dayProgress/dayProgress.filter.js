angular.module('didApp.dayProgressFilter', ['angularMoment'])

.filter('dayTimeEntry', function() {
    return function (input,date) {
      var input = input;

      if (moment(input.date).format('MMM, dddd DD')==date) {

        return true;
      }else {
        return false;
        console.log('ok');
      }


    }
})
