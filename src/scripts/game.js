import 'phaser'
import '@babel/polyfill'

import MainScene from './scenes/MainScene'
import PreloadScene from './scenes/PreloadScene'
import LoadBgScene from './scenes/LoadBgScene'
import TestScene from './scenes/TestScene'

const DEFAULT_WIDTH = 1024
const DEFAULT_HEIGHT = 768

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [LoadBgScene,PreloadScene, MainScene, TestScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 400 }
    }
  }
}
function NOOP (){
  console.log("NOOP")
}
const config2 = {
  type: Phaser.AUTO,
  parent: null,
  width: 800,
  height: 600,
  scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.NO_CENTER
  },
  autoRound: false,
  canvas: null,
  canvasStyle: null,

  scene: [LoadBgScene,PreloadScene, MainScene],

  callbacks: {
      preBoot: NOOP,
      postBoot: NOOP
  },

  seed: [ (Date.now() * Math.random()).toString() ],

  title: '',
  url: 'https://phaser.io',
  version: '',

  input: {
      keyboard: {
          target: window
      },
      mouse: {
          target: null,
          capture: true
      },
      activePointers: 1,
      touch: {
          target: null,
          capture: true
      },
      smoothFactor: 0,
      gamepad: false,
      windowEvents: true,
  },
  disableContextMenu: false,

  backgroundColor: 0,

  render: {
      antialias: true,
      antialiasGL: true,
      mipmapFilter: 'LINEAR', // 'NEAREST', 'LINEAR', 'NEAREST_MIPMAP_NEAREST', 'LINEAR_MIPMAP_NEAREST', 'NEAREST_MIPMAP_LINEAR', 'LINEAR_MIPMAP_LINEAR'
      pixelArt: false,
      roundPixels: false,
      transparent: false,
      clearBeforeRender: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false,
      powerPreference: 'default', // 'high-performance', 'low-power' or 'default'
      batchSize: 4096,
      desynchronized: false,
      maxTextures: -1
  },

  physics: {
      default: false  // no physics system enabled
  },

  loader:{
      baseURL: '',
      path: '',
      enableParallel: true,
      maxParallelDownloads: 4,
      crossOrigin: undefined,
      responseType: '',
      async: true,
      user: '',
      password: '',
      timeout: 0
  },

  images: {
      default: '',
      missing: ''
  },

  dom: {
      createContainer: false,
      behindCanvas: false,
  },

  plugins: {
      global: [
          //{key, plugin, start}
      ],
      scene: [
          // ...
      ]
  },

  fps: {
      min: 10,
      target: 60,
      forceSetTimeOut: false,
      deltaHistory: 10
  },

  disableContextMenu: false,
  banner: {
      hidePhaser: false,
      text: '#ffffff',
      background: [
          '#ff0000',
          '#ffff00',
          '#00ff00',
          '#00ffff',
          '#000000'
      ]
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
