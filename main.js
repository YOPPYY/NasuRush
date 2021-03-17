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
var count=0;
var breaktime=30-6;
var data;

// グローバル変数
var playergroup = null;
var enemyrgroup = null;

// mobile backendアプリとの連携
var ncmb = new NCMB("5e30184db77257aa7a8d40dcff29327e40b2f51e02c9114340b17471b1d693aa","cd55c73b9c3e6094a3ccd11a29d7817fc80d338cdb38afa801c9c93bd2ff3af4");
var dataurl ='https://raw.githubusercontent.com/YOPPYY/NasuRush/master/data.js';
var ASSETS = {
  // 画像
  image: {
    'toma': 'tomapiyo.png',
    'nasu': 'nasupiyo.png',
    'icon':'icon.png',
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

    /*
    Button({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT-100,width:200,height:50,fill:'yellow',text:'ランキング',fontColor: 'black'})
    .addChildTo(this)
    .onpointstart = function(){
      $.getJSON(dataurl, (getdata) => {
        // JSONデータを受信した後に実行する処理
        //data = getdata;
        var t='ランキング'
        for(var i=0; i<5; i++){
          t += '\n' + getdata[i].rank + "位:";
          t += getdata[i].score + ' ';
          t += getdata[i].name;
        }
        alert(t);
      })
    }
    */
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

  onpointstart: function() {

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
      strokeWidth:5,
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
        if(this.y<0+16){this.y=0+16}
        if(anim.currentAnimation.next!='up'){
          anim.gotoAndPlay('up');
        }
      }

      if(k.getKey('down') || k.getKey('s')){
        this.y +=speed;
        if(this.y>SCREEN_HEIGHT-16){this.y=SCREEN_HEIGHT-16}
        if(anim.currentAnimation.next!='down'){
          anim.gotoAndPlay('down');
        }
      }

      if(k.getKey('left') || k.getKey('a')){
        this.x -=speed;
        if(this.x<0+16){this.x=0+16}
        if(anim.currentAnimation.next!='left'){
          anim.gotoAndPlay('left');
        }
      }

      if(k.getKey('right') || k.getKey('d')){
        this.x +=speed;
        if(this.x>SCREEN_WIDTH-16){this.x=SCREEN_WIDTH-16}
        if(anim.currentAnimation.next!='right'){
          anim.gotoAndPlay('right');
        }
      }

    }


  },

  update:function(){
    score++;
    //interval=Math.max(20,start-Math.floor(score/200));
    now++;
    label.text=score;

    if(score%600==0){
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
      count++;

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

      var alert=Sprite('icon', 96, 96).setPosition(pos.x,pos.y).setRotation(pos.r).setScale(0.5).addChildTo(this)
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
          self.app.pushScene(GameOver());
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
  init: function() {
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

    var label1 = Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2-32,fontSize:48,fill:color,stroke:'black',text:'スコア : '+score}).addChildTo(this);
    var label2 = Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2+32,fontSize:48,fill:'white',stroke:'black',text:'ハイスコア : '+hi}).addChildTo(this);
    var label4 = Label({x:SCREEN_WIDTH/2,y:75,fontSize:48,fill:'yellow',stroke:'black',text:'ランキング'}).addChildTo(this);


    var group = DisplayElement().addChildTo(this);
    var ranking=[];
/*
    $.getJSON(dataurl, (getdata) => {
      // JSONデータを受信した後に実行する処理
      //data = getdata;
      var t='ランキング'
      for(var i=0; i<5; i++){
        var getrank = i+1;
        var getscore = getdata[i].score;
        var getname = getdata[i].name;

        var result =  (i+1) + "位 : " + getscore + " " + getname;
        label[i]=Label({x:SCREEN_WIDTH/4,y:150+50*i,fontSize:32,fill:'white',stroke:'black',text:result,align:"left"}).addChildTo(group);

      }

      //判定
      var rank=1;
      for(var i=0; i<getdata.length; i++){
        if(score < getdata[i].score){
          rank=i+2;
        }
      }


      //登録
      if(rank<=5){
        // 登録
        var name = prompt(rank + "位にランクイン！\n名前を入力してください","Nanashi");
        var add ={ rank:rank, score:score, name:name};
        getdata.splice(rank-1,0,add);
      }
      getdata.pop();

      //更新
      for(var i=0; i<5; i++){
        label[i].remove();
        result=i+1 +"位 : "+getdata[i].score+" "+getdata[i].name;
        label[i]=Label({x:SCREEN_WIDTH/4,y:150+50*i,fontSize:32,fill:'white',stroke:'black',text:result,align:"left"}).addChildTo(group);
      }


      $.post(dataurl, getdata, function() {
        // このコールバックはpostが成功した際に実行されます
        alert("送信しました");
      })
    })*/

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
console.log(ranking);
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





//SoundManager.play();
//var label4 = Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2+128,fontSize:48,fill:'white',stroke:'black',text:''}).addChildTo(this);


// ポーズ解除ボタン
Label({
  text: 'TAP TO RETRY',
  fill: 'white',
  stroke: 'black',
  fontSize:48,
}).addChildTo(this)
.setPosition(this.gridX.center(), SCREEN_HEIGHT*2/3);

},

onpointstart: function() {
  location.reload();
}

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


  app.enableStats();  // コレだけ!!!
  // 実行
  app.run();
});
