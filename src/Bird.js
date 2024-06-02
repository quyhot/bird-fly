var Bird = cc.Sprite.extend({
    downSpeed: MW.DOWN_SPEED,
    upSpeed: MW.UP_SPEED,
    rotateUp: null,
    rotateDown: null,
    moveUp: null,
    moveDown: null,

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
        this.rotateDown = new cc.RotateBy(0.0001, 1)
        this.rotateUp = new cc.RotateTo(0.1, -20)
        this.moveUp = new cc.MoveBy(0.02, new cc.Point(0, this.upSpeed))
        this.moveDown = new cc.MoveBy(0.001, new cc.Point(0, -this.downSpeed))
    },
    getRightPointX: function () {
        return this.getPositionX() - this.getAnchorPoint().x * this.getContentSize().width
    },
    down: function (dt) {
        if (this.getPosition().y <= MW.GROUND) {
            this.setPosition(this.getPosition().x, MW.GROUND)
        } else {
            // console.log(dt)
            // this.rotateDown = new cc.RotateBy(dt, -10)
            // this.moveDown = new cc.MoveBy(dt, new cc.Point(0, this.downSpeed))
            // var arr = []
            // for (var i = 0; i < 10; i++) {
            //     arr.push(this.rotateDown.clone())
            // }
            // var seq = new cc.Sequence(arr)
            // if (this.checkRotation()){
            //     this.runAction(new cc.Spawn(this.moveDown))
            // } else {
            //     this.runAction(new cc.Spawn(this.moveDown, seq))
            // }
            this.runAction(new cc.Spawn(this.moveDown))
        }
    },
    checkRotation: function () {
        return Math.abs(this.getRotation()) >= 90;
    },
    setNewRotation: function (self) {
        // if (Math.abs(self.getRotation()) >= 90) {
        //     self.setRotation(self.getRotation() + (self.getRotation() < 0 ?  10 : - 10))
        // }
    },
    playJumpMusic: function () {
        if (MW.SOUND) {
            cc.audioEngine.playEffect(res.jump_wav, false)
        }
    },
    up: function () {
        if (!stopGame) {
            winSize = cc.director.getWinSize()
            if (this.getPosition().y >= winSize.height - MW.BIRD.HEIGHT) {
                this.setPosition(this.getPosition().x, winSize.height - MW.BIRD.HEIGHT)
            } else {
                // var rotateUpArr = []
                // var checkRotate = new cc.CallFunc(this.setNewRotation, this)
                // for (var i = 0; i < 20; i++) {
                //     rotateUpArr.push(this.rotateUp)
                // }
                // var delay = new cc.DelayTime(1)
                // var seqRotate = new cc.Sequence(rotateUpArr, delay)
                // var spawn =
                // var a = new cc.MoveBy(0.1, new cc.Point(0, this.upSpeed))
                // this.runAction(new cc.Spawn(this.moveUp.clone(), this.rotateUp.clone()))
                this.playJumpMusic()
                this.runAction(new cc.Spawn(this.moveUp.clone()))
            }
        }
    }
})
Bird.create = function (arg) {
    return new Bird(arg)
}
