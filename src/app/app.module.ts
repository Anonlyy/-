import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import {SearchMusicService} from "./service/search-music.service";

// free
import {IconModule,ModalModule,InputtextModule,SidenavModule,ButtonModule,NotificationModule} from 'freeng/freeng';

import { MenuComponent } from './menu/menu.component'; //accordion
import { LoginAlertComponent } from './alert/loginAlert.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {UserService} from "./service/user.service";
import {AccordionModule} from "freeng/component/accordion/accordion.component";
import { ContentIndexComponent } from './content-index/content-index.component';
import {MusicService} from "./service/music.service";
import {BadgeModule} from "freeng/component/badge/badge.component";
import {CookieService} from "angular2-cookie/services/cookies.service";
import {ElModule } from "element-angular";
import "element-theme-default";
import {AppRoutingModule} from "./app-routing.module";
import { SongListComponent } from './song-list/song-list.component';
import { ErrorComponent } from './error/error.component';
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {TabGroupModule} from "freeng/component/tab/tab.component";
@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    MenuComponent,
    LoginAlertComponent,
    ContentIndexComponent,
    SongListComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    IconModule,
    ModalModule,
    InputtextModule,
    SidenavModule,
    TabGroupModule,
    AccordionModule,
    ButtonModule,
    NotificationModule,
    BadgeModule,
    ElModule
  ],
  providers: [MusicService,UserService,CookieService, {provide:LocationStrategy,useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
