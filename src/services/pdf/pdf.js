export function cmToPt(value) {
    return value * 28;
}

function setStylesFieldToRowCells(row) {
    row = row.slice();
    for (let i = 0; i < row.length; i++) {
        if (typeof row[i] !== 'object')
            row[i] = {
                text: row[i],
            };

        const element = row[i];

        if (element.style === undefined) element.style = [];
        else if (!Array.isArray(element.style)) element.style = [element.style];
    }
    return row;
}

export function addStylesToCells(row, offset, indexes, styles) {
    row = setStylesFieldToRowCells(row);
    indexes.forEach((index) => {
        if (index + offset >= row.length) return;

        const element = row[index + offset];

        element.style.push(...styles);
    });
    return row;
}

export function addStylesToAllCells(row, styles) {
    row = setStylesFieldToRowCells(row);
    for (let i = 0; i < row.length; i++) {
        row[i].style.push(...styles);
    }
    return row;
}

export function writeRotatedText(text, fontSize, height) {
    fontSize *= 2;
    height *= 2.2;
    const canvas = document.createElement('canvas');
    // I am using predefined dimensions so either make this part of the arguments or change at will
    canvas.width = fontSize;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}pt PTMono`;
    ctx.save();
    ctx.translate(fontSize, height);
    ctx.rotate(-0.5 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(text, height / 2, 0);
    ctx.restore();
    return canvas.toDataURL();
}
