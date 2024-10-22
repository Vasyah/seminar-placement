// import statement
import pdfMake from "pdfmake/build/pdfmake";

// Defining and Using Custom Fonts
const pdfMakeFonts = {
    Roboto: {
        normal:
            "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
        bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
        italics:
            "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
        bolditalics:
            "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
    },
};

// Assign the custom fonts to pdfMake
pdfMake.fonts = pdfMakeFonts;

import { cmToPt } from './pdf';
import { formatName, generateEmptyRows } from './reports/Helpers';
import { format, parseISO } from 'date-fns';

const sportsmanCountOnPage = 23;
const maxNameLength = 22;

export async function downloadGeneralInfoReport(report) {
    const pages = generateGeneralInfoPages(report);
    const docDefinition = {
        pageMargins: [15, 40, 10, 0],
        header: function (currentPage) {
            return {
                columns: [
                    {
                        stack: [{ text: 'Расселение' }],
                        fontSize: 11,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 10, 0, 0],
                    },
                ],
            };
        },
        content: [...pages.map((p) => p.content)],
        defaultStyle: {
            fontSize: 8,
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
}

export function generateGeneralInfoPages(report) {
    const pages = [];

    for (let i = 0; i < report.length; i += sportsmanCountOnPage) {
        const page = {
            content: {
                table: {
                    widths: [cmToPt(0.69), cmToPt(8), cmToPt(2.5), cmToPt(2.5), cmToPt(4.25), cmToPt(2), cmToPt(2), cmToPt(2) ],
                    heights: [10, ...Array(sportsmanCountOnPage).fill(19)],
                    body: [
                        generateTableHeader(),
                        ...report.slice(i, i + sportsmanCountOnPage).map((sr, index) => generateSportsmanRow(sr, index + i + 1)),
                        ...generateEmptyRows(report.length, i + sportsmanCountOnPage, 7),
                    ],
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
        {
            text: 'Телефон',
            style: 'columnTitle',
            margin: [0, 10, 0, 0],
        },
        {
            text: 'Дата рождения',
            style: 'columnTitle',
            margin: [0, 10, 0, 0],
        },
        {
            text: 'Город',
            style: 'columnTitle',
            margin: [0, 10, 0, 5],
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
            text: 'Номер стола',
            style: 'columnTitle',
            margin: [10, 10, 10, 0],
        },
    ];
}

function generateSportsmanRow(sportsmanRow, index) {
    //const formattedSportsmanName = formatName(sportsmanRow.name, maxNameLength);

    const defaultMargin = [4, 2, 4, 2];
    const longNameMargin = [4, 0, 4, 0];
    //{ text: formattedSportsmanName, margin: formattedSportsmanName.length <= maxNameLength ? defaultMargin : longNameMargin },
    //{ text: sportsmanRow.birthday, margin: defaultMargin },

    return [
        { text: index.toString(), style: 'rowNumber' },
        { text: sportsmanRow.ФИО, margin: longNameMargin },
        { text: sportsmanRow.Телефон, margin: defaultMargin },
        { text: formatDate(sportsmanRow['Дата рождения'], index), margin: defaultMargin },
        { text: sportsmanRow.Город, margin: defaultMargin },
        { text: sportsmanRow.Корпус, margin: defaultMargin },
        { text: sportsmanRow.Комната, margin: defaultMargin },
        {}
    ];
}

const formatDate = (birthday, index) => {
    try {
        return format(parseISO(birthday), 'dd.MM.yyyy');
    }
    catch (e) {
        console.log('Invalid format', birthday, ' ', index);
    }
}
