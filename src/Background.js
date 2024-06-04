var BackGround = cc.Node.extend({
    speed: MW.SCROLL_SPEED,
    background1: null,
    background2: null,

    ctor: function () {
        this._super()
        this.init()
        this.scheduleUpdate()
    },
    // init 2 background
    init: function () {
        winSize = cc.director.getWinSize()
        this.background1 = new cc.Sprite(res.background2_png)
        this.background1.attr({
            anchorX: 0,
            anchorY: 0,
            scaleY: 1.5,
            x: 0,
            y: 20
        })
        this.addChild(this.background1, 0)
        this.background2 = new cc.Sprite(res.background2_png)
        this.background2.attr({
            anchorX: 0,
            anchorY: 0,
            scaleY: 1.5,
            x: this.background1.getPositionX() + this.background1.getContentSize().width * (1 - this.background1.getAnchorPoint().x),
            y: 20
        })
        this.addChild(this.background2, 0)
    },
    // change position when background run out screen
    changePosition: function (background, compareBackground) {
        if ((background.getPosition().x + background.getContentSize().width * (1 - background.getAnchorPoint().x)) < 0) {
            background.setPosition(compareBackground.getPositionX() + compareBackground.getContentSize().width * (1 - compareBackground.getAnchorPoint().x), compareBackground.getPosition().y);
        }
    },
    update: function (dt) {
        var speed = this.speed
        // change speed when using skill
        if (usingSkill.dashSkill || usingSkill.powerSkill) {
            speed = MW.DS_BG_SCROLL_SPEED
        }
        this.background1.setPosition(this.background1.getPosition().x - speed, this.background1.getPosition().y);
        this.background2.setPosition(this.background2.getPosition().x - speed, this.background2.getPosition().y);
        this.changePosition(this.background1, this.background2, speed)
        this.changePosition(this.background2, this.background1, speed)
    }
})
BackGround.create = function (arg) {
    return new BackGround(arg)
}
