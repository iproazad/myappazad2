import React, { useState, useRef } from 'react';
import type { Record, Person, CaseDetails } from '../types.ts';
import { PersonInputGroup } from './PersonInputGroup.tsx';
import { SearchableSelect } from './SearchableSelect.tsx';
import { 
    PERIODS, 
    DRIVERS, 
    POINTS, 
    SENT_TO_OPTIONS, 
    PROBLEM_TYPES 
} from '../constants.ts';
import { generateCardImage } from '../services/cardGenerator.ts';

interface MultiPersonFormProps {
    onSave: (record: Record) => void;
}

const initialCaseDetails: CaseDetails = {
    issueType: '',
    timeFrom: '',
    timeTo: '',
    period: '',
    problemLocation: '',
    driverName: '',
    point: '',
    sentTo: '',
    notes: ''
};

const createNewPerson = (): Person => ({
    id: `person_${Date.now()}_${Math.random()}`,
    personType: '',
    fullName: '',
    birthYear: '',
    address: '',
    phone: '',
    maritalStatus: '',
    occupation: '',
    imprisonment: '',
    idNumber: '',
    photo: undefined
});

export const MultiPersonForm: React.FC<MultiPersonFormProps> = ({ onSave }) => {
    const [persons, setPersons] = useState<Person[]>([createNewPerson()]);
    const [caseDetails, setCaseDetails] = useState<CaseDetails>(initialCaseDetails);
    const [isSaving, setIsSaving] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);


    const addNewPerson = () => {
        setPersons(prev => [...prev, createNewPerson()]);
    };

    const removePerson = (id: string) => {
        setPersons(prev => prev.filter(p => p.id !== id));
    };

    const handlePersonChange = (updatedPerson: Person) => {
        setPersons(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p));
    };

    const handleCaseDetailsChange = <K extends keyof CaseDetails,>(field: K, value: CaseDetails[K]) => {
        setCaseDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const cardImage = await generateCardImage({
                persons,
                caseDetails,
                createdAt: new Date().toLocaleString('ar-EG'),
                id: '' // id is not needed for preview
            });

            if (!cardImage) {
                throw new Error("Failed to generate card image.");
            }

            const newRecord: Record = {
                id: `record_${Date.now()}`,
                createdAt: new Date().toISOString(),
                persons,
                caseDetails,
                cardImage
            };

            onSave(newRecord);

            // Reset form
            setPersons([createNewPerson()]);
            setCaseDetails(initialCaseDetails);

        } catch (error) {
            console.error("Error saving record:", error);
            alert("حدث خطأ أثناء حفظ السجل. الرجاء المحاولة مرة أخرى.");
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-6 border-b pb-3 border-gray-300 dark:border-gray-600">الأشخاص في البلاغ</h2>
                <div className="space-y-6">
                    {persons.map((person, index) => (
                        <PersonInputGroup
                            key={person.id}
                            person={person}
                            onChange={handlePersonChange}
                            onRemove={persons.length > 1 ? () => removePerson(person.id) : undefined}
                            personNumber={index + 1}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addNewPerson}
                    className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    + إضافة شخص
                </button>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6 border-b pb-3 border-gray-300 dark:border-gray-600">تفاصيل البلاغ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SearchableSelect label="نوع المشكلة" options={PROBLEM_TYPES} selected={caseDetails.issueType} onSelect={(val) => handleCaseDetailsChange('issueType', val)} isRequired={true} />
                    <SearchableSelect label="الفترة" options={PERIODS} selected={caseDetails.period} onSelect={(val) => handleCaseDetailsChange('period', val)} />
                    <SearchableSelect label="النقطة" options={POINTS} selected={caseDetails.point} onSelect={(val) => handleCaseDetailsChange('point', val)} />
                    <SearchableSelect label="اسم السائق" options={DRIVERS} selected={caseDetails.driverName} onSelect={(val) => handleCaseDetailsChange('driverName', val)} allowNew={true} />
                    <SearchableSelect label="رەوانەكرن بـــو (أرسلت إلى)" options={SENT_TO_OPTIONS} selected={caseDetails.sentTo} onSelect={(val) => handleCaseDetailsChange('sentTo', val)} allowNew={true}/>
                    
                    <div>
                        <label htmlFor="problemLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مكان المشكلة</label>
                        <input type="text" id="problemLocation" value={caseDetails.problemLocation} onChange={(e) => handleCaseDetailsChange('problemLocation', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="timeFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">وقت من</label>
                        <input type="time" id="timeFrom" value={caseDetails.timeFrom} onChange={(e) => handleCaseDetailsChange('timeFrom', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                     <div>
                        <label htmlFor="timeTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">وقت إلى</label>
                        <input type="time" id="timeTo" value={caseDetails.timeTo} onChange={(e) => handleCaseDetailsChange('timeTo', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    
                    <div className="md:col-span-2 lg:col-span-3">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ملاحظات</label>
                        <textarea id="notes" value={caseDetails.notes} onChange={(e) => handleCaseDetailsChange('notes', e.target.value)} rows={4} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'جاري الحفظ...' : 'حفظ السجل'}
                </button>
            </div>
        </form>
    );
};