// DOM Elements
const arishaForm = document.getElementById('arisha-form');
const photoInputs = document.querySelectorAll('.photo-input');
const photoPreviewElements = document.querySelectorAll('[id^="photo-preview-"]');
const cameraBtns = document.querySelectorAll('.camera-btn');
const galleryBtns = document.querySelectorAll('.gallery-btn');
const personToggles = document.querySelectorAll('.person-toggle');
const cardModal = document.getElementById('card-modal');
const cardPreview = document.getElementById('card-preview');
const closeModal = document.querySelector('.close-modal');
const shareBtn = document.getElementById('share-btn');
const downloadBtn = document.getElementById('download-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const recordsContainer = document.getElementById('records-container');

// Global variables
let personPhotos = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null
};
let currentRecord = null;
let savedRecords = [];
const RECORDS_STORAGE_KEY = 'tomary_arisha_records';

// Initialize the app
function initApp() {
    // Set current time in the form
    setCurrentTime();
    
    // Add event listeners
    addEventListeners();
    
    // Load saved records
    loadSavedRecords();
}

// Set current time in the form
function setCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Format time for input field
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Set time value
    document.getElementById('time').value = time;
}

// Add all event listeners
function addEventListeners() {
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Photo input handlers
    cameraBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            const photoInput = document.getElementById(`photo-input-${index}`);
            // Use user-facing camera for better selfies
            photoInput.setAttribute('capture', 'user');
            photoInput.click();
        });
    });
    
    galleryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            const photoInput = document.getElementById(`photo-input-${index}`);
            // Remove capture attribute to allow gallery selection
            photoInput.removeAttribute('capture');
            photoInput.click();
        });
    });
    
    photoInputs.forEach(input => {
        input.addEventListener('change', handlePhotoSelect);
    });
    
    // Person section toggle
    personToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const index = toggle.getAttribute('data-index');
            const content = document.getElementById(`person-content-${index}`);
            const icon = toggle.querySelector('i');
            
            content.classList.toggle('collapsed');
            
            if (content.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-down';
            } else {
                icon.className = 'fas fa-chevron-up';
            }
        });
    });
    
    // Form submission
    arishaForm.addEventListener('submit', saveRecord);
    
    // Modal close button
    closeModal.addEventListener('click', () => {
        cardModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cardModal) {
            cardModal.style.display = 'none';
        }
    });
    
    // Share button
    shareBtn.addEventListener('click', shareCard);
    
    // Download button
    downloadBtn.addEventListener('click', downloadCard);
}

// Handle photo selection
function handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const inputId = e.target.id;
    const index = inputId.split('-')[2];
    const photoPreview = document.getElementById(`photo-preview-${index}`);
    
    const reader = new FileReader();
    reader.onload = function(event) {
        personPhotos[index] = event.target.result;
        photoPreview.innerHTML = `<img src="${personPhotos[index]}" alt="صورة الشخص ${index}">`;
    };
    reader.readAsDataURL(file);
}

// Save record
function saveRecord(e) {
    e.preventDefault();
    
    // Check if at least one photo is selected
    const hasPhoto = Object.values(personPhotos).some(photo => photo !== null);
    if (!hasPhoto) {
        alert('الرجاء اختيار صورة واحدة على الأقل');
        return;
    }
    
    // Get form data
    const formData = new FormData(arishaForm);
    
    // Collect person data
    const persons = [];
    for (let i = 1; i <= 5; i++) {
        if (personPhotos[i]) {
            const personType = formData.get(`person-type-${i}`) || '';
            const name = formData.get(`name-${i}`) || '';
            const birthdate = formData.get(`birthdate-${i}`) || '';
            const residence = formData.get(`residence-${i}`) || '';
            const phone = formData.get(`phone-${i}`) || '';
            
            persons.push({
                index: i,
                photo: personPhotos[i],
                personType,
                name,
                birthdate,
                residence,
                phone
            });
        }
    }
    
    // Get common data
    const record = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        persons: persons,
        problemType: formData.get('problem-type'),
        time: formData.get('time'),
        location: formData.get('location'),
        driverName: formData.get('driver-name') || '',
        point: formData.get('point'),
        sendTo: formData.get('send-to')
    };
    
    // Save current record
    currentRecord = record;
    
    // Generate and show card
    generateCard(record);
    
    // Save record to local storage
    saveRecordToStorage(record);
    
    // Show modal
    cardModal.style.display = 'block';
}

