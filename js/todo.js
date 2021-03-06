const key = '2741f097a35c836f5878ad3536c6bcf3';
const token = '676e08999f4ddfb4bf19968bfe184927a508a6308b7f9fc84313e85fbf7e019e';
const auth = `key=${key}&token=${token}`;
let boardID;

$(document).ready(() => {
  fetch(
    `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`,
  ).then(boards => boards.json())
    .then((boards) => {
      boardID = boards[3].id;
      loadCheckLists();// eslint-disable-line no-use-before-define
      loadTask(); // eslint-disable-line no-use-before-define
    });
});

$('select#selectCard').change(() => {
  $('#list-group').load(`${document.URL} #list-group`);
  loadTask();// eslint-disable-line no-use-before-define
});


function loadCheckLists() {
  fetch(`https://api.trello.com/1/boards/${boardID}/checklists/?${auth}`)
    .then(list => list.json())
    .then((list) => {
      list.forEach((checkList) => {
        checkListName = checkList.name;
        const id = checkList.id;// eslint-disable-line prefer-destructuring
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
        if (checkList.id === $('#selectCard option:selected').val()) {
          checkList.checkItems.forEach((checkItem) => {
            checkItemName = checkItem.name;
            checkItemId = `a${checkItem.id}`;
            let statusOfTask;
            if (checkItem.state === 'incomplete') {
              statusOfTask = 'unchecked';
            } else {
              statusOfTask = 'checked';
            }
            appendTask(statusOfTask, checkItemName, checkItemId); // eslint-disable-line no-use-before-define
          });
        }
      });
    });
}

function appendTask(statusOfTask, checkItemName, checkItemId) {
  $('#list-group').append(`<div id="parent"><div> <input type="checkbox" onclick= "checkTask(event)" id=${checkItemId} ${statusOfTask} ></input><label>${checkItemName}</label></div></div>`);
}


$('#add-task').click(() => {
  checklistId = $('#selectCard option:selected').val();
  const task = $('.todoText').val();
  if (task !== '') {
    fetch(`https://api.trello.com/1/checklists/${checklistId}/checkItems?name=${task}&pos=bottom&${auth}`, {
      method: 'POST',
    })
      .then(() => {
        $('#list-group').load(`${document.URL} #list-group`);
        loadTask();
      });
  }
});

function checkTask(event) { // eslint-disable-line no-unused-vars
  taskId = event.currentTarget.id.substr(1);
  let stateOfTask;
  if (event.currentTarget.checked === false) {
    stateOfTask = false;
  } else {
    stateOfTask = true;
  }
  let cardId;
  checklistId = $('#selectCard option:selected').val();
  fetch(`https://api.trello.com/1/checklists/${checklistId}/cards?${auth}`)
    .then(checkListDetail => checkListDetail.json())
    .then((checkListDetail) => {
      cardId = checkListDetail[0].id;
    }).then(() => {
      fetch(`https://api.trello.com/1/cards/${cardId}/checklist/${checklistId}/checkItem/${taskId}/state?${auth}&value=${stateOfTask}`, {
        method: 'PUT',
      });
    });
}
