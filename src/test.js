var Test = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.init();
        this.scheduleUpdate()
    },
    init: function () {
        var pipe = new cc.Sprite(res.pipe_png)
        winSize = cc.director.getWinSize()
        pipe.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: winSize.width,
            y: winSize.height,
            scaleX: 0.5
        })
        // var pipeTop = Pipe.create(top)
        pipe.setRotation(180)
        this.addChild(pipe)
        pipe.runAction(cc.MoveTo(10, cc.p(-100, pipe.getPositionY())))
    },

    update: function(dt) {
        cc.log("dt = ", dt)
    }
})

Test.scene = function () {
    var scene = new cc.Scene();
    var gameLayer = new Test();
    scene.addChild(gameLayer);
    return scene;
};