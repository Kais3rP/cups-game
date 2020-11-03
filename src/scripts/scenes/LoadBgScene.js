export default class PreloadScene extends Phaser.Scene {
    constructor() {
      super({ key: 'LoadBgScene' })
  
    }
  
    preload() {
      let { width, height } = this.sys.game.canvas;
      this.width = width;
      this.height = height;
      this.load.image("bg-main", 'src/assets/img/bg-main.jpg');     
    }
  
    create() {
      console.log("Game starting")
      console.log(this.width,this.height)
      const bg = this.add.image(0, 0, "bg-main")
      console.log(bg)
      bg.setDepth(-1);
      bg.setScale(1.5)
  
      this.scene.launch('PreloadScene')//Start shuts down the current scene too
    }
}