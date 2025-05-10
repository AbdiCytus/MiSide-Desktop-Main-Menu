//Import modul electron
const {
  app,
  shell,
  ipcMain,
  BrowserWindow,
  globalShortcut,
} = require("electron");

//Import modul node js
const { exec } = require("child_process");
const fs = require("fs");
const dns = require("dns");
const path = require("path");

//                                         SETUP DATA JSON                                         //

// const jsonFile = "./data.json" Pengambilan data saat tahap pengembangan
// const jsonFile = path.join(process.resourcesPath, "./data.json"); Pengambilan data saat siap dibuild

//Baca data dari file json
const jsonFile = "./data.json";
const readData = fs.readFileSync(jsonFile, "utf8");
let dataJSON = JSON.parse(readData);

//Tampung data json ke variabel
const appsPath = dataJSON.apps.path;
const desktopPath = dataJSON.desktop.path;
const musicPath = dataJSON.musics.path;

//Tampung data saat melakukan perubahan atau menambahkan data baru
const appsItems = [];
const desktopDir = [];
const desktopItems = {};
const musicItems = [];

//Function untuk memperbarui data json
function updateItems(target, data) {
  dataJSON[target].items = data;
  fs.writeFileSync(jsonFile, JSON.stringify(dataJSON, null, 2), "utf-8");
}

function updateDataControl(target, data) {
  dataJSON.control[target] = data;
  fs.writeFileSync(jsonFile, JSON.stringify(dataJSON, null, 2), "utf-8");
}

//Function untuk memuat dan mengambil data dari json
function loadData() {
  if (appsPath) {
    try {
      const directory = fs.readdirSync(appsPath);
      directory.forEach((items) => {
        const getExt = path.extname(items);
        const getName = path.parse(items).name.toUpperCase();
        const extList = [".lnk", ".url", ".exe"];
        if (getExt && extList.includes(getExt)) {
          const getShortcut = `${appsPath}/${items}`;
          const appObj = { name: getName, path: getShortcut };
          appsItems.push(appObj);
        }
      });
      updateItems("apps", appsItems);
    } catch (err) {}
  } else updateItems("apps", []);

  if (desktopPath) {
    try {
      const directory = fs.readdirSync(desktopPath);
      directory.forEach((items) => {
        const getExt = path.extname(items);
        const getPath = path.join(desktopPath, items);
        const getName = path.parse(items).name.toUpperCase();
        if (getExt) {
          if (getExt == ".lnk") {
            const getShortcut = shell.readShortcutLink(
              `${desktopPath}/${items}`
            );
            const stat = fs.statSync(getShortcut.target);
            if (stat.isDirectory()) {
              desktopItems[getName] = getShortcut.target;
              desktopDir.push(getName);
            }
          }
        } else {
          desktopItems[getName] = getPath;
          desktopDir.push(getName);
        }
      });
    } catch (err) {}
    updateItems("desktop", desktopItems);
  } else updateItems("desktop", desktopItems);

  if (musicPath) {
    try {
      const directory = fs.readdirSync(musicPath);
      directory.forEach((items) => {
        const musicExt = [".mp3", ".m4a", ".ogg"];
        const getExt = path.extname(items);
        if (getExt && musicExt.includes(getExt)) musicItems.push(items);
      });
    } catch (err) {}
    updateItems("musics", musicItems);
  } else updateItems("musics", musicItems);
}

//Lakukan pengambilan data
loadData();

//                                         LISTENER DEVELOPER                                         //

//Mengeksekusi perintah create
function handleCreate(getPathAndDir, query) {
  const isFile = /\.[a-zA-Z0-9]+$/.test(query[2]);

  const queryENTITY = query[1] == "fl" ? "file" : "folder";
  const queryOK = `QUERY OK! ${queryENTITY} successfull create.`;
  const queryBLOCK = `QUERY BLOCKED! ${queryENTITY} with same name already exist.`;
  const queryERROR = `QUERY ERROR! file must have an extension`;

  const outputQUERY = `{ option: "${query[0]}", entity: "${query[1]}" }`;
  const outputPARAMS = `{ name: "${query[2]}", path: "${query[3]}" }`;

  const finalOUTPUT = `QUERY: ${outputQUERY}\nPARAMS: ${outputPARAMS}\n`;

  if (!fs.existsSync(getPathAndDir)) {
    try {
      if (query[1] == "fl") {
        if (isFile) fs.writeFileSync(getPathAndDir, "");
        else return `${finalOUTPUT}\n${queryERROR}`;
      } else fs.mkdirSync(getPathAndDir);
      return `${finalOUTPUT}\n${queryOK}`;
    } catch (err) {}
  } else return `${finalOUTPUT}\n${queryBLOCK}`;
}

