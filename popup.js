const scanOneBt = document.querySelector('#clms_scan_one_bt');
const scanTwoBt = document.querySelector('#clms_scan_two_bt');
const videoBt = document.querySelector('#video_download_bt');
const helpWrapper = document.querySelector('#help_wrapper');
const helpBt = document.querySelector('#help_bt');

allButtons = [scanOneBt, scanTwoBt, videoBt, helpWrapper];

const view = document.querySelector('#wrapper');
const errmsg_isNotDankook = '단국대학교 이러닝에서만<br />사용할 수 있습니다😢';
const errmsg_scan = '스캔된 강의가 없습니다😢';
const errmsg_vid = '강의가 아닙니다😢';
const errmsg_vid_sample = '로딩 영상을 넘겨주세요!';

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

helpBt.addEventListener('click', () => {
  window.open('./index.html');
});

scanOneBt.addEventListener('click', () => {
  chrome.tabs.executeScript(
    {
      code:
        'document.getElementsByTagName("iframe")[1].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByTagName("iframe")[0].src',
    },
    (clmsUrl) => {
      if (chrome.runtime.lastError || clmsUrl[0].length < 10) {
        view.innerHTML += `<div style="margin-top:5px; color: crimson;">${errmsg_scan}</div>`;
      } else {
        window.open(clmsUrl[0]);
      }
    },
  );
});

scanTwoBt.addEventListener('click', () => {
  chrome.tabs.executeScript(
    {
      code:
        'document.getElementsByTagName("iframe")[1].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByTagName("iframe")[0].src',
    },
    (clmsUrl1) => {
      if (chrome.runtime.lastError || clmsUrl1[0].length < 10) {
        view.innerHTML += `<div style="margin-top:5px; color: crimson;">${errmsg_scan}</div>`;
      } else {
        view.innerHTML += `<a href="${clmsUrl1}" target="_blank">첫번째 강의 열기</a>`;
        chrome.tabs.executeScript(
          {
            code:
              'document.getElementsByTagName("iframe")[1].contentDocument.getElementsByTagName("iframe")[1].contentDocument.getElementsByTagName("iframe")[0].src',
          },
          (clmsUrl2) => {
            if (chrome.runtime.lastError || clmsUrl2[0].length < 10) {
              view.innerHTML += `<div style="margin-top:5px; color: crimson;">${errmsg_scan}</div>`;
            } else {
              view.innerHTML += `<a href="${clmsUrl2}" target="_blank">두번째 강의 열기</a>`;
            }
          },
        );
      }
    },
  );
});

videoBt.addEventListener('click', () => {
  chrome.tabs.executeScript(
    {
      code: 'document.querySelector("video").src',
    },
    (vidUrl) => {
      if (
        chrome.runtime.lastError ||
        vidUrl[0].length < 7 ||
        !vidUrl[0].includes('dankook.common')
      ) {
        if (vidUrl[0].includes('preloader')) {
          view.innerHTML += `<div style="margin-top:5px; color: crimson;">${errmsg_vid_sample}</div>`;
        } else {
          view.innerHTML += `<div style="margin-top:5px; color: crimson;">${errmsg_vid}</div>`;
        }
      } else {
        chrome.runtime.sendMessage({
          action: 'download',
          source: vidUrl[0],
        });
      }
    },
  );
});
