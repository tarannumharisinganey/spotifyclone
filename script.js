console.log("hi")
let currentsong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder){
    
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML +`<li> 
        
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>tarannum</div>
                            </div>
                            <div class="playnow">
                                <div>playnow</div>
                                <img class="invert" src="playnow.svg" alt=""></div>

        </li>`
        
    }
    //attacch eventlistner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element =>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
       
    })
     
return songs

}
const playMusic = (track, pause=false) => {
    //let audio =new Audio("/songs/" + track)
    currentsong.src = `/${currfolder}/` + track;
    if(!pause){
        currentsong.play();
        play.src = "pause.svg"
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML ="00:00 / 00:00"

    
}

async function displayalbums()
{
    let a = await fetch(`/songs/`)
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
                let folder = e.href.split("/").slice(-2)[0]
                let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json()
            cardcontainer.innerHTML = cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card">
                <div  class="play">
                    
                    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" stroke="green" stroke-width="4" fill="green"/>
                        <polygon points="40,30 70,50 40,70" fill="white"/>
                    </svg>
                     
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            
        })
    })
    

}

//load the polaylist when card is clicked




async function main()
{
    
    await getsongs("songs/noncp")
    playMusic(songs[0],true)
    console.log(songs)

    //display all abums on page
    displayalbums()
   
//attach event listner to play next and prev
    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "pause.svg"
        } 
        else
        {
            currentsong.pause()
            play.src = "speaker.svg"
        }
    })
    

    
//listen for time update event
currentsong.addEventListener("timeupdate", ()=> {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML =`${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100+"%"
})

//add eventlistner to seek bar
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left=percent + "%"
    currentsong.currentTime=((currentsong.duration)*percent)/100
})

//add event listner for hamburger
document.querySelector(".hamburger").addEventListener("click",() =>{
    document.querySelector(".left").style.left ="0"

})

document.querySelector(".close").addEventListener("click",() =>{
    document.querySelector(".left").style.left = "-100%"

})
previous.addEventListener("click", ()=>{
console.log("clickedp")
console.log(currentsong)
let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0] )
if((index-1)>=0){
    playMusic(songs[index-1])
    }
})
next.addEventListener("click", ()=>{
    console.log("clickedn")
    currentsong.pause();
let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0] )
    
    
    if((index+1)< songs.length){
    playMusic(songs[index+1])
    }
})

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentsong.volume =parseInt(e.target.value)/100

})

document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})

}
main()

