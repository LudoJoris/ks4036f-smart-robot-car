let i2c_addr = 0x30;
let right_bias = 0
let left_bias = 0
  
enum Motor {
  //% block="links"
  M0 = 0,
  //% block="rechts"
  M1 = 1,
  //% block="beide"
  M2 = 2
}
enum Richting {
  //% block="vooruit"
  D0 = 0,
  //% block="achteruit"
  D1 = 1
}
enum Led {
  //% block="links"
  L0 = 0,
  //% block="rechts"
  L1 = 1,
  //% block="beide"
  L2 = 2
}
enum Bias {
  //% block="links"
  B0 = 0,
  //% block="rechts"
  B1 = 1
}
enum rgbLedColors {
  //% block=rood
  Red = 0x7F0000,
  //% block=groen
  Green = 0x007F00,
  //% block=blauw
  Blue = 0x00007F,
  //% block=wit
  White = 0x7F7F7F,
  //% block=uit
  Black = 0x000000,
  //% block=geel
  Yellow = 0x7F7F00,
  //% block=cyaan
  Cyan = 0x007F7F,
  //% block=magenta
  Magenta = 0x07F007F,
  //% block=paars
  Purple = 0xFF00FF,
  //% block=oranje
  Orange = 0xFFA000
}

//% color="#AA278D"
namespace SmartCar {

    //% group="Motor" weight=90 blockGap=4
    //% block="motor $motor richting $richting snelheid $snelheid"
    //% snelheid.min=0 snelheid.max=255 snelheid.defl=100
    export function motor(motor: Motor, richting: Richting, snelheid: number) {
      if (motor == 0) {
        if (richting == 0) {
          i2c_w(0x01, 0);
          i2c_w(0x02, snelheid + left_bias);
        }
        if (richting == 1) {
          i2c_w(0x01, snelheid + left_bias);
          i2c_w(0x02, 0);
        }
      }
      if (motor == 1) {
        if (richting == 0) {
          i2c_w(0x03, snelheid + right_bias);
          i2c_w(0x04, 0);
        }
        if (richting == 1) {
          i2c_w(0x03, 0);
          i2c_w(0x04, snelheid + right_bias);
        }
      }
      if (motor == 2) {
        if (richting == 0) {
          i2c_w(0x01, 0);
          i2c_w(0x02, snelheid + left_bias);
          i2c_w(0x03, snelheid + left_bias);
          i2c_w(0x04, 0);
        }
        if (richting == 1) {
          i2c_w(0x01, snelheid + right_bias);
          i2c_w(0x02, 0);
          i2c_w(0x03, 0);
          i2c_w(0x04, snelheid + right_bias);
        }
      }
    }

    //% group="Motor" weight=85  blockGap=4
    //% block="motor $motor stop"
    export function stop(motor: Motor) {
      if (motor == 0) {
        i2c_w(0x01, 0);
        i2c_w(0x02, 0);
      }
      if (motor == 1) {
        i2c_w(0x03, 0);
        i2c_w(0x04, 0);
      }
      if (motor == 2) {
        i2c_w(0x01, 0);
        i2c_w(0x02, 0);
        i2c_w(0x03, 0);
        i2c_w(0x04, 0);
      }
    }
  
   /**
     * pas motor snelheid aan, blijft van kracht tot herstart
     * kies voor de zwakste motor
     */
    //% group="Motor" weight=80 blockGap=4
    //% block="motor %motor plus %bias"
    //% bias.min=0 bias.max=30
    export function set_bias(motor: Bias, bias: number): void {
      switch (motor) {
        case 0:
          left_bias = bias;
          break;
        case 1:
          right_bias = bias;
          break;
      }
    }

  
    //% group="LED" weight=50 blockGap=4
    //% block="rood $red groen $green blauw $blue"
    //% rood.min=0 rood.max=255 rood.defl=0
    //% groen.min=0 groen.max=255 groen.defl=0
    //% blauw.min=0 blauw.max=255 blauw.defl=0
    export function rgb(red: number, green: number, blue: number): number {
      return packRGB(red, green, blue);
    }

