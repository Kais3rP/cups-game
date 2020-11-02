export default class StartButton extends Phaser.GameObjects.Graphics {
    constructor(scene) {
      super(scene)
      scene.add.existing(this)
      //this.setOrigin(500,300)
    }
  
  init(){
      console.log("init button")
    this.lineStyle(5, 0xFF00FF, 1.0);
    this.beginPath();
    this.moveTo(100, 100);
    this.lineTo(200, 200);
    this.closePath();
    this.strokePath();
    this.lineStyle(5, 0xFF00FF, 1.0);
this.fillStyle(0xFFFFFF, 1.0);
this.fillRect(50, 50, 400, 200);
this.strokeRect(50, 50, 400, 200);
  }
  
create() {
  
  
    let clickCount = 0;
    this.clickCountText = this.add.text(100, 200, '');
    this.clickButton = this.add.text(100, 100, 'Click me!', { fill: '#0f0' })
     .setInteractive()
     .on('pointerdown', () => this.updateClickCountText(++clickCount) )
     .on('pointerover', () => this.enterButtonHoverState() )
     .on('pointerout', () => this.enterButtonRestState() );

    this.updateClickCountText(clickCount);
  }

  updateClickCountText(clickCount) {
    this.clickCountText.setText(`Button has been clicked ${clickCount} times.`);
  }

  enterButtonHoverState() {
    this.clickButton.setStyle({ fill: '#ff0'});
  }

  enterButtonRestState() {
    this.clickButton.setStyle({ fill: '#0f0' });
  }
}