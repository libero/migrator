import { Commands } from './commands';
import { OutputStream } from './types';
import { WritableMemoryStream } from './writable-memory-stream';
import { MockTool } from './mock-tool';
import { statSync } from 'fs';

describe('Commands class', () => {
    let tool: MockTool;
    let cmd: Commands;
    let outStream: WritableMemoryStream;
    const filename = '/tmp/test';

    beforeEach(() => {
        outStream = new WritableMemoryStream();
        tool = new MockTool();
        cmd = new Commands(tool, outStream as OutputStream);
    });

    it('makeMigrationFile creates template', () => {
        cmd.makeMigrationFile(filename);
        expect(outStream.get()).toBe(`Successfully created migration ${filename}\n`);
        expect(tool.commands).toHaveLength(0);
        expect(statSync(filename).size).toBe(158);
    });

    it('runMigrations', async () => {
        await cmd.runMigrations();
        outStream.end();

        expect(tool.commands).toHaveLength(2);
        expect(tool.commands[0]).toBe('up');
        expect(tool.commands[1]).toBe('<missing>');
        expect(outStream.get()).toContain('Successfully migrated:');
    });

    it('rollback', async () => {
        await cmd.rollback();
        outStream.end();

        expect(tool.commands).toHaveLength(2);
        expect(tool.commands[0]).toBe('down');
        expect(tool.commands[1]).toBe('<missing>');
        expect(outStream.get()).toContain('Successfully rolled back:');
    });

    it('showStatus - both', async () => {
        await cmd.showStatus({ pending: true, executed: true });
        outStream.end();

        expect(outStream.get()).toContain('Pending migrations');
        expect(outStream.get()).toContain('Executed migrations');
    });

    it('showStatus - only pending', async () => {
        await cmd.showStatus({ pending: true, executed: false });
        outStream.end();

        expect(outStream.get()).toContain('Pending migrations');
        expect(outStream.get()).not.toContain('Executed migrations');
    });

    it('showStatus - only executed', async () => {
        await cmd.showStatus({ pending: false, executed: true });
        outStream.end();

        expect(outStream.get()).not.toContain('Pending migrations');
        expect(outStream.get()).toContain('Executed migrations');
    });
});
