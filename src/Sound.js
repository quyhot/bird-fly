var Sound = cc.audioEngine.extend({
    ctor: function () {
        this._super()
    },
    playBGMusic: function () {
        this.playMusic(res.marios_way_mp3, true)
    },
    stopBGMusic: function () {
        this.stopMusic()
    },
    playHurtMusic: function () {
        this.playEffect(res.hurt_wav)
    },
    playJumpMusic: function () {
        this.playEffect(res.jump_wav)
    },
    playExplosionMusic: function () {
        this.playEffect(res.explosion)
    },
    playScoreMusic: function () {
        this.playEffect(res.score_wav)
    }
})