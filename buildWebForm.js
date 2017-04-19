// Note: had to manually edit "params.withCredentials" to be false in the webpack build file. (must be done in the webpack build file or webpack will mess it up.) All this is so CORs is happy.
// Also had to update the 'attachFile()' method on the node sdk for the web context. If reapplying a new version of the node sdk, probably just repaste the custom attachFile found in this source.

var fs = require('fs');
var TrackviaAPI = require('./trackvia-private-api');
var fieldFactory = require('./fields/fieldFactory');



function buildWebForm(config) {
    console.log(config);
    var API_KEY = config.user_key;
    var USERNAME = config.username;
    var PW = config.password;
    var APP_ID = config.app_id;
    var TABLE_ID = config.table_id;
    var VIEW_ID = config.view_id;
    var FORM_ID = config.form_id;


    return new Promise(function(resolve, reject) {
        console.log('Building Web Form...');
        var api = new TrackviaAPI(USERNAME, PW);

        api.getForm({
            appId: APP_ID,
            tableId: TABLE_ID,
            formId: FORM_ID
        })
        .then(function(formResponse) {
            var fields = findFormFields(formResponse.elements);

            var formFieldObjects = [];
            var fieldsHTML = '';
            fields.forEach(function(trackviaField) {
                var formField = fieldFactory.createFormField(trackviaField);
                if (formField) {
                    var fieldHTML = formField.generateHTML();
                    if (fieldHTML) {
                        formFieldObjects.push(formField); // if there isn't any html generated, don't bother adding formField object to array
                        fieldsHTML += fieldHTML;
                    }
                }
            });


            var submitButton = `<button type="submit" class="btn btn-primary tv-submit-btn">Submit</button>`;
            var form = `<form class="trackvia-web-form" role="form"><img src="http://www.trackvia.com/wp-content/uploads/2015/03/TrackVia_logo_rev_191px.png"/>${fieldsHTML}${submitButton}</form>`;

            var css = getCSS();
            var js = getJS(formFieldObjects);

            var jquery = `<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>`;
            var bootstrapCSS = `<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">`;
            var bootstrapJS = `<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>`;
            var trackviaAPI = `<script src="trackvia-api.js"></script>`;

            var html = `<html><head>${jquery}${bootstrapCSS}${bootstrapJS}${trackviaAPI}<script>${js}</script><style>${css}</style></head><body>${form}</body></html>`;
            console.log(html);
            fs.writeFileSync('/tmp/index.html', html);
            resolve();
        })
        .catch(function(err) {
            console.log(err);
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
    .tv-submit-btn {
        float: right;
        font-size: 16px;
        min-width: 120px;
        background-color: #6bc63d;
        border: none;
    }
    .tv-submit-btn:hover, .tv-submit-btn:active, .tv-submit-btn:visited {
        background-color: #5cad33 !important;
    }
    `;
    }

    function getJS(formFieldObjects) {
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
                // In the file case, valueHTML() returns a function that returns promise (that resolves an arrayBuffer to represent the file, we must wait for this to do its thing before continuing)
                var fileUploadRequest = `function(recordId) {
                    return new Promise(function(resolve, reject) {
                        var readFileFunction = ${valueHTML};
                        var pReadFile = readFileFunction();
                        if (!pReadFile) {
                            return resolve();
                        }
                        pReadFile.then(function(readFileResult) {
                            var fileName = readFileResult.fileName;
                            console.log(fileName);
                            var arrayBuffer = readFileResult.arrayBuffer;
                            var pFileAttached = api.attachFile(${VIEW_ID}, recordId, '${formFieldObject.name}', arrayBuffer, fileName);
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


        var foo =  `$(function() {
    var api = new trackviaAPI('${API_KEY}');
    window.pLogin_GLOBAL = api.login('${USERNAME}', '${PW}');

    window.pLogin_GLOBAL.then(function() {
        var composedRelationshipFunction = ${composedRelationshipFunction};
        composedRelationshipFunction();
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
                    alert('There was an error adding the reocord. Check your fields and try again.');
                    console.error(err);
                });
            }));
    });
    });`;

        return foo;
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
}

module.exports = buildWebForm;
