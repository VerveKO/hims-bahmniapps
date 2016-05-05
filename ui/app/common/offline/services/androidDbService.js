'use strict';

angular.module('bahmni.common.offline')
    .service('androidDbService', ['$q',
        function ($q) {
            var getMarker = function (markerName) {
                var value = AndroidOfflineService.getMarker(markerName);
                value = value != undefined ? JSON.parse(value) : value;
                return $q.when(value);
            };

            var insertMarker = function (markerName, uuid, catchmentNumber) {
                return $q.when(AndroidOfflineService.insertMarker(markerName, uuid, catchmentNumber));

            };

            var createPatient = function (patient) {
                var patientString = JSON.stringify(patient);
                var value = AndroidOfflineService.createPatient(patientString);
                value = value != undefined ? JSON.parse(value) : value;
                return $q.when(value);
            };

            var insertAddressHierarchy = function (addressHierarchy) {
                var addressHierarchyString = JSON.stringify(addressHierarchy);
                var value = AndroidOfflineService.insertAddressHierarchy(addressHierarchyString);
                value = value != undefined ? JSON.parse(value) : value;
                return $q.when(value);
            };

            var init = function () {
                // Hemanth: This method is not required for android app.
            };

            var initSchema = function () {
                return $q.when(AndroidOfflineService.initSchema());
            };

            var deletePatientData = function (identifier) {
                AndroidOfflineService.deletePatientData(identifier);
                return $q.when({});

            };

            var getPatientByUuid = function (uuid) {
                var value = AndroidOfflineService.getPatientByUuid(uuid);
                value = value != undefined ? JSON.parse(value) : value;
                angular.forEach(value.patient.person.attributes, function(attribute){
                    if(attribute.hydratedObject){
                        var temp = attribute.hydratedObject;
                        delete attribute.hydratedObject;
                        attribute.hydratedObject = temp;
                    }
                }); 
                return $q.when(value);
            };

            var searchAddress = function(requestParams){
                var addressParams = JSON.stringify(requestParams);
                var value = AndroidOfflineService.searchAddress(addressParams);
                value = value != undefined ? JSON.parse(value) : value;
                return $q.when({data:value});
            };

            var getConfig = function(module){
                var value = AndroidConfigDbService.getConfig(module);
                value = value != undefined ? JSON.parse(value) : value;
                return $q.when(value);
            };

            var insertConfig = function(module, data, eTag){
                return $q.when(JSON.parse(AndroidConfigDbService.insertConfig(module, JSON.stringify(data), eTag)));
            };

            var getReferenceData = function(referenceDataKey){
                var value = AndroidReferenceDataDbService.getReferenceData(referenceDataKey);
                value = value != undefined ? JSON.parse(value) : value;
                return $q.when(value);
            };

            var insertReferenceData = function(key, data, eTag){
                var referenceData;
                if(key == "LocaleList" || key == "DefaultEncounterType" || (key == "RelationshipTypeMap" && data=="")) {
                    referenceData = data;
                }
                else {
                    referenceData = JSON.stringify(data);
                }
                AndroidReferenceDataDbService.insertReferenceData(key, referenceData, eTag);
                return $q.when({})
            };

            var getLocationByUuid = function(uuid){
                var value = AndroidLocationDbService.getLocationByUuid(uuid);
                value = value != undefined ? JSON.parse(value).value : value;
                return $q.when(value);
            };

            var getAttributeTypes = function(){
                var value = AndroidOfflineService.getAttributeTypes();
                value = value != undefined ? JSON.parse(value): value;
                return $q.when(value);
            };

            var createEncounter = function (postRequest) {
                var deferred = $q.defer();
                var uuid = postRequest.patientUuid;
                insertEncounterData(postRequest)
                    .then(function () {
                        deferred.resolve({data: postRequest});
                    });
                return deferred.promise;
            };


            var insertEncounterData = function (encounterData) {
                var response = AndroidOfflineService.insertEncounterData(JSON.stringify(encounterData));
                response = response != undefined ? JSON.parse(response) : response;
                return $q.when(response);
            };

            var getEncountersByPatientUuid = function (patientUuid) {
                var response = AndroidOfflineService.getEncountersByPatientUuid(patientUuid);
                response = response != undefined ? JSON.parse(response) : response;
                return $q.when(response);
            };

            var insertVisitData = function (visitData) {
                var response = AndroidOfflineService.insertVisitData(JSON.stringify(visitData));
                response = response != undefined ? JSON.parse(response) : response;
                return $q.when(response);
            };

            var getVisitByUuid = function (visitUuid) {
                var response = visitDbService.getVisitByUuid(visitUuid);
                response = response != undefined ? JSON.parse(response) : response;
                return $q.when(response);
            };
            
            var getActiveEncounter = function(params){
                var deferred = $q.defer();
                getReferenceData("encounterSessionDuration").then(function(encounterSessionDurationData){
                    var encounterSessionDuration = encounterSessionDurationData.data;
                    getReferenceData("DefaultEncounterType").then(function(defaultEncounterType) {
                        var encounterType = defaultEncounterType ? defaultEncounterType.data : null;
                        var response = AndroidOfflineService.findActiveEncounter(JSON.stringify({patientUuid: params.patientUuid, providerUuid: params.providerUuids[0], encounterType: encounterType}), encounterSessionDuration);
                        response = response != undefined ? JSON.parse(response) : response;
                        deferred.resolve(response);
                    });
                });
                return deferred.promise;
            };


            var getVisitUuidsByPatientUuid = function (patientUuid, numberOfVisits) {
                return $q.when({"data": []});
            };

            var getObservationsFor = function(params) {
                return $q.when({"data": []});
            };

            var insertConceptAndUpdateHierarchy = function(data, parent) {
                if(!parent) {
                    parent = null;
                }
                else{
                    parent = JSON.stringify(parent);
                }
                AndroidConceptDbService.insertConceptAndUpdateHierarchy(JSON.stringify(data), parent);
                return $q.when({})
            };

            var getConcept = function(conceptUuid){
                var value = AndroidConceptDbService.getConcept(conceptUuid);
                value = value != undefined ? JSON.parse(value) : value;
                return $q.when(value);
            };

            var getConceptByName = function(conceptName){
                var value = AndroidConceptDbService.getConceptByName(conceptName);
                value = value != undefined ? JSON.parse(value) : value;
                return $q.when(value);
            };

            return {
                init: init,
                initSchema: initSchema,
                getPatientByUuid: getPatientByUuid,
                createPatient: createPatient,
                deletePatientData: deletePatientData,
                getMarker: getMarker,
                insertMarker: insertMarker,
                insertAddressHierarchy: insertAddressHierarchy,
                searchAddress: searchAddress,
                getConfig: getConfig,
                insertConfig : insertConfig,
                getReferenceData: getReferenceData,
                insertReferenceData: insertReferenceData,
                getLocationByUuid: getLocationByUuid,
                getAttributeTypes: getAttributeTypes,
                insertEncounterData: insertEncounterData,
                getEncountersByPatientUuid: getEncountersByPatientUuid,
                createEncounter: createEncounter,
                insertVisitData: insertVisitData,
                getVisitByUuid: getVisitByUuid,
                getActiveEncounter: getActiveEncounter,
                getVisitUuidsByPatientUuid: getVisitUuidsByPatientUuid,
                getObservationsFor: getObservationsFor,
                insertConceptAndUpdateHierarchy: insertConceptAndUpdateHierarchy,
                getConcept: getConcept,
                getConceptByName: getConceptByName
            }
        }
    ]);