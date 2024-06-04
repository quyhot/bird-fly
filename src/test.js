var Test = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.init();
        this.scheduleUpdate()
    },
    init: function () {
        winSize = cc.director.getWinSize()
        var top = {
            anchorX: 0.5,
            anchorY: 0,
            y: winSize.height,
            scoringPoint: 0
        }
        var blocks_scaled_with_insets = new cc.Scale9Sprite(res.pipe_png, cc.rect(0, 0, 70, 288), cc.rect(0, 40, 70, 248))
        // blocks_scaled_with_insets.updateWithBatchNode(batchNodeScale, cc.rect(0, 0, 70, 288), false, cc.rect(0, 30, 70, 288));
        // blocks_scaled_with_insets.width = 30
        blocks_scaled_with_insets.height = 20
        blocks_scaled_with_insets.x = winSize.width / 2
        blocks_scaled_with_insets.y = winSize.height / 2
        blocks_scaled_with_insets.setRotation(180)

        this.blocks_scaled_with_insets = blocks_scaled_with_insets
        this.addChild(blocks_scaled_with_insets)
        console.log(blocks_scaled_with_insets.getContentSize().height)
    },

    update: function(dt) {
        // cc.log("dt = ", dt)
        // this.blocks_scaled_with_insets.height -= dt * 60;
    }
})

Test.scene = function () {
    var scene = new cc.Scene();
    var gameLayer = new Test();
    scene.addChild(gameLayer);
    return scene;
};