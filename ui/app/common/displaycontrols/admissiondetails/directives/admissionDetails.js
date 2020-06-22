"use strict";

angular.module('bahmni.common.displaycontrol.admissiondetails')
    .directive('admissionDetails', ['bedService', 'observationsService', 'spinner', function (bedService, observationsService, spinner) {
        var controller = function ($scope) {
            $scope.showDetailsButton = function (encounter) {
                return $scope.params && $scope.params.showDetailsButton && !encounter.notes;
            };
            $scope.toggle = function (element) {
                element.show = !element.show;
            };
            init($scope);
        };
        var isReady = function ($scope) {
            return !_.isUndefined($scope.patientUuid) && !_.isUndefined($scope.visitSummary);
        };
        var onReady = function ($scope) {
            var visitUuid = _.get($scope.visitSummary, 'uuid');
            bedService.getAssignedBedForPatient($scope.patientUuid, visitUuid).then(function (bedDetails) {
                $scope.bedDetails = bedDetails;
            });
        };

        var getAdmissionType = function ($scope) {
            const conceptNames = ["ADT TYPE"];
            spinner.forPromise(observationsService.fetch($scope.patientUuid, conceptNames, "1", undefined, $scope.visitSummary.uuid, undefined).then(function (response) {
                if (response.data[0].value) {
                    $scope.adtType = response.data[0].value.name;
                }
            }));
        };
        var init = function ($scope) {
            getAdmissionType($scope);
            var stopWatching = $scope.$watchGroup(['patientUuid', 'visitSummary'], function () {
                if (isReady($scope)) {
                    stopWatching();
                    onReady($scope);
                }
            });

            $scope.isDataPresent = function () {
                if (!$scope.visitSummary || (!$scope.visitSummary.admissionDetails && !$scope.visitSummary.dischargeDetails)) {
                    return $scope.$emit("no-data-present-event") && false;
                }

                return true;
            };
        };
        return {
            restrict: 'E',
            controller: controller,
            templateUrl: "../common/displaycontrols/admissiondetails/views/admissionDetails.html",
            scope: {
                params: "=",
                patientUuid: "=",
                visitSummary: "="
            }
        };
    }]);
