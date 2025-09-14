document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const suspectForm = document.getElementById('suspect-form');
    const recordsGrid = document.getElementById('records-grid');
    const noRecordsMessage = document.getElementById('no-records-message');
    const searchInput = document.getElementById('search-input');
    const recordModal = document.getElementById('record-modal');
    const modalContent = document.getElementById('modal-content');

    // Photo elements
    const fileInput = document.getElementById('file-input');
    const captureBtn = document.getElementById('capture-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const defaultPhotoIcon = document.getElementById('default-photo-icon');
    const photoPreviewImg = document.getElementById('photo-preview-img');

    // PWA Install
    const installButton = document.getElementById('install-pwa-button');
    let deferredPrompt;

    // --- STATE ---
    let records = [];
    let photoData = null;
    const STORAGE_KEY = 'violationRecords';

    // --- INITIALIZATION ---
    function init() {
        setupEventListeners();
        loadRecords();
        renderRecords();
        setupPWAInstall();
        registerServiceWorker();
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });

        // Form submission
        suspectForm.addEventListener('submit', handleFormSubmit);

        // Photo buttons
        captureBtn.addEventListener('click', () => triggerFileInput(true));
        uploadBtn.addEventListener('click', () => triggerFileInput(false));
        fileInput.addEventListener('change', handleFileSelected);

        // Search
        searchInput.addEventListener('input', () => renderRecords(searchInput.value));
        
        // Modal closing
        recordModal.addEventListener('click', closeModal);
    }
    
    // --- PWA ---
    function setupPWAInstall() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installButton.classList.remove('hidden');
        });

        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                deferredPrompt = null;
                installButton.classList.add('hidden');
            }
        });
    }
    
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => console.log('Service Worker registered:', registration))
                .catch(error => console.error('Service Worker registration failed:', error));
        }
    }


    // --- TAB HANDLING ---
    function switchTab(targetTab) {
        tabs.forEach(tab => {
            if (tab.dataset.tab === targetTab) {
                tab.classList.add('bg-blue-600', 'text-white', 'shadow-md');
                tab.classList.remove('text-gray-400', 'hover:bg-slate-700');
            } else {
                tab.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
                tab.classList.add('text-gray-400', 'hover:bg-slate-700');
            }
        });

        tabContents.forEach(content => {
            if (content.id === targetTab) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
    }

    // --- FORM & PHOTO HANDLING ---
    function triggerFileInput(capture) {
        if (capture) {
            fileInput.setAttribute('capture', 'environment');
        } else {
            fileInput.removeAttribute('capture');
        }
        fileInput.click();
    }

    function handleFileSelected(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoData = e.target.result;
                photoPreviewImg.src = photoData;
                photoPreviewImg.classList.remove('hidden');
                defaultPhotoIcon.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(suspectForm);
        const formProps = Object.fromEntries(formData.entries());

        if (!formProps.name) {
            alert('الرجاء إدخال اسم المتهم.');
            return;
        }
        if (!photoData) {
            alert('الرجاء اختيار صورة.');
            return;
        }

        const newRecord = {
            id: Date.now(),
            photo: photoData,
            date: new Date().toISOString(),
            ...formProps
        };

        records.unshift(newRecord);
        saveRecords();
        renderRecords();
        
        // Show the newly created card in the modal
        showModal(newRecord);

        // Reset form
        suspectForm.reset();
        photoData = null;
        photoPreviewImg.classList.add('hidden');
        defaultPhotoIcon.classList.remove('hidden');
    }

    // --- DATA & RENDERING ---
    function loadRecords() {
        const storedRecords = localStorage.getItem(STORAGE_KEY);
        records = storedRecords ? JSON.parse(storedRecords) : [];
        // Sort by date descending
        records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    function saveRecords() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }

    function renderRecords(searchTerm = '') {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredRecords = records.filter(record =>
            (record.name && record.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (record.problemType && record.problemType.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (record.phone && record.phone.includes(lowerCaseSearchTerm))
        );

        recordsGrid.innerHTML = ''; // Clear existing records

        if (filteredRecords.length === 0) {
            noRecordsMessage.classList.remove('hidden');
        } else {
            noRecordsMessage.classList.add('hidden');
            filteredRecords.forEach(record => {
                const card = document.createElement('div');
                card.className = 'record-card bg-slate-800 rounded-lg shadow-lg overflow-hidden cursor-pointer group transform hover:-translate-y-1 hover:shadow-blue-500/20 transition-all duration-300 border border-slate-700';
                card.innerHTML = `
                    <div class="card-photo h-48 overflow-hidden">
                        <img src="${record.photo}" alt="${record.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    </div>
                    <div class="card-info p-4 text-center border-t border-slate-700">
                        <div class="card-name font-bold text-lg text-gray-100 truncate">${record.name}</div>
                        <div class="card-type text-sm text-blue-400 font-semibold my-1">${record.problemType}</div>
                        <div class="card-date text-xs text-gray-500">${new Date(record.date).toLocaleDateString('ar-IQ')}</div>
                    </div>
                `;
                card.addEventListener('click', () => showModal(record));
                recordsGrid.appendChild(card);
            });
        }
    }

    // --- MODAL & CARD ACTIONS ---
    function showModal(record) {
        modalContent.innerHTML = createCardHTML(record);
        recordModal.classList.remove('hidden');
        setupCardActionListeners();
    }
    
    function closeModal() {
        recordModal.classList.add('hidden');
        modalContent.innerHTML = '';
    }

    function setupCardActionListeners() {
        const shareBtn = document.getElementById('share-card-btn');
        const downloadBtn = document.getElementById('download-card-btn');
        const closeBtn = document.getElementById('close-modal-btn');
        
        if(closeBtn) closeBtn.addEventListener('click', closeModal);
        if(shareBtn) shareBtn.addEventListener('click', handleCardAction);
        if(downloadBtn) downloadBtn.addEventListener('click', handleCardAction);
    }
    
    async function handleCardAction(event) {
        const action = event.currentTarget.dataset.action;
        const cardToCapture = document.getElementById('card-to-capture');
        const buttons = [document.getElementById('share-card-btn'), document.getElementById('download-card-btn')];
        
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> ...`;
        });
        
        try {
            if (typeof html2canvas === 'undefined') {
                throw new Error('html2canvas library not found.');
            }
            const canvas = await html2canvas(cardToCapture, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
            const recordName = cardToCapture.dataset.recordName;
            const fileName = `بطاقة_تومەتبار_${recordName}.png`;

            if (action === 'share') {
                canvas.toBlob(async (blob) => {
                    if (!blob) throw new Error('Could not create image blob.');
                    const file = new File([blob], fileName, { type: 'image/png' });

                    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            title: 'توماركرنا تومەتبارا',
                            text: `بطاقة معلومات: ${recordName}`,
                            files: [file]
                        });
                    } else {
                        downloadCanvas(canvas, fileName);
                        alert('تم حفظ الصورة في جهازك لعدم دعم المشاركة.');
                    }
                }, 'image/png');
            } else if (action === 'download') {
                downloadCanvas(canvas, fileName);
            }
        } catch (error) {
            console.error(`Error during card ${action}:`, error);
            alert(`حدث خطأ أثناء محاولة ${action === 'share' ? 'المشاركة' : 'التحميل'}.`);
        } finally {
            buttons[0].disabled = false;
            buttons[0].innerHTML = `<i class="fas fa-share-alt mr-2"></i> مشاركة`;
            buttons[1].disabled = false;
            buttons[1].innerHTML = `<i class="fas fa-download mr-2"></i> تحميل`;
        }
    }

    function downloadCanvas(canvas, fileName) {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }


    // --- HELPERS ---
    function formatTo12Hour(time24) {
        if (!time24) return '-';
        const [hours24, minutes] = time24.split(':');
        let hours12 = parseInt(hours24, 10) % 12;
        if (hours12 === 0) hours12 = 12;
        const period = parseInt(hours24, 10) < 12 ? 'ص' : 'م';
        return `${hours12}:${minutes || '00'} ${period}`;
    }

    function getFormattedDate(dateString) {
        return new Date(dateString).toLocaleDateString('ar-IQ');
    }

    function getFormattedTime(dateString) {
        const recordDate = new Date(dateString);
        return recordDate.toLocaleTimeString('ar-IQ', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    function createCardHTML(record) {
        return `
            <button id="close-modal-btn" class="close-modal absolute top-2 left-2 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center text-lg z-20 hover:bg-black/80 transition">&times;</button>
            <div id="card-wrapper">
                <div id="card-to-capture" data-record-name="${record.name}" class="bg-white rounded-lg overflow-hidden shadow-lg max-w-lg mx-auto">
                    <header class="blue-header">
                        <h2>بەشێ پولیسێن هەوارهاتنێ</h2>
                        <div class="top-info-grid">
                            <div class="top-info-right">
                                <div class="top-info-item"><span class="top-info-value">${record.problemLocation || '-'}</span><span class="top-info-label">جهێ ئاریشێ:</span></div>
                                <div class="top-info-item"><span class="top-info-value">${record.point || '-'}</span><span class="top-info-label">خالا:</span></div>
                            </div>
                            <div class="top-info-left">
                                <div class="top-info-item"><span class="top-info-value">${record.driverName || '-'}</span><span class="top-info-label">ناڤێ شوفێری:</span></div>
                                <div class="top-info-item"><span class="top-info-value">${record.sentTo || '-'}</span><span class="top-info-label">رەوانەكرن بـــو:</span></div>
                            </div>
                        </div>
                        <div class="registration-date"><span class="date-value">${getFormattedDate(record.date)} - ${getFormattedTime(record.date)}</span><span class="date-label">مێژویا توماركرنا:</span></div>
                    </header>
                    <main class="white-body">
                        <div class="suspect-info-container">
                            <div class="right-photo"><img src="${record.photo}" alt="${record.name}"><div class="suspect-number">1</div></div>
                            <div class="left-details">
                                <div class="horizontal-item"><span class="info-value">${record.name || '-'}</span><span class="info-label">ناڤێ تومەتباری:</span></div>
                                <div class="horizontal-item"><span class="info-value">${record.problemType || '-'}</span><span class="info-label">جورێ ئاریشێ:</span></div>
                                <div class="horizontal-item"><span class="info-value">${record.birthdate || '-'}</span><span class="info-label">ژدایـــكبون:</span></div>
                                <div class="horizontal-item"><span class="info-value">${record.phone || '-'}</span><span class="info-label">ژمارا موبایلي:</span></div>
                                <div class="horizontal-item"><span class="info-value">${record.address || '-'}</span><span class="info-label">ئاكنجی بوون:</span></div>
                                <div class="horizontal-item"><span class="info-value">${record.maritalStatus || '-'}</span><span class="info-label">بارێ خێزانی:</span></div>
                                <div class="horizontal-item"><span class="info-value">${record.job || '-'}</span><span class="info-label">كارێ وی:</span></div>
                                <div class="horizontal-item"><span class="info-value">${record.prison || '-'}</span><span class="info-label">زیندانكرن:</span></div>
                            </div>
                        </div>
                        <div class="card-button-container">
                            <button class="card-action-button">${formatTo12Hour(record.timeFrom)} - ${formatTo12Hour(record.timeTo)} (${record.period || '-'})</button>
                        </div>
                    </main>
                </div>
                <!-- Action Buttons -->
                <div class="card-actions flex gap-4 mt-6 max-w-lg mx-auto">
                    <button id="share-card-btn" data-action="share" class="card-btn flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition shadow-lg disabled:bg-opacity-50 disabled:cursor-not-allowed">
                        <i class="fas fa-share-alt mr-2"></i> مشاركة
                    </button>
                    <button id="download-card-btn" data-action="download" class="card-btn flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition shadow-lg disabled:bg-opacity-50 disabled:cursor-not-allowed">
                        <i class="fas fa-download mr-2"></i> تحميل
                    </button>
                </div>
            </div>`;
    }

    // --- START THE APP ---
    init();
});