//Mengeksekusi perintah read
function handleRead(getPathAndDir, query, wantCreate) {
  const isFile = /\.[a-zA-Z0-9]+$/.test(getPathAndDir);

  const queryENTITY = query[1] == "fl" ? "file" : "folder";
  const queryERROR = `QUERY ERROR! cannot find ${query[2]} ${queryENTITY} at the specific path.`;

  const outputQUERY = `{ option: "${query[0]}", entity: "${query[1]}" }`;
  const outputPARAMS = `{ name: "${query[2]}", path: "${query[3]}" }`;
  const outputPARAMSnoName = `{ path: "${query[2]}" }`;

  const finalOUTPUT = `QUERY: ${outputQUERY}\nPARAMS: ${outputPARAMS}\n`;
  const finalOUTPUT2 = `QUERY: ${outputQUERY}\nPARAMS: ${outputPARAMSnoName}\n`;

  if (fs.existsSync(getPathAndDir)) {
    try {
      let queryOK;
      if (query[1] == "fl") {
        if (isFile) {
          const readFileData = fs.readFileSync(getPathAndDir, "utf-8");
          queryOK = `QUERY OK!\n\ndata: {\n${readFileData}\n}`;
        } else return `${finalOUTPUT}\n${queryERROR}`;
      } else {
        const readDir = fs.readdirSync(getPathAndDir);
        const mapDir = readDir.map((item, i) => `  ${i + 1}. "${item}"`);
        const folderData = mapDir.join("\n");
        queryOK = `QUERY OK!\n\ndata: {\n${folderData}\n}\nTotal items: ${readDir.length}`;
      }

      if (wantCreate) return `${finalOUTPUT}\n${queryOK}`;
      else return `${finalOUTPUT2}\n${queryOK}`;
    } catch (err) {}
  } else return `${finalOUTPUT}\n${queryERROR}`;
}

//Mengeksekusi perintah update
function handleUpdate(query) {
  const isFile = /\.[a-zA-Z0-9]+$/.test(query[2]);
  const isFile2 = /\.[a-zA-Z0-9]+$/.test(query[3]);
  const queryENTITY = query[1] == "fl" ? "file" : "folder";

  //Rencananya mau pakai ini, tapi ga pakai tetap bisa, yaudahlah arsipkan saja.
  // const updateFileList = ["-n", "-w"];
  // const getUpdateCMD = query[3].slice(0, 2);

  const getPathAndDirUpdate = path.join(query[4], query[2]);
  const getDirAndUpdate = path.join(query[4], query[3]);

  const queryOK = `QUERY OK! ${queryENTITY} name successfull update.`;
  const queryOK2 = `QUERY OK! file content successfull update.`;
  const queryBLOCK = `QUERY BLOCKED! ${queryENTITY} with same name already exist`;
  const queryERROR = `QUERY ERROR! ${queryENTITY} ${query[2]} not found.`;

  const outputQUERY = `{ option: "${query[0]}", entity: "${query[1]}" }`;
  const outputUNDEFINED = `{ name: "${query[2]}", update_param: "${query[3]}", path: "${query[4]}" }`;
  const outputPARAMSNAME = `{ old_name: "${query[2]}", new_name: "${query[3]}", path: "${query[4]}" }`;
  const outputPARAMSWRITE = `{ new_content: "${query[3]}", path: "${query[4]}" }`;

  const finalOUTPUT = `QUERY: ${outputQUERY}\nPARAMS: ${outputPARAMSNAME}\n`;
  const finalOUTPUT2 = `QUERY: ${outputQUERY}\nPARAMS: ${outputPARAMSWRITE}\n`;
  const finalOUTPUT3 = `QUERY: ${outputQUERY}\nPARAMS: ${outputUNDEFINED}\n`;

  if (!fs.existsSync(getPathAndDirUpdate))
    return `${finalOUTPUT3}\n${queryERROR}`;
  if (query[1] == "fl") {
    if (isFile) {
      if (isFile2) {
        if (fs.existsSync(getDirAndUpdate))
          return `${finalOUTPUT}\n${queryBLOCK}`;
        else {
          fs.renameSync(getPathAndDirUpdate, getDirAndUpdate);
          return `${finalOUTPUT}\n${queryOK}`;
        }
      } else {
        fs.writeFileSync(getPathAndDirUpdate, query[3]);
        return `${finalOUTPUT2}\n${queryOK2}`;
      }
    } else return `${finalOUTPUT3}\n${queryERROR}`;
  } else {
    if (fs.existsSync(getDirAndUpdate)) return `${finalOUTPUT}\n${queryBLOCK}`;
    else {
      fs.renameSync(getPathAndDirUpdate, getDirAndUpdate);
      return `${finalOUTPUT}\n${queryOK}`;
    }
  }
}

