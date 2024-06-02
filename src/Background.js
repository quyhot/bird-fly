var BackGround = cc.Sprite.extend({
    speed: MW.SCROLL_SPEED,

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
        var speed = this.speed
        if (usingSkill.dashSkill && usingSkill.powerSkill) {
            speed = MW.DS_BG_SCROLL_SPEED
        }
        this.setPosition(this.getPosition().x - speed, this.getPosition().y);
        if (this.getPosition().x < 0) {
            this.setPosition(this.getPosition().x + 577, this.getPosition().y);
        }
    }
})
BackGround.create = function (arg) {
    return new BackGround(arg)
}
