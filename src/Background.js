var BackGround = cc.Sprite.extend({

    ctor: function () {
        this._super(res.background_png)
        this.init()
    },

    init: function () {
        winSize = cc.director.getWinSize()
        this.attr({
            anchorX: 0.5,
            anchorY: 0,
            scaleY: 1.5,
            x: winSize.width,
            y: 20
        })
    },
    scroll: function () {
        // console.log(this.getPosition().x)
        this.setPosition(this.getPosition().x - MW.SCROLL_SPEED, this.getPosition().y);
        if (this.getPosition().x < 0) {
            this.setPosition(this.getPosition().x + 577, this.getPosition().y);
        }
    }
})
BackGround.create = function (arg) {
    return new BackGround(arg)
}
