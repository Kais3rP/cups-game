//import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/FpsText'
//import StartButton from '../objects/StartButton'



export default class MainScene extends Phaser.Scene {

  constructor(numOfCups = 3, winningCup = 3, numberOfMoves = 10, elementsY = 500, cupDistance = 300) {
    console.log("inside level")
    super({ key: "MainScene" });
    this.elementsY = elementsY;
    this.isStarted = false;
    this.hasToStart = false;
    this.isFinished = false;
    this.hasCupRaised = false;
    this.isLost = false;
    this.isWon = false;
    this.state = "START";
    this.numOfCups = numOfCups;
    this.winningCup = winningCup;
    this.ball;
    this.startingXPosition = 0;
    this.cupDistance = cupDistance;
    this.cups = [];
    this.numberOfMoves = numberOfMoves;
    this.animateArr = [
      this.animateSwap.bind(this),
      this.animateFullCircle.bind(this)
    ];
    this.fpsText = ""
  }
  init() {
    console.log("inside init")
  }
  preload() {
    this.fpsText = new FpsText(this)
    let { width, height } = this.sys.game.canvas;
    this.width = width;
    this.height = height;
    this.startingXPosition = (this.width - (this.cupDistance * (this.numOfCups - 1))) / 2;
  }



  create() {
    console.log("inside create")
    this.resetState();
    this.createBg();
    this.createCups();
    this.createBall();
    this.createButton();
    this.createSounds();
    

  }

  update() {
    console.log("updating...")
    this.fpsText.update()
    if (this.hasToStart) {
      this.startGame()
      this.hasToStart = false;
    }
    if (this.isLost || this.isWon) {
      console.log("restarting...")
      this.resetState()     
    }
  }

  resetState() {
    this.isStarted = false;
    this.hasToStart = false;
    this.isFinished = false;
    this.hasCupRaised = false;
    this.isLost = false;
    this.isWon = false;
    this.state = "START";
    this.winningCup = Phaser.Math.Between(1, this.numOfCups);
  }
  async startGame() {
    await this.raiseTheCup(this.cups[this.winningCup - 1]);
    this.ball.x = -9999;
    this.moveTheCups();
  }
  createSounds(){
    this.applause  = this.sound.add("applause");
    this.boo  = this.sound.add("boo");
    this.slide  = this.sound.add("slide");
    this.raise  = this.sound.add("raise");
  }
  createBg() {
    const bg = this.add.image(this.width / 2, this.height / 2, "bg")
    bg.setDepth(-1);
    bg.displayWidth = this.width;
    bg.displayHeight = this.height;
  }
  createButton() {
    console.log("inside create button")
    const that = this;
    const startBtn = this.add.image(this.width / 2, this.elementsY - 200, 'logo')
      .setDepth(10)
      .setInteractive()
      .on('pointerdown', function () {
        console.log("Start button pressed")
        that.isStarted = true;
        that.hasToStart = true;
        this.setActive(false).setVisible(false);
      })
    this.startBtn = startBtn;
  }

  createCups() {
    console.log("inside create cups")
    const that = this;
    for (let i = 1; i <= this.numOfCups; i++) {
      const cup = this.add.image(
        this.startingXPosition + (this.cupDistance * (i - 1)),
        this.elementsY,
        "cup"
      );
      cup.scaleX = 0.1;
      cup.scaleY = 0.1;
      cup.hasBall = i === this.winningCup ? true : false;
      cup.name = "cup" + i;
      cup.setInteractive();
      cup.setDepth(1);
      cup.on("pointerdown", async function () {
        console.log(this.name, this.hasBall)
        if (!that.isFinished)
          return console.log("You can't raise the cups until the game has finished");
        if (that.isLost) return console.log("You already had your chance! ;-)");
        if (that.isWon)
          return console.log("You Won, what do you want more??! ;-)");
        if (!this.hasBall) {
          console.log("hasball?",this.hasBall) //This block happens if you don't pick the right cup
        that.boo.play()
          await that.raiseTheCup(this);
          await new Promise(resolve => {
            setTimeout(async function() {
              await that.raiseTheCup(that.cups[that.winningCup - 1]);
              resolve()
            }, 300)
          })
          await that.loseAnimation();
          console.log("Setting the lose state")
          that.isLost = true;
          that.startBtn.setActive(true).setVisible(true); //Show again the start button
        }
        else { //This block happens if you pick the right cup 
          that.applause.play()
          await that.raiseTheCup(that.cups[that.winningCup - 1]);
          await that.winAnimation()
          that.isWon = true;
          that.startBtn.setActive(true).setVisible(true); //Show again the start button
        }

      });
      this.cups.push(cup);
    }
  }

