const scanBt = document.querySelector('#clms_scan_bt');
const viewBt = document.querySelector('#video_download_bt');
const view = document.querySelector('#wrapper');

scanBt.addEventListener('click', () => {
  chrome.tabs.executeScript(
    {
      code:
        'document.getElementsByTagName("iframe")[1].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByTagName("iframe")[0].src',
    },
    (clmsUrl) => {
      if (chrome.runtime.lastError || clmsUrl[0].length < 10) {
        view.innerHTML +=
          '<div style="margin-top:5px; color: crimson;">인식된 영상이 없어요.</div>';
      } else {
        isMsgView = false;
        window.open(clmsUrl[0]);
      }
    },
  );
});

viewBt.addEventListener('click', () => {
  chrome.tabs.executeScript(
    {
      code: 'document.querySelector("video").src',
    },
    (vidUrl) => {
      if (vidUrl[0].length < 10) {
        view.innerHTML +=
          '<div style="margin-top:5px; color: crimson;">비디오를 못 찾았어요.</div>';
      } else {
        isMsgView = false;
        window.open(vidUrl[0]);
      }
    },
  );
});

document.querySelector('#help_bt').addEventListener('click', () => {
  window.open();
});
