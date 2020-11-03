//import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/FpsText'
//import StartButton from '../objects/StartButton'


export default class MainScene extends Phaser.Scene {
  
  constructor( numOfCups = 4, winningCup = 2, numberOfMoves = 10, elementsY = 500, cupDistance = 200) {
    console.log("inside level")
    super({ key: "MainScene" });
    this.elementsY = elementsY;
    this.isStarted = false;
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
    this.fpsText=""
  }

async preload(){
  this.fpsText = new FpsText(this)
}
  async create() {    
    let { width, height } = this.sys.game.canvas;
    this.width = width;
    this.height = height; 
    console.log(width,height)
    this.cameras.main.setBounds(0, 0, this.width, this.height)
    this.physics.world.setBounds(0, 0, this.width, this.height)
    const bg = this.add.image(0,0 ,"bg")
    bg.setDepth(-1);
   bg.setScale(0.5,0.5)
    this.startingXPosition = (this.width -(this.cupDistance*(this.numOfCups-1)))/2;
    this.createCups();
    this.createBall();
    await this.createButton();
    await this.raiseTheCup(this.cups[this.winningCup - 1]);
    this.ball.alpha = 0 //hide the ball during the movements
    this.ball.x = -9999;
    this.moveTheCups();
  }
 update() {
    this.fpsText.update()
  }
  createButton(){
    const that = this;
    return new Promise( resolve => {
      const button = this.add.image(this.width/2-50, this.elementsY-200, 'logo');
      button.setInteractive()
      button.on('pointerdown', onClick)
      function onClick(){
        console.log("Start button pressed")
       that.isStarted = true;
       this.setActive(false).setVisible(false);
       resolve();
      } 
    })
    
   // this.startButton = new StartButton(this) 
   
    
  }

  createCups() {
    const that = this;
    for (let i = 1; i <= this.numOfCups; i++) {
      const cup = this.add.image(
        this.startingXPosition + (this.cupDistance * (i-1)),
        this.elementsY,
        "cup"
      );
      cup.scaleX = 0.1;
      cup.scaleY = 0.1;
      cup.hasBall = i === this.winningCup ? true : false;
      cup.name = "cup" + i;
      cup.setInteractive();
      cup.setDepth(1);
      cup.on("pointerdown", function () {
        console.log(this.name, this.hasBall)
        if (!that.isFinished)
          return console.log("You can't raise the cups until the game has finished");
        if (that.isLost) return console.log("You already had your chance! ;-)");
        if (that.isWon)
          return console.log("You Won, what do you want more??! ;-)");
        if (!this.hasBall) { //This block happens if you don't pick the right cup
          that.isLost = true;
          that.raiseTheCup(this);
          setTimeout(() => {
            that.raiseTheCup(that.cups[that.winningCup - 1]);
          }, 1000)
          that.winAnimation()
        }
        else { //This block happens if you pick the right cup
          that.isWon = true;
          that.raiseTheCup(that.cups[that.winningCup - 1]);
          that.loseAnimation();
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
    //console.log("inside the raise cup function");
    this.ball.x = this.cups[this.winningCup - 1].x; //assigns to the ball the final position of the winning cup
    this.ball.alpha = 700;
    return new Promise((resolve) => {
      let timeline = this.tweens.timeline({
        ease: "Power2",
        tweens: [
          {
            offset: 400,
            duration: 400,
            targets: cup,
            y: this.elementsY - 250
          },
          {

            offset: 1050,
            duration: 200,
            targets: cup,
            y: this.elementsY,
            onComplete: () => {
              resolve("first animation resolved");
            }
          }
        ]
      });
    });
  }

  winAnimation() { }

  loseAnimation() { }

  async moveTheCups() {
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
          //this.onStart(index0, index1)
          this.cups[index0].setDepth(0)
        },
        onUpdate: (tween, target) => { this.onUpdate(curve1, index0, tween, target) },
        onComplete: () => {
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
          //this.onStart(index0, index1) 
          this.cups[index1].setDepth(2)
        },
        onUpdate: (tween, target) => { this.onUpdate(curve2, index1, tween, target) },
        onComplete: () => {
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

              this.cups[index0].setDepth(0)
              this.onStart(index0, index1)
            },
            onUpdate: (tween, target) => { this.onUpdate(curve1, index0, tween, target) },
            onComplete: () => {
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

              this.cups[index0].setDepth(2)
              this.onStart(index0, index1)
            },
            onUpdate: (tween, target) => { this.onUpdate(curve2, index0, tween, target) },
            onComplete: () => {
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
              this.cups[index1].setDepth(2)
              this.onStart(index0, index1)

            },
            onUpdate: (tween, target) => { this.onUpdate(curve2, index1, tween, target) },
            onComplete: () => {
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

              this.cups[index1].setDepth(0)
              this.onStart(index0, index1)
            },
            onUpdate: (tween, target) => {
              this.onUpdate(curve1, index1, tween, target)
            },
            onComplete: () => {
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


