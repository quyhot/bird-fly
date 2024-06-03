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
        // this.moveAction = cc.MoveBy(MW.PIPE_MOVEBY_TIME, cc.p(MW.PIPE_MOVEBY_X, 0))
        // this.moveDashKill = cc.MoveBy(MW.DS_PIPE_MOVEBY_TIME, cc.p(MW.PIPE_MOVEBY_X, 0))
        // this.movePowerKill = cc.MoveBy(MW.DS_PIPE_MOVEBY_TIME, cc.p(-MW.PIPE_MOVEBY_X, 0))
        this.scheduleUpdate()
    },
    addMoveAction: function () {
        return cc.MoveBy(MW.PIPE_MOVEBY_TIME, cc.p(MW.PIPE_MOVEBY_X, 0))
    },
    addMoveDashSkill: function () {
        return cc.MoveBy(MW.DS_PIPE_MOVEBY_TIME, cc.p(MW.PIPE_MOVEBY_X, 0))
    },
    addMovePowerKill: function () {
        return cc.MoveBy(MW.DS_PIPE_MOVEBY_TIME, cc.p(-MW.PIPE_MOVEBY_X, 0))
    },
    getLeftPointX: function () {
        return this.getPositionX() + this.getAnchorPoint().x * this.getContentSize().width
    },
    checkAction: function () {
        if (usingSkill.powerSkill) {
            return this.addMovePowerKill()
        } else if (usingSkill.dashSkill) {
            return this.addMoveDashSkill()
        } else {
            return this.addMoveAction()
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
            // this.stopAction(this.checkAction())
            setTimeout(this.remove, MW.DELAY_END_TIME, this)
            return
        }
        if (!pauseGame) {
            var action = this.checkAction()
            this.runAction(action)
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
