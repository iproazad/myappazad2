// FIX: Import React at the top of the file.
import React from 'react';
import type { Record } from '../types';

interface CardData extends Omit<Record, 'cardImage'> {}

// --- Helper functions for SVG Icons ---
const createIcon = (paths: string[], style: React.CSSProperties = {}) => React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16", height: "16", viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: "2",
    strokeLinecap: "round", strokeLinejoin: "round",
    style: { ...style, display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }
}, paths.map((d, i) => React.createElement('path', { key: i, d })));

const IconClipboardList = () => createIcon(['M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'M12 2v4', 'M8 12h8', 'M8 16h4']);
const IconMapPin = () => createIcon(['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z', 'M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z']);
const IconClock = () => createIcon(['M12 21a9 9 0 1 0-9-9c0 4.97 4.03 9 9 9Z', 'M12 7v5l3 3']);
const IconPoint = () => createIcon(['M12 21a9 9 0 1 0-9-9c0 4.97 4.03 9 9 9Z', 'M10 10l4 4m0-4l-4 4']);
const IconSend = () => createIcon(['m22 2-7 20-4-9-9-4Z', 'm22 2-11 11']);


// FIX: Rewrote CardComponent using React.createElement to be valid in a .ts file with a new, more attractive design.
const CardComponent: React.FC<{ data: CardData }> = ({ data }) => {
    
    const cardStyle: React.CSSProperties = {
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif',
        width: '500px',
        backgroundColor: '#f8fafc',
        backgroundImage: 'linear-gradient(to bottom right, #f8fafc, #eef2f5)',
        borderRadius: '15px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        color: '#334155',
        overflow: 'hidden',
    };
    
    const headerStyle: React.CSSProperties = {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '20px',
        textAlign: 'center' as 'center',
    };
    
    const contentStyle: React.CSSProperties = {
        padding: '25px',
    };
    
    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: 'bold' as 'bold',
        color: '#1e3a8a',
        borderBottom: '2px solid #dbeafe',
        paddingBottom: '8px',
        marginBottom: '15px',
    };

    const detailGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px 20px',
        fontSize: '14px',
        alignItems: 'center',
    };
    
    const detailItemStyle: React.CSSProperties = {
         display: 'flex',
         alignItems: 'center',
    };

    const personCardStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
        padding: '12px',
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
    };

    const personPhotoStyle: React.CSSProperties = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        objectFit: 'cover' as 'cover',
        marginLeft: '15px',
        border: '3px solid #bfdbfe',
    };

    const notesStyle: React.CSSProperties = {
        fontSize: '14px',
        whiteSpace: 'pre-wrap' as 'pre-wrap',
        backgroundColor: '#eef2f5',
        padding: '12px',
        borderRadius: '8px',
        borderLeft: '4px solid #60a5fa',
        color: '#475569',
    };

    return React.createElement(
        'div', { style: cardStyle },
        // Header
        React.createElement(
            'div', { style: headerStyle },
            React.createElement('h1', { style: { fontSize: '26px', fontWeight: 'bold' as 'bold', margin: '0 0 5px 0' } }, 'بطاقة بلاغ'),
            React.createElement('span', { style: { fontSize: '13px', opacity: '0.9' } }, 
                new Date(data.createdAt).toLocaleString('ar-EG', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            )
        ),
        
        React.createElement(
            'div', { style: contentStyle },
            // Case Details Section
            React.createElement('div', null,
                React.createElement('h2', { style: sectionTitleStyle }, 'تفاصيل البلاغ'),
                React.createElement(
                    'div', { style: detailGridStyle },
                    React.createElement('div', { style: detailItemStyle }, IconClipboardList(), React.createElement('strong', null, 'نوع المشكلة:'), ` ${data.caseDetails.issueType}`),
                    React.createElement('div', { style: detailItemStyle }, IconMapPin(), React.createElement('strong', null, 'المكان:'), ` ${data.caseDetails.problemLocation}`),
                    React.createElement('div', { style: detailItemStyle }, IconClock(), React.createElement('strong', null, 'الوقت:'), ` من ${data.caseDetails.timeFrom} إلى ${data.caseDetails.timeTo}`),
                    React.createElement('div', { style: detailItemStyle }, IconPoint(), React.createElement('strong', null, 'النقطة:'), ` ${data.caseDetails.point}`),
                    React.createElement('div', { style: { ...detailItemStyle, gridColumn: 'span 2' } }, IconSend(), React.createElement('strong', null, 'أرسلت إلى:'), ` ${data.caseDetails.sentTo}`)
                )
            ),

            // Persons Section
            React.createElement('div', { style: { marginTop: '25px' } },
                React.createElement('h2', { style: sectionTitleStyle }, 'الأشخاص'),
                ...data.persons.map(person =>
                    React.createElement(
                        'div', { key: person.id, style: personCardStyle },
                        person.photo && React.createElement('img', { src: person.photo, alt: person.fullName, style: personPhotoStyle }),
                        React.createElement(
                            'div', { style: { fontSize: '14px', lineHeight: '1.7' } },
                            React.createElement('div', null, React.createElement('strong', { style: { color: '#1e3a8a' } }, `${person.personType}: `), `${person.fullName} (سنة ${person.birthYear})`),
                            React.createElement('div', null, React.createElement('strong', null, 'العنوان: '), person.address)
                        )
                    )
                )
            ),

            // Notes Section
            data.caseDetails.notes && React.createElement('div', { style: { marginTop: '25px' } },
                React.createElement('h2', { style: sectionTitleStyle }, 'ملاحظات'),
                React.createElement('p', { style: notesStyle }, data.caseDetails.notes)
            )
        )
    );
};


export const generateCardImage = async (data: CardData): Promise<string | null> => {
    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px'; // Position off-screen
    container.style.top = '-9999px';
    document.body.appendChild(container);

    // This is a bit of a hack for server-side rendering environments where ReactDOM is not available.
    // In a real app, you would use ReactDOMServer.renderToString, but for this client-side only app,
    // we need to dynamically import ReactDOM to render our component into the hidden div.
    const ReactDOM = await import('react-dom/client');
    
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(CardComponent, { data }));

    // Wait for the component to render
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const canvas = await (window as any).html2canvas(container.firstChild, { // Target the first child directly
            useCORS: true,
            scale: 2, // Higher scale for better quality
            backgroundColor: null, // Use transparent background for rounded corners
        });
        const dataUrl = canvas.toDataURL('image/png');
        return dataUrl;
    } catch (error) {
        console.error('Error generating card image:', error);
        return null;
    } finally {
        // Cleanup the temporary container
        root.unmount();
        document.body.removeChild(container);
    }
};