// Generate information card
function generateCard(record) {
    // Format date
    const recordDate = new Date(record.date);
    const formattedDate = recordDate.toLocaleDateString('ar-IQ');
    
    // Create card HTML
    let cardHTML = `
        <div class="info-card">
            <div class="card-header">
                <h3>توماری ئاریشە</h3>
                <p>تاريخ التسجيل: ${formattedDate}</p>
            </div>
            
            <div class="card-body">
                <div class="card-info">
                    <div class="info-group">
                        <h4>📝 معلومات المشكلة</h4>
                        <p><strong>جورێ ئاریشێ:</strong> ${record.problemType}</p>
                        <p><strong>دەمژمێر:</strong> ${record.time}</p>
                        <p><strong>جهێ ئاریشێ:</strong> ${record.location}</p>
                        <p><strong>ناڤێ شوفێری:</strong> ${record.driverName || 'غير محدد'}</p>
                        <p><strong>خالا:</strong> ${record.point}</p>
                        <p><strong>رەوانەكرن بـــو:</strong> ${record.sendTo}</p>
                    </div>
                </div>
            </div>
            
            <div class="persons-info">
                <h4>👥 معلومات الأشخاص</h4>
    `;
    
    // Add person information
    record.persons.forEach(person => {
        // Add border class based on person type
        let personTypeClass = '';
        let personTypeDisplay = person.personType || 'غير محدد';
        
        if (person.personType === 'مشتەكی') {
            personTypeClass = 'complainant-type';
        } else if (person.personType === 'تاوانبار') {
            personTypeClass = 'culprit-type';
        }
        
        cardHTML += `
            <div class="person-card">
                <div class="person-photo">
                    <div class="photo-number">${person.index}</div>
                    <img src="${person.photo}" alt="صورة الشخص ${person.index}">
                </div>
                <div class="person-details">
                    <p><strong>نوع الشخص:</strong> <span class="${personTypeClass}">${personTypeDisplay}</span></p>
                    <p><strong>ناڤێ تومەتباری:</strong> ${person.name || 'غير محدد'}</p>
                    <p><strong>ژدایـــكبون:</strong> ${person.birthdate || 'غير محدد'}</p>
                    <p><strong>ئاكنجی بوون:</strong> ${person.residence || 'غير محدد'}</p>
                    <p><strong>ژمارا موبایلی:</strong> ${person.phone || 'غير محدد'}</p>
                </div>
            </div>
        `;
    });
    
    cardHTML += `
            </div>
        </div>
    `;
    
    // Set card HTML in preview
    cardPreview.innerHTML = cardHTML;
    
    // Add CSS for the card
    const cardStyle = document.createElement('style');
    cardStyle.textContent = `
        .info-card {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .card-header {
            background-color: #3498db;
            color: white;
            padding: 10px 15px;
        }
        
        /* أنماط لإطار كلمة مشتەكی */
        .complainant-type {
            border: 2px solid #28a745; /* لون أخضر */
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
            background-color: rgba(40, 167, 69, 0.1);
        }
        
        /* أنماط لإطار كلمة تاوانبار */
        .culprit-type {
            border: 2px solid #dc3545; /* لون أحمر */
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
            background-color: rgba(220, 53, 69, 0.1);
        }
        
        .card-header {
            text-align: center;
        }
        
        .card-header h3 {
            margin: 0;
            font-size: 18px;
        }
        
        .card-header p {
            margin: 5px 0 0;
            font-size: 12px;
            opacity: 0.9;
        }
        
        .card-body {
            padding: 15px;
        }
        
        .card-info {
            margin-bottom: 15px;
        }
        
        .info-group {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        
        .info-group h4 {
            color: #3498db;
            margin: 0 0 8px;
            font-size: 16px;
        }
        
        .info-group p {
            margin: 5px 0;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .persons-info {
            padding: 0 15px 15px;
        }
        
        .persons-info h4 {
            color: #3498db;
            margin: 0 0 15px;
            font-size: 16px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        
        .person-card {
            display: flex;
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        
        .person-photo {
            position: relative;
            width: 80px;
            height: 80px;
            margin-left: 15px;
        }
        
        .person-photo img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
            object-fit: cover;
        }
        
        .photo-number {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #3498db;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-weight: bold;
        }
        
        .person-details {
            flex: 1;
        }
        
        .person-details p {
            margin: 3px 0;
            font-size: 13px;
        }
    `;
    
    document.head.appendChild(cardStyle);
}

