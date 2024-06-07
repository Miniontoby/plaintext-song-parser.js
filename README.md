# Plaintext Song Parser for JavaScript

Allows you to parse plaintext lyrics file contents into a Javascript object

## Installation

1. From npmjs.com
   ```
   npm install plaintext-song-parser
   ```
2. From Github:
   ```
   npm install https://github.com/Miniontoby/plaintext-song-parser.js
   ```
3. From an CDN (only for browser):
   ```
   <script src="https://cdn.jsdelivr.net/npm/plaintext-song-parser/dist/plaintext-song-parser.min.js"></script>
   ```

## Usage

This package ships in three types. Select your way for importing it:

1. CJS (when using `require`):
   ```js
   const Song = require('plaintext-song-parser');
   ```
2. ESM (when using `"type": "module"`):
   ```js
   import Song from 'plaintext-song-parser';
   ```
3. UMD (Browser):
   If you added the script tag from earlier, you are good to go, since it loads it automatically to `window.Song`
   

After you imported the `Song` class, you can start using it:

```js 
const content = `<GET YOUR CONTENT FROM SOMEWHERE>`;

const song = new Song(content);

console.log(song.couplets);
```

## API

- `new Song(content: string[]|string, identifier: number|string|null = null, title: string|null = null)`
  Makes a new Song object and processes the supplied content.
  You can supply an `identifier` in order to keep track of which Song is which
  And if you really need to, you can also supply an `title`, but this will also be parsed from the first line of the `content` if it starts with `#`
- `Song.content: string`
  Returns the content you supplied
- `Song.identifier: number|string|null`
  Returns the identifier you supplied
- `Song.title: string|null`
  Returns the title you supplied or the title that was parsed
- `Song.coupletsWithReferences: string[][]`
  Returns an array containing an array of strings which is the parsed lyrics.
  This includes the references and can be seen as plain parsing
- `Song.couplets: string[][]`
  Returns the same as `Song.coupletsWithReferences`, but the references are replaced by the lyrics connected to that reference.
  This is the recommended property to use.
- `static Song.getTitleFromText(content: string[]|string)`
  Returns the title from the text
  This will be parsed from the first line of the `content` if it starts with `#`
  If no title can be found, it will return `null`, so if you always need an string, just add `?? ''` after the method...


## Song format

For parsing the songs, you need to supply the songtext into the `content` parameter when creating the `Song` object
The format for the *`content` parameter*/*the songfile*, is the following:

```txt
# Put your title on the first line after an '#'
Here is the first line of your song
And here is the second line

This is a new paragraph
and this line belongs to it

If you have paragraphs that
need to be split up, just add a
[split]
and this paragraph will
belong to the same couplet

Refrain:
^^ this will create a reference
that this paragraph is named 'Refrain'
It may not include spaces!
[split]
You can also split these up
into multiple parts
[split]
And you would name them if you want
to reuse these lines of the song later.
If you want to sing this again, just add

(Refrain)

and if you need to repeat
that paragraph more than once
just add the amount and an x
after the name of the reference

(Refrain 2x)
```

## Why

Well,

Since the beginning of 2023 I started working on SongTextProjector, which is a songtext presentation software/website/app.
For that I wanted it to be as easy as it could be to make new song files and to edit them during usage of the app, 
so I wanted to use plain .txt files for the songs, so you could edit them using your favorite editor.

In the begining, I made a working, but bad first Song class, but it lacked a lot of parsing extra stuff.
Then when I was at school and I had to do a little research project, I decided to do it about parsing songs.
In the project I did three steps: Finding the best place where to get songs from, finding the most used keywords/format in songs, and making a song parser.

The document (in Dutch) is inside of this repository for you to read it if you want. (see the `extra_stuff` folder)
I might translate it into English if people want to read it.
And for the record, I got an 7.2 out of 10 as grade for the research project.

This package/class is the result of that last step.

