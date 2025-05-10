const { ipcRenderer } = require("electron");

//Pengambilan data dari ./data.json dan pembuatan program di dalam function
async function loadData() {
  const data = await ipcRenderer.invoke("get-data");

  //Simpan masing masing data dari JSON
  const apps = data.apps.items;
  const desktopItems = data.desktop.items;
  const control = data.control;

  const musicPath = data.musics.path;
  const musicItems = data.musics.items;

  const isMusicDisable = control.disableMusic;
  const browserItems = data.browserShortcut;

  //                             PENYELEKSIAN ELEMEN AWAL & PENGECEKAN DATA                          //

  //Seleksi DOM awal element html
  const notif = document.querySelector(".notif-content");
  const container = document.querySelector(".master-container");
  const menuContainer = document.querySelector(".main-container");
  const title = document.querySelector(".title");
  const logo = document.querySelector("img");

  //Main Menu
  const menuList = [
    "BROWSE",
    "APPLICATION",
    "DESKTOP",
    "EXPLORER",
    "SETTINGS",
    "WINDOWS",
    "MUSICS",
    "TIME",
    "BROWSER",
    "DEV",
    "EXIT",
  ];

  //Subkonten dari masing-masing Main Menu
  const appContent = [];
  const desktopContent = [];
  const explorerContent = ["LOCAL DISK C", "LOCAL DISK D"];
  const settingsContent = ["MUSIC", "SFX", "TRACK SETTINGS"];
  const windowsContent = [
    "CONTROL PANEL",
    "TASK MANAGER",
    "TERMINAL",
    "WINDOWS SETTINGS",
  ];
  const musicsContent = [];
  const browserContent = [];
  const devContent = ["CRUD DIR", "START CODE", "FETCH API"];
  const exitContent = ["RESTART", "SHUTDOWN", "EXIT MAIN MENU"];

  //Data path untuk menjalankan program
  const contentPath = {
    application: [], //Dinamis
    desktop: [], //Dinamis
    browser: [], //Dinamis
    explorer: ["C:/", "D:/"],
    windows: ["control", "Taskmgr.exe", "cmd", "ms-settings:"],
    exit: ["shutdown /r /t 0", "shutdown /s /t 0", "main menu"],
  };

  //Function untuk cek kekosongan data
  function isDataEmpty(data) {
    const objectCheck = typeof data == "object" && Object.keys(data).length < 1;
    const arrayCheck = Array.isArray(data) && data.length < 1;
    const result = objectCheck || arrayCheck ? true : false;
    return result;
  }

  function loadDynamicData() {
    if (!isDataEmpty(apps)) {
      apps.forEach((app) => {
        const appName = app.name;
        const appPath = app.path;
        appContent.push(appName.toUpperCase());
        contentPath.application.push(appPath);
      });
    }

    if (!isDataEmpty(desktopItems)) {
      for (const key in desktopItems) {
        if (Object.prototype.hasOwnProperty.call(desktopItems, key)) {
          const desktopName = key;
          const desktopPath = desktopItems[key];
          desktopContent.push(desktopName);
          contentPath.desktop.push(desktopPath);
        }
      }
    }

    if (!isDataEmpty(musicItems)) {
      musicItems.forEach((music) =>
        musicsContent.push(music.slice(0, -4).toUpperCase())
      );
    }

    if (!isDataEmpty(browserItems)) {
      browserItems.forEach((shortcut) => {
        const name = shortcut.name;
        const link = shortcut.link;
        browserContent.push(name.toUpperCase());
        contentPath.browser.push(link);
      });
    }
  }

  //Muat data dinamis
  loadDynamicData();

  //                              AREA PEMBUATAN MAIN MENU & SUBKONTEN                                  //

  //Ambil masing-masing container dari subkonten
  const subContainerList = [];

  //Buat element untuk main menu dan container untuk subkonten
  for (let i = 0; i < menuList.length; i++) {
    const menu = document.createElement("h1");
    const subContainer = document.createElement("div");
    const menuText = document.createTextNode(menuList[i]);

    container.appendChild(subContainer);
    subContainer.setAttribute("class", "sub-container");
    subContainer.classList.add(
      `container-${menuList[i].toLowerCase().replace(/\s+/g, "")}`
    );

    subContainerList.push(
      document.querySelector(
        `.container-${menuList[i].toLowerCase().replace(/\s+/g, "")}`
      )
    );

    menu.appendChild(menuText);
    menuContainer.appendChild(menu);
    menuList[i] == "EXIT"
      ? menu.setAttribute("class", "exit")
      : menu.setAttribute("class", "content");
    menu.classList.add(menuList[i].toLowerCase());
  }

  //Seleksi semua element main menu
  const browse = document.querySelector(".browse");
  const app = document.querySelector(".application");
  const desktop = document.querySelector(".desktop");
  const explorer = document.querySelector(".explorer");
  const settings = document.querySelector(".settings");
  const windows = document.querySelector(".windows");
  const musics = document.querySelector(".musics");
  const browserShortcut = document.querySelector(".browser");
  const time = document.querySelector(".time");
  const dev = document.querySelector(".dev");
  const exit = document.querySelector(".exit");

  //Pembuatan konten browse untuk searching URL ke browser pada main menu
  const browserInput = document.createElement("input");
  browserInput.setAttribute("class", "internet-search");
  browserInput.setAttribute("type", "text");
  browserInput.setAttribute("placeholder", "URL");
  browse.classList.add("internet-input");
  browse.appendChild(browserInput);

  //Buat element untuk menampilkan track yang sedang berjalan
  const onTrackElement = document.createElement("h1");
  onTrackElement.setAttribute("class", "track");
  musics.appendChild(onTrackElement);

  //Buat element untuk menampilkan waktu
  const timeElement = document.createElement("h1");
  timeElement.setAttribute("class", "clock");
  time.appendChild(timeElement);

  //Memperbarui style dan isi konten pada elemen main menu tertentu
  browserShortcut.textContent = "BROWSER SHORTCUT";
  dev.style.display = "none";
  dev.textContent = "</>";

  //Seleksi elemen input untuk browsing dan elemen untuk menampilkan track
  const getBrowserInput = document.querySelector(".internet-search");
  const getOnTrackElement = document.querySelector(".track");

  //Function untuk menampilkan waktu secara real time
  function clock() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    const system = hours >= 12 ? "PM" : "AM";
    const textHours = hours < 10 ? `0${hours}` : hours;
    const textMinutes = minutes < 10 ? `0${minutes}` : minutes;

    timeElement.textContent = `${textHours}:${textMinutes} ${system}`;
  }

  //Jalankan penampilan waktu
  clock();
  setInterval(() => clock(), 1000);

  //Ambil semua elemen main menu dan simpan ke dalam array
  const getMenu = [
    "",
    browse,
    app,
    desktop,
    explorer,
    settings,
    windows,
    musics,
    time,
    browserShortcut,
    dev,
    exit,
  ];

  //Tambahkan animasi logo dan judul konten saat halaman dimuat
  logo.classList.add("logo-in");
  title.classList.add("title-slide-in");

  //Tambahkan animasi masuk secara bergilir ke semua konten main menu
  getMenu.forEach((e, i) => {
    if (e) {
      setTimeout(() => {
        e.classList.add("slide-in");
        e.classList.add("on-top");
      }, i * 30);
    }
  });

  //Ambil dan simpan semua element pada subkonten ke masing-masing penampungnya
  const getAPP = [];
  const getDESKTOP = [];
  const getEXPLORER = [];
  const getSETTINGS = [];
  const getWINDOWS = [];
  const getMUSICS = [];
  const getBROWSER = [];
  const getDEV = [];
  const getEXIT = [];

  //Batas konten yang ditampilkan untuk tiap halaman
  const maxContentPerPage = 7;
  const maxMusicPerPage = 10;

  //Fungsi untuk membuat navigasi jika konten yang ditampilkan
  //melebihi batas dari yang ditentukan
  function createNav(subContentName, parent, subElement) {
    const inputBox = document.createElement("h1");
    const input = document.createElement("input");

    input.setAttribute("class", `${subContentName}-search`);
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "SEARCH SPECIFIC ITEMS");

    inputBox.setAttribute("class", "content");
    inputBox.textContent = "SEARCH";
    inputBox.classList.add(`${subContentName}-input`);
    inputBox.appendChild(input);

    parent.appendChild(inputBox);
    subElement.push(document.querySelector(`.${subContentName}-input`));

    const back = document.createElement("h1");
    back.textContent = "BACK";
    back.setAttribute("class", "back");
    back.classList.add(`${subContentName}back`);
    parent.appendChild(back);
    subElement.push(document.querySelector(`.${subContentName}back`));

    const next = document.createElement("h1");
    next.textContent = "NEXT";
    next.setAttribute("class", "next");
    next.classList.add(`${subContentName}next`);
    parent.appendChild(next);
    subElement.push(document.querySelector(`.${subContentName}next`));

    const begin = document.createElement("h1");
    begin.textContent = "BEGIN";
    begin.setAttribute("class", "begin");
    begin.classList.add(`${subContentName}begin`);
    parent.appendChild(begin);
    subElement.push(document.querySelector(`.${subContentName}begin`));

    const end = document.createElement("h1");
    end.textContent = "END";
    end.setAttribute("class", "end");
    end.classList.add(`${subContentName}end`);
    parent.appendChild(end);
    subElement.push(document.querySelector(`.${subContentName}end`));
  }

  //Tangkap element dari setiap subkonten yang kontennya dinamis
  class Catch {
    constructor(application, desktop, musics, browser) {
      this.application = application;
      this.desktop = desktop;
      this.musics = musics;
      this.browser = browser;
    }
  }

  //Tangkap element container dan kontennya dari subkonten
  const catchContainer = new Catch([], [], [], []);
  const catchElement = new Catch([], [], [], []);

  //Class SubMenu untuk membuat konten subkonten
  class SubMenu {
    constructor(name, content, container, element) {
      this.name = name;
      this.content = content;
      this.container = container;
      this.element = element;
    }
    createSubMenu() {
      const subContentName = this.name.toLowerCase().replace(/\s+/g, "");
      const subContentList = this.content;
      const parent = this.container;
      const subElement = this.element;

      if (
        subContentList.length >
        (subContentName == "musics" ? maxMusicPerPage : maxContentPerPage)
      ) {
        createNav(subContentName, parent, subElement);
        const totalContent = subContentList.length;
        const overloadContent = Math.ceil(
          totalContent /
            (subContentName == "musics" ? maxMusicPerPage : maxContentPerPage)
        );
        if (contentPath[subContentName]) {
          for (let i = 0; i < 5; i++) {
            contentPath[subContentName].unshift("");
          }
        }

        for (let i = 0; i < overloadContent; i++) {
          const subContainer = document.createElement("div");
          subContainer.setAttribute("class", "subcontainer");
          subContainer.classList.add(`container-${subContentName}-${i}`);
          subContainer.classList.add("hide-element");
          parent.appendChild(subContainer);
          catchContainer[subContentName].push(subContainer);
        }

        for (let i = 0; i < subContentList.length; i++) {
          const menu = document.createElement("h1");
          if (subContentName == "musics") {
            if (subContentList[i].length > 27)
              menu.textContent = `${i + 1} | ${subContentList[i].substring(
                0,
                24
              )}...`;
            else menu.textContent = `${i + 1} | ${subContentList[i]}`;
          } else {
            if (subContentList[i].length > 17)
              menu.textContent = subContentList[i].substring(0, 15) + "...";
            else menu.textContent = subContentList[i];
          }
          menu.setAttribute("class", "content");
          if (subContentName == "musics") {
            menu.classList.add(`${subContentName}-musics`);
            menu.classList.add(`${subContentName}-musics-${[i]}`);
          } else
            menu.classList.add(
              `${subContentName}-${subContentList[i]
                .toLowerCase()
                .replace(/\s+/g, "")}`
            );
          catchElement[subContentName].push(menu);
        }
        let index = 0;
        catchContainer[subContentName].forEach((subContainer) => {
          for (
            let i = 0;
            i <
              (subContentName == "musics"
                ? maxMusicPerPage
                : maxContentPerPage) &&
            index < catchElement[subContentName].length;
            i++
          ) {
            subContainer.appendChild(catchElement[subContentName][index]);
            subContentName == "musics"
              ? subElement.push(
                  document.querySelector(`.${subContentName}-musics-${[index]}`)
                )
              : subElement.push(
                  document.querySelector(
                    `.${subContentName}-${subContentList[index]
                      .toLowerCase()
                      .replace(/\s+/g, "")}`
                  )
                );
            index++;
          }
        });
      } else {
        for (let i = 0; i < subContentList.length; i++) {
          const menu = document.createElement("h1");
          if (subContentName == "musics") {
            if (subContentList[i].length > 27)
              menu.textContent = `${i + 1} | ${subContentList[i].substring(
                0,
                24
              )}...`;
            else menu.textContent = `${i + 1} | ${subContentList[i]}`;
          } else {
            if (subContentList[i].length > 17)
              menu.textContent = subContentList[i].substring(0, 15) + "...";
            else menu.textContent = subContentList[i];
          }
          menu.setAttribute("class", "content");
          if (subContentName == "musics") {
            menu.classList.add(`${subContentName}-musics`);
            menu.classList.add(`${subContentName}-musics-${[i]}`);
          } else
            menu.classList.add(
              `${subContentName}-${subContentList[i]
                .toLowerCase()
                .replace(/\s+/g, "")}`
            );

          parent.appendChild(menu);
          if (subContentName == "musics") {
            subElement.push(
              document.querySelector(`.${subContentName}-musics-${[i]}`)
            );
          } else
            subElement.push(
              document.querySelector(
                `.${subContentName}-${subContentList[i]
                  .toLowerCase()
                  .replace(/\s+/g, "")}`
              )
            );
        }

        if (subContentName == "explorer") {
          const inputBox = document.createElement("h1");
          const input = document.createElement("input");

          input.setAttribute("class", `${subContentName}-search`);
          input.setAttribute(
            "placeholder",
            "ENTER SPECIFIC PATH | D:/Program Files"
          );

          inputBox.setAttribute("class", "content");
          inputBox.classList.add(`${subContentName}-input`);
          inputBox.appendChild(input);

          parent.appendChild(inputBox);
          subElement.push(document.querySelector(`.${subContentName}-input`));
        }

        if (subContentName == "dev") {
          const inputBox = document.createElement("h1");
          const monitor = document.createElement("textarea");

          monitor.setAttribute("class", `${subContentName}-output`);
          monitor.setAttribute(
            "placeholder",
            `MiSide@${data.author}: monitor output`
          );
          monitor.disabled = true;

          inputBox.setAttribute("class", "content");
          inputBox.classList.add(`${subContentName}-monitor`);
          inputBox.appendChild(monitor);

          parent.appendChild(inputBox);
          subElement.push(document.querySelector(`.${subContentName}-monitor`));
        }

        const back = document.createElement("h1");
        const backText = document.createTextNode("BACK");
        back.appendChild(backText);
        back.setAttribute("class", "back");
        back.classList.add(`${subContentName}back`);
        parent.appendChild(back);
        subElement.push(document.querySelector(`.${subContentName}back`));
      }
    }
  }

  //Daftarkan subkonten yang ingin dibuat

  const subApp = new SubMenu(
    menuList[1],
    appContent,
    subContainerList[1],
    getAPP
  );

  const subDesktop = new SubMenu(
    menuList[2],
    desktopContent,
    subContainerList[2],
    getDESKTOP
  );

  const subExplorer = new SubMenu(
    menuList[3],
    explorerContent,
    subContainerList[3],
    getEXPLORER
  );

  const subSettings = new SubMenu(
    menuList[4],
    settingsContent,
    subContainerList[4],
    getSETTINGS
  );

  const subWindows = new SubMenu(
    menuList[5],
    windowsContent,
    subContainerList[5],
    getWINDOWS
  );

  const subMusics = new SubMenu(
    menuList[6],
    musicsContent,
    subContainerList[6],
    getMUSICS
  );

  const subBrowser = new SubMenu(
    menuList[8],
    browserContent,
    subContainerList[8],
    getBROWSER
  );

  const subDev = new SubMenu(
    menuList[9],
    devContent,
    subContainerList[9],
    getDEV
  );

  const subExit = new SubMenu(
    menuList[menuList.length - 1],
    exitContent,
    subContainerList[menuList.length - 1],
    getEXIT
  );

  // Ambil semua subkonten dan simpan ke dalam array
  const subMenuList = [
    subApp,
    subDesktop,
    subExplorer,
    subSettings,
    subWindows,
    subMusics,
    subBrowser,
    subDev,
    subExit,
  ];

  //Pembuatan subkonten dimulai
  subMenuList.forEach((e) => e.createSubMenu());

  //                                   AREA KONFIGURASI MUSIK                                  //

  //Setup kontrol musik
  let musicVolume = 0.01 * control.musicVolume;
  let playAudio = true;
  let getVolume = [];
  let hoverAudioVolume = 0.01 * control.sfxVolume;
  let clickAudioVolume = 0.007 * control.sfxVolume;

  //Setup status musik
  let music;
  let trackIndex;
  let defaultMusic;
  let blurDisabledMusic = isMusicDisable;
  let playStatus = false;
  let playOpt = control.playOption ? control.playOption : "LOOP";
  const currentTrack = [];

  //Musik default yang dimainkan saat program dijalankan
  const defaultMusicList = [
    "../assets/audio/MiSide Menu OST.ogg",
    "../assets/audio/MiSide Menu (Alt) OST.ogg",
  ];

  //Suara saat melakukan hover atau klik pada tiap elemen atau konten
  const sfx = {
    hover: "../assets/audio/Menu_Hover.ogg",
    select: "../assets/audio/Menu_Select.ogg",
  };

  //Memilih musik default secara acak
  function getDefaultMusic(musicList) {
    const index = Math.floor(Math.random() * defaultMusicList.length);
    return musicList[index];
  }

  //Fungsi untuk memutar musik default
  function playDefaultMusic(option) {
    defaultMusic.volume = musicVolume;
    option == 1 ? defaultMusic.play() : defaultMusic.pause();
    defaultMusic.addEventListener("ended", () => defaultMusic.play());
  }

  //Fungsi untuk memutar konten musik
  function playMusic(musicPath) {
    playStatus = true;
    music = new Audio(musicPath);
    music.volume = musicVolume;
    music.play();
    music.addEventListener("ended", () => {
      if (playOpt == "LOOP") music.play();
      else {
        trackIndex =
          playOpt == "QUEUE"
            ? trackIndex + 1
            : Math.floor(Math.random() * musicsContent.length);
        handleTrack(getMUSICS, musicItems, trackIndex);
      }
    });
  }

  //Inisialisasi awal untuk konten musik dan musik default
  //serta memainkan musik default saat halaman dimuat
  music = new Audio(getDefaultMusic(defaultMusicList));
  defaultMusic = new Audio(getDefaultMusic(defaultMusicList));
  playDefaultMusic(1);

  //(Komunikasi Electron) Terima data status musik dari electron
  ipcRenderer.on("music-play", () => {
    if (blurDisabledMusic) playStatus ? music.play() : playDefaultMusic(1);
  });
  music;
  ipcRenderer.on("music-pause", () => {
    if (blurDisabledMusic) playStatus ? music.pause() : playDefaultMusic(0);
  });

  //Ambil kedua elemen untuk membuat input range mengatur volume
  const audioElements = [getSETTINGS[0], getSETTINGS[1]];
  for (let i = 0; i < audioElements.length; i++) {
    const rangeInput = document.createElement("input");
    rangeInput.setAttribute("type", "range");
    rangeInput.setAttribute("min", 0);
    rangeInput.setAttribute("max", 100);
    rangeInput.setAttribute("class", "volume");
    rangeInput.setAttribute("id", `volume-${i}`);
    audioElements[i].appendChild(rangeInput);
    getVolume.push(document.getElementById(`volume-${i}`));
  }

  //Ambil kedua elemen volume (Musik & Sfx)
  const musicElement = getVolume[0];
  const sfxElement = getVolume[1];

  //Atur nilai volume awal berdasarkan data yang didapat dari JSON
  musicElement.setAttribute("value", control.musicVolume);
  sfxElement.setAttribute("value", control.sfxVolume);

  //Kontrol kedua nilai volume (Musik & Sfx) melalui inputnya masing-masing
  musicElement.addEventListener("input", (e) => {
    musicVolume = 0.01 * e.target.value;
    defaultMusic.volume = musicVolume;
    music.volume = musicVolume;
    ipcRenderer.send("control-music", musicVolume * 100);
  });
  sfxElement.addEventListener("input", (e) => {
    hoverAudioVolume = 0.01 * e.target.value;
    clickAudioVolume = 0.009 * e.target.value;
    ipcRenderer.send("control-sfx", e.target.value * 1);
  });

  //                                   PENYELEKSIAN NAVIGASI                                  //

  //Seleksi semua elemen subkonten dan navigasi
  const getAllContent = document.querySelectorAll(".content");
  const getAllBack = document.querySelectorAll(".back");
  const getAllNext = document.querySelectorAll(".next");
  const getAllBegin = document.querySelectorAll(".begin");
  const getAllEnd = document.querySelectorAll(".end");

  //Seleksi semua elemen subkonten searchbar
  const getAppInput = document.querySelector(".application-search");
  const getDesktopInput = document.querySelector(".desktop-search");
  const getExplorerInput = document.querySelector(".explorer-search");
  const getMusicInput = document.querySelector(".musics-search");
  const getBrowserShortcutInput = document.querySelector(
    ".browsershortcut-search"
  );

  //                                   PEMBUATAN TRACK SETTINGS                                  //

  //Seleksi elemen container dari track settings dan buat elemen untuk menu dropdown
  const getTrackDropdown = document.querySelector(".settings-tracksettings");
  const dropDownBtn = document.createElement("button");
  const radioGroup = document.createElement("div");

  //Masukkan tombol dropdown ke elemen containernya (track settings)
  getTrackDropdown.appendChild(dropDownBtn);

  //Isi konten pada menu dropdown track settings
  let dropdownOpen = false;
  const dropDownContent = ["DISABLE MUSIC WHEN OPEN OTHER APP", "PLAY OPTION"];
  const dropPlayOption = ["RANDOM", "QUEUE", "LOOP"];

  //Tambahkan class dan teks ke tombol dropdown untuk styling
  dropDownBtn.classList.add("track-dropdown");
  dropDownBtn.textContent = "extend";
  radioGroup.style.display = "inline";

  //Buat menu dropdown
  dropDownContent.forEach((content, index) => {
    const dropDownMenu = document.createElement("button");
    dropDownMenu.textContent = content;
    dropDownMenu.setAttribute("class", "dropdown-menu");
    dropDownMenu.classList.add(`dropdown-menu-${index + 1}`);
    getTrackDropdown.appendChild(dropDownMenu);
  });

  //Buat menu opsi putar
  dropPlayOption.forEach((content, index) => {
    const optionElement = document.createElement("label");
    optionElement.setAttribute("class", `play-option`);
    optionElement.classList.add(`play-option-${index + 1}`);
    optionElement.textContent = content;
    if (optionElement.textContent == playOpt)
      optionElement.classList.add("track-option-active");
    radioGroup.appendChild(optionElement);
  });

  //Seleksi menu yang ada di dalam dropdown
  const disableMusic = document.querySelector(".dropdown-menu-1");
  const playOption = document.querySelector(".dropdown-menu-2");

  //Konfigurasi menu disable music (Musik dijeda saat membuka aplikasi lain)
  if (blurDisabledMusic) disableMusic.classList.add("music-disabled");
  disableMusic.addEventListener("click", () => {
    blurDisabledMusic = !blurDisabledMusic;
    ipcRenderer.send("disable-music", blurDisabledMusic);
    disableMusic.classList.toggle("music-disabled");
  });

  //Masukkan menu opsi putar ke containernya (play option)
  playOption.appendChild(radioGroup);

  //Konfigurasi menu opsi putar (Tentukan pemutaran musik selanjutnya)
  const getPlayOption = document.querySelectorAll(".play-option");
  getPlayOption.forEach((element) => {
    element.addEventListener("click", () => {
      getPlayOption.forEach((e) => e.classList.remove("track-option-active"));
      playOpt = element.textContent;
      ipcRenderer.send("track-setting", playOpt);
      element.classList.add("track-option-active");
    });
  });

  //Sembunyikan semua menu dropdown saat program dimuat
  const getALlDropdownMenu = document.querySelectorAll(".dropdown-menu");
  getALlDropdownMenu.forEach((e) => (e.style.display = "none"));

  //Buka dan tutup menu dropdown dengan menekan tombol dropdown
  dropDownBtn.addEventListener("click", () => {
    if (dropdownOpen) {
      getALlDropdownMenu.forEach((e) => (e.style.display = "none"));
      dropDownBtn.textContent = "extend";
      dropdownOpen = false;
    } else {
      getALlDropdownMenu.forEach((e) => (e.style.display = ""));
      dropDownBtn.textContent = "collapse";
      dropdownOpen = true;
    }
  });

  //                                   AREA EVENT LISTENER                                  //

  //Setup untuk pagination
  let allowClick = true;
  let allowEscape = false;
  let contentTitle;
  let inContent;
  let inContainer;
  let page = 0;

  //Fungsi untuk memberikan suara saat konten dipilih dan ditekan (sfx)
  function selectMenu(content) {
    if (content == exit) {
      content.addEventListener("mouseover", () => {
        hoverAudio = new Audio(sfx.hover);
        hoverAudio.volume = hoverAudioVolume;
        if (playAudio) {
          hoverAudio.play();
          playAudio = false;
          setTimeout(() => (playAudio = true), 50);
        }
      });
      content.addEventListener("click", () => {
        clickAudio = new Audio(sfx.select);
        clickAudio.volume = clickAudioVolume;
        clickAudio.play();
      });
    } else {
      content.forEach((e) => {
        e.addEventListener("mouseover", () => {
          hoverAudio = new Audio(sfx.hover);
          hoverAudio.volume = hoverAudioVolume;
          if (playAudio) {
            hoverAudio.play();
            playAudio = false;
            setTimeout(() => (playAudio = true), 50);
          }
        });
        e.addEventListener("click", () => {
          clickAudio = new Audio(sfx.select);
          clickAudio.volume = clickAudioVolume;
          clickAudio.play();
        });
      });
    }
  }

  //Animasi refresh untuk setiap berpindah halaman atau konten
  function refresh(content) {
    if (content == getMUSICS && musicsContent.length > maxMusicPerPage) {
      content.slice(0, 5).forEach((e, i) => {
        setTimeout(() => {
          e.classList.add("refresh");
        }, i * 40);
        e.classList.remove("refresh");
      });
      content.slice(5, musicsContent.length + 5).forEach((e, i) => {
        const delay = (i % 10) * 40;
        setTimeout(() => {
          e.classList.add("refresh");
        }, delay);
        e.classList.remove("refresh");
      });
    } else {
      content.forEach((e, i) => {
        if (e) {
          setTimeout(() => e.classList.add("refresh"), i * 30);
          e.classList.remove("refresh");
        }
      });
    }
  }

  //Penyesuaian ukuran tombol kembali (back)
  function resizeBackBtn(contentTarget) {
    if (contentTarget.length > 11) contentTarget[1].classList.add("resize-btn");
  }

  //Atur subkonten yang ukuran tombol kembalinya perlu penyesuaian
  resizeBackBtn(getAPP);
  resizeBackBtn(getMUSICS);
  resizeBackBtn(getDESKTOP);
  resizeBackBtn(getBROWSER);

  //Daftarkan semua konten untuk diberikan suara (sfx)
  selectMenu(getAllContent);
  selectMenu(getAllBack);
  selectMenu(getAllNext);
  selectMenu(getAllBegin);
  selectMenu(getAllEnd);
  selectMenu(exit);
  refresh(getMenu);

  //Functiom transisi konten masuk
  function handleTransition(e) {
    e.classList.toggle("slide-out");
    e.classList.toggle("slide-in");
    e.classList.toggle("on-top");
  }

  //Function mengatur transisi konten
  function menuTransition(contentTarget) {
    if (contentTarget == getMUSICS) {
      if (musicsContent.length > maxMusicPerPage) {
        contentTarget
          .slice(0, 5)
          .forEach((e, i) => setTimeout(() => handleTransition(e), i * 40));
        contentTarget.slice(5, musicsContent.length + 5).forEach((e, i) => {
          const delay = (i % 10) * 40;
          setTimeout(() => handleTransition(e), delay);
        });
      } else {
        contentTarget.forEach((e, i) =>
          setTimeout(() => handleTransition(e), i * 40)
        );
      }
    } else {
      if (
        contentTarget !== getMenu &&
        contentTarget.length - 1 > maxContentPerPage
      ) {
        contentTarget
          .slice(0, 5)
          .forEach((e, i) => setTimeout(() => handleTransition(e), i * 30));
        contentTarget.slice(5, contentTarget.length + 5).forEach((e, i) => {
          const delay = (i % 10) * 30;
          setTimeout(() => handleTransition(e), delay);
        });
      } else {
        contentTarget.forEach((e, i) =>
          setTimeout(() => handleTransition(e), i * 30)
        );
      }
    }
  }

  //Function beralih antar konten Main Menu dan Subkonten
  function menuToggle(contentTarget) {
    logo.classList.toggle("logo-in");
    refresh(getMenu);
    menuTransition(getMenu);
    menuTransition(contentTarget);
  }

  //Function untuk masuk ke subkonten
  function selectedContent(content) {
    if (allowClick) {
      title.classList.remove("title-slide-in");
      allowClick = false;
      inContent = content;
      menuToggle(content);
      refresh(content);

      if (content == getAPP) contentTitle = menuList[1];
      if (content == getDESKTOP) contentTitle = menuList[2];
      if (content == getEXPLORER) contentTitle = menuList[3];
      if (content == getSETTINGS) contentTitle = menuList[4];
      if (content == getWINDOWS) contentTitle = menuList[5];
      if (content == getMUSICS) contentTitle = menuList[6];
      if (content == getBROWSER) contentTitle = `${menuList[8]} SHORTCUT`;
      if (content == getDEV) contentTitle = menuList[9];
      if (content == getEXIT) contentTitle = menuList[menuList.length - 1];

      setTimeout(() => {
        title.classList.add("title-slide-in");
        title.textContent == "MAIN MENU"
          ? (title.textContent = contentTitle)
          : (title.textContent = "MAIN MENU");
      }, 150);
    }
    setTimeout(() => (allowClick = true), 500);
  }

  //Pembuatan listener untuk konten
  function addClickListener(element, callback) {
    element.addEventListener("click", callback);
  }

  //Pembuatan listener untuk mengeksekusi perintah
  function addCommandListener(elements, commands, callback) {
    elements.forEach((element, index) => {
      addClickListener(element, () => {
        if (commands[index]) {
          if (elements == getEXIT) ipcRenderer.send("quit", commands[index]);
          else ipcRenderer.send("run-command", commands[index]);
          callback();
        }
      });
    });
  }

  //Pembuatan listener untuk searchbar pada subkonten
  function addSearchListener(inputElement, catchContainer) {
    inputElement.addEventListener("input", (e) => {
      const searchQuery = e.target.value.toUpperCase();
      allowEscape = true;
      inContainer = catchContainer;
      if (searchQuery == "") {
        page = 0;
        allowEscape = false;
        showMore(page, catchContainer);
        return;
      }
      const allElements = [];
      catchContainer.forEach((subContainer) => {
        const elements = subContainer.querySelectorAll("h1");
        elements.forEach((element) => {
          allElements.push({
            e: element,
            text: element.textContent,
            subContainer,
          });
        });
      });
      const scored = allElements
        .map((obj) => {
          const index = obj.text.indexOf(searchQuery);
          return { ...obj, score: index >= 0 ? index : Infinity };
        })
        .filter((obj) => obj.score !== Infinity)
        .sort((a, b) => a.score - b.score)
        .slice(
          0,
          inputElement == getMusicInput ? maxMusicPerPage : maxContentPerPage
        );

      allElements.forEach((obj) => {
        obj.e.style.display = "none";
        obj.subContainer.style.display = "none";
        obj.subContainer.classList.remove("active");
      });

      scored.forEach((obj) => {
        obj.e.style.display = "";
        obj.subContainer.style.display = "block";
      });

      if (scored.length > 0) scored[0].subContainer.classList.add("active");
    });
  }

  //Pembuatan listener untuk masuk ke explorer dengan path tertentu
  function addPathListener(inputElement) {
    inputElement.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        ipcRenderer.send("run-command", e.target.value);
        e.target.value = "";
      }
    });
  }

  //Menghandle track untuk pemutaran musik selanjutnya
  function handleTrack(elements, items, trackIndex) {
    const responsive = window.innerWidth >= 1920;
    const totalMusic = musicItems.length;
    const totalElement = elements.length;
    const musicOverload = totalMusic > maxMusicPerPage;

    const start = musicOverload ? 5 : 0;
    const end = musicOverload ? totalElement : totalElement - 1;

    elements
      .slice(start, end)
      .forEach((e) => e.classList.remove("musics-ontrack"));

    playDefaultMusic(0);
    music.pause();
    currentTrack.pop();
    currentTrack.push(musicsContent[trackIndex]);

    const nowPlaying = currentTrack[0];
    const nowPLayingCut = currentTrack[0].substring(0, responsive ? 60 : 40);

    getOnTrackElement.textContent = `${
      nowPlaying.length > (responsive ? 63 : 43)
        ? `${nowPLayingCut}...`
        : nowPlaying
    }`;

    playMusic(`${musicPath}/${items[trackIndex]}`);
    elements[musicOverload ? trackIndex + start : trackIndex].classList.add(
      "musics-ontrack"
    );
  }

  //Listener untuk memutar dan menjeda musik
  function addPlayPauseListener(elements, items) {
    const responsive = window.innerWidth >= 1200;
    const totalMusic = musicItems.length;
    const totalElement = elements.length;
    const musicOverload = totalMusic > maxMusicPerPage;

    const start = musicOverload ? 5 : 0;
    const end = musicOverload ? totalElement : totalElement - 1;

    elements.slice(start, end).forEach((element, index) => {
      element.addEventListener("click", () => {
        if (currentTrack.includes(musicsContent[index])) {
          if (playStatus) {
            music.pause();
            playDefaultMusic(1);
            playStatus = false;
            getOnTrackElement.textContent = "";
            element.classList.remove("musics-ontrack");
          } else {
            playDefaultMusic(0);
            music.play();
            playStatus = true;
            getOnTrackElement.textContent = `${
              currentTrack[0].length > (responsive ? 63 : 43)
                ? `${currentTrack[0].substring(0, responsive ? 60 : 40)}...`
                : currentTrack[0]
            }`;
            element.classList.add("musics-ontrack");
          }
        } else {
          elements
            .slice(start, end)
            .forEach((e) => e.classList.remove("musics-ontrack"));
          playDefaultMusic(0);
          music.pause();
          currentTrack.pop();
          currentTrack.push(musicsContent[index]);
          getOnTrackElement.textContent = `${
            currentTrack[0].length > (responsive ? 63 : 43)
              ? `${currentTrack[0].substring(0, responsive ? 60 : 40)}...`
              : currentTrack[0]
          }`;
          trackIndex = index;
          playMusic(`${musicPath}/${items[index]}`);
          element.classList.add("musics-ontrack");
        }
      });
    });
  }

  //Menuju ke halaman musik yang sedang aktif
  function toTrackPage() {
    if (playStatus && trackIndex > 9) {
      page = Math.floor(trackIndex / maxMusicPerPage);
      allowEscape = true;
      showMore(page, catchContainer.musics);
    } else {
      page = 0;
      showMore(page, catchContainer.musics);
    }
  }

  //Menentukan posisi tombol kembali (back)
  function backBtn(getCONTENT) {
    const getEndIndex = getCONTENT.length - 1;

    const isMusic = getCONTENT == getMUSICS;
    const isMusicOverload = musicItems.length > maxMusicPerPage;

    const musicOverload = isMusic && isMusicOverload;
    const setContentPage = isMusic ? maxMusicPerPage : maxContentPerPage;

    const finalStatement = musicOverload ? maxMusicPerPage : setContentPage;
    const findPosition = getEndIndex > finalStatement;
    const backPosition = findPosition ? getEndIndex : 1;

    return getCONTENT[getCONTENT.length - backPosition];
  }

  //Menentukan posisi tombol untuk ke halman selanjutnya (next)
  function nextBtn(getCONTENT) {
    return getCONTENT[2];
  }

  //Menentukan posisi tombol untuk ke halaman awal (begin)
  function beginBtn(getCONTENT) {
    return getCONTENT[3];
  }

  //Menentukan posisi tombol untuk ke halaman akhir (end)
  function endBtn(getCONTENT) {
    return getCONTENT[4];
  }

  //Function untuk menampilkan konten pada halaman atau page
  function showMore(index, catchContainer) {
    catchContainer.forEach((e, i) => {
      const elements = e.querySelectorAll("h1");
      e.style.display = i == index ? "block" : "none";
      e.classList.toggle("active", i == index);
      elements.forEach((element) => (element.style.display = ""));
    });
  }

  //Function untuk menghandle posisi halaman berdasarkan tombol
  function overloadedContent(element, catchContainer, option) {
    if (option == "back") {
      if (page > 0) {
        page--;
        showMore(page, catchContainer);
      } else {
        allowEscape = false;
        selectedContent(element);
        getMusicInput.value = "";
        showMore(page, catchContainer);
      }
    } else if (option == "next") {
      if (page < catchContainer.length - 1) {
        page++;
        inContainer = catchContainer;
        allowEscape = true;
        showMore(page, catchContainer);
      }
    } else if (option == "begin") {
      page = 0;
      inContainer = catchContainer;
      allowEscape = false;
      showMore(page, catchContainer);
    } else if (option == "end") {
      page = catchContainer.length - 1;
      inContainer = catchContainer;
      allowEscape = true;
      showMore(page, catchContainer);
    }
  }

  //Muat Listener Untuk Seluruh Konten
  function loadListeners() {
    //Listener Khusus Untuk Browsing
    getBrowserInput.addEventListener("keydown", (e) => {
      if (e.key == "Enter" && e.target.value) {
        const baseURL = "https://www.google.com/search?q=";
        const searchQuery = e.target.value.replace(/ /g, "+");
        const URL = baseURL + searchQuery;
        ipcRenderer.send("run-command", URL);
        e.target.value = "";
      }
    });

    //Listener khusus (escape) untuk keluar dari subcontent dengan cepat
    window.addEventListener("keydown", (e) => {
      if (e.key == "Escape" && allowEscape) {
        page = 0;
        showMore(page, inContainer);
        selectedContent(inContent);
        allowEscape = false;
        const clickAudio = new Audio(sfx.select);
        clickAudio.volume = clickAudioVolume;
        clickAudio.play();
      }
    });

    //Listener Khusus Untuk Menemukan Path Folder
    addPathListener(getExplorerInput);

    //Listener Khusus Untuk Memutar Musik
    addPlayPauseListener(getMUSICS, musicItems);

    //Listener Dasar Untuk Semua Main Menu
    addClickListener(app, () => selectedContent(getAPP));
    addClickListener(desktop, () => selectedContent(getDESKTOP));
    addClickListener(explorer, () => selectedContent(getEXPLORER));
    addClickListener(settings, () => selectedContent(getSETTINGS));
    addClickListener(windows, () => selectedContent(getWINDOWS));
    addClickListener(browserShortcut, () => selectedContent(getBROWSER));
    addClickListener(dev, () => selectedContent(getDEV));
    addClickListener(exit, () => selectedContent(getEXIT));
    addClickListener(musics, () => {
      toTrackPage();
      selectedContent(getMUSICS);
    });

    //Listener Searchbar & Next Untuk Subkonten Dimanis Yang Berlebih
    if (getAppInput) {
      showMore(page, catchContainer.application);
      addSearchListener(getAppInput, catchContainer.application);
      addClickListener(nextBtn(getAPP), () => {
        overloadedContent(getAPP, catchContainer.application, "next");
      });
      addClickListener(beginBtn(getAPP), () => {
        overloadedContent(getAPP, catchContainer.application, "begin");
      });
      addClickListener(endBtn(getAPP), () => {
        overloadedContent(getAPP, catchContainer.application, "end");
      });
    }
    if (getDesktopInput) {
      showMore(page, catchContainer.desktop);
      addSearchListener(getDesktopInput, catchContainer.desktop);
      addClickListener(nextBtn(getDESKTOP), () => {
        overloadedContent(getDESKTOP, catchContainer.desktop, "next");
      });
      addClickListener(beginBtn(getDESKTOP), () => {
        overloadedContent(getDESKTOP, catchContainer.desktop, "begin");
      });
      addClickListener(endBtn(getDESKTOP), () => {
        overloadedContent(getDESKTOP, catchContainer.desktop, "end");
      });
    }
    if (getMusicInput) {
      showMore(page, catchContainer.musics);
      addSearchListener(getMusicInput, catchContainer.musics);
      addClickListener(nextBtn(getMUSICS), () => {
        overloadedContent(getMUSICS, catchContainer.musics, "next");
      });
      addClickListener(beginBtn(getMUSICS), () => {
        overloadedContent(getMUSICS, catchContainer.musics, "begin");
      });
      addClickListener(endBtn(getMUSICS), () => {
        overloadedContent(getMUSICS, catchContainer.musics, "end");
      });
    }
    if (getBrowserShortcutInput) {
      showMore(page, catchContainer.browser);
      addSearchListener(getBrowserShortcutInput, catchContainer.browser);
      addClickListener(nextBtn(getBROWSER), () => {
        overloadedContent(getBROWSER, catchContainer.browser, "next");
      });
      addClickListener(beginBtn(getBROWSER), () => {
        overloadedContent(getBROWSER, catchContainer.browser, "begin");
      });
      addClickListener(endBtn(getBROWSER), () => {
        overloadedContent(getBROWSER, catchContainer.browser, "end");
      });
    }

    //Listener Untuk Menjalankan Perintah Pada Subkonten
    addCommandListener(getAPP, contentPath.application, () =>
      selectedContent(getAPP)
    );
    addCommandListener(getDESKTOP, contentPath.desktop, () =>
      selectedContent(getDESKTOP)
    );
    addCommandListener(getEXPLORER, contentPath.explorer, () =>
      selectedContent(getEXPLORER)
    );
    addCommandListener(getWINDOWS, contentPath.windows, () =>
      selectedContent(getWINDOWS)
    );
    addCommandListener(getBROWSER, contentPath.browser, () =>
      selectedContent(getBROWSER)
    );
    addCommandListener(getEXIT, contentPath.exit, () =>
      selectedContent(getEXIT)
    );

    //Listener Tombol Back (Kembali)
    addClickListener(backBtn(getAPP), () => {
      getAppInput
        ? overloadedContent(getAPP, catchContainer.application, "back")
        : selectedContent(getAPP);
    });
    addClickListener(backBtn(getDESKTOP), () => {
      getDesktopInput
        ? overloadedContent(getDESKTOP, catchContainer.desktop, "back")
        : selectedContent(getDESKTOP);
    });
    addClickListener(backBtn(getMUSICS), () => {
      getMusicInput
        ? overloadedContent(getMUSICS, catchContainer.musics, "back")
        : selectedContent(getMUSICS);
    });
    addClickListener(backBtn(getBROWSER), () => {
      getBrowserShortcutInput
        ? overloadedContent(getBROWSER, catchContainer.browser, "back")
        : selectedContent(getBROWSER);
    });

    addClickListener(backBtn(getEXPLORER), () => selectedContent(getEXPLORER));
    addClickListener(backBtn(getSETTINGS), () => selectedContent(getSETTINGS));
    addClickListener(backBtn(getWINDOWS), () => selectedContent(getWINDOWS));
    addClickListener(backBtn(getDEV), () => selectedContent(getDEV));
    addClickListener(backBtn(getEXIT), () => selectedContent(getEXIT));
  }
  loadListeners();

  //Lakukan animasi refresh saat window kembali fokus
  ipcRenderer.on("refresh", () => refresh(getMenu));

  //                             AREA KONFIGURASI MODE DEVELOPER                          //

  //Pengaktifan mode developer (hanya dapat dilakukan sekali setiap program dimuat)
  ipcRenderer.once("dev-on", () => {
    notif.textContent = "Developer Mode Active";
    notif.classList.add("notif-in");
    dev.style.display = "";
    setTimeout(() => notif.classList.remove("notif-in"), 2000);
  });

  //Buat elemen untuk konten developer
  getDEV.slice(0, devContent.length).forEach((element) => {
    const dirfile = "(CRUD) (dir|fl) ('name') (path)";
    const fetchAPI = "(url)";
    const startcode = "(path)";

    const isFetch = element.textContent == "FETCH API";
    const isStartCode = element.textContent == "START CODE";
    const placeholder = isStartCode ? startcode : isFetch ? fetchAPI : dirfile;
    const convertToClass = element.textContent
      .toLowerCase()
      .replace(/\s+/g, "");
    const input = document.createElement("input");
    input.setAttribute("class", convertToClass);
    input.setAttribute("placeholder", placeholder);
    input.classList.add("dev-insert");
    element.appendChild(input);
  });

  //Fungsi pengecekan nilai input
  function parseMixedInput(input) {
    const result = [];
    let buffer = "";
    let inQuote = false;
    let quoteChar = "";

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (!inQuote && (char === '"' || char === "'")) {
        // Mulai kutipan
        inQuote = true;
        quoteChar = char;
        if (buffer.trim()) {
          result.push(buffer.trim());
          buffer = "";
        }
      } else if (inQuote && char === quoteChar) {
        // Akhiri kutipan
        result.push(buffer);
        buffer = "";
        inQuote = false;
        quoteChar = "";
      } else if (!inQuote && char === " ") {
        if (buffer.trim()) {
          result.push(buffer.trim());
          buffer = "";
        }
      } else {
        buffer += char;
      }
    }

    // Tambahkan sisa buffer jika ada
    if (buffer.trim()) {
      result.push(buffer.trim());
    }

    return result;
  }

  //Setup variabel untuk menampung nilai
  let result;
  let copyPath;

  //Seleksi semua elemen developer
  const crudDIR = document.querySelector(".cruddir");
  const startCODE = document.querySelector(".startcode");
  const fetchAPI = document.querySelector(".fetchapi");
  const monitor = document.querySelector(".dev-output");

  //Listener untuk mengirim perintah CRUD ke backend
  crudDIR.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      // const result = e.target.value.match(/"(.*)"|\S+/g);
      // const result = e.target.value.match(/'[^']*'|\S+/g);
      // catchCrudQuery = result.map((v) => v.replace(/^'(.*)'$|"(.*)"/, "$1"));
      // catchCrudQuery = result.map((v) => v.replace(/^["']|["']$/g, ""));
      result = parseMixedInput(e.target.value);
      ipcRenderer.send("crud", result);
      e.target.value = "";
    }
  });

  //Listener untuk memulai ngoding ke path tertentu
  startCODE.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      result = e.target.value;
      ipcRenderer.send("start-code", result);
      e.target.value = "";
    }
  });

  //Listener untuk mengambil data API
  fetchAPI.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      result = e.target.value;
      ipcRenderer.send("fetch-api", result);
      e.target.value = "";
    }
  });

  //Terima data dari electron lalu tampilkan ke monitor console
  ipcRenderer.on("output", (event, data) => (monitor.textContent = data));
  ipcRenderer.on("copy", (event, path) => (copyPath = path));

  //Listener untuk copypath dengan menekan elemen parent dari monitor console
  const monitorParent = document.querySelector(".dev-monitor");
  monitorParent.addEventListener("click", () => {
    if (copyPath) {
      navigator.clipboard.writeText(`"${copyPath}"`);
      notif.classList.remove("notif-in");
      notif.textContent = "Path Copied";
      notif.classList.add("notif-in");
      dev.style.display = "";
      setTimeout(() => notif.classList.remove("notif-in"), 2000);
    }
  });
}

//Muat data dan jalankan program
loadData();
