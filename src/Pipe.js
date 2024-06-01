var Pipe = cc.Sprite.extend({
    moveAction: null,

    ctor: function (args = {}) {
        this._super(res.pipe_png)
        this.init(args)
    },

    init: function (args) {
        winSize = cc.director.getWinSize()
        this.attr(args)
        this.moveAction = new cc.MoveTo(2.5, new cc.Point(-100, this.getPositionY()))
        this.runAction(this.moveAction)
        this.scheduleUpdate()
    },
    update: function (dt) {
        if (stopGame) {
            this.unscheduleAllCallbacks()
            this.stopAction(this.moveAction)
            setTimeout(this.remove, MW.DELAY_END_TIME, this)
        }
        var birdBoundingBox = gameLayer.bird.getBoundingBox()
        var pipeBoundingBox = this.getBoundingBox()
        if (cc.rectIntersectsRect(birdBoundingBox, pipeBoundingBox)) {
            gameLayer.onEndGame()
        }
        if (this.getPosition().x < -50) {
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
