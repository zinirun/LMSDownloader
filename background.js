chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'download') {
    if (request.source.includes('dankook.commonscdn')) {
      try {
        chrome.downloads.download({
          url: request.source,
          filename: request.filename,
        });
      } catch (err) {
        alert(`오류: ${err.message}`);
      }
    } else {
      alert('다운받을 수 있는 강의컨텐츠가 아닙니다😭');
    }
  }
});
