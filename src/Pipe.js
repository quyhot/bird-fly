var Pipe = cc.Sprite.extend({
    scoringPoint: null,
    updatedPoint: false,

    ctor: function (args = {}) {
        this._super(res.pipe_png)
        this.init(args)
    },
    init: function (args) {
        this.scoringPoint = args.scoringPoint
        delete args.scoringPoint
        this.attr(args)
        // this.moveAction = cc.MoveBy(MW.PIPE_MOVEBY_TIME, cc.p(MW.PIPE_MOVEBY_X, 0))
        // this.moveDashKill = cc.MoveBy(MW.DS_PIPE_MOVEBY_TIME, cc.p(MW.PIPE_MOVEBY_X, 0))
        // this.movePowerKill = cc.MoveBy(MW.DS_PIPE_MOVEBY_TIME, cc.p(-MW.PIPE_MOVEBY_X, 0))
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
    getLeftPointX: function () {
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
    updateScore: function () {
        if (this.getLeftPointX() < this.scoringPoint && !this.updatedPoint && !usingSkill.powerSkill) {
            gameLayer.updateScore()
            this.updatedPoint = true
        } else if (this.getLeftPointX() > this.scoringPoint && !this.updatedPoint && usingSkill.powerSkill) {
            gameLayer.updateScore()
            this.updatedPoint = true
        }
    },
    update: function (dt) {
        if (stopGame) {
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
