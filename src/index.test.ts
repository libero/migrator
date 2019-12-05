import { Cli } from './index';
import { Commands } from './commands';

describe('cli', () => {
    let commands;
    let cli;

    beforeEach(() => {
        commands = ({
            init: jest.fn(),
            runMigrations: jest.fn(),
            rollback: jest.fn(),
            makeMigrationFile: jest.fn(),
            showStatus: jest.fn(),
        } as unknown) as Commands;

        cli = new Cli(
            {
                name: 'name',
                knexConfig: {
                    client: 'sqlite3',
                    useNullAsDefault: true,
                },
                migrations: {
                    path: '/a/path',
                },
            },
            commands,
        );
    });

    it('generates unique filenames over 1 second', done => {
        const thing1: string = cli.filePath('thing1');
        let thing2: string;
        setTimeout(() => {
            thing2 = cli.filePath('thing1');
            expect(thing1).not.toBe(thing2);
            expect(thing1.startsWith('/a/path')).toBe(true);
            expect(thing2.startsWith('/a/path')).toBe(true);
            expect(thing1).toContain('thing1');
            expect(thing2).toContain('thing1');
            done();
        }, 1000);
    });

    it('runs migrations', () => {
        cli.finish = jest.fn();
        cli.commandRun();

        expect(commands.runMigrations).toHaveBeenCalledTimes(1);
    });

    it('rollbacks migrations', () => {
        cli.finish = jest.fn();
        cli.commandRollback();

        expect(commands.rollback).toHaveBeenCalledTimes(1);
    });

    it('makes migration fixture', () => {
        cli.finish = jest.fn();
        cli.filePath = (): string => '/path/to/-test.ts';
        cli.commandMake({ _: ['make'], $0: 'migrate', name: 'test', n: 'test' });

        expect(commands.makeMigrationFile).toHaveBeenCalledTimes(1);
        expect(commands.makeMigrationFile).toHaveBeenCalledWith('/path/to/-test.ts');
    });

    it('displays status of migrations', () => {
        cli.finish = jest.fn();
        cli.commandStatus({ _: ['status'], $0: 'example-cli', pending: true, executed: false });

        expect(commands.showStatus).toHaveBeenCalledTimes(1);
        expect(commands.showStatus).toHaveBeenCalledWith({ pending: true, executed: false });
    });
});
