var Bird = cc.Sprite.extend({
    downSpeed: MW.DOWN_SPEED,
    upSpeed: MW.UP_SPEED,

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
    },
    getRightPointX: function () {
        return this.getPositionX() - this.getAnchorPoint().x * this.getContentSize().width
    },
    down: function () {
        if (this.getPosition().y <= MW.GROUND) {
            this.setPosition(this.getPosition().x, MW.GROUND)
        } else {
            this.setPosition(this.getPosition().x, this.getPosition().y - this.downSpeed)
        }
    },
    up: function () {
        if (!stopGame){
            winSize = cc.director.getWinSize()
            if (this.getPosition().y >= winSize.height - MW.BIRD.HEIGHT) {
                this.setPosition(this.getPosition().x, winSize.height - MW.BIRD.HEIGHT)
            } else {
                this.setPosition(this.getPosition().x, this.getPosition().y + this.upSpeed)
            }
        }
    }
})
Bird.create = function (arg) {
    return new Bird(arg)
}
