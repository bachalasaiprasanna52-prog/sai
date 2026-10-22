
function welcomeMessage() {

    alert(
        "🛕 Welcome to Puri Tourism!\n\n" +
        "Explore Jagannath Temple, Puri Beach and Konark."
    );

}


function templeInfo() {

    alert(
        "🛕 Shri Jagannath Temple\n\n" +
        "Puri Jagannath Temple is one of the important " +
        "pilgrimage destinations in Odisha.\n\n" +
        "It is famous for Lord Jagannath, Rath Yatra " +
        "and Mahaprasad."
    );

}


function placeInfo(place) {

    alert(
        "You selected: " + place +
        "\n\nEnjoy your visit! 🌴"
    );

}


function planTrip() {

    let name = prompt("Enter your name:");

    if (name != null && name != "") {

        alert(
            "🙏 Thank you, " + name +
            "!\n\nYour Puri trip planning has started."
        );

    } else {

        alert("Please enter your name.");

    }

}
