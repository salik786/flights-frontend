import React, { useState, useRef } from 'react';
import './TaxiDriverRightsDuties.css';

const TaxiDriverRightsDuties = () => {
    const [activeSection, setActiveSection] = useState('rights');
    const [expandedCard, setExpandedCard] = useState(null);
    const scrollRef = useRef(null);

    // Data for rights and duties
    const rightsAndDuties = {
        rights: [
            {
                id: 'fare-refusal',
                title: 'Right to Refuse Service',
                summary: 'You can refuse passengers in certain situations',
                icon: '🚫',
                color: '#f94144',
                scenarios: [
                    'Passenger is clearly intoxicated and may damage your vehicle',
                    'You feel your safety is at risk',
                    'The requested destination is beyond your authorized service area',
                    'Passenger refuses to follow basic safety rules (e.g., wearing a seatbelt)'
                ],
                procedure: 'Politely explain your reason for refusal. If possible, suggest an alternative like calling another taxi or rideshare service.',
                limits: 'You cannot refuse service based on race, religion, disability, gender, sexuality, or other protected characteristics.'
            },
            {
                id: 'payment',
                title: 'Right to Proper Payment',
                summary: 'You are entitled to receive the full, correct fare',
                icon: '💵',
                color: '#43aa8b',
                scenarios: [
                    'You can request payment upfront for long distances',
                    'You can wait until a customer gets money from an ATM',
                    'You can use approved payment methods (cash, card, app)',
                    'You can charge cleaning fees for messes made by passengers'
                ],
                procedure: 'Clearly communicate your rates and payment policies before starting the trip. Keep all payment transactions visible to passengers.',
                limits: 'You must follow local regulations regarding maximum fares and surcharges. You cannot add unauthorized fees.'
            },
            {
                id: 'safe-conditions',
                title: 'Right to Safe Working Conditions',
                summary: 'You have the right to work in reasonable safety',
                icon: '🛡️',
                color: '#277da1',
                scenarios: [
                    'You can refuse to drive in severe weather conditions',
                    'You can end a trip if a passenger becomes threatening',
                    'You can refuse excessive passengers (more than seat capacity)',
                    'You can report unsafe road conditions to your company'
                ],
                procedure: 'Document any unsafe conditions. Report incidents to your dispatch or supervisor right away. Contact police immediately for emergencies.',
                limits: 'You must still follow all traffic laws even during emergencies. Normal weather conditions are not grounds for refusal.'
            },
            {
                id: 'breaks',
                title: 'Right to Breaks',
                summary: 'You are entitled to rest and meal breaks',
                icon: '⏱️',
                color: '#f9c74f',
                scenarios: [
                    'You can take legally required rest breaks',
                    'You can temporarily go offline or unavailable',
                    'You can stop to use restroom facilities',
                    'You can take meal breaks during long shifts'
                ],
                procedure: 'Follow your companys protocol for logging breaks.Try to take breaks during slower periods and notify dispatch if applicable.',
                limits: 'You cannot abandon passengers mid-trip for breaks. You must complete current fares before taking breaks.'
            },
            {
                id: 'privacy',
                title: 'Right to Privacy',
                summary: 'You maintain certain privacy rights while working',
                icon: '🔒',
                color: '#4d908e',
                scenarios: [
                    'You can refuse to share personal contact information',
                    'You can use dash cams for safety (where legal)',
                    'You can decline personal questions from passengers',
                    'You can maintain separation between work and personal life'
                ],
                procedure: 'Politely redirect personal questions. Refer passengers to company contact if they want to request you specifically in the future.',
                limits: 'Company-required GPS or dispatch systems are generally not violations of privacy. Check local laws regarding recording conversations.'
            }
        ],
        duties: [
            {
                id: 'safe-driving',
                title: 'Duty to Drive Safely',
                summary: 'You must follow all traffic laws and drive responsibly',
                icon: '🚦',
                color: '#277da1',
                scenarios: [
                    'Obey speed limits, traffic signals, and road signs',
                    'Do not use your phone while driving',
                    'Never drive under the influence of alcohol or drugs',
                    'Maintain proper focus and attention on the road'
                ],
                procedure: 'Follow defensive driving techniques. Pull over safely if you need to check directions or take a call. Use hands-free equipment when legal.',
                consequences: 'Traffic violations can result in tickets, license suspension, increased insurance rates, job loss, and in serious cases, criminal charges.'
            },
            {
                id: 'vehicle-maintenance',
                title: 'Duty to Maintain Vehicle',
                summary: 'Keep your taxi clean, safe, and in good working order',
                icon: '🔧',
                color: '#f9c74f',
                scenarios: [
                    'Regular mechanical inspections and servicing',
                    'Clean interior and exterior daily',
                    'Check safety equipment (brakes, lights, tires)',
                    'Address any mechanical issues immediately'
                ],
                procedure: 'Follow a daily vehicle checklist. Schedule regular maintenance. Report issues to your company immediately if you dont own the vehicle.',
                consequences: 'Poorly maintained vehicles can result in failed inspections, fines, higher repair costs over time, accidents, and liability issues.'
            },
            {
                id: 'non-discrimination',
                title: 'Duty of Non-Discrimination',
                summary: 'You must serve all customers equally without discrimination',
                icon: '🤝',
                color: '#f8961e',
                scenarios: [
                    'Accept passengers regardless of race, religion, gender, etc.',
                    'Accommodate service animals',
                    'Make reasonable accommodations for disabilities',
                    'Use the same fee structure for all passengers'
                ],
                procedure: 'Treat all customers with respect and dignity. If youre unsure about an accommodation request, ask politely for clarification.',
                consequences: 'Discrimination can result in complaints, fines, loss of license, lawsuits, and damage to reputation and livelihood.'
            },
            {
                id: 'route-efficiency',
                title: 'Duty of Route Efficiency',
                summary: 'Take reasonable routes to passenger destinations',
                icon: '🧭',
                color: '#4d908e',
                scenarios: [
                    'Use the most efficient route unless customer requests otherwise',
                    'Disclose if longer routes are necessary (construction, closures)',
                    'Be honest about estimated times and distances',
                    'Know your service area well'
                ],
                procedure: 'Use GPS as an aid but maintain local knowledge. Communicate with passengers about route choices, especially if there are alternatives.',
                consequences: 'Deliberately taking longer routes ("long-hauling") can result in customer complaints, fare disputes, negative reviews, and disciplinary action.'
            },
            {
                id: 'licensing-compliance',
                title: 'Duty of Licensing & Compliance',
                summary: 'Maintain all required licenses, permits, and registrations',
                icon: '📋',
                color: '#f94144',
                scenarios: [
                    'Keep drivers license current and valid',
                    'Maintain taxi/transportation license or permit',
                    'Display required information (ID, rates, license numbers)',
                    'Follow all local regulations for taxi operators'
                ],
                procedure: 'Create a calendar with renewal dates. Keep copies of all important documents in your vehicle and at home. Stay updated on changing regulations.',
                consequences: 'Operating without proper documentation can result in fines, vehicle impoundment, license revocation, and even criminal charges in some jurisdictions.'
            }
        ]
    };

    // Function to toggle card expansion
    const toggleExpand = (id) => {
        if (expandedCard === id) {
            setExpandedCard(null);
        } else {
            setExpandedCard(id);
            // Add a small delay to allow state update before scrolling
            setTimeout(() => {
                document.getElementById(id).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        }
    };

    // Render section tabs
    const renderTabs = () => {
        return (
            <div className="rights-duties-tabs">
                <button
                    className={`rd-tab ${activeSection === 'rights' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveSection('rights');
                        setExpandedCard(null);
                    }}
                >
                    <span className="rd-tab-icon">⚖️</span>
                    <span className="rd-tab-text">Your Rights</span>
                </button>
                <button
                    className={`rd-tab ${activeSection === 'duties' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveSection('duties');
                        setExpandedCard(null);
                    }}
                >
                    <span className="rd-tab-icon">✓</span>
                    <span className="rd-tab-text">Your Duties</span>
                </button>
            </div>
        );
    };

    // Render cards for the active section
    const renderCards = () => {
        const items = rightsAndDuties[activeSection];

        return (
            <div className="rd-cards-container" ref={scrollRef}>
                {items.map(item => (
                    <div
                        id={item.id}
                        key={item.id}
                        className={`rd-card ${expandedCard === item.id ? 'expanded' : ''}`}
                        onClick={() => toggleExpand(item.id)}
                        style={{ borderLeftColor: item.color }}
                    >
                        <div className="rd-card-header">
                            <div className="rd-card-icon" style={{ backgroundColor: item.color }}>
                                {item.icon}
                            </div>
                            <div className="rd-card-title-container">
                                <h3 className="rd-card-title">{item.title}</h3>
                                <p className="rd-card-summary">{item.summary}</p>
                            </div>
                            <div className="rd-expand-icon">
                                {expandedCard === item.id ? '−' : '+'}
                            </div>
                        </div>

                        {expandedCard === item.id && (
                            <div className="rd-card-details">
                                <div className="rd-scenarios">
                                    <h4>Examples:</h4>
                                    <ul>
                                        {item.scenarios.map((scenario, index) => (
                                            <li key={index}>{scenario}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rd-procedure">
                                    <h4>{activeSection === 'rights' ? 'How to exercise:' : 'What to do:'}</h4>
                                    <p>{item.procedure}</p>
                                </div>

                                <div className="rd-limits">
                                    <h4>{activeSection === 'rights' ? 'Limitations:' : 'Consequences:'}</h4>
                                    <p>{activeSection === 'rights' ? item.limits : item.consequences}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="rights-duties-container">
            <div className="rd-header">
                <div className="rd-header-icon">📝</div>
                <h2>Driver Rights & Responsibilities</h2>
                <p className="rd-subtitle">Know your rights and duties as a professional driver</p>
            </div>

            {renderTabs()}

            <div className="rd-content">
                {renderCards()}
            </div>

            <div className="rd-disclaimer">
                <div className="rd-disclaimer-icon">⚠️</div>
                <p>
                    This information is general guidance only and may vary by location.
                    Consult your local transportation authority or legal advisor for
                    regulations specific to your area.
                </p>
            </div>
        </div>
    );
};

export default TaxiDriverRightsDuties;