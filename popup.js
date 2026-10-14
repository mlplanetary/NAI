const on = document.getElementById('on');
chrome.storage.local.get({ enabled: true, count: 0 }, (s) => {
  on.checked = s.enabled;
  document.getElementById('count').textContent = `${s.count} AI posts hidden`;
});
on.onchange = () => chrome.storage.local.set({ enabled: on.checked });
