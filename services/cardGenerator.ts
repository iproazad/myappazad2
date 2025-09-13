import React from 'react';
import ReactDOM from 'react-dom/client';
import type { Record } from '../types.ts';

// Since this is a .ts file, we use React.createElement instead of JSX.
const e = React.createElement;

// Helper to create a detail row for a person
const PersonDetail = ({ label, value }: { label: string, value: string | undefined }) => {
    if (!value) return null;
    return e('div', { style: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginBottom: '4px' } },
        e('span', { style: { color: '#333', fontWeight: 'normal', fontSize: '16px' } }, value),
        e('span', { style: { color: 'white', backgroundColor: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' } }, label)
    );
};


// The React component for the card
const CardComponent: React.FC<{ record: Omit<Record, 'cardImage'> }> = ({ record }) => {
    const { persons, caseDetails, createdAt } = record;
    const today = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');

    return e('div', {
        style: {
            direction: 'rtl',
            fontFamily: "'Noto Kufi Arabic', sans-serif",
            width: '800px',
            backgroundColor: '#fff',
            border: '2px solid #f97316',
            boxSizing: 'border-box'
        }
    },
        // Header
        e('div', {
            style: { padding: '15px', backgroundColor: '#ef4444', color: 'white', borderBottom: '4px solid #f97316', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23dc2626\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }
        },
            e('h1', { style: { textAlign: 'center', fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0', borderBottom: '2px solid #f59e0b', paddingBottom: '5px', display: 'inline-block' } }, 'تومەتبار'),
            e('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 'bold' } },
                e('div', { style: { textAlign: 'right' } },
                    e('p', { style: { margin: '0 0 5px 0' } }, `جوری ئاریشی: ${caseDetails.issueType || ''}`),
                    e('p', { style: { margin: '0 0 5px 0' } }, `دەمی ئاریشی: ${caseDetails.timeFrom || ''} - ${caseDetails.timeTo || ''}`),
                    e('p', { style: { margin: 0 } }, `جهی ئاریشی: ${caseDetails.problemLocation || ''}`)
                ),
                e('div', { style: { textAlign: 'right' } },
                    e('p', { style: { margin: '0 0 5px 0' } }, `ناڤی شوفیری: ${caseDetails.driverName || ''}`),
                    e('p', { style: { margin: '0 0 5px 0' } }, `خالا: ${caseDetails.point || ''}`),
                    e('p', { style: { margin: 0 } }, `رەوانەکرن بو: ${caseDetails.sentTo || ''}`)
                )
            ),
            e('div', { style: { textAlign: 'center', marginTop: '10px' } },
              e('span', { style: { backgroundColor: 'rgba(0,0,0,0.2)', padding: '5px 15px', borderRadius: '15px', fontSize: '14px' } }, `ریکەفتی: ${today}`)
            )
        ),
        // Body
        e('div', { style: { padding: '15px', backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' } },
            persons.map((person, index) => e('div', {
                key: person.id,
                style: {
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    marginBottom: persons.length > 1 ? '15px' : '0',
                    position: 'relative',
                    borderRight: '5px solid #ef4444'
                }
            },
                e('div', { style: { position: 'absolute', top: '-1px', left: '-1px', backgroundColor: '#ef4444', color: 'white', width: '28px', height: '28px', borderRadius: '0 8px 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' } }, index + 1),
                e('div', { style: { flexShrink: 0, width: '150px', height: '180px', border: '3px solid #ef4444', borderRadius: '4px', overflow: 'hidden' } },
                    person.photo ? e('img', { src: person.photo, style: { width: '100%', height: '100%', objectFit: 'cover' } }) : null
                ),
                e('div', { style: { flexGrow: 1, paddingTop: '5px' } },
                    e(PersonDetail, { label: 'ناڤی تومەتباری', value: `${person.fullName} (${person.personType})` }),
                    e(PersonDetail, { label: 'ژدایکبون', value: person.birthYear }),
                    e(PersonDetail, { label: 'ئاكنجی بوون', value: person.address }),
                    e(PersonDetail, { label: 'ژمارا موبایلی', value: person.phone }),
                    e(PersonDetail, { label: 'بارێ خێزانی', value: person.maritalStatus }),
                    e(PersonDetail, { label: 'زیندانکرن', value: person.imprisonment }),
                    e(PersonDetail, { label: 'ژمارا ناسنامێ', value: person.idNumber }),
                    e(PersonDetail, { label: 'کارێ وی', value: person.occupation })
                )
            ))
        ),
        // Notes Section
        e('div', { style: { padding: '10px 15px', backgroundColor: '#e0f2fe', borderBottom: '2px solid #e5e7eb', fontSize: '16px' } },
            e('span', { style: { fontWeight: 'bold' } }, 'تێبینی: '),
            caseDetails.notes || '0'
        ),
        // Footer
        e('div', {
            style: { padding: '8px', backgroundColor: '#ef4444', color: 'white', textAlign: 'center', fontSize: '14px' }
        },
            `میژوویا تومارکرنا رویدانی: ${new Date(createdAt).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}`
        )
    );
};


export const generateCardImage = async (record: Omit<Record, 'cardImage' | 'id'> & { id?: string }): Promise<string> => {
    // Create a temporary container to render the component off-screen
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px'; // Set a fixed width for consistent rendering
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    // Use React to render the component into the container
    root.render(e(CardComponent, { record: record as Omit<Record, 'cardImage'> }));

    // Give it a moment to render, especially for images
    await new Promise(resolve => setTimeout(resolve, 500));

    // @ts-ignore - html2canvas is loaded from CDN
    const canvas = await html2canvas(container, {
        scale: 2, // Higher scale for better resolution
        useCORS: true,
        logging: false,
    });
    
    const dataUrl = canvas.toDataURL('image/png');

    // Clean up the temporary container
    root.unmount();
    document.body.removeChild(container);

    return dataUrl;
};
