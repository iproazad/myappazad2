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
        <div className="min-h-screen text-gray-800 dark:text-gray-200">
            {/* Top Header for larger screens */}
            <header className="hidden md:block bg-white dark:bg-gray-800 shadow-md">
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

            {/* Main Content */}
            <main className="container mx-auto p-4 md:p-6">
                 <div className="md:hidden text-center mb-4">
                     <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {view === 'form' ? 'نموذج جديد' : 'قائمة السجلات'}
                     </h1>
                 </div>
                {view === 'form' ? (
                    <MultiPersonForm onSave={handleAddRecord} />
                ) : (
                    <RecordList records={records} onView={handleViewRecord} onDelete={handleDeleteRecord} />
                )}
            </main>

            {/* Bottom Navigation for mobile */}
            <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-10">
                <nav className="flex justify-around items-center h-16">
                    <button
                        onClick={() => setView('form')}
                        className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${view === 'form' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span className="text-xs font-medium mt-1">نموذج جديد</span>
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${view === 'list' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                        <span className="text-xs font-medium mt-1">السجلات</span>
                    </button>
                </nav>
            </footer>

            {selectedRecord && <ViewRecordModal record={selectedRecord} onClose={handleCloseModal} />}
        </div>
    );
};

export default App;