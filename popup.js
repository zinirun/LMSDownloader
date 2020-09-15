const scanAllBt = document.querySelector('#clms_scan_all_bt');
const videoBt = document.querySelector('#video_download_bt');
const helpWrapper = document.querySelector('#help_wrapper');
const helpBt = document.querySelector('#help_bt');

allButtons = [scanAllBt, videoBt, helpWrapper];

const view = document.querySelector('#wrapper');
const errmsg_isNotDankook = '단국대학교 이러닝에서만<br />사용할 수 있습니다😢';
const errmsg_scan = '스캔된 강의가 없어요😢';
const errmsg_vid = '강의가 아닙니다😢';
const errmsg_vid_sample = '로딩 영상을 넘겨주세요!';

const downloadInfoDOM = `<div id="download_info"><hr /><div style="margin-top:5px; color: dodgerblue;">파일이름을 지정하세요.</div><input id="filename" type="text" placeholder="기본: screen" /></div><button id="download_start_bt">다운로드 시작</button>`;

helpBt.addEventListener('click', () => {
  window.open('./index.html');
});
scanAllBt.addEventListener('click', scanClms);
videoBt.addEventListener('click', loadDownload);

let isFinishToShow = false;

window.addEventListener('load', () => {
  chrome.tabs.executeScript(
    {
      code: 'window.location.hostname',
    },
    (userUrl) => {
      if (!userUrl[0].includes('dankook')) {
        allButtons.map((bt) => (bt.style.display = 'none'));
        view.innerHTML += `<div id="msg_isNotDankook" style="margin:5px 0; color: crimson; display: block;">${errmsg_isNotDankook}</div>`;
      } else {
        allButtons.map((bt) => (bt.style.display = 'block'));
        if (document.querySelector('#msg_isNotDankook')) {
          document.querySelector('#msg_isNotDankook').style.display = 'none';
        }
      }
    },
  );
});

function scanClms() {
  const videos = [];
  for (var i = 0; i < 5; i++) {
    chrome.tabs.executeScript(
      {
        code: `document.getElementsByTagName("iframe")[1].contentDocument.getElementsByTagName("iframe")[${i}].contentDocument.getElementsByTagName("iframe")[0].src`,
      },
      (clmsUrl) => {
        if (clmsUrl[0] === null || !clmsUrl) {
          return listVideos(videos);
        } else {
          videos.push(clmsUrl[0]);
        }
      },
    );
  }
}

function listVideos(videos) {
  if (isFinishToShow === false) {
    isFinishToShow = true;
    if (videos.length > 0) {
      let current = 1;
      view.innerHTML += videos
        .map((video) => `<a href="${video}" target="_blank">${current++}번 강의 열기</a>`)
        .join('');
    } else {
      view.innerHTML += `<div style="margin-top:5px; color: crimson;">${errmsg_scan}</div>`;
    }
  }
}

function loadDownload() {
  chrome.tabs.executeScript(
    {
      code: 'document.querySelector("video").src',
    },
    (vidUrl) => {
      if (chrome.runtime.lastError || vidUrl[0].length < 7 || !vidUrl[0].includes('dankook')) {
        if (vidUrl[0].includes('preloader')) {
          view.innerHTML += `<div style="margin-top:5px; color: crimson;">${errmsg_vid_sample}</div>`;
        } else {
          view.innerHTML += `<div style="margin-top:5px; color: crimson;">${errmsg_vid}</div>`;
        }
      } else {
        view.innerHTML += `<div id="download_info"><hr /><div style="margin-top:5px; color: dodgerblue;">파일이름을 지정하세요.</div><input id="filename" type="text" placeholder="기본: dankook" /></div><button id="download_start_bt" data-vid=${vidUrl[0]}>다운로드 시작</button>`;
        bindDownloadFunctionToButton();
      }
    },
  );
}

function bindDownloadFunctionToButton() {
  document.getElementById('download_start_bt').addEventListener('click', (e) => {
    const filename = document.getElementById('filename').value;
    const videoUrl = e.target.dataset.vid;
    const ext = videoUrl.split('.').pop();
    startDownload(filename, videoUrl, ext);
  });
}

function startDownload(vidName, vidUrl, ext) {
  console.log(vidName, vidUrl);
  if (vidName.length < 1) {
    vidName = 'dankook';
  }
  chrome.runtime.sendMessage({
    action: 'download',
    filename: vidName.concat('.' + ext),
    source: vidUrl,
  });
}
