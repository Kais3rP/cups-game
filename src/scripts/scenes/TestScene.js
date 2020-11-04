export default class PreloadScene extends Phaser.Scene {
    constructor() {
      super({ key: 'TestScene' })
  
    }
  
    preload() {
      let { width, height } = this.sys.game.canvas;
      this.width = width;
      this.height = height;
      //this.load.image("bg-main", 'src/assets/img/bg-main.jpg');     
    }
  
    create() {
      console.log("Test Scene")
      console.log(this.width,this.height)
      const bg = this.add.image(0, 0, "bg-main")
      
      console.log(bg)
      bg.setDepth(0);
      bg.setScale(1.5)
      bg.setInteractive()
    bg.on("pointerdown", ()=>{ 
        console.log("clicking")
        this.scene.start("LoadBgScene")})
    }

    update(){
       // console.log("updating test scene...")
      }
     
}