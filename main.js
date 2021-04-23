// phina.js をグローバル領域に展開
phina.globalize();
var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;
var start=30;
var interval=start;
var animation=['up','down','left','right'];
var anim;
var temp;
var self;
var score=0;
var label;
var label2;
var level=1;
var speed=2.5;
var now=0;
//var count=0;
const time= 450;
var data;
var white;
var red;
var dx=0;
var dy=0;
var aniname='down';
// グローバル変数
var group;
var playergroup = null;
var enemyrgroup = null;


var ASSETS = {
  // 画像
  image: {
    'toma': 'tomapiyo.png',
    'nasu': 'nasupiyo.png',
    'icon':'https://raw.githubusercontent.com/YOPPYY/NasuRush/master/icon.png',
  },
  // スプライトシート
  spritesheet: {
    'toma_sprite': 'toma.tmss',
    'nasu_sprite': 'nasu.tmss',
  },
  sound: {
    'bgm': 'sound/mist.mp3',
    'go': 'sound/ikuzo.mp3',
    'alert':'sound/alert.mp3',
    'hit': 'sound/damage.mp3',
  }
};

phina.define('Title', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    self=this;
    group = DisplayElement().addChildTo(this);
    this.backgroundColor = 'gray';

    var p1=[1,1,1,1,0,0,0,1,1,1,1];
    var p2=[1,1,1,0,0,0,1,1,1];
    for(var i=0; i<p1.length; i++){
      if(p1[i]==1){
        var rect=RectangleShape({width:SCREEN_WIDTH/3,height:32,fill:'white'}).setPosition(SCREEN_WIDTH/2,SCREEN_HEIGHT*i/p1.length+40).addChildTo(this);
      }
    }
    for(var i=0; i<p2.length; i++){
      if(p2[i]==1){
        var rect=RectangleShape({width:32,height:SCREEN_HEIGHT/4,fill:'white'}).setPosition(SCREEN_WIDTH*i/p2.length+36,SCREEN_HEIGHT/2).addChildTo(this);
      }
    }

    label = Label({
      text:'ナスラッシュ',
      fontSize: 80,
      x:SCREEN_WIDTH/2,
      y:SCREEN_HEIGHT/4,
      fill:'white',
      stroke:'purple',
      strokeWidth:5,
    }).addChildTo(this);

    label = Label({
      text:'TAP TO START',
      fontSize: 64,
      x:SCREEN_WIDTH/2,
      y:SCREEN_HEIGHT*3/4,
      fill:'white',
      stroke:'purple',
      strokeWidth:5,
    }).addChildTo(this);


    // スプライト画像作成
    player = Sprite('toma', 64, 64).addChildTo(this).setSize(96,96);
    player.x=SCREEN_WIDTH/2;
    player.y=SCREEN_HEIGHT/2;

    // スプライトにフレームアニメーションをアタッチ
    anim = FrameAnimation('toma_sprite').attachTo(player);
    anim.fit = false;
    // アニメーションを指定
    anim.gotoAndPlay('down');







  },

  update:function(){

  },

  onpointstart:function(){
    this.exit();
  }


});

