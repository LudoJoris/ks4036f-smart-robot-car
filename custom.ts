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

//% color="#AA278D"
namespace SmartCar {

    //% block="motor $motor richting $richting snelheid $snelheid"
    //% snelheid.min=0 snelheid.max=255 snelheid.defl=100
    //% group="Motor" weight=50
    export function motor(motor: Motor, richting: Richting, snelheid: number) {
      if (motor == 0) {
        if (richting == 0) {
          i2c_w(0x01, 0);
          i2c_w(0x02, snelheid);
        }
        if (richting == 1) {
          i2c_w(0x01, snelheid);
          i2c_w(0x02, 0);
        }
      }
      if (motor == 1) {
        if (richting == 0) {
          i2c_w(0x03, snelheid);
          i2c_w(0x04, 0);
        }
        if (richting == 1) {
          i2c_w(0x03, 0);
          i2c_w(0x04, snelheid);
        }
      }
      if (motor == 2) {
        if (richting == 0) {
          i2c_w(0x01, 0);
          i2c_w(0x02, snelheid);
          i2c_w(0x03, snelheid);
          i2c_w(0x04, 0);
        }
        if (richting == 1) {
          i2c_w(0x01, snelheid);
          i2c_w(0x02, 0);
          i2c_w(0x03, 0);
          i2c_w(0x04, snelheid);
        }
      }
    }

    //% block="motor $motor stop"
    //% group="Motor" weight=55
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

    //% block="rood $red groen $green blauw $blue"
    //% rood.min=0 rood.max=255
    //% groen.min=0 groen.max=255
    //% blauw.min=0 blauw.max=255
    //% group="LED" weight=60
    export function rgb(red: number, green: number, blue: number): number {
      return packRGB(red, green, blue);
    }

    //% block="LED $led met kleur $rgb" 
    //% group="LED" weight=65
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

    //% block="LED $led uit" 
    //% group="LED" weight=65
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

    pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
    //% block="afstand (cm)"
    //% group="Ultrasone sensor" weight=70
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
    //% block="IR sensor links"
    //% group="Infrarood sensor" weight=80
    export function ir_sensor_links(): boolean {
      return pins.digitalReadPin(DigitalPin.P13) == 0;
    }
    //% block="IR sensor rechts"
    //% group="Infrarood sensor" weight=81
    export function ir_sensor_rechts(): boolean {
      return pins.digitalReadPin(DigitalPin.P12) == 0;
    }

    //% block="LDR links"
    //% group="Lichtgevoelige weerstand" weight=66
    export function ldr_links(): number {
      return pins.analogReadPin(AnalogPin.P1);
    }
    //% block="LDR rechts"
    //% group="Lichtgevoelige weerstand" weight=66
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

let i2c_addr = 0x30;

function i2c_w(reg: number, value: number) {
    let buf = pins.createBuffer(2)
    buf[0] = reg
    buf[1] = value
    pins.i2cWriteBuffer(i2c_addr, buf)
}

