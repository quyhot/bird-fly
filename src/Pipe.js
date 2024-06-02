var Pipe = cc.Sprite.extend({
    moveAction: null,
    scoringPoint: null,
    updatedPoint: false,
    moveDashKill: null,
    movePowerKill: null,

    ctor: function (args = {}) {
        this._super(res.pipe_png)
        this.init(args)
    },
    init: function (args) {
        this.scoringPoint = args.scoringPoint
        delete args.scoringPoint
        this.attr(args)
        this.moveAction = new cc.MoveBy(MW.PIPE_MOVEBY_TIME, new cc.Point(MW.PIPE_MOVEBY_X, 0))
        this.moveDashKill = new cc.MoveBy(MW.DS_PIPE_MOVEBY_TIME, new cc.Point(MW.PIPE_MOVEBY_X, 0))
        this.movePowerKill = new cc.MoveBy(MW.DS_PIPE_MOVEBY_TIME, new cc.Point(-MW.PIPE_MOVEBY_X, 0))
        this.scheduleUpdate()
    },
    getLeftPointX: function () {
        return this.getPositionX() + this.getAnchorPoint().x * this.getContentSize().width
    },
    checkAction: function () {
        if (usingSkill.powerSkill) {
            return this.movePowerKill
        } else if (usingSkill.dashSkill) {
            return this.moveDashKill
        } else {
            return this.moveAction
        }
    },
    checkColldide () {
        var birdBoundingBox = gameLayer.bird.getBoundingBox()
        var pipeBoundingBox = this.getBoundingBox()
        if (cc.rectIntersectsRect(birdBoundingBox, pipeBoundingBox)) {
            gameLayer.onEndGame()
        }
    },
    updateScore () {
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
            this.unscheduleAllCallbacks()
            this.stopAction(this.checkAction())
            setTimeout(this.remove, MW.DELAY_END_TIME, this)
        }
        if (!pauseGame) {
            this.runAction(this.checkAction())
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
