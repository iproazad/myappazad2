import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { Incident, Person, CaseInfo } from '../types.ts';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import InputField from '../components/InputField.tsx';
import Button from '../components/Button.tsx';
import { CameraIcon, DownloadIcon, PrintIcon, UserPlusIcon, TrashIcon, SearchIcon } from '../components/Icons.tsx';

const emptyCaseInfo: CaseInfo = {
    issueType: '',
    timeFrom: '',
    timeTo: '',
    period: 'روژ',
    location: '',
    driverName: '',
    point: '',
    sentTo: '',
};

// Datalist options from user's HTML
const issueTypeOptions = ["ئاریشا خێزانی", "خازوك", "شـــەر", "سەرخوش", "رویدانا ترومبێلێ", "مخەدەر", "دزی", "بەرزەبون", "ازعــاج", "داخازكری", "گومانlێكری", "هەولا خوكوشتنێ", "خوكوشتن", "كوشتن", "گیان ژدەستدان", "بێ سەمیان", "كێشانا سكوتینێ", "فیلبازی تشقلە", "ترومبيلا بي خودان", "ئاگر بەربون", "تەقەكرن", "مەلەڤاني جهی قەدەغە", "تێكدەر", "خەندقین", "گەفكرن"];
const driverNameOptions = ["سليمان علي حميد", "نیچیرڤان عباس بشار", "نعمان رمضان محمد", "رضوان محمود محمد", "داود قادر ندیر ناصر", "سربست محمدعلی", "حسن رؤوف حسن", "ريزان سمو محمد", "صابر شفیق شمزین", "رضوان رمضان علی", "سعید سربست رسول", "نیجیرڤان احمد علی", "دشتی عادل عثمان", "ریبر سلمان عثمان", "ازاد عدنان عبدالله", "بیوار اسماعیل محمد", "مهڤان تحسين پيراموس", "فارس بكر رشید"];
const pointOptions = ["100", "101", "102", "103", "105", "106", "107", "108", "109", "110", "111", "112"];
const sentToOptions = ["بنگەهێ پولیسێن كارێز", "بنگەهێ پولیسێن زاخو", "بنگەهێ پولیسێن سێمالكا", "بنگەهێ پولیسێن دەلال", "بنگەهێ پولیسێن بێدارێ", "بنگەهێ پولیسێن نیو زاخو", "بنگەهێ پولیسێن رزگاری", "رێڤەبەریا پولیسێن زاخو", "توندوتیژیا زاخو", "نەخوشخانا زاخو", "دەستێ سەمیانا", "مكافحا زاخو", "مكافحا بێدارێ", "ئاسايشا زاخو", "ئاگرڤەمراندنا زاخو", "گرتیخانا زاخو", "هاتوچووا زاخو"];

