// firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC4ygtft0BU4qkF_kVWv3a6etBqbaloT_s",
  authDomain: "fitmeasure-ac726.firebaseapp.com",
  databaseURL: "https://fitmeasure-ac726.firebaseio.com",
  projectId: "fitmeasure-ac726",
  storageBucket: "fitmeasure-ac726.appspot.com",
  messagingSenderId: "1020504775390",
  appId: "1:1020504775390:web:6d8432d029a3e540b6004f",
  measurementId: "G-ZBXQWMKM2J",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var userId;
const getRemaining = (countDownDate) => {
  // Get today's date and time
  var now = new Date().getTime();
  // Find the distance between now and the count down date
  var distance = countDownDate + 86400000 - now;
  if (distance < 0) {
    return false;
  }
  // return true;
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  if (hours == 0 && minutes == 0) return false;
  hours == 0
    ? (hours = ``)
    : hours == 1
    ? (hours = `${hours} hour `)
    : (hours = `${hours} hours `);
  minutes == 0
    ? (minutes = ``)
    : minutes == 1
    ? (minutes = `${minutes} minutes `)
    : (minutes = `${minutes} minutes `);

  return hours + minutes;
};

function createId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Challenge page
const getChallenges = async () => {
  const snapshot = await db.collection("challenges").orderBy("createdAt").get();
  const challenges = snapshot.docs.map((doc) => doc.data());

  var create = el(
    ".text-center",
    { style: { marginTop: "1vh" } },
    el("button.btn btn-info", {
      innerHTML: `<i class="fas fa-plus" style="margin-right: 5px"></i>Create a challenge`,
      "data-toggle": "modal",
      "data-target": "#exampleModal",
      style: {
        width: "95%",
      },
    })
  );
  var cards = el("");
  setChildren(document.getElementById("challenges1"), create);
  challenges.reverse().forEach((challenge) => {
    const remaining = getRemaining(challenge.createdAt);
    joinButton = el("button.btn btn-success float-right", {
      innerText: "Joined",
      disabled: true,
    });
    if (remaining) {
      window.ch = challenge;
      var joinButton;
      if (!challenge.participants[userId])
        joinButton = el("button.btn btn-primary float-right", {
          innerText: "Join",
          onclick: () => {
            db.collection("challenges")
              .doc(challenge.id)
              .update({
                participants: {
                  ...challenge.participants,
                  [userId]: { score: 0 },
                },
              });
            document
              .getElementById(challenge.id)
              .children[0].children[0].children[0].remove();
            document
              .getElementById(challenge.id)
              .children[0].children[0].appendChild(
                el("button.btn btn-success float-right", {
                  innerText: "Joined",
                  disabled: true,
                })
              );
          },
        });
      if (
        Object.keys(ch.participants).length == 10 &&
        !challenge.participants[userId]
      )
        joinButton = el("button.btn btn-danger float-right", {
          innerText: "Full",
          disabled: true,
        });

      const card = el(
        ".card mx-auto",
        { id: challenge.id },
        el(
          ".card-body bg-light",
          el(".card-title large", { innerText: challenge.title }, joinButton),
          el("p.card-text", { innerText: remaining })
        )
      );
      cards.appendChild(card);
    }
    // setTimer(challenge.id, challenge.createdAt);
  });

  setChildren(document.getElementById("challenges"), cards);
};
// getChallenges();

function checkforms() {
  // get all the inputs within the submitted form
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    // only validate the inputs that have the required attribute
    if (inputs[i].hasAttribute("required")) {
      if (inputs[i].value == "") {
        // found an empty field that is required
        alert("Please fill all required fields");
        return false;
      }
    }
  }
  return true;
}

const submit = () => {
  const check = checkforms();
  if (!check) return;
  const challengeId = createId(16);

  var now = new Date().getTime();
  const formValues = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
  };
  db.collection("challenges")
    .doc(challengeId)
    .set({
      ...formValues,
      createdBy: userId,
      participants: { [userId]: { score: 0 } },
      id: challengeId,
      createdAt: now,
    });
  const joinButton = el("button.btn btn-success float-right", {
    innerText: "Joined",
    disabled: true,
  });
  const card = el(
    ".card mx-auto",
    { id: challengeId },
    el(
      ".card-body bg-light",
      el(".card-title large", { innerText: formValues.title }, joinButton),
      el("p.card-text", { innerText: getRemaining(now) })
    )
  );
  document.getElementById("challenges").prepend(card);
  document.getElementById("exampleModal").click();
  // setTimer(challengeId, now);
};

const getLeaderBoard = async () => {
  const snapshot = await db.collection("leaderboard").orderBy("score").get();
  const leaderboard = snapshot.docs.map((doc) => doc.data());
  window.leaderboard = leaderboard;
  var tbody = el("tbody");
  var table = el(
    "table.table text-center text-nowrap",
    el(
      "thead",
      el(
        "tr",
        el("th", { scope: "col", innerText: "Place" }),
        el("th", { scope: "col", innerText: "Nickname" }),
        el("th", { scope: "col", innerText: "Overall Score" })
      )
    ),
    tbody
  );
  var i = 0;
  var rank;
  leaderboard.reverse().forEach((user) => {
    i += 1;
    var className = "";
    if (user.userId == userId) {
      className = "#me";
      rank = i;
    }
    tbody.appendChild(
      el(
        `tr${className}`,
        el("th", { scope: "row", innerText: i }),
        el("td", { innerText: user.nickname }),
        el("td", { innerText: user.score })
      )
    );
  });
  setChildren(
    document.getElementById("challenges1"),
    el("h4.text-center", {
      style: { paddingTop: "3vh", marginBottom: "0" },
      innerText: `Your rank is ${rank}`,
    })
  );
  setChildren(document.getElementById("challenges"), table);
};

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

const loginScreen = () => {
  document.getElementById("root").hidden = true;
  document.getElementById("navigation").hidden = true;
  document.getElementById("info").hidden = false;
};

const Router = (ref) => {
  if (!getCookie("userId")) return loginScreen();
  if (!ref) ref = "chal";

  var elems = document.querySelectorAll(".nav__link--active");
  [].forEach.call(elems, function (el) {
    el.classList.remove("nav__link--active");
  });
  switch (ref) {
    case "lead":
      getLeaderBoard();
      break;
    case "chal":
      getChallenges();
  }
  document.getElementById(ref).classList.add("nav__link--active");
  //   history.pushState({}, ref, ref);
};

//setTimer for challenges

function setTimer(i, countDownDate) {
  // Set the date we're counting down to
  // var countDownDate = new Date("Jan 5, 2021 15:37:25").getTime();

  // Update the count down every 1 second
  var x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now + 86400000;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    var elem = $("#" + i).find(".card-text")[0];
    elem.innerText =
      hours + "h " + minutes + "m " + seconds + "s " + "remaining";

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      elem.innerText = "FINISHED";
      // document.getElementById("active"+i).removeClass('active').addClass('finished')
    }
  }, 1000);
}

async function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  userId = profile.getId();
  console.log(userId);
  var entry = await db.collection("users").doc(userId);
  console.log(entry.data);
  if (!entry.data) {
    db.collection("users").doc(userId).set({
      name: profile.getName(),
      imgUrl: profile.getImageUrl(),
    });
  }
  setCookie("userId", userId, 160);
  document.getElementById("root").hidden = false;
  document.getElementById("navigation").hidden = false;
  document.getElementById("info").hidden = true;
  getChallenges();
}

function eraseCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out.");
  });
  eraseCookie("userId");
  userId = "";
  Router();
}