phina.define('Main', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    self=this;
    var bg =  DisplayElement().addChildTo(this);

    enemygroup = DisplayElement().addChildTo(this);
    playergroup = DisplayElement().addChildTo(this);
    // 背景
    this.backgroundColor = 'gray';

    var p1=[1,1,1,1,0,0,0,1,1,1,1];
    var p2=[1,1,1,0,0,0,1,1,1];
    for(var i=0; i<p1.length; i++){
      if(p1[i]==1){
        var rect=RectangleShape({width:SCREEN_WIDTH/3,height:32,fill:'white'}).setPosition(SCREEN_WIDTH/2,SCREEN_HEIGHT*i/p1.length+40).addChildTo(bg);
      }
    }
    for(var i=0; i<p2.length; i++){
      if(p2[i]==1){
        var rect=RectangleShape({width:32,height:SCREEN_HEIGHT/4,fill:'white'}).setPosition(SCREEN_WIDTH*i/p2.length+36,SCREEN_HEIGHT/2).addChildTo(bg);
      }
    }

    SoundManager.playMusic('bgm');
    SoundManager.play('go');
    /*
    var rect1=RectangleShape({width:SCREEN_WIDTH,height:64,fill:'gray'}).setPosition(SCREEN_WIDTH/2,32).addChildTo(bg);
    var rect2=RectangleShape({width:SCREEN_WIDTH,height:64,fill:'gray'}).setPosition(SCREEN_WIDTH/2,SCREEN_HEIGHT-32).addChildTo(bg);
    var rect3=RectangleShape({width:64,height:SCREEN_HEIGHT,fill:'gray'}).setPosition(32,SCREEN_HEIGHT/2).addChildTo(bg);
    var rect4=RectangleShape({width:64,height:SCREEN_HEIGHT,fill:'gray'}).setPosition(SCREEN_WIDTH-32,SCREEN_HEIGHT/2).addChildTo(bg);
    */
    label = Label({
      text:'',
      fontSize: 48,
      x:SCREEN_WIDTH/2,
      y:32,
      fill:'blue',
      //stroke:'blue',
      strokeWidth:5,
    }).addChildTo(this);

    label2 = Label({
      text: 'レベル : '+level,
      fontSize: 24,
      x:120,
      y:32,
      fill:'white',
      stroke:'black',
      strokeWidth:3,
    }).addChildTo(this);


    // スプライト画像作成
    player = Sprite('toma', 64, 64).addChildTo(playergroup)
    .setSize(96,96);
    player.collider.setSize(48, 48).offset(0,8);

    // スプライトにフレームアニメーションをアタッチ
    anim = FrameAnimation('toma_sprite').attachTo(player);
    anim.fit = false;
    // アニメーションを指定
    anim.gotoAndPlay('down');

    // 初期位置
    player.x = SCREEN_WIDTH/2;
    player.y = SCREEN_HEIGHT/2;


    player.update= function(app){
      var k = app.keyboard;
      var flag_x = false;
      var flag_y = false;

      //if(k.getKey('up') && k.getKey('down')){console.log("")}
      if(k.getKey('up') || k.getKey('w')){
        this.y -=speed;
        aniname='up';
      }

      if(k.getKey('down') || k.getKey('s')){
        this.y +=speed;
        aniname='down';
      }

      if(k.getKey('left') || k.getKey('a')){
        this.x -=speed;
        aniname='left';
      }

      if(k.getKey('right') || k.getKey('d')){
        this.x +=speed;
        aniname='right';
      }
      if(anim.currentAnimation.next!=aniname){
        anim.gotoAndPlay(aniname);
      }

    }

  },
  onpointstart: function(e) {

    white = CircleShape({

      fill: 'white',
      radius:100,
    }).addChildTo(this);
    white.alpha=0.5;

    red = CircleShape({
      fill: 'red',
      x: 100,
      y: 100,
    }).addChildTo(this);
    red.alpha=0.5;

    white.x = e.pointer.x;
    white.y = e.pointer.y;
    red.x = e.pointer.x;
    red.y = e.pointer.y;
    //this.exit();
  },

  onpointstay: function(e) {

  },

  onpointmove: function(e) {

    dy=0;
    dx=0;
    var vec_x = e.pointer.x-white.x;
    var vec_y = e.pointer.y-white.y;

    red.x = e.pointer.x;
    red.y = e.pointer.y;

    var r = 100; //limit_rad

    var animane='down';


    //上限、下限設定
    //whiteとpointerからangleを計算
    //(white.x,white.y)(e.pointer.x,e.pointer.y)
    //Math.atan2( y2 - y1, x2 - x1 ) ;
    var x1=white.x;
    var y1=white.y;
    var x2=e.pointer.x;
    var y2=e.pointer.y;
    var rad = Math.atan2( y2 - y1, x2 - x1 ) ;
    //var angle = rad * ( 180 / Math.PI );
    //console.log(angle);
    //r,angleからlimit_x,limit_yを計算
    var limit_x = white.x + Math.cos(rad) * r;
    var limit_y = white.y + Math.sin(rad) * r;
    var limit_x2 = white.x + Math.cos(rad) * (r+32);
    var limit_y2 = white.y + Math.sin(rad) * (r+32);
    //console.log(limit_x+","+limit_y)

    //vec_x,vec_yからdx,dy計算
    //
    var vec_r = Math.min(100,Math.sqrt( Math.pow( x2-x1, 2 ) + Math.pow( y2-y1, 2 ) )) ;




    var fill='red';


    if(vec_x>0){
      if(vec_x>limit_x-white.x){vec_x=limit_x-white.x;fill='blue';red.x=limit_x2}
      dx=vec_x/r *speed;
    }
    if(vec_x<0){
      if(vec_x<limit_x-white.x){vec_x=limit_x-white.x;fill='blue';red.x=limit_x2}
      dx=vec_x/r *speed;
    }
    if(vec_y>0){
      if(vec_y>limit_y-white.y){vec_y=limit_y-white.y;fill='blue';red.y=limit_y2}
      dy=vec_y/r *speed;
      aniname='down';
    }
    if(vec_y<0){
      if(vec_y<limit_y-white.y){vec_y=limit_y-white.y;fill='blue';red.y=limit_y2}
      dy=vec_y/r *speed;
      aniname='up';
    }

    /*
    //入力
    if(vec_x!=0){
    if(vec_x>0){
    if(vec_x>limit_x-white.x){dx=speed;fill='blue';}
    else{dx = vec_x/(limit_x - white.x)*speed}
    //console.log("right")
  }
  if(vec_x<0){
  if(vec_x<limit_x-white.x){dx=-speed;fill='blue';}
  else{dx = -vec_x/(limit_x - white.x)*speed}
  //  console.log("left")
}
}
else{dx=0}

//y入力
if(vec_y!=0){
if(vec_y>0){
aniname='down';
if(vec_y>limit_y-white.y){dy=speed;fill='blue';}
else{dy = vec_y/(limit_y-white.y)*speed}
//console.log("down")
}
if(vec_y<0){
aniname='up';
if(vec_y<limit_y-white.y){dy=-speed;fill='blue';}
else{dy = -vec_y/(limit_y-white.y)*speed}
//console.log("up")
}
}
else{dy=0}
*/

red.fill=fill;

//横移動アニメーション
if(Math.abs(vec_x)>Math.abs(vec_y)){
  if(vec_x>0){aniname='right';}
  else{aniname='left';}
}
},

