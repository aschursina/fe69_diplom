'use strict'
// GO TO ADMIN
// shfe-diplom@netology.ru | shfe-diplom
const btnLogin = document.querySelector(".btnLogin");

btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    document.location = "./src/login.html"
})

//DATE
const navDays = Array.from(document.querySelectorAll(".nav__day"));
const navToday = document.querySelector(".nav__day_today");
const navArrowRight = document.querySelector(".right");

let daysCount = 1;
let todayNavWeek;
let todayNavDate;
const weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
let todayWeekDay;
const currentDay = new Date();
let checkedDate;
let selectedDate;
let selectedMonth;
let selectedYear;
let gottenDate;
let gottenMonth;
let searchMonth;
let date;
let navDaysSorted;

const mainInfo = document.querySelector(".mainInfo");
let filmSeances;
let filmSeancesList;

// GET CURRENT DAY
function getCurrentToday(currentDay) {
    todayWeekDay = weekDays[currentDay.getDay()];

    todayNavWeek = navToday.querySelector(".nav__text-week");
    todayNavWeek.textContent = `${todayWeekDay}, `;

    todayNavDate = navToday.querySelector(".nav__text-date");
    todayNavDate.textContent = ` ${currentDay.getDate()}`;

    if (todayNavWeek.textContent === "Сб, " || todayNavWeek.textContent === "Вс, ") {
        todayNavWeek.classList.add("nav__day_weekend");
        todayNavDate.classList.add("nav__day_weekend");
    }
}

// GET OTHER DAYS
function getOtherDays() {
    navDays.forEach((day, i) => {
        if (!day.classList.contains("nav__day_today") && !day.classList.contains("nav__arrow")) {
            const date = new Date(currentDay.getTime() + (1000 * 60 * 60 * 24 * i));
            day.dataset.date = date.toJSON().split("T")[0];
            day.firstElementChild.textContent = `${weekDays[date.getDay()]},`;
            day.lastElementChild.textContent = date.getDate();

            if (day.firstElementChild.textContent === "Сб," || day.firstElementChild.textContent === "Вс,") {
                day.classList.add("nav__day_weekend");
            } else {
                day.classList.remove("nav__day_weekend");
            }
        }
    });
}

// GHANGE DAYS
function changeDays(daysCount) {
    navDays.forEach((day, i) => {
        if (!day.classList.contains("nav__day_today") && !day.classList.contains("nav__arrow")) {
            const date = new Date(currentDay.getTime() + (1000 * 60 * 60 * 24 * (i + daysCount)));
            day.dataset.date = date.toJSON().split("T")[0];
            day.firstElementChild.textContent = `${weekDays[date.getDay()]},`;
            day.lastElementChild.textContent = date.getDate();

            if (day.firstElementChild.textContent === "Сб," || day.firstElementChild.textContent === "Вс,") {
                day.classList.add("nav__day_weekend");
            } else {
                day.classList.remove("nav__day_weekend");
            }
        }
    });
}

//GET CHOOSE DAY
function getDay(selectedDate, selectedMonth, selectedYear) {
    if (selectedDate < 10) {
        gottenDate = `0${selectedDate}`;
    } else {
        gottenDate = selectedDate;
    }

    if (selectedMonth < 9) {
        gottenMonth = `0${selectedMonth}`;
    } else {
        gottenMonth = selectedMonth;
    }

    date = `${selectedYear}-${gottenMonth}-${gottenDate}`;
}

function sortDays(navDays) {
    navDaysSorted = navDays.filter(item => !item.classList.contains("nav__arrow"));
}

// CALCULATE TODAY
navToday.classList.add("nav__day-checked");
navToday.dataset.date = currentDay.toJSON().split("T")[0];

if (navToday.classList.contains("nav__day-checked")) {
    selectedDate = currentDay.getDate();
    selectedMonth = currentDay.getMonth() + 1;
    selectedYear = currentDay.getFullYear();

    getDay(selectedDate, selectedMonth, selectedYear);
    localStorage.setItem("checkedDate", date);
}

getCurrentToday(currentDay);
getOtherDays();
sortDays(navDays);
markNonactiveSeances();

// CLICK RIGHT
navArrowRight.addEventListener("click", () => {
    daysCount++;
    navToday.classList.remove("nav__day-checked");
    navToday.classList.add("nav__arrow");
    navToday.classList.add("left");
    navToday.style.cursor = "pointer";
    navToday.style.display = "flex";
    navToday.innerHTML = `
      <span class="nav__arrow-text">&lt;</span>
    `;

    changeDays(daysCount);
    sortDays(navDays);
})

// CLICK LEFT
navToday.addEventListener("click", () => {
    if (navToday.classList.contains("nav__arrow")) {
        daysCount--;
        if (daysCount > 0) {
            changeDays(daysCount);
            sortDays(navDays);
        } else if (daysCount === 0) {
            navToday.classList.remove("nav__arrow");
            navToday.classList.remove("left");
            navToday.style.display = "block";
            navToday.innerHTML = `
          <span class="nav__text-today">Сегодня</span>
          <br><span class="nav__text-week"></span> <span class="nav__text-date"></span>
        `;

            getCurrentToday(currentDay);
            getOtherDays();
            navDays.forEach(day => {
                if (!day.classList.contains("nav__day-checked")) {
                    navToday.classList.add("nav__day-checked");
                    navToday.style.cursor = "default";
                    selectedDate = currentDay.getDate();
                    selectedMonth = currentDay.getMonth() + 1;
                    selectedYear = currentDay.getFullYear();
                    getDay(selectedDate, selectedMonth, selectedYear);
                    localStorage.setItem("checkedDate", date);
                }
            })

            sortDays(navDays);
        } else {
            return;
        }

    } else {
        return;
    }

})

