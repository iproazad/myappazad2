import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { Suspect } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { CameraIcon, DownloadIcon, PrintIcon, SearchIcon } from '../components/Icons';

const emptySuspect: Omit<Suspect, 'id' | 'date'> = {
    photo: null,
    name: '',
    birthdate: '',
    address: '',
    problemType: '',
    maritalStatus: '',
    job: '',
    prison: '',
    phone: '',
    timeFrom: '',
    timeTo: '',
    period: 'روژ',
    problemLocation: '',
    driverName: '',
    point: '',
    sentTo: '',
};

// Datalist options from user's HTML
const problemTypeOptions = ["ئاریشا خێزانی", "خازوك", "شـــەر", "سەرخوش", "رویدانا ترومبێلێ", "مخەدەر", "دزی", "بەرزەبون", "ازعــاج", "داخازكری", "گومانلێكری", "هەولا خوكوشتنێ", "خوكوشتن", "كوشتن", "گیان ژدەستدان", "بێ سەمیان", "كێشانا سكوتینێ", "فیلبازی تشقلە", "ترومبيلا بي خودان", "ئاگر بەربون", "تەقەكرن", "مەلەڤاني جهی قەدەغە", "تێكدەر", "خەندقین", "گەفكرن"];
const driverNameOptions = ["سليمان علي حميد", "نیچیرڤان عباس بشار", "نعمان رمضان محمد", "رضوان محمود محمد", "داود قادر ندیر ناصر", "سربست محمدعلی", "حسن رؤوف حسن", "ريزان سمو محمد", "صابر شفیق شمزین", "رضوان رمضان علی", "سعید سربست رسول", "نیجیرڤان احمد علی", "دشتی عادل عثمان", "ریبر سلمان عثمان", "ازاد عدنان عبدالله", "بیوار اسماعیل محمد", "مهڤان تحسين پيراموس", "فارس بكر رشید"];
const pointOptions = ["100", "101", "102", "103", "105", "106", "107", "108", "109", "110", "111", "112"];
const sentToOptions = ["بنگەهێ پولیسێن كارێز", "بنگەهێ پولیسێن زاخو", "بنگەهێ پولیسێن سێمالكا", "بنگەهێ پولیسێن دەلال", "بنگەهێ پولیسێن بێدارێ", "بنگەهێ پولیسێن نیو زاخو", "بنگەهێ پولیسێن رزگاری", "رێڤەبەریا پولیسێن زاخو", "توندوتیژیا زاخو", "نەخوشخانا زاخو", "دەستێ سەمیانا", "مكافحا زاخو", "مكافحا بێدارێ", "ئاسايشا زاخو", "ئاگرڤەمراندنا زاخو", "گرتیخانا زاخو", "هاتوچووا زاخو"];

