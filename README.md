# MiSide-Desktop-Main-Menu

Project Javascript Electron - MiSide Desktop Main Menu

Proyek ini dibuat menggunakan bahasa javascript dan menggunakan framework electron. Electron memungkinkan browser window jalan di lingkungan desktop yang disebut sebagai chronium.
Proyek ini dapat langsung dibuild dan dijalankan menjadi sebuah file exe (Aplikasi Desktop).

# Guide

## Sebagai Pengguna

Ekstrak folder zip Miside Desktop Main Menu.zip ke folder manapun. Lalu jalankan Miside Desktop Main Menu.exe untuk menjalankan aplikasi.

Setup aplikasi selesai.

## Sebagai Developer

Clone source code github, lalu masuk ke proyeknya, buka terminal jalankan npm install untuk mengunduh depedensi.
Setelah menginstal depedensi, jalankan npm run build untuk melakukan build (Pastikan menggunakan hak administrator).

Sebagai developer kamu dapat mengaksesnya lewat aplikasinya melalui folder dist yang sudah dilakukan build.
Atau kamu dapat langsung menjalankan program ini dengan npm start di terminal.
Jika kamu menjalankan program menggunakan npm start, ada dua variabel pengambilan data json pada file main.js
Ada untuk pengembangan dan build. Pakailah variabel yang menggunakan pengembangan.

Setup aplikasi selesai.

## Masalah

Ketika aplikasi pertama kali dijalankan, menu aplikasi, desktop, dan music akan kosong ketika dibuka. Untuk mengisinya, pengguna harus mengisikan lokasi atau pathnya di file data.json.
file data.json didapatkan di folder resource dari lokasi pengguna menginstal aplikasi.

Selanjutnya, aplikasi ini berjalan dengan layar fullscreen bahkan pengguna tidak dapat mengakses taskbar.
Solusinya? gunakan kombinasi key Alt + Tab agar dapat taskbar dapat kembali di akses, atau pengguna harus masuk ke aplikasi lain terlebih dahulu untuk dapat mengakses taskbar.
Taskbar dapat kembali diakses ketika pengguna membuka aplikasi lain.

Jika setelah menggunakan aplikasi menu tidak bisa diinteraksi, gunakan kombinasi key Ctrl+F atau Ctrl+R untuk memfokuskan atau mereload kembali menu. Agar kombinasi ini bekerja, pengguna harus mengclose semua program yang berjalan terlebih dahulu.

## Aturan Pengisian Data

Sebelum mengisi data, pastikan aplikasinya diclose atau dimatikan terlebih dahulu.

1. Menu Application:
   Pengguna harus menyediakan sebuah folder yang berisikan shortcut aplikasi dengan ekstensi .url, .lnk, dan .exe. Selain itu maka tidak akan terbaca.
   Copy path dari folder tersebut lalu masuk ke file data.json, tempel di bagian "path" pada "apps". Pastikan path berada di antara dua tanda petik ganda.
   Setelah selesai, jalankan kembali aplikasi kemudian cek kembali menu Application.

2. Menu Desktop:
   Pengguna harus mengcopy lokasi atau path dari desktop pada komputernya, kemudian buka file data.json tempel pathnya di bagian "path" pada "desktop".
   Data yang akan dibaca hanya sebuah folder pada desktop, selain itu akan diabaikan.

3. Menu Musics:
   Pengguna harus menyediakan sebuah folder yang berisikan file dengan ekstensi .mp3, .ogg, dan .m4a. Selain itu maka tidak akan terbaca.
   Copy path dari folder tersebut lalu masuk ke file data.json, tempel di bagian "path" pada "musics". Pastikan path berada di antara dua tanda petik ganda.
   Setelah selesai, jalankan kembali aplikasi kemudian cek kembali menu Musics.

4. Menu Browser Shortcut:
   Pengguna dapat menambahkan shortcut url ke web tertentu. Jika ingin menambahkan shortcut pastikan membuatnya dengan format seperti berikut.
   { "name": "nama shortcut", "link": "link urlnya" }.

## Kombinasi Key

Ctrl+F = Memfokuskan kembali menu.
Ctrl+R = Mereload kembali menu.
Alt+Tab = Untuk dapat mengakses taskbar kembali.
Alt+D = Membuka menu developer

## Menu Developer

Gunakan kombinasi key Alt+D untuk masuk ke mode developer dan membuka menu developer.

CRUD DIR = dapat melakukan CRUD folder dan file.
Cara penggunaan:

- CREATE = create fl example.json d:/storage (Membuat file example.json ke lokasi disk d folder storage).
- CREATE = create dir example c:/storage (Membuat folder example ke lokasi disk c folder storage).

- READ = read fl example.json d:/storage | atau | read fl d:/storage/example.json
- READ = read dir example c:/storage | atau | read dir c:/storage/example

- UPDATE = update fl example.json ex.json d:/storage (Mengubah nama file).
- UPDATE = update fl example.json "Hello, World!" d:/storage (Mengubah isi file).
- UPDATE = update dir example ex c:/storage (Mengubah nama folder).

- DELETE = delete fl example.json d:/storage (Menghapus file).
- DELETE = delete dir example c:/storage (Menghapus folder).
