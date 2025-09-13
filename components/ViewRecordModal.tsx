
import React from 'react';
import type { Record } from '../types';

interface ViewRecordModalProps {
    record: Record;
    onClose: () => void;
}

export const ViewRecordModal: React.FC<ViewRecordModalProps> = ({ record, onClose }) => {
    
    const handleShare = async () => {
        if (navigator.share && record.cardImage) {
            try {
                const response = await fetch(record.cardImage);
                const blob = await response.blob();
                const file = new File([blob], `record-${record.id}.png`, { type: 'image/png' });

                await navigator.share({
                    title: `تفاصيل بلاغ: ${record.caseDetails.issueType}`,
                    text: `تفاصيل بلاغ بتاريخ ${new Date(record.createdAt).toLocaleDateString()}`,
                    files: [file],
                });
            } catch (error) {
                console.error('Error sharing', error);
                alert('لم يتمكن المتصفح من مشاركة الملف.');
            }
        } else {
            alert('المشاركة غير مدعومة في هذا المتصفح، يمكنك تنزيل الصورة ومشاركتها يدوياً.');
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = record.cardImage;
        link.download = `record-${record.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">تفاصيل السجل</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">&times;</button>
                    </div>
                    
                    <div className="mt-6">
                         <h3 className="text-lg font-semibold mb-2">بطاقة المشاركة</h3>
                         <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md flex justify-center">
                            {record.cardImage ? (
                                <img src={record.cardImage} alt="Record Card" className="max-w-full h-auto rounded-md shadow-md"/>
                            ) : (
                                <p>جاري تحميل الصورة...</p>
                            )}
                         </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3 rtl:space-x-reverse">
                    <button onClick={onClose} type="button" className="py-2 px-4 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                        إغلاق
                    </button>
                    <button onClick={handleDownload} type="button" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                        تنزيل
                    </button>
                    <button onClick={handleShare} type="button" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        مشاركة
                    </button>
                </div>
            </div>
        </div>
    );
};
