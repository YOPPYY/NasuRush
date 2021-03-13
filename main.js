// phina.js をグローバル領域に展開
phina.globalize();

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;
var start=50;
var interval=start;
var animation=['up','down','left','right'];
var anim;
var temp;
var self;
var score=0;
var label;
var speed=2.5;
var now=0;
var count=0;

// グローバル変数
var playergroup = null;
var enemyrgroup = null;

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

      if(k.getKey('up')){
        this.y -=speed;
        if(anim.currentAnimation.next!='up'){
          anim.gotoAndPlay('up');
        }

      }
      if(k.getKey('down')){
        this.y +=speed;
        if(anim.currentAnimation.next!='down'){
          anim.gotoAndPlay('down');
        }

      }
      if(k.getKey('left')){
        this.x -=speed;
        if(anim.currentAnimation.next!='left'){
          anim.gotoAndPlay('left');
        }
      }

      if(k.getKey('right')){
        this.x +=speed;
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

    if(now==interval){

      now=0;
      count++;


      if(count%5==0){
        interval=Math.max(10,interval-1);
      }

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


  onpointstart: function() {

  }



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
    var label1 = Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2-32,fontSize:48,fill:'white',stroke:'black',text:'スコア : '+score}).addChildTo(this);
    var label2 = Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2+32,fontSize:48,fill:'white',stroke:'black',text:'ハイスコア : '+hi}).addChildTo(this);

    if(hi<score){
      var label3 = Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/3,fontSize:48,fill:'yellow',stroke:'black',text:'NEW RECORD'}).addChildTo(this);
      localStorage.setItem('hi',score);
    }

    //SoundManager.play();
    //var label4 = Label({x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2+128,fontSize:48,fill:'white',stroke:'black',text:''}).addChildTo(this);


    //    SoundManager.playMusic('hit');

    // ポーズ解除ボタン
    Button({
      text: 'Retry',
    }).addChildTo(this)
    .setPosition(this.gridX.center(), SCREEN_HEIGHT*2/3)
    .onpush = function() {
      location.reload();
    };

  },
});

// メイン処理
phina.main(function() {

  // アプリケーションを生成
  var app = GameApp({
    fps: 60, // fps指定
    query: '#canvas',
    // Scene01 から開始
    startLabel: 'main',
    assets: ASSETS,
    // シーンのリストを引数で渡す
    scenes: [
      {
        className: 'Main',
        label: 'main',
      },
    ]
  });

  app.domElement.addEventListener('touchend', function dummy() {
    var s = phina.asset.Sound();
    s.loadFromBuffer();
    s.play().stop();
    app.domElement.removeEventListener('touchend', dummy);
  });
  app.enableStats();  // コレだけ!!!
  // 実行
  app.run();
});
