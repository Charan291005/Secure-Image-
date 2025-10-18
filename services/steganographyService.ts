const END_OF_MESSAGE = '::EOM::';

function getBit(byte: number, bitPosition: number): number {
  return (byte >> bitPosition) & 1;
}

function setBit(byte: number, bitPosition: number, bit: number): number {
  if (bit === 1) {
    return byte | (1 << bitPosition);
  }
  return byte & ~(1 << bitPosition);
}

export function calculateCapacity(image: HTMLImageElement): number {
    // Calculate the total number of bits we can store in RGB channels
    const totalPixels = image.width * image.height;
    const totalBits = totalPixels * 3; // Using RGB channels only
    // Subtract space for the length prefix (32 bits)
    const availableBits = totalBits - 32;
    return Math.floor(availableBits / 8); // Return capacity in bytes
}

export async function embedDataInImage(
  image: HTMLImageElement,
  data: ArrayBuffer,
  onProgress: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Could not get canvas context'));
    
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const dataBytes = new Uint8Array(data);

    let pixelComponentIndex = 0;

    // 1. Encode data length (32 bits), skipping alpha channels
    const dataLength = dataBytes.length;
    for (let i = 0; i < 32; i++) {
        if ((pixelComponentIndex + 1) % 4 === 0) pixelComponentIndex++; // Skip alpha
        if (pixelComponentIndex >= pixels.length) return reject(new Error("Image capacity exceeded for length header."));
        
        const bit = getBit(dataLength >> (31 - i), 0);
        pixels[pixelComponentIndex] = setBit(pixels[pixelComponentIndex], 0, bit);
        pixelComponentIndex++;
    }

    // 2. Encode the data itself, skipping alpha channels
    for (let i = 0; i < dataBytes.length; i++) {
        const byte = dataBytes[i];
        for (let j = 0; j < 8; j++) {
            if ((pixelComponentIndex + 1) % 4 === 0) pixelComponentIndex++; // Skip alpha
            if (pixelComponentIndex >= pixels.length) return reject(new Error("Image capacity exceeded during embedding."));

            const bit = getBit(byte, 7 - j);
            pixels[pixelComponentIndex] = setBit(pixels[pixelComponentIndex], 0, bit);
            pixelComponentIndex++;
        }
        if (i % 1000 === 0) { // Update progress periodically
            onProgress(i / dataBytes.length);
        }
    }
    onProgress(1);

    ctx.putImageData(imageData, 0, 0);
    // Use PNG for lossless encoding
    resolve(canvas.toDataURL('image/png'));
  });
}

export async function extractDataFromImage(
  image: HTMLImageElement,
  onProgress: (progress: number) => void
): Promise<ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context'));
        
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        let pixelComponentIndex = 0;

        // 1. Decode data length (32 bits), skipping alpha channels
        let dataLength = 0;
        for (let i = 0; i < 32; i++) {
            if ((pixelComponentIndex + 1) % 4 === 0) pixelComponentIndex++; // Skip alpha
            if (pixelComponentIndex >= pixels.length) return resolve(null); // Not enough data for length
            
            const bit = getBit(pixels[pixelComponentIndex], 0);
            dataLength = (dataLength << 1) | bit;
            pixelComponentIndex++;
        }

        // Sanity check: ensure data length is plausible for the image's capacity
        const totalRGBComponents = (pixels.length / 4) * 3;
        const requiredBitsForData = dataLength * 8;
        const availableBitsForData = totalRGBComponents - 32; // Subtract bits used for length
        
        if (dataLength <= 0 || requiredBitsForData > availableBitsForData) {
            return resolve(null);
        }

        const dataBytes = new Uint8Array(dataLength);

        // 2. Decode the data, skipping alpha channels
        for (let i = 0; i < dataLength; i++) {
            let byte = 0;
            for (let j = 0; j < 8; j++) {
                if ((pixelComponentIndex + 1) % 4 === 0) pixelComponentIndex++; // Skip alpha
                if (pixelComponentIndex >= pixels.length) return reject(new Error("Image ended prematurely during data extraction."));

                const bit = getBit(pixels[pixelComponentIndex], 0);
                byte = (byte << 1) | bit;
                pixelComponentIndex++;
            }
            dataBytes[i] = byte;
            if (i % 1000 === 0) {
                 onProgress(i / dataLength);
            }
        }
        onProgress(1);

        resolve(dataBytes.buffer);
    });
}
