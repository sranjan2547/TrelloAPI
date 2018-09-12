$("#add-task").click(function(){

    var task = $(".todoText").val();
    if (task != '') {
       
        $(".list-group").append('<div id="parent"><div> <input type="checkbox" ></input><label>' + task + '</label></div><input class="delete-button" type="button" value="delete" onclick="deleteTask(event)"></div>');
       }

})


function deleteTask(e){
    var target=e.currentTarget;
    $(target).parent().remove();
}
