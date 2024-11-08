'use strict'
const popup = Array.from(document.querySelectorAll(".popup"));
const popupForms = Array.from(document.querySelectorAll(".popup__form"));
const closeForm = Array.from(document.querySelectorAll(".popup__close"));
const cancelBtn = Array.from(document.querySelectorAll(".popup__button_cancel"));
const hideBlock = document.querySelectorAll(".admin__header_arrow");

//POPUP
//close
popup.forEach(form => {
  closeForm.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      form.classList.add('hidden');
    })
  })
});

//cancel
popupForms.forEach(form => {
  cancelBtn.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      form.classList.add('hidden');
    })
  })
});

//hide
hideBlock.forEach(block => {
  block.addEventListener('click', (e) => {
    let chooseBlock = block.closest('.admin__header');
    let hallBody = chooseBlock.nextElementSibling;
    block.classList.toggle('admin__header_arrow-hide');
    hallBody.classList.toggle('admin__wrapper-hide');
  })
})

//GET DATA
fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then((data) => {
    console.log(data);
    hallsOperations(data);
    moviesOperations(data);
    seancesOperations(data);
  })

// LIST HALLS
const hallsInfo = document.querySelector(".halls__info");
const hallsList = document.querySelector(".listHall");
const hallButton = document.querySelector(".admin__button_hall");
let hallRemoveButton;

// SETTING HALL
const hallsConfig = document.querySelector(".hall-config");
const hallsConfigList = document.querySelector(".hall-config__list");
const hallsConfigWrapper = document.querySelector(".hall-config__wrapper");
let hallsConfigItems;
let hallConfigArray = [];

// SCHEMA
let currentHallConfig;
let currentHallConfigIndex;
let newHallConfigArray;
let hallConfigForm;
let hallConfigRows;
let hallConfigPlaces;
let hallScheme;
let hallSchemeRows;
let hallSchemePlaces;
let hallChairs;
let hallConfigCancel;
let hallConfigSave;

// SETTING PRICE
const priceConfig = document.querySelector(".price-config");
const priceConfigList = document.querySelector(".price-config__list");
const priceConfigWrapper = document.querySelector(".price-config__wrapper");
let priceConfigItems;
let priceConfigForm;
let priceConfigStandart;
let priceConfigVip;
let priceConfigCancel;
let priceConfigSave;
let currentPriceConfig;

// OPEN SALE
const openSells = document.querySelector(".open");
const openList = document.querySelector(".open__list");
const openWrapper = document.querySelector(".open__wrapper");
let openInfo;
let openButton;
let currentOpen;

let hallCurrentStatus;
let hallNewStatus;

// LIST SEANCES
const movieSeancesTimelines = document.querySelector(".movie-seances__timelines");
let timelineDelete;

// CHECK ACTIVE HALLS
function checkHallsList() {
  if (hallsList.innerText) {
    hallsInfo.classList.remove("hidden");
    hallsList.classList.remove("hidden");
    hallsConfig.classList.remove("hidden");
    movieSeancesTimelines.classList.remove("hidden");
    openSells.classList.remove("hidden");
  } else {
    hallsInfo.classList.add("hidden");
    hallsList.classList.add("hidden");
    hallsConfig.classList.add("hidden");
    movieSeancesTimelines.classList.add("hidden");
    openSells.classList.add("hidden");
  }
}

// ADD HALL 
hallButton.addEventListener("click", () => {
  popupHallAdd.classList.remove("popup__hidden");
})

const popupHallAdd = document.querySelector(".popup__hall_add");
const formAddHall = document.querySelector(".popup__form_add-hall");
const inputAddHall = document.querySelector(".add-hall_input");
const buttonHallAdd = document.querySelector(".popup__add-hall_button_add");

formAddHall.addEventListener("submit", (e) => {
  e.preventDefault();
  addHall(inputAddHall);
})

function addHall(inputAddHall) {
  const formData = new FormData();
  formData.set("hallName", `${inputAddHall.value}`);
  if (inputAddHall.value.trim()) {
    fetch("https://shfe-diplom.neto-server.ru/hall", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        hallsList.insertAdjacentHTML("beforeend", `
        <li class="listHall_item">
          <span class="listHall_name" data-id="${data.result.halls.id}>${inputAddHall.value}</span> 
          <span class="admin__button_remove hall_remove"></span></p>
        </li>
        `);

        inputAddHall.value = "";
        location.reload();
      })
  }
}

// DELETE HALL
function deleteHall(hallId) {
  fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      location.reload();
    })
}

