import * as table from 'borderless-table';
import { writeFileSync } from 'fs';
import { EOL } from 'os';
import migrationTemplate from './migration-template';
import { MigrationTool, Migration, OutputStream } from 'types';

export class Commands {
    private tool: MigrationTool;
    private outStream: OutputStream;

    public constructor(tool: MigrationTool, outStream: OutputStream) {
        this.tool = tool;
        this.outStream = outStream;
    }

    public makeMigrationFile(filePath: string): void {
        writeFileSync(filePath, migrationTemplate);

        this.printLn(`Successfully created migration ${filePath}`);
    }

    public async runMigrations(): Promise<void> {
        const migrations: Migration[] = await this.tool.up();

        this.printMigrations(migrations, 'Successfully migrated:');
    }

    public async rollback(): Promise<void> {
        const migrations: Migration[] = await this.tool.down();

        this.printMigrations(migrations, 'Successfully rolled back:');
    }

    public async showStatus({ pending, executed }): Promise<void> {
        if (!pending && !executed) {
            pending = executed = true;
        }

        if (pending) {
            const pendingMigrations: Migration[] = await this.tool.pending();
            this.printMigrations(pendingMigrations, 'Pending migrations');
        }

        if (executed) {
            const executedMigrations: Migration[] = await this.tool.executed();
            this.printMigrations(executedMigrations, 'Executed migrations');
        }
    }

    private printLn(msg = ''): void {
        this.outStream.write(msg + EOL);
    }

    private printMigrations(migrations: Migration[], header: string): void {
        table(migrations, ['file'], [header], this.outStream);
        this.printLn();
    }
}
