import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MusicService, EmitSong} from "../service/music.service";
import {Song} from "../content-index/content-index.component";

// redux
import {Store} from "@ngrx/store";
import * as fromRoot from '../ngrx';
import {Observable} from "rxjs";

@Component({
  selector: 'song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  id:string;
  playListDetail:PlayListDetail = new PlayListDetail('0','null','/assets/image/loading.jpg','暂无描述',[],0,'admin','/assets/image/loading.jpg'); //歌单详情对象
  song:Song = new Song('0','null','null','0','/assets/image/loading.jpg','0',0);
  songList=[];//存储所有歌曲对象
  songIds= [];//存储所有歌曲对象的id
  albumList = []; //存储所有专辑单曲
  default ='/assets/image/loading.jpg';
  currentPlayIndex = {
    id:'0',
    index:0
  };//正在播放
  select:number;
  number$: Observable<number>;
  number = 0;
  listType:number = 0; //1为歌单页,2为专辑页
  isLoading:boolean = true;

  constructor(public routerInfo:ActivatedRoute,public musicService:MusicService,private store:Store<fromRoot.State>) {
    this.number$ = store.select(fromRoot.getNumber)
  }
  ngOnInit() {
    const _this = this;
    this.routerInfo.params.subscribe(
      result=>{
        let data:any = result;
        _this.id = data.id;

        if(data.type=="1"||data.type==""||data.type==null){
          _this.listType = 1;
          _this.getPlayList(_this.id);
          console.log('歌单页');
        }
        else if(data.type=="2"){
          _this.listType = 2;
          _this.getAlbums(_this.id);
          console.log('专辑页');
        }
      }
    )




    //ngrx
    _this.number$.subscribe(num => {
      // _this.number = num;
      if(_this.number!==num){
        console.log('刷新');
        _this.getPlayList(_this.id);
      }
    });

  }
  //获取歌单详情
  public getPlayList(id:string){
    const _this = this;
    _this.musicService.getPlayListDetail(id).subscribe(
      result=>{
        let data = result.playlist;
        if(result.code==200){
          _this.playListDetail = new PlayListDetail(
            data.id,
            data.name,
            data.coverImgUrl,
            data.description?data.description:'###这位同志很懒,暂无歌单描述###',
            data.tags,
            data.trackCount,
            data.creator.nickname,
            data.creator.avatarUrl
          );
          _this.songList = [];
          let arList;
          for(let item of result.playlist.tracks){
            arList = [];
            for(let j of item.ar){arList.push(j.name)}
            _this.song = new Song(item.id,item.name,arList.join('/'),item.ar[0].id,item.al.picUrl,item.al.name,item.dt);
            _this.songList.push(_this.song);
            //添加id进数组
            _this.songIds.push(item.id);
          }
          _this.isLoading = false;
        }
        // console.log(result);
      },
      error=>{
        console.log('error',error);
      }
    )
  }

  //获取专辑详情
  public getAlbums(id:string){
    const _this = this;
    _this.musicService.getAlbumList(id).subscribe(
      result=>{
        let songs = result.songs;
        let album = result.album;
        if(result.code==200){
          _this.playListDetail = new PlayListDetail(
            album.id,
            album.name,
            album.picUrl,
            album.description?album.description:'###暂无专辑描述###',
            (album.tags==""||album.tags.length==0)?[]:album.tags,
            album.size,
            album.artist.name,
            album.artist.picUrl
          );
          _this.albumList = [];
          let arList;
          for(let item of songs){
            arList = [];
            for(let j of item.ar){arList.push(j.name)}
            _this.song = new Song(item.id,item.name,arList.join('/'),item.ar[0].id,'',item.ar[0].name,item.dt,item.pop);
            _this.albumList.push(_this.song);
            //添加id进数组
          }
          // _this.isLoading = false;
        }
        console.log(_this.albumList);
      },
      error=>{
        console.log('error',error);
      }
    )
  }

  //图片加载错误
  public updateUrl(e){
    e.src = this.default;
  }
  //播放全部
  public playAllSong(){
    const _this = this;
    //播放所有歌曲,默认以第一首为当前歌曲
    this.musicService.emitSong.emit(new EmitSong(_this.songList[0],_this.songIds));
  }
  //双击播放音乐
  public playMusic(index:number){
    const _this = this;
    _this.select = index;
    _this.currentPlayIndex = {
      index:index,
      id:_this.songList[index].id
    }
    this.musicService.emitSong.emit(new EmitSong(_this.songList[index],_this.songIds));
  }
}


// 歌单详情对象
export class PlayListDetail{
  constructor(
    public id:string,
    public name:string,//歌单名字
    public picUrl:string, //歌单图片
    public desc:string,
    public tags:string[], //标签数组
    public trackCount:number, //歌单歌曲数目
    public nickname:string,//歌单作者姓名
    public avatarUrl:string, //歌单作者头像
    public songList?:Song[] //歌单歌曲
  ){}
}