// SHOW SCHEMA
function showHall(data, currentHallConfigIndex) {
  hallConfigRows.value = data.result.halls[currentHallConfigIndex].hall_rows;
  hallConfigPlaces.value = data.result.halls[currentHallConfigIndex].hall_places;

  hallScheme.innerHTML = "";
  hallConfigArray.splice(0, hallConfigArray.length);

  data.result.halls[currentHallConfigIndex].hall_config.forEach(element => {
    hallScheme.insertAdjacentHTML("beforeend", `<div class="hall-config__hall_row"></div>`);
  })

  hallSchemeRows = document.querySelectorAll(".hall-config__hall_row");

  for (let i = 0; i < hallSchemeRows.length; i++) {
    for (let j = 0; j < data.result.halls[currentHallConfigIndex].hall_config[0].length; j++) {
      hallSchemeRows[i].insertAdjacentHTML("beforeend", `<span class="hall-config__hall_chair" data-type="${data.result.halls[currentHallConfigIndex].hall_config[i][j]}"></span>`);
    }
  }

  hallChairs = document.querySelectorAll(".hall-config__hall_chair");

  hallChairs.forEach(element => {
    if (element.dataset.type === "vip") {
      element.classList.add("place_vip");
    } else if (element.dataset.type === "standart") {
      element.classList.add("place_standart");
    } else {
      element.classList.add("place_block");
    }
  })

  hallConfigArray = JSON.parse(JSON.stringify(data.result.halls[currentHallConfigIndex].hall_config));
}

// CHANGE TYPE OF PLACE
function changePlaces(hallSchemeRows, data) {
  newHallConfigArray = JSON.parse(JSON.stringify(hallConfigArray));

  let hallChangeRows = Array.from(hallSchemeRows);
  hallChangeRows.forEach(row => {
    let rowIndex = hallChangeRows.findIndex(currentRow => currentRow === row);
    let hallChangePlaces = Array.from(row.children);
    hallChangePlaces.forEach(place => {
      place.style.cursor = "pointer";
      let placeIndex = hallChangePlaces.findIndex(currentPlace => currentPlace === place);

      place.addEventListener("click", () => {
        if (place.classList.contains("place_standart")) {
          place.classList.replace("place_standart", "place_vip");
          place.dataset.type = "vip";
          newHallConfigArray[rowIndex][placeIndex] = "vip";
        } else if (place.classList.contains("place_vip")) {
          place.classList.replace("place_vip", "place_block");
          place.dataset.type = "disabled";
          newHallConfigArray[rowIndex][placeIndex] = "disabled";
        } else {
          place.classList.replace("place_block", "place_standart");
          place.dataset.type = "standart";
          newHallConfigArray[rowIndex][placeIndex] = "standart";
        }

        if (JSON.stringify(newHallConfigArray) !== JSON.stringify(data.result.halls[currentHallConfigIndex].hall_config)) {
          hallConfigCancel.classList.remove("button_disabled");
          hallConfigSave.classList.remove("button_disabled");
        } else {
          hallConfigCancel.classList.add("button_disabled");
          hallConfigSave.classList.add("button_disabled");
        }
      })
    })
  })
}

// CHANGE SIZE OF HALL
function changeHallSize(newHallConfigArray, data) {
  hallConfigForm.addEventListener("input", () => {
    newHallConfigArray.splice(0, newHallConfigArray.length);

    hallScheme.innerHTML = "";

    for (let i = 0; i < hallConfigRows.value; i++) {
      hallScheme.insertAdjacentHTML("beforeend", `<div class="hall-config__hall_row"></div>`);
      newHallConfigArray.push(new Array());
    }

    hallSchemeRows = Array.from(document.querySelectorAll(".hall-config__hall_row"));

    for (let i = 0; i < hallConfigRows.value; i++) {
      for (let j = 0; j < hallConfigPlaces.value; j++) {
        hallSchemeRows[i].insertAdjacentHTML("beforeend", `<span class="hall-config__hall_chair place_standart" data-type="standart"></span>`);
        newHallConfigArray[i].push("standart");
      }
    }

    if (JSON.stringify(newHallConfigArray) !== JSON.stringify(data.result.halls[currentHallConfigIndex].hall_config)) {
      hallConfigCancel.classList.remove("button_disabled");
      hallConfigSave.classList.remove("button_disabled");
    } else {
      hallConfigCancel.classList.add("button_disabled");
      hallConfigSave.classList.add("button_disabled");
    }

    changePlaces(hallSchemeRows, data);
  })
}

// SAVE SETTING HALL
function saveConfig(currentHallConfig, newHallConfigArray) {
  const params = new FormData();

  params.set("rowCount", `${hallConfigRows.value}`);
  params.set("placeCount", `${hallConfigPlaces.value}`);
  params.set("config", JSON.stringify(newHallConfigArray));

  fetch(`https://shfe-diplom.neto-server.ru/hall/${currentHallConfig}`, {
    method: "POST",
    body: params
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      alert("Конфигурация зала сохранена!");
      location.reload();
    })
}

