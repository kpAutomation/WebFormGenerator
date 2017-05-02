var fs = require('fs');
var TrackviaAPI = require('./trackvia-private-api');
var fieldFactory = require('./fields/fieldFactory');
var webSDK = require('trackvia-web-sdk');

var promisePolyfill = '<script>!function(e){function n(){}function t(e,n){return function(){e.apply(n,arguments)}}function o(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],s(e,this)}function i(e,n){for(;3===e._state;)e=e._value;return 0===e._state?void e._deferreds.push(n):(e._handled=!0,void o._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null===t)return void(1===e._state?r:u)(n.promise,e._value);var o;try{o=t(e._value)}catch(i){return void u(n.promise,i)}r(n.promise,o)}))}function r(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var i=n.then;if(n instanceof o)return e._state=3,e._value=n,void f(e);if("function"==typeof i)return void s(t(i,n),e)}e._state=1,e._value=n,f(e)}catch(r){u(e,r)}}function u(e,n){e._state=2,e._value=n,f(e)}function f(e){2===e._state&&0===e._deferreds.length&&o._immediateFn(function(){e._handled||o._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;n<t;n++)i(e,e._deferreds[n]);e._deferreds=null}function c(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}function s(e,n){var t=!1;try{e(function(e){t||(t=!0,r(n,e))},function(e){t||(t=!0,u(n,e))})}catch(o){if(t)return;t=!0,u(n,o)}}var a=setTimeout;o.prototype["catch"]=function(e){return this.then(null,e)},o.prototype.then=function(e,t){var o=new this.constructor(n);return i(this,new c(e,t,o)),o},o.all=function(e){var n=Array.prototype.slice.call(e);return new o(function(e,t){function o(r,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var f=u.then;if("function"==typeof f)return void f.call(u,function(e){o(r,e)},t)}n[r]=u,0===--i&&e(n)}catch(c){t(c)}}if(0===n.length)return e([]);for(var i=n.length,r=0;r<n.length;r++)o(r,n[r])})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(n){n(e)})},o.reject=function(e){return new o(function(n,t){t(e)})},o.race=function(e){return new o(function(n,t){for(var o=0,i=e.length;o<i;o++)e[o].then(n,t)})},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){a(e,0)},o._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},o._setImmediateFn=function(e){o._immediateFn=e},o._setUnhandledRejectionFn=function(e){o._unhandledRejectionFn=e},"undefined"!=typeof module&&module.exports?module.exports=o:e.Promise||(e.Promise=o)}(this);</script>';