const SuspectCard = React.forwardRef<HTMLDivElement, { suspect: Suspect }>(({ suspect }, ref) => {
    const registrationDate = new Date(suspect.date);
    const formattedDate = registrationDate.toLocaleDateString('ar-IQ');
    const formattedTime = registrationDate.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div ref={ref} className="w-full max-w-2xl bg-gray-200 p-1 font-sans text-gray-900">
            <div className="bg-red-700 text-white text-center p-2 shadow-md">
                <h2 className="text-lg sm:text-xl font-bold">بەشێ پولیسێن هەوارهاتنێ</h2>
            </div>
            <div className="p-3 bg-white">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-1 text-xs sm:text-sm">
                         <div className="p-2 bg-gray-100 border-r-4 border-red-600 rounded-l-sm"><strong>ناڤێ تومەتباری:</strong> {suspect.name}</div>
                         <div className="p-2 bg-gray-100 border-r-4 border-red-600 rounded-l-sm"><strong>ژدایـــكبون:</strong> {suspect.birthdate || '-'}</div>
                         <div className="p-2 bg-gray-100 border-r-4 border-red-600 rounded-l-sm"><strong>ژمارا موبایلي:</strong> {suspect.phone || '-'}</div>
                         <div className="p-2 bg-gray-100 border-r-4 border-red-600 rounded-l-sm"><strong>ئاكنجی بوون:</strong> {suspect.address || '-'}</div>
                         <div className="p-2 bg-gray-100 border-r-4 border-red-600 rounded-l-sm"><strong>بارێ خێزانی:</strong> {suspect.maritalStatus || '-'}</div>
                         <div className="p-2 bg-gray-100 border-r-4 border-red-600 rounded-l-sm"><strong>زیندانكرن:</strong> {suspect.prison || '-'}</div>
                    </div>
                    <div className="w-full sm:w-40 h-56 border-2 border-red-600 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-300 self-center">
                        {suspect.photo ? <img src={suspect.photo} alt="صورة المتهم" className="w-full h-full object-cover" /> : <CameraIcon className="w-16 h-16 text-gray-500" />}
                    </div>
                </div>
                <div className="mt-3 p-3 bg-blue-800 text-white rounded-md shadow-inner text-xs sm:text-sm">
                    <h3 className="text-center font-bold text-sm sm:text-base mb-2 border-b pb-1">پێزانینێن رویدانێ</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        <div><strong>الوقت:</strong> {suspect.timeFrom || '-'} - {suspect.timeTo || '-'}</div>
                        <div><strong>الفترة:</strong> {suspect.period}</div>
                        <div className="sm:col-span-2"><strong>جهێ ئاریشێ:</strong> {suspect.problemLocation || '-'}</div>
                        <div><strong>ناڤێ شوفێری:</strong> {suspect.driverName || '-'}</div>
                        <div><strong>خالا:</strong> {suspect.point || '-'}</div>
                        <div className="mt-1 p-2 bg-green-200 text-green-900 rounded text-center font-semibold"><strong>رەوانەكرن بـــو:</strong> {suspect.sentTo || '-'}</div>
                         <div className="mt-1 p-2 bg-red-200 text-red-900 rounded text-center font-semibold"><strong>جورێ ئاریشێ:</strong> {suspect.problemType || '-'}</div>
                    </div>
                </div>
                <div className="mt-3 text-center p-2 bg-red-700 text-white rounded-md font-bold text-xs sm:text-sm">
                    مێژویا توماركرنا رویدانێ: {formattedDate} - {formattedTime}
                </div>
            </div>
        </div>
    );
});

