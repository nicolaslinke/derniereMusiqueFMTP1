import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { first, firstValueFrom, lastValueFrom } from 'rxjs';
import { Album } from 'src/models/Album';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(public http : HttpClient){}

  album ?: Album;

  search ?: string;

  songs : string[] = [];

  artists ?: string;
  
  async request() : Promise<void>{
    let x = await lastValueFrom(this.http.get<any>("https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" 
    +  this.search + "&api_key=9a8a3facebbccaf363bb9fd68fa37abf&format=json"));

    console.log(x);

    for (let i = 0; i < x.topalbums.album.length; i++) {
      let y = await lastValueFrom(this.http.get<any>("https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=9a8a3facebbccaf363bb9fd68fa37abf&artist="
       +  this.search + "&album=" + x.topalbums.album[i].name + "&format=json"));
       console.log(y);
    }
  }

  async ngOnInit() : Promise<void>{
    let x = await lastValueFrom(this.http.get<any>("https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=9a8a3facebbccaf363bb9fd68fa37abf&artist=Cher&album=Believe&format=json"))
    console.log(x);
    for (let i = 0; i < x.album.tracks.track.length; i++) {
      this.songs.push(x.album.tracks.track[i].name);
    }
    console.log(this.songs);
    this.album = new Album(x.album.artist,x.album.name,x.album.image[2]["#text"],this.songs);
  }
}

