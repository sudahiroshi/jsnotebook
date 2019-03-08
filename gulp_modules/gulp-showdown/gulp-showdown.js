import through from 'through2';
import showdown from 'showdown';

export function gulpShowdown(options) {
  const defaultOptions = {
    extensions: ['table'],
  };

  const converter = new showdown.Converter(options || defaultOptions);

  return through.obj((file, encoding, cb) => {
    const fileText = file.contents.toString();

    const fileHtml = converter.makeHtml(fileText);

    file.contents = Buffer.from(fileHtml);

    cb(null, file);
  });
}

export default gulpShowdown;