const IncidentCard = React.forwardRef<HTMLDivElement, { incident: Incident }>(({ incident }, ref) => {
    const timestamp = new Date(incident.date).toLocaleString('ar-IQ');

    return (
        <div ref={ref} className="w-full max-w-4xl bg-gray-300 p-1 text-gray-900 font-sans border-4 border-blue-600">
            <div className="bg-blue-700 text-white p-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold">توماری ئاریشە</h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-left text-xs sm:text-sm">
                    <div><strong>جورێ ئاریشێ:</strong> {incident.caseInfo.issueType || '-'}</div>
                    <div><strong>ناڤێ شوفێری:</strong> {incident.caseInfo.driverName || '-'}</div>
                    <div><strong>دەمژمێر:</strong> {incident.caseInfo.timeFrom || '-'} - {incident.caseInfo.timeTo || '-'} ({incident.caseInfo.period})</div>
                    <div><strong>خالا:</strong> {incident.caseInfo.point || '-'}</div>
                    <div className="sm:col-span-2"><strong>جهێ ئاریشێ:</strong> {incident.caseInfo.location || '-'}</div>
                    <div className="sm:col-span-2"><strong>رەوانەكرن بـــو:</strong> {incident.caseInfo.sentTo || '-'}</div>
                </div>
                 <p className="mt-3 text-xs sm:text-sm"><strong>تاریخ:</strong> {new Date(incident.date).toLocaleDateString('ar-IQ')}</p>
            </div>

            <div className="p-2 space-y-3">
                {incident.persons.map((person, index) => (
                    <div key={person.id} className="bg-white p-3 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-center sm:items-start border border-gray-300">
                        <div className="relative flex-shrink-0">
                           <div className="w-28 h-36 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden border-2 border-blue-500">
                                {person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : <CameraIcon className="w-12 h-12 text-gray-400" />}
                           </div>
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white">{index + 1}</span>
                        </div>
                        <div className="flex-1 w-full text-xs sm:text-sm">
                            <div className={`inline-block px-3 py-1 rounded-full text-white font-semibold mb-2 text-xs ${person.type === 'تاوانبار' ? 'bg-red-600' : 'bg-green-600'}`}>
                                {person.type}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                                <p><strong>ناڤ:</strong> {person.name}</p>
                                <p><strong>ژدایـــكبون:</strong> {person.birthdate}</p>
                                <p className="md:col-span-2"><strong>ئاكنجی بوون:</strong> {person.address}</p>
                                <p className="md:col-span-2"><strong>موبایل:</strong> {person.phone || '-'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <footer className="bg-blue-700 text-white text-center p-1 text-xs sm:text-sm font-semibold">
                تم إنشاء هذه البطاقة في: {timestamp}
            </footer>
        </div>
    );
});


const IncidentPage: React.FC = () => {
    const [incidents, setIncidents] = useLocalStorage<Incident[]>('incidents', []);
    const [caseInfo, setCaseInfo] = useState<CaseInfo>(emptyCaseInfo);
    const [persons, setPersons] = useState<Person[]>([]);
    const [generatedCard, setGeneratedCard] = useState<Incident | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');

    const handleDownload = useCallback((incident: Incident) => {
        const cardNode = cardRef.current;
        if (!cardNode) return;
        (window as any).htmlToImage.toPng(cardNode, { backgroundColor: '#111827', quality: 1, pixelRatio: 3 })
            .then((dataUrl: string) => {
                const link = document.createElement('a');
                link.download = `قضية-${incident.caseInfo.issueType.replace(/ /g, '_')}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err: any) => console.error('oops, something went wrong!', err));
    }, []);
    
    useEffect(() => {
        if (generatedCard) {
            const timer = setTimeout(() => handleDownload(generatedCard), 500);
            return () => clearTimeout(timer);
        }
    }, [generatedCard, handleDownload]);

    const handlePrint = () => {
        const printableElement = cardRef.current;
        if (!printableElement) return;
        const printContainer = document.createElement('div');
        printContainer.id = 'printable-area';
        document.body.appendChild(printContainer);
        const clonedNode = printableElement.cloneNode(true);
        printContainer.appendChild(clonedNode);
        window.print();
        document.body.removeChild(printContainer);
    };

    const handleCaseInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCaseInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handlePersonChange = (index: number, field: keyof Person, value: string) => {
        const updatedPersons = [...persons];
        (updatedPersons[index] as any)[field] = value;
        setPersons(updatedPersons);
    };

    const handlePhotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                handlePersonChange(index, 'photo', event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const addPerson = () => {
        setPersons([...persons, { id: Date.now().toString(), name: '', type: '', birthdate: '', address: '', phone: '', photo: null }]);
    };

    const removePerson = (index: number) => {
        setPersons(persons.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (persons.length === 0) {
            alert('يجب إضافة شخص واحد على الأقل.');
            return;
        }
        const newIncident: Incident = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            caseInfo,
            persons,
        };
        setIncidents(prev => [newIncident, ...prev]);
        setGeneratedCard(newIncident);
        setCaseInfo(emptyCaseInfo);
        setPersons([]);
    };

    const handleSelectIncident = (incident: Incident) => {
        setGeneratedCard(incident);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredAndSortedIncidents = useMemo(() => {
        return incidents
            .filter(i => i.caseInfo.issueType.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                switch (sortBy) {
                    case 'type-asc':
                        return a.caseInfo.issueType.localeCompare(b.caseInfo.issueType, 'ar');
                    case 'type-desc':
                        return b.caseInfo.issueType.localeCompare(a.caseInfo.issueType, 'ar');
                    case 'date-asc':
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    case 'date-desc':
                    default:
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
            });
    }, [incidents, searchTerm, sortBy]);

    return (
        <div className="space-y-8">
            {generatedCard && (
                 <div className="bg-gray-800 p-4 rounded-lg shadow-2xl flex flex-col items-center">
                    <IncidentCard ref={cardRef} incident={generatedCard} />
                    <div className="mt-6 flex gap-4 justify-center">
                        <Button onClick={handlePrint} icon={<PrintIcon />} text="طباعة" />
                        <Button onClick={() => handleDownload(generatedCard)} icon={<DownloadIcon />} text="تحميل كصورة" />
                    </div>
                </div>
            )}

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                 <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b-2 border-blue-500 pb-2">تسجيل قضية جديدة</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Persons Section */}
                    <div className="space-y-6">
                        {persons.map((person, index) => (
                            <div key={person.id} className="bg-gray-700 p-4 rounded-lg relative">
                                <span className="absolute -top-3 -right-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-4 border-gray-800">{index + 1}</span>
                                <button type="button" onClick={() => removePerson(index)} className="absolute -top-2 -left-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700">
                                    <TrashIcon />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="w-32 h-32 bg-gray-600 rounded-full overflow-hidden flex items-center justify-center">
                                            {person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : <CameraIcon className="w-12 h-12 text-gray-400"/>}
                                        </div>
                                        <label className="text-sm text-blue-400 cursor-pointer">
                                            <input type="file" className="hidden" accept="image/*" capture="environment" onChange={(e) => handlePhotoChange(index, e)} />
                                            {person.photo ? "تغيير الصورة" : "تحميل صورة"}
                                        </label>
                                    </div>
                                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField id={`p-name-${index}`} label="ناڤێ تومەتباری" value={person.name} onChange={(e) => handlePersonChange(index, 'name', e.target.value)} required />
                                        <div>
                                          <label htmlFor={`p-type-${index}`} className="mb-2 block font-medium text-gray-300">نوع الشخص</label>
                                          <select id={`p-type-${index}`} value={person.type} onChange={(e) => handlePersonChange(index, 'type', e.target.value)} className="bg-gray-600 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5" required>
                                              <option value="" disabled>اختر النوع</option>
                                              <option value="مشتەكی">مشتەكی</option>
                                              <option value="تاوانبار">تاوانبار</option>
                                          </select>
                                        </div>
                                        <InputField id={`p-birthdate-${index}`} label="ژدایـــكبون" value={person.birthdate} onChange={(e) => handlePersonChange(index, 'birthdate', e.target.value)} />
                                        <InputField id={`p-phone-${index}`} label="ژمارا موبایلی" value={person.phone} onChange={(e) => handlePersonChange(index, 'phone', e.target.value)} type="tel" />
                                        <div className="sm:col-span-2">
                                            <InputField id={`p-address-${index}`} label="ئاكنجی بوون" value={person.address} onChange={(e) => handlePersonChange(index, 'address', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="text-center">
                             <Button type="button" text="إضافة شخص آخر" icon={<UserPlusIcon />} onClick={addPerson} />
                        </div>
                    </div>

                    {/* Case Info Section */}
                    <div className="border-t-2 border-dashed border-blue-500 pt-6">
                        <h3 className="text-xl font-bold text-center mb-6 text-gray-300">معلومات القضية</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField id="issueType" label="جورێ ئاریشێ" value={caseInfo.issueType} onChange={handleCaseInfoChange} required datalistOptions={issueTypeOptions}/>
                            <InputField id="location" label="جهێ ئاریشێ" value={caseInfo.location} onChange={handleCaseInfoChange} required/>
                            <InputField id="driverName" label="ناڤێ شوفێری" value={caseInfo.driverName} onChange={handleCaseInfoChange} required datalistOptions={driverNameOptions} />
                            <InputField id="point" label="خالا" value={caseInfo.point} onChange={handleCaseInfoChange} required datalistOptions={pointOptions} />
                             <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                <InputField id="timeFrom" label="من" value={caseInfo.timeFrom} onChange={handleCaseInfoChange} type="time" />
                                <InputField id="timeTo" label="إلى" value={caseInfo.timeTo} onChange={handleCaseInfoChange} type="time" />
                                <InputField id="period" label="الفترة" value={caseInfo.period} onChange={handleCaseInfoChange} datalistOptions={["روژ", "شەڤ"]} />
                             </div>
                            <div className="md:col-span-2">
                                <InputField id="sentTo" label="رەوانەكرن بـــو" value={caseInfo.sentTo} onChange={handleCaseInfoChange} datalistOptions={sentToOptions} />
                            </div>
                         </div>
                    </div>
                     <div className="text-center pt-4">
                        <Button type="submit" text="خەزنكرنا كارتێ" className="w-full md:w-auto" />
                    </div>
                </form>
            </div>

            {incidents.length > 0 && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400">القضايا المسجلة</h2>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-grow w-full sm:w-auto">
                           <InputField
                                id="search-incidents"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="بحث حسب نوع القضية..."
                                icon={<SearchIcon />}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label htmlFor="sort-incidents" className="text-gray-300 whitespace-nowrap">ترتيب حسب:</label>
                            <select
                                id="sort-incidents"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                <option value="date-desc">الأحدث أولاً</option>
                                <option value="date-asc">الأقدم أولاً</option>
                                <option value="type-asc">نوع القضية (أ-ي)</option>
                                <option value="type-desc">نوع القضية (ي-أ)</option>
                            </select>
                        </div>
                    </div>
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredAndSortedIncidents.map(i => (
                            <li key={i.id} onClick={() => handleSelectIncident(i)} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-600 transition-colors">
                                <div>
                                    <p className="font-semibold">{i.caseInfo.issueType}</p>
                                    <p className="text-sm text-gray-400">الأشخاص: {i.persons.length}</p>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(i.date).toLocaleDateString('ar-IQ')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default IncidentPage;