function buildWebForm(config) {
    console.log(config);
    var API_KEY = config.user_key;
    var ACCESS_TOKEN = config.access_token;
    var USERNAME = config.username;
    var PW = config.password;
    var APP_ID = config.app_id;
    var TABLE_ID = config.table_id;
    var VIEW_ID = config.view_id;
    var FORM_ID = config.form_id;
    var HOST = 'https://' + config.host + ':443';


    return new Promise(function(resolve, reject) {
        console.log('Building Web Form...');
        var api = new TrackviaAPI(USERNAME, PW, HOST);

        api.getForm({
            appId: APP_ID,
            tableId: TABLE_ID,
            formId: FORM_ID
        })
        .then(function(formResponse) {
            console.log('--- Form Response ---');
            console.log(formResponse);

            var fields = findFormFields(formResponse.elements);

            var formFieldObjects = [];
            var fieldsHTML = '';
            fields.forEach(function(trackviaField) {
                var formField = fieldFactory.createFormField(trackviaField);
                if (formField) {
                    var fieldHTML = formField.generateHTML();
                    if (fieldHTML) {
                        formFieldObjects.push(formField); // if there isn't any html generated, don't bother adding formField object to array
                        fieldsHTML += fieldHTML + '\n';
                    }
                }
            });


            var submitButton = `<button type="submit" class="btn btn-primary tv-submit-btn">Submit</button>`;
            var form = `<form class="trackvia-web-form" role="form"><img src="http://www.trackvia.com/wp-content/uploads/2015/03/TrackVia_logo_rev_191px.png"/>${fieldsHTML}${submitButton}</form>`;

            var css = getCSS();
            var js = getJS(formFieldObjects, HOST);

            var jquery = `<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>`;
            var bootstrapCSS = `<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">`;
            var bootstrapJS = `<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>`;
            var bootstrapDatepickerJS = '<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/js/bootstrap-datepicker.min.js"></script>';
            var bootstrapDatepickerCSS = '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/css/bootstrap-datepicker3.css">';
            var momentJS = '<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>';


            console.log('Reading Static Files...');
            fs.readFile('./node_modules/trackvia-web-sdk/build/trackvia-api.js', 'utf-8', function(errOnAPI, jsText) {
                fs.readFile('./datetimepicker/bootstrap-datetimepicker.min.js', 'utf-8', function(errDateTimeJS, datetimepickerJS) {
                    fs.readFile('./datetimepicker/bootstrap-datetimepicker.min.css', 'utf-8', function(errDateTimeCSS, datetimepickerCSS) {
                        if (errOnAPI) {
                            return reject(errOnAPI);
                        }
                        if (errDateTimeJS) {
                            return reject(errDateTimeJS);
                        }
                        if (errDateTimeCSS) {
                            return reject(errDateTimeCSS);
                        }


                        var trackviaAPI = `<script>` + jsText + `</script>`;
                        var datetimepickerScript = '<script>' + datetimepickerJS + '</script>';
                        var datetimepickerStyles = '<style>' + datetimepickerCSS + '</style>';

                        var html = `<html><head>${jquery}${momentJS}${bootstrapCSS}${bootstrapJS}${trackviaAPI}${promisePolyfill}${bootstrapDatepickerJS}${datetimepickerScript}<script>${js}</script><style>${css}</style>${bootstrapDatepickerCSS}${datetimepickerStyles}</head><body>${form}</body></html>`;
                        fs.writeFileSync('/tmp/form.html', html);
                        var lambda = wrapInAwsLambda();
                        console.log(html);
                        fs.writeFileSync('/tmp/index.js', lambda);
                        return resolve();
                    });
                });
            });
        })
        .catch(function(err) {
            return reject(err);
        });
    });

    function getCSS() {
        return `
    form {
        width: 800px;
        display: inline-block;
        padding: 10px 40px;
    }
    .form-check {
        display: inline-block;
        margin-right: 10px;
    }
    legend {
        font-size: 14px;
        margin-bottom: 5px;
    }
    input[type=checkbox] {
        margin-left: 2px;
    }
    `;
    }

    function getJS(formFieldObjects, host) {
        var keyValues = [];
        var allFileUploadRequest = [];
        var allParentRelationshipRequest = [];

        formFieldObjects.forEach(function(formFieldObject) {
            var valueHTML = formFieldObject.getValueHTML();
            if (formFieldObject.type !== 'image' && formFieldObject.type !== 'document') {
                if (valueHTML) {
                    keyValues.push(`"${formFieldObject.name}": ${valueHTML}`);
                }
            } else {
                // Files
                // In the file case, valueHTML() returns a function that returns promise (that resolves to a file, we must wait for this to do its thing before continuing)
                var fileUploadRequest = `function(recordId) {
                    return new Promise(function(resolve, reject) {
                        var readFileFunction = ${valueHTML};
                        var pReadFile = readFileFunction();

                        pReadFile.then(function(file) {
                            if (!file) {
                                return resolve();
                            }
                            var pFileAttached = api.attachFile(${VIEW_ID}, recordId, '${formFieldObject.name}', file);
                            pFileAttached.then(function() {
                                resolve();
                            });
                        });
                    });
                }`;
                allFileUploadRequest.push(fileUploadRequest);
            }

            if (formFieldObject.type === 'relationship') {
                var fetchParentOptions = `function() {
                    return new Promise(function(resolve, reject) {
                        api.getView(${formFieldObject.relatedViewId})
                        .then(function(viewResponse) {
                            var records = viewResponse.data;
                            records.forEach(function(record) {
                                $('${formFieldObject.selector}').append('<option value="' + record.id + '">' + record['Record ID'] + '</option>');
                            });
                        });
                    });
                }`;
                allParentRelationshipRequest.push(fetchParentOptions);
            }
        });

        // Compose fileUpload Functions
        var composedFileUploadsFunction = `function(recordId) {
            var promises = [];
            var allFileUploadRequest = [${allFileUploadRequest}];
            allFileUploadRequest.forEach(function(uploadRequest) {
                promises.push(uploadRequest(recordId));
            });

            return Promise.all(promises);
        }`;

        var composedRelationshipFunction = `function(fieldObject) {
        var promises = [];
        var allRelationshipRequest = [${allParentRelationshipRequest}];
        allRelationshipRequest.forEach(function(relationshipRequest) {
            relationshipRequest();
        });
        }`;


        var js =  `$(function() {
    var api = new TrackviaAPI('${host}');
    api.setUserKey('${API_KEY}');

    window.pLogin_GLOBAL = (function() {
        return new Promise(function(resolve) {
            api.setAccessToken('${ACCESS_TOKEN}');
            resolve();
        });
    })();

    window.pLogin_GLOBAL.then(function() {
        var composedRelationshipFunction = ${composedRelationshipFunction};
        composedRelationshipFunction();
    });

    var $datepickers = $('input.date');
    $datepickers.datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true,
        orientation: 'bottom'
    });

    var $datetimepickers = $('input.datetime');
    $datetimepickers.datetimepicker({
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'bottom'
        }
    });

    $('.trackvia-web-form').submit(function(event) {
        $('button').prop('disabled', true);
        event.preventDefault();
        var requestBody = {${keyValues.join(',\n')}};
        window.pLogin_GLOBAL
            .then((function() {
                // Remove parts of the requestBody that are empty (the open api doesn't like the empty values)
                for (var key in requestBody) {
                    if (!requestBody[key]) {
                        delete requestBody[key];
                    }
                }            

                api.addRecord(${VIEW_ID}, requestBody)
                .then(function(recordResponse) {
                    var recordId = recordResponse.data[0].id;

                    // Handle file uploads
                    var composedFileUploadsFunction = ${composedFileUploadsFunction};
                    var pFilesUploaded = composedFileUploadsFunction(recordId);

                    return new Promise(function(resolve, reject) {
                        pFilesUploaded.then(function(res) {
                            $('button').prop('disabled', false);
                            alert('Record Added Successfully');
                            window.location.reload(true);
                            resolve();
                        });
                    });
                })
                .catch(function(err) {
                    $('button').prop('disabled', false);
                    alert('There was an error adding the record. Check your fields and try again.');
                    console.error(err);
                });
            }));
    });
    });`;

        return js;
    }

    function findFormFields(elements) {
        var fieldList = [];
        elements.forEach((element) => {
            if (element.type === 'field' && element.fieldMetaId) {
                fieldList.push(element);
            }
            if (element.elements && element.elements.length > 0) {
                fieldList = fieldList.concat(findFormFields(element.elements));
            }
        });
        return fieldList;
    }

    function wrapInAwsLambda() {

        var indexjs = `var fs = require('fs');
exports.handler = function(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    fs.readFile('./form.html', 'utf-8', function(err, html) {
        console.log('html to return as web form');
        console.log(html);
        var response  = {"content-type": "text/html", "payload": html};
        callback(null, response);
    });
}`;
        return indexjs;
    }
}

function stringReplaceAll(theString, search, replacement) {
    return theString.split(search).join(replacement);
}

module.exports = buildWebForm;
