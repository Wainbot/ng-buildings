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

                $scope.deleteLevel = function (tagid, levelid) {
                    if (confirm("Are you sure you want to delete this level ?")) {
                        Buildings.deleteLevel(tagid, levelid)
                            .then(function () {
                                Buildings.getBuilding(tagid)
                                    .then(function (response) {
                                        $scope.building = response;
                                        console.log("Building :", $scope.building);
                                    });
                            }, function (err) {
                                $rootScope.error = err;
                            });
                    }
                };

                $scope.updateBuilding = function () {
                    Buildings.updateBuilding($scope.building)
                        .then(function () {
                            Buildings.getBuilding($scope.building.tag)
                                .then(function (response) {
                                    $scope.building = response;
                                    console.log("Building :", $scope.building);
                                });
                        }, function (err) {
                            $rootScope.error = err;
                        });
                };

                function EL(id) { return document.getElementById(id); }

                function readFile() {
                    if (this.files && this.files[0]) {
                        var FR= new FileReader();
                        FR.onload = function(e) {
                            $scope.$apply(function () {
                                $scope.building.pic = e.target.result;
                            });
                            console.log($scope.building.pic);
                        };
                        FR.readAsDataURL( this.files[0] );
                    }
                }

                EL("file").addEventListener("change", readFile, false);
            }]
        })

        .state('app.createbuilding', {
            url: "/buildingcreate",
            templateUrl: "./templates/building-new.html",
            controller: ["$rootScope", "$scope", "$state", "Buildings", function ($rootScope, $scope, $state, Buildings) {
                $scope.building = {};

                $scope.newBuilding = function () {
                    console.log('newBuilding :', $scope.building);
                    Buildings.createBuilding($scope.building)
                        .then(function () {
                            $state.go('app.dashboard');
                        }, function (err) {
                            $rootScope.error = err;
                        });
                };

                function EL(id) { return document.getElementById(id); }

                function readFile() {
                    if (this.files && this.files[0]) {
                        var FR= new FileReader();
                        FR.onload = function(e) {
                            $scope.$apply(function () {
                                $scope.building.pic = e.target.result;
                            });
                        };
                        FR.readAsDataURL( this.files[0] );
                    }
                }

                EL("file").addEventListener("change", readFile, false);
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
            controller: ["$rootScope", "$scope", "$stateParams", "level", "Buildings", function ($rootScope, $scope, $stateParams, level, Buildings) {
                $scope.building = $stateParams.tag;
                $scope.level = level;
                console.log("Level :", $scope.level);

                $scope.updateLevel = function () {
                    Buildings.updateLevel($scope.building, $scope.level)
                        .then(function () {
                            Buildings.getLevel($scope.building, $stateParams.level)
                                .then(function (response) {
                                    $scope.level = response;
                                    console.log("Level :", $scope.level);
                                });
                        }, function (err) {
                            $rootScope.error = err;
                        });
                };

                function EL(id) { return document.getElementById(id); } // Get el by ID helper function

                function readFile() {
                    if (this.files && this.files[0]) {
                        var FR= new FileReader();
                        FR.onload = function(e) {
                            $scope.$apply(function () {
                                $scope.level.pic = e.target.result;
                            });
                        };
                        FR.readAsDataURL( this.files[0] );
                    }
                }

                EL("file").addEventListener("change", readFile, false);
            }]
        })

        .state('app.createlevel', {
            url: "/building/:tag/levelcreate",
            templateUrl: "./templates/level-new.html",
            controller: ["$rootScope", "$scope", "$stateParams", "$state", "Buildings", function ($rootScope, $scope, $stateParams, $state, Buildings) {
                $scope.building = $stateParams.tag;
                $scope.level = {
                    number: 0
                };

                $scope.newLevel = function () {
                    console.log($scope.level);
                    Buildings.createLevel($scope.building, $scope.level)
                        .then(function (response) {
                            console.log(response);
                            $state.go('app.building', { tag: $scope.building });
                        }, function (err) {
                            $rootScope.error = err;
                        });
                };

                function EL(id) { return document.getElementById(id); } // Get el by ID helper function

                function readFile() {
                    if (this.files && this.files[0]) {
                        var FR= new FileReader();
                        FR.onload = function(e) {
                            $scope.$apply(function () {
                                $scope.level.pic = e.target.result;
                            });
                        };
                        FR.readAsDataURL( this.files[0] );
                    }
                }

                EL("file").addEventListener("change", readFile, false);
            }]
        })
    ;

    $urlRouterProvider.otherwise("/app/dashboard");
});