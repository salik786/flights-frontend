import React, { useState, useEffect, useRef } from 'react';
import './TaxiDriverHealth.css';

const TaxiDriverHealth = () => {
    const [activeCategory, setActiveCategory] = useState('body');
    const [highlightedTip, setHighlightedTip] = useState(null);
    const carouselRef = useRef(null);
    const [carouselWidth, setCarouselWidth] = useState(0);
    const [visibleSlide, setVisibleSlide] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            setCarouselWidth(carouselRef.current.offsetWidth);

            const handleResize = () => {
                setCarouselWidth(carouselRef.current.offsetWidth);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [carouselRef]);

    // Reset visible slide when category changes
    useEffect(() => {
        setVisibleSlide(0);
    }, [activeCategory]);

    // Health categories and related tips
    const healthData = {
        body: {
            icon: '💪',
            title: 'Physical Wellbeing',
            color: '#4361ee',
            darkColor: '#3a56d4',
            tips: [
                {
                    id: 'posture',
                    title: 'Posture Perfection',
                    emoji: '🪑',
                    summary: 'Perfect your driving position to reduce back strain',
                    content: [
                        {
                            type: 'checklist',
                            items: [
                                'Adjust seat height so hips are level with knees',
                                'Position steering wheel to keep arms slightly bent',
                                'Use a lumbar cushion to support lower back curve',
                                'Keep shoulders relaxed against the seat back'
                            ]
                        },
                        {
                            type: 'quick-action',
                            text: 'Do the "two-finger test" - you should be able to slip two fingers between the back of your knees and the seat'
                        },
                        {
                            type: 'reminder',
                            text: 'Every two hours: Roll shoulders backward 5 times while waiting at lights'
                        }
                    ]
                },
                {
                    id: 'stretch',
                    title: '5-Minute Stretches',
                    emoji: '🧘‍♂️',
                    summary: 'Quick stretches you can do in or beside your taxi',
                    content: [
                        {
                            type: 'sequence',
                            items: [
                                'Neck Release: Gently tilt ear toward shoulder, hold 10s each side',
                                'Wrist Flex: Extend arm, gently pull fingers back, hold 15s each hand',
                                'Seated Twist: Hand on opposite knee, rotate spine, look behind, 10s each side',
                                'Hamstring Stretch: Extended leg, lean forward slightly, 15s each side'
                            ]
                        },
                        {
                            type: 'quotation',
                            text: 'Even a short stretch breaks the cycle of seated tension'
                        },
                        {
                            type: 'reminder',
                            text: 'Set a reminder on your phone for stretch breaks during low-demand periods'
                        }
                    ]
                },
                {
                    id: 'sight',
                    title: 'Eye Care',
                    emoji: '👁️',
                    summary: 'Protect your vision during long shifts',
                    content: [
                        {
                            type: 'steps',
                            items: [
                                'Follow 20-20-20 rule: Every 20 minutes, look 20 feet away for 20 seconds',
                                'Keep sunglasses within easy reach for sudden bright conditions',
                                'Adjust mirrors to minimize direct glare but maximize visibility',
                                'Use night mode on your dispatch screen during evening shifts'
                            ]
                        },
                        {
                            type: 'quick-action',
                            text: 'Blink deliberately and fully when your eyes feel dry'
                        },
                        {
                            type: 'reminder',
                            text: 'Get an annual eye exam - many vision problems develop gradually'
                        }
                    ]
                }
            ]
        },
        food: {
            icon: '🍎',
            title: 'Nutrition & Hydration',
            color: '#f72585',
            darkColor: '#e61d7a',
            tips: [
                {
                    id: 'quick-meals',
                    title: 'Shift-Friendly Foods',
                    emoji: '🍱',
                    summary: 'Meals and snacks that work on the road',
                    content: [
                        {
                            type: 'grid-list',
                            title: 'One-Handed Foods',
                            items: [
                                'Protein wraps (pre-cut into manageable sections)',
                                'Hard-boiled eggs (peeled ahead of time)',
                                'Fruit with edible skin (apples, pears, plums)',
                                'Veggie sticks with single-serve hummus',
                                'Nuts and seeds in portioned containers',
                                'Greek yogurt cups with granola packets'
                            ]
                        },
                        {
                            type: 'highlight',
                            text: 'Prep a week of taxi-friendly lunches in stackable containers on Sunday'
                        },
                        {
                            type: 'quick-action',
                            text: 'Map health-conscious grab-and-go spots along your regular routes'
                        }
                    ]
                },
                {
                    id: 'hydration',
                    title: 'Smart Hydration',
                    emoji: '💧',
                    summary: 'Stay hydrated without constant restroom stops',
                    content: [
                        {
                            type: 'tips',
                            items: [
                                'Front-load water intake in the morning before your shift',
                                'Sip consistently rather than gulping occasionally',
                                'Use marked water bottle to track daily intake',
                                'Limit caffeine after 2pm to prevent dehydration',
                                'Choose hydrating fruits (oranges, grapes) as snacks'
                            ]
                        },
                        {
                            type: 'alert',
                            text: 'Thirst is a late sign of dehydration - aim to drink before feeling thirsty'
                        },
                        {
                            type: 'quick-action',
                            text: 'Keep a route map of reliable public restrooms and driver facilities'
                        }
                    ]
                },
                {
                    id: 'energy',
                    title: 'Natural Energy Boosters',
                    emoji: '⚡',
                    summary: 'Avoid energy crashes during long shifts',
                    content: [
                        {
                            type: 'checklist',
                            items: [
                                'Pair protein with complex carbs (apple + cheese, crackers + tuna)',
                                'Choose low-glycemic snacks that wont spike blood sugar',
                                'Try cinnamon on food - it helps regulate blood sugar levels',
                                'Keep frozen grapes for a refreshing, sweet energy boost',
                                'Use peppermint tea or essential oil for mental alertness'
                            ]
                        },
                        {
                            type: 'highlight',
                            text: 'A 10-minute power nap can be more effective than caffeine for alertness'
                        },
                        {
                            type: 'reminder',
                            text: 'The mid-afternoon energy crash is real - plan your nutrition around it'
                        }
                    ]
                }
            ]
        },
        mind: {
            icon: '🧠',
            title: 'Mental Wellness',
            color: '#4cc9f0',
            darkColor: '#38b6dc',
            tips: [
                {
                    id: 'stress',
                    title: 'Traffic Stress Relief',
                    emoji: '😌',
                    summary: 'Techniques to stay calm behind the wheel',
                    content: [
                        {
                            type: 'steps',
                            items: [
                                'Box Breathing: Inhale 4 counts, hold 4, exhale 4, hold 4, repeat',
                                'Tension Release: Tighten then release muscle groups while stopped',
                                'Perspective Shift: "Will this matter in one week?"',
                                'Audio Escape: Keep a playlist of calming music ready'
                            ]
                        },
                        {
                            type: 'quotation',
                            text: 'You cannot control traffic, but you can control your response to it'
                        },
                        {
                            type: 'quick-action',
                            text: 'When frustrated, find five red objects around you - this mental redirect breaks stress cycles'
                        }
                    ]
                },
                {
                    id: 'brain',
                    title: 'Brain Engagement',
                    emoji: '🎧',
                    summary: 'Keep your mind active during monotonous shifts',
                    content: [
                        {
                            type: 'tips',
                            items: [
                                'Rotate between podcasts, audiobooks, and music to stimulate different parts of your brain',
                                'Try language learning audio lessons during quiet periods',
                                'Practice mental math with numbers on license plates',
                                'Create mental "routes" through your hometown to strengthen spatial memory'
                            ]
                        },
                        {
                            type: 'highlight',
                            text: 'Learning while driving turns "wasted" time into productive time'
                        },
                        {
                            type: 'quick-action',
                            text: 'Subscribe to daily 5-minute news or educational podcasts for quick mental workouts'
                        }
                    ]
                },
                {
                    id: 'social',
                    title: 'Social Connection',
                    emoji: '👥',
                    summary: 'Combat isolation on the job',
                    content: [
                        {
                            type: 'checklist',
                            items: [
                                'Schedule regular calls with family/friends during breaks',
                                'Join online or local driver communities to share experiences',
                                'Establish relationships with other regulars at taxi stands',
                                'Participate in driver meetups or social events when possible'
                            ]
                        },
                        {
                            type: 'alert',
                            text: 'Social isolation affects physical health - connection is as important as exercise'
                        },
                        {
                            type: 'reminder',
                            text: 'Balance passenger interaction energy - match their conversation level rather than forcing talk'
                        }
                    ]
                }
            ]
        },
        sleep: {
            icon: '😴',
            title: 'Rest & Recovery',
            color: '#7209b7',
            darkColor: '#6608a5',
            tips: [
                {
                    id: 'sleep-schedule',
                    title: 'Shift-Proof Sleep',
                    emoji: '🛌',
                    summary: 'Quality sleep despite irregular hours',
                    content: [
                        {
                            type: 'steps',
                            items: [
                                'Create a consistent pre-sleep routine regardless of time',
                                'Use blackout curtains and white noise for daytime sleeping',
                                'Avoid screens 1 hour before bed (use blue light filters if necessary)',
                                'Keep bedroom cool (65-68°F/18-20°C) for optimal sleep'
                            ]
                        },
                        {
                            type: 'highlight',
                            text: 'Consistency trumps timing - a regular routine signals your brain its time to sleep'
                        },
                        {
                            type: 'quick-action',
                            text: 'Download a sleep cycle app to wake you during light sleep phases'
                        }
                    ]
                },
                {
                    id: 'fatigue',
                    title: 'Fatigue Management',
                    emoji: '⚠️',
                    summary: 'Recognize and address drowsiness',
                    content: [
                        {
                            type: 'alert-list',
                            items: [
                                'Warning Signs: Yawning, heavy eyelids, drifting lanes, missing exits',
                                'Immediate Action: Pull over in a safe spot for a 20-minute power nap',
                                'Prevention: 10-minute breaks every 2 hours, even if not tired',
                                'Temporary Fixes: Cold air, stretching, energizing music (NOT reliable for long)'
                            ]
                        },
                        {
                            type: 'alert',
                            text: 'Microsleeps can occur without you realizing - if you are questioning your alertness, you are already impaired'
                        },
                        {
                            type: 'reminder',
                            text: 'No fare is worth your life or others - recognize when to call it a day'
                        }
                    ]
                },
                {
                    id: 'recovery',
                    title: 'Active Recovery',
                    emoji: '🔄',
                    summary: 'Bounce back between demanding shifts',
                    content: [
                        {
                            type: 'tips',
                            items: [
                                'Schedule short walks after long drives to reset your body',
                                'Use foam rollers or tennis balls to release back tension',
                                'Try contrast showers (alternating hot and cold) to improve circulation',
                                'Spend time in nature on days off to reduce mental fatigue'
                            ]
                        },
                        {
                            type: 'quotation',
                            text: 'Recovery is not just the absence of work, but active restoration'
                        },
                        {
                            type: 'quick-action',
                            text: 'Create a 10-minute post-shift stretching routine to signal the workday is done'
                        }
                    ]
                }
            ]
        }
    };

    // Get the current category data
    const currentCategory = healthData[activeCategory];

    // Handle category click
    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setVisibleSlide(0);
        setHighlightedTip(null);
    };

    // Handle next slide click
    const handleNextSlide = () => {
        if (visibleSlide < currentCategory.tips.length - 1) {
            setVisibleSlide(visibleSlide + 1);
        }
    };

    // Handle previous slide click
    const handlePrevSlide = () => {
        if (visibleSlide > 0) {
            setVisibleSlide(visibleSlide - 1);
        }
    };

    // Render categories tab menu
    const renderCategories = () => {
        return (
            <div className="taxi-health-categories">
                {Object.keys(healthData).map(category => (
                    <button
                        key={category}
                        className={`category-button ${activeCategory === category ? 'active' : ''}`}
                        style={{
                            '--category-color': healthData[category].color,
                            '--category-dark-color': healthData[category].darkColor
                        }}
                        onClick={() => handleCategoryClick(category)}
                    >
                        <span className="category-icon">{healthData[category].icon}</span>
                        <span className="category-name">{healthData[category].title}</span>
                    </button>
                ))}
            </div>
        );
    };

    // Render the tip content based on type
    const renderTipContent = (content) => {
        return content.map((item, index) => {
            switch (item.type) {
                case 'checklist':
                    return (
                        <div key={index} className="tip-checklist">
                            <ul>
                                {item.items.map((checkItem, i) => (
                                    <li key={i}>{checkItem}</li>
                                ))}
                            </ul>
                        </div>
                    );
                case 'steps':
                    return (
                        <div key={index} className="tip-steps">
                            <ol>
                                {item.items.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    );
                case 'tips':
                    return (
                        <div key={index} className="tip-list">
                            <ul>
                                {item.items.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    );
                case 'grid-list':
                    return (
                        <div key={index} className="tip-grid-list">
                            {item.title && <h4>{item.title}</h4>}
                            <div className="grid-items">
                                {item.items.map((gridItem, i) => (
                                    <div key={i} className="grid-item">{gridItem}</div>
                                ))}
                            </div>
                        </div>
                    );
                case 'alert-list':
                    return (
                        <div key={index} className="tip-alert-list">
                            {item.items.map((alertItem, i) => (
                                <div key={i} className="alert-item">
                                    <div className="alert-marker"></div>
                                    <div className="alert-content">{alertItem}</div>
                                </div>
                            ))}
                        </div>
                    );
                case 'sequence':
                    return (
                        <div key={index} className="tip-sequence">
                            {item.items.map((seqItem, i) => (
                                <div key={i} className="sequence-item">
                                    <div className="sequence-number">{i + 1}</div>
                                    <div className="sequence-content">{seqItem}</div>
                                </div>
                            ))}
                        </div>
                    );
                case 'highlight':
                    return (
                        <div key={index} className="tip-highlight">
                            <div className="highlight-content">{item.text}</div>
                        </div>
                    );
                case 'alert':
                    return (
                        <div key={index} className="tip-alert">
                            <div className="alert-icon">⚠️</div>
                            <div className="alert-content">{item.text}</div>
                        </div>
                    );
                case 'quotation':
                    return (
                        <div key={index} className="tip-quote">
                            <div className="quote-icon">"</div>
                            <div className="quote-content">{item.text}</div>
                        </div>
                    );
                case 'quick-action':
                    return (
                        <div key={index} className="tip-quick-action">
                            <div className="quick-action-icon">🔥</div>
                            <div className="quick-action-label">Quick Action</div>
                            <div className="quick-action-content">{item.text}</div>
                        </div>
                    );
                case 'reminder':
                    return (
                        <div key={index} className="tip-reminder">
                            <div className="reminder-icon">⏰</div>
                            <div className="reminder-content">{item.text}</div>
                        </div>
                    );
                default:
                    return <p key={index}>{item.text}</p>;
            }
        });
    };

    // Render mini navigation for current category
    const renderMiniNav = () => {
        return (
            <div className="mini-nav" style={{ '--active-color': currentCategory.color }}>
                {currentCategory.tips.map((tip, index) => (
                    <button
                        key={index}
                        className={`mini-nav-item ${visibleSlide === index ? 'active' : ''}`}
                        onClick={() => setVisibleSlide(index)}
                    >
                        <span className="mini-nav-emoji">{tip.emoji}</span>
                    </button>
                ))}
            </div>
        );
    };

    // Render the current slide
    const renderSlides = () => {
        // Get current tip
        const tip = currentCategory.tips[visibleSlide];

        if (!tip) {
            console.error("No tip found for index:", visibleSlide, "in category:", activeCategory);
            return <div className="tip-slide">No tip content available</div>;
        }

        return (
            <div
                className="tip-slide"
                style={{
                    '--tip-color': currentCategory.color
                }}
            >
                <div className="tip-header">
                    <div className="tip-emoji">{tip.emoji}</div>
                    <div className="tip-title-container">
                        <h3 className="tip-title">{tip.title}</h3>
                        <p className="tip-summary">{tip.summary}</p>
                    </div>
                </div>
                <div className="tip-content">
                    {renderTipContent(tip.content)}
                </div>
            </div>
        );
    };

    // Render the carousel
    const renderCarousel = () => {
        return (
            <div className="taxi-health-carousel">
                <div className="carousel-controls">
                    {renderMiniNav()}
                    <div className="control-buttons">
                        <button
                            className="control-button prev"
                            onClick={handlePrevSlide}
                            disabled={visibleSlide === 0}
                        >
                            ←
                        </button>
                        <div className="slide-indicator">
                            {visibleSlide + 1}/{currentCategory.tips.length}
                        </div>
                        <button
                            className="control-button next"
                            onClick={handleNextSlide}
                            disabled={visibleSlide === currentCategory.tips.length - 1}
                        >
                            →
                        </button>
                    </div>
                </div>
                <div className="carousel-container" ref={carouselRef}>
                    {renderSlides()}
                </div>
            </div>
        );
    };

    return (
        <div className="modern-taxi-health-container">
            {/* <div className="taxi-health-header">
                <div className="header-content">
                    <div className="taxi-icon">🚕</div>
                    <h2>Driver Wellness Hub</h2>
                    <p className="tagline">Science-backed strategies for long-haul health</p>
                </div>
                <div className="health-decoration">
                    <div className="decoration-circle c1"></div>
                    <div className="decoration-circle c2"></div>
                    <div className="decoration-circle c3"></div>
                </div>
            </div> */}

            {renderCategories()}

            <div className="taxi-health-content">
                <div className="content-header" style={{ '--header-color': currentCategory.color }}>
                    <div className="content-icon">{currentCategory.icon}</div>
                    <h3>{currentCategory.title}</h3>
                </div>

                {renderCarousel()}
            </div>

            <div className="taxi-health-footer">
                <p>These tips are designed for taxi drivers but are not medical advice. Consult healthcare professionals for personal health concerns.</p>
            </div>
        </div>
    );
};

export default TaxiDriverHealth;