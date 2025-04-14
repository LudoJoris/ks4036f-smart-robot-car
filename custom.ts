// https://ludojoris.github.io/microbit-ks4036f/

let i2c_addr = 0x30;

enum LR {
  //% block="links"
  L = 0,
  //% block="rechts"
  R = 1,
}
enum LRB {
  //% block="links"
  L = 0,
  //% block="rechts"
  R = 1,
  //% block="beide"
  B = 2,
}
enum Richting {
  //% block="vooruit"
  D0 = 0,
  //% block="achteruit"
  D1 = 1,
}
enum RGB {
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
}

//% color="#AA278D"
namespace SmartCar {

  let left_bias = 0;
  let right_bias = 0;
  let left_speed = 0;
  let right_speed = 0;

  //% block="motor $motor richting $richting snelheid $speed"
  //% group="Motor" weight=90 blockGap=4
  //% speed.min=0 speed.max=255
  export function motor(motor: LRB, richting: Richting, speed: number) {
    if (motor == 0) {
      left_speed = speed + left_bias;
      if (richting == 0) {
        i2c_w(0x01, 0);
        i2c_w(0x02, left_speed);
      }
      if (richting == 1) {
        i2c_w(0x01, left_speed);
        i2c_w(0x02, 0);
      }
    }
    if (motor == 1) {
      right_speed = speed + right_bias;
      if (richting == 0) {
        i2c_w(0x03, right_speed);
        i2c_w(0x04, 0);
      }
      if (richting == 1) {
        i2c_w(0x03, 0);
        i2c_w(0x04, right_speed);
      }
    }
    if (motor == 2) {
      left_speed = speed + left_bias;
      right_speed = speed + right_bias;
      if (richting == 0) {
        i2c_w(0x01, 0);
        i2c_w(0x02, left_speed);
        i2c_w(0x03, right_speed);
        i2c_w(0x04, 0);
      }
      if (richting == 1) {
        i2c_w(0x01, left_speed);
        i2c_w(0x02, 0);
        i2c_w(0x03, 0);
        i2c_w(0x04, right_speed);
      }
    }
  }

  //% block="motor $motor stop"
  //% group="Motor" weight=85  blockGap=4
  export function stop(motor: LRB) {
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

  //% block="snelheid $motor"
  //% group="Motor"
  export function get_speed(motor: LR): number {
    if (motor == 0) {
      return left_speed;
    }
    if (motor == 1) {
      return right_speed;
    }
    return 0;
  }
  
  //% block="motor $motor plus $bias"
  //% group="Motor" weight=80 blockGap=4
  //% bias.min=0 bias.max=50
  export function set_bias(motor: LR, bias: number): void {
    left_bias = 0;
    right_bias = 0;
    if (motor == 0) {
      left_bias = bias;
    }
    if (motor == 1) {
      right_bias = bias;
    }
  }

  //% block="motor bias $motor"
  //% group="Motor"
  export function get_bias(motor: LR): number {
    if (motor == 0) {
      return left_bias;
    }
    if (motor == 1) {
      return right_bias;
    }
    return 0;
  }

  //% block="spin %LR met snelheid %speed gedurende %ms ms"
  //% group="Motor"
  export function spin(direction: LR, speed: number, ms: number): void {
    if (direction == 0) {
      motor(0, 0, speed);
      motor(1, 1, speed);
    }
    if (direction == 1) {
      motor(0, 1, speed);
      motor(1, 0, speed);
    }
    basic.pause(ms);
    stop(2);
  }

  
  //% block="LED $led met kleur $rgb" 
  //% group="LED" weight=70 blockGap=4
  export function set_led(led: LRB, rgb: number) {
    
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

  //% block="LED $led uit" 
  //% group="LED" weight=60 blockGap=8
  export function reset_led(led: LRB) {
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
    
  //% block="rood $red groen $green blauw $blue"
  //% group="LED" weight=50 blockGap=8
  //% rood.min=0 rood.max=255
  //% groen.min=0 groen.max=255
  //% blauw.min=0 blauw.max=255
  export function rgb(red: number, green: number, blue: number): number {
    return packRGB(red, green, blue);
  }

  //% block="$color"
  //% group="LED" weight=40 blockGap=8
  export function colors(color: RGB): number {
    return color;
  }


  pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
  //% block="afstand (cm)"
  //% group="Ultrasone sensor" weight=70 blockGap=4
  export function ping(): number {

    pins.digitalWritePin(DigitalPin.P14, 0);
    control.waitMicros(2);
    pins.digitalWritePin(DigitalPin.P14, 1);
    control.waitMicros(10);
    pins.digitalWritePin(DigitalPin.P14, 0);

    let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 500 * 58); // max 500 cm
    return Math.floor(d / 58);  // cm
  }


  pins.setPull(DigitalPin.P12, PinPullMode.PullUp);
  pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
  //% block="IR sensor links"
  //% group="Infrarood sensor" weight=80 blockGap=6
  export function ir_sensor_links(): boolean {
    return pins.digitalReadPin(DigitalPin.P13) == 1;
  }

  //% block="IR sensor rechts"
  //% group="Infrarood sensor" weight=70 blockGap=6
  export function ir_sensor_rechts(): boolean {
    return pins.digitalReadPin(DigitalPin.P12) == 1;
  }


  //% block="LDR links"
  //% group="Lichtgevoelige weerstand" weight=60 blockGap=6
  export function ldr_links(): number {
    return pins.analogReadPin(AnalogPin.P1);
  }

  //% block="LDR rechts"
  //% group="Lichtgevoelige weerstand" weight=50 blockGap=6
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
