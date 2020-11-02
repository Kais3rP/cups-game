export default class FpsText extends Phaser.GameObjects.Graphics {
    constructor(scene) {
      super(scene)
      scene.add.existing(this)
      this.setOrigin(500,300)
    }
  }
  