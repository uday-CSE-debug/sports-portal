import React from 'react';
import { Package } from 'lucide-react';
import { CategoryIcon } from '../ui/CategoryIcon';

/**
 * @param {Object} props
 * @param {Array} props.equipment
 * @param {Function} props.onReserve
 */
const EquipmentGrid = ({ equipment, onReserve }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {equipment.map((item) => (
                <div key={item.id} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
                    <div className="flex justify-between items-start mb-10">
                        <div className="bg-gray-50 p-4 rounded-[24px] group-hover:bg-primary/5 transition-colors">
                            <CategoryIcon category={item.category} className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-black text-foreground tracking-tighter">{item.available_quantity.toString().padStart(2, '0')}</div>
                            <div className="text-[10px] font-black text-muted uppercase tracking-widest">Available</div>
                        </div>
                    </div>

                    <div className="flex-grow">
                        <h3 className="text-3xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-muted text-sm font-medium leading-relaxed mb-10 h-10 overflow-hidden">{item.description || "Top-tier equipment for competitive play."}</p>
                    </div>

                    <button
                        onClick={() => onReserve(item)}
                        disabled={item.available_quantity === 0}
                        className="w-full bg-primary text-white py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all shadow-xl disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
                    >
                        {item.available_quantity > 0 ? 'Reserve Gear' : 'Out of Stock'}
                    </button>
                </div>
            ))}

            {equipment.length === 0 && (
                <div className="col-span-full py-32 text-center rounded-[48px] border-2 border-dashed border-gray-100">
                    <Package className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-gray-400">Inventory Empty</h3>
                </div>
            )}
        </div>
    );
};

export default EquipmentGrid;
