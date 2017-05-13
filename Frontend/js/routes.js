angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('status', {
    url: '/status',
    templateUrl: 'templates/status.html',
    controller: 'statusCtrl'
  })

  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  })

  .state('tabsController.maps', {
    url: '/maps',
    views: {
      'tab1': {
        templateUrl: 'templates/maps.html',
        controller: 'mapsCtrl'
      }
    }
  })

  .state('tabsController.friends', {
    url: '/friends',
    views: {
      'tab2': {
        templateUrl: 'templates/friends.html',
        controller: 'friendsCtrl'
      }
    }
  })
  

    .state('tabsController.addFriend', {
    url: '/add-friend',
    views: {
	'tab2': {
    templateUrl: 'templates/addFriend.html',
    controller: 'addFriendCtrl'
	}
     }
  })

       .state('tabsController.friendDetail', {
    url: '/friendDetail/:friendId',
    views: {
	'tab2': {
          templateUrl: 'templates/friendDetail.html',
          controller: 'friendDetailCtrl'
	}
     }
  })



  .state('tabsController.alerts', {
    url: '/alerts',
    views: {
      'tab3': {
        templateUrl: 'templates/alerts.html',
        controller: 'alertsCtrl'
      }
    }
  })

  .state('sentiment', {
    url: '/sentiment',
    templateUrl: 'templates/sentiment.html',
    controller: 'sentimentCtrl'
  })

  .state('tweet', {
    url: '/tweet',
    templateUrl: 'templates/tweet.html',
    controller: 'tweetCtrl'
  })

  .state('connect', {
    url: '/connect',
    templateUrl: 'templates/connect.html',
    controller: 'connectCtrl'
  })

$urlRouterProvider.otherwise('/connect')

  

});








/*
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $sceDelegateProvider){
  
  $stateProvider
  .state('page1', {
      url: "/page1",
      abstract: true,
      templateUrl: "templates/tabsController.html"
    })

      .state('page1.maps', {
      url: '/maps',
      views: {
        'maps': {
          templateUrl: 'templates/maps.html',
          controller: 'mapsCtrl'
        }
      }
    })

  .state('page1.friends', {
      url: '/friends',
      views: {
        'friends': {
          templateUrl: 'templates/friends.html',
          controller: 'friendsCtrl'
        }
      }
    })

  .state('page1.friendDetail', {
      url: '/friendDetail/:friendId',
      views: {
        'friends': {
          templateUrl: 'templates/friendDetail.html',
          controller: 'friendDetailCtrl'
        }
      }
    })
  
      .state('page1.alerts', {
      url: '/alerts',
      views: {
        'alerts': {
          templateUrl: 'templates/alerts.html',
          controller: 'alertsCtrl'
        }
      }
    })

        .state('page1.addFriend', {
      url: '/addFriend',
      views: {
        'friends': {
          templateUrl: 'templates/addFriend.html',
          controller: 'addFriendCtrl'
        }
      }
    })
*/