// SHOW PRICE
function showPrices(data, currentPriceConfig) {
  for (let i = 0; i < data.result.halls.length; i++) {
    if (data.result.halls[i].id === Number(currentPriceConfig)) {
      priceConfigStandart.value = data.result.halls[i].hall_price_standart;
      priceConfigVip.value = data.result.halls[i].hall_price_vip;

      priceConfigForm.addEventListener("input", () => {
        if (priceConfigStandart.value === data.result.halls[i].hall_price_standart && priceConfigVip.value === data.result.halls[i].hall_price_vip) {
          priceConfigCancel.classList.add("button_disabled");
          priceConfigSave.classList.add("button_disabled");
        } else {
          priceConfigCancel.classList.remove("button_disabled");
          priceConfigSave.classList.remove("button_disabled");
        }
      })
    }
  }
}

// SAVE SETTING PRICE
function savePrices(currentPriceConfig) {
  const params = new FormData();
  params.set("priceStandart", `${priceConfigStandart.value}`);
  params.set("priceVip", `${priceConfigVip.value}`);

  fetch(`https://shfe-diplom.neto-server.ru/price/${currentPriceConfig}`, {
    method: "POST",
    body: params
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      alert("Конфигурация цен сохранена!");
      location.reload();
    })
}

// CHECK OPENED HALL
function checkHallOpen(data, currentOpen) {
  openInfo = document.querySelector(".open__info");
  openButton = document.querySelector(".admin__button_open");
  let hasSeances = 0;

  for (let i = 0; i < data.result.halls.length; i++) {
    if (data.result.halls[i].id === Number(currentOpen)) {
      hallCurrentStatus = data.result.halls[i].hall_open;
    }
  }

  // CHECK HAVING SEANCES FOR HALL
  for (let i = 0; i < data.result.seances.length; i++) {
    if (data.result.seances[i].seance_hallid === Number(currentOpen)) {
      hasSeances++;
    }
  }

  if ((hallCurrentStatus === 0) && (hasSeances === 0)) {
    openButton.textContent = "Открыть продажу билетов";
    openInfo.textContent = "Добавьте сеансы в зал для открытия";
    openButton.classList.add("button_disabled");
  } else if ((hallCurrentStatus === 0) && (hasSeances > 0)) {
    openButton.textContent = "Открыть продажу билетов";
    hallNewStatus = 1;
    openInfo.textContent = "Всё готово к открытию";
    openButton.classList.remove("button_disabled");
  } else {
    openButton.textContent = "Приостановить продажу билетов";
    hallNewStatus = 0;
    openInfo.textContent = "Зал открыт";
    openButton.classList.remove("button_disabled");
  }
}

// CHANGE STATUS HALL
function openCloseHall(currentOpen, hallNewStatus) {
  const params = new FormData();
  params.set("hallOpen", `${hallNewStatus}`)
  fetch(`https://shfe-diplom.neto-server.ru/open/${currentOpen}`, {
    method: "POST",
    body: params
  })

    .then(response => response.json())
    .then((data) => {
      console.log(data);
      alert("Статус зала изменен!");
    })
}

