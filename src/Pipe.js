var Pipe = cc.Sprite.extend({
    moveAction: null,
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
        this.moveAction = new cc.MoveBy(0.0004, new cc.Point(-3, 0))
        this.scheduleUpdate()
    },
    getLeftPointX: function () {
        return this.getPositionX() + this.getAnchorPoint().x * this.getContentSize().width
    },
    update: function (dt) {
        if (stopGame) {
            this.unscheduleAllCallbacks()
            this.stopAction(this.moveAction)
            setTimeout(this.remove, MW.DELAY_END_TIME, this)
        }
        if (!pauseGame) {
            this.runAction(this.moveAction)
        }
        var birdBoundingBox = gameLayer.bird.getBoundingBox()
        var pipeBoundingBox = this.getBoundingBox()
        if (cc.rectIntersectsRect(birdBoundingBox, pipeBoundingBox)) {
            gameLayer.onEndGame()
        }
        if (this.getPosition().x < -50) {
            gameLayer.removePipe(this)
        }
        if (this.getLeftPointX() < this.scoringPoint && !this.updatedPoint) {
            gameLayer.updateScore()
            this.updatedPoint = true
        }
    },
    remove: function (self) {
        gameLayer.removePipe(self || this)
    }
})
Pipe.create = function (args) {
    return new Pipe(args)
}
