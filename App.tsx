
import React, { useState, useEffect } from 'react';
import { MultiPersonForm } from './components/MultiPersonForm.tsx';
import { RecordList } from './components/RecordList.tsx';
import type { Record } from './types.ts';
import { ViewRecordModal } from './components/ViewRecordModal.tsx';

const App: React.FC = () => {
    const [view, setView] = useState<'form' | 'list'>('form');
    const [records, setRecords] = useState<Record[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

    useEffect(() => {
        try {
            const savedRecords = localStorage.getItem('tomaryAresheRecords');
            if (savedRecords) {
                setRecords(JSON.parse(savedRecords));
            }
        } catch (error) {
            console.error("Failed to load records from localStorage", error);
        }
    }, []);

    const saveRecords = (updatedRecords: Record[]) => {
        try {
            setRecords(updatedRecords);
            localStorage.setItem('tomaryAresheRecords', JSON.stringify(updatedRecords));
        } catch (error) {
            console.error("Failed to save records to localStorage", error);
        }
    };

    const handleAddRecord = (newRecord: Record) => {
        const updatedRecords = [...records, newRecord];
        saveRecords(updatedRecords);
        setView('list');
    };

    const handleDeleteRecord = (id: string) => {
        const updatedRecords = records.filter(record => record.id !== id);
        saveRecords(updatedRecords);
    };
    
    const handleViewRecord = (id: string) => {
        const record = records.find(r => r.id === id);
        if (record) {
            setSelectedRecord(record);
        }
    };

    const handleCloseModal = () => {
        setSelectedRecord(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">نظام تسجيل الحالات</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setView('form')}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${view === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            نموذج جديد
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            عرض السجلات
                        </button>
                    </div>
                </nav>
            </header>
            <main className="container mx-auto p-4 md:p-6">
                {view === 'form' ? (
                    <MultiPersonForm onSave={handleAddRecord} />
                ) : (
                    <RecordList records={records} onView={handleViewRecord} onDelete={handleDeleteRecord} />
                )}
            </main>
            {selectedRecord && <ViewRecordModal record={selectedRecord} onClose={handleCloseModal} />}
        </div>
    );
};

export default App;