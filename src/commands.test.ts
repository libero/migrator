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
        expect(statSync(filename).size).toBe(198);
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

    it('show both statuses', async () => {
        await cmd.showPendingStatus();
        await cmd.showExecutedStatus();
        outStream.end();

        expect(outStream.get()).toContain('Pending migrations');
        expect(outStream.get()).toContain('Executed migrations');
    });

    it('showPendingStatus', async () => {
        await cmd.showPendingStatus();
        outStream.end();

        expect(outStream.get()).toContain('Pending migrations');
        expect(outStream.get()).not.toContain('Executed migrations');
    });

    it('showExecutedStatus', async () => {
        await cmd.showExecutedStatus();
        outStream.end();

        expect(outStream.get()).not.toContain('Pending migrations');
        expect(outStream.get()).toContain('Executed migrations');
    });
});