// GET INFO HALL
function hallsOperations(data) {

  for (let i = 0; i < data.result.halls.length; i++) {

    // SAVE AVAILABLE HALL
    hallsList.insertAdjacentHTML("beforeend", `
      <li class="listHall_item">
        <span class="listHall_name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</span> <span class="admin__button_remove hall_remove"></span></p>
      </li>
    `);

    // Проверка наличия залов в списке

    checkHallsList();

    // SAVE HALL IN SETTING HALL

    hallsConfigList.insertAdjacentHTML("beforeend", `
      <li class="hall__item hall-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // SAVE HALL IN SETTING PRICE

    priceConfigList.insertAdjacentHTML("beforeend", `
      <li class="hall__item price-config__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // SAVE CHOOSING HALL
    openList.insertAdjacentHTML("beforeend", `
    <li class="hall__item open__item" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</li>
    `);

    // CREATE TIMELINE
    movieSeancesTimelines.insertAdjacentHTML("beforeend", `
    <section class="movie-seances__timeline">
      <div class="timeline__delete">
         <img class="timeline__delete_image" src="img/trash.png" alt="Удалить сеанс">
      </div>
      <h3 class="timeline__hall_title">${data.result.halls[i].hall_name}</h3>
      <div class="timeline__seances" data-id="${data.result.halls[i].id}">
      </div>
    </section>
    `);

    // HIDE TRASH
    timelineDelete = document.querySelectorAll(".timeline__delete");

    timelineDelete.forEach(element => {
      element.classList.add("hidden");
    })

  }

  // THE FIRST SCHEMA HALL
  hallsConfigList.firstElementChild.classList.add("hall_item-selected");
  currentHallConfig = hallsConfigList.firstElementChild.getAttribute("data-id");

  hallConfigForm = document.querySelector(".hall-config__size");
  hallConfigRows = document.querySelector(".hall-config__rows");
  hallConfigPlaces = document.querySelector(".hall-config__places");

  hallScheme = document.querySelector(".hall-config__hall_wrapper");

  currentHallConfigIndex = data.result.halls.findIndex(hall => hall.id === Number(currentHallConfig));

  hallConfigRows.value = data.result.halls[currentHallConfigIndex].hall_rows;
  hallConfigPlaces.value = data.result.halls[currentHallConfigIndex].hall_places;

  hallConfigCancel = document.querySelector(".hall-config__batton_cancel");
  hallConfigSave = document.querySelector(".hall-config__batton_save");

  showHall(data, currentHallConfigIndex);
  changePlaces(hallSchemeRows, data);
  changeHallSize(newHallConfigArray, data);

  // CANCEL IN SETTING HALL
  hallConfigCancel.addEventListener("click", event => {
    if (hallConfigCancel.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      hallConfigCancel.classList.add("button_disabled");
      hallConfigSave.classList.add("button_disabled");

      showHall(data, currentHallConfigIndex);
      changePlaces(hallSchemeRows, data);
    }
  })

  // SAVE IN SETTING HALL
  hallConfigSave.addEventListener("click", event => {
    if (hallConfigSave.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      saveConfig(currentHallConfig, newHallConfigArray);
    }
  })

  // GET PRICES FOR THE FIRST HALL
  priceConfigList.firstElementChild.classList.add("hall_item-selected");
  currentPriceConfig = priceConfigList.firstElementChild.getAttribute("data-id");
  priceConfigForm = document.querySelector(".price-config__form");
  priceConfigStandart = document.querySelector(".price-config__input_standart");
  priceConfigVip = document.querySelector(".price-config__input_vip");

  showPrices(data, currentPriceConfig);

  // CANCEL IN SETTING PRICE
  priceConfigCancel = document.querySelector(".price-config__batton_cancel");
  priceConfigSave = document.querySelector(".price-config__batton_save");
  priceConfigCancel.addEventListener("click", event => {
    if (priceConfigCancel.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      priceConfigCancel.classList.add("button_disabled");
      priceConfigSave.classList.add("button_disabled");

      showPrices(data, currentPriceConfig)
    }
  })

  // SAVE SETTING PRICE

  priceConfigSave.addEventListener("click", event => {
    if (priceConfigSave.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      savePrices(currentPriceConfig);
    }
  })

  // CHECK AVAILABLE THE FIRST HALL
  openList.firstElementChild.classList.add("hall_item-selected");
  currentOpen = openList.firstElementChild.getAttribute("data-id");

  checkHallOpen(data, currentOpen);

  // CHOOSE HALL IN SETTING HALL
  hallsConfigItems = document.querySelectorAll(".hall-config__item");
  hallsConfigItems.forEach(item => {
    item.addEventListener("click", () => {
      hallsConfigItems.forEach(i => {
        i.classList.remove("hall_item-selected");
      })

      item.classList.add("hall_item-selected");

      if (item.classList.contains("hall_item-selected")) {
        currentHallConfig = item.getAttribute("data-id");
      }

      hallConfigCancel.classList.add("button_disabled");
      hallConfigSave.classList.add("button_disabled");

      currentHallConfigIndex = data.result.halls.findIndex(hall => hall.id === Number(currentHallConfig));

      hallConfigRows.value = data.result.halls[currentHallConfigIndex].hall_rows;
      hallConfigPlaces.value = data.result.halls[currentHallConfigIndex].hall_places;

      showHall(data, currentHallConfigIndex);
      changePlaces(hallSchemeRows, data);

      changeHallSize(newHallConfigArray, data);

    })

  })

  // CHOOSE HALL IN SETTING PRICE
  priceConfigItems = document.querySelectorAll(".price-config__item");
  priceConfigItems.forEach(item => {
    item.addEventListener("click", () => {
      priceConfigItems.forEach(i => {
        i.classList.remove("hall_item-selected");
      })

      item.classList.add("hall_item-selected");

      if (item.classList.contains("hall_item-selected")) {
        currentPriceConfig = item.getAttribute("data-id");
      }

      priceConfigCancel.classList.add("button_disabled");
      priceConfigSave.classList.add("button_disabled");

      showPrices(data, currentPriceConfig);
    })

  })

  // CHOOSE HALL IN OPEN BUYING
  openItems = document.querySelectorAll(".open__item");
  openItems.forEach(item => {
    item.addEventListener("click", () => {
      openItems.forEach(i => {
        i.classList.remove("hall_item-selected");
      })
      item.classList.add("hall_item-selected");
      if (item.classList.contains("hall_item-selected")) {
        currentOpen = item.getAttribute("data-id");
      }
      checkHallOpen(data, currentOpen);
    })
  })

  // OPEN SALE
  openButton.addEventListener("click", event => {
    if (openButton.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();

      openCloseHall(currentOpen, hallNewStatus);

      for (let i = 0; i < data.result.halls.length; i++) {
        if (data.result.halls[i].id === Number(currentOpen)) {
          hallCurrentStatus = data.result.halls[i].hall_open;
        }
      }

      if (hallNewStatus === 0) {
        openButton.textContent = "Открыть продажу билетов";
        openInfo.textContent = "Всё готово к открытию";
        hallNewStatus = 1;
      } else {
        openButton.textContent = "Приостановить продажу билетов";
        openInfo.textContent = "Зал открыт";
        hallNewStatus = 0;
      }
    }
  })

  // DELETE HALL
  hallRemoveButton = document.querySelectorAll(".hall_remove");

  hallRemoveButton.forEach(item => {
    item.addEventListener("click", (e) => {
      let hallId = e.target.previousElementSibling.dataset.id;
      deleteHall(hallId);
    })
  })
}

// POPUP ADD FILM
const addMovieButton = document.querySelector(".admin__button_movie");
const movieSeancesWrapper = document.querySelector(".movie-seances__wrapper");

// OPEN ADD FILM
addMovieButton.addEventListener("click", () => {
  popupMovieAdd.classList.remove("popup__hidden");
})

// POPUP
const popupMovieAdd = document.querySelector(".popup__movie_add");
const formAddMovie = document.querySelector(".popup__form_add-movie");
const inputMovieName = document.querySelector(".add-movie_name_input");
const inputMovieTime = document.querySelector(".add-movie_time_input");
const inputMovieSynopsis = document.querySelector(".add-movie_synopsis_input");
const inputMovieCountry = document.querySelector(".add-movie_country_input");

const buttonPosterAdd = document.querySelector(".input_add_poster");

let posterFile;

// SAVE FILM
function addMovie(posterFile) {
  const formData = new FormData();
  let numbDuration = Number(inputMovieTime.value);

  formData.set("filmName", `${inputMovieName.value}`);
  formData.set("filmDuration", `${numbDuration}`);
  formData.set("filmDescription", `${inputMovieSynopsis.value}`);
  formData.set("filmOrigin", `${inputMovieCountry.value}`);
  formData.set("filePoster", posterFile);

  fetch("https://shfe-diplom.neto-server.ru/film", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      alert(`Фильм ${inputMovieName.value} добавлен!`);
      location.reload();
    })
}

