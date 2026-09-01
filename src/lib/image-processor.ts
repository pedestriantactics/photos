import ImageWorker from './image-worker?worker'

let worker: Worker | null = null;
let messageId = 0;
const pendingMessages = new Map<number, { resolve: Function, reject: Function }>();

export async function initWasm() {
    // Create worker
    worker = new ImageWorker();

    // Set up message handler
    worker.onmessage = (e) => {
        const { type, data, error, id } = e.data;

        // console.log('Worker message recieved', type, id);

        const pending = pendingMessages.get(id);

        if (pending) {
            if (type === 'error') {
                pending.reject(new Error(error));
            }
            else if (type === "init-complete" || type === 'result') {
                pending.resolve(data);
            } else {
                pending.reject(new Error(`Unknown message type: ${type}`));
            }
            pendingMessages.delete(id);
        }
    };

    worker.onerror = (event) => {
        console.error('Worker Error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });

        const error = new Error(event.message || 'Worker error');
        pendingMessages.forEach(({ reject }) => reject(event))
        pendingMessages.clear();
    }

    worker.onmessageerror = (event) => {
        console.error('Worker message error:', event);
    }

    // Initialize WASM in worker 
    return new Promise<void>((resolve, reject) => {
        const id = messageId++;

        const timeout = setTimeout(() => {
            pendingMessages.delete(id);
            reject(new Error('Worker initialization timeout'));
        }, 10000);

        pendingMessages.set(id, {
            resolve: () => {
                clearTimeout(timeout);
                // console.log('WASM Initialized in worker');
                resolve();
            },
            reject: (err: any) => {
                clearTimeout(timeout);
                reject(err);
            }
        });

        // console.log('Sending init message to worker');
        worker!.postMessage({ type: 'init', id });
    });
}

export async function processImage(
    file: File,
): Promise<any> {
    if (!worker) throw new Error('Worker not initialized');

    const extension = file.name.split(".").pop()?.toLowerCase();

    const uint8Array = new Uint8Array(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
        const id = messageId++;

        //Add timeout
        const timeout = setTimeout(() => {
            pendingMessages.delete(id);
            reject(new Error('Image processing timeout'));
        }, 30000);

        pendingMessages.set(id, {
            resolve: (data: any) => {
                clearTimeout(timeout);
                resolve(data);
            },
            reject: (err: any) => {
                clearTimeout(timeout);
                reject(err);
            }
        })

        worker!.postMessage(
            { type: 'process', uint8Array, extension, id },
            [uint8Array.buffer]
        )
    })
}