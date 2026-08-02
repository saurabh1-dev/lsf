import React from 'react';
import './Timeline.css';

/**
 * Single Glowing Event Card Component
 * Conforms exactly to the specified design requirements.
 */
export function TimelineCard({ time, title, description }) {
    return (
        <div className="timeline-card">
            <span className="timeline-badge">{time}</span>
            <h3 className="timeline-title">{title}</h3>
            <p className="timeline-desc">{description}</p>
            <div className="timeline-divider"></div>
        </div>
    );
}

/**
 * Main Reusable Timeline/Schedule Section Component
 * Accepts an array of events and maps them to glowing cards vertically.
 */
export default function Timeline({ events = [] }) {
    // Default fallback data if no events are passed
    const displayEvents = events.length > 0 ? events : [
        {
            time: "12:15 PM",
            title: "TEDX TALK 3",
            description: "Third speaker. Ideas keep building with groundbreaking security frameworks."
        },
        {
            time: "01:30 PM",
            title: "AUTOMATED THREAT SCANNING",
            description: "Fireside chat with industry-leading security analysts on AI intervention vectors."
        },
        {
            time: "03:00 PM",
            title: "CYBER DEPRECATING PATTERNS",
            description: "Reviewing legacy theme architectures and transition methodologies."
        }
    ];

    return (
        <section className="timeline-section">
            {/* Subtle corner vignettes and layout helper wrapper */}
            <div className="timeline-section-overlay"></div>

            <div className="timeline-container">
                {/* Glowing vertical connecting line to suggest a timeline flow */}
                <div className="timeline-line"></div>

                <div className="timeline-items">
                    {displayEvents.map((event, index) => (
                        <div key={index} className="timeline-item">
                            {/* Decorative connecting dot on the vertical line */}
                            <div className="timeline-dot"></div>

                            {/* Event Card */}
                            <TimelineCard
                                time={event.time}
                                title={event.title}
                                description={event.description}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
