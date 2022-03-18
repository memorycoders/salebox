var myApp = angular.module('myapp', [])
    .constant('config', {
        appName: 'Salesbox',
        appVersion: 0.1,
        rootDropbox: "SaleBox",
        baseURL: 'https://production.salesbox.com/',
        deviceToken: "WEB_TOKEN",
        version: "3.0",
        serviceVersion: "v3.0"
    })
    .factory('customFieldErrorService', function () {
        return {
            populateErrorAddCustomField: function (dataError) {
                switch (dataError.errorMessage) {
                    case "MEASUREMENT_TYPE_DOES_NOT_EXIST_ERROR":
                        app.showNotification("", "MEASUREMENT_TYPE_DOES_NOT_EXIST_ERROR");
                        break;
                    case "LINE_OF_BUSINESS_DOES_NOT_EXIST_ERROR":
                        app.showNotification("", "LINE_OF_BUSINESS_DOES_NOT_EXIST_ERROR");
                        break;
                    case "PRODUCT_NAME_UNIQUE":
                        app.showNotification("", "Product name must be unique");
                        break;
                }
            },
        }
    })
    .factory('customFieldService', function (customFieldErrorService, $http, config) {
        var enterpriseId = localStorage.getItem('enterpriseId');
        return {
            getCustomFieldByObjectType: function (token, objectType, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/customField/listByObject?token=' + token + '&objectType=' + objectType + '&enterpriseId=' + enterpriseId,
                    method: 'GET',
                    data: ''
                }).then(function (data, status, headers, config) {
                    successCallback(data.data);
                }, function (data, status, headers, config) {
                    failureCallback(data);
                });
            },
            getDetailCustomField: function (token, uuid, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/customField/' + uuid + '?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'GET',
                    data: ''
                }).then(function (data, status, headers, config) {
                    successCallback(data.data);
                }, function (data, status, headers, config) {
                    failureCallback(data);
                });
            },
            getDateFormats: function (token, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/dateTimeFormat/list?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'GET',
                    data: ''
                }).then(function (data, status, headers, config) {
                    successCallback(data.data);
                }, function (data, status, headers, config) {
                    failureCallback(data);
                });
            },
            addCustomField: function (token, customField, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/customField/add?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: customField
                }).then(function (data, status, headers, config) {
                    successCallback(data.data);
                }, function (data, status, headers, config) {
                    customFieldErrorService.populateErrorAddCustomField(data);
                    failureCallback(data);
                });
            },
            updateCustomFieldsPosition: function (token, customFields, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/customField/reorder?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: customFields,
                    transformResponse: function (data, headersGetter, status) {
                        return data;
                    }
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data.data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },
            updateCustomField: function (token, customField, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/customField/edit?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: customField
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data.data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },
            deleteCustomField: function (token, customField, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/customField/delete?token=' + token + '&customFieldId=' + customField.uuid + '&enterpriseId=' + enterpriseId,
                    method: 'GET',
                    transformResponse: function (data, headersGetter, status) {
                        return data;
                    }
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data.data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },
            changeActiveCustomField: function (token, customFieldId, customFieldActive, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/customField/editActive?token=' + token + '&customFieldId=' + customFieldId + '&active=' + customFieldActive + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: null,
                    transformResponse: function (data, headersGetter, status) {
                        return data;
                    }
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data.data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },
            changeRequiredCustomField: function (token, customFieldId, customFieldRequired, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/customField/editRequired?token=' + token + '&customFieldId=' + customFieldId + '&required=' + customFieldRequired + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: null,
                    transformResponse: function (data, headersGetter, status) {
                        return data;
                    }
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data.data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },
            changeMultiChoiseCustomField: function (token, customFieldId, customFieldMultiChoise, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/customField/editMultiChoice?token=' + token + '&customFieldId=' + customFieldId + '&multiChoice=' + customFieldMultiChoise + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: null,
                    transformResponse: function (data, headersGetter, status) {
                        return data;
                    }
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data.data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },
            getCustomFieldValueByObject: function (token, customObjectFieldId, customFieldObjectType, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/customFieldValue/listByObject?token=' + token + '&objectId=' + customObjectFieldId + '&objectType=' + customFieldObjectType + '&enterpriseId=' + enterpriseId,
                    method: 'GET',
                    data: '',
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data.data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },
            updateCustomFieldValue: function (token, objectId, customFieldDTO, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'enterprise-' + config.serviceVersion + '/customFieldValue/addOrEdit?token=' + token + '&objectId=' + objectId + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: customFieldDTO,
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data.data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },
            getListSequentialActivity: function (token, successCallback, failureCallback) {
                var url = config.baseURL + 'prospect-' + config.serviceVersion + '/getListActivitySequential?' + '&enterpriseId=' + enterpriseId;
                return $http({
                    url: url,
                    params: {
                        token: token
                    },
                    method: 'POST',
                    data: ''
                }).then(function (data, status, headers, config) {
                    successCallback(data.data);
                }, function (data, status, headers, config) {
                    failureCallback(data);
                });
            },
        }
    })
    .factory('productService', function (productCustomErrorService, $http, config) {
        var productList = [];
        var productGroupUUIDList;
        var enterpriseId = localStorage.getItem('enterpriseId');
        var token = localStorage.getItem('currentUserId');

        return {
            asyncProductListByProductGroup: function (token, productGroupId, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/listByLineOfBusiness/' + productGroupId + '?token=' + token,
                    method: 'GET',
                    data: ''
                })
                    .then(function (data, status, headers, config) {
                        productList = data.productDTOList;
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },
            asyncProductListByProductGroupList: function (token, listProductGroupId, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/listByMultiLineOfBusiness?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: listProductGroupId
                })
                    .then(function (data, status, headers, config) {
                        productList = data.productDTOList;
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },
            getProductInWizard: function (token, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/getInWizard?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'GET',
                    data: ''
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },

            listByLineOfBusiness: function (opts, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/listByLineOfBusiness/' + opts.uuid + '&enterpriseId=' + enterpriseId,
                    params: {
                        token: token,
                        orderBy: opts.orderBy,
                        pageIndex: angular.isUndefinedOrNull(opts.pageIndex) ? null : opts.pageIndex,
                        pageSize: angular.isUndefinedOrNull(opts.pageSize) ? null : opts.pageSize
                    },
                    method: 'GET',
                    data: ''
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },

            changeActiveStatus: function (opts, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/changeActiveStatus?' + '&enterpriseId=' + enterpriseId,
                    params: {
                        token: token,
                        uuid: opts.uuid,
                        activeStatus: opts.activeStatus
                    },
                    method: 'POST',
                    data: '',
                    transformResponse: function (data, headersGetter, status) {
                        return data;
                    }
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },

            updateProduct: function (token, dto, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/update' + '&enterpriseId=' + enterpriseId,
                    params: {
                        token: token
                    },
                    method: 'POST',
                    data: dto
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },

            deleteProduct: function (opts, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/delete/' + opts.uuid + '&enterpriseId=' + enterpriseId,
                    params: {
                        token: token
                    },
                    method: 'GET',
                    data: '',
                    transformResponse: function (data, headersGetter, status) {
                        return data;
                    }
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },

            updateProductInWizard: function (token, dto, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/updateInWizard?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: dto
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },

            addProduct: function (token, dto, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/add?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: dto
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        productCustomErrorService.populateErrorAddProduct(data);
                        failureCallback(data);
                    });
            },
            addProductCustomField: function (token, dto, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/addCustomField?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: dto
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        productCustomErrorService.populateErrorAddProduct(data);
                        failureCallback(data);
                    });
            },
            updateProductCustomField: function (token, dto, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/updateCustomField?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: dto
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        productCustomErrorService.populateErrorAddProduct(data);
                        failureCallback(data);
                    });
            },
            getProductList: function () {
                return productList;
            },

            getCompanyProducts: function (opts, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/listByCompany' + '&enterpriseId=' + enterpriseId,
                    method: 'GET',
                    params: {
                        token: token
                    },
                    data: ''
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        productCustomErrorService.populateErrorAddProduct(data);
                        failureCallback(data);
                    });
            },
            getProductByProductGroupAndProductType: function (token, data, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/listByProductGroupListAndProductTypeList' + '?token=' + token + '&enterpriseId=' + enterpriseId,
                    method: 'POST',
                    data: data
                })
                    .then(function (data, status, headers, config) {
                        successCallback(data);
                    }, function (data, status, headers, config) {
                        failureCallback(data);
                    });
            },
            // setDataFromProductSettingController: function (data) {
            //     productGroupUUIDList = data;
            // },
            // getDataFromProductSettingController: function () {
            //     return productGroupUUIDList;
            // }
            getProductTagOptions: function (params, successCallback, failureCallback) {
                return $http({
                    url: config.baseURL + 'administration-' + config.serviceVersion + '/product/productTagOptions' + '?enterpriseID=' + enterpriseId,
                    method: 'GET',
                    params: {
                        customFieldId: params.customFieldId,
                        searchText: params.searchText,
                        token: token
                    }
                }).then(function (data, status, headers, config) {
                    successCallback(data);
                }, function (data, status, headers, config) {
                    failureCallback(data);
                });
            },
        };
    })
    .factory('productCustomErrorService', function () {
        return {
            populateErrorAddProduct: function (dataError) {
                switch (dataError.errorMessage) {
                    case "MEASUREMENT_TYPE_DOES_NOT_EXIST_ERROR":
                        app.showNotification("", "MEASUREMENT_TYPE_DOES_NOT_EXIST_ERROR");
                        break;
                    case "LINE_OF_BUSINESS_DOES_NOT_EXIST_ERROR":
                        app.showNotification("", "LINE_OF_BUSINESS_DOES_NOT_EXIST_ERROR");
                        break;
                    case "PRODUCT_NAME_UNIQUE":
                        app.showNotification("", "Product name must be unique");
                        break;
                }
            },
            populateErrorAddProductType: function (dataError) {
                switch (dataError.errorMessage) {
                    case "MEASUREMENT_TYPE_NAME_UNIQUE":
                        app.showNotification("", "Product name must be unique");
                        break;
                }
            },
            popupDeleteProductError: function (data) {
                if (data) {
                    data = angular.fromJson(data);

                    switch (data.errorMessage) {
                        case 'ERROR_DELETE_PRODUCT_ORDER_ROW_IN_USE':
                            app.showNotification("", "Order row is in using");
                            break;
                        default:
                            app.showNotification("", "Cannot delete product. Server return unknown error. Message:" + (data ? ' ' + data.errorMessage : ' Unknown'));
                    }
                }
            }
        }
    })
    .directive('customFieldView', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                objectType: '=objectType'
            },
            templateUrl: './composeemail/pluginCustomFieldViewTemplate.html',
            controller: function ($scope, customFieldService, $rootScope) {
                var contactId;
                var token = localStorage.getItem('currentUserId');
                var enterpriseId = localStorage.getItem('enterpriseId');
                var asyncCustomFieldList = function (successCallback, failureCallback) {
                    if ($scope.objectId) {
                        customFieldService.getCustomFieldValueByObject(token, $scope.objectId, $scope.objectType,
                            function (data) {
                                $scope.customFieldList = data.customFieldDTOList;
                            }, function (data) {
                            }
                        );
                    }
                }

                var refreshCustomFieldList = function () {
                    var email = globalAddin.getLocalStorageItem('contactEmail');
                    $.ajax({
                        type: "GET",
                        url: serviceUrl + "contact-" + version + "/getDetailsFromEmail?token=" + token + "&email=" + email + "&languageCode=en" + "&enterpriseID=" + enterpriseId,
                        success: function (data) {
                            globalAddin.contactData = data;
                            contactId = data.uuid;
                            $scope.objectId = contactId;
                            asyncCustomFieldList();
                        },
                        error: function (jqXhr, status, error) {
                        },
                        cache: false
                    });

                }
                $scope.messegeErrorList = [];
                refreshCustomFieldList();
                $scope.toggleChange = function (customField) {
                    customField.$$change = true;
                };
                $scope.clearDateFieldView = function (e, customField) {
                    $(e.target).parent().find('.input-date').val('');
                    customField.$$change = true;
                    customField.$$check = true;
                }
                $scope.updateCustomField = function (customField) {
                    $scope.messegeErrorList = [];
                    if (customField.$$change || customField.fieldType === 'PRODUCT_TAG') {
                        switch (customField.fieldType) {
                            case 'NUMBER':
                                var error = false;
                                customField.$$validate = error;

                                if (customField.required == true) {
                                    if (customField.customFieldValueDTOList.length == 0 || customField.customFieldValueDTOList[0].value == '') {
                                        error = true;
                                        $scope.messegeErrorList.push(customField.title + " is required");
                                    }
                                }
                                if (customField.customFieldValueDTOList[0].value != '') {
                                    if (customField.customFieldOptionDTO.numberOfIntegers != null || customField.customFieldOptionDTO.numberOfIntegers != null) {
                                        var patt = new RegExp("(^-?\\d{1," + customField.customFieldOptionDTO.numberOfIntegers + "}\\.\\d{" + customField.customFieldOptionDTO.numberOfDecimals + "}$)|(^\\d{1," + customField.customFieldOptionDTO.numberOfIntegers + "}$)");
                                        var string = customField.customFieldValueDTOList[0].value;
                                        if (!patt.test(string)) {
                                            error = true;
                                            $scope.messegeErrorList.push(customField.title + " wrong format " + customField.customFieldOptionDTO.numberOfIntegers + " integers and " + customField.customFieldOptionDTO.numberOfDecimals + " decimal.");
                                        }
                                    } else {
                                        var patt = new RegExp("^-?\\d+$");
                                        var string = customField.customFieldValueDTOList[0].value;
                                        if (!patt.test(string)) {
                                            error = true;
                                            $scope.messegeErrorList.push(customField.title + " wrong format number.");
                                        }
                                    }
                                }
                                if (error == true) {
                                    customField.$$validate = error;
                                } else {
                                    customField.$$validate = error;
                                    UpdateHere();
                                }
                                break;
                            case 'TEXT':
                                var error = false;
                                customField.$$validate = error;
                                if (customField.required == true) {
                                    if (customField.customFieldValueDTOList.length == 0 || customField.customFieldValueDTOList[0].value == '') {
                                        error = true;
                                        $scope.messegeErrorList.push(customField.title + " is required");
                                    }
                                }
                                if (customField.customFieldOptionDTO.maxLength) {
                                    if (customField.customFieldValueDTOList.length == 0 || customField.customFieldValueDTOList[0].value.length > customField.customFieldOptionDTO.maxLength) {
                                        error = true;
                                        $scope.messegeErrorList.push(customField.title + " max length " + customField.customFieldOptionDTO.maxLength);
                                    }
                                }
                                if (error == true) {
                                    customField.$$validate = error;
                                } else {
                                    customField.$$validate = error;
                                    UpdateHere();
                                }
                                break;
                            case 'TEXT_BOX':
                                var error = false;
                                customField.$$validate = error;
                                if (customField.required == true) {
                                    if (customField.customFieldValueDTOList.length == 0 || customField.customFieldValueDTOList[0].value == '') {
                                        error = true;
                                        $scope.messegeErrorList.push(customField.title + " is required");
                                    }
                                }
                                if (customField.customFieldOptionDTO.maxLength) {
                                    if (customField.customFieldValueDTOList.length == 0 || customField.customFieldValueDTOList[0].value.length > customField.customFieldOptionDTO.maxLength) {
                                        error = true;
                                        $scope.messegeErrorList.push(customField.title + " max length " + customField.customFieldOptionDTO.maxLength);
                                    }
                                }
                                if (error == true) {
                                    customField.$$validate = error;
                                } else {
                                    customField.$$validate = error;
                                    UpdateHere();
                                }
                                break;
                            case 'DATE':
                                var error = false;
                                customField.$$validate = error;
                                if (customField.required == true) {
                                    if (customField.customFieldValueDTOList.length == 0 || customField.customFieldValueDTOList[0].value == '') {
                                        error = true;
                                        $scope.messegeErrorList.push(customField.title + " is required");
                                    }
                                }
                                if (error == true) {
                                    customField.$$validate = error;
                                } else {
                                    if (customField.$$check == true) {
                                        customField.customFieldValueDTOList[0].value = '';
                                        customField.customFieldValueDTOList[0].dateValue = customField.customFieldValueDTOList[0].value;
                                        customField.$$check = false;
                                        UpdateHere();
                                    } else {
                                        customField.$$validate = error;
                                        customField.customFieldValueDTOList[0].dateValue = new Date(customField.customFieldValueDTOList[0].value).getTime();
                                        UpdateHere();
                                    }
                                }
                                break;
                            case 'URL':
                                var error = false;
                                customField.$$validate = error;
                                if (customField.required == true) {
                                    if (customField.customFieldValueDTOList.length == 0 || customField.customFieldValueDTOList[0].value == '') {
                                        error = true;
                                        $scope.messegeErrorList.push(customField.title + " is required");
                                    }
                                }
                                if (error == true) {
                                    customField.$$validate = error;
                                } else {
                                    customField.$$validate = error;
                                    UpdateHere();
                                }
                                break;
                            case 'CHECK_BOXES':
                                UpdateHere();
                                break;
                            case 'PRODUCT_TAG':
                                UpdateHere();
                                break;
                        }

                        function UpdateHere() {
                            $('#loading').fadeIn();
                            customFieldService.updateCustomFieldValue(token, $scope.objectId, customField,
                                function (data) {
                                    $('#loading').fadeOut();
                                    app.showNotification("", 'Updated successfully.');
                                    customField.$$change = false;
                                },
                                function (data) {
                                    $('#loading').fadeOut();
                                }
                            );
                        }
                    }
                }
                $scope.updateCustomFieldCheck = function (checkBoxValue, customField) {
                    $scope.toggleChange(customField);
                    if (customField.customFieldOptionDTO.multiChoice) {
                        checkBoxValue.isChecked = !checkBoxValue.isChecked;
                        $scope.updateCustomField(customField);
                    } else {
                        if (checkBoxValue.isChecked == false) {
                            for (i = 0; i < customField.customFieldValueDTOList.length; i++) {
                                if (customField.customFieldValueDTOList[i].customFieldOptionValueUuid == checkBoxValue.customFieldOptionValueUuid) {
                                    customField.customFieldValueDTOList[i].isChecked = true;
                                } else {
                                    customField.customFieldValueDTOList[i].isChecked = false;
                                }
                            }
                            $scope.updateCustomField(customField);
                        } else {
                            checkBoxValue.isChecked = !checkBoxValue.isChecked;
                            $scope.updateCustomField(customField);
                        }
                    }
                }
                $scope.$on('selectProduct', function (event, customField) {
                    $scope.updateCustomField(customField);
                });
                $scope.$on('removeProduct', function (event, customField) {
                    $scope.updateCustomField(customField);
                });
                $rootScope.clickToggle = false;
                $(document).click(function () {
                    if ($rootScope.clickToggle !== true) {
                        var elements = $(document).find('.scroll-field-product-tag');
                        $(elements).removeClass('display-block').addClass('display-none');
                    }
                    $rootScope.clickToggle = false;
                });
            }
        }
    })
    .directive('customFieldProductTag', function (customFieldService, productService) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                customField: "=customField",
                objectId: "=objectId",
            },
            templateUrl: './composeemail/customFieldProductTag.html',
            controller: function ($scope, $rootScope) {
                var MAX_TAG_DISPLAY_LENGTH = 20;
                var SPACE = ' ';
                var HASH = '#';
                var EMPTY_STR = '';
                $scope.searchText = EMPTY_STR;
                $scope.productTagOptions = [];
                $scope.isSearching = false;
                $scope.isDisplayedProductTagOptions = false;

                // functions

                $scope.isEmptyProductTagOptions = function () {
                    return !$scope.productTagOptions || $scope.productTagOptions.length === 0;
                };
                $scope.isValidSearchText = function () {
                    return $scope.searchText && $scope.searchText[0] === HASH && $scope.searchText.length > 1 && !$scope.searchText.includes(SPACE);
                };

                $scope.onChangeSearchText = function () {
                    $scope.productTagOptions = [];
                    $scope.productTag = [];
                    $scope.isDisplayedProductTagOptions = false;
                    if (!$scope.isValidSearchText()) {
                        return;
                    }
                    var params = {
                        customFieldId: $scope.customField.uuid,
                        searchText: $scope.searchText.substring(1),
                        token: sessionStorage.getItem('token')
                    };
                    $scope.isSearching = true;
                    $scope.isDisplayedProductTagOptions = true;
                    productService.getProductTagOptions(params, function (foundProducts) {
                        $scope.isSearching = false;
                        var selectedProductIds = $scope.customField.customFieldValueDTOList.map(function (cfVal) {
                            return cfVal.productId;
                        });
                        if (selectedProductIds.length > 0) {
                            selectedProductIds.forEach(function (ele) {
                                foundProducts.data.forEach(function (element, index) {
                                    if (element.uuid == ele) {
                                        foundProducts.data.splice(index, 1);
                                    }
                                });
                            });
                            $scope.productTagOptions = foundProducts.data;
                        } else {
                            $scope.productTagOptions = foundProducts.data;
                        }
                        if ($scope.isEmptyProductTagOptions()) {
                            $scope.isDisplayedProductTagOptions = false;
                        }
                    }, function (data) {
                        $scope.isDisplayedProductTagOptions = false;
                    });
                };

                $scope.onSelect = function (selectedProduct) {
                    var cfValDTO = {
                        objectId: $scope.objectId,
                        productId: selectedProduct.uuid,
                        value: selectedProduct.name
                    };
                    if (!$scope.customField.customFieldOptionDTO.multiChoice) {
                        $scope.customField.customFieldValueDTOList = [];
                    }
                    $scope.customField.customFieldValueDTOList.push(cfValDTO);
                    $scope.$emit('selectProduct', $scope.customField);
                    $scope.searchText = EMPTY_STR;
                    $scope.productTagOptions = [];
                    $scope.isDisplayedProductTagOptions = false;
                };

                $scope.onRemoveProduct = function (selectedCfValDTO) {
                    $scope.customField.customFieldValueDTOList = $scope.customField.customFieldValueDTOList.filter(function (cfValDTO) {
                        return cfValDTO.productId !== selectedCfValDTO.productId;
                    });
                    $scope.$emit('removeProduct', $scope.customField);
                };

                $scope.checkClickInside = function (e) {
                    var elements = $(e.target).parent().find('.scroll-field-product-tag')[0];
                    $(elements).removeClass('display-none').addClass('display-block');
                };

                $scope.toggleDisplayProductTagOptions = function (e) {
                    $rootScope.clickToggle = true;
                    var element = $(e.target).parent().find('.scroll-field-product-tag');
                    if ($(element).hasClass('display-block')) {
                        $(element).addClass('display-none').removeClass('display-block');
                    } else {
                        $(element).removeClass('display-none').addClass('display-block');
                    }
                    if ($scope.isEmptyProductTagOptions()) {
                        return;
                    }
                    $scope.isDisplayedProductTagOptions = !$scope.isDisplayedProductTagOptions;
                };

                $scope.formatTag = function (tagVal) {
                    if (!tagVal) {
                        return EMPTY_STR;
                    }
                    tagVal = HASH.concat(tagVal.replace(/\s/g, EMPTY_STR));
                    return tagVal.length < MAX_TAG_DISPLAY_LENGTH ? tagVal : tagVal.substring(0, MAX_TAG_DISPLAY_LENGTH).concat('...');
                };
            }
        };
    })
    .directive('customFieldDropdown', function (customFieldService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                customField: '=customFieldData',
                objectId: '=customFieldObject',
                dontUpdateDate: '=?dontUpdateDate',
                onChangeAnyValue: "=?onChangeAnyValue"
            },
            templateUrl: './composeemail/CustomFieldDropdown.html',
            controller: function ($scope, $element) {
                var token = localStorage.getItem('currentUserId');
                $scope.loadOptions = function () {
                    $scope.options = $scope.entity;
                };
                if (!$scope.customField.customFieldOptionDTO.multiChoice) {
                    for (var i = 0; i < $scope.customField.customFieldValueDTOList.length; i++) {
                        if ($scope.customField.customFieldValueDTOList[i].isChecked == true) {
                            $scope.entity = $scope.customField.customFieldValueDTOList[i].value;
                        }
                    }
                } else {
                    // do nothing
                }

                $scope.selectOption = function (object) {
                    if ($scope.customField.customFieldOptionDTO.multiChoice) {
                        object.isChecked = !object.isChecked;
                        updateCustomField($scope.customField);
                    } else {
                        for (i = 0; i < $scope.customField.customFieldValueDTOList.length; i++) {
                            if ($scope.customField.customFieldValueDTOList[i].value == object.value) {
                                $scope.customField.customFieldValueDTOList[i].isChecked = true;
                            } else {
                                $scope.customField.customFieldValueDTOList[i].isChecked = false;
                            }
                        }
                        updateCustomField($scope.customField);
                        $scope.entity = object.value;
                    }
                };

                $scope.removeOption = function (object) {
                    object.isChecked = !object.isChecked;
                    updateCustomField($scope.customField);
                };

                var updateCustomField = function (customField) {
                    if (!$scope.dontUpdateDate) {
                        $('#loading').fadeIn();
                        customFieldService.updateCustomFieldValue(token, $scope.objectId, customField,
                            function (data) {
                                $scope.customField = data;
                                $('#loading').fadeOut();
                                // toastr.then(gettextCatalog.getString('Updated successfully.'));
                                app.showNotification("", "Updated successfully.");
                            },
                            function (data) {
                                $('#loading').fadeOut();
                            }
                        );
                    }

                }
            }
        }
    })
    .directive('periodpicker', function ($rootScope, $timeout) {
        var formatDay = 'YYYY/MM/DD';
        var formatTime = 'HH:mm';
        var format = formatTime + ' ' + formatDay;
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                opts: '=periodOptions'
            },
            link: function (scope, ele, attrs, ctrl) {
                var opts = {
                    norange: true, // use only one value
                    cells: [1, 1], // show only one month
                    yearsLine: true,
                    title: false,
                    lang: $rootScope.currentLanguage || 'en',
                    resizeButton: false,
                    okButton: true,
                    showDatepickerInputs: true,
                    fullsizeButton: false,
                    fullsizeOnDblClick: false,
                    timepicker: true, // use timepicker
                    timepickerOptions: {
                        steps: [1, 15, 1, 1],
                        hours: true,
                        minutes: true,
                        seconds: false,
                        ampm: true
                    }
                };
                if (angular.isObject(scope.opts)) {
                    angular.extend(opts, scope.opts);
                }

                ctrl.$formatters.push(function (val) {
                    if (angular.isDate(val)) {
                        return moment(val).format(opts.timepicker ? format : formatDay);
                    } else {
                        return '';
                    }
                });

                ctrl.$parsers.push(function (val) {
                    var date = moment(val, opts.timepicker ? format : formatDay);
                    if (date.isValid()) {
                        return date.toDate();
                    }
                    return undefined;
                });

                $timeout(function () {
                    ele.periodpicker(opts);

                    scope.$watch(function () {
                        return ctrl.$modelValue;
                    }, function (newVal) {
                        var date = moment(newVal);
                        if (date.isValid()) {
                            ele.periodpicker('value', date);
                        }
                    });
                });
            }
        }
    })
    .directive('sbDatetimepicker', function ($rootScope, $timeout, $parse) {
        var formatDay = 'DD MMM YYYY';
        var formatTime = 'HH:mm';
        var format = formatDay + ' ' + formatTime;

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                opts: '=periodOptions'
            },
            link: function (scope, ele, attrs, ctrl) {
                var opts = {
                    lang: $rootScope.currentLanguage || 'en',
                    format: 'd M Y H:i',
                    formatTime: 'H:i',
                    formatDate: 'd M Y',
                    timepicker: true,
                    datepicker: true,
                    step: 15,
                    onGenerate: function (ct) {
                        jQuery(this).find('.xdsoft_date, .xdsoft_time').removeClass('xdsoft_disabled');
                    }
                };
                if (angular.isObject(scope.opts)) {
                    angular.extend(opts, scope.opts);

                    if (!opts.timepicker) {
                        opts.format = opts.formatDate;
                    }
                }
                if (opts.minDate || opts.maxDate) {
                    var minDate = opts.minDate && moment(opts.minDate).subtract(1, 'd');
                    var maxDate = opts.maxDate && moment(opts.maxDate).add(1, 'd');
                    opts.onGenerate = function () {
                        jQuery(this).find('.xdsoft_date, .xdsoft_time').removeClass('xdsoft_disabled');
                        jQuery(this).find('.xdsoft_date').each(function () {
                            var $this = jQuery(this);
                            var year = $this.data('year');
                            var month = $this.data('month');
                            var date = $this.data('date');
                            if (opts.minDate && minDate.isAfter(new Date(year, month, date))) {
                                $this.addClass('xdsoft_disabled');
                            }
                            if (opts.maxDate && maxDate.isBefore(new Date(year, month, date))) {
                                $this.addClass('xdsoft_disabled');
                            }
                        });
                    };
                }

                $timeout(function () {
                    ele.datetimepicker(opts);
                    scope.$watch(function () {
                        return ctrl.$modelValue;
                    }, function (newVal, oldVal) {
                        if (newVal) {
                            var date = moment(newVal);
                            if (opts.step !== 1) {
                                var min = date.minute();
                                date.minute(Math.ceil(min / opts.step) * opts.step);
                            }
                            opts.value = date.format(opts.timepicker ? format : formatDay);
                            ele.datetimepicker(opts);

                            // Need to update the view model value
                            ctrl.$setViewValue(opts.value);
                        }
                    });
                });
            }
        }
    })
    .directive('sbDatetimepicker2', function ($rootScope, $timeout, $parse) {
        var formatDay = 'DD MMM YYYY';
        var formatTime = 'HH:mm';
        var format = formatDay + ' ' + formatTime;

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                opts: '=periodOptions'
            },
            link: function (scope, ele, attrs, ctrl) {
                var opts = {
                    lang: $rootScope.currentLanguage || 'en',
                    format: 'd M Y H:i',
                    formatTime: 'H:i',
                    formatDate: 'd M Y',
                    timepicker: true,
                    datepicker: true,
                    step: 15,
                    onGenerate: function (ct) {
                        jQuery(this).find('.xdsoft_date, .xdsoft_time').removeClass('xdsoft_disabled');
                    }
                };
                if (angular.isObject(scope.opts)) {
                    angular.extend(opts, scope.opts);

                    if (!opts.timepicker) {
                        opts.format = opts.formatDate;
                    }
                }
                if (opts.minDate || opts.maxDate) {
                    var minDate = opts.minDate && moment(opts.minDate).subtract(1, 'd');
                    var maxDate = opts.maxDate && moment(opts.maxDate).add(1, 'd');
                    opts.onGenerate = function () {
                        jQuery(this).find('.xdsoft_date, .xdsoft_time').removeClass('xdsoft_disabled');
                        jQuery(this).find('.xdsoft_date').each(function () {
                            var $this = jQuery(this);
                            var year = $this.data('year');
                            var month = $this.data('month');
                            var date = $this.data('date');
                            if (opts.minDate && minDate.isAfter(new Date(year, month, date))) {
                                $this.addClass('xdsoft_disabled');
                            }
                            if (opts.maxDate && maxDate.isBefore(new Date(year, month, date))) {
                                $this.addClass('xdsoft_disabled');
                            }
                        });
                    };
                }

                $timeout(function () {
                    ele.datetimepicker(opts);

                    scope.$watch(function () {
                        return ctrl.$modelValue;
                    }, function (newVal, oldVal) {
                        if (newVal) {
                            var date = moment(newVal);
                            if (opts.step !== 1) {
                                var min = date.minute();
                                date.minute(Math.ceil(min / opts.step) * opts.step);
                            }
                            opts.value = date.format(opts.timepicker ? format : formatDay);
                            ele.datetimepicker(opts);

                            // Need to update the view model value
                            ctrl.$setViewValue(opts.value);
                        }
                    });
                });
            }
        }
    })
    .directive('sbDatetimepicker3', function ($rootScope, $timeout, $parse) {
        var formatDay = 'DD MMM YYYY';
        var formatTime = 'HH:mm';
        var format = formatDay + ' ' + formatTime;

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                opts: '=periodOptions'
            },
            link: function (scope, ele, attrs, ctrl) {
                var opts = {
                    lang: $rootScope.currentLanguage || 'en',
                    format: 'd M Y H:i',
                    formatTime: 'H:i',
                    formatDate: 'd M Y',
                    timepicker: true,
                    datepicker: true,
                    step: 30,
                    onGenerate: function (ct) {
                        jQuery(this).find('.xdsoft_date, .xdsoft_time').removeClass('xdsoft_disabled');
                    }
                };
                if (angular.isObject(scope.opts)) {
                    angular.extend(opts, scope.opts);

                    if (!opts.timepicker) {
                        opts.format = opts.formatDate;
                    }
                }
                if (opts.minDate || opts.maxDate) {
                    var minDate = opts.minDate && moment(opts.minDate).subtract(1, 'd');
                    var maxDate = opts.maxDate && moment(opts.maxDate).add(1, 'd');
                    opts.onGenerate = function () {
                        jQuery(this).find('.xdsoft_date, .xdsoft_time').removeClass('xdsoft_disabled');
                        jQuery(this).find('.xdsoft_date').each(function () {
                            var $this = jQuery(this);
                            var year = $this.data('year');
                            var month = $this.data('month');
                            var date = $this.data('date');
                            if (opts.minDate && minDate.isAfter(new Date(year, month, date))) {
                                $this.addClass('xdsoft_disabled');
                            }
                            if (opts.maxDate && maxDate.isBefore(new Date(year, month, date))) {
                                $this.addClass('xdsoft_disabled');
                            }
                        });
                    };
                }

                $timeout(function () {
                    ele.datetimepicker(opts);
                    scope.$watch(function () {
                        return ctrl.$modelValue;
                    }, function (newVal, oldVal) {
                        if (newVal) {
                            var date = moment(newVal);
                            if (opts.step !== 1) {
                                var min = date.minute();
                                date.minute(Math.ceil(min / opts.step) * opts.step);
                            }
                            opts.value = date.format(opts.timepicker ? format : formatDay);
                            ele.datetimepicker(opts);
                            // Need to update the view model value
                            ctrl.$setViewValue(opts.value);
                        }
                    });
                });
            }
        }
    })
    .directive('sbDatetimepickeronemin', function ($rootScope, $timeout, $parse) {
        var formatDay = 'DD MMM YYYY';
        var formatTime = 'HH:mm';
        var format = formatDay + ' ' + formatTime;

        return {
            restrict: 'AC',
            require: 'ngModel',
            scope: {
                opts: '=periodOptions'
            },
            link: function (scope, ele, attrs, ctrl) {
                var opts = {
                    lang: $rootScope.currentLanguage || 'en',
                    format: 'd M Y H:i',
                    formatTime: 'H:i',
                    formatDate: 'd M Y',
                    timepicker: true,
                    datepicker: true,
                    step: 10,
                    onGenerate: function (ct) {
                        jQuery(this).find('.xdsoft_date, .xdsoft_time').removeClass('xdsoft_disabled');
                    }
                };
                if (angular.isObject(scope.opts)) {
                    angular.extend(opts, scope.opts);

                    if (!opts.timepicker) {
                        opts.format = opts.formatDate;
                    }
                }
                if (opts.minDate || opts.maxDate) {
                    var minDate = opts.minDate && moment(opts.minDate).subtract(1, 'd');
                    var maxDate = opts.maxDate && moment(opts.maxDate).add(1, 'd');
                    opts.onGenerate = function () {
                        jQuery(this).find('.xdsoft_date, .xdsoft_time').removeClass('xdsoft_disabled');
                        jQuery(this).find('.xdsoft_date').each(function () {
                            var $this = jQuery(this);
                            var year = $this.data('year');
                            var month = $this.data('month');
                            var date = $this.data('date');
                            if (opts.minDate && minDate.isAfter(new Date(year, month, date))) {
                                $this.addClass('xdsoft_disabled');
                            }
                            if (opts.maxDate && maxDate.isBefore(new Date(year, month, date))) {
                                $this.addClass('xdsoft_disabled');
                            }
                        });
                    };
                }

                $timeout(function () {
                    ele.datetimepicker(opts);

                    scope.$watch(function () {
                        return ctrl.$modelValue;
                    }, function (newVal, oldVal) {
                        if (newVal) {
                            var date = moment(newVal);
                            if (opts.step !== 1) {
                                var min = date.minute();
                                date.minute(Math.ceil(min / opts.step) * opts.step);
                            }
                            opts.value = date.format(opts.timepicker ? format : formatDay);
                            ele.datetimepicker(opts);

                            // Need to update the view model value
                            ctrl.$setViewValue(opts.value);
                        }
                    });
                });
            }
        }
    })
    .directive('sbDatetimepickerdisabled', function ($rootScope, $timeout, $parse) {
        var formatDay = 'DD MMM YYYY';
        var formatTime = 'HH:mm';
        var format = formatDay + ' ' + formatTime;

        return {
            restrict: 'AC',
            require: 'ngModel',
            scope: {
                opts: '=periodOptions'
            },
            link: function (scope, ele, attrs, ctrl) {
                var opts = {
                    lang: $rootScope.currentLanguage || 'en',
                    format: 'd M Y H:i',
                    formatTime: 'H:i',
                    formatDate: 'd M Y',
                    timepicker: true,
                    datepicker: true,
                    step: 10,
                    onGenerate: function (ct) {
                        jQuery(this).find('.xdsoft_date, .xdsoft_time').addClass('xdsoft_disabled');
                    }
                };
                if (angular.isObject(scope.opts)) {
                    angular.extend(opts, scope.opts);

                    if (!opts.timepicker) {
                        opts.format = opts.formatDate;
                    }
                }
                if (opts.minDate || opts.maxDate) {
                    var minDate = opts.minDate && moment(opts.minDate).subtract(1, 'd');
                    var maxDate = opts.maxDate && moment(opts.maxDate).add(1, 'd');
                    opts.onGenerate = function () {
                        jQuery(this).find('.xdsoft_date, .xdsoft_time').addClass('xdsoft_disabled');
                        jQuery(this).find('.xdsoft_date').each(function () {
                            var $this = jQuery(this);
                            var year = $this.data('year');
                            var month = $this.data('month');
                            var date = $this.data('date');
                            if (opts.minDate && minDate.isAfter(new Date(year, month, date))) {
                                $this.addClass('xdsoft_disabled');
                            }
                            if (opts.maxDate && maxDate.isBefore(new Date(year, month, date))) {
                                $this.addClass('xdsoft_disabled');
                            }
                        });
                    };
                }

                $timeout(function () {
                    ele.datetimepicker(opts);

                    scope.$watch(function () {
                        return ctrl.$modelValue;
                    }, function (newVal, oldVal) {
                        if (newVal) {
                            var date = moment(newVal);
                            if (opts.step !== 1) {
                                var min = date.minute();
                                date.minute(Math.ceil(min / opts.step) * opts.step);
                            }
                            opts.value = date.format(opts.timepicker ? format : formatDay);
                            ele.datetimepicker(opts);

                            // Need to update the view model value
                            ctrl.$setViewValue(opts.value);
                        }
                    });
                });
            }
        }
    })
