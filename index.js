var fs = require('fs');
var buildWebForm = require('./buildWebForm');

var archiver = require('archiver');

exports.handler = function(event, context, callback) {
    console.log('---  starting  ---');
    context.callbackWaitsForEmptyEventLoop = false;
    console.log(event);

    if (event.app_id) {
        returnWebFormZip(event, callback);
    } else {
        returnConfigForm(callback);
    }
}

function returnWebFormZip(event, callback) {
    var pWebForm = buildWebForm({
        access_token: event.access_token,
        user_key: event.user_key,
        username: event.username,
        password: event.password,
        app_id: event.app_id,
        table_id: event.table_id,
        view_id: event.view_id,
        form_id: event.form_id
    });

    pWebForm.then(function() {
        var output = fs.createWriteStream('/tmp/webform.zip');
        var archive = archiver('zip', {
            store: true // Sets the compression method to STORE. 
        });

        output.on('close', function() {
            console.log('zip output closed.');
            var b64_zip = base64_encode('/tmp/webform.zip');
            var html = `
                <html><body><a href="data:application/zip;base64,${b64_zip}" download="webform.zip">Download</a></body></html>
            `;
            console.log(`response html: ${html}`);
            var response = { "content-type": "text/html", "payload": html };
            callback(null, response);
        });
        archive.pipe(output);
        archive.file('/tmp/index.html', { name: 'index.html' });
        archive.file('trackvia-api.js', { name: 'trackvia-api.js' });
        archive.finalize();
    });
}

function returnConfigForm(callback) {
    fs.readFile('./configTemplate.html', 'utf-8', function(err, html) {
        if (err) { 
            console.log(err);
            if (callback) {
                callback(err, null);
            }
            return;
        }

        var response = { "content-type": "text/html", "payload": html };
        callback(null, response);
    });
}

function base64_encode(file) {
    console.log('base64_encode called');
    var bitmap = fs.readFileSync(file);

    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}