// DELETE FILM
function deleteMovie(movieId) {
  fetch(`https://shfe-diplom.neto-server.ru/film/${movieId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      alert(`Фильм ${movieId} удален!`);
      location.reload();
    })
}

// LOAD POSTER
buttonPosterAdd.addEventListener("change", event => {
  event.preventDefault();
  let fileSize = buttonPosterAdd.files[0].size;

  if (fileSize > 3000000) {
    alert("Размер файла должен быть не более 3 Mb!");
  } else {
    posterFile = buttonPosterAdd.files[0];
  }
})


formAddMovie.addEventListener("submit", (e) => {
  e.preventDefault();
  if (posterFile === undefined) {
    alert("Загрузите постер!");
    return;
  } else {
    addMovie(posterFile);
  }
})


let movieId;

movieSeancesWrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("movie-seances__movie_delete")) {
    movieId = e.target.closest(".movie-seances__movie").dataset.id;
    deleteMovie(movieId);
  } else {
    return;
  }
})

// GET FILMS
function moviesOperations(data) {
  let movieCount = 1;

  for (let i = 0; i < data.result.films.length; i++) {
    movieSeancesWrapper.insertAdjacentHTML("beforeend", `
    <div class="movie-seances__movie background_${movieCount}" data-id="${data.result.films[i].id}" draggable="true" >
              <img src="${data.result.films[i].film_poster}" alt="постер" class="movie-seances__movie_poster">

              <div class="movie-seances__movie_info">
                  <p class="movie_info-title">${data.result.films[i].film_name}</p>
                  <p class="movie_info-length"><span class="movie_info-time">${data.result.films[i].film_duration}</span> минут</p> 
              </div>
              
              <span class="admin__button_remove movie-seances__movie_delete"></span>
            </div>
    `);

    movieCount++;

    if (movieCount > 5) {
      movieCount = 1;
    }
  }
}

// TIMELINE
let timelineSeances;
let timelineMovies;
let selectedMovie;
let selectedHall;

let hallSeances;
let seanceTimeStart;
let seanceTimeEnd;
let currentSeancesDuration;
let currentSeancesStart;
let currentSeanceTimeStart;
let currentSeancesTimeEnd;

let seanseAllowed = false;

let movieSeancesCancel;
let movieSeancesSave;

// POPUP ADD SEANCE

const popupSeanceAdd = document.querySelector(".popup__seance_add");
const formAddSeance = document.querySelector(".popup__form_add-seance");
const selectSeanceHall = document.querySelector(".select__add-seance_hall");
let optionHallName;
let optionMovieName;
const selectSeanceMovie = document.querySelector(".select__add-seance_movie");
const inputSeanceTime = document.querySelector(".add-seans__input_time");
let checkedHallId;
let checkedMovieId;
let checkedMovieName;
let checkedMovieDuration;
let checkedSeanceTime;
let seanceCancelButton;

// POPUP DELETE SEANCE
const popupSeanceRemove = document.querySelector(".popup__seance_remove");
let seanceRemoveTitle;
let seanceDeleteButton;
let seanceRemoveCancelButton;

// DELETE SEANCE
let selectSeances;
let selectDelete;

let selectedSeance;
let selectedSeanceId;
let selectTimeline;
let selectedHallId;
let selectedMovieName;

let deletedSeances = [];
let filterDeletedSeances = [];

// GET SEANCE
function loadSeances(data) {
  timelineSeances.forEach(timeline => {
    timeline.innerHTML = "";

    for (let i = 0; i < data.result.seances.length; i++) {
      let movieSeanseId = data.result.films.findIndex(element => element.id === Number(data.result.seances[i].seance_filmid));

      if (Number(timeline.dataset.id) === data.result.seances[i].seance_hallid) {
        timeline.insertAdjacentHTML("beforeend", `
        <div class="timeline__seances_movie" data-filmid="${data.result.seances[i].seance_filmid}" data-seanceid="${data.result.seances[i].id}" draggable="true">
          <p class="timeline__seances_title">${data.result.films[movieSeanseId].film_name}</p>
          <p class="timeline__movie_start" data-duration="${data.result.films[movieSeanseId].film_duration}">${data.result.seances[i].seance_time}</p>
        </div>
        `);
      }
    }

  })


  setMovieBackground();
  positionSeance();
  window.addEventListener("resize", event => {
    positionSeance();
  })

  movieSeancesCancel = document.querySelector(".movie-seances__batton_cancel");

  movieSeancesCancel.addEventListener("click", event => {
    if (movieSeancesCancel.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      deletedSeances.length = 0;
      filterDeletedSeances.length = 0;
      loadSeances(data);

      deleteSeance();

      movieSeancesCancel.classList.add("button_disabled");
      movieSeancesSave.classList.add("button_disabled");
    }
  })
}

// COLOR FILM

function setMovieBackground() {
  const movies = document.querySelectorAll(".movie-seances__movie");
  let movieBackground;
  const moviesInformation = new Array();

  movies.forEach(movie => {
    movieBackground = movie.classList.value.match(/\d+/)[0];

    const movieInfo = new Object();
    movieInfo.movieInfoId = movie.dataset.id;
    movieInfo.background = movieBackground;

    moviesInformation.push(movieInfo);
  })

  timelineMovies = Array.from(document.querySelectorAll(".timeline__seances_movie"));

  timelineMovies.forEach(element => {
    for (let i = 0; i < moviesInformation.length; i++)
      if (Number(element.dataset.filmid) === Number(moviesInformation[i].movieInfoId)) {
        element.classList.add(`background_${moviesInformation[i].background}`);
      }
  })

}

// LIST SEANCES IN TIMELINE
let dayInMinutes = 24 * 60;
let startSeance;
let movieduration;
let movieWidth;
let seancePosition;

function positionSeance() {

  timelineMovies.forEach(item => {
    let time = item.lastElementChild.textContent.split(":", [2]);
    let hours = Number(time[0]);
    let minutes = Number(time[1]);

    startSeance = (hours * 60) + minutes;
    seancePosition = (startSeance / dayInMinutes) * 100;

    movieduration = item.lastElementChild.dataset.duration;
    movieWidth = (movieduration / dayInMinutes) * 100;

    item.style.left = seancePosition + "%";
    item.style.width = movieWidth + "%";

    // CHANGE SIZES
    if (item.dataset.change === "true") {
      item.firstElementChild.style.fontSize = "10px";
      item.style.padding = "10px";
    }

    let movieWidthPx = item.getBoundingClientRect().width;

    if (movieWidthPx < 40) {
      item.firstElementChild.style.fontSize = "8px";
      item.style.padding = "5px";
      item.dataset.change = "true";
    }
  })

}

// DRAG-N-DROP
function openSeancePopup(data) {

  const moviesArray = document.querySelectorAll(".movie-seances__movie");
  const hallsTimelineArray = document.querySelectorAll(".timeline__seances");

  let selectedElement;

  moviesArray.forEach(movie => {
    movie.addEventListener("dragstart", (event) => {
      selectedMovie = movie.dataset.id;
      selectedElement = event.target;
    })
  })

  moviesArray.forEach(movie => {
    movie.addEventListener("dragend", () => {
      selectedElement = undefined;
    })
  })

  hallsTimelineArray.forEach(timeline => {
    timeline.addEventListener("dragover", (event) => {
      event.preventDefault();
    })
  })

  hallsTimelineArray.forEach(timeline => {
    timeline.addEventListener("drop", (event) => {
      event.preventDefault();

      if (selectedElement === undefined) {
        return;
      }

      selectedHall = timeline.dataset.id;

      popupSeanceAdd.classList.remove("popup__hidden");

      selectSeanceHall.innerHTML = "";
      selectSeanceMovie.innerHTML = "";
      formAddSeance.reset();

      // NAME HALL

      for (let i = 0; i < data.result.halls.length; i++) {
        selectSeanceHall.insertAdjacentHTML("beforeend", `
        <option class="option_add-seance hall__name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</option>
        `);
      }

      optionHallName = document.querySelectorAll(".hall__name");

      optionHallName.forEach(hallName => {
        if (Number(hallName.dataset.id) === Number(selectedHall)) {
          hallName.setAttribute("selected", "true");
        }
      })

      // NAME FILM

      for (let i = 0; i < data.result.films.length; i++) {
        selectSeanceMovie.insertAdjacentHTML("beforeend", `
          <option class="option_add-seance movie__name" data-id="${data.result.films[i].id}" data-duration="${data.result.films[i].film_duration}">${data.result.films[i].film_name}</option>
        `);
      }

      optionMovieName = document.querySelectorAll(".movie__name");

      optionMovieName.forEach(movieName => {
        if (Number(movieName.dataset.id) === Number(selectedMovie)) {
          movieName.setAttribute("selected", "true");
        }
      })

    })
  })
}

// ADD SEANCE

let seancesChecked = [];

function clickSeanseAddButton() {
  formAddSeance.addEventListener("submit", (event) => {
    event.preventDefault();
    seancesChecked.length = 0;

    let checkedHall = selectSeanceHall.value;

    optionHallName.forEach(hallName => {
      if (hallName.textContent === checkedHall) {
        checkedHallId = hallName.dataset.id;
      }
    })

    let checkedMovie = selectSeanceMovie.value;

    optionMovieName.forEach(movieName => {
      if (movieName.textContent === checkedMovie) {
        checkedMovieId = movieName.dataset.id;
        checkedMovieName = checkedMovie;
        checkedMovieDuration = movieName.dataset.duration;
      }
    })

    checkedSeanceTime = inputSeanceTime.value;

    let seanceTime = checkedSeanceTime.split(':', [2]);
    seanceTimeStart = Number(seanceTime[0]) * 60 + Number(seanceTime[1]);

    seanceTimeEnd = seanceTimeStart + Number(checkedMovieDuration);

    let lastTime = 23 * 60 + 59;

    if (seanceTimeEnd > lastTime) {
      alert("Последний сеанс должен заканчиваться не позднее 23:59!");
      return;
    }

    timelineSeances = document.querySelectorAll(".timeline__seances");

    timelineSeances.forEach(timeline => {
      if (Number(timeline.dataset.id) === Number(checkedHallId)) {
        hallSeances = Array.from(timeline.querySelectorAll(".timeline__seances_movie"));
      }
    })

    if (hallSeances.length === 0) {
      popupSeanceAdd.classList.add("popup__hidden");
      addNewSeance();
      return;
    }

    for (let seance of hallSeances) {

      currentSeancesDuration = seance.lastElementChild.dataset.duration;

      currentSeancesStart = seance.lastElementChild.textContent;

      let currentSeanceTime = currentSeancesStart.split(':', [2]);
      currentSeanceTimeStart = Number(currentSeanceTime[0]) * 60 + Number(currentSeanceTime[1]);

      currentSeancesTimeEnd = currentSeanceTimeStart + Number(currentSeancesDuration);

      if (seanceTimeStart >= currentSeanceTimeStart && seanceTimeStart <= currentSeancesTimeEnd) {
        alert("Новый сеанс пересекается по времени с существующими!");
        seancesChecked.push("false");
        break;
      } else if (seanceTimeEnd >= currentSeanceTimeStart && seanceTimeEnd <= currentSeancesTimeEnd) {
        alert("Новый сеанс пересекается по времени с существующими!");
        seancesChecked.push("false");
        break;
      } else {
        seancesChecked.push("true");
      }

    }

    if (!seancesChecked.includes("false")) {
      popupSeanceAdd.classList.add("popup__hidden");
      addNewSeance();
    } else {
      return;
    }

  })
}

// ADD SEANCE IN HALL
function addNewSeance() {
  movieSeancesCancel.classList.remove("button_disabled");
  movieSeancesSave.classList.remove("button_disabled");

  timelineSeances.forEach(timeline => {
    if (Number(timeline.dataset.id) === Number(checkedHallId)) {
      timeline.insertAdjacentHTML("beforeend", `
      <div class="timeline__seances_movie" data-filmid="${checkedMovieId}" data-seanceid="" draggable="true">
        <p class="timeline__seances_title">${checkedMovieName}</p>
        <p class="timeline__movie_start" data-duration="${checkedMovieDuration}">${checkedSeanceTime}</p>
      </div>
      `);
    }

  })

  setMovieBackground();

  positionSeance();

  deleteSeance();
}


// DELETE SEANCE FROM HALL
function deleteSeance() {
  selectSeances = document.querySelectorAll(".timeline__seances_movie");

  let selectedElement;

  selectSeances.forEach(seance => {
    seance.addEventListener("dragstart", (event) => {
      selectedSeance = seance;
      selectTimeline = seance.closest(".movie-seances__timeline");
      selectedMovie = seance.dataset.filmid;
      selectedMovieName = seance.firstElementChild.textContent;
      selectedHallId = seance.parentElement.dataset.id;
      selectDelete = selectTimeline.firstElementChild;

      selectDelete.classList.remove("hidden");

      selectedElement = event.target;

      selectDelete.addEventListener("dragover", (event) => {
        event.preventDefault();
      })

      selectDelete.addEventListener("drop", (event) => {
        event.preventDefault();

        popupSeanceRemove.classList.remove("popup__hidden");

        seanceRemoveTitle = document.querySelector(".seance-remove_title");
        seanceRemoveTitle.textContent = selectedMovieName;

        seanceDeleteButton = document.querySelector(".popup__remove-seance_button_delete");

        seanceDeleteButton.addEventListener("click", (e) => {
          e.preventDefault();

          popupSeanceRemove.classList.add("popup__hidden");

          if (selectedSeance.dataset.seanceid !== "") {
            selectedSeanceId = selectedSeance.dataset.seanceid;
            deletedSeances.push(selectedSeanceId);
          }

          selectedSeance.remove();

          filterDeletedSeances = deletedSeances.filter((item, index) => {
            return deletedSeances.indexOf(item) === index;
          });

          if (filterDeletedSeances.length !== 0) {
            movieSeancesCancel.classList.remove("button_disabled");
            movieSeancesSave.classList.remove("button_disabled");
          } else {
            movieSeancesCancel.classList.add("button_disabled");
            movieSeancesSave.classList.add("button_disabled");
          }

        })

      })

    })
  })

  selectSeances.forEach(seance => {
    seance.addEventListener("dragend", () => {
      selectedElement = undefined;
      selectDelete.classList.add("hidden");
    })
  })

}

// GET SEANCES

function seancesOperations(data) {
  timelineSeances = document.querySelectorAll(".timeline__seances");

  loadSeances(data);

  openSeancePopup(data);
  clickSeanseAddButton();

  deleteSeance();
}

// SAVE SEANCES
movieSeancesSave = document.querySelector(".movie-seances__batton_save");

movieSeancesSave.addEventListener("click", event => {
  if (movieSeancesSave.classList.contains("button_disabled")) {
    event.preventDefault();
  } else {
    event.preventDefault();

    const seancesArray = Array.from(document.querySelectorAll(".timeline__seances_movie"));

    seancesArray.forEach(seance => {
      if (seance.dataset.seanceid === "") {
        const params = new FormData();
        params.set("seanceHallid", `${seance.parentElement.dataset.id}`);
        params.set('seanceFilmid', `${seance.dataset.filmid}`);
        params.set('seanceTime', `${seance.lastElementChild.textContent}`);
        addSeances(params);
      }
    })

    // DELETE SEANCES

    if (filterDeletedSeances.length !== 0) {
      filterDeletedSeances.forEach(seance => {
        let seanceId = seance;
        deleteSeances(seanceId);
      })
    }

    alert("Сеансы сохранены!");
    location.reload();
  }
})

// SAVE SEANCE IN DATA
function addSeances(params) {
  fetch("https://shfe-diplom.neto-server.ru/seance", {
    method: "POST",
    body: params
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
    })
}

// DELETE SEANCE FROM DATA
function deleteSeances(seanceId) {
  fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
    })
}