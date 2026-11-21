document.addEventListener("DOMContentLoaded", () => {

    // ==================================
    // 1. OUR CALENDAR
    // ==================================

    const calendarGrid = document.getElementById("calendarGrid");
    const monthTitle = document.getElementById("monthTitle");
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");

    const selectedDate = document.getElementById("selectedDate");
    const eventTitle = document.getElementById("eventTitle");
    const eventNote = document.getElementById("eventNote");
    const saveEvent = document.getElementById("saveEvent");
    const eventList = document.getElementById("eventList");

    let currentDate = new Date(2026, 10, 21);
    let selectedDay = null;

    let events = JSON.parse(localStorage.getItem("loveEvents")) || [];

    const specialDates = [
        { date: "2026-07-21", title: "Our Anniversary ♡" }
    ];

    function formatDate(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    function renderCalendar() {

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        monthTitle.textContent = currentDate.toLocaleDateString(
            "en-US",
            { month: "long", year: "numeric" }
        );

        calendarGrid.innerHTML = "";

        // Weekday headings
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        weekdays.forEach(day => {
            const heading = document.createElement("div");
            heading.className = "calendar-day-name";
            heading.textContent = day;
            calendarGrid.appendChild(heading);
        });

        // Empty spaces before first date
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            empty.className = "calendar-empty";
            calendarGrid.appendChild(empty);
        }

        // Calendar dates
        for (let day = 1; day <= lastDate; day++) {

            const dateKey = formatDate(year, month, day);

            const cell = document.createElement("button");
            cell.type = "button";
            cell.className = "calendar-date";
            cell.textContent = day;

            const today = new Date();

            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                cell.classList.add("today");
            }

            if (selectedDay === dateKey) {
                cell.classList.add("selected");
            }

            if (specialDates.some(item => item.date === dateKey)) {
                cell.classList.add("special-date");
                cell.title = "Our Special Day ♡";
            }

            if (events.some(item => item.date === dateKey)) {
                cell.classList.add("has-event");
            }

            cell.addEventListener("click", () => {
                selectedDay = dateKey;

                selectedDate.textContent = new Date(
                    year, month, day
                ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                });

                eventTitle.value = "";
                eventNote.value = "";

                renderCalendar();
                renderEvents();
            });

            calendarGrid.appendChild(cell);
        }

        renderEvents();
    }

    prevMonth.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    // Save Calendar Event
    saveEvent.addEventListener("click", () => {

        if (!selectedDay) {
            alert("Please choose a date first ♡");
            return;
        }

        const title = eventTitle.value.trim();
        const note = eventNote.value.trim();

        if (!title) {
            alert("Please enter a special day title.");
            return;
        }

        events.push({
            id: Date.now(),
            date: selectedDay,
            title: title,
            note: note
        });

        localStorage.setItem("loveEvents", JSON.stringify(events));

        eventTitle.value = "";
        eventNote.value = "";

        renderCalendar();

        alert("Your special day has been saved ♡");
    });

    // Show saved events
    function renderEvents() {

        eventList.innerHTML = "";

        const filteredEvents = events.filter(
            item => item.date === selectedDay
        );

        if (!selectedDay) {
            eventList.textContent = "Choose a date to see your memories ♡";
            return;
        }

        if (filteredEvents.length === 0) {
            eventList.textContent = "No special events yet ♡";
            return;
        }

        filteredEvents.forEach(item => {

            const card = document.createElement("div");
            card.className = "event-card";

            const heading = document.createElement("h4");
            heading.textContent = item.title;

            const note = document.createElement("p");
            note.textContent = item.note;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", () => {

                events = events.filter(event => event.id !== item.id);

                localStorage.setItem(
                    "loveEvents",
                    JSON.stringify(events)
                );

                renderCalendar();
            });

            card.append(heading, note, deleteButton);
            eventList.appendChild(card);
        });
    }

    renderCalendar();

// ==================================
// 2. OUR YOUTUBE MUSIC PLAYER
// ==================================

