# MiSide-Desktop-Main-Menu
Project Javascript Electron - MiSide Desktop Main Menu

Proyek ini dibuat menggunakan bahasa javascript dan menggunakan framework electron. Electron memungkinkan browser window jalan di lingkungan desktop yang disebut sebagai chronium.
Proyek ini dapat langsung dibuild dan dijalankan menjadi sebuah file exe (Aplikasi Desktop).

## Guide
Ketika aplikasi pertama kali dijalankan, menu aplikasi, desktop, dan music akan kosong ketika dibuka. Untuk mengisinya, pengguna harus mengisikan lokasi atau pathnya di file data.json.
file data.json didapatkan di folder resource dari lokasi pengguna menginstal aplikasi.

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
