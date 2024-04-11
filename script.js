
let currentSong=new Audio();
let songs;
let currFolder;
function secondsToMinutesAndSeconds(seconds) {
    // Ensure input is a positive number
    if (isNaN(seconds) || seconds < 0) {
      return "00 : 00";
    }
  
    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    // Add leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  
  // Example usage:
  const totalSeconds = 125;
  const formattedTime = secondsToMinutesAndSeconds(totalSeconds);
  console.log(formattedTime); // Output: "02:05"
  


async function getSongs(folder){
    currFolder=folder;
    let a=await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response=await a.text();
    console.log(response)
    let div=document.createElement("div")
    div.innerHTML=response;
    let as =div.getElementsByTagName("a")
    songs=[]
    for(let index=0;index<as.length;index++){
        const element =as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
     //show all songs in the playlist
     let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
     songUL.innerHTML=""
     for(const song of songs){
         songUL.innerHTML=songUL.innerHTML+`<li>
         
         
         <img class="invert" src="music.svg" alt="musiclogo">
         <div class="info">
         <div>${song.replaceAll("%20"," ")}</div>
         <div>Anubhav</div>
         </div>
         <div class="playNow">
         <span>Play Now</span>
         <img class="invert" src="playnow.svg" alt="musicplaylogo">
         </div>
         
         
          </li>`;
         
     }
 
    //Attach a event listner to each song
     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",elment=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
     });
}

const playMusic=(track,pause=false)=>{
    currentSong.src=`/${currFolder}/`+track
    if(!pause){
    currentSong.play()
    play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}


async function main(){

    //Get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0],true)
    
    
//Attach an event listner to play ,next and prvious svgs
        play.addEventListener("click",() =>{
                    if(currentSong.paused){
                        currentSong.play()
                        play.src="pause.svg"
                    }
                    else{
                        currentSong.pause()
                        play.src="play.svg"
                    }
        })
        //listen for timeupdateListener
        currentSong.addEventListener("timeupdate" ,()=>{
           
            document.querySelector(".songtime").innerHTML=`${secondsToMinutesAndSeconds(currentSong.currentTime)} / ${secondsToMinutesAndSeconds(currentSong.duration)}`
            document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
        })
            //add event listner to seekbaar
            document.querySelector(".seekbar").addEventListener("click",e=>{
                let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
              document.querySelector(".circle").style.left=percent+"%";
              currentSong.currentTime=((currentSong.duration)*percent)/100
            })
            //add event listner to hamburger
            document.querySelector(".hamburger").addEventListener("click",()=>{
                document.querySelector(".left").style.left="0"
            })
            //add event listner to close the button
            document.querySelector(".close").addEventListener("click",()=>{
                document.querySelector(".left").style.left="-120%"
            })
            //add event listner to previous and next buttons
            previous.addEventListener("click",()=>{
                
                
                let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
                if((index-1)>=0){
                    playMusic(songs[index-1])
                }
            })
            next.addEventListener("click",function(){
                

                let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);    
                if((index+1)<songs.length){
                    playMusic(songs[index+1])
                }
                
            })
            //add event to volume
            document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
                console.log("Setting volume to",e.target.value,"/ 100")
                currentSong.volume=parseInt(e.target.value)/100
            })
            //load the playlist whenever cards is clicked
            Array.from(document.getElementsByClassName("card")).forEach(e=>{
                e.addEventListener("click" ,async item=>{
                    songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                    
                })
            })
}           
main()