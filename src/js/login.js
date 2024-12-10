'use strict'

// shfe-diplom@netology.ru | shfe-diplom
const loginForm = document.querySelector(".login__form");
const loginLogin = document.querySelector(".login__email");
const loginPassword = document.querySelector(".login__password");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    if (loginLogin.value.trim() && loginPassword.value.trim()) {
        const formData = new FormData(loginForm);

        fetch('https://shfe-diplom.neto-server.ru/login', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then((data) => {
                if (data.success) {
                    document.location = "./admin.html";
                } else {
                    alert("Неверный логин/пароль!");
                }
            })
        }
})

