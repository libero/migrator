export { Migration } from 'umzug';
import { Migration } from 'umzug';

export interface MigrationTool {
    pending(): Promise<Migration[]>;
    executed(): Promise<Migration[]>;
    up(migration?: string): Promise<Migration[]>;
    down(migration?: string): Promise<Migration[]>;
}

export interface OutputStream {
    write(str: string): void;
}
