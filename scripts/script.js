var table = document.getElementById('toDoTable');

function addItem() {
    var getInput = document.getElementById('toDoText')

    if (getInput.value == "") {
        $(document).ready(function() {
            $("#insertSomeThing").modal('show');
        });
    } else {
        var ul = document.createElement('tr')
        var liName = document.createElement('td')
        ul.appendChild(liName)

        var liEdit = document.createElement('td')
        ul.appendChild(liEdit)

        var liDelete = document.createElement('td')
        ul.appendChild(liDelete)

        var editButton = document.createElement('button')
        var editButtonText = document.createTextNode('EDIT')

        editButton.setAttribute('class', 'btn btn-warning tableButton')
        editButton.setAttribute('onclick', 'editItem(this)')

        liEdit.appendChild(editButton)
        editButton.appendChild(editButtonText)

        var deleteButton = document.createElement('button')
        var deleteButtonText = document.createTextNode('DELETE')

        deleteButton.setAttribute('class', 'btn btn-danger text-white tableButton')
        deleteButton.setAttribute('onclick', 'deleteItem(this)')

        liDelete.appendChild(deleteButton)
        deleteButton.appendChild(deleteButtonText)

        var listText = document.createTextNode(getInput.value)
        liName.appendChild(listText)

        table.appendChild(ul)

        var key = firebase.database().ref('profile').push().key
        deleteButton.setAttribute('value', key)
        editButton.setAttribute('value', key)

        var profile = {
            TodoListName: getInput.value,
            key: key
        }

        firebase.database().ref('profile/' + key).set(profile)

        getInput.value = ""
    }
}

function editItem(button) {
    var updateValue = button.parentNode.parentNode.firstChild.innerText
    var updatedValue = button.parentNode.parentNode.firstChild
    var editValue = prompt("Enter update value", updateValue)
    updatedValue.innerText = editValue

    key = button.value
    var profile = {
        TodoListName: editValue,
        key: key
    }
    firebase.database().ref('profile/' + key).set(profile)
}

function deleteItem(button) {
    firebase.database().ref('profile/' + button.value).remove()
    button.parentNode.parentNode.remove()
}

function deleteItems() {
    if (table.innerHTML == "") {
        $(document).ready(function() {
            $("#insertField").modal('show');
        });
    } else {
        table.innerHTML = ""
        firebase.database().ref('profile/').remove()

    }
}

function showData() {
    firebase.database().ref('profile').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            firebase.database().ref('profile/' + childKey + '/TodoListName').on('value', function(data) {
                if (data.val() != null) {

                    var ul = document.createElement('tr')
                    var liName = document.createElement('td')
                    ul.appendChild(liName)

                    var liEdit = document.createElement('td')
                    ul.appendChild(liEdit)

                    var liDelete = document.createElement('td')
                    ul.appendChild(liDelete)

                    var editButton = document.createElement('button')
                    var editButtonText = document.createTextNode('EDIT')

                    editButton.setAttribute('class', 'btn btn-warning tableButton')
                    editButton.setAttribute('onclick', 'editItem(this)')
                    editButton.setAttribute('value', childKey)

                    liEdit.appendChild(editButton)
                    editButton.appendChild(editButtonText)

                    var deleteButton = document.createElement('button')
                    var deleteButtonText = document.createTextNode('DELETE')

                    deleteButton.setAttribute('class', 'btn btn-danger text-white tableButton')
                    deleteButton.setAttribute('onclick', 'deleteItem(this)')
                    deleteButton.setAttribute('value', childKey)


                    liDelete.appendChild(deleteButton)
                    deleteButton.appendChild(deleteButtonText)

                    var listText = document.createTextNode(data.val())
                    liName.appendChild(listText)

                    table.appendChild(ul)
                }

                console.log(data.val())
            })
        });
    });
}

showData()