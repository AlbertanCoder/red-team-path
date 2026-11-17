// Red Team Path: app shell.
// Everything is saved in this browser under one key (STORE_KEY).
// If saving fails (private mode, storage full), a warning shows and the app keeps working in memory.

(function () {
  "use strict";

  // ---------- saving ----------
  var STORE_KEY = "redTeamPath.v1";

  function emptyData() {
    return { version: 1 };
  }

  var data = emptyData();
  var storageOk = true;

  function showStorageWarning() {
    storageOk = false;
    var el = document.getElementById("storage-warning");
    if (el) el.hidden = false;
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") data = Object.assign(emptyData(), parsed);
      }
      // prove we can write too, not just read
      localStorage.setItem(STORE_KEY + ".test", "1");
      localStorage.removeItem(STORE_KEY + ".test");
    } catch (e) {
      showStorageWarning();
    }
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (e) {
      showStorageWarning();
    }
  }

  // ---------- tabs ----------
  var TABS = ["today", "path", "log", "writeups", "cards", "toolbox"];

  function showTab(name) {
    if (TABS.indexOf(name) === -1) name = "today";
    TABS.forEach(function (t) {
      var section = document.getElementById("tab-" + t);
      if (section) section.hidden = t !== name;
    });
    document.querySelectorAll(".tabbar a").forEach(function (a) {
      if (a.dataset.tab === name) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    var section = document.getElementById("tab-" + name);
    document.getElementById("tab-title").textContent = section ? section.dataset.title : "";
    window.scrollTo(0, 0);
  }

  function currentTab() {
    return (location.hash || "#today").slice(1);
  }

  window.addEventListener("hashchange", function () { showTab(currentTab()); });

  // ---------- start ----------
  load();
  showTab(currentTab());

  // Shared with later milestones
  window.RTP = { data: function () { return data; }, save: save, storageOk: function () { return storageOk; } };
})();
