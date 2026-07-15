/*
=================================================
 Ya! Music Chris
 Official Music Player
 app.js
=================================================
*/


const SONGS_URL =
"https://yamusicchris.github.io/songs.json";


let songs = [];

let currentIndex = 0;

let isPlaying = false;



const audio = new Audio();

audio.preload = "metadata";





// =================================
// ELEMENTOS
// =================================


const songsContainer =
document.getElementById("songs");


const playerCover =
document.getElementById("player-cover");


const playerTitle =
document.getElementById("player-title");


const playerArtist =
document.getElementById("player-artist");


const playButton =
document.getElementById("play-btn");


const nextButton =
document.getElementById("next-btn");


const prevButton =
document.getElementById("prev-btn");


const progress =
document.getElementById("progress");


const currentTime =
document.getElementById("current-time");


const duration =
document.getElementById("duration");


const volume =
document.getElementById("volume");





// =================================
// ICONOS
// =================================


const ICON_PLAY =
"https://yamusicchris.github.io/icons-repro/play.png";


const ICON_PAUSE =
"https://yamusicchris.github.io/icons-repro/pause.png";







// =================================
// MEDIA SESSION API
// =================================


function updateMediaSession(song){


    if(!("mediaSession" in navigator))

        return;



    navigator.mediaSession.metadata =

    new MediaMetadata({

        title:song.title,

        artist:song.artist,

        album:"Ya! Music Chris",

        artwork:[

            {

                src:song.cover,

                sizes:"512x512",

                type:"image/png"

            }

        ]

    });



}







// =================================
// CARGAR CANCIONES
// =================================


async function loadSongs(){


    try{


        const response =
        await fetch(SONGS_URL);



        if(!response.ok){

            throw new Error(
            "No se pudo cargar songs.json"
            );

        }



        songs =
        await response.json();



        renderSongs();


    }


    catch(error){


        console.error(
        error
        );


    }


}







// =================================
// CREAR LISTA
// =================================


function renderSongs(){


    songsContainer.innerHTML="";



    songs.forEach((song,index)=>{


        const card =
        document.createElement("div");



        card.className =
        "song-card";



        card.dataset.index =
        index;



        card.innerHTML = `


        <img

        class="song-cover"

        src="${song.cover}"

        loading="lazy"

        alt="${song.title}">





        <div class="song-info">


            <div class="song-title">

                ${song.title}

            </div>



            <div class="song-artist">

                ${song.artist}

            </div>


        </div>


        `;



        card.onclick = ()=>{


            playSong(index);


        };



        songsContainer.appendChild(card);



    });


}
// =================================
// REPRODUCIR CANCION
// =================================


function playSong(index){


    if(!navigator.onLine){

        showOfflineMessage();

        return;

    }



    currentIndex = index;



    const song = songs[index];



    audio.src = song.audio;



    audio.play()

    .then(()=>{


        isPlaying = true;


        navigator.mediaSession.playbackState =
        "playing";


        updatePlayIcon();



    })


    .catch(error=>{


        console.error(error);


        showAudioError();


    });



    updatePlayer(song);


    highlightSong();


}







// =================================
// ACTUALIZAR INFORMACION
// =================================


function updatePlayer(song){


    playerCover.src =
    song.cover;



    playerTitle.textContent =
    song.title;



    playerArtist.textContent =
    song.artist;



    updateMediaSession(song);



}








// =================================
// PLAY / PAUSE
// =================================


playButton.onclick = ()=>{


    if(!audio.src)

        return;



    if(isPlaying){


        audio.pause();



        isPlaying=false;



        navigator.mediaSession.playbackState =
        "paused";


    }


    else{


        audio.play();



        isPlaying=true;



        navigator.mediaSession.playbackState =
        "playing";


    }



    updatePlayIcon();



};







function updatePlayIcon(){


    playButton.innerHTML = `

    <img src="${
    isPlaying
    ?
    ICON_PAUSE
    :
    ICON_PLAY
    }">

    `;


}








// =================================
// SIGUIENTE
// =================================


nextButton.onclick = ()=>{


    currentIndex++;



    if(currentIndex >= songs.length){


        currentIndex = 0;


    }



    playSong(currentIndex);



};








// =================================
// ANTERIOR
// =================================


prevButton.onclick = ()=>{


    currentIndex--;



    if(currentIndex < 0){


        currentIndex =
        songs.length - 1;


    }



    playSong(currentIndex);



};








// =================================
// PROGRESO
// =================================