//CHOOSE DAY
navDaysSorted.forEach(day => {
    day.addEventListener("click", () => {
        navDaysSorted.forEach(item => {
            item.classList.remove("nav__day-checked");
            item.style.cursor = "pointer";
        })

        if (!day.classList.contains("nav__arrow")) {
            day.classList.add("nav__day-checked");
            day.style.cursor = "default";
            checkedDate = new Date(day.dataset.date);
            selectedDate = checkedDate.getDate();
            selectedMonth = checkedDate.getMonth() + 1;
            selectedYear = checkedDate.getFullYear();
            getDay(selectedDate, selectedMonth, selectedYear);
            localStorage.setItem("checkedDate", date);
            markNonactiveSeances();
            clickSeance();
        }

    })
})


//GET FILMS
let dataFilms;
let dataSeances;
let dataHalls;

let hallsSeances;
let currentSeances;

function getFilms(data) {
    dataFilms = data.result.films;
    dataSeances = data.result.seances;
    dataHalls = data.result.halls.filter(hall => hall.hall_open === 1);

    dataFilms.forEach(film => {
        hallsSeances = "";

        dataHalls.forEach(hall => {

            // GET SEANCES FOR FILM
            currentSeances = dataSeances.filter(seance => (
                (Number(seance.seance_hallid) === Number(hall.id)) &&
                (Number(seance.seance_filmid) === Number(film.id))
            ));

            // SORTED SEANCES BY TIME
            currentSeances.sort(function (a, b) {
                if ((a.seance_time.slice(0, 2) - b.seance_time.slice(0, 2)) < 0) {
                    return -1;
                } else if ((a.seance_time.slice(0, 2) - b.seance_time.slice(0, 2)) > 0) {
                    return 1;
                }
            });

            if (currentSeances.length > 0) {

                // GET LIST OF SEANCES
                hallsSeances += `
        <h3 class="hall__name" data-hallid="${hall.id}">${hall.hall_name}</h3>
        <ul class="time__list">
        `;

                currentSeances.forEach(seance => {
                    hallsSeances += `
                    <li class="time__item" data-seanceid="${seance.id}" data-hallid="${hall.id}" data-filmid="${film.id}">${seance.seance_time}</li>`;
                });

                hallsSeances += `</ul>`;
            };
        });

        if (hallsSeances) {
            // GET INFO FILM
            mainInfo.insertAdjacentHTML("beforeend", `
        <section class="film" data-filmid="${film.id}">
          <div class="film__info">
            <div class="film__poster">
              <img src="${film.film_poster}" alt="Постер фильма ${film.film_name}" class="film__poster_image">
            </div>
            <div class="film__description">
              <h2 class="film__title">${film.film_name}</h2>
              <p class="film__decription">${film.film_description}</p>
              <p class="film__data">
                <span class="film__data-duration">${film.film_duration} минут</span>
                <span class="film__data-country">${film.film_origin}</span>
              </p>
            </div>
          </div>

          <div class="film-seances">
            ${hallsSeances}
          </div>
        </section>
      `);
        }
    })

    markNonactiveSeances();

    clickSeance();
}

// GET DATA
fetch("https://shfe-diplom.neto-server.ru/alldata")
    .then(response => response.json())
    .then((data) => {
        console.log(data);
        getFilms(data);
    })

// MARK NONACTIVE SEANCES
function markNonactiveSeances() {

    // GET CURRENT TIME
    const currentHours = currentDay.getHours();
    const currentMinutes = currentDay.getMinutes();
    filmSeancesList = document.querySelectorAll(".time__item");
    filmSeancesList.forEach(seance => {
        if (Number(selectedDate) === Number(currentDay.getDate())) {
            if (Number(currentHours) > Number(seance.textContent.trim().slice(0, 2))) {
                seance.classList.add("time__item_disabled");
            } else if (Number(currentHours) === Number(seance.textContent.trim().slice(0, 2))) {
                if (Number(currentMinutes) > Number(seance.textContent.trim().slice(3))) {
                    seance.classList.add("time__item_disabled");
                } else {
                    seance.classList.remove("time__iteme_disabled");
                }
            } else {
                seance.classList.remove("time__item_disabled");
            }
        } else {
            seance.classList.remove("time__item_disabled");
        }
    })
}

// GO TO HALL
let seanceId;
function clickSeance() {
    filmSeancesList = document.querySelectorAll(".time__item");
    filmSeancesList.forEach(seance => {
        if (!seance.classList.contains("time__item_disabled")) {
            seance.addEventListener("click", () => {
                seanceId = seance.dataset.seanceid;
                localStorage.setItem("seanceId", seanceId);
                document.location = "./src/hall.html";
            })
        }
    })

}