onpointend:function(e){
  dy=0;
  dx=0;
  red.remove();
  white.remove();
},

update:function(){
  score++;
  //interval=Math.max(20,start-Math.floor(score/200));
  now++;
  label.text=score;
  if(dx>speed){dx=speed;}  if(dx<-speed){dx=-speed;}
  if(dy>speed){dy=speed;}  if(dy<-speed){dy=-speed;}

  player.x += dx ;
  player.y += dy ;

  if(player.y<32){player.y=32}
  if(player.y>SCREEN_HEIGHT-32){player.y=SCREEN_HEIGHT-32}
  if(player.x<32){player.x=32}
  if(player.x>SCREEN_WIDTH-32){player.x=SCREEN_WIDTH-32}

  if(score%time==0){
    level++;

    interval=Math.max(10,interval-1);
    //if(interval==breaktime){
    //  interval=breaktime+3;
    //  breaktime=Math.max(10,interval-6);
    //}
    var t='';
    if(interval==10){t='MAX'}else{t=level;}
    label2.text= 'レベル : '+t;
  }


  //console.log(interval);
  if(now>interval){

    now=0;
    //count++;

    // スプライト画像作成

    var enemy = Sprite('nasu', 96, 96).addChildTo(enemygroup).setSize(96,96);
    enemy.collider.setSize(32, 48).offset(0,8);
    SoundManager.play('alert');
    // スプライトにフレームアニメーションをアタッチ
    var anim2 = FrameAnimation('nasu_sprite').attachTo(enemy);
    anim2.fit = false;

    var rand = Math.floor(Math.random()*(4));
    anim2.gotoAndPlay(animation[rand]);

    var pos={x:0,y:0,r:0};
    switch(rand){
      case 0://up
      enemy.x = 48+Math.floor(Math.random()*(SCREEN_WIDTH-96));
      pos.x=enemy.x;
      pos.y=SCREEN_HEIGHT-50;
      pos.r=0;
      enemy.top = SCREEN_HEIGHT+32;
      enemy.vx=0;
      enemy.vy=-speed;
      break;

      case 1://down
      enemy.x = 48+Math.floor(Math.random()*(SCREEN_WIDTH-96));
      pos.x=enemy.x;
      pos.y=50;
      pos.r=180;
      enemy.bottom = 0-32;
      enemy.vx=0;
      enemy.vy=speed;
      break;

      case 2://left
      enemy.y = 48+Math.floor(Math.random()*(SCREEN_HEIGHT-96));
      pos.x=50;
      pos.y=enemy.y;
      pos.r=-270;
      enemy.right = 0-32;
      enemy.vx=speed;
      enemy.vy=0;
      break;

      case 3://right
      enemy.y = 48+Math.floor(Math.random()*(SCREEN_HEIGHT-96));
      pos.x=SCREEN_WIDTH-50;
      pos.y=enemy.y;
      pos.r=-90;
      enemy.left = SCREEN_WIDTH+32;
      enemy.vx=-speed;
      enemy.vy=0;
      break;

    }

    var alert=Sprite('icon').setSize(48, 48).setPosition(pos.x,pos.y).setRotation(pos.r).addChildTo(this)
    alert.time=20;
    //    SoundManager.play('alert');
    alert.update=function(){
      alert.time--;
      alert.alpha=(alert.time/20);
      if (alert.time==0) {
        alert.remove();
      }
    }

    enemy.update= function(){
      this.x += this.vx;
      this.y += this.vy;


      if (enemy.collider.hitTest(player.collider)) {
        //console.log("hit");
        anim.gotoAndPlay('hit');
        anim2.gotoAndPlay('hit');
        label.remove();
        SoundManager.stopMusic('bgm');
        SoundManager.play('hit');
        self.app.pushScene(GameOver(score));
      }

      if (this.top > SCREEN_HEIGHT+64 || this.bottom < 0-64) {
        this.remove();
      }

      if (this.left > SCREEN_HEIGHT+64 || this.right < 0-64) {
        this.remove();
      }
    }
  }
},


});

