import type { Record } from '../types.ts';

/**
 * A helper function to draw multiline text on a canvas and return the new y-position.
 */
const drawMultilineText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
): number => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
    return currentY;
};

/**
 * Loads an image from a source string (e.g., base64 data URL).
 */
const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        if (!src || !src.startsWith('data:image')) {
            reject(new Error("Invalid image source for loading."));
            return;
        }
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
};

/**
 * Generates a PNG image representation of a record as a base64 data URL.
 * @param record The record data to render on the card.
 * @returns A promise that resolves to a base64 encoded PNG image string.
 */
export const generateCardImage = async (record: Omit<Record, 'cardImage' | 'id'> & { id?: string }): Promise<string> => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    
    // Set a sufficiently large initial height, we will crop it later.
    const estimatedHeight = 500 + record.persons.length * 150 + (record.caseDetails.notes?.length || 0);
    canvas.height = estimatedHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    // --- Drawing styles and properties ---
    ctx.direction = 'rtl'; // For better RTL text support in some browsers
    ctx.textAlign = 'right';
    const padding = 25;
    const contentWidth = canvas.width - 2 * padding;
    let currentHeight = padding;

    // --- Background ---
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- Header ---
    currentHeight += 10;
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#111827';
    ctx.fillText('بطاقة بلاغ', canvas.width - padding, currentHeight + 20);
    
    ctx.font = '18px Arial';
    ctx.fillStyle = '#6B7280';
    ctx.fillText(new Date(record.createdAt).toLocaleString('ar-EG'), canvas.width - padding, currentHeight + 50);
    currentHeight += 70;

    // --- Separator ---
    const drawSeparator = () => {
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, currentHeight);
        ctx.lineTo(canvas.width - padding, currentHeight);
        ctx.stroke();
        currentHeight += padding;
    };
    drawSeparator();

    // --- Case Details Section ---
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#111827';
    ctx.fillText('تفاصيل البلاغ', canvas.width - padding, currentHeight + 10);
    currentHeight += 40;

    ctx.font = '20px Arial';
    const detailLineHeight = 35;
    
    const details = [
        { label: 'نوع المشكلة', value: record.caseDetails.issueType },
        { label: 'مكان المشكلة', value: record.caseDetails.problemLocation },
        { label: 'الوقت', value: record.caseDetails.timeFrom && record.caseDetails.timeTo ? `${record.caseDetails.timeFrom} - ${record.caseDetails.timeTo}` : (record.caseDetails.timeFrom || record.caseDetails.timeTo) },
        { label: 'الفترة', value: record.caseDetails.period },
        { label: 'النقطة', value: record.caseDetails.point },
        { label: 'السائق', value: record.caseDetails.driverName },
        { label: 'أرسلت إلى', value: record.caseDetails.sentTo },
    ];

    details.forEach(detail => {
        if (detail.value) {
            ctx.fillStyle = '#374151';
            ctx.fillText(`${detail.label}:`, canvas.width - padding, currentHeight);
            ctx.fillStyle = '#111827';
            ctx.fillText(String(detail.value), canvas.width - padding - 160, currentHeight);
            currentHeight += detailLineHeight;
        }
    });

    // --- Persons Section ---
    if (record.persons.length > 0) {
        currentHeight += padding / 2;
        drawSeparator();
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#111827';
        ctx.fillText(`الأشخاص (${record.persons.length})`, canvas.width - padding, currentHeight + 10);
        currentHeight += 50;

        for (const person of record.persons) {
            const personYStart = currentHeight;
            const photoSize = 80;
            const photoX = canvas.width - padding - photoSize;
            const photoY = personYStart;
            
            ctx.strokeStyle = '#D1D5DB';
            ctx.lineWidth = 2;
            ctx.strokeRect(photoX, photoY, photoSize, photoSize);
            
            if (person.photo) {
                try {
                    const img = await loadImage(person.photo);
                    ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
                } catch (e) {
                    console.error("Failed to load person image", e);
                    ctx.fillStyle = '#E5E7EB';
                    ctx.fillRect(photoX, photoY, photoSize, photoSize);
                }
            } else {
                ctx.fillStyle = '#E5E7EB';
                ctx.fillRect(photoX, photoY, photoSize, photoSize);
            }
            
            const textX = photoX - padding;
            let personTextY = personYStart + 25;
            
            ctx.font = 'bold 22px Arial';
            ctx.fillStyle = '#111827';
            ctx.fillText(person.fullName, textX, personTextY);
            
            personTextY += 30;
            ctx.font = '18px Arial';
            ctx.fillStyle = '#4B5563';
            ctx.fillText(`(${person.personType})`, textX, personTextY);

            personTextY += 25;
            ctx.font = '16px Arial';
            ctx.fillStyle = '#6B7280';
            ctx.fillText(`مواليد: ${person.birthYear || 'غير محدد'} | العنوان: ${person.address || 'غير محدد'}`, textX, personTextY);
            
            currentHeight += photoSize + padding;
        }
    }

    // --- Notes Section ---
    if (record.caseDetails.notes) {
        currentHeight += padding / 2;
        drawSeparator();
        
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#111827';
        ctx.fillText('ملاحظات', canvas.width - padding, currentHeight + 10);
        currentHeight += 50;
        
        ctx.font = '20px Arial';
        ctx.fillStyle = '#374151';
        currentHeight = drawMultilineText(ctx, record.caseDetails.notes, canvas.width - padding, currentHeight, contentWidth, 30);
        currentHeight += 30; // space after multiline text
    }
    
    // --- Finalize canvas size ---
    const finalHeight = currentHeight;
    const imageData = ctx.getImageData(0, 0, canvas.width, finalHeight);
    canvas.height = finalHeight;
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL('image/png');
};