    //% group="LED" weight=70 blockGap=4
    //% block="LED $led met kleur $rgb" 
    export function set_led(led: Led, rgb: number) {
    
      let r = 255 - unpackR(rgb);
      let g = 255 - unpackG(rgb);
      let b = 255 - unpackB(rgb);

      switch (led) {
        case 0:
          i2c_w(0x08, r);
          i2c_w(0x07, g);
          i2c_w(0x06, b);
          break;
        case 1:
          i2c_w(0x09, r);
          i2c_w(0x0a, g);
          i2c_w(0x05, b);
          break;
        case 2:
          i2c_w(0x08, r);
          i2c_w(0x07, g);
          i2c_w(0x06, b);
          i2c_w(0x09, r);
          i2c_w(0x0a, g);
          i2c_w(0x05, b);
          break;
      }
    }

    //% group="LED" weight=60 blockGap=8
    //% block="LED $led uit" 
    export function reset_led(led: Led) {
      switch (led) {
        case 0:
          i2c_w(0x08, 255);
          i2c_w(0x07, 255);
          i2c_w(0x06, 255);
          break;
        case 1:
          i2c_w(0x09, 255);
          i2c_w(0x0a, 255);
          i2c_w(0x05, 255);
          break;
        case 2:
          i2c_w(0x08, 255);
          i2c_w(0x07, 255);
          i2c_w(0x06, 255);
          i2c_w(0x09, 255);
          i2c_w(0x0a, 255);
          i2c_w(0x05, 255);
          break;
      }
    }
    
    //% group="LED" weight=40 blockGap=8
    //% block="%color"
    export function colors(color: rgbLedColors): number {
      return color;
    }


    pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
    //% group="Ultrasone sensor" weight=70 blockGap=4
    //% block="afstand (cm)"
    export function ping(): number {

      pins.digitalWritePin(DigitalPin.P14, 0);
      control.waitMicros(2);
      pins.digitalWritePin(DigitalPin.P14, 1);
      control.waitMicros(10);
      pins.digitalWritePin(DigitalPin.P14, 0);
 
      let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 500 * 58); // max 500 cm
      return Math.idiv(d, 58);  // cm
    }


    pins.setPull(DigitalPin.P12, PinPullMode.PullUp);
    pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
    //% group="Infrarood sensor" weight=80 blockGap=6
    //% block="IR sensor links"
    export function ir_sensor_links(): boolean {
      return pins.digitalReadPin(DigitalPin.P13) == 1;
    }

    //% group="Infrarood sensor" weight=70 blockGap=6
    //% block="IR sensor rechts"
    export function ir_sensor_rechts(): boolean {
      return pins.digitalReadPin(DigitalPin.P12) == 1;
    }


    //% group="Lichtgevoelige weerstand" weight=60 blockGap=6
    //% block="LDR links"
    export function ldr_links(): number {
      return pins.analogReadPin(AnalogPin.P1);
    }

    //% group="Lichtgevoelige weerstand" weight=50 blockGap=6
    //% block="LDR rechts"
    export function ldr_rechts(): number {
      return pins.analogReadPin(AnalogPin.P0);
    }

}

function packRGB(r: number, g: number, b: number): number {
  return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
}
function unpackR(rgb: number): number {
  return (rgb >> 16) & 0xFF;
}
function unpackG(rgb: number): number {
  return (rgb >> 8) & 0xFF;
}
function unpackB(rgb: number): number {
  return (rgb) & 0xFF;
}

function i2c_w(reg: number, value: number) {
    let buf = pins.createBuffer(2)
    buf[0] = reg
    buf[1] = value
    pins.i2cWriteBuffer(i2c_addr, buf)
}

