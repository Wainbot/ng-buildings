app.service('REST', function ($q, $http, $rootScope) {
    return {
        send: function (req) {
            var defered = $q.defer();

            $http(req)
                .then(function (response) {
                    if (response.status === 200) {
                        defered.resolve(response.data);
                    } else {
                        defered.reject(response);
                        $rootScope.error = response;
                    }
                }, function (response) {
                    defered.reject(response);
                    $rootScope.error = response;
                });

            return defered.promise;
        }
    };
});

app.service('Buildings', function (REST) {
    var url = 'http://vps.jeremyfroment.fr:3002/rest/';

    return {
        getAll: function () {
            return REST.send({
                method: 'GET',
                url: url
            });
        },
        getBuilding: function (tagid) {
            return REST.send({
                method: 'GET',
                url: url + tagid
            });
        },
        createBuilding: function (building) {
            return REST.send({
                method: 'POST',
                url: url,
                data: building
            });
        },
        deleteBuilding: function (tagid) {
            return REST.send({
                method: 'DELETE',
                url: url + tagid
            });
        },
        updateBuilding: function (building) {
            return REST.send({
                method: 'PUT',
                url: url + building.tag,
                data: building
            });
        },
        getLevel: function (tagid, levelid) {
            return REST.send({
                method: 'GET',
                url: url + tagid + "/" + levelid
            });
        },
        createLevel: function (tagid, level) {
            return REST.send({
                method: 'POST',
                url: url + tagid,
                data: level
            });
        },
        deleteLevel: function (tagid, levelid) {
            return REST.send({
                method: 'DELETE',
                url: url + tagid + "/" + levelid
            });
        },
        updateLevel: function (tagid, level) {
            return REST.send({
                method: 'PUT',
                url: url + tagid + "/" + level.id,
                data: level
            });
        }
    };
});