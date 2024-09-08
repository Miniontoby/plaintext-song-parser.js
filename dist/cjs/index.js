'use strict';

class Song {
    constructor(content, identifier = null, title = null) {
        this.content = '';
        this.identifier = null;
        this.title = null;
        this.couplets = [];
        this.coupletsWithReferences = [];
        this.modifiers = {};
        if (identifier) {
            this.identifier = Number(identifier);
            if (isNaN(this.identifier))
                this.identifier = identifier;
        }
        if (content && content !== '') {
            if (typeof (content) == 'string')
                this.content = content;
            else
                this.content = content.join('\n');
        }
        if (title && title !== '')
            this.title = title;
        if (this.content) {
            this.modifiers = Song.getModifiersFromText(this.getLines(true));
            if (this.title === null && this.modifiers?.title)
                this.title = this.modifiers.title;
            this.process();
        }
    }
    get lines() {
        return this.getLines();
    }
    getLines(returnComments = false) {
        const allLines = this.content?.split(/\r?\n/);
        if (!allLines)
            return null;
        const firstNonCommentIndex = allLines.findIndex(line => !line.startsWith('#'));
        if (returnComments)
            return allLines.slice(0, firstNonCommentIndex > -1 ? firstNonCommentIndex : undefined); // +1 cause this is exclusive of the element at the index 'end'
        else
            return allLines.slice(firstNonCommentIndex);
    }
    process() {
        if (!this.lines)
            return;
        const paragraphs1 = this.lines.join('\n').split('\n\n'); // split the paragraphs
        let paragraphs = paragraphs1.map((al) => [al]); // map the paragraphs in seperate arrays
        paragraphs = paragraphs.map((al) => al[0].split('[split]\n')); // split the paragraphs on the keyword: '[split]'
        const lastPart = paragraphs[paragraphs.length - 1], lastAl = lastPart[lastPart.length - 1]; // get the last array of the last paragraph
        if (lastAl.endsWith('\n'))
            paragraphs[paragraphs.length - 1][lastPart.length - 1] = lastAl.slice(0, -1); // Make sure to remove the linebreak of the last paragraph, else some statements will fail
        const parts = paragraphs.map((al, i) => {
            if (al[0].split('\n')[0].endsWith(':') && al[0].split('\n')[0].split(' ').length == 1)
                return [i, al];
            return null;
        }).filter((x) => x !== null); // filter all paragraphs that end on ':' and that contain no spaces
        const blockNames = parts.map((al) => [al[0], al[1][0].split('\n')[0].replace(':', '')]); // get the reference names from the parts array
        const blockContents = parts.map((al) => { const lines = al[1][0].split('\n'); lines.splice(0, 1); al[1][0] = lines.join('\n'); return al[1]; }); // get the contents of them, by removing the first line of the paragraph out of the parts array
        const blocks = blockNames.map((name, i) => [name[0], name[1], blockContents[i]]); // combine the two arrays into 1 array in the format: [id, 'name', 'content']
        let blockUsage = paragraphs.map((al, i) => {
            const p = al[0].split('\n');
            if (al.length > 1 || p.length > 1)
                return null;
            const myBlockNames = blockNames.map(a => a[1]);
            if (myBlockNames.includes(p[0]) || myBlockNames.includes(p[0].replace('Repeat ', '')) || myBlockNames.includes(p[0].replace(/\(([\w]+)( (\d+)x|)\)/, '$1')))
                return [i, p[0]];
            return null;
        }).filter((x) => x !== null); // filter the paragraphs that include an reference to an existing reference
        blockUsage = blockUsage.map((us) => [us[0], us[1].replace('Repeat ', '').replace(/\((\w+)( (\d+)x|)\)/, '$1$2')]); // Remove 'Repeat ' keyword from the text and the '(key)' and '(key 2x)' keywords
        const blockUsing = blockUsage.map((us) => {
            const ourid = us[1].replace(/ (\d+)x/, '');
            const amount = Number(us[1].replace(/(\w+)( (\d+)x|)/, '$3')) || 1;
            const out = blocks.find((bl) => bl[1] == ourid);
            if (!out)
                return;
            return [us[0], ourid, amount, out[2]]; // [index inside paragraphs, blockName, amount of repeats, text]
        }).filter((x) => x !== null);
        this.coupletsWithReferences = JSON.parse(JSON.stringify(paragraphs));
        for (const [index, blockName, amount, text] of blockUsing) {
            paragraphs[index] = text; // replace the contents of the paragraph with the contents of the reference
            for (let i = 1; i < amount; i++)
                paragraphs[index] = [...paragraphs[index], ...text]; // repeat adding in the contents for the amount
        }
        this.couplets = paragraphs;
    }
    static getTitleFromText(content) {
        const modifiers = Song.getModifiersFromText(content);
        return modifiers?.title ?? null;
    }
    static getModifiersFromText(content) {
        const lines = (typeof (content) == 'string') ? content.split(/\r?\n/) : content;
        if (lines === null || lines === undefined)
            return {};
        const firstNonCommentIndex = lines?.findIndex(line => !line.startsWith('#'));
        const comments = lines.slice(0, firstNonCommentIndex > -1 ? firstNonCommentIndex : undefined);
        const modifiers = {};
        for (let comment of comments) {
            comment = comment.replace(/^#\s*/, ''); // Remove comment prefix
            const regex = /^([\w]+)\s*=\s*(.*)$/;
            const m = regex.exec(comment);
            if (m) {
                modifiers[m[1]] = m[2];
                if (m[2] === 'true')
                    modifiers[m[1]] = true;
                else if (m[2] === 'false')
                    modifiers[m[1]] = false;
                else if (!isNaN(Number(m[2])))
                    modifiers[m[1]] = Number(m[2]);
            }
            else if (!comment.includes('=')) {
                modifiers['title'] = comment;
            }
        }
        return modifiers;
    }
}

module.exports = Song;
//# sourceMappingURL=index.js.map
