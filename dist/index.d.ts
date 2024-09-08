declare class Song {
    content: string;
    identifier: number | string | null;
    title: string | null;
    couplets: string[][];
    coupletsWithReferences: string[][];
    modifiers: {
        title?: string;
    } & any;
    constructor(content: string[] | string, identifier?: number | string | null, title?: string | null);
    get lines(): string[] | null;
    private getLines;
    process(): void;
    static getTitleFromText(content: string[] | string): string | null;
    static getModifiersFromText(content: string[] | string): {
        title: string;
    } & any;
}

export { Song as default };
