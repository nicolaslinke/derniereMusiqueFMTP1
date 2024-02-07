import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { first, firstValueFrom, lastValueFrom } from 'rxjs';
import { Album } from 'src/models/Album';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public http : HttpClient){}

  albums : Album[] = []

  album ?: Album;

  chosenAlbum ?: Album;

  search ?: string;

  songs : string[] = [];
  
  async searchAlbums() : Promise<void>{
    this.albums = [];

    //Get top albums from searched celebritie
    let tempAlbums = await lastValueFrom(this.http.get<any>("https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" 
    +  this.search + "&api_key=9a8a3facebbccaf363bb9fd68fa37abf&format=json"));

    for (let i = 0; i < tempAlbums.topalbums.album.length - 40; i++) {
      let tempAlbum = await lastValueFrom(this.http.get<any>("https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=9a8a3facebbccaf363bb9fd68fa37abf&artist="
       +  this.search + "&album=" + tempAlbums.topalbums.album[i].name + "&format=json"));

      this.songs = [];
      for (let j = 0; j < tempAlbum.album.tracks.track.length; j++) {
        this.songs.push(tempAlbum.album.tracks.track[j].name);
      }

      this.album = new Album(tempAlbum.album.artist,tempAlbum.album.name,tempAlbum.album.image[2]["#text"],this.songs);
      this.albums.push(this.album);
    }
  }

  clickAlbum(a : Album) {
    console.log(a);
    this.chosenAlbum = a;
  }
}

