var baseUrl = 'https://rxn.res.ibm.com';
var prediction_id = ''
    $(function () {
        getProject();
    });

    $('#newProject').submit(function (e) {
        e.preventDefault();
        CreateProject();
    })
    $('#newPrediction').submit(function (e) {
        e.preventDefault();
        newPrediction();
    })



function CreateProject() {
    var projectName = $('#projectName').val();
    var invitationEmaild = $('#invitationEmailId').val();
    var dataString = {
        "name": projectName,
        "invitations": [{
            "email": invitationEmaild
        }]
    }
    $.ajax({
        url: baseUrl + '/rxn/api/api/v1/projects',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "apk-035dde05eb9f8c8e045d463bffddb36cff307ff57509abdec06e4d8bc278cafe07c99c86ed3c1437082aa93d48f0c6c3eb835b17f139caadc6f7fd5ce785e9556af53e76f15fabbf3f2ce4354feb5826",

        },
        type: 'POST',
        data: JSON.stringify(dataString),
        success: function (res) {
            console.log(res);
            location.reload();
        }
    })
}

function getProject() {
    $.ajax({
        url: baseUrl + '/rxn/api/api/v1/projects',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "apk-035dde05eb9f8c8e045d463bffddb36cff307ff57509abdec06e4d8bc278cafe07c99c86ed3c1437082aa93d48f0c6c3eb835b17f139caadc6f7fd5ce785e9556af53e76f15fabbf3f2ce4354feb5826",

        },
        type: 'GET',
        success: function (res) {

            var projectsName = res.payload.content;
            projectsName.forEach(function (element, index) {
                $('#projectsName').append('<tr><td>' + (1 + index) + '</td><td>' + element.name + '</td></tr>')
                $('#projectNameSelect').append($("<option></option>")
                    .attr("value", element.id)
                    .text(element.name));
            });

        }
    })
}

function newPrediction() {
    var projectId = $('#projectNameSelect').val();
    var reactants1 = $('#reactants1').val();
    var reactants2 = $('#reactants2').val();
    var reactants  = reactants1 +'.'+ reactants2;
    alert(reactants);
    console.log(reactants)
    var dataString = {
        "reactants": reactants
    }
    $.ajax({
        url: baseUrl + '/rxn/api/api/v1/predictions/pr?projectId=' + projectId,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "apk-035dde05eb9f8c8e045d463bffddb36cff307ff57509abdec06e4d8bc278cafe07c99c86ed3c1437082aa93d48f0c6c3eb835b17f139caadc6f7fd5ce785e9556af53e76f15fabbf3f2ce4354feb5826",
        },
        type: 'POST',
        data: JSON.stringify(dataString),
        success: function (res) {
            console.log(res.payload.id);
            prediction_id = res.payload.id
            setTimeout(() => {
                $('#PredectionDetailsButton').show();
            }, 2000);
          


        }
    })
}

function getPredictionDetails() {

    $.ajax({
        url: baseUrl + '/rxn/api/api/v1/predictions/' + prediction_id,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "apk-035dde05eb9f8c8e045d463bffddb36cff307ff57509abdec06e4d8bc278cafe07c99c86ed3c1437082aa93d48f0c6c3eb835b17f139caadc6f7fd5ce785e9556af53e76f15fabbf3f2ce4354feb5826",

        },

        type: 'GET',
        success: function (res) {

            $('#imageOfResult').html(res.payload.attempts[0].reactionImage);
            if (res.payload.attempts[0].reactionImage == null) {
                setTimeout(() => {
                    getPredictionDetails()
                }, 2000);
                
            } else {
                $('#ConfidentSpanDiv').show();
                $('#ConfidentSpan').html(res.payload.attempts[0].confidence);
            }



        }
    })
}