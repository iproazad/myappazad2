
import React from 'react';
import type { Record } from '../types.ts';

interface RecordCardProps {
    record: Record;
    onView: (id: string) => void;
    onDelete: (id: string) => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({ record, onView, onDelete }) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا السجل؟')) {
            onDelete(record.id);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{record.caseDetails.issueType || 'بلاغ'}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(record.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">الموقع: {record.caseDetails.problemLocation || 'غير محدد'}</p>
                
                <div className="mt-4">
                    <h4 className="font-semibold text-sm mb-2">الأشخاص ({record.persons.length}):</h4>
                    <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                        {record.persons.slice(0, 4).map(person => (
                            <div key={person.id} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                                {person.photo ? (
                                    <img src={person.photo} alt={person.fullName} className="w-full h-full object-cover"/>
                                ) : (
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{person.fullName.charAt(0)}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{record.persons.map(p => p.fullName).join(', ')}</p>
                </div>
            </div>
            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-2 rtl:space-x-reverse">
                <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
                >
                    حذف
                </button>
                <button
                    onClick={() => onView(record.id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    عرض التفاصيل
                </button>
            </div>
        </div>
    );
};