// Share card
async function shareCard(recordId) {
    // If recordId is provided, find the record
    if (recordId) {
        const record = savedRecords.find(r => r.id === recordId);
        if (record) {
            currentRecord = record;
            generateCard(record);
        } else {
            return;
        }
    }
    
    // Check if we have a current record
    if (!currentRecord) return;
    
    try {
        // Load html2canvas if not already loaded
        await loadHtml2Canvas();
        
        // Convert card to image with higher quality
        const cardElement = cardPreview.querySelector('.info-card');
        const canvas = await html2canvas(cardElement, {
            scale: 3, // Increase scale for higher resolution
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        const imageData = canvas.toDataURL('image/png', 1.0); // Use maximum quality
        
        // Create a filename with date
        const now = new Date();
        const filename = `بطاقة_توماری_ئاریشە_${now.getTime()}.png`;
        
        // Check if Web Share API is available
        if (navigator.share) {
            // Create a blob from the image data
            const blob = await (await fetch(imageData)).blob();
            const file = new File([blob], filename, { type: 'image/png' });
            
            await navigator.share({
                title: 'توماری ئاریشە',
                text: `بطاقة معلومات المشكلة`,
                files: [file]
            });
            
            // Show new record button after successful share
            showNewRecordButton();
        } else {
            // Fallback for browsers that don't support Web Share API
            const link = document.createElement('a');
            link.href = imageData;
            link.download = filename;
            link.click();
            
            alert('تم حفظ البطاقة. يمكنك مشاركتها يدوياً.');
            
            // Show new record button after successful download
            showNewRecordButton();
        }
    } catch (error) {
        console.error('Error sharing card:', error);
        alert('حدث خطأ أثناء مشاركة البطاقة. يرجى المحاولة مرة أخرى.');
    }
}

//// Download card
async function downloadCard(recordId) {
    // If recordId is provided, find the record
    if (recordId) {
        const record = savedRecords.find(r => r.id === recordId);
        if (record) {
            currentRecord = record;
            generateCard(record);
        } else {
            return;
        }
    }
    
    // Check if we have a current record
    if (!currentRecord) return;
    
    try {
        // Load html2canvas if not already loaded
        await loadHtml2Canvas();
        
        // Convert card to image with higher quality
        const cardElement = cardPreview.querySelector('.info-card');
        const canvas = await html2canvas(cardElement, {
            scale: 3, // Increase scale for higher resolution
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        const imageData = canvas.toDataURL('image/png', 1.0); // Use maximum quality
        
        // Create a filename with date
        const now = new Date();
        const filename = `بطاقة_توماری_ئاریشە_${now.getTime()}.png`;
        
        // Create download link
        const link = document.createElement('a');
        link.href = imageData;
        link.download = filename;
        link.click();
        
        // Show new record button after successful download
        showNewRecordButton();
    } catch (error) {
        console.error('Error downloading card:', error);
        alert('حدث خطأ أثناء تحميل البطاقة. يرجى المحاولة مرة أخرى.');
    }
}

// Load html2canvas library for card generation
function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
        if (window.html2canvas) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Function to show new record button
function showNewRecordButton() {
    // Check if button already exists
    if (document.getElementById('new-record-btn')) {
        return;
    }
    
    // Create button container
    const btnContainer = document.createElement('div');
    btnContainer.style.textAlign = 'center';
    btnContainer.style.margin = '15px 0';
    
    // Create new record button
    const newRecordBtn = document.createElement('button');
    newRecordBtn.id = 'new-record-btn';
    newRecordBtn.className = 'btn submit-btn';
    newRecordBtn.innerHTML = '<i class="fas fa-plus-circle"></i> توماركرنا ئاریشەیەكا نوی';
    newRecordBtn.style.backgroundColor = '#27ae60';
    newRecordBtn.style.padding = '12px 20px';
    
    // Add click event to reset form
    newRecordBtn.addEventListener('click', () => {
        // Reset form
        arishaForm.reset();
        
        // Reset photos
        personPhotos = {
            1: null,
            2: null,
            3: null,
            4: null,
            5: null
        };
        
        // Reset photo previews
        photoPreviewElements.forEach(preview => {
            preview.innerHTML = '<i class="fas fa-user placeholder-icon"></i>';
        });
        
        // Set current time
        setCurrentTime();
        
        // Close modal
        cardModal.style.display = 'none';
        
        // Remove the button itself
        btnContainer.remove();
        
        // Scroll to top
        window.scrollTo(0, 0);
    });
    
    // Add button to modal
    btnContainer.appendChild(newRecordBtn);
    cardPreview.appendChild(btnContainer);
}

// Save record to local storage
function saveRecordToStorage(record) {
    // Load existing records
    loadSavedRecords();
    
    // Add new record with unique ID and timestamp
    const newRecord = {
        ...record,
        id: Date.now().toString(),
        savedAt: new Date().toISOString()
    };
    
    // Add to records array
    savedRecords.unshift(newRecord);
    
    // Save to local storage
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(savedRecords));
    
    // Update records display
    displaySavedRecords();
}

// Load saved records from local storage
function loadSavedRecords() {
    const storedRecords = localStorage.getItem(RECORDS_STORAGE_KEY);
    if (storedRecords) {
        savedRecords = JSON.parse(storedRecords);
    } else {
        savedRecords = [];
    }
    
    // Display records
    displaySavedRecords();
}

// Display saved records in the records list tab
function displaySavedRecords() {
    // Clear current records
    recordsContainer.innerHTML = '';
    
    // Check if there are any records
    if (savedRecords.length === 0) {
        const noRecords = document.createElement('p');
        noRecords.className = 'no-records';
        noRecords.textContent = 'لا توجد سجلات حتى الآن';
        recordsContainer.appendChild(noRecords);
        return;
    }
    
    // Create record cards for each saved record
    savedRecords.forEach(record => {
        const recordCard = createRecordCard(record);
        recordsContainer.appendChild(recordCard);
    });
}

// Create a record card element
function createRecordCard(record) {
    const card = document.createElement('div');
    card.className = 'record-card';
    card.dataset.id = record.id;
    
    // Format date for display
    const savedDate = new Date(record.savedAt);
    const formattedDate = savedDate.toLocaleDateString('ar-IQ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Create card content
    card.innerHTML = `
        <h3>${record.problemType || 'مشكلة'}</h3>
        <div class="timestamp">${formattedDate}</div>
        <p><strong>المكان:</strong> ${record.location || 'غير محدد'}</p>
        <div class="record-actions">
            <button class="view-record-btn" data-id="${record.id}">
                <i class="fas fa-eye"></i> عرض
            </button>
            <button class="share-record-btn" data-id="${record.id}">
                <i class="fas fa-share-alt"></i> مشاركة
            </button>
            <button class="delete-record-btn" data-id="${record.id}">
                <i class="fas fa-trash"></i> حذف
            </button>
        </div>
    `;
    
    // Add event listeners for buttons
    card.querySelector('.view-record-btn').addEventListener('click', () => viewRecord(record.id));
    card.querySelector('.share-record-btn').addEventListener('click', () => shareRecord(record.id));
    card.querySelector('.delete-record-btn').addEventListener('click', () => deleteRecord(record.id));
    
    return card;
}

// View a saved record
function viewRecord(recordId) {
    const record = savedRecords.find(r => r.id === recordId);
    if (!record) return;
    
    // Set as current record
    currentRecord = record;
    
    // Generate card HTML
    const cardHtml = generateCard(record);
    
    // Show modal
    cardModal.style.display = 'block';
}

// Delete a record
function deleteRecord(recordId) {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
        // Remove from array
        savedRecords = savedRecords.filter(record => record.id !== recordId);
        
        // Update local storage
        localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(savedRecords));
        
        // Update display
        displaySavedRecords();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadHtml2Canvas();
        initApp();
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('حدث خطأ أثناء تحميل التطبيق. يرجى تحديث الصفحة.');
    }
});