import createWasmModule from "./wasm/image_processor";

let wasm: any;

// console.log('Worker script loaded');

// Listen for messages from main thread
self.onmessage = async (e) => {
    // console.log('Worker recieved message:', e.data.type);
    const { type, uint8Array, extension, id } = e.data;

    if (type === "init") {
        try {
            await initWasm();
            // console.log('WASM init complete');
            self.postMessage({ type: 'init-complete', id });
        } catch (error) {
            console.error('WASM init failed:', error);
            self.postMessage({
                type: 'error',
                error: error instanceof Error ? error.message : String(error),
                id
            });
        }
        return;
    }

    if (type === 'process') {

        try {
            const result = await processImage(uint8Array, extension);
            self.postMessage({
                type: 'result',
                data: result,
                id
            }, [result.image.buffer]);
        } catch (error) {
            console.error('Image processing failed:', error);
            self.postMessage({
                type: 'error',
                error: error instanceof Error ? error.message : String(error),
                id
            });
        }
        return;
    }
};

async function initWasm() {
    return new Promise<void>((resolve, reject) => {
        createWasmModule().then((mod) => {
            // console.log(`calledRun: ${mod.calledRun}`);
            // console.log(`malloc: ${mod._malloc}`);

            if (mod.calledRun || mod._malloc) {
                wasm = mod;
                // console.log(Object.keys(wasm));
                // console.log(wasm.HEAPU8);
                resolve();
            } else {
                mod.onRuntimeInitialized = () => {
                    wasm = mod;
                    // console.log('WASM runtime initialized')
                    resolve();
                }
            }
        }).catch((error) => {
            console.error('createWasmModule failed:', error);
            reject(error)
        })
    })
}

function processImage(buffer: Uint8Array, extension: string): any {
    if (!wasm) throw new Error('WASM not initialized')

    switch (extension) {
        case 'jpeg':
        case 'jpg':
            return processJpeg(buffer);
        default:
            throw new Error(`Unsupported extension: ${extension}`);
    }
}

function processJpeg(buffer: Uint8Array): any {
    const ptr = wasm._malloc(buffer.length);
    wasm.HEAPU8.set(buffer, ptr);

    const exif = getJpegEXIF(ptr, buffer.length);
    const image = convertJpegImage(ptr, buffer.length)

    let dataObject: any;
    if (!exif) {
        dataObject = { image: image }
    } else {
        dataObject = {
            image: image,
            width: exif.ExifImageWidth ?? null,
            height: exif.ExifImageHeight ?? null,
            deviceMake: exif.Make ?? null,
            deviceModel: exif.Model ?? null,
            aperture: exif.FNumber ?? null,
            shutterSpeed: exif.ExposureTime ?? null,
            iso: exif.ISO ?? null,
            focalLength: exif.FocalLength ?? null,
            // -- implement support for other exif items here'
        }
    }

    return dataObject;
}

function convertJpegImage(ptr: number, length: number): Uint8Array {
    const sizePtr = wasm._malloc(4);
    const resultPtr = wasm._convert_jpeg_to_avif(ptr, length, sizePtr);
    const size = wasm.HEAPU32[sizePtr >> 2];

    if (resultPtr === 0 || size === 0) {
        console.error("Conversion Failed");
        wasm._free(sizePtr);
        return new Uint8Array();
    }

    const result = new Uint8Array(wasm.HEAPU8.subarray(resultPtr, resultPtr + size));
    wasm._free(ptr);
    wasm._free(sizePtr);

    return result;
}

function getJpegEXIF(imagePtr: number, imageLength: number): any {
    const ptrToPtr = wasm._malloc(4);

    try {
        wasm._find_exif_jpeg(imagePtr, imageLength, ptrToPtr);

        const resultPtr = wasm.getValue(ptrToPtr, '*');

        if (!resultPtr) {
            return null;
        }

        const jsonStr: string = wasm.UTF8ToString(resultPtr);

        if (!jsonStr) {
            return null;
        }

        const clean = jsonStr
            .replace(/[\u0000-\u001F\u007F]/g, "")
            .trim();

        if (!clean) {
            return null;
        }

        let parsedContent: any;
        try {
            parsedContent = JSON.parse(clean);
        } catch (err) {
            console.error("Invalid EXIF JSON from JSON", {
                raw: jsonStr,
                clean,
                resultPtr
            });
            return null;
        }

        for (const key in parsedContent) {
            if (typeof parsedContent[key] === "string") {
                parsedContent[key] = parsedContent[key].trimEnd();
            }
        }

        parsedContent.FNumber = fractionStrToNumber(parsedContent.FNumber);

        if (parsedContent.FocalLengthIn35mmFormat) {
            parsedContent.FocalLength = parsedContent.FocalLengthIn35mmFormat;
        } else {
            parsedContent.FocalLength = fractionStrToNumber(parsedContent.FocalLength);
        }

        return parsedContent;
    } finally {
        const resultPtr = wasm.getValue(ptrToPtr, "*");
        wasm._free(ptrToPtr);
        if (resultPtr) wasm._free(resultPtr);
    }
}

/**
 * This takes a fraction formatted as (x/x)
 * Returns it in decimal form
 * @param item 
 * @returns number
 */
function fractionStrToNumber(item: string) {

    if (item) {
        if (typeof (item) === "string" && item.includes('/')) {
            const [numerator, denominator] = item.split('/').map(Number);
            return numerator / denominator;
        }
    }
    return;
}