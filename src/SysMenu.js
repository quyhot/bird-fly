var SysMenu = cc.Layer.extend({
    _ship: null,
    labelFiftyBird: null,
    labelEnter: null,
    labelCount: null,
    startGame: false,
    count: 5,


    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {

        var winSize = cc.director.getWinSize();

        this.initBackGround();
        this.addTouchListener();

        // var singalHeight = MW.menuHeight;
        // var singalWidth = MW.menuWidth;
        // var newGameNormal = new cc.Sprite(res.menu_png, cc.rect(0, 0, singalWidth, singalHeight));
        // var newGameSelected = new cc.Sprite(res.menu_png, cc.rect(0, singalHeight, singalWidth, singalHeight));
        // var newGameDisabled = new cc.Sprite(res.menu_png, cc.rect(0, singalHeight * 2, singalWidth, singalHeight));
        //
        // var gameSettingsNormal = new cc.Sprite(res.menu_png, cc.rect(singalWidth, 0, singalWidth, singalHeight));
        // var gameSettingsSelected = new cc.Sprite(res.menu_png, cc.rect(singalWidth, singalHeight, singalWidth, singalHeight));
        // var gameSettingsDisabled = new cc.Sprite(res.menu_png, cc.rect(singalWidth, singalHeight * 2, singalWidth, singalHeight));
        //
        // var aboutNormal = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, 0, singalWidth, singalHeight));
        // var aboutSelected = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, singalHeight, singalWidth, singalHeight));
        // var aboutDisabled = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, singalHeight * 2, singalWidth, singalHeight));
        // var flare = new cc.Sprite(res.flare_jpg);
        // this.addChild(flare, 15, 10);
        // flare.visible = false;
        // var newGame = new cc.MenuItemSprite(newGameNormal, newGameSelected, newGameDisabled, function () {
        //     this.onButtonEffect();
        //     //this.onNewGame();
        //     flareEffect(flare, this, this.onNewGame);
        // }.bind(this));
        // var gameSettings = new cc.MenuItemSprite(gameSettingsNormal, gameSettingsSelected, gameSettingsDisabled, this.onSettings, this);
        // var about = new cc.MenuItemSprite(aboutNormal, aboutSelected, aboutDisabled, this.onAbout, this);
        // newGame.scale = MW.SCALE;
        // gameSettings.scale = MW.SCALE;
        // about.scale = MW.SCALE;
        //
        // var menu = new cc.Menu(newGame, gameSettings, about);
        // menu.alignItemsVerticallyWithPadding(15);
        // this.addChild(menu, 1, 2);
        // menu.x = winSize.width / 2;
        // menu.y = winSize.height / 2 - 140;
        //
        // var label = new cc.LabelTTF("Power by Cocos2d-JS", "Arial", 21);
        // label.setColor(cc.color(MW.FONTCOLOR));
        // this.addChild(label, 1);
        // label.x = winSize.width  / 2;
        // label.y = 80;
        //
        // this.schedule(this.update, 1, 5);
        //
        // this._ship = new cc.Sprite("#ship03.png");
        // this.addChild(this._ship, 0, 4);
        // this._ship.x = Math.random() * winSize.width;
        // this._ship.y = 0;
        // this._ship.runAction(cc.moveBy(2, cc.p(Math.random() * winSize.width, this._ship.y + winSize.height + 100)));
        //
        // if (MW.SOUND) {
        //     cc.audioEngine.setMusicVolume(0.7);
        //     cc.audioEngine.playMusic(cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT ? res.mainMainMusic_wav : res.mainMainMusic_mp3, true);
        // }

        return true;
    },
    initBackGround: function () {
        this.addChild(BackGround.create(), 0, 1)
        var ground = new cc.Sprite(res.ground_png)
        ground.attr({
            anchorX: 0,
            anchorY: 0,
            scale: 2
        })
        this.addChild(ground, 0, 2)
        this.initLabel()
    },

    initLabel: function () {
        var winSize = cc.director.getWinSize();
        this.labelFiftyBird = new cc.LabelTTF("Fifty Bird", res.flappy_ttf, 36)
        this.labelFiftyBird.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width / 2,
            y: winSize.height / 1.5
        });
        this.addChild(this.labelFiftyBird, 0, 3)
        this.labelEnter = new cc.LabelTTF("press enter", res.flappy_ttf, 24)
        this.labelEnter.attr({
            anchorX: 0.5,
            anchorY: 1,
            x: winSize.width / 2,
            y: winSize.height / 1.5 - 5
        });
        this.addChild(this.labelEnter, 0, 3)
    },

    hideLabel: function () {
        this.removeChild(this.labelFiftyBird)
        this.removeChild(this.labelEnter)
    },

    onNewGame: function (pSender) {
        winSize = cc.director.getWinSize();
        this.labelCount = new cc.LabelTTF(this.count, res.flappy_ttf, 36)
        this.labelCount.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width / 2,
            y: winSize.height / 1.5
        });
        this.addChild(this.labelCount, 0, 5)
        this.schedule(this.countDown, 1, 5);
        // setTimeout(this.countDown(this), 1000)
    },
    countDown: function (dt) {
        if (this.count) {
            this.count--
            this.labelCount.setString('' + this.count);
        } else {
            console.log('start game')
        }

    },
    update: function (dt) {
        // if (this._ship.y > 750) {
        //     this._ship.x = Math.random() * winSize.width;
        //     this._ship.y = 10;
        //     this._ship.runAction(cc.moveBy(
        //         parseInt(5 * Math.random(), 10),
        //         cc.p(Math.random() * winSize.width, this._ship.y + 750)
        //     ));
        // }
    },
    addTouchListener: function () {
        var self = this
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var location = target.convertToNodeSpace(touch.getLocation());
                self.hideLabel()
                if (self.startGame) {
                    console.log('start game')
                } else {
                    self.onNewGame()
                }
            }
        }, this)
    },
});

SysMenu.scene = function () {
    var scene = new cc.Scene();
    var layer = new SysMenu();
    scene.addChild(layer);
    return scene;
};
