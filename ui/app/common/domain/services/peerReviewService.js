'use strict';

angular.module('bahmni.common.domain')
    .service('peerReviewService', ['$http', function ($http) {
        this.saveReviewRequest = function (params) {
            return $http.post(Bahmni.Common.Constants.peerReviewUrl, params, {
                withCredentials: true,
                headers: {"Accept": "application/json", "Content-Type": "application/json"}
            });
        };

        this.getAllReviewRequests = function () {
            return $http.get(Bahmni.Common.Constants.peerReviewUrl + "/all", {
                headers: {
                    withCredentials: true
                }
            });
        };

        this.getPatientReviewRequests = function (patientUuid) {
            return $http.get(Bahmni.Common.Constants.peerReviewUrl + "/patient", {
                withCredentials: true,
                method: "GET",
                params: {
                    patientUuid: patientUuid
                },
                cache: false
            });
        };

        this.getProviderPatientReviewRequests = function (providerUuid, patientUuid) {
            return $http.get(Bahmni.Common.Constants.peerReviewUrl + "/provider-patient", {
                withCredentials: true,
                method: "GET",
                params: {
                    providerUuid: providerUuid,
                    patientUuid: patientUuid
                },
                cache: false
            });
        };

        this.getProviderPatientReviewResponses = function (providerUuid, patientUuid) {
            return $http.get(Bahmni.Common.Constants.peerReviewUrl + "/response/provider-patient", {
                withCredentials: true,
                method: "GET",
                params: {
                    providerUuid: providerUuid,
                    patientUuid: patientUuid
                },
                cache: false
            });
        };

        this.updateReviewResponse = function (params) {
            return $http.post(Bahmni.Common.Constants.peerReviewUrl + "/response/update/", params, {
                withCredentials: true,
                headers: {"Accept": "application/json", "Content-Type": "application/json"}
            });
        };
    }]);