/*
* ポーズシーン
*/
phina.define("GameOver", {
  // 継承
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function(score) {
    // 親クラス初期化
    this.superInit();
    // 背景を半透明化
    this.backgroundColor = 'rgba(0, 0, 0, 0.7)';

    score-=1;
    var hi=0
    if(!localStorage.getItem('hi')){hi=0}
    else{hi = parseInt(localStorage.getItem('hi'),10);}

    var color='white'
    if(hi<score){
      //var label3 = Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/3,fontSize:48,fill:'yellow',stroke:'black',text:'NEW RECORD'}).addChildTo(this);
      localStorage.setItem('hi',score);
      color='yellow';
    }

    var label1 = Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT*3/4-32,fontSize:48,fill:color,stroke:'black',text:'スコア : '+score}).addChildTo(this);
    var label2 = Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT*3/4+32,fontSize:48,fill:'white',stroke:'black',text:'ハイスコア : '+hi}).addChildTo(this);
    var label4 = Label({x:SCREEN_WIDTH/2,y:75,fontSize:48,fill:'yellow',stroke:'black',text:'ランキング'}).addChildTo(this);


    var group = DisplayElement().addChildTo(this);
    var result;
    var rank=1;

    const Ranking=function(){
      return new Promise(function(resolve, reject) {

        db.collection("Score")
        .orderBy('score','desc')
        .orderBy('date', 'desc')
        .limit(1000)//念のため
        .get()
        .then((snapShot) => {

          var i=0;
          snapShot.forEach((doc) => {

            if(score<doc.get("score")){rank++}
            i++;

          })
          resolve();
        })
        .catch(function (error) {
          Label({x:320,y:150,fontSize:48,fill:'white',stroke:'black',text:"取得失敗"}).addChildTo(group);
        });
      });
    }

    const Alert=function(){
      return new Promise(function(resolve, reject) {
        if(rank<=1000){var b=rank + "位にランクイン！\n";}
        else{var b="";}
        var name = prompt(b+"名前を入力してください","Nanashi");
        if(!name){name="Nanashi"}

        //送信
        //ここから
        var date = new Date();

        db.collection("Score").add({
          score:score,
          date:date,
          name:name,
        })
        .then(function (doc) {
          console.log("送信成功")
        })
        .catch(function (error) {
          console.log("送信失敗")
        });

        //ここまで
        resolve();

      });
    }

    //再取得
    const Disp=function(){
      return new Promise(function(resolve, reject) {
        db.collection("Score")
        .orderBy('score','desc')
        .orderBy('date', 'desc')
        .limit(10)//念のため
        .get()
        .then((snapShot) => {

          var i=0;
          snapShot.forEach((doc) => {

            i++;

            //console.log("rank:"+rank);
            //表示
            var getscore = doc.get("score");
            var getname = doc.get("name");
            var getrank = i;
            var t =  getrank + " : " + getscore + " " + getname;
            Label({x:SCREEN_WIDTH/4,y:100+50*i,fontSize:32,fill:'white',stroke:'black',text:t,align:"left"}).addChildTo(group);



          })
          resolve();
        })
        .catch(function (error) {
          Label({x:320,y:150,fontSize:48,fill:'white',stroke:'black',text:"取得失敗"}).addChildTo(group);
        });


        //ここまで
        resolve();

      });
    }

    Ranking()
    .then(Alert)
    .then(Disp)




    /*
    // クラスのTestClassを作成
    var TestClass = ncmb.DataStore("HiScore");
    // データストアへの登録
    var testClass = new TestClass();
    // スコアの降順で5件取得
    TestClass.order("Score", true)
    .limit(5)
    .fetchAll()
    .then(function(objects){

    // 取得に成功した場合の処理

    for (var i=0; i<objects.length; i++) {
    var getscore = objects[i].get("Score");
    var getname = objects[i].get("name");
    var getrank = i+1;
    result =  (i+1) + "位 : " + getscore + " " + getname;
    label[i]=Label({x:SCREEN_WIDTH/4,y:150+50*i,fontSize:32,fill:'white',stroke:'black',text:result,align:"left"}).addChildTo(group);
    ranking.push({s:getscore,n:getname});
  }

  //判定
  var rank=1;
  for(var i=0; i<ranking.length; i++){
  if(score < ranking[i].s){
  rank=i+2;
}
}

//登録
if(rank<=5){
// 登録
var name = prompt(rank + "位にランクイン！\n名前を入力してください","Nanashi");
testClass.set("Score", score);
testClass.set("name", name);
testClass.save()
.then(function(){
// 保存に成功した場合の処理
})
.catch(function(err){
// 保存に失敗した場合の処理
});

// 保存に成功した場合の処理
ranking.splice(rank-1,0,{s:score,n:name});
//console.log(ranking);
for(var i=0; i<ranking.length-1; i++){
label[i].remove();
result=i+1 +"位 : "+ranking[i].s+" "+ranking[i].n;
label[i]=Label({x:SCREEN_WIDTH/4,y:150+50*i,fontSize:32,fill:'white',stroke:'black',text:result,align:"left"}).addChildTo(group);
}
}

})
.catch(function(err){
// 取得に失敗した場合の処理
});
*/




//SoundManager.play();
//var label4 = Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2+128,fontSize:48,fill:'white',stroke:'black',text:''}).addChildTo(this);

/*
// ポーズ解除ボタン
Label({
text: 'ENTERキー または\n 画面タップでリトライ',
fill: 'white',
stroke: 'black',
fontSize:48,
}).addChildTo(this)
.setPosition(this.gridX.center(), SCREEN_HEIGHT*2/3);
*/
},

update:function(app){

  var k = app.keyboard;

  if(/*k.getKey('space') ||*/ k.getKey('enter')){
    location.reload();
  }
},
onpointstart: function() {
  location.reload();
},


});

// メイン処理
phina.main(function() {

  // アプリケーションを生成
  var app = GameApp({
    fps: 60, // fps指定
    query: '#canvas',
    // Scene01 から開始
    startLabel: 'title',
    assets: ASSETS,
    // シーンのリストを引数で渡す
    scenes: [
      {
        className: 'Title',
        label: 'title',
        next: 'main',
      },
      {
        className: 'Main',
        label: 'main',
      },
    ]
  });


  //app.enableStats();  // コレだけ!!!
  // 実行
  app.run();
});
