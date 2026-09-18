import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { InventoryItem } from '../types';
import {
  Box,
  Shield,
  Trash2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Sparkles,
  Shuffle,
  Info,
  Check
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { selectedBot, botInventoryAction } = useBotContext();
  const [selectedSlotItem, setSelectedSlotItem] = useState<InventoryItem | null>(null);

  if (!selectedBot) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        No active bot selected. Please select a bot focus from the top bar.
      </div>
    );
  }

  // 36 standard inventory slots (0-8 hotbar, 9-35 main inventory)
  const itemsBySlot: Record<number, InventoryItem> = {};
  selectedBot.inventory.forEach(item => {
    itemsBySlot[item.slot] = item;
  });

  const armorSlots = [
    { name: 'Helmet', slot: 36, item: selectedBot.equipment.helmet, placeholder: '🪖' },
    { name: 'Chestplate', slot: 37, item: selectedBot.equipment.chestplate, placeholder: '🥋' },
    { name: 'Leggings', slot: 38, item: selectedBot.equipment.leggings, placeholder: '👖' },
    { name: 'Boots', slot: 39, item: selectedBot.equipment.boots, placeholder: '👢' }
  ];

  const offhandItem = selectedBot.equipment.offHand;

  const renderSlot = (slotIdx: number, isHotbar: boolean = false) => {
    const item = itemsBySlot[slotIdx];
    const isSelected = selectedSlotItem?.slot === slotIdx;

    return (
      <div
        key={slotIdx}
        onClick={() => item && setSelectedSlotItem(item)}
        className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center relative cursor-pointer select-none transition-all ${
          isSelected
            ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400'
            : item
            ? 'bg-[#152136] border-[#25395c] hover:border-cyan-500/60 hover:bg-[#1a2944]'
            : 'bg-[#0a0f1b] border-[#162238] hover:border-[#223555]'
        }`}
      >
        {isHotbar && (
          <span className="absolute top-0.5 left-1 text-[8px] font-mono text-slate-600 font-bold">
            {slotIdx + 1}
          </span>
        )}

        {item ? (
          <>
            <span className="text-base font-bold">
              {item.category === 'tool' ? '⛏' : item.category === 'weapon' ? '⚔' : item.category === 'food' ? '🍖' : item.category === 'armor' ? '🛡' : '📦'}
            </span>

            {item.count > 1 && (
              <span className="absolute bottom-0.5 right-1 text-[10px] font-mono font-bold text-white drop-shadow-md">
                {item.count}
              </span>
            )}

            {/* Durability bar */}
            {item.durability !== undefined && item.maxDurability !== undefined && (
              <div className="absolute bottom-0.5 left-1 right-1 h-1 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    item.durability / item.maxDurability > 0.5
                      ? 'bg-emerald-400'
                      : item.durability / item.maxDurability > 0.2
                      ? 'bg-amber-400'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${(item.durability / item.maxDurability) * 100}%` }}
                />
              </div>
            )}
          </>
        ) : null}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1b273d]">
        <div>
          <div className="flex items-center space-x-2">
            <Box className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
              MINECRAFT INVENTORY MANAGER
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-[#16233a] border border-[#243756] text-cyan-300 rounded">
              {selectedBot.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Full 36-slot container visualization, enchantments inspector, auto-sorting, and equipment management
          </p>
        </div>

        {/* Global Inventory Actions */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => botInventoryAction(selectedBot.id, 'sort')}
            className="px-3 py-1.5 bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-cyan-300 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Auto Sort</span>
          </button>
          <button
            onClick={() => botInventoryAction(selectedBot.id, 'deposit')}
            className="px-3 py-1.5 bg-[#142034] hover:bg-[#1c2c48] border border-[#233554] text-emerald-300 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Deposit Ores</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Inventory Left, Slot Inspector Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Authentic Minecraft GUI layout */}
        <div className="lg:col-span-2 bg-[#0d1424] border border-[#1b2840] rounded-xl p-6 shadow-2xl space-y-6">
          {/* Armor & Offhand Row */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Equipment Slots
            </div>
            <div className="flex items-center space-x-3">
              {armorSlots.map((arm, aIdx) => (
                <div
                  key={aIdx}
                  onClick={() => arm.item && setSelectedSlotItem(arm.item)}
                  className="w-14 h-14 rounded-lg bg-[#121c2e] border border-[#223352] flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 relative"
                >
                  <span className="text-lg opacity-80">{arm.placeholder}</span>
                  <span className="text-[8px] font-mono text-slate-500 absolute bottom-0.5">
                    {arm.name}
                  </span>
                </div>
              ))}

              <div className="w-px h-10 bg-slate-800 mx-2" />

              {/* Offhand */}
              <div
                onClick={() => offhandItem && setSelectedSlotItem(offhandItem)}
                className="w-14 h-14 rounded-lg bg-[#121c2e] border border-[#223352] flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 relative"
              >
                <span className="text-lg">🛡️</span>
                <span className="text-[8px] font-mono text-slate-500 absolute bottom-0.5">Offhand</span>
              </div>
            </div>
          </div>

          {/* Main 27-slot Inventory (3 rows of 9) */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Main Inventory (27 Slots)
            </div>
            <div className="grid grid-cols-9 gap-2">
              {Array.from({ length: 27 }, (_, i) => renderSlot(i + 9))}
            </div>
          </div>

          {/* 9-slot Hotbar */}
          <div className="pt-2 border-t border-[#17243b]">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Quick Hotbar (1 - 9)</span>
              <span className="text-slate-500 text-[10px]">Slot 1 is Active Hand</span>
            </div>
            <div className="grid grid-cols-9 gap-2">
              {Array.from({ length: 9 }, (_, i) => renderSlot(i, true))}
            </div>
          </div>
        </div>

        {/* Right Col: Item Inspector & Slot Actions */}
        <div className="space-y-6">
          <div className="bg-[#0e1627] border border-[#1b2942] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Item Detail & Modifiers</span>
            </h3>

            {selectedSlotItem ? (
              <div className="space-y-4 font-mono text-xs">
                {/* Item Name & Count */}
                <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1">
                  <div className="font-bold text-sm text-cyan-300">{selectedSlotItem.name}</div>
                  <div className="text-[11px] text-slate-400">
                    ID: {selectedSlotItem.id} • Stack: ×{selectedSlotItem.count}
                  </div>
                </div>

                {/* Durability */}
                {selectedSlotItem.durability !== undefined && selectedSlotItem.maxDurability !== undefined && (
                  <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1.5">
                    <div className="flex justify-between text-slate-300">
                      <span>Durability Remaining:</span>
                      <span className="text-emerald-400 font-bold">
                        {selectedSlotItem.durability} / {selectedSlotItem.maxDurability}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${(selectedSlotItem.durability / selectedSlotItem.maxDurability) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Enchantments */}
                {selectedSlotItem.enchantments && selectedSlotItem.enchantments.length > 0 && (
                  <div className="bg-[#121c2e] p-3 rounded-lg border border-[#1b2b45] space-y-1">
                    <div className="text-purple-300 font-bold flex items-center space-x-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Enchantments</span>
                    </div>
                    {selectedSlotItem.enchantments.map((ench, eIdx) => (
                      <div key={eIdx} className="text-[11px] text-slate-300">
                        • {ench.name} {ench.level}
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      botInventoryAction(selectedBot.id, 'drop', selectedSlotItem.slot);
                      setSelectedSlotItem(null);
                    }}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-center transition-colors"
                  >
                    Drop Stack
                  </button>
                  <button
                    onClick={() => {
                      botInventoryAction(selectedBot.id, 'trash', selectedSlotItem.slot);
                      setSelectedSlotItem(null);
                    }}
                    className="py-2 px-3 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 rounded-lg text-center transition-colors"
                  >
                    Trash Item
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 font-mono text-xs">
                Click any slot in the inventory to inspect durability, enchantments, or execute item actions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
