import { WritableMemoryStream } from './writable-memory-stream';

describe('WritableMemoryStream', () => {
    it('initialises as empty', () => {
        const wms = new WritableMemoryStream();
        expect(wms.get()).toBe('');
    })

    it('can be written to', () => {
        const wms = new WritableMemoryStream();
        wms.write('one,');
        wms.write('two');
        wms.end();
        expect(wms.get()).toBe('one,two');
    })
});
