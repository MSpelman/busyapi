module.exports = function(app){
    app.post('/api/usages', function(req, res){

        // validation of req.body before saving
        var usage = checkRequest(req.body);
        if (usage === null) {
            console.log("Invalid request");
            res.sendStatus(500);
            return;
        }

        // Store the supplied usage data
        app.db.collection('usages').insertOne(usage).then(function(result) {
            var usageId = result.insertedId;
            console.log('Stored usage id: ' + usageId);
            res.status(201).json({'id':usageId});
        }, function(error) {
            // api specification says to return 500 on error
            console.log(error);
            res.sendStatus(500);
        });

    });
};

/* I am not very familiar with Node and there was a time limit of a few hours, so I
 * just made a regular JavaScript function to do the validation. I would also do more
 * than just validate that the fields exist (e.g. verify the date is in the correct format,
 * the medication name corresponds to an actual medication, etc.)
 */
function checkRequest(body) {
    var id = body['patientId'];
    var time = body['timestamp'];
    var med = body['medication'];

    // using == instead of === handles undefined
    if ((id == null) || (time == null) || (med == null) || (id == "") || (time == "") || (med == "")) {
        return null;
    } else {
        // This creates a white list of accepted fields, and ignores any unwanted data sent
        // in the request
        var result = {
            patientId: id,
            timestamp: time,
            medication: med
        };

        return result;
    }
}
