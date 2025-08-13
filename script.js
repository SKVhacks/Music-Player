alert("This page is not Responsive");

// JS
const fileInput = document.getElementById('fileInput');
const player = document.getElementById('player');
const avatar = document.getElementById('avatar');
const titleSpan = document.getElementById('title');
const artistSpan = document.getElementById('artist');
const bitrateSpan = document.getElementById('bitrate');
const lyricsDiv = document.getElementById('lyrics');
const playBtn = document.getElementById('playBtn');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');
const style = document.createElement('style');

playBtn.addEventListener('click', () => {
  function updateSeekBar() {
    const percent = (seekBar.value / 100) * 100;
    seekBar.style.background = `linear-gradient(to right, white 0%, white ${percent}%, #5f5f5f81 ${percent}%)`;
  }

  player.addEventListener('timeupdate', () => {
    const value = (player.currentTime / player.duration) * 100;
    seekBar.value = value;
    updateSeekBar();
  });

  seekBar.addEventListener('input', () => {
    player.currentTime = (seekBar.value / 100) * player.duration;
    updateSeekBar();
  });




  if (player.paused) {
    player.play();
    playBtn.innerHTML = `
      <svg viewBox="-1 0 8 8" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="20" height="20">
        <path d="M172,3605 C171.448,3605 171,3605.448 171,3606 L171,3612 C171,3612.552 171.448,3613 172,3613 
                 C172.552,3613 173,3612.552 173,3612 L173,3606 C173,3605.448 172.552,3605 172,3605 
                 M177,3606 L177,3612 C177,3612.552 176.552,3613 176,3613 
                 C175.448,3613 175,3612.552 175,3612 L175,3606 
                 C175,3605.448 175.448,3605 176,3605 
                 C176.552,3605 177,3605.448 177,3606" transform="translate(-227 -3765) translate(56 160)" />
      </svg>
    `;
  } else {
    player.pause();
    playBtn.innerHTML = `
      <svg fill="#ffffff" height="25px" width="25px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M500.203,236.907L30.869,2.24c-6.613-3.285-14.443-2.944-20.736,0.939C3.84,7.083,0,13.931,0,21.333v469.333 c0,7.403,3.84,14.251,10.133,18.155c3.413,2.112,7.296,3.179,11.2,3.179c3.264,0,6.528-0.747,9.536-2.24l469.333-234.667 C507.435,271.467,512,264.085,512,256S507.435,240.533,500.203,236.907z"></path> </g> </g> </g></svg>     
    `; // Show play icon
  }
});
player.addEventListener('ended', () => {
  playBtn.innerHTML = `
      <svg fill="#ffffff" height="25px" width="25px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M500.203,236.907L30.869,2.24c-6.613-3.285-14.443-2.944-20.736,0.939C3.84,7.083,0,13.931,0,21.333v469.333 c0,7.403,3.84,14.251,10.133,18.155c3.413,2.112,7.296,3.179,11.2,3.179c3.264,0,6.528-0.747,9.536-2.24l469.333-234.667 C507.435,271.467,512,264.085,512,256S507.435,240.533,500.203,236.907z"></path> </g> </g> </g></svg>     
    `;
});
const seekBar = document.getElementById('seekBar');

let lyrics = [];

function parseLRC(lrcText) {
  lyrics = [];
  const lines = lrcText.split('\n');
  lines.forEach(line => {
    const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
    if (match) {
      const time = parseInt(match[1]) * 60 + parseFloat(match[2]);
      lyrics.push({ time, text: match[3] });
    }
  });
}