  createBall() {
    const ball = this.add.image(
      this.cups[this.winningCup - 1].x,
      this.elementsY + 70,
      "ball"
    );
    ball.scaleX = 0.1;
    ball.scaleY = 0.1;
    ball.setDepth(0);
    this.ball = ball;
  }

  raiseTheCup(cup) {

    console.log("inside the raise cup function");
    this.ball.x = this.cups[this.winningCup - 1].x; //assigns to the ball the final position of the winning cup
    console.log("Changing ball props")
    return new Promise((resolve) => {
      let timeline = this.tweens.timeline({
        ease: "Power2",
        tweens: [
          {
            offset: 400,
            duration: 400,
            targets: cup,
            y: this.elementsY - 250,
            onStart: () => {
              this.raise.play()
              console.log("firts tween start")
            },
            onComplete: () => {
              console.log("firts tween complete")
            }
          },
          {

            offset: 1050,
            duration: 200,
            targets: cup,
            y: this.elementsY,
            onStart: () => {
              console.log("second tween start")
            },
            onComplete: () => {
              this.raise.stop()
              console.log("second tween completed")
              resolve("first animation resolved");
            }
          }
        ]
      });
    });
  }

  winAnimation() {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Win Animation")
        resolve()
      }, 2000)
    })

  }

  async loseAnimation() {

    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Lose Animation")
        resolve()
      }, 2000)
    })
  }

  async moveTheCups() {
    console.log("Inside move the cups")
    let index0 = null;
    let index1 = null;
    for (let i = 0; i < this.numberOfMoves; i++) {
      while (index0 === index1) {
        index0 = Phaser.Math.Between(0, this.numOfCups - 1);
        index1 = Phaser.Math.Between(0, this.numOfCups - 1);
      }

      //Generate random AnimateQubic Idx
      let idx = Phaser.Math.Between(0, 1);
      let randomYoyo = Phaser.Math.Between(0, 1);
      const res = await this.animateArr[idx](index0, index1, randomYoyo === 1 ? true : false); //Randomly pick an animate function and randomly pass a boolean for yoyo
      //console.log(res);
      index0 = null;
      index1 = null;
      if (i === this.numberOfMoves - 1) {
        this.isFinished = true;
        this.isStarted = false; //Stops the game enabling the click
        this.state = "END";
        //console.log(i, this.isStarted);
      }
    }
  }

  animateSwap(index0, index1, isYoyo) {
    //console.log(`Inside swap with yoyo:${isYoyo} `, "indexes:", index0, index1);
    //Creating the bezier curves
    let that = this;
    let curve1 = this.createBezierCurve(index0, index1, this.elementsY, true)
    let curve2 = this.createBezierCurve(index1, index0, this.elementsY, false)
    //---------------------------------------------------------------------------------------
    //Create the tween objects
    let tweenObject1 = {
      val: 0
    }
    let tweenObject2 = {
      val: 0
    }
    //----------------------------------------------------------------------------------------
    //Animation tweens
    return new Promise((resolve) => {
      that.tweens.add({
        targets: tweenObject1,
        t: 1,
        val: 1,
        ease: "Sine.easeInOut",
        duration: 600,
        yoyo: isYoyo,
        repeat: 0,
        callbackScope: this,
        onStart: () => {
          this.slide.play()
          this.cups[index0].setDepth(0)
        },
        onUpdate: (tween, target) => { this.onUpdate(curve1, index0, tween, target) },
        onComplete: () => {
          this.slide.stop()
          this.onComplete("", false, index0, index1)
        }
      });
      that.tweens.add({
        targets: tweenObject2,
        t: 1,
        val: 1,
        ease: "Sine.easeInOut",
        duration: 600,
        yoyo: isYoyo,
        repeat: 0,
        callbackScope: this,
        onStart: () => {
          this.slide.play()
          this.cups[index1].setDepth(2)
        },
        onUpdate: (tween, target) => { this.onUpdate(curve2, index1, tween, target) },
        onComplete: () => {
          this.slide.stop()
          this.onComplete(`swap with yoyo:${isYoyo} resolved`, true, index0, index1, resolve)
        }
      });
    });
  }

  animateFullCircle(index0, index1) {
    //console.log("inside full circle animation");
    //Creating the bezier curves
    let that = this;
    let curve1 = this.createBezierCurve(index0, index1, this.elementsY, true)
    let curve2 = this.createBezierCurve(index1, index0, this.elementsY, false)
    //---------------------------------------------------------------------------------------
    //Create the tween objects
    let tweenObject1 = {
      val: 0
    }
    let tweenObject2 = {
      val: 0
    }
    let tweenObject3 = {
      val: 0
    }
    let tweenObject4 = {
      val: 0
    }
    //----------------------------------------------------------------------------------------
    //Animation timeline
    return new Promise((resolve) => {
      that.tweens.timeline({
        tweens: [
          {
            targets: tweenObject1,
            t: 1,
            val: 1,
            ease: "Sine.easeInOut",
            duration: 600,
            yoyo: false,
            repeat: 0,

            callbackScope: this,
            onStart: () => {
              this.slide.play()
              this.cups[index0].setDepth(0)
              this.onStart(index0, index1)
            },
            onUpdate: (tween, target) => { this.onUpdate(curve1, index0, tween, target) },
            onComplete: () => {
              this.slide.stop()
              this.onComplete("", false, index0, index1)
            }
          },
          {
            targets: tweenObject2,
            t: 1,
            val: 1,
            ease: "Sine.easeInOut",
            duration: 600,
            yoyo: false,
            repeat: 0,

            callbackScope: this,
            onStart: () => {
              this.slide.play()
              this.cups[index0].setDepth(2)
              this.onStart(index0, index1)
            },
            onUpdate: (tween, target) => { this.onUpdate(curve2, index0, tween, target) },
            onComplete: () => {
              this.slide.stop()
              this.onComplete("", false, index0, index1)
            }
          }
        ]
      });

      this.tweens.timeline({
        tweens: [
          {
            targets: tweenObject3,
            t: 1,
            val: 1,
            ease: "Sine.easeInOut",
            duration: 600,
            yoyo: false,
            repeat: 0,

            callbackScope: this,
            onStart: () => {
              this.slide.play()
              this.cups[index1].setDepth(2)
              this.onStart(index0, index1)

            },
            onUpdate: (tween, target) => { this.onUpdate(curve2, index1, tween, target) },
            onComplete: () => {
              this.slide.stop()
              this.onComplete("", false, index0, index1)
            }
          },
          {
            targets: tweenObject4,
            t: 1,
            val: 1,
            ease: "Sine.easeInOut",
            duration: 600,
            yoyo: false,
            repeat: 0,

            callbackScope: this,
            onStart: (tween, target) => {
              this.slide.play()
              this.cups[index1].setDepth(0)
              this.onStart(index0, index1)
            },
            onUpdate: (tween, target) => {
              this.onUpdate(curve1, index1, tween, target)
            },
            onComplete: () => {
              this.slide.stop()
              this.onComplete("full circle animation resolved", true, index0, index1, resolve)
            }
          }
        ]
      });
      //End of Timeline---------------------------------------------
    })
  }
  onStart(index0, index1) {
    //console.log("cup1:",index0, "cup2:",index1)
    //for (let cup of this.cups) console.log(cup.depth)
    //this.cups[index0].setDepth(0)
    //this.cups[index1].setDepth(2)
  }
  onComplete(resText, hasToRes, index0, index1, resolve) {
    //console.log(index0,index1,this.cups)

    if (hasToRes) {
      resolve(resText);
      this.cups[index0].setDepth(1)
      this.cups[index1].setDepth(1)
    }
  }
  onUpdate(curve, idx, tween, target) {

    let position = curve.getPoint(target.val);
    this.cups[idx].x = position.x;
    this.cups[idx].y = position.y;
  }

  createBezierCurve(idx0, idx1, yCoord, isUp) {
    let startPoint = new Phaser.Math.Vector2(this.cups[idx0].x, yCoord);
    let endPoint = new Phaser.Math.Vector2(this.cups[idx1].x, yCoord);
    let controlPoint = new Phaser.Math.Vector2(
      (this.cups[idx0].x + this.cups[idx1].x) / 2,
      isUp ? yCoord - 200 : yCoord + 200
    );
    return new Phaser.Curves.QuadraticBezier(
      startPoint,
      controlPoint,
      endPoint
    );
  }
}


