const key = '2741f097a35c836f5878ad3536c6bcf3';
const token = '676e08999f4ddfb4bf19968bfe184927a508a6308b7f9fc84313e85fbf7e019e';
const auth = "key=" + key + "&token=" + token;
const boardID = "5b9a4115af329d858b2fbce3";
var checklistId = "5b9a4a4bbef75a2b84fd4211";
var cardId="5b9a48ed4ed5294acd430060";
var data = null;
var checklists;

$(document).ready(function () {
loadCard();
    loadTask();
    $("select#selectCard").change(function(){
        checklistId = $("#selectCard option:selected").val();
      //  alert("You have selected the country - " + selectedCountry);
    });

});
function loadCard(){
    fetch("https://api.trello.com/1/boards/" + boardID + "/checklists/?" + auth)
    .then(response => response.json())
    .then((response) => {
      response.forEach(element => {
           checkListName= element.name
           id=element.id;
          $("#selectCard").append('<option value='+id+'>'+checkListName+'</option>')
      });
        
   
    })
}

function loadTask() {

    fetch("https://api.trello.com/1/boards/" + boardID + "/checklists/?" + auth)
        .then(response => response.json())
        .then((response) => {
            checklists = response;
            console.log(response);
            lengthOfChecklist = checklists[1]['checkItems'].length;

            for (i = 0; i < lengthOfChecklist; i++) {
                checkItemName = checklists[1]['checkItems'][i]['name']
                checkItemId = "a" + checklists[1]['checkItems'][i]['id'];
                //  console.log(checkItemId);
                var statusOfTask;
                if (checklists[1]['checkItems'][i]['state'] == 'incomplete') {

                    statusOfTask = "unchecked";
                } else {
                    // console.log("checked");
                    statusOfTask = "checked";
                }
                appendTask(statusOfTask, checkItemName, checkItemId);
            }
        })

};

function appendTask(statusOfTask, checkItemName, checkItemId) {
    $(".list-group").append('<div id="parent"><div> <input type="checkbox" onclick= "handleClick(event)" id=' + checkItemId + " " + statusOfTask + ' ></input><label>' + checkItemName + '</label></div><input class="delete-button" type="button" value="delete" onclick="deleteTask(event)"></div>');
    //console.log($(.psrseInt( checkItemId)).id)
}


$("#add-task").click(function () {
    console.log(checklists)

    var task = $(".todoText").val();
    if (task != '') {

        fetch('https://api.trello.com/1/checklists/' + checklistId + '/checkItems?name=' + task + '&pos=bottom&' + auth, {
                method: "POST"
            })
            .then(response => response.json()) 
            .then((response) => {
                console.log(response);
            })


        location.reload(true);



    }

})

function handleClick(e) {
    taskId = e.currentTarget.id.substr(1);
//    console.log(taskId);
console.log(cardId)
console.log(checklistId)
console.log(taskId)
    if (e.currentTarget.checked == false) {
        fetch('https://api.trello.com/1/cards/'+cardId+'/checklist/'+checklistId+'/checkItem/' + taskId + '/state?' + auth + '&value=false', {
            method: "PUT"})
    } else {
        fetch('https://api.trello.com/1/cards/'+cardId+'/checklist/'+checklistId+'/checkItem/' + taskId + '/state?' + auth + '&value=true', {
            method: "PUT"})
    }
}


function deleteTask(e) {
    var target = e.currentTarget;
    //   console.log( JSON.stringify( $(target).parent()[0].id))
    $(target).parent().remove();

}






/*
$(function(){
$("#abc").click(function(){
    console.log("hello");
})})*/
