const fs = require('fs');
const PNG = require('pngjs').PNG;
const diff = require('diff');
const compareColors = require('./compareColors');

let aArray = null;
let bArray = null;

const COLORD_DIFF_TRESHOLD = 50;

function comparator(left, right) {
    for (let i = 0; i < left.length; i++) {
        const rgbA = left[i];
        const rgbB = right[i];
        let value = 0;

        if (rgbA.r !== rgbB.r || rgbA.g !== rgbB.g || rgbA.b !== rgbB.b) {
            value = compareColors(left[i], right[i]);
        }

        if (value > COLORD_DIFF_TRESHOLD) {
            return false;
        }
    }

    return true;
}

function imgToLines(img) {
    const table = [];

    for (let y = 0; y < img.height; y++) {
        const row = [];

        for (let x = 0; x < img.width; x++) {
            const idx = (img.width * y + x) << 2;
            const r = img.data[idx];
            const g = img.data[idx + 1];
            const b = img.data[idx + 2];

            row.push({ r, g, b });
        }

        table.push(row);
    }

    return table;
}

function compare() {
    if (!aArray || !bArray) {
        return;
    }

    const output = diff.diffArrays(aArray, bArray, {
        comparator
    });

    const stats = {added: 0, removed: 0, same: 0};
    const visualDiff = [];
    const width = aArray[0].length;
    let height = 0;

    // build diff image, collect stats
    output.forEach(item => {
        if (item.added) {
            stats.added += item.count;
        } else if (item.removed) {
            stats.removed += item.count;
        } else {
            stats.same += item.count;
        }

        item.value.forEach(line => {
            line.forEach(pixel => {
                if (item.removed) {
                    visualDiff.push(pixel.r);
                    visualDiff.push(0);
                    visualDiff.push(0);
                } else if (item.added) {
                    visualDiff.push(0);
                    visualDiff.push(pixel.g);
                    visualDiff.push(0);
                } else {
                    visualDiff.push(pixel.r);
                    visualDiff.push(pixel.g);
                    visualDiff.push(pixel.b);
                }

                visualDiff.push(255);
            });
            height++;
        });
    });

    // save diff image
    const diffFile = new PNG({ width, height });
    diffFile.data.set(visualDiff);
    diffFile.pack().pipe(fs.createWriteStream('./output.png'));

    console.log('Identical lines: ', stats.same, Math.round((stats.same * 100) / height) + '%');
    console.log('Added lines:     ', stats.added);
    console.log('Removed lines:   ', stats.removed);
}

fs.createReadStream('./data/single-column-a.png')
    .pipe(new PNG())
    .on('parsed', function () {
        aArray = imgToLines(this);
        compare();
    });

fs.createReadStream('./data/single-column-b.png')
    .pipe(new PNG())
    .on('parsed', function () {
        bArray = imgToLines(this);
        compare();
    });