//Mengeksekusi perintah delete
function handleDelete(getPathAndDir, query) {
  const isFile = /\.[a-zA-Z0-9]+$/.test(query[2]);

  const queryENTITY = query[1] == "fl" ? "file" : "folder";
  const queryOK = `QUERY OK! ${queryENTITY} successfull delete.`;
  const queryERROR = `QUERY ERROR! ${queryENTITY} ${query[2]} not found.`;

  const outputQUERY = `{ option: "${query[0]}", entity: "${query[1]}" }`;
  const outputPARAMS = `{ name: "${query[2]}", path: "${query[3]}" }`;

  const finalOUTPUT = `QUERY: ${outputQUERY}\nPARAMS: ${outputPARAMS}\n`;

  if (fs.existsSync(getPathAndDir)) {
    try {
      if (query[1] == "fl") {
        if (isFile) fs.unlinkSync(getPathAndDir);
        else return `${finalOUTPUT}\n${queryERROR}`;
      } else fs.rmSync(getPathAndDir, { recursive: true, force: true });
      return `${finalOUTPUT}\n${queryOK}`;
    } catch (err) {}
  } else return `${finalOUTPUT}\n${queryERROR}`;
}

//Function melakukan cek URL
function isURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

//                                     PEMBUATAN HALAMAN BROWSER WINDOW                                  //

