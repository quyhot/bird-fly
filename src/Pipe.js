var Pipe = cc.Scale9Sprite.extend({
    scoringPoint: null,
    updatedPoint: false,

    ctor: function (args = {}) {
        this._super(res.pipe_png, cc.rect(0, 0, 70, 288), cc.rect(0, 40, 70, 248))
    },
    // setup pipe
    setup: function (args) {
        this.scoringPoint = args.scoringPoint
        delete args.scoringPoint
        this.setAnchorPoint(args.anchorX, args.anchorY)
        this.x = cc.director.getWinSize().width + this.getPositionX() * (1 - this.getAnchorPoint().x) + 40
        this.y = args.y
        this.scheduleUpdate()
    },
    addMoveAction: function (dt) {
        this.setPosition(Math.floor(this.getPositionX() + MW.PIPE_MOVEBY_X * dt * 80), this.getPositionY())
    },
    addMoveDashSkill: function (dt) {
        this.setPosition(Math.floor(this.getPositionX() + MW.DS_PIPE_MOVEBY_X * dt * 80), this.getPositionY())
    },
    addMovePowerKill: function (dt) {
        this.setPosition(Math.floor(this.getPositionX() + MW.PS_PIPE_MOVEBY_X * dt * 80), this.getPositionY())
    },
    // right point of pipe: x + anchorX * width
    getRightPointX: function () {
        return this.getPositionX() + this.getAnchorPoint().x * this.getContentSize().width
    },
    runingPipe: function (dt) {
        if (usingSkill.powerSkill) {
            this.addMovePowerKill(dt)
        } else if (usingSkill.dashSkill) {
            this.addMoveDashSkill(dt)
        } else {
            this.addMoveAction(dt)
        }
    },
    checkColldide: function () {
        var birdBoundingBox = gameLayer.bird.getBoundingBox()
        var pipeBoundingBox = this.getBoundingBox()
        if (cc.rectIntersectsRect(birdBoundingBox, pipeBoundingBox)) {
            gameLayer.onEndGame()
        }
    },
    // update score when right point of pipe < left point of bird
    updateScore: function () {
        if (this.getRightPointX() < this.scoringPoint && !this.updatedPoint && !usingSkill.powerSkill) {
            gameLayer.updateScore()
            this.updatedPoint = true
        } else if (this.getRightPointX() > this.scoringPoint && !this.updatedPoint && usingSkill.powerSkill) {
            gameLayer.updateScore()
            this.updatedPoint = true
        }
    },
    update: function (dt) {
        if (stopGame) {
            // stop everything
            this.unscheduleUpdate()
            this.unscheduleAllCallbacks()
            setTimeout(this.remove, MW.DELAY_END_TIME, this)
            return
        }
        if (!pauseGame) {
            this.runingPipe(dt)
        }
        if (!usingSkill.dashSkill && !usingSkill.powerSkill) {
            this.checkColldide()
        }
        this.updateScore()
        if (this.getPositionX() < -50 || this.getPositionX() > cc.director.getWinSize().width + 50) {
            gameLayer.removePipe(this)
        }
    },
    remove: function (self) {
        gameLayer.removePipe(self || this)
    }
})
Pipe.create = function (args) {
    return new Pipe(args)
}