function displayLyrics(currentTime) {
  lyricsDiv.innerHTML = '';
  let activeIndex = -1;
  lyrics.forEach((line, index) => {
    if (index < lyrics.length - 1 && currentTime >= line.time && currentTime < lyrics[index + 1].time) {
      activeIndex = index;
    }
  });
  lyrics.forEach((line, index) => {
    const p = document.createElement('p');
    p.textContent = line.text;
    if (index === activeIndex) {
      p.classList.add('highlight');
    }
    lyricsDiv.appendChild(p);
  });

  if (activeIndex >= 0) {
    const highlighted = lyricsDiv.querySelector('.highlight');
    if (highlighted) highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ":" + (s < 10 ? "0" : "") + s;
}
player.addEventListener('timeupdate', () => {
  displayLyrics(player.currentTime);
  if (player.duration) {
    seekBar.value = (player.currentTime / player.duration) * 100;
    currentTimeSpan.textContent = formatTime(player.currentTime);
    totalTimeSpan.textContent = formatTime(player.duration);
  }
});

seekBar.addEventListener('input', () => {
  if (player.duration) {
    player.currentTime = (seekBar.value / 100) * player.duration;
  }
});

fileInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  const audioFile = files.find(file => file.type.startsWith('audio/'));
  const lrcFile = files.find(file => file.name.endsWith('.lrc'));


  if (audioFile) {
    const url = URL.createObjectURL(audioFile);
    player.src = url;
    alert("Designed by @Gadget_Vishwa");
    jsmediatags.read(audioFile, {
      onSuccess: function (tag) {
        const tags = tag.tags;
        titleSpan.textContent = (tags.title).slice(0, 25) || 'Unknown';
        artistSpan.textContent = tags.artist || 'Unknown';
        console.log(tags.title);

        player.onloadedmetadata = () => {
          totalTimeSpan.textContent = formatTime(player.duration);
        };


        if (lrcFile) {
          console.log('LRC file found:', lrcFile.name);
          style.textContent = `
      #lyrics {
        visibility: visible;
        margin: 10% 0;
        display: flex;
        place-items: center;
        flex-direction: column;
        font-size: 2em;
        width: 100%;
        height: 80vh;
        overflow-y:hidden;
        color: rgba(165, 165, 165, 0.795);
      }
      #lyrics::-webkit-scrollbar{
        display: none;
      }
      .highlight {
        visibility: visible;
        color: #ffffff;
        font-size: 1.5em;
        font-weight: bold;
        padding: 10px;
      }
    
    .left{
        float: left;
        width: 40%;
        height: 97vh;
        display: grid;
        justify-content: center;
        align-items: center;
    }

    .right{
        visibility: visible;
        float: right;
        width: 60%;
        height: 97vh;
      }
        #seekBar {
        width: 70%;
      }
        @media only screen and (max-width: 600px) {
         #lyrics {
          visibility: hidden;
          display: none;
      }
          .highlight{
          visibility: hidden;
          display: none;}
          .left{
          float: none;
          width: 100%;
          height: 97vh;
      }
          .right{
            visibility: hidden;
            display: none;
            float: none;
            }
          #seekBar {
            width: 60%;
            }
          .Thumbnail{
            height: 250px;
            }
    }
        `;
          document.head.appendChild(style);
        }
        else {
          console.log('No LRC file found');
          style.textContent = `
          #lyrics {
          visibility: hidden;
          display: none;
      }
          .highlight{
          visibility: hidden;
          display: none;}
          .left{
          float: none;
          width: 100%;
          height: 97vh;
      }
          .right{
          visibility: hidden;
          display: none;
          float: none;}
          #seekBar {
  width: 30%;
      }
         `;

          document.head.appendChild(style);


        }

        if (tags.picture) {
          const image = tags.picture;
          const base64String = image.data.reduce((data, byte) => data + String.fromCharCode(byte), '');
          const imgUrl = `data:${image.format};base64,${btoa(base64String)}`;
          avatar.src = imgUrl;
          applyGradientFromImage(imgUrl);
        } else {
          avatar.src = '';
          document.body.style.background = '';
        }
        const duration = player.duration || 180;
        bitrateSpan.textContent = Math.round(audioFile.size / duration / 125) + ' kbps';
      },
      onError: function (error) {
        console.error('Error reading tags: ', error);
      }
    });
  }

  if (lrcFile) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      parseLRC(evt.target.result);
    };
    reader.readAsText(lrcFile);
  }



  const hiddenCover = document.getElementById('hiddenCover');
  const colorThief = new ColorThief();

  


  function applyGradientFromImage(imgUrl) {
    hiddenCover.src = imgUrl;

    hiddenCover.onload = () => {
      try {
        const palette = colorThief.getPalette(hiddenCover, 5); // 5 colors for vibrant effect



        

        const gradientColors = palette.map(
          c => `rgba(${c[0]}, ${c[1]}, ${c[2]})`  // 0.6 = 60% opacity
        );
        console.log(gradientColors[0]);
        console.log(gradientColors[1]);
        console.log(gradientColors[2]);
        console.log(gradientColors[3]);
        document.documentElement.style.setProperty('--a', gradientColors[4]);
        document.documentElement.style.setProperty('--b', gradientColors[1]);
        document.documentElement.style.setProperty('--c', gradientColors[2]);
        document.documentElement.style.setProperty('--d', gradientColors[3]);
       



    
        // Remove old animation styles if present
        const oldStyle = document.getElementById('animatedGradientStyle');
        if (oldStyle) oldStyle.remove();

        const style = document.createElement('style');
        console.log(style);
        style.id = 'animatedGradientStyle';
        style.innerHTML = keyframes;
        document.head.appendChild(style);
      } catch (err) {
        console.error('Color Thief error:', err);
      }
    };
  }








});
