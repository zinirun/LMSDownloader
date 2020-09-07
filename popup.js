const scanOneBt = document.querySelector('#clms_scan_one_bt');
const scanTwoBt = document.querySelector('#clms_scan_two_bt');
const videoBt = document.querySelector('#video_download_bt');
const view = document.querySelector('#wrapper');
const errmsg_scan = '이러닝이 아닙니다😢';
const errmsg_vid = '강의가 아닙니다😢';

document.querySelector('#help_bt').addEventListener('click', () => {
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
        console.log(vidUrl[0]);
        view.innerHTML += `<div style="margin-top:5px; color: crimson;">${errmsg_vid}</div>`;
      } else {
        chrome.runtime.sendMessage({
          action: 'download',
          source: vidUrl[0],
        });
      }
    },
  );
});
