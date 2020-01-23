import * as stream from 'stream';
const Writable = stream.Writable;

export class WritableMemoryStream extends Writable {
    private memoryBuffer: Buffer;

    constructor(options = {}) {
        super(options);
        this.memoryBuffer = Buffer.from('');
    }

    write(str: string): boolean {
        super.write(str);
        return true;
    }

    _write(chunk, enc, cb): void {
        const buffer = Buffer.isBuffer(chunk) ? chunk : new Buffer(chunk, enc);
        this.memoryBuffer = Buffer.concat([this.memoryBuffer, buffer]);
        cb();
    }

    public get(): string {
        return this.memoryBuffer.toString();
    }
}
