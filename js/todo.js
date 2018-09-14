const key = '2741f097a35c836f5878ad3536c6bcf3';
const token = '676e08999f4ddfb4bf19968bfe184927a508a6308b7f9fc84313e85fbf7e019e';
const auth = "?key=" + key + "&token=" + token;
const boardID = "5b9a4115af329d858b2fbce3";
var data = null;
var checklists;
var xhr = new XMLHttpRequest();
var k = 100;
xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        checklists = JSON.parse(this.responseText);
        console.log(checklists);
        k = checklists[0]['checkItems'].length;
        for (i = 0; i < k; i++) {
            var l;
            if (checklists[0]['checkItems'][i]['state'] == 'incomplete') {

                l = "unchecked";
            } else {
                console.log("checked");
                l = "checked";
            }
            $(".list-group").append('<div id="parent"><div> <input type="checkbox"' + l + ' ></input><label>' + checklists[0]['checkItems'][i]['name'] + '</label></div><input class="delete-button" type="button" value="delete" onclick="deleteTask(event)"></div>');
        }
    }
});

xhr.open("GET", "https://api.trello.com/1/boards/" + boardID + "/checklists/" + auth);

xhr.send(data);

$("#add-task").click(function () {
console.log(checklists)

    var task = $(".todoText").val();
    if (task != '') {

        $(".list-group").append('<div id="parent"><div> <input type="checkbox" class="task-checkbox"></input><label>' + task + '</label></div><input class="delete-button" type="button" value="delete" onclick="deleteTask(event)"></div>');

    }

})

function deleteTask(e) {
    var target = e.currentTarget;
    console.log($(target).parent())
    $(target).parent().remove();
    var xhr1=new XMLHttpRequest();
    xhr1.open("PUT","https://api.trello.com/1/cards/5b9a41482c7ed44443be3f18/checkItem/5b9b2fa876e5b92a2c2bb9e9"+auth);
xhr1.send('state:"complete"')

}