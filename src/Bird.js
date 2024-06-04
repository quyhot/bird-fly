var Bird = cc.Sprite.extend({
    downSpeed: MW.DOWN_SPEED,
    upSpeed: MW.UP_SPEED,
    rotateUp: null,
    rotateDown: null,
    moveUp: null,
    moveDown: null,
    g: 9.8,
    speedCur: 0,
    v0: 30,

    // v = vi + g*t
    calcuV: function (dt) {
        return this.speedCur - this.g * MW.BIRD_TIME * dt;
    },
    // s = (v*v - vi*vi) / (2 * g)
    calcuS: function (cur, next) {
        return - (Math.pow(next, 2) - Math.pow(cur, 2)) / (2 * this.g)
    },
    calcuRotate: function (cur, next) {
        if (this.getRotation() > 0) {
            return - 2 * (Math.pow(next, 2) - Math.pow(cur, 2)) / (2 * this.g)
        } else {
            return - (Math.pow(next, 2) - Math.pow(cur, 2)) / (2 * this.g)
        }
    },
    ctor: function (y) {
        this._super(res.bird_png)
        winSize = cc.director.getWinSize()
        this.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: winSize.width / 2,
            y: y || winSize.height / 2,
            scale: 2/3
        })
        this.moveUp = cc.MoveBy(0.02, cc.p(0, this.upSpeed))
        this.moveDown = cc.MoveBy(0.001, cc.p(0, -this.downSpeed))
    },
    // press enter and bird fly and run schedule update
    addMoveUp: function () {
        this.speedCur = this.v0
        this.scheduleUpdate()
    },
    birdUsePowerSkill: function () {
        this.goToMiddle()
        this.setRotation(0)
        this.unscheduleUpdate()
        this.speedCur = 0
    },
    birdUseDashSkill: function () {
        this.setRotation(0)
        this.unscheduleUpdate()
        this.speedCur = 0
    },
    // update position and rotation per dt
    update: function (dt) {
        var nextV = this.calcuV(dt)
        var calcuS = this.calcuS(this.speedCur, nextV)
        //set position bird
        if (this.getPosition().y >= winSize.height - MW.BIRD.HEIGHT) {
            this.setPosition(this.getPositionX(), winSize.height - MW.BIRD.HEIGHT)
        } else if (this.getPosition().y <= MW.GROUND) {
            this.setPosition(this.getPositionX(), MW.GROUND)
        } else {
            this.setPosition(this.getPositionX(), this.getPositionY() + calcuS)
        }
        // set rotate bird
        var newRotate = this.getRotation() - this.calcuRotate(this.speedCur, nextV)
        if (newRotate >= -30 && newRotate <= 90) {
            this.setRotation(newRotate)
        } else if (newRotate < -30) {
            this.setRotation(-30)
        } else {
            this.setRotation(90)
        }
        this.speedCur = nextV
    },
    // the most left point of bird in x
    getLeftPointX: function () {
        return this.getPositionX() - this.getAnchorPoint().x * this.getContentSize().width
    },
    goToMiddle: function () {
        winSize = cc.director.getWinSize()
        this.runAction(cc.MoveTo(0.02, cc.p(winSize.width / 2, winSize.height / 2)))
    },
    playJumpMusic: function () {
        if (MW.SOUND) {
            cc.audioEngine.playEffect(res.jump_wav, false)
        }
    },
    // when press enter bird run up
    up: function () {
        if (!stopGame) {
            this.playJumpMusic()
            winSize = cc.director.getWinSize()
            this.addMoveUp()
        }
    }
})
Bird.create = function (arg) {
    return new Bird(arg)
}
