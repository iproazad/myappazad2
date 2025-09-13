
import React, { useState, useMemo } from 'react';
import type { Record } from '../types.ts';
import { RecordCard } from './RecordCard.tsx';

interface RecordListProps {
    records: Record[];
    onView: (id: string) => void;
    onDelete: (id: string) => void;
}

export const RecordList: React.FC<RecordListProps> = ({ records, onView, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRecords = useMemo(() => {
        if (!searchTerm) return records;
        
        const lowercasedFilter = searchTerm.toLowerCase();
        
        return records.filter(record => {
            const matchesCase =
                record.caseDetails.issueType.toLowerCase().includes(lowercasedFilter) ||
                record.caseDetails.problemLocation.toLowerCase().includes(lowercasedFilter) ||
                record.caseDetails.point.includes(lowercasedFilter);

            const matchesPerson = record.persons.some(person =>
                person.fullName.toLowerCase().includes(lowercasedFilter) ||
                person.idNumber.includes(lowercasedFilter)
            );
            
            return matchesCase || matchesPerson;
        });
    }, [records, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <input
                    type="text"
                    placeholder="ابحث في السجلات (بالاسم, نوع المشكلة, رقم الهوية...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                />
            </div>

            {filteredRecords.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(record => (
                        <RecordCard key={record.id} record={record} onView={onView} onDelete={onDelete} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">لا توجد سجلات</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {searchTerm ? 'لا توجد سجلات تطابق بحثك.' : 'ابدأ بإضافة سجل جديد من النموذج.'}
                    </p>
                </div>
            )}
        </div>
    );
};