var Bird = cc.Sprite.extend({

    ctor: function () {
        this._super(res.bird_png)
        this.init()
    },

    init: function () {
        winSize = cc.director.getWinSize();
        this.attr({
            anchorX: 0,
            anchorY: 0,
            x: winSize.width / 2,
            y: winSize.height / 2
        })
    }
})
Bird.create = function (arg) {
    return new Bird(arg)
}
