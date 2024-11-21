let seanceId = Number(localStorage.getItem("seanceId"));
let checkedDate = localStorage.getItem("checkedDate");
const body = document.querySelector("body");
const buyingInfo = document.querySelector(".buying__info");
const filmTitle = document.querySelector(".buying__info_title");
const seanceStartTime = document.querySelector(".buying__info-time");
const hallName = document.querySelector(".buying__info_hall");
const scheme = document.querySelector(".buying__scheme_places");
let hallSchemeRows;
let hallChairs;
const hallPriceStandart = document.querySelector(".price_standart");
const hallPriceVip = document.querySelector(".price_vip");
let priceStandart;
let priceVip;
let selectedPlaces;
let tickets = [];
let coast;
const buyingButton = document.querySelector(".btn__buy");


// GET INFO TICKET
function getInfoTicket(data) {
    let seanceItem = data.result.seances.findIndex(item => item.id === Number(seanceId));
    let movieItem = data.result.films.findIndex(item => item.id === data.result.seances[seanceItem].seance_filmid);
    let hallItem = data.result.halls.findIndex(item => item.id === data.result.seances[seanceItem].seance_hallid);

    filmTitle.textContent = data.result.films[movieItem].film_name;
    seanceStartTime.textContent = data.result.seances[seanceItem].seance_time;
    hallName.textContent = data.result.halls[hallItem].hall_name;

    hallPriceStandart.textContent = data.result.halls[hallItem].hall_price_standart;
    hallPriceVip.textContent = data.result.halls[hallItem].hall_price_vip;

    priceStandart = data.result.halls[hallItem].hall_price_standart;
    priceVip = data.result.halls[hallItem].hall_price_vip;
}

// SHOW SCHEMA
function showHallScheme(data) {
    let hallConfig = data.result;
    hallConfig.forEach(() => {
        scheme.insertAdjacentHTML("beforeend", `<div class="buying__scheme_row"></div>`);
    });
    
    hallSchemeRows = document.querySelectorAll(".buying__scheme_row");
    
    for (let i = 0; i < hallSchemeRows.length; i++) {
        for (let j = 0; j < hallConfig[i].length; j++) {
            hallSchemeRows[i].insertAdjacentHTML("beforeend", `<span class="buying__scheme_chair" data-type="${hallConfig[i][j]}"></span>`);
        }
    }

    hallChairs = document.querySelectorAll(".buying__scheme_chair");
    hallChairs.forEach(element => {
        if (element.dataset.type === "vip") {
            element.classList.add("chair_vip");
        } else if (element.dataset.type === "standart") {
            element.classList.add("chair_standart");
        } else if (element.dataset.type === "taken") {
            element.classList.add("chair_occupied");
        } else {
            element.classList.add("no-chair");
        }
    })
}

// CHOOSE PLACE
function choosePlaces(hallSchemeRows) {
    let hallChooseRows = Array.from(hallSchemeRows);
    hallChooseRows.forEach(row => {
        let hallChoosePlaces = Array.from(row.children);
        hallChoosePlaces.forEach(place => {
            if (place.dataset.type !== "disabled" && place.dataset.type !== "taken") {
                place.addEventListener("click", () => {
                    place.classList.toggle("chair_selected");
                    selectedPlaces = document.querySelectorAll(".chair_selected:not(.buying__scheme_free-chair)");
                })

            }
        })
    })
}

// TO BUY
function clickButton() {
    buyingButton.addEventListener("click", event => {
        event.preventDefault();
        let hallChosenRows = Array.from(document.querySelectorAll(".buying__scheme_row"));
        tickets = [];
        hallChosenRows.forEach(row => {
            let rowIndex = hallChosenRows.findIndex(currentRow => currentRow === row);
            let hallChosenPlaces = Array.from(row.children);
            hallChosenPlaces.forEach(place => {
                let placeIndex = hallChosenPlaces.findIndex(currentPlace => currentPlace === place);
                if (place.classList.contains("chair_selected")) {
                    if (place.dataset.type === "standart") {
                        coast = priceStandart;
                    } else if (place.dataset.type === "vip") {
                        coast = priceVip;
                    }
                    tickets.push({
                        row: rowIndex + 1,
                        place: placeIndex + 1,
                        coast: coast,
                    })
                }
            })
        })
    localStorage.setItem("tickets", JSON.stringify(tickets));
    document.location = "./pay.html";
    })
}


// GET DATA
fetch("https://shfe-diplom.neto-server.ru/alldata")
    .then(response => response.json())
    .then((data) => {
        console.log(data);
        getInfoTicket(data);

        // GET SCHEMA
        fetch(`https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${checkedDate}`)
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                showHallScheme(data);
                choosePlaces(hallSchemeRows);
                clickButton();
            })

    })

// HINT
body.addEventListener("dblclick", () => {
    if ((Number(body.getBoundingClientRect().width)) < 768) {
        if (body.getAttribute("transformed") === "false" || !body.hasAttribute("transformed")) {
            body.style.zoom = "1.5";
            body.style.transform = "scale(1.5)";
            body.style.transformOrigin = "0 0";
            body.setAttribute("transformed", "true")
        } else if (body.getAttribute("transformed") === "true") {
            body.style.zoom = "1";
            body.style.transform = "scale(1)";
            body.style.transformOrigin = "0 0";
            body.setAttribute("transformed", "false");
        }
    }
})