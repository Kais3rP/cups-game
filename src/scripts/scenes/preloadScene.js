import LoadingBar from "../objects/LoadingBar"

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    let { width, height } = this.sys.game.canvas;
    this.currentFileText = this.add.text(width/2, height/2+70,"", { fontSize: '32px', fill: '#000' });
    this.currentPerc =  this.add.text(width/2+150, height/2-40,"", { fontSize: '32px', fill: '#000' });
    this.add.text(width/2, height/2-40, 'Loading ', { fontSize: '32px', fill: '#000' });
    this.width = width;
    this.height = height;
    this.progressBar = this.add.graphics();
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(width/2, height/2, 400, 50);
   
    this.load.on('start', function() {
      console.log("loading started")
    })
    this.load.on('progress', this.progress, this);
    this.load.on('fileprogress', function(file){
      console.log(this.currentFileText.text)
      this.currentFileText.setText(file.src)
      
    },this);
    this.load.on('complete', this.complete, this);


    const assetsArr = [['bg', 'src/assets/img/bg.jpg'],['logo', 'src/assets/img/logo.png'],['ball', 'src/assets/img/ball.png'],['cup', 'src/assets/img/cup.png']]
   
    for (let i = 0; i < assetsArr.length; i++) {
        this.load.image(assetsArr[i][0], assetsArr[i][1]);
    }

/*
    this.load.image('bg', 'src/assets/img/bg.jpg');
    this.load.image('logo', 'src/assets/img/logo.png');
    this.load.image('ball', 'src/assets/img/ball.png');
    this.load.image('cup', 'src/assets/img/cup.png');
*/   
  }

  create() {
  this.scene.stop("PreloadScene")
    console.log("Game starting")
      this.scene.launch('MainScene')
  }
  progress(prog) {
    console.log("in progress",prog)
    this.progressBar.clear();
    this.progressBar.fillStyle(0x000000, 1);
    this.progressBar.fillRect(this.width/2, this.height/2, 400 * prog, 50);
    this.currentPerc.setText(prog*100+"%")
    
  
  }
  fileProgress(file) {
    console.log("in progress",prog)
    this.progressBar.clear();
    this.progressBar.fillStyle(0x000000, 1);
    this.progressBar.fillRect(this.width/2, this.height/2, 400 * prog, 50);
    
  
  }
  complete() {
    console.log("Loading finished")
    this.progressBar.destroy()
    this.progressBar.destroy()
    this.currentFileText.destroy()
  }
  /**
   * This is how you would dynamically import the mainScene class (with code splitting),
   * add the mainScene to the Scene Manager
   * and start the scene.
   * The name of the chunk would be 'mainScene.chunk.js
   * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
   */
  // let someCondition = true
  // if (someCondition)
  //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
  //     this.scene.add('MainScene', mainScene.default, true)
  //   })
  // else console.log('The mainScene class will not even be loaded by the browser')

}
