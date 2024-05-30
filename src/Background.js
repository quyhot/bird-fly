var BackGround = cc.Sprite.extend({

    ctor: function () {
        this._super(res.background_png)
        this.init()
    },

    init: function () {
        this.attr({
            anchorX: 0,
            anchorY: 0,
            x: 0,
            y: 20,
            scaleY: 1.5
        })
    }
})
BackGround.create = function (arg) {
    return new BackGround(arg)
}
