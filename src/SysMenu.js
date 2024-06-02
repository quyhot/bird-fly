var gameLayer
var stopGame = false
var SysMenu = cc.Layer.extend({
    labelFiftyBird: null,
    labelEnter: null,
    labelCount: null,
    labelLose: null,
    startGame: false,
    count: 5,
    background: null,
    ground: null,
    score: 0,
    labelScore: null,
    bird: null,
    mytimeout: null,

    ctor: function () {
        this._super();
        this.init();
    },
    playBGMusic: function () {
        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(0.5);
            cc.audioEngine.playMusic(res.marios_way_mp3, true)
        }
    },
    init: function () {
        this.initBackGround();
        this.onStartGame()
        this.hideLabel()
        this.addTouchListener();

        return true;
    },
    initBackGround: function () {
        console.log('oke')
        this.playBGMusic()
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
        this.hideEndGameLabel()
        this.score = 0
        winSize = cc.director.getWinSize();
        if (!this.labelCount) {
            this.count = 5
            this.labelCount = new cc.LabelTTF(this.count, res.flappy_ttf, 36)
            this.labelCount.attr({
                anchorX: 0.5,
                anchorY: 0,
                x: winSize.width / 2,
                y: winSize.height / 1.5
            });
            this.addChild(this.labelCount, 0, 5)
        }
        this.schedule(this.countDown, 1, 5);
        // setTimeout(this.countDown(this), 1000)
    },
    onStartGame: function () {
        this.startGame = true
        this.initStartGame()
        this.scheduleUpdate()
    },
    initStartGame: function () {
        winSize = cc.director.getWinSize()
        this.bird = Bird.create()
        this.addChild(this.bird, 0, 1)
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
    randomIntFromInterval: function (min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    randomPipeGap: function () {
        winSize = cc.director.getWinSize()
        var gap = this.randomIntFromInterval(MW.MIN_GAP, MW.MAX_GAP)
        var remainAfterGap = winSize.height - gap
        var topY = this.randomIntFromInterval(MW.MIN_HEIGHT, remainAfterGap - MW.MIN_HEIGHT)
        var bottomY = remainAfterGap - topY
        return {topY, bottomY}
    },
    randomInterval: function () {
        var num = Math.random()
        return num < 0.4 ? 0.4 : num
    },
    initPipe: function () {
        winSize = cc.director.getWinSize()
        var y = this.randomPipeGap()
        var scoringPoint = this.bird.getRightPointX()
        var top = {
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width,
            y: winSize.height,
            scaleX: 0.5,
            scoringPoint
        }
        var bottom = {
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width,
            y: 32,
            scaleX: 0.5,
            scoringPoint
        }
        var pipeTop = Pipe.create(top)
        pipeTop.setRotation(180)
        var pipeBottom = Pipe.create(bottom)
        pipeTop.setScaleY(y.topY / pipeTop.getContentSize().height)
        pipeBottom.setScaleY(y.bottomY / pipeBottom.getContentSize().height)
        this.addChild(pipeTop, 1)
        this.addChild(pipeBottom, 1)
        var ranInterval = this.randomInterval()
        this.schedule(this.initPipe, ranInterval)
    },
    removePipe(pipe) {
        this.removeChild(pipe)
    },
    countDown: function (dt) {
        if (this.count) {
            this.count--
            this.labelCount.setString('' + this.count);
        } else {
            this.hideLabelCount()
            this.labelCount = null
            this.onStartGame()
        }
    },
    update: function (dt) {
        // console.log('dt',dt)
        this.background.scroll()
    },
    downInterval: function (dt) {
        this.bird.down(dt)
    },
    addTouchListener: function () {
        var self = this
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                self.unschedule(this.downInterval)
                self.hideLabel()
                if (self.startGame) {
                    self.bird.up()
                } else {
                    self.onNewGame()
                }
                return true
            },
            onTouchEnded: function (touch, event) {
                console.log('check')
                if (self.startGame) {
                    self.schedule(self.downInterval, 0.01)
                }
            }
        }, this)
    },
    playHurtMusic: function () {
        if (MW.SOUND) {
            cc.audioEngine.playEffect(res.hurt_wav, false)
        }
    },
    playScoreMusic: function () {
        if (MW.SOUND) {
            cc.audioEngine.playEffect(res.score_wav, false)
        }
    },
    onEndGame() {
        this.playHurtMusic()
        stopGame = true
        this.unscheduleUpdate()
        this.unschedule(this.initPipe)
        this.removeChild(this.labelScore)
        this.mytimeout = setTimeout(this.initEndGameBackground, +MW.DELAY_END_TIME, this)
    },
    initEndGameBackground(layer) {
        clearTimeout(layer.mytimeout)
        layer.playScoreMusic()
        layer.removeChild(layer.bird)
        winSize = cc.director.getWinSize();
        layer.labelLose = new cc.LabelTTF('OOF! YOU LOSE!', res.flappy_ttf, 36)
        layer.labelLose.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width / 2,
            y: winSize.height / 1.5
        });
        layer.addChild(layer.labelLose, 10, 5)
        layer.labelScore = new cc.LabelTTF('Score: ' + layer.score, res.font_ttf, 24)
        layer.labelScore.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width / 2,
            y: winSize.height / 1.5 - 50
        });
        layer.addChild(layer.labelScore, 10, 5)
        layer.labelEnter = new cc.LabelTTF('Press Enter to Play Again', res.flappy_ttf, 24)
        layer.labelEnter.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width / 2,
            y: winSize.height / 1.5 - 150
        });
        layer.addChild(layer.labelEnter, 10, 5)
        stopGame = false
        layer.startGame = false
    },
    hideEndGameLabel: function () {
        this.removeChild(this.labelScore)
        this.removeChild(this.labelEnter)
        this.removeChild(this.labelLose)
    },
    updateScore: function () {
        this.score += 0.5
        this.labelScore.setString('score: ' + this.score)
    }
});

SysMenu.scene = function () {
    var scene = new cc.Scene();
    gameLayer = new SysMenu();
    scene.addChild(gameLayer);
    return scene;
};

