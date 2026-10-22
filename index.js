/* ==================================
   CLOUDFLARE WORKER API
================================== */

const API_BASE =
"https://live-news-api.padduj143.workers.dev";


/* ==================================
   DEFAULT IMAGE
================================== */

const defaultImage =
"https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80";


/* ==================================
   VARIABLES
================================== */

let currentSlide = 0;

let sliderArticles = [];


/* ==================================
   LOAD INDIA NEWS
================================== */

async function loadNews(language = "en") {

    const message =
    document.getElementById("message");

    message.innerText =
    "⏳ Loading latest news...";


    const url =
    `${API_BASE}/api/news?q=India&language=${language}&sortBy=publishedAt&pageSize=12`;


    try {

        const response =
        await fetch(url);

        const data =
        await response.json();

        console.log("API RESPONSE:", data);


        if (!response.ok) {

            message.innerText =
            "❌ API Error: " +
            (data.message || "Something went wrong");

            return;
        }


        if (
            !data.articles ||
            data.articles.length === 0
        ) {

            message.innerText =
            "❌ No news articles found.";

            return;
        }


        message.innerText =
        `🔴 ${data.totalResults} news found`;


        displayNews(data.articles);

        createSlider(data.articles);

        createBreakingNews(data.articles);

    }

    catch(error) {

        console.error(error);

        message.innerText =
        "❌ Unable to connect to News API.";

    }

}


/* ==================================
   DISPLAY NEWS
================================== */

function displayNews(articles) {

    const container =
    document.getElementById("newsContainer");


    container.innerHTML = "";


    articles.forEach(function(article) {

        const image =
        article.urlToImage ||
        defaultImage;


        container.innerHTML += `

        <div class="card">

            <img
                src="${image}"
                alt="News"
                onerror="this.src='${defaultImage}'"
            >

            <div class="content">

                <h2>
                    ${article.title || "News"}
                </h2>

                <p>
                    ${
                        article.description ||
                        "No description available."
                    }
                </p>

                <span class="source">
                    📰 Source:
                    ${article.source?.name || "Unknown"}
                </span>

                <a
                    class="read"
                    href="${article.url}"
                    target="_blank"
                    rel="noopener noreferrer">

                    Read Full News →

                </a>

            </div>

        </div>

        `;

    });

}


/* ==================================
   SEARCH NEWS
================================== */

async function searchNews() {

    const keyword =
    document
    .getElementById("searchInput")
    .value
    .trim();


    if (keyword === "") {

        loadNews();

        return;
    }


    const message =
    document.getElementById("message");


    message.innerText =
    `🔎 Searching for "${keyword}"...`;


    const url =
    `${API_BASE}/api/news?q=${encodeURIComponent(keyword)}&language=en&sortBy=publishedAt&pageSize=12`;


    try {

        const response =
        await fetch(url);

        const data =
        await response.json();


        console.log("SEARCH RESPONSE:", data);


        if (!response.ok) {

            message.innerText =
            "❌ API Error: " +
            (data.message || "Something went wrong");

            return;
        }


        if (
            !data.articles ||
            data.articles.length === 0
        ) {

            message.innerText =
            `❌ No news found for "${keyword}"`;


            document.getElementById(
                "newsContainer"
            ).innerHTML = "";

            return;
        }


        message.innerText =
        `🔎 Results for "${keyword}"`;


        displayNews(data.articles);

        createSlider(data.articles);

        createBreakingNews(data.articles);

    }

    catch(error) {

        console.error(error);

        message.innerText =
        "❌ Search failed.";

    }

}


/* ==================================
   CATEGORY SEARCH
================================== */

async function loadCategory(keyword) {

    document.getElementById(
        "searchInput"
    ).value = keyword;

    await searchNews();

}


/* ==================================
   CREATE SLIDER
================================== */

function createSlider(articles) {

    sliderArticles =
    articles.slice(0, 5);

    currentSlide = 0;


    const container =
    document.getElementById(
        "sliderContainer"
    );


    const dots =
    document.getElementById("dots");


    container.innerHTML = "";

    dots.innerHTML = "";


    sliderArticles.forEach(
        function(article, index) {

            const image =
            article.urlToImage ||
            defaultImage;


            container.innerHTML += `

                <div
                    class="slide
                    ${index === 0 ? "active" : ""}">

                    <img
                        src="${image}"
                        alt="News"
                        onerror="this.src='${defaultImage}'"
                    >

                    <div class="slide-content">

                        <h2>
                            ${
                                article.title ||
                                "Latest News"
                            }
                        </h2>

                        <p>
                            ${
                                article.description ||
                                ""
                            }
                        </p>

                    </div>

                </div>

            `;


            dots.innerHTML += `

                <span
                    class="dot
                    ${index === 0 ? "active" : ""}"
                    onclick="showSlide(${index})">
                </span>

            `;

        }
    );


    showSlide(0);

}


