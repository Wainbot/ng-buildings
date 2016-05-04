app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "./templates/app.html",
            controller: ["$rootScope", "$scope", "$state", "$window", function ($rootScope, $scope, $state, $window) {

            }]
        })

        .state('app.dashboard', {
            url: "/dashboard",
            templateUrl: "./templates/dashboard.html",
            resolve: {
                buildings: function (Buildings) {
                    return Buildings.getAll();
                }
            },
            controller: ["$rootScope", "$scope", "Buildings", "buildings", function ($rootScope, $scope, Buildings, buildings) {
                $scope.buildings = buildings.buildings;
                console.log("Buildings :", $scope.buildings);

                $scope.deleteBuilding = function (tagid) {
                    if (confirm("Are you sure you want to delete this building ?")) {
                        Buildings.deleteBuilding(tagid)
                            .then(function () {
                                Buildings.getAll()
                                    .then(function (response) {
                                        $scope.buildings = response.buildings;
                                        console.log("Buildings :", $scope.buildings);
                                    });
                            }, function (err) {
                                $rootScope.error = err;
                            });
                    }
                }
            }]
        })

        .state('app.building', {
            url: "/building/:tag",
            templateUrl: "./templates/building.html",
            resolve: {
                building: function (Buildings, $stateParams) {
                    return Buildings.getBuilding($stateParams.tag);
                }
            },
            controller: ["$rootScope", "$scope", "Buildings", "building", function ($rootScope, $scope, Buildings, building) {
                $scope.building = building;
                console.log("Building :", $scope.building);

                $scope.deleteLevel = function (levelid) {
                    if (confirm("Are you sure you want to delete this level ?")) {
                        Buildings.deleteLevel($scope.building.tag, levelid)
                            .then(function () {
                                Buildings.getBuilding()
                                    .then(function (response) {
                                        $scope.building = response;
                                        console.log("Building :", $scope.building);
                                    });
                            }, function (err) {
                                $rootScope.error = err;
                            });
                    }
                };
            }]
        })

        .state('app.createbuilding', {
            url: "/buildingcreate",
            templateUrl: "./templates/building-new.html",
            controller: ["$rootScope", "$scope", "Buildings", function ($rootScope, $scope, Buildings) {
                $scope.building = {};

                $scope.newBuilding = function () {
                    console.log($scope.building);
                    //Buildings.createBuilding($scope.building);
                }
            }]
        })

        .state('app.level', {
            url: "/building/:tag/level/:level",
            templateUrl: "./templates/level.html",
            resolve: {
                level: function (Buildings, $stateParams) {
                    return Buildings.getLevel($stateParams.tag, $stateParams.level);
                }
            },
            controller: ["$rootScope", "$scope", "$stateParams", "level", function ($rootScope, $scope, $stateParams, level) {
                $scope.building = $stateParams.tag;
                $scope.level = level;
                console.log("Level :", $scope.level);
            }]
        })

        .state('app.createlevel', {
            url: "/building/:tag/levelcreate",
            templateUrl: "./templates/level-new.html",
            controller: ["$rootScope", "$scope", "$stateParams", "Buildings", function ($rootScope, $scope, $stateParams, Buildings) {
                $scope.building = $stateParams.tag;
                $scope.level = {};

                $scope.newLevel = function () {
                    console.log($scope.level);
                    //Buildings.createLevel($scope.level);
                }
            }]
        })
    ;

    $urlRouterProvider.otherwise("/app/dashboard");
});