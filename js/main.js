let audio = document.querySelector(".quranPlayer"),
  surahsContainer = document.querySelector(".surahs"),
  ayah = document.querySelector(".ayah"),
  next = document.querySelector(".next"),
  play = document.querySelector(".play"),
  prev = document.querySelector(".prev");
  getSurahs();


//==========================> Dark mode
var darkMode = document.getElementById("dark-change");

// Fix the function name
function darkmode() {
  var content = document.body;
  var darkModeLabel = document.getElementById("dark-change");
  darkModeLabel.classList.toggle("active");
  content.classList.toggle("night");

  var theme = content.classList.contains("night") ? "DARK" : "LIGHT";

  // Save to localStorage
  localStorage.setItem("pageTheme", JSON.stringify(theme));
}

// Retrieve and apply the theme from localStorage
var getTheme = JSON.parse(localStorage.getItem("pageTheme"));
console.log(getTheme);

if (getTheme === "DARK") {
  document.body.classList.add("night");
  darkModeLabel.classList.add("active");
}

//===========================> getSurahs
function getSurahs(searchQuery = "") {
  // Fetch to get Surahs data
  fetch("https://quran-endpoint.vercel.app/quran")
    .then((response) => response.json())
    .then((data) => {
      // Clear previous content in surahsContainer
      surahsContainer.innerHTML = "";

      for (let surah in data.data) {
        // Check if the current surah matches the search query
        if (
          data.data[surah].asma.ar.long
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          data.data[surah].asma.en.long
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        ) {
          surahsContainer.innerHTML += `
            <div class="rounded-2 p-2 my-3 d-flex justify-content-between mb-2 ">
                <p class="my-2">${data.data[surah].asma.ar.long}</p>
                <p class="my-2">${data.data[surah].asma.en.long}</p>
            </div>
          `;
        }
      }
      //select all surahs
      let allSurahs = document.querySelectorAll(".surahs div");
      let ayahsAudios, ayahsText;
      allSurahs.forEach((surah, index) => {
        surah.addEventListener("click", function () {
          fetch(`https://quran-endpoint.vercel.app/quran/${index + 1}`)
            .then((response) => response.json())
            .then((data) => {
              let verses = data.data.ayahs;
              (ayahsAudios = []), (ayahsText = []);
              verses.forEach((verses) => {
                ayahsAudios.push(verses.audio.url);
                ayahsText.push(verses.text.ar);
              });
              let ayahIndex = 0;
              changeAyah(ayahIndex);
              audio.addEventListener("ended", () => {
                ayahIndex++;
                if (ayahIndex < ayahsAudios.length) {
                  changeAyah(ayahIndex);
                  // console.log(ayahIndex);
                } else {
                  ayahIndex = 0;
                  changeAyah();
                  audio.pause();
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Surah has been ended",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  isPlaying = true;
                  togglePlay();
                }
              });
              //Handle Next And Prev
              next.addEventListener("click", () => {
                ayahIndex < ayahsAudios.length - 1
                  ? ayahIndex++
                  : (ayahIndex = 0);
                changeAyah(ayahIndex);
              });
              prev.addEventListener("click", () => {
                ayahIndex == 0
                  ? (ayahIndex = ayahsAudios.length - 1)
                  : ayahIndex--;
                changeAyah(ayahIndex);
              });
              //Handell Play and Pause Audio
              let isPlaying = false;
              togglePlay();
              function togglePlay() {
                if (isPlaying) {
                  audio.pause();
                  play.innerHTML = `<i class="fas fa-play"></i>`;
                  isPlaying = false;
                } else {
                  audio.play();
                  play.innerHTML = `<i class="fa-solid fa-pause"></i>`;
                  isPlaying = true;
                }
              }
              play.addEventListener("click", togglePlay);
              function changeAyah(index) {
                audio.src = ayahsAudios[index];
                ayah.innerHTML = ayahsText[index];
              }
            });
        });
      });
    });
}

//====================================> search
let search = document.getElementById("search");

search.addEventListener("input", function (e) {
  // Call getSurahs with the value of the search input
  getSurahs(e.target.value);
});