let win, totalProcess;
function createWindow() {
  //Setup halaman
  win = new BrowserWindow({
    skipTaskbar: true,
    fullscreen: true,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: __dirname + "/assets/img/mita.ico",
  });

  //Buat shortkey untuk menjalankan perintah tertentu
  function shortcut(key) {
    const process = `powershell "(gps | where { $_.MainWindowTitle }).Count"`;
    exec(process, (err, stdout) => {
      totalProcess = parseInt(stdout.trim());
      if (totalProcess < 4) {
        switch (key) {
          case "Control+F":
            win.focus();
            break;
          case "Control+R":
            app.quit();
            app.relaunch();
            break;
          default:
            break;
        }
      }
    });
  }

  //Daftar shortkey
  const keyFocus = "Control+F";
  const keyRefresh = "Control+R";
  const keyDev = "Alt+D";

  //Daftarkan shortkey
  globalShortcut.register(keyFocus, () => shortcut(keyFocus));
  globalShortcut.register(keyRefresh, () => shortcut(keyRefresh));
  globalShortcut.register(keyDev, () => win.webContents.send("dev-on"));

  //Fokuskan halaman saat dimuat dan atur posisi halamannya
  win.focus();
  win.setBounds({ x: 0, y: 0 });

  //Window saat blur
  win.on("blur", () => {
    win.setIgnoreMouseEvents(true);
    win.webContents.send("music-pause");
  });

  //Window saat fokus
  win.on("focus", () => {
    win.setIgnoreMouseEvents(false);
    win.webContents.send("refresh");
    win.webContents.send("music-play");
  });

  //Handle pembacaan data dari JSON untuk html
  ipcMain.handle("get-data", async () => {
    const data = fs.readFileSync(jsonFile, "utf-8");
    return JSON.parse(data);
  });

  //Muat halaman html
  setTimeout(() => win.loadURL(`file://${__dirname}/public/index.html`), 1000);

  //Terima perintah CRUD dari frontend dan lakukan pengecekan
  ipcMain.on("crud", (event, query) => {
    if (query.length == 1 && query[0] == "clear") {
      win.webContents.send("output", "");
    } else {
      const crudList = ["create", "read", "update", "delete"];
      const entityList = ["fl", "dir"]; //fl = file | dir = direktori

      const wantCreate = query.length == 4;
      const justRead = query.length == 3;
      const wantUpdate = query.length == 5;

      const checkLength = wantCreate || justRead || wantUpdate ? true : false;
      const crudCheck = crudList.includes(query[0]);
      const entityCheck = entityList.includes(query[1]);

      const findPath = () => {
        try {
          let stats;
          const resolve = wantCreate
            ? query[3]
            : wantUpdate
            ? query[4]
            : query[2];

          if (resolve == "desktop" && desktopPath) {
            query[3] == "desktop" ? (query[3] = desktopPath) : query[3];
            query[4] == "desktop" ? (query[4] = desktopPath) : query[4];
            query[2] == "desktop" ? (query[2] = desktopPath) : query[2];
            stats = fs.statSync(desktopPath);
          } else stats = fs.statSync(resolve);

          if (query[0] == crudList[1] && query[1] == entityList[0] && justRead)
            return true;
          else return stats.isDirectory();
        } catch (err) {
          return false;
        }
      };

      const pathCheck = findPath();
      const finalCheck = checkLength && entityCheck && crudCheck && pathCheck;

      if (finalCheck) {
        const pathDir = wantCreate
          ? path.join(query[3], query[2])
          : path.join(query[2]);

        const copyPath = wantCreate
          ? query[3]
          : wantUpdate
          ? query[4]
          : query[2];
        win.webContents.send("copy", copyPath);

        if (query[0] == crudList[0] && wantCreate) {
          win.webContents.send("output", handleCreate(pathDir, query));
        } else if (query[0] == crudList[1] && (wantCreate || justRead)) {
          win.webContents.send(
            "output",
            handleRead(pathDir, query, wantCreate)
          );
        } else if (query[0] == crudList[2] && wantUpdate) {
          win.webContents.send("output", handleUpdate(query));
        } else if (query[0] == crudList[3] && wantCreate) {
          win.webContents.send("output", handleDelete(pathDir, query));
        }
      } else {
        const isCrudValid =
          crudList.includes(query[0]) && entityList.includes(query[1]);
        const errorFileOrPath =
          "ERROR! looks like something wrong with your folder/file name or path";
        const errorCrud = "QUERY ERROR! invalid query";
        const errorMessage = isCrudValid ? errorFileOrPath : errorCrud;
        win.webContents.send("output", errorMessage);
      }
    }
  });

  //Terima path dari frontend, lakukan pengecekan, eksekusi perintah
  ipcMain.on("start-code", (event, path) => {
    if (fs.existsSync(path)) {
      exec(`code "${path}"`);
      const validPath = `starting code to path: ${path}...`;
      win.webContents.send("output", validPath);
    } else
      win.webContents.send(
        "output",
        "INVALID path or the directory is does'nt exist"
      );
  });

  //Terima url dari frontend, lakukan pengecekan, ambil data
  ipcMain.on("fetch-api", (event, url) => {
    let output;
    if (isURL(url)) {
      dns.lookup("google.com", (err) => {
        if (err && err.code == "ENOTFOUND") {
          output = "ERROR! cannot fetch data in offline status";
          win.webContents.send("output", output);
        } else {
          async function getData(url) {
            try {
              const res = await fetch(url);
              const data = await res.json();
              output = JSON.stringify(data, null, 2);
              win.webContents.send("output", output);
            } catch (err) {
              output = "ERROR! data not found";
              win.webContents.send("output", output);
            }
          }
          getData(url);
        }
      });
    } else output = "ERROR! invalid url";
    win.webContents.send("output", output);
  });
}

ipcMain.on("debug", (e, data) => console.log(data));

//Terima perubahan nilai volume dari frontend, kemudian lakukan perubahan data ke json
ipcMain.on("control-music", (e, data) =>
  updateDataControl("musicVolume", data)
);
ipcMain.on("control-sfx", (e, data) => updateDataControl("sfxVolume", data));
ipcMain.on("track-setting", (e, data) => updateDataControl("playOption", data));
ipcMain.on("disable-music", (e, data) =>
  updateDataControl("disableMusic", data)
);

//Mengeksekusi perintah yang dikirim oleh frontend
ipcMain.on("run-command", (e, command) => {
  command.includes("cmd") && desktopPath
    ? exec(`start cmd /K "cd ${desktopPath}"`)
    : exec(`powershell start '${command}'`);
});
ipcMain.on("quit", (e, command) => {
  command == "main menu"
    ? exec(`powershell "Stop-Process -Name 'MiSide Desktop Main Menu'"`)
    : exec(command);
});

//Buat halaman window ketika semua fungsionalitas aplikasi sudah siap
app.whenReady().then(() => createWindow());