const songTitle = document.getElementById("songTitle");
const previousSong = document.getElementById("previousSong");
const nextSong = document.getElementById("nextSong");
const toggleMusic = document.getElementById("toggleMusic");
const songList = document.getElementById("songList");
const musicDisc = document.querySelector(".music-disc");
const songs = [
    {
        title: "Forever and Ever and Always",
        artist: "Ryan Mack",
        id: "Aj4Vim6cpao"
    },
    {
        title: "Make You Mine",
        artist: "PUBLIC",
        id: "tB48sKGi5ag"
    }
];

let currentSong = 0;
let youtubePlayer = null;
let playerReady = false;

const musicSongListEl = document.getElementById("songList");
const musicSongTitleEl = document.getElementById("songTitle");
const musicDiscEl = document.querySelector(".music-disc");
const musicPlayBtn = document.getElementById("toggleMusic");
const musicPrevBtn = document.getElementById("previousSong");
const musicNextBtn = document.getElementById("nextSong");

function renderSongList() {
    musicSongListEl.innerHTML = "";

    songs.forEach((song, index) => {
        const button = document.createElement("button");
        button.className = "song-item";
        button.textContent = `${index + 1}. ${song.title} — ${song.artist}`;

        if (index === currentSong) {
            button.classList.add("active-song");
        }

        button.addEventListener("click", () => {
            if (!playerReady) return;

            currentSong = index;
            youtubePlayer.loadVideoById(songs[currentSong].id);
            updateSongInfo();
        });

        musicSongListEl.appendChild(button);
    });
}

function updateSongInfo() {
    musicSongTitleEl.textContent = songs[currentSong].title;
    renderSongList();
}

function playSelectedSong(index) {
    if (!playerReady) return;

    currentSong = (index + songs.length) % songs.length;

    youtubePlayer.loadVideoById(songs[currentSong].id);
    updateSongInfo();
}

window.onYouTubeIframeAPIReady = function () {
    youtubePlayer = new YT.Player("youtubePlayer", {
        height: "225",
        width: "100%",
        videoId: songs[0].id,
        playerVars: {
            playsinline: 1,
            controls: 1,
            rel: 0
        },
        events: {
            onReady: function () {
                playerReady = true;
                updateSongInfo();
            },

            onStateChange: function (event) {
                if (event.data === YT.PlayerState.PLAYING) {
                    musicDiscEl.classList.add("playing");
                    musicPlayBtn.textContent = "Ⅱ";
                }

                if (
                    event.data === YT.PlayerState.PAUSED ||
                    event.data === YT.PlayerState.ENDED
                ) {
                    musicDiscEl.classList.remove("playing");
                    musicPlayBtn.textContent = "▶";
                }
            },

            onError: function (event) {
                alert("YouTube Error Code: "+ event.data);
            }
        }
    });
};

musicPlayBtn.addEventListener("click", () => {
    if (!playerReady) return;

    const state = youtubePlayer.getPlayerState();

    if (state === YT.PlayerState.PLAYING) {
        youtubePlayer.pauseVideo();
    } else {
        youtubePlayer.playVideo();
    }
});

musicPrevBtn.addEventListener("click", () => {
    playSelectedSong(currentSong - 1);
});

musicNextBtn.addEventListener("click", () => {
    playSelectedSong(currentSong + 1);
});

renderSongList();

const youtubeScript = document.createElement("script");
youtubeScript.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(youtubeScript);
document.head.appendChild(youtubeScript);

// ==================================
// 3. OUR ANNIVERSARY COUNTER
// ==================================

const startDate = new Date(2026, 6, 21);
const today = new Date();

today.setHours(0, 0, 0, 0);

let months =
    (today.getFullYear() - startDate.getFullYear()) * 12 +
    (today.getMonth() - startDate.getMonth());

let lastAnniversary = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + months,
    startDate.getDate()
);

if (today < lastAnniversary) {
    months--;
    lastAnniversary = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + months,
        startDate.getDate()
    );
}

const extraDays = Math.floor(
    (today - lastAnniversary) / 86400000
);

const totalDays = Math.floor(
    (today - startDate) / 86400000
);

document.getElementById("anniversaryMonths").textContent = months;
document.getElementById("anniversaryDays").textContent = extraDays;
document.getElementById("togetherDays").textContent = totalDays;

});
