
import React, { useState } from 'react';
import type { Person } from '../types';
import { SearchableSelect } from './SearchableSelect';
import { PERSON_TYPES, MARITAL_STATUSES, IMPRISONMENT_OPTIONS } from '../constants';

interface PersonInputGroupProps {
    person: Person;
    onChange: (person: Person) => void;
    onRemove?: () => void;
    personNumber: number;
}

export const PersonInputGroup: React.FC<PersonInputGroupProps> = ({ person, onChange, onRemove, personNumber }) => {
    const [photoPreview, setPhotoPreview] = useState<string | undefined>(person.photo);

    const handleChange = <K extends keyof Person,>(field: K, value: Person[K]) => {
        onChange({ ...person, [field]: value });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPhotoPreview(base64String);
                handleChange('photo', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">الشخص #{personNumber}</h3>
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                    >
                        حذف
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1 flex flex-col items-center justify-center space-y-2">
                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden border-2 border-gray-300 dark:border-gray-500">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        )}
                    </div>
                    <input
                        type="file"
                        id={`photo-${person.id}`}
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                    />
                    <label htmlFor={`photo-${person.id}`} className="cursor-pointer bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800">
                        تحميل صورة
                    </label>
                </div>

                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SearchableSelect label="نوع الشخص" options={PERSON_TYPES} selected={person.personType} onSelect={(val) => handleChange('personType', val)} isRequired={true} />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم الكامل</label>
                        <input type="text" required value={person.fullName} onChange={(e) => handleChange('fullName', e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">سنة الميلاد</label>
                        <input type="number" min="1920" max={new Date().getFullYear()} value={person.birthYear} onChange={(e) => handleChange('birthYear', e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان</label>
                        <input type="text" required value={person.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الهاتف</label>
                        <input type="tel" value={person.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <SearchableSelect label="الحالة الاجتماعية" options={MARITAL_STATUSES} selected={person.maritalStatus} onSelect={(val) => handleChange('maritalStatus', val)} />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المهنة</label>
                        <input type="text" value={person.occupation} onChange={(e) => handleChange('occupation', e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <SearchableSelect label="حالة السجن" options={IMPRISONMENT_OPTIONS} selected={person.imprisonment} onSelect={(val) => handleChange('imprisonment', val)} />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الهوية</label>
                        <input type="number" value={person.idNumber} onChange={(e) => handleChange('idNumber', e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};
