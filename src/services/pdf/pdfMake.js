const pdfMakeImportFactory = () => import(
    /* webpackPrefetch: true */
    /* webpackChunkName: "pdfBuilder" */
    './pdfMakeModuleImpl.js'
    );

let pdfMakeImport = null;

export default async function getPdfMake() {

    if (!pdfMakeImport) {
        pdfMakeImport = pdfMakeImportFactory();
    }

    const impl = await pdfMakeImport;
    return impl.default.pdfMake;
}