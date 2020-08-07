'use strict';

angular.module('bahmni.clinical')
    .controller('PeerReviewController', ['$scope', '$rootScope', '$q', 'spinner', 'providerService', 'peerReviewService', function ($scope, $rootScope, $q, spinner, providerService, peerReviewService) {
        var consultation = $scope.consultation;
        $scope.selectedProvider = undefined;
        $scope.consultation.patientReviews = $scope.consultation.patientReviews || [];
        $scope.consultation.reviewedResponses = $scope.consultation.reviewedResponses || {};

        $scope.getProviders = function (params) {
            return providerService.search(params.term).then(mapProvider);
        };

        var init = function () {
            $scope.review = $scope.review || {};
            $scope.review.patient = $scope.consultation.patientUuid || $scope.$parent.patient.uuid;
            $scope.consultation.review = $scope.review;
            $scope.consultation.review.reviewResponses = $scope.review.reviewResponses || [];

            var providerUuid = $rootScope.currentProvider.uuid;
            peerReviewService.getProviderPatientReviewRequests(providerUuid, $scope.review.patient).then(function (response) {
                $scope.consultation.patientReviews = response.data;
            });

            peerReviewService.getProviderPatientReviewResponses(providerUuid, $scope.review.patient).then(function (response) {
                $scope.consultation.myResponses = response.data;
            }).then(function () {
                angular.forEach($scope.consultation.myResponses, function (response) {
                    if (response.uuid in $scope.consultation.reviewedResponses) {
                        var reviewResponse = $scope.consultation.reviewedResponses[response.uuid];
                        if (reviewResponse.comment === undefined) {
                            $scope.consultation.reviewedResponses[response.uuid].comment = response.comments;
                        }
                    }else {
                        $scope.consultation.reviewedResponses[response.uuid] = {"comment" : response.comments};
                    }
                });
            });


        };

        $scope.checkReview = function () {
            $scope.consultation.review.notes = $scope.review.notes;
        };

        var mapProvider = function (result) {
            return _.map(result.data.results, function (provider) {
                var response = {
                    value: provider.display || provider.person.display,
                    uuid: provider.uuid,
                    identifier: provider.identifier
                };
                return response;
            });

        };

        $scope.selectProvider = function (providerInfo) {
            var providerRequest = {
                provider: {
                    uuid: providerInfo.uuid
                }
            };
            //$scope.review.providerUuid = providerInfo.uuid
            $scope.review.reviewResponses.push(providerRequest);
            $scope.consultation.review = $scope.review;
        };

        $scope.responseMap = function (data) {
            return _.map(data, function (providerInfo) {
                providerInfo.label = data.value;
                return providerInfo;
            });
        };

        init();
    }]);
