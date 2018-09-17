const key = '2741f097a35c836f5878ad3536c6bcf3';
const token = '676e08999f4ddfb4bf19968bfe184927a508a6308b7f9fc84313e85fbf7e019e';
const auth = `key=${key}&token=${token}`;
let boardID;
let checklistId;
let cardId;


$(document).ready(() => {
  fetch(
    `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`,
  ).then(boards => boards.json())
    .then((boards) => {
      boardID = boards[3].id;

      fetch(`https://api.trello.com/1/boards/${boardID}/checklists/?${auth}`)
        .then(checkLists => checkLists.json())
        .then((checkLists) => {
          //  console.log(checkLists[0])
          checklistId = checkLists[0].id;
          cardId = checkLists[0].idCard;
        });

      loadCard();
      loadTask();
    });
});

$('select#selectCard').change(() => {
  checklistId = $('#selectCard option:selected').val();

  fetch(`https://api.trello.com/1/boards/${boardID}/checklists/?${auth}`)
    .then(response => response.json())
    .then((response) => {
      response.forEach((element) => {
        if (element.id === checklistId) {
          cardId = element.idCard;
        }
      });
    });
  $('#list-group').load(`${document.URL} #list-group`);
  loadTask();
});


function loadCard() {
  fetch(`https://api.trello.com/1/boards/${boardID}/checklists/?${auth}`)
    .then(list => list.json())
    .then((list) => {
      list.forEach((checkList) => {
        checkListName = checkList.name;
        id = checkList.id;
        $('#selectCard').append(`<option value=${id}>${checkListName}</option>`);
      });
    });
}

function loadTask() {
  fetch(`https://api.trello.com/1/boards/${boardID}/checklists/?${auth}`)
    .then(list => list.json())
    .then((list) => {
      checklists = list;
      list.forEach((checkList) => {
        if (checkList.id === checklistId) {
          //    console.log(checkList)
          checkList.checkItems.forEach((checkItem) => {
            checkItemName = checkItem.name;
            checkItemId = `a${checkItem.id}`;
            let statusOfTask;
            if (checkItem.state === 'incomplete') {
              statusOfTask = 'unchecked';
            } else {
              statusOfTask = 'checked';
            }
            appendTask(statusOfTask, checkItemName, checkItemId);
          });
        }
      });
    });
}

function appendTask(statusOfTask, checkItemName, checkItemId) {
  $('#list-group').append(`<div id="parent"><div> <input type="checkbox" onclick= "handleClick(event)" id=${checkItemId} ${statusOfTask} ></input><label>${checkItemName}</label></div></div>`);
}


$('#add-task').click(() => {
  const task = $('.todoText').val();
  if (task !== '') {
    fetch(`https://api.trello.com/1/checklists/${checklistId}/checkItems?name=${task}&pos=bottom&${auth}`, {
      method: 'POST',
    })
      .then(task => task.json())
      .then(() => {
        $('#list-group').load(`${document.URL} #list-group`);
        loadTask();
      });
  }
});

function handleClick(event) {
  taskId = event.currentTarget.id.substr(1);

  if (event.currentTarget.checked === false) {
    fetch(`https://api.trello.com/1/cards/${cardId}/checklist/${checklistId}/checkItem/${taskId}/state?${auth}&value=false`, {
      method: 'PUT',
    });
  } else {
    fetch(`https://api.trello.com/1/cards/${cardId}/checklist/${checklistId}/checkItem/${taskId}/state?${auth}&value=true`, {
      method: 'PUT',
    });
  }
}
