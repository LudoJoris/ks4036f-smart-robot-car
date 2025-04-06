let i2c_addr = 0x30;

enum Motor {
    //% block="links"
    M0 = 0,
    //% block="rechts"
    M1 = 1
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
    L1 = 1
}
enum Sensor {
  //% block="links"
  I0 = 0,
  //% block="rechts"
  I1 = 1
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
    }

    //% block="rood $red groen $green blauw $blue"
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% group="LED" weight=60
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    //% block="LED $led kleur $rgb" 
    //% group="LED" weight=65
    export function set_led(led: Led, rgb: number) {
        let r = 255 - unpackR(rgb);
        let g = 255 - unpackG(rgb);
        let b = 255 - unpackB(rgb);

        if (led == 0) {
            i2c_w(0x08, r);
            i2c_w(0x07, g);
            i2c_w(0x06, b);
        }
        if (led == 1) {
            i2c_w(0x09, r);
            i2c_w(0x0a, g);
            i2c_w(0x05, b);
        }
    }

    const trig = DigitalPin.P14;
    const echo = DigitalPin.P15;
    pins.setPull(trig, PinPullMode.PullNone);
    
    //% block="afstand (cm)"
    //% group="Ultrasone sensor" weight=70
    export function ping(): number {
      pins.digitalWritePin(trig, 0);
      control.waitMicros(2);
      pins.digitalWritePin(trig, 1);
      control.waitMicros(10);
      pins.digitalWritePin(trig, 0);
 
      let d = pins.pulseIn(echo, PulseValue.High, 500 * 58); // max 500 cm
      return Math.idiv(d, 58);  // cm
    }

    pins.setPull(DigitalPin.P12, PinPullMode.PullUp);
    pins.setPull(DigitalPin.P13, PinPullMode.PullUp);

    //% block="sensor $Sensor"
    //% group="Infrarood sensor" weight=80
    export function ir_sensor(sensor: Sensor): number {
      if (sensor == 0) {   
        let val = pins.digitalReadPin(DigitalPin.P12);
        return val;
      }
      if (sensor == 1) {   
        let val = pins.digitalReadPin(DigitalPin.P13);
        return val;
      }
    }

}

function packRGB(r: number, g: number, b: number): number {
    return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
}
function unpackR(rgb: number): number {
    let r = (rgb >> 16) & 0xFF;
    return r;
}
function unpackG(rgb: number): number {
    let g = (rgb >> 8) & 0xFF;
    return g;
}
function unpackB(rgb: number): number {
    return (rgb) & 0xFF;
    //let b = (rgb) & 0xFF;
    //return b;
}

function i2c_w(reg: number, value: number) {
    let buf = pins.createBuffer(2)
    buf[0] = reg
    buf[1] = value
    pins.i2cWriteBuffer(i2c_addr, buf)
}

