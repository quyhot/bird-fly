var Pipe = cc.Sprite.extend({

    ctor: function (args = {}) {
        this._super(res.pipe_png)
        this.init(args)
    },

    init: function (args) {
        winSize = cc.director.getWinSize();
        this.attr(args)
        var moveAction = new cc.MoveTo(2.5, new cc.Point(-100, this.getPositionY()))
        this.runAction(moveAction)
        this.scheduleUpdate()
    },
    update: function (dt) {
        if (this.getPosition().x < -50) {
            gameLayer.removePipe(this)
        }
    }
})
Pipe.create = function (args) {
    return new Pipe(args)
}
