//% color=#0fbc11 icon="" block="dust sensor"
namespace custom {
    const cov_ratio: number = 70;
    const no_dust_voltage: number = 400;
    const sys_voltage: number = 5000;

    let iled: DigitalPin;
    let vout: AnalogPin;

    function filter(m: number): number {
        let flag: boolean = false;
        let _buff: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let sum: number;
        let ret = m;

        if (!flag) {
            flag = true;
            for (let i = 0; i < 10; i++) {
                _buff[i] = m;
                sum += _buff[i];
            }
        }
        else {
            sum -= _buff[0];
            for (let i = 0; i < 9; i++) {
                _buff[i] = _buff[i + 1];
            }
            _buff[9] = m;
            sum += _buff[9];

            ret = sum / 10;
        }
        //serial.writeLine("" + ret);
        return Math.round(ret);
    }

    //%block="Initialize dust sensor ILED %Iled|AOUT %Vout"
    export function init(Iled: DigitalPin, Vout: AnalogPin): void {
        iled = Iled;
        vout = Vout;
    }

    //%block
    export function reading(): number {
        let density: number = 0;
        let adcvalue: number = 0;
        let voltage: number = 0;

        pins.digitalWritePin(iled, 1);
        control.waitMicros(280);
        adcvalue = pins.analogReadPin(vout);
        pins.digitalWritePin(iled, 0);

        adcvalue = filter(adcvalue);

        voltage = (sys_voltage / 1024) * adcvalue * 11;
        serial.writeLine("voltage:" + voltage)

        if (voltage >= no_dust_voltage) {
            voltage -= no_dust_voltage;
            density = voltage / cov_ratio;
        }
        return density;
    }
}
