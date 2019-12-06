import { MigrationTool, Migration } from './types';

export class MockTool implements MigrationTool {
    commands: string[] = [];

    pending(): Promise<Migration[]> {
        this.commands.push('pending');
        return Promise.resolve([]);
    }

    executed(): Promise<Migration[]> {
        this.commands.push('executed');
        return Promise.resolve([]);
    }

    up(migration?: string): Promise<Migration[]> {
        this.commands.push('up');
        this.commands.push(migration ? migration : '<missing>');
        return Promise.resolve([]);
    }

    down(migration?: string): Promise<Migration[]> {
        this.commands.push('down');
        this.commands.push(migration ? migration : '<missing>');
        return Promise.resolve([]);
    }
}