/* ==================================
   SHOW SLIDE
================================== */

function showSlide(index) {

    const slides =
    document.querySelectorAll(
        ".slide"
    );


    const dots =
    document.querySelectorAll(
        ".dot"
    );


    if (slides.length === 0) {

        return;

    }


    if (index >= slides.length) {

        currentSlide = 0;

    }

    else if (index < 0) {

        currentSlide =
        slides.length - 1;

    }

    else {

        currentSlide = index;

    }


    slides.forEach(
        function(slide) {

            slide.classList.remove(
                "active"
            );

        }
    );


    dots.forEach(
        function(dot) {

            dot.classList.remove(
                "active"
            );

        }
    );


    slides[currentSlide]
    .classList.add("active");


    if (dots[currentSlide]) {

        dots[currentSlide]
        .classList.add("active");

    }

}


/* ==================================
   NEXT SLIDE
================================== */

function nextSlide() {

    showSlide(
        currentSlide + 1
    );

}


/* ==================================
   PREVIOUS SLIDE
================================== */

function previousSlide() {

    showSlide(
        currentSlide - 1
    );

}


/* ==================================
   AUTO SLIDER
================================== */

setInterval(
    function() {

        nextSlide();

    },
    5000
);


/* ==================================
   BREAKING NEWS
================================== */

function createBreakingNews(articles) {

    const breakingText =
    document.getElementById(
        "breakingText"
    );


    if (!breakingText) {

        return;

    }


    if (!articles || articles.length === 0) {

        return;

    }


    let text =
    "🔴 BREAKING NEWS: ";


    articles
    .slice(0, 5)
    .forEach(function(article) {

        text +=
        (article.title || "Latest News") +
        "   |   ";

    });


    breakingText.innerText =
    text;

}


/* ==================================
   VOICE COMMAND
================================== */

function startVoice() {

    const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Voice recognition is not supported. Use Google Chrome."
        );

        return;

    }


    const recognition =
    new SpeechRecognition();


    recognition.lang =
    "en-IN";


    recognition.start();


    document.getElementById(
        "message"
    ).innerText =
    "🎙️ Listening...";


    recognition.onresult =
    function(event) {

        const command =
        event
        .results[0][0]
        .transcript
        .toLowerCase();


        console.log(
            "Voice command:",
            command
        );


        document.getElementById(
            "message"
        ).innerText =
        "🎙️ You said: " + command;


        if (
            command.includes("sports") ||
            command.includes("cricket")
        ) {

            loadCategory("cricket");

        }


        else if (
            command.includes("technology") ||
            command.includes("tech")
        ) {

            loadCategory("technology");

        }


        else if (
            command.includes("entertainment") ||
            command.includes("movie")
        ) {

            loadCategory("movies");

        }


        else if (
            command.includes("india") ||
            command.includes("national")
        ) {

            loadCategory("India");

        }


        else if (
            command.includes("next")
        ) {

            nextSlide();

        }


        else if (
            command.includes("previous") ||
            command.includes("back")
        ) {

            previousSlide();

        }


        else {

            document.getElementById(
                "searchInput"
            ).value = command;

            searchNews();

        }

    };


    recognition.onerror =
    function(error) {

        console.log(error);

        document.getElementById(
            "message"
        ).innerText =
        "❌ Voice recognition error.";

    };

}


/* ==================================
   LANGUAGE CHANGE
================================== */

function changelanguage() {
    let language=
    document.getElementById("language").value
    if(language=="en"){
        document.getElementById("text").innerHTML="latest news";
        loadNews(language);
        }
        else if (language =="te"){
            document.getElementById("text").innerHTML="latest news";
            loadNews(language);
        }
        else if(language == "hi"){
            document.getElementById("text").innerHTML="latest news";
            loadNews(language);
        }
 }




/* ==================================
   ENTER KEY SEARCH
================================== */

const searchInput =
document.getElementById(
    "searchInput"
);


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                searchNews();

            }

        }
    );

}


/* ==================================
   START WEBSITE
================================== */

loadNews();