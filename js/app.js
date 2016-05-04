var app = angular.module("ngBuildings", [
      'ui.router'
]);

app.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push(['$rootScope', function ($rootScope) {
        $rootScope.isLoading = 0;
        return {
            'request': function (config) {
                $rootScope.isLoading++;
                return config
            },
            'requestError': function (rejection) {
                $rootScope.isLoading = Math.max(0, $rootScope.isLoading - 1);
                return rejection
            },
            'response': function (response) {
                $rootScope.isLoading = Math.max(0, $rootScope.isLoading - 1);
                return response;
            },
            'responseError': function (rejection) {
                $rootScope.isLoading = Math.max(0, $rootScope.isLoading - 1);
                return rejection;
            }
        };
    }]);
}]);

app.run(["$rootScope", "$state", "$window", function ($rootScope, $state, $window) {
    $rootScope.$safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        // TODO
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // TODO
    });
    $rootScope.$on('$stateNotFound', function () {
        console.error("$stateNotFound", arguments[1].to);
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        console.error("$stateChangeError", arguments);
    });
}]);