const SuspectPage: React.FC = () => {
    const [suspects, setSuspects] = useLocalStorage<Suspect[]>('suspects', []);
    const [formData, setFormData] = useState<Omit<Suspect, 'id' | 'date'>>(emptySuspect);
    const [generatedCard, setGeneratedCard] = useState<Suspect | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');

    const handleDownload = useCallback((suspect: Suspect) => {
        const cardNode = cardRef.current;
        if (!cardNode) return;

        (window as any).htmlToImage.toPng(cardNode, { backgroundColor: '#111827', quality: 1, pixelRatio: 3 })
            .then((dataUrl: string) => {
                const link = document.createElement('a');
                link.download = `بطاقة-متهم-${suspect.name.replace(/ /g, '_')}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err: any) => console.error('oops, something went wrong!', err));
    }, []);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({ ...prev, photo: event.target?.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSuspect: Suspect = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...formData,
        };
        setSuspects(prev => [newSuspect, ...prev]);
        setGeneratedCard(newSuspect);
        setFormData(emptySuspect);
        const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = "";
    };
    
    useEffect(() => {
        if (generatedCard) {
            // Timeout to allow the card to render before downloading
            const timer = setTimeout(() => handleDownload(generatedCard), 500);
            return () => clearTimeout(timer);
        }
    }, [generatedCard, handleDownload]);

    const handleSelectSuspect = (suspect: Suspect) => {
        setGeneratedCard(suspect);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredAndSortedSuspects = useMemo(() => {
        return suspects
            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                switch (sortBy) {
                    case 'name-asc':
                        return a.name.localeCompare(b.name, 'ar');
                    case 'name-desc':
                        return b.name.localeCompare(a.name, 'ar');
                    case 'date-asc':
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    case 'date-desc':
                    default:
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
            });
    }, [suspects, searchTerm, sortBy]);

    return (
        <div className="space-y-8">
            {generatedCard && (
                <div className="bg-gray-800 p-4 rounded-lg shadow-2xl flex flex-col items-center">
                    <SuspectCard ref={cardRef} suspect={generatedCard} />
                    <div className="mt-6 flex gap-4 justify-center">
                        <Button onClick={handlePrint} icon={<PrintIcon />} text="طباعة" />
                        <Button onClick={() => handleDownload(generatedCard)} icon={<DownloadIcon />} text="تحميل كصورة" />
                    </div>
                </div>
            )}
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b-2 border-blue-500 pb-2">سجل جديد</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                         <div className="w-40 h-40 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-500">
                             {formData.photo ? <img src={formData.photo} alt="صورة المتهم" className="w-full h-full object-cover" /> : <CameraIcon className="w-16 h-16 text-gray-400" />}
                         </div>
                         <label htmlFor="photo-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            <input id="photo-upload" type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" capture="environment" />
                            <span>{formData.photo ? "تغيير الصورة" : "التقاط أو تحميل صورة"}</span>
                         </label>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <h3 className="text-lg font-semibold text-gray-300 mb-4">زانیاری کەسی</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <InputField id="name" label="ناڤێ تومەتباری" value={formData.name} onChange={handleChange} required />
                           <InputField id="birthdate" label="ژدایـــكبون" value={formData.birthdate} onChange={handleChange} />
                           <InputField id="address" label="ئاكنجی بوون" value={formData.address} onChange={handleChange} />
                           <InputField id="problemType" label="جورێ ئاریشێ" value={formData.problemType} onChange={handleChange} datalistOptions={problemTypeOptions} />
                           <InputField id="maritalStatus" label="بارێ خێزانی" value={formData.maritalStatus} onChange={handleChange} datalistOptions={["خێزاندەرە", "نە خێزاندارە"]} />
                           <InputField id="job" label="كارێ وی" value={formData.job} onChange={handleChange} />
                           <InputField id="prison" label="زیندانكرن" value={formData.prison} onChange={handleChange} datalistOptions={["بەلی", "نەخێر"]} />
                           <InputField id="phone" label="ژمارا موبایلي" value={formData.phone} onChange={handleChange} type="tel" />
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4">
                        <h3 className="text-lg font-semibold text-gray-300 mb-4">دەمژمێر</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField id="timeFrom" label="من" value={formData.timeFrom} onChange={handleChange} type="time" />
                            <InputField id="timeTo" label="إلى" value={formData.timeTo} onChange={handleChange} type="time" />
                            <InputField id="period" label="الفترة" value={formData.period} onChange={handleChange} datalistOptions={["روژ", "شەڤ"]} />
                         </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <h3 className="text-lg font-semibold text-gray-300 mb-4">توماركرنا پێزانینێن رویدانێ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <InputField id="problemLocation" label="جهێ ئاریشێ" value={formData.problemLocation} onChange={handleChange} />
                           <InputField id="driverName" label="ناڤێ شوفێری" value={formData.driverName} onChange={handleChange} datalistOptions={driverNameOptions} />
                           <InputField id="point" label="خالا" value={formData.point} onChange={handleChange} datalistOptions={pointOptions} />
                           <InputField id="sentTo" label="رەوانەكرن بـــو" value={formData.sentTo} onChange={handleChange} datalistOptions={sentToOptions} />
                        </div>
                    </div>
                    
                    <div className="text-center pt-4">
                        <Button type="submit" text="خەزنكرنا كارتێ" className="w-full md:w-auto" />
                    </div>
                </form>
            </div>

            {suspects.length > 0 && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400">قائمة السجلات</h2>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-grow w-full sm:w-auto">
                           <InputField
                                id="search-suspects"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="بحث حسب اسم المتهم..."
                                icon={<SearchIcon />}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label htmlFor="sort-suspects" className="text-gray-300 whitespace-nowrap">ترتيب حسب:</label>
                            <select
                                id="sort-suspects"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                <option value="date-desc">الأحدث أولاً</option>
                                <option value="date-asc">الأقدم أولاً</option>
                                <option value="name-asc">الاسم (أ-ي)</option>
                                <option value="name-desc">الاسم (ي-أ)</option>
                            </select>
                        </div>
                    </div>
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredAndSortedSuspects.map(s => (
                            <li key={s.id} onClick={() => handleSelectSuspect(s)} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-600 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-600 rounded-full flex-shrink-0 overflow-hidden">
                                        {s.photo && <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{s.name}</p>
                                        <p className="text-sm text-gray-400">{s.problemType}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">{new Date(s.date).toLocaleDateString('ar-IQ')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SuspectPage;
