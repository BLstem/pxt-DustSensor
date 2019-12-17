//% color=#0fbc11 icon=""
namespace dustsensor {
    let outputpin: number;
    let enable: number;
    let Voc = 0;
    //% block="Set pin %pin_arg|ILED %iled"
    export function setPin(pin_arg: AnalogPin, iled: DigitalPin): void {
        outputpin = pin_arg;
        enable = iled;
    }

    //% block="read pm2.5"
    export function readingpm25(): number {
        pins.digitalWritePin(enable, 1);
        basic.pause(.28);
        let sum = pins.analogReadPin(outputpin);
        for (let index = 0; index < 100; index++) {
            if (pins.analogReadPin(outputpin) > sum) sum = pins.analogReadPin(outputpin)
            basic.pause(0.04)
        }
        pins.digitalWritePin(enable, 0);
        let voltage = (((sum / 4) * 3.3) / 1023) * 11;
        if (voltage < Voc) Voc = voltage;
        let ret = ((voltage - Voc) / 5.8) * 1000;

        return ret;
    }

    //%block="calibration"
    export function calibration(): void {
        pins.digitalWritePin(enable, 1);
        basic.pause(.28);
        let sum = pins.analogReadPin(outputpin);
        for (let index = 0; index < 4; index++) {
            sum += pins.analogReadPin(outputpin);
            basic.pause(10);
        }
        pins.digitalWritePin(enable, 0);
        Voc = (((sum / 4) * 3.3) / 1023) * 11;
    }
}
