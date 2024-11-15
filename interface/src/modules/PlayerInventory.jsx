import React, { useEffect } from 'react';
import '../functions/inventory'
import KeySlot from './KeySlot';
import { updateInventory } from '../functions/inventory';

export default function PlayerInventory() {
    useEffect(() => {
        updateInventory();
    }, []);
    return (
        <>

            <div className="inventory-wrapper" id="wrapper">
                <div className="outside">
                    <div className="sidebar">
                        <div className="sidebar-item" data-slot="1">1</div>
                        <div className="sidebar-item" data-slot="2">2</div>
                        <div className="sidebar-item" data-slot="3">3</div>
                        <div className="sidebar-item" data-slot="4">4</div>
                        <div className="sidebar-item" data-slot="5">5</div>
                        <div className="sidebar-item" data-slot="6">6</div>
                        <div className="sidebar-item" data-slot="7">7</div>
                        <div className="fast-change">
                            <button>ซ้าย</button>
                            <input className='fast-change-input' type="number" />
                            <button>ขวา</button>
                        </div>
                    </div>
                </div>

                <div className="inventory-content">
                    <div className="inventory-header">
                        <h1 className="inventory-title">INVENTORY</h1>
                        <span className="player-name">ช่องเก็บของ [Nutto Donovanly]</span>
                    </div>
                    <div className="main-container">
                        <div className="inventory-container" id="inventory"> </div>
                        <KeySlot />
                    </div>
                    <div className="inventory-footer">
                        <h1 className="inventory-title">EasyStore</h1>
                    </div>

                </div>
            </div>

            <div className="tooltip" id="tooltip"></div>
        </>
    )
}