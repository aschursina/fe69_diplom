const seanceId = Number(localStorage.getItem("seanceId"));
const checkedDate = localStorage.getItem("checkedDate");
const tickets = JSON.parse(localStorage.getItem("tickets"));
const filmInfo = document.querySelector(".ticket__info-film");
const placesInfo = document.querySelector(".ticket__info-places");
const hallInfo = document.querySelector(".ticket__info-hall");
const timeInfo = document.querySelector(".ticket__info-time");
const priceInfo = document.querySelector(".ticket__info-price");
const codeButton = document.querySelector(".btn__code");

let places = [];
let coast = [];
let coastSumm;


// GET INFO TICKET
function getInfoTicket(data) {
  let seanceItem = data.result.seances.findIndex(item => item.id === Number(seanceId));
  let movieItem = data.result.films.findIndex(item => item.id === data.result.seances[seanceItem].seance_filmid);
  let hallItem = data.result.halls.findIndex(item => item.id === data.result.seances[seanceItem].seance_hallid);

  filmInfo.textContent = data.result.films[movieItem].film_name;
  hallInfo.textContent = data.result.halls[hallItem].hall_name;
  timeInfo.textContent = data.result.seances[seanceItem].seance_time;

    tickets.forEach(ticket => {
        places.push(ticket.row + "/" + ticket.place);
        coast.push(ticket.coast);
    })

    placesInfo.textContent = places.join(", ");
    coastSumm = coast.reduce((acc, price) => acc + price, 0);
    priceInfo.textContent = coastSumm;
}

// GET DATA
fetch("https://shfe-diplom.neto-server.ru/alldata")
    .then(response => response.json())
    .then((data) => {
        console.log(data);
        getInfoTicket(data);
    })

// GET CODE
codeButton.addEventListener("click", event => {
    event.preventDefault();
    const params = new FormData();
    params.set("seanceId", seanceId);
    params.set("ticketDate", checkedDate);
    params.set("tickets", JSON.stringify(tickets));

    fetch("https://shfe-diplom.neto-server.ru/ticket", {
        method: "POST",
        body: params
    })
        .then(response => response.json())
        .then((data) =>{
            console.log(data);

            if (!data.success) {
                alert("Места недоступны для бронирования!");
                return; 
            } 
            
            localStorage.setItem("ticketsInfo", JSON.stringify(data));
            document.location = "./ticket.html";

        })
})