audio.addEventListener(
"timeupdate",
()=>{


    if(!audio.duration)

        return;



    progress.value =


    (
        audio.currentTime /
        audio.duration

    ) * 100;




    currentTime.textContent =

    formatTime(
    audio.currentTime
    );



    duration.textContent =

    formatTime(
    audio.duration
    );



});






progress.oninput = ()=>{


    if(audio.duration){


        audio.currentTime =


        (
            progress.value / 100

        )

        *

        audio.duration;


    }


};









// =================================
// VOLUMEN
// =================================


volume.oninput = ()=>{


    audio.volume =

    volume.value / 100;


};



audio.volume = 1;








// =================================
// FINAL DE CANCION
// =================================


audio.onended = ()=>{


    nextButton.click();


};








// =================================
// ERRORES
// =================================


audio.onerror = ()=>{


    showAudioError();


};





function showAudioError(){


    alert(

    "⚠️ No se pudo cargar esta canción."

    );


}








// =================================
// FORMATO TIEMPO
// =================================


function formatTime(seconds){


    if(isNaN(seconds))

        return "0:00";



    const min =

    Math.floor(seconds / 60);



    const sec =

    Math.floor(seconds % 60)

    .toString()

    .padStart(2,"0");



    return `${min}:${sec}`;


}








// =================================
// CANCION ACTIVA
// =================================


function highlightSong(){


    document
    .querySelectorAll(".song-card")
    .forEach(card=>{


        card.classList.remove(
        "active"
        );


    });



    const active =

    document.querySelector(

    `[data-index="${currentIndex}"]`

    );



    if(active){


        active.classList.add(
        "active"
        );


    }


}








// =================================
// MEDIA SESSION CONTROLES
// =================================


if("mediaSession" in navigator){



    navigator.mediaSession.setActionHandler(

    "play",

    ()=>{


        audio.play();



        isPlaying = true;



        navigator.mediaSession.playbackState =
        "playing";



        updatePlayIcon();


    });



    navigator.mediaSession.setActionHandler(

    "pause",

    ()=>{


        audio.pause();



        isPlaying = false;



        navigator.mediaSession.playbackState =
        "paused";



        updatePlayIcon();


    });





    navigator.mediaSession.setActionHandler(

    "nexttrack",

    ()=>{


        nextButton.click();


    });





    navigator.mediaSession.setActionHandler(

    "previoustrack",

    ()=>{


        prevButton.click();


    });





    navigator.mediaSession.setActionHandler(

    "seekbackward",

    ()=>{


        audio.currentTime -= 10;


    });





    navigator.mediaSession.setActionHandler(

    "seekforward",

    ()=>{


        audio.currentTime += 10;


    });



}








// =================================
// SIN INTERNET
// =================================


window.addEventListener(

"offline",

()=>{


    showOfflineMessage();


});






window.addEventListener(

"online",

()=>{


    hideOfflineMessage();


});







function showOfflineMessage(){


    let message =

    document.getElementById(

    "offline-message"

    );



    if(!message){


        message =

        document.createElement(
        "div"
        );



        message.id =
        "offline-message";



        message.innerHTML =

        `
        ⚠️ Sin conexión a Internet
        `;



        document.body.appendChild(
        message
        );


    }


}





function hideOfflineMessage(){


    const message =

    document.getElementById(

    "offline-message"

    );



    if(message){


        message.remove();


    }


}








// =================================
// CALIDAD DE RED
// =================================


function checkNetworkSpeed(){


    const connection =

    navigator.connection ||

    navigator.mozConnection ||

    navigator.webkitConnection;



    if(!connection)

        return;



    hideNetworkWarning();



    if(

    connection.effectiveType === "slow-2g" ||

    connection.effectiveType === "2g"

    ){


        showNetworkWarning(

        "⚠️ Tu red es débil.<br>Puede haber problemas en tu musica"

        );


    }


    else if(

    connection.effectiveType === "3g"

    ){


        showNetworkWarning(

        "⚠️ Tu red es lenta.<br>Puede demorar un poco tu musica"

        );


    }


}







function showNetworkWarning(text){


    let warning =

    document.getElementById(

    "network-warning"

    );



    if(!warning){


        warning =

        document.createElement(
        "div"
        );



        warning.id =
        "network-warning";



        document.body.appendChild(
        warning
        );


    }



    warning.innerHTML =
    text;


}






function hideNetworkWarning(){


    const warning =

    document.getElementById(

    "network-warning"

    );



    if(warning){


        warning.remove();


    }


}







if(navigator.connection){


    navigator.connection.addEventListener(

    "change",

    checkNetworkSpeed

    );


}



checkNetworkSpeed();








// =================================
// INICIO
// =================================


loadSongs();