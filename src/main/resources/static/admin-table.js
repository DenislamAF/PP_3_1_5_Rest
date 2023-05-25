"use strict";

const url = "http://localhost:8080/api/users";

document.addEventListener('DOMContentLoaded', fillPage);

async function fillPage() {
    let currentUserResponse = await fetch(url + "/current-user");
    let currentUser = await currentUserResponse.json();
    fillPageHeader(currentUser);

    let usersListResponse = await fetch(url);
    let usersList = await usersListResponse.json();
    fillAdminTable(usersList);
}

function fillPageHeader(user) {
    let div = document.getElementById('admin-table-page-header');
    div.innerHTML = "";
    let p = document.createElement('p');
    p.className = "text-light";
    let roles = "";
    for (let role of user.roles) {
        roles += role.name.slice(5) + " ";
    }
    p.innerHTML = `<b><span>${user.username}</span></b>
                                <span> with roles: </span>
                                <span>${roles}</span>`;
    div.append(p);
}

function fillAdminTable(usersList) {
    let tbody = document.getElementById('admin-table-tbody');
    tbody.innerHTML = "";
    for (let user of usersList) {
        let tr = document.createElement('tr');
        let roles = "";
        for (let role of user.roles) {
            roles += role.name.slice(5) + " ";
        }
        tr.innerHTML = `<td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.username}</td>
                        <td>${roles}</td>
                        <td>
                            <button type="button" class="btn btn-info" 
                            data-toggle="modal" data-target="#editUser"
                            onclick="editModalPage(${user.id})">
                                Edit
                            </button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" 
                            data-toggle="modal" data-target="#deleteUser"
                            onclick="deleteModalPage(${user.id})">
                                Delete
                            </button>
                        </td>`;
        tbody.append(tr);
    }
}

async function addUser() {
    let roles = [];
    for (let i = 0; i < document.getElementById('edit-roles').options.length; i++) {
        if (document.getElementById('newUser-roles').options[i].selected) {
            roles.push({
                id: `${i + 1}`,
                name: document.getElementById('newUser-roles').value
            });
        }
    }
    let method = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName: document.getElementById('newUser-firstName').value,
            lastName: document.getElementById('newUser-lastName').value,
            age: document.getElementById('newUser-age').value,
            username: document.getElementById('newUser-email').value,
            password: document.getElementById('newUser-password').value,
            roles: roles
        })
    }
    await fetch(url, method)
        .then(() => {
            $('#table-tab').click();
            clearAddUserTab();
            fillPage();
        });
}

function clearAddUserTab() {
    document.getElementById('newUser-firstName').value = "";
    document.getElementById('newUser-lastName').value = "";
    document.getElementById('newUser-age').value = "";
    document.getElementById('newUser-email').value = "";
    document.getElementById('newUser-password').value = "";
    for (let i = 0; i < document.getElementById('newUser-roles').options.length; i++) {
        document.getElementById('newUser-roles').options[i].selected = false;
    }
}

async function editModalPage(id) {
    $('#editUser').modal('show');
    let userResponse = await fetch(url + "/" + id);
    let user = await userResponse.json();
    document.getElementById('edit-id').value = `${user.id}`;
    document.getElementById('edit-firstName').value = `${user.firstName}`;
    document.getElementById('edit-lastName').value = `${user.lastName}`;
    document.getElementById('edit-age').value = `${user.age}`;
    document.getElementById('edit-email').value = `${user.username}`;
    for (let role of user.roles) {
        if (role.name === "ROLE_ADMIN") document.getElementById('edit-roles').options[0].selected = true;
        if (role.name === "ROLE_USER") document.getElementById('edit-roles').options[1].selected = true;
    }
}

async function editUser() {
    let roles = [];
    for (let i = 0; i < document.getElementById('edit-roles').options.length; i++) {
        if (document.getElementById('edit-roles').options[i].selected) {
            roles.push({
                id: `${i + 1}`,
                name: document.getElementById('edit-roles').value
            });
        }
    }
    let method = {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName: document.getElementById('edit-firstName').value,
            lastName: document.getElementById('edit-lastName').value,
            age: document.getElementById('edit-age').value,
            username: document.getElementById('edit-email').value,
            password: document.getElementById('edit-password').value,
            roles: roles
        })
    }
    await fetch(url + "/" + document.getElementById('edit-id').value, method)
        .then(() => {
            $('#closeEditModalPage').click();
            fillPage();
        });
}

async function deleteModalPage(id) {
    $('#deleteUser').modal('show');
    let userResponse = await fetch(url + "/" + id);
    let user = await userResponse.json();
    document.getElementById('delete-id').value = `${user.id}`;
    document.getElementById('delete-firstName').value = `${user.firstName}`;
    document.getElementById('delete-lastName').value = `${user.lastName}`;
    document.getElementById('delete-age').value = `${user.age}`;
    document.getElementById('delete-email').value = `${user.username}`;
}

async function deleteUser() {
    await fetch(url + "/" + document.getElementById('delete-id').value, {method: 'DELETE'})
        .then(() => {
            $('#closeDeleteModalPage').click();
            fillPage();
        });
}