declare class Song {
    content: string;
    identifier: number | string | null;
    title: string | null;
    couplets: string[][];
    coupletsWithReferences: string[][];
    constructor(content: string[] | string, identifier?: number | string | null, title?: string | null);
    get lines(): string[] | null;
    getLines(returnComments?: boolean): string[] | null;
    process(): void;
    static getTitleFromText(content: string[] | string): string | null;
}

export { Song as default };
