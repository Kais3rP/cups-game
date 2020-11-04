

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })

  }

  preload() {
    //Add the loader
    let { width, height } = this.sys.game.canvas;
    this.width = width;
    this.height = height;
    //Text
    this.currentFileText = this.add.text(width / 2 - 200, height / 2 + 70, "", { fontSize: '32px', fill: '#FFF' });
    this.currentPerc = this.add.text(width / 2 + 150 - 200, height / 2 - 40, "", { fontSize: '32px', fill: '#FFF' });
    this.add.text(width / 2 - 200, height / 2 - 40, 'Loading ', { fontSize: '32px', fill: '#FFF' });
    //Progress  BAR
    this.progressBar = this.add.graphics();
    this.progressBar.setDepth(1)
    this.progressBox = this.add.graphics();
    this.progressBox.lineStyle(5, 0xFFFFFF, 1.0);
    this.progressBox.fillStyle(0x000000, 1.0);
    this.progressBox.fillRect(width / 2 - 200, height / 2, 400, 50);
    this.progressBox.strokeRect(width / 2 - 200, height / 2, 400, 50);

    this.load.on('start', function () {
      console.log("loading started")
    })
    this.load.on('progress', this.progress, this);
    this.load.on('fileprogress', function (file) {
      console.log(this.currentFileText.text)
      this.currentFileText.setText(file.src)

    }, this);
    this.load.on('complete', this.complete, this);


    const assetsArr = [
      ['applause', 'src/assets/sound/applause.mp3'],
      ['boo', 'src/assets/sound/boo.mp3'],
      ['slide', 'src/assets/sound/slide.mp3'],
      ['table', 'src/assets/img/table.png'],
      ['bg', 'src/assets/img/bg.jpg'],
      ['logo', 'src/assets/img/logo.png'],
      ['ball', 'src/assets/img/ball.png'],
      ['cup', 'src/assets/img/cup.png']]


    for (let asset of assetsArr) {
      switch (asset[1].match(/\.\w{3}$/)[0]) {
        case ".mp3": this.load.audio(asset[0], asset[1]);
          break;
        case ".wav": this.load.audio(asset[0], asset[1]);
          break;
        case ".png": this.load.image(asset[0], asset[1]);
          break;
        case ".jpg": this.load.image(asset[0], asset[1]);
          break;

      }

    }
  }

  create() {
    console.log("Game starting")
    this.scene.stop("LoadBgScene")
    this.scene.stop("PreloadScene")
    this.scene.launch('MainScene')
  }
  update() {
    console.log("updating preload scene...")
  }

  progress(prog) {
    console.log("in progress", prog)
    this.progressBar.clear();
    this.progressBar.fillStyle(0xFFFFFF, 0.8);
    this.progressBar.fillRect(this.width / 2 - 200, this.height / 2, 400 * prog, 50);
    this.currentPerc.setText(prog * 100 + "%")


  }
  fileProgress(file) {
    console.log("in progress", prog)
    this.progressBar.clear();
    this.progressBar.fillStyle(0x000000, 1);
    this.progressBar.fillRect(this.width / 2, this.height / 2, 400 * prog, 50);


  }
  complete() {
    console.log("Loading finished")
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
