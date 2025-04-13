// import statement
import pdfMake from 'pdfmake/build/pdfmake';

// Defining and Using Custom Fonts
const pdfMakeFonts = {
    Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
    },
};

// Assign the custom fonts to pdfMake
pdfMake.fonts = pdfMakeFonts;

import { cmToPt } from './pdf';
import { generateEmptyRows } from './reports/Helpers';
import { format, parseISO } from 'date-fns';

let userCount = 25;
const maxNameLength = 22;

export async function downloadGeneralInfoReport(report, title, type) {
    if (type === 'common') {
        userCount = 28;
    }

    const pages = generateGeneralInfoPages(report);

    console.log(pages, userCount);
    const docDefinition = {
        pageMargins: [15, 40, 10, 0],
        header: function (currentPage) {
            return {
                columns: [
                    {
                        stack: [{ text: title }],
                        fontSize: 14,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 10, 0, 0],
                    },
                ],
            };
        },
        content: [...pages.map((p) => p.content)],
        defaultStyle: {
            fontSize: 10,
        },
        styles: {
            columnTitle: {
                bold: true,
                alignment: 'center',
            },
            rowNumber: {
                alignment: 'center',
                margin: [0, 2, 0, 0],
            },
            boldRowNumber: {
                alignment: 'center',
                margin: [0, 2, 0, 0],
                bold: true,
            },
        },
        pageOrientation: 'landscape',
    };

    const tableLayouts = {
        zeroPaddingsLayout: {
            paddingLeft: function (i, node) {
                return 0;
            },
            paddingRight: function (i, node) {
                return 0;
            },
            paddingTop: function (i, node) {
                return 0;
            },
            paddingBottom: function (i, node) {
                return 0;
            },
        },
    };

    pdfMake.createPdf(docDefinition, tableLayouts).open();
    pdfMake.createPdf(docDefinition, tableLayouts).download(`${title}.pdf`);
}

export function generateGeneralInfoPages(report) {
    const pages = [];

    for (let i = 0; i < report.length; i += userCount) {
        const page = {
            content: {
                table: {
                    widths: [cmToPt(1), cmToPt(7), cmToPt(3), cmToPt(10), cmToPt(2), cmToPt(2.3), cmToPt(2)],
                    headerRows: 1,
                    // heights: [10, ...Array(userCount).fill(19)],
                    body: [generateTableHeader(), ...report.slice(i, i + userCount).map((sr, index) => generateRow(sr, index + i + 1)), ...generateEmptyRows(report.length, i + userCount, 6)],
                },
                pageBreak: 'after',
                layout: 'zeroPaddingsLayout',
            },
        };
        pages.push(page);
    }

    if (pages.length > 0) {
        delete pages[pages.length - 1].content.pageBreak;
    }

    return pages;
}

function generateTableHeader() {
    return [
        {
            text: '№',
            style: 'columnTitle',
            margin: [0, 10, 0, 0],
        },
        {
            text: 'ФИО',
            style: 'columnTitle',
            margin: [0, 10, 0, 0],
        },
        // {
        //     text: 'Телефон',
        //     style: 'columnTitle',
        //     margin: [0, 10, 0, 0],
        // },
        {
            text: 'Город',
            style: 'columnTitle',
            margin: [0, 10, 0, 5],
        },
        {
            text: 'Учителя',
            style: 'columnTitle',
            margin: [0, 10, 0, 0],
        },

        {
            text: 'Корпус',
            style: 'columnTitle',
            margin: [0, 10, 0, 0],
        },
        {
            text: 'Комната',
            style: 'columnTitle',
            margin: [10, 10, 10, 0],
        },
        {
            text: 'Стол',
            style: 'columnTitle',
            margin: [10, 10, 10, 0],
        },
    ];
}

function generateRow(sportsmanRow, index) {
    //const formattedSportsmanName = formatName(sportsmanRow.name, maxNameLength);

    const defaultMargin = [4, 2, 4, 2];
    const longNameMargin = [4, 0, 4, 0];
    //{ text: formattedSportsmanName, margin: formattedSportsmanName.length <= maxNameLength ? defaultMargin : longNameMargin },
    //{ text: sportsmanRow.birthday, margin: defaultMargin },

    return [
        { text: index.toString(), style: 'rowNumber', margin: defaultMargin },
        { text: getName(sportsmanRow.ФИО), margin: defaultMargin },
        { text: getCityTitle(sportsmanRow.Город), margin: defaultMargin },
        // {text: sportsmanRow.Телефон, margin: defaultMargin},
        // {text: formatDate(sportsmanRow['Дата рождения'], index), margin: defaultMargin},
        { text: sportsmanRow['Учителя'], margin: defaultMargin },

        { text: sportsmanRow.Корпус, margin: defaultMargin },
        { text: sportsmanRow.Комната, margin: defaultMargin },
        {},
    ];
}

const formatDate = (birthday, index) => {
    try {
        return format(parseISO(birthday), 'dd.MM.yyyy');
    } catch (e) {
        console.log('Invalid format', birthday, ' ', index);
    }
};

const getCityTitle = (city) => {
    if (city === 'Санкт-Петербург') return 'СПБ';

    return city;
};

const getName = (name, status) => {
    if (status === 'Ребёнок') return `[Ребёнок] ${name}`;

    return name;
};
