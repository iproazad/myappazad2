/**
 * Toast notification function
 * @param {string} message - The message to display
 * @param {string} type - The type of toast: 'success', 'error', 'warning', 'info' (default: no specific type)
 * @param {number} duration - Duration in milliseconds to show the toast (default: 3000ms)
 */
function showToast(message, type = '', duration = 3000) {
    // Check if a toast container already exists, if not create one
    let toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create a new toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Add type class if specified
    if (type && ['success', 'error', 'warning', 'info'].includes(type)) {
        toast.classList.add(type);
    }
    
    // Add icon based on type
    let iconClass = '';
    switch (type) {
        case 'success':
            iconClass = 'fa-check-circle';
            break;
        case 'error':
            iconClass = 'fa-exclamation-circle';
            break;
        case 'warning':
            iconClass = 'fa-exclamation-triangle';
            break;
        case 'info':
            iconClass = 'fa-info-circle';
            break;
    }
    
    // Create toast content with icon if applicable
    if (iconClass) {
        toast.innerHTML = `<i class="fas ${iconClass}"></i> ${message}`;
    } else {
        toast.textContent = message;
    }
    
    // Add the toast to the container
    toastContainer.appendChild(toast);
    
    // Show the toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove the toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        
        // Remove the element after the fade out animation
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
            
            // Remove the container if it's empty
            if (toastContainer.childNodes.length === 0 && document.body.contains(toastContainer)) {
                document.body.removeChild(toastContainer);
            }
        }, 300);
    }, duration);
}