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
