"use strict";

const url = "http://localhost:8080/api/users";

document.addEventListener('DOMContentLoaded', fillPage);

async function fillPage() {
    let response = await fetch(url + "/current-user");
    let user = await response.json();
    fillPageHeader(user);
    fillUserInfoTable(user);
}

function fillPageHeader(user){
    let div = document.getElementById('user-info-page-header');
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

function fillUserInfoTable(user) {
    let tbody = document.getElementById('user-info-tbody');
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
                    <td>${roles}</td>`;
    tbody.append(tr);
}