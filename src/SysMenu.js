var gameLayer
var SysMenu = cc.Layer.extend({
    _ship: null,
    labelFiftyBird: null,
    labelEnter: null,
    labelCount: null,
    startGame: false,
    count: 5,
    background: null,
    ground: null,
    score: 0,
    labelScore: null,

    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {

        this.initBackGround();
        this.onStartGame()
        this.startGame = true
        this.hideLabel()
        this.addTouchListener();

        return true;
    },
    initBackGround: function () {
        this.background = BackGround.create()
        this.addChild(this.background, 0, 1)
        this.ground = new cc.Sprite(res.ground_png)
        this.ground.attr({
            anchorX: 0,
            anchorY: 0,
            scale: 2
        })
        this.addChild(this.ground, 0, 2)
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
    hideLabelCount: function () {
        this.removeChild(this.labelCount)
    },
    onNewGame: function () {
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
    onStartGame: function () {
        this.initStartGame()
        this.scheduleUpdate()
    },
    initStartGame: function () {
        this.hideLabelCount()
        winSize = cc.director.getWinSize()
        var bird = Bird.create()
        this.addChild(bird, 0, 1)
        this.labelScore = new cc.LabelTTF("score: " + this.score, res.flappy_ttf, 24)
        this.labelScore.attr({
            anchorX: 0,
            anchorY: 0,
            x: 10,
            y: winSize.height - 30
        })
        this.addChild(this.labelScore, 10)
        this.schedule(this.initPipe, 0.5)
    },
    initPipe: function () {
        winSize = cc.director.getWinSize()
        var top = {
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width,
            y: winSize.height,
            scaleY: 0.4,
            scaleX: 0.5
        }
        var bottom = {
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width,
            y: 32,
            scaleY: 0.4,
            scaleX: 0.5
        }
        var pipeTop = Pipe.create(top)
        pipeTop.setRotation(180)
        var pipeBottom = Pipe.create(bottom)
        this.addChild(pipeTop, 1)
        this.addChild(pipeBottom, 1)
    },
    removePipe(pipe) {
        this.removeChild(pipe)
    },
    countDown: function (dt) {
        if (this.count) {
            this.count--
            this.labelCount.setString('' + this.count);
        } else {
            this.onStartGame()
        }
    },
    update: function (dt) {
        this.background.scroll()
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
    gameLayer = new SysMenu();
    scene.addChild(gameLayer);
    return scene;
};

