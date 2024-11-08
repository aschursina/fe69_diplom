'use strict'

// shfe-diplom@netology.ru | shfe-diplom
const loginForm = document.querySelector(".login__main");
const loginLogin = document.querySelector(".login__email");
const loginPassword = document.querySelector(".login__password");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    if (loginLogin.value.trim() && loginPassword.value.trim()) {
        fetch('https://shfe-diplom.neto-server.ru/login', {
            method: 'POST',
            body: JSON.stringify({ login: loginLogin.value, password: loginPassword.value })
        })
            .then(response => response.json())
            .then((data) => {
                if (!data.success) {
                    alert("Неверный логин/пароль!");
                }
                document.location = "./admin.html"
            })
        }
})

