var gameLayer
var stopGame = false
var pauseGame = false
var usingSkill = {
    dashSkill: false,
    powerSkill: false
}
var GameLayer = cc.Layer.extend({
    labelFiftyBird: null,
    labelEnter: null,
    labelEnterWhenEndGame: null,
    labelCount: null,
    labelLose: null,
    startGame: false,
    count: 5,
    background: null,
    ground: null,
    score: 0,
    labelScore: null,
    bird: null,
    spritesWhenUseSkill: [],
    dashLabel: null,
    powerLabel: null,
    pauseLabel: null,
    middlePauseLabel: null,
    dashSkillCountDown: 0,
    powerSkillCountDown: 0,
    isFirstGame: true,
    pipePrev: true,
    distance: 0,

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
        this.addKeyBoardListener();
        return true;
    },
    // init background
    initBackGround: function () {
        this.playBGMusic()
        this.background = BackGround.create()
        this.addChild(this.background)
        this.ground = new cc.Sprite(res.ground_png)
        this.ground.attr({
            anchorX: 0,
            anchorY: 0,
            scale: 2
        })
        this.addChild(this.ground, 11, 2)
        this.initLabel()
    },
    // init label when open game
    initLabel: function () {
        var winSize = cc.director.getWinSize();
        this.labelFiftyBird = new ccui.Text("Fifty Bird", res.flappy_ttf, 24)
        // this.labelFiftyBird.setFontName(res.flappy_ttf)
        this.labelFiftyBird.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width / 2,
            y: winSize.height / 1.5
        });
        this.addChild(this.labelFiftyBird, 0, 3)
        this.labelEnter = new ccui.Text("press enter", res.flappy_ttf, 18)
        this.labelEnter.attr({
            anchorX: 0.5,
            anchorY: 1,
            x: winSize.width / 2,
            y: winSize.height / 1.5 - 5
        });
        this.addChild(this.labelEnter, 0, 3)
    },
    //hide label when open game
    hideLabel: function () {
        this.removeChild(this.labelFiftyBird)
        this.removeChild(this.labelEnter)
        this.labelFiftyBird = null
        this.labelEnter = null
    },
    hideLabelCount: function () {
        this.removeChild(this.labelCount)
    },
    // new game event
    onNewGame: function () {
        this.hideLabel()
        this.hideEndGameLabel()
        this.score = 0
        winSize = cc.director.getWinSize();
        if (!this.labelCount) {
            this.count = 2
            this.labelCount = new ccui.Text(this.count, res.flappy_ttf, 36)
            this.labelCount.attr({
                anchorX: 0.5,
                anchorY: 0,
                x: winSize.width / 2,
                y: winSize.height / 1.5
            });
            this.addChild(this.labelCount, 0, 5)
        }
        // count down to start game
        this.schedule(this.countDown, 1, 5);
        // setTimeout(this.countDown(this), 1000)
    },
    // start game:
    onStartGame: function () {
        this.initStartGame()
        this.scheduleUpdate()
    },
    // add label, bird and pipe
    initStartGame: function () {
        this.startGame = true
        this.pipePrev = null
        winSize = cc.director.getWinSize()
        this.bird = Bird.create()
        this.addChild(this.bird, 10, 1)
        this.labelScore = new ccui.Text("score: " + this.score, res.flappy_ttf, 24)
        this.labelScore.attr({
            anchorX: 0,
            anchorY: 0,
            x: 10,
            y: winSize.height - 30
        })
        this.addChild(this.labelScore, 10)
        this.dashLabel = new ccui.Text("Skill A: Ready", res.flappy_ttf, 18)
        this.dashLabel.attr({
            anchorX: 0,
            anchorY: 0,
            x: 10,
            y: 32
        })
        this.addChild(this.dashLabel, 10)
        this.powerLabel = new ccui.Text("Skill S: Ready", res.flappy_ttf, 18)
        this.powerLabel.attr({
            anchorX: 0,
            anchorY: 0,
            x: 10,
            y: 62
        })
        this.addChild(this.powerLabel, 10)
        this.pauseLabel = new ccui.Text("D: Pause", res.flappy_ttf, 18)
        this.pauseLabel.attr({
            anchorX: 0,
            anchorY: 0,
            x: 10,
            y: 92
        })
        this.addChild(this.pauseLabel, 10)
        this.powerSkillCountDown = 0
        this.dashSkillCountDown = 0
        // this.schedule(this.initPipe)
        this.initPipe()
    },
    // random from min number to max number
    randomIntFromInterval: function (min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    // random gap in y-axis
    randomPipeGap: function () {
        winSize = cc.director.getWinSize()
        var gap = this.randomIntFromInterval(MW.MIN_GAP, MW.MAX_GAP)
        var remainAfterGap = winSize.height - gap
        var topY = this.randomIntFromInterval(MW.MIN_HEIGHT, remainAfterGap - MW.MIN_HEIGHT)
        var bottomY = remainAfterGap - topY
        return {topY, bottomY}
    },
    // gen pipe top and bottom
    initPipe: function () {
        winSize = cc.director.getWinSize()
        var y = this.randomPipeGap()
        var pipeTop = Pipe.create()
        pipeTop.height = y.topY
        var pipeBottom = Pipe.create()
        pipeBottom.height = y.bottomY
        var scoringPoint = this.bird.getLeftPointX()
        var top = {
            anchorX: 0.5,
            anchorY: 0,
            y: winSize.height,
            scoringPoint
        }
        var bottom = {
            anchorX: 0.5,
            anchorY: 0,
            y: 32,
            scoringPoint
        }
        pipeTop.setup(top)
        pipeTop.setRotation(180)
        pipeBottom.setup(bottom)
        this.addChild(pipeTop, 1)
        this.addChild(pipeBottom, 1)
        this.pipePrev = pipeTop
        this.distance = this.randomIntFromInterval(pipeTop.getContentSize().width + MW.MIN_DISTANCE, pipeTop.getContentSize().width + MW.MAX_DISTANCE)
    },
    removePipe: function (pipe) {
        this.removeChild(pipe)
    },
    // count down for start game
    countDown: function (dt) {
        if (this.count) {
            this.count--
            this.labelCount.setString('' + this.count);
        } else {
            this.hideLabelCount()
            this.labelCount = null
            this.unschedule(this.countDown)
            this.onStartGame()
        }
    },
    // gen pipe when pipe run to distance
    genPipe: function () {
        if (this.pipePrev && this.pipePrev.getPositionX() < (cc.director.getWinSize().width - this.distance)) {
            this.initPipe()
        }
    },
    update: function (dt) {
        this.genPipe()
    },
    // count down when using skill: dash skill and power skill
    countDownUsingSkill: function (dt) {
        if (this.count) {
            this.count--
        } else {
            this.unschedule(this.countDownUsingSkill)
            while (this.spritesWhenUseSkill.length) {
                this.removeChild(this.spritesWhenUseSkill.pop())
            }
            usingSkill.dashSkill = false
            usingSkill.powerSkill = false
            if (!this.pipePrev) this.initPipe()
            this.bird.scheduleUpdate()
        }
    },
    // count down to use dash skill
    countDownDashSkill: function () {
        if (this.dashSkillCountDown) {
            this.dashSkillCountDown--
            this.dashLabel.setString('Skill A: ' + this.dashSkillCountDown)
        } else {
            this.dashLabel.setString('Skill A: Ready')
        }
    },
    // count down to use power skill
    countDownPowerSkill: function () {
        if (this.powerSkillCountDown) {
            this.powerSkillCountDown--
            this.powerLabel.setString('Skill S: ' + this.powerSkillCountDown)
        } else {
            this.powerLabel.setString('Skill S: Ready')
        }
    },
    // dash skill handle
    dashSkill: function () {
        if (!this.dashSkillCountDown) {
            usingSkill.dashSkill = true
            this.pipePrev = null
            this.count = MW.DS_USING_TIME
            this.bird.birdUseDashSkill()
            this.playExplosion()
            this.schedule(this.countDownUsingSkill, 1)
            this.dashSkillCountDown = MW.DS_COUNT_DOWN
            this.schedule(this.countDownDashSkill, 1)
        }
    },
    // gen new bird when using power skill
    genNewBird: function () {
        var birds = []
        var winSize = cc.director.getWinSize()
        var height = this.bird.getContentSize().height
        birds.push(new Bird(winSize.height / 2 - height - 10))
        birds.push(new Bird(winSize.height / 2 - 2 * height - 2 * 10))
        birds.push(new Bird(winSize.height / 2 + height + 10))
        birds.push(new Bird(winSize.height / 2 + 2 * height + 2 * 10))
        for (var i = 0; i < birds.length; i++) {
            this.addChild(birds[i])
        }
        return birds
    },
    // power skill handle
    powerSkill: function () {
        if (!this.powerSkillCountDown) {
            usingSkill.powerSkill = true
            this.pipePrev = null
            this.bird.birdUsePowerSkill()
            this.spritesWhenUseSkill = this.genNewBird()
            this.count = MW.PS_USING_TIME
            this.playExplosion()
            this.schedule(this.countDownUsingSkill, 1)
            this.powerSkillCountDown = MW.PS_COUNT_DOWN
            this.schedule(this.countDownPowerSkill, 1)
        }
    },
    // pause game handle
    pauseGame: function () {
        if (pauseGame) {
            // this.scheduleUpdate()
            this.removeChild(this.middlePauseLabel)
            this.middlePauseLabel = false
            if (this.count) {
                this.schedule(this.countDownUsingSkill, 1)
            } else {
                this.scheduleUpdate()
            }
            this.schedule(this.countDownPowerSkill, 1)
            this.schedule(this.countDownDashSkill, 1)
            this.bird.scheduleUpdate()
            this.background.scheduleUpdate()
        } else {
            winSize = cc.director.getWinSize()
            this.middlePauseLabel = new ccui.Text("PAUSE!", res.flappy_ttf, 18)
            this.middlePauseLabel.attr({
                anchorX: 0.5,
                anchorY: 0.5,
                x: winSize.width / 2,
                y: winSize.height / 1.5 - 50
            })
            this.addChild(this.middlePauseLabel, 10)
            this.unscheduleUpdate()
            this.unschedule(this.countDownPowerSkill)
            this.unschedule(this.countDownUsingSkill)
            this.unschedule(this.countDownDashSkill)
            this.bird.unscheduleUpdate()
            this.background.unscheduleUpdate()
        }
        pauseGame = !pauseGame
    },
    // key board listener
    addKeyBoardListener: function () {
        var self = this
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {
                if (key === MW.KEYBOARD.ENTER && !pauseGame && !usingSkill.powerSkill && !usingSkill.dashSkill) {
                    // self.unschedule(this.downInterval)
                    if (self.startGame) {
                        if (!self.pipePrev) {
                            self.initPipe()
                        }
                        self.bird.up()
                    } else {
                        self.onNewGame()
                    }
                } else if (key === MW.KEYBOARD.A && !pauseGame && !stopGame) {
                    self.dashSkill()
                } else if (key === MW.KEYBOARD.S && !pauseGame && !stopGame) {
                    self.powerSkill()
                } else if (key === MW.KEYBOARD.D && !stopGame) {
                    self.pauseGame()
                }
            },
            onKeyReleased: function(key, event) {
                if (self.startGame) {
                    if (key === MW.KEYBOARD.ENTER && !pauseGame && !usingSkill.powerSkill && !stopGame) {
                        // self.schedule(self.downInterval, 0.01)
                    }
                }
            }
        }, this)
    },
    playHurtMusic: function () {
        if (MW.SOUND) {
            cc.audioEngine.playEffect(res.hurt_wav, false)
        }
    },
    playExplosion: function () {
        if (MW.SOUND) {
            cc.audioEngine.playEffect(res.explosion, false)
        }
    },
    playScoreMusic: function () {
        if (MW.SOUND) {
            cc.audioEngine.playEffect(res.score_wav, false)
        }
    },
    // handle end game event
    onEndGame: function () {
        stopGame = true
        this.playHurtMusic()
        this.unscheduleUpdate()
        this.unschedule(this.initPipe)
        this.unschedule(this.countDownDashSkill)
        this.unschedule(this.countDownPowerSkill)
        // this.unschedule(this.downInterval)
        this.removeChild(this.labelScore)
        this.removeChild(this.powerLabel)
        this.removeChild(this.dashLabel)
        this.removeChild(this.pauseLabel)
        this.mytimeout = setTimeout(this.initEndGameBackground, +MW.DELAY_END_TIME, this)
    },
    // init end game background after moment
    initEndGameBackground: function (layer) {
        clearTimeout(layer.mytimeout)
        layer.playScoreMusic()
        layer.removeChild(layer.bird)
        winSize = cc.director.getWinSize();
        layer.labelLose = new ccui.Text('OOF! YOU LOSE!', res.flappy_ttf, 24)
        layer.labelLose.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width / 2,
            y: winSize.height / 1.5
        });
        layer.addChild(layer.labelLose, 10, 5)
        layer.labelScore = new ccui.Text('Score: ' + layer.score, res.flappy_ttf, 18)
        layer.labelScore.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width / 2,
            y: winSize.height / 1.5 - 50
        });
        layer.addChild(layer.labelScore, 10, 5)
        layer.labelEnterWhenEndGame = new ccui.Text('Press Enter to Play Again', res.flappy_ttf, 18)
        layer.labelEnterWhenEndGame.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width / 2,
            y: winSize.height / 1.5 - 150
        });
        layer.addChild(layer.labelEnterWhenEndGame, 10, 5)
        stopGame = false
        layer.startGame = false
        layer.isFirstGame = false
    },
    hideEndGameLabel: function () {
        this.removeChild(this.labelScore)
        this.removeChild(this.labelEnterWhenEndGame)
        this.removeChild(this.labelLose)
        this.labelScore = null
        this.labelEnterWhenEndGame = null
        this.labelLose = null
    },
    updateScore: function () {
        this.score += 0.5
        this.labelScore.setString('score: ' + this.score)
    }
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    gameLayer = new GameLayer();
    scene.addChild(gameLayer);
    return scene;
};

