const seanceId = Number(localStorage.getItem("seanceId"));
const checkedDate = localStorage.getItem("checkedDate");
const tickets = JSON.parse(localStorage.getItem("tickets"));
const ticketsInfo = JSON.parse(localStorage.getItem("ticketsInfo"));
const filmInfo = document.querySelector(".ticket__info-film");
const placesInfo = document.querySelector(".ticket__info-places");
const hallInfo = document.querySelector(".ticket__info-hall");
const timeInfo = document.querySelector(".ticket__info-time");
const ticketQr = document.querySelector(".ticket__info-qr");

let infoQr;
let qrCode;
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


  // CREATE QRCODE
  infoQr = `
    Дата: ${checkedDate}, 
    Время: ${timeInfo.textContent}, 
    Название фильма: ${filmInfo.textContent}, 
    Зал: ${hallInfo.textContent}, 
    Ряд/Место: ${places.join(", ")}, 
    Стоимость: ${coastSumm}, 
    Билет действителен строго на свой сеанс
  `

  qrCode = QRCreator(infoQr,
    {
      mode: -1,
      eccl: 0,
      version: -1,
      mask: -1,
      image: "PNG",
      modsize: 3,
      margin: 3
    });

  ticketQr.append(qrCode.result);
  localStorage.clear();
}

// GET DATA
fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then((data) => {
    console.log(data);
    getInfoTicket(data);
  })

