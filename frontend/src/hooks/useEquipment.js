import { useState, useEffect, useMemo } from 'react';
import { fetchAllEquipment } from '../services/equipmentService';

export const useEquipment = (token) => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const loadEquipment = async () => {
            try {
                setLoading(true);
                const data = await fetchAllEquipment(token);
                setEquipment(data);
            } catch (err) {
                console.error("Failed to fetch equipment", err);
            } finally {
                setLoading(false);
            }
        };

        loadEquipment();
    }, [token]);

    const filteredEquipment = useMemo(() => {
        return equipment.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = categoryFilter === 'All'
                ? true
                : categoryFilter === 'Sports'
                    ? !['pubg', 'ff', 'cod', 'esports'].includes(item.category.toLowerCase())
                    : ['pubg', 'ff', 'cod', 'esports'].includes(item.category.toLowerCase());

            return matchesSearch && matchesCategory;
        });
    }, [equipment, searchTerm, categoryFilter]);

    return {
        equipment,
        filteredEquipment,
        loading,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        refreshEquipment: async () => {
            const data = await fetchAllEquipment(token);
            setEquipment(data);
        }
    };
};
