'use client';

import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';

const EvaluationForm = ({ playerId, playerName, onSubmit, sport }) => {
    const [ratings, setRatings] = useState({
        stamina: 5,
        technique: 5,
        teamwork: 5,
        speed: 5
    });
    const [remarks, setRemarks] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleRatingChange = (skill, value) => {
        setRatings(prev => ({ ...prev, [skill]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit({
                player_id: playerId,
                sport,
                ...ratings,
                remarks
            });
            setRemarks('');
        } catch (error) {
            console.error('Evaluation submission failed:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const SkillSlider = ({ label, value, onChange, name }) => (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 capitalize">{label}</label>
                <span className="text-sm font-semibold text-indigo-600">{value}/10</span>
            </div>
            <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={value}
                onChange={(e) => onChange(name, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Evaluate {playerName}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <SkillSlider label="Stamina" name="stamina" value={ratings.stamina} onChange={handleRatingChange} />
                <SkillSlider label="Technique" name="technique" value={ratings.technique} onChange={handleRatingChange} />
                <SkillSlider label="Teamwork" name="teamwork" value={ratings.teamwork} onChange={handleRatingChange} />
                <SkillSlider label="Speed" name="speed" value={ratings.speed} onChange={handleRatingChange} />
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-24"
                    placeholder="Provide constructive feedback..."
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
                {submitting ? 'Submitting...' : (
                    <>
                        <Send size={18} />
                        Submit Evaluation
                    </>
                )}
            </button>
        </form>
    );
};

export default EvaluationForm;
