import * as pdfFonts from "./vfs_fonts"; // 👈 local import
const pdfMakeImportFactory = () => import(
    /* webpackPrefetch: true */
    /* webpackChunkName: "pdfBuilder" */
    './pdfMakeModuleImpl.js'
    );


let pdfMakeImport = null;

export default async function getPdfMake() {

    if (!pdfMakeImport) {
        pdfMakeImport = pdfMakeImportFactory();

        pdfMakeImport.fonts = {
            Roboto: {
              normal:
                "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
              bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
              italics:
                "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
              bolditalics:
                "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
            }
    }
}

    const impl = await pdfMakeImport;
    return impl.default.pdfMake;
}