// phina.js をグローバル領域に展開
phina.globalize();

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;
var time=10;
var animation=['up','down','left','right'];

// グローバル変数
var grobalGroup = null;
var boxes=[];

var ASSETS = {
  // 画像
  image: {
    'toma': 'tomapiyo.png',
    'nasu': 'nasupiyo.png',
  },
  // スプライトシート
  spritesheet: {
    'toma_sprite': 'toma.tmss',
    'nasu_sprite': 'nasu.tmss',
  },
};

phina.define('Main', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    var self=this;
    grobalGroup = DisplayElement().addChildTo(this);
    grobalGroup2 = DisplayElement().addChildTo(this);
    // 背景
    this.backgroundColor = 'lightgreen';

    var bg =  DisplayElement().addChildTo(this);
    var group =  DisplayElement().addChildTo(this);

    for(var i=0; i<5; i++){
      //var shape = Shape().setSize(100,10).setPosition(100+100*i,100+100*i).setRotate(45).addChildTo(bg);
    }
    //var shape = Shape().setSize(640,50).setPosition(320,960-25).addChildTo(bg);

    //var ground = Sprite('ground', 640, 240).setPosition(320,840).addChildTo(bg);

    // スプライト画像作成
    var sprite = Sprite('toma', 64, 64).addChildTo(group);
    // スプライトにフレームアニメーションをアタッチ
    var anim = FrameAnimation('toma_sprite').attachTo(sprite);
    anim.fit = false;
    sprite.setSize(100,100);
    // アニメーションを指定
    anim.gotoAndPlay('down');

    // 初期位置
    sprite.x = SCREEN_WIDTH/2;
    sprite.y = SCREEN_HEIGHT/2;
    //anim.ss.getAnimation('down').frequency = 3;

    var rect = RectangleShape({
      width: 50,
      height: 70,
      fill: null,
      stroke: 'red',
    }).addChildTo(sprite);


    sprite.update= function(app){
      var k = app.keyboard;
      /*this.y += 5;
      // 地面に着いたら反発する
      if (this.top > 960) {
        this.bottom = 0;
      }*/
      if(k.getKey('up')){
        this.y -=5;
        if(anim.currentAnimation.next!='up'){
            anim.gotoAndPlay('up');
          }

      }
      if(k.getKey('down')){
        this.y +=5;
        if(anim.currentAnimation.next!='down'){
            anim.gotoAndPlay('down');
          }

      }
      if(k.getKey('left')){
        this.x -=5;
        if(anim.currentAnimation.next!='left'){
            anim.gotoAndPlay('left');
          }
      }

      if(k.getKey('right')){
        this.x +=5;
        if(anim.currentAnimation.next!='right'){
            anim.gotoAndPlay('right');
          }
      }
      if(rect.hitTestElement==boxes){
        console.log("hit");
      }
}


  },

  update:function(){
    time--;
    if(time==0){
      time=20;
      // スプライト画像作成

      var sprite2 = Sprite('nasu', 96, 96).addChildTo(grobalGroup);
      // スプライトにフレームアニメーションをアタッチ
      var anim = FrameAnimation('nasu_sprite').attachTo(sprite2);
      anim.fit = false;
      sprite2.setSize(96,96);

      var box = RectangleShape({
        width: 50,
        height: 70,
        fill: null,
        stroke: 'black',
      }).addChildTo(sprite2);
      boxes.push(box);

      var rand = Math.floor(Math.random()*(4));
      anim.gotoAndPlay(animation[rand]);

      switch(rand){
        case 0://up
        sprite2.x = 48+Math.floor(Math.random()*(SCREEN_WIDTH-96));
        sprite2.top = SCREEN_HEIGHT;
        sprite2.vx=0;
        sprite2.vy=-5;
        break;

        case 1://down
        sprite2.x = 48+Math.floor(Math.random()*(SCREEN_WIDTH-96));
        sprite2.bottom = 0;
        sprite2.vx=0;
        sprite2.vy=5;
        break;

        case 2://left
        sprite2.y = 48+Math.floor(Math.random()*(SCREEN_HEIGHT-96));
        sprite2.right = 0;
        sprite2.vx=5;
        sprite2.vy=0;
        break;

        case 3://right
        sprite2.y = 48+Math.floor(Math.random()*(SCREEN_HEIGHT-96));
        sprite2.left = SCREEN_WIDTH;
        sprite2.vx=-5;
        sprite2.vy=0;
        break;

      }

      sprite2.update= function(){
        this.x += this.vx;
        this.y += this.vy;



        if (this.top > 960 || this.bottom < 0) {
          this.remove();
        }

        if (this.left > 960 || this.right < 0) {
          this.remove();
        }
      }
    }
  },


  onpointstart: function() {

  }



});

// メイン処理
phina.main(function() {

  // アプリケーションを生成
  var app = GameApp({
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

  // 実行
  app.run();
});
