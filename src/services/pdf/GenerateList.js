// import statement
import pdfMake from 'pdfmake/build/pdfmake';

export const pdfType = {
    badges: 'badges',
    'teachers': 'teachers',
    pay: 'pay'
}
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

import {cmToPt} from './pdf';
import {generateEmptyRows} from './reports/Helpers';
import {format, parseISO} from 'date-fns';

let userCount = 25;
const maxNameLength = 22;

export async function downloadGeneralInfoReport(report, title, type) {
    if (type === 'common' || type === 'otherCity') {
        userCount = 28;
    }

    if (type === pdfType.teachers) {
        userCount = 30
    }
    if (type === pdfType.badges) {
        userCount = 45;
    }

    if (type === pdfType.pay) {
        userCount = 45;
    }

    const pages = generateGeneralInfoPages(report, type);

    const getOrientation = (type) => {
        switch (type) {
            case pdfType.badges:
                return 'portrait';
            case pdfType.pay:
                return 'portrait';
            default:
                return `landscape`;
        }
    };

    const docDefinition = {
        pageMargins: [15, 40, 10, 0],
        header: function (currentPage) {
            return {
                columns: [
                    {
                        stack: [{text: title}],
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
        pageOrientation: getOrientation(type),
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

const getEmptyColumnsCount = (type) => {
    if (type === pdfType.badges) return 4

    if (type === pdfType.pay) return 4

    return 6
}

export function generateGeneralInfoPages(report, type) {
    const pages = [];

    for (let i = 0; i < report.length; i += userCount) {
        const page = {
            content: {
                table: {
                    widths: getColumnSize(type),
                    headerRows: 1,
                    // heights: [10, ...Array(userCount).fill(19)],
                    body: [getColumns(type), ...report.slice(i, i + userCount).map((sr, index) => generateRow(sr, index + i + 1, type)), ...generateEmptyRows(report.length, i + userCount, getEmptyColumnsCount(type))],
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

function getColumnSize(type) {
    switch (type) {
        case pdfType.badges:
            return [cmToPt(1), "*", "*", "*", cmToPt(4)]
        case pdfType.pay:
            return [cmToPt(1), cmToPt(7), "*", cmToPt(4), cmToPt(4)]
        default:
            return [cmToPt(1), cmToPt(7), cmToPt(3), cmToPt(10), cmToPt(2), cmToPt(2.3), cmToPt(2)]
    }
}

function generatePaymentHeader() {
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
            text: 'Город',
            style: 'columnTitle',
            margin: [0, 10, 0, 5],
        },
        {
            text: 'Преображение',
            style: 'columnTitle',
            margin: [10, 10, 10, 0],
        },
        {
            text: 'Вода',
            style: 'columnTitle',
            margin: [10, 10, 10, 0],
        },
    ];
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

function getColumns(type) {
    switch (type) {
        case pdfType.badges:
            return [
                {
                    text: '№',
                    style: 'columnTitle',
                    margin: [0, 10, 0, 0],
                },
                {
                    text: 'Фамилия',
                    style: 'columnTitle',
                    margin: [0, 10, 0, 0],
                },
                {
                    text: 'Имя',
                    style: 'columnTitle',
                    margin: [0, 10, 0, 0],
                },
                {
                    text: 'Отчество',
                    style: 'columnTitle',
                    margin: [0, 10, 0, 0],
                },
                {
                    text: 'Город',
                    style: 'columnTitle',
                    margin: [0, 10, 0, 5],
                },

            ];
        case pdfType.pay:
            return generatePaymentHeader()
        default:
            return generateTableHeader()
    }
}

function generateRow(sportsmanRow, index, type) {
    const defaultMargin = [4, 2, 4, 2];

    if (type === pdfType.badges) {
        return [
            {text: index.toString(), style: 'rowNumber', margin: defaultMargin},
            {text: sportsmanRow.Фамилия, margin: defaultMargin},
            {text: sportsmanRow.Имя, margin: defaultMargin},
            {text: sportsmanRow.Отчество, margin: defaultMargin},
            {text: sportsmanRow.Город, margin: defaultMargin},
        ];
    }

    if (type === pdfType.pay) {
        return [
            {text: index.toString(), style: 'rowNumber', margin: defaultMargin},
            {text: sportsmanRow.ФИО, margin: defaultMargin},
            {text: sportsmanRow.Город, margin: defaultMargin},
            {},
            {}
        ];
    }

    return [
        {text: index.toString(), style: 'rowNumber', margin: defaultMargin},
        {text: sportsmanRow.ФИО, margin: defaultMargin},
        {text: getCityTitle(sportsmanRow.Город), margin: defaultMargin},
        {text: sportsmanRow['Учителя'], margin: defaultMargin},

        {text: sportsmanRow.Корпус, margin: defaultMargin},
        {text: sportsmanRow.Комната, margin: defaultMargin},
        {},
    ];
}

const getCityTitle = (city) => {
    if (city === 'Санкт-Петербург') return 'СПБ';

    return city;
};

