const Song = require('plaintext-song-parser');

test('creating a new Song class should result into default values', () => {
	const song = new Song();
	expect(song).toEqual({
		content: '',
		identifier: null,
		title: null,
		couplets: [],
		coupletsWithReferences: [],
	});
});

test('creating a new Song class with content should have the content', () => {
	const content = 'This is some random content\nasudsauhdds\r\nasdsahudhsahiiusahid\nsajidjosjojsaojasodjas\r\n#jasdashdhashdi\nsadasdijasidsajid';
	const song = new Song(content);
	expect(song.content).toBe(content);
});

test('creating a new Song class with identifier should have the identifier', () => {
	const identifiers = [[null, null], ['test', 'test'], [105, 105], ['203', 203]];
	for (const [identifier, expected] of identifiers) {
		const song = new Song(null, identifier);
		expect(song.identifier).toBe(expected);
	}
});

test('creating a new Song class with title should have the title', () => {
	const title = 'This is some random title';
	const song = new Song(null, null, title);
	expect(song.title).toBe(title);
});

test('the getTitleFromText should works as it supposed to work', () => {
	const titleValue = 'This is my Title';
	const lyricses = [['# ' + titleValue, 'test'], ['#' + titleValue,'test']];
	lyricses.push(lyricses[0].join('\n'));
	lyricses.push(lyricses[1].join('\n'));
	lyricses.push(lyricses[0].join('\r\n'));
	lyricses.push(lyricses[1].join('\r\n'));

	expect(Song.getTitleFromText()).toBe(null);
	for (const lyrics of lyricses)
		expect(Song.getTitleFromText(lyrics)).toBe(titleValue);
});


const lyrics = "# Put your title on the first line after an '#'\nHere is the first line of your song\nAnd here is the second line\n\nThis is a new paragraph\nand this line belongs to it\n\nIf you have paragraphs that\nneed to be split up, just add a\n[split]\nand this paragraph will\nbelong to the same couplet\n\nRefrain:\n^^ this will create a reference\nthat this paragraph is named 'Refrain'\nIt may not include spaces!\n[split]\nYou can also split these up\ninto multiple parts\n[split]\nAnd you would name them if you want\nto reuse these lines of the song later.\nIf you want to sing this again, just add\n\n(Refrain)\n\nand if you need to repeat\nthat paragraph more than once\njust add the amount and an x\nafter the name of the reference\n\n(Refrain 2x)";
test('parsing a song content should set the coupletsWithReferences to the correct content', () => {
	const song = new Song(lyrics);
	expect(JSON.stringify(song.coupletsWithReferences)).toBe(
		JSON.stringify([
			["Here is the first line of your song\nAnd here is the second line"],
			["This is a new paragraph\nand this line belongs to it"],
			["If you have paragraphs that\nneed to be split up, just add a\n","and this paragraph will\nbelong to the same couplet"],
			["^^ this will create a reference\nthat this paragraph is named 'Refrain'\nIt may not include spaces!\n","You can also split these up\ninto multiple parts\n","And you would name them if you want\nto reuse these lines of the song later.\nIf you want to sing this again, just add"],
			["(Refrain)"],
			["and if you need to repeat\nthat paragraph more than once\njust add the amount and an x\nafter the name of the reference"],
			["(Refrain 2x)"]
		])
	);
});

test('parsing a song content should set the couplets to the correct content', () => {
	const song = new Song(lyrics);
	expect(JSON.stringify(song.couplets)).toBe(
		JSON.stringify([
			["Here is the first line of your song\nAnd here is the second line"],
			["This is a new paragraph\nand this line belongs to it"],
			["If you have paragraphs that\nneed to be split up, just add a\n","and this paragraph will\nbelong to the same couplet"],
			["^^ this will create a reference\nthat this paragraph is named 'Refrain'\nIt may not include spaces!\n","You can also split these up\ninto multiple parts\n","And you would name them if you want\nto reuse these lines of the song later.\nIf you want to sing this again, just add"],
			["^^ this will create a reference\nthat this paragraph is named 'Refrain'\nIt may not include spaces!\n","You can also split these up\ninto multiple parts\n","And you would name them if you want\nto reuse these lines of the song later.\nIf you want to sing this again, just add"],
			["and if you need to repeat\nthat paragraph more than once\njust add the amount and an x\nafter the name of the reference"],
			["^^ this will create a reference\nthat this paragraph is named 'Refrain'\nIt may not include spaces!\n","You can also split these up\ninto multiple parts\n","And you would name them if you want\nto reuse these lines of the song later.\nIf you want to sing this again, just add","^^ this will create a reference\nthat this paragraph is named 'Refrain'\nIt may not include spaces!\n","You can also split these up\ninto multiple parts\n","And you would name them if you want\nto reuse these lines of the song later.\nIf you want to sing this again, just add"]
		])
	);
});
