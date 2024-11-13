import React, { useEffect } from 'react';
import '../functions/inventory'
import { updateInventory } from '../functions/inventory';

export default function PlayerInventory() {
    useEffect(() => {
        updateInventory();
    }, []);
    return (
        <>

            <div className="inventory-wrapper" id="wrapper">
                <div className="sidebar">
                    <div className="sidebar-item" data-slot="1">1</div>
                    <div className="sidebar-item" data-slot="2">2</div>
                    <div className="sidebar-item" data-slot="3">3</div>
                    <div className="sidebar-item" data-slot="4">4</div>
                    <div className="sidebar-item" data-slot="5">5</div>
                    <div className="sidebar-item" data-slot="6">6</div>
                    <div className="sidebar-item" data-slot="7">7</div>
                </div>

                <div className="inventory-content">
                    <div className="inventory-header">
                        <h1 className="inventory-title">INVENTORY</h1>
                        <span className="player-name">[Player Name]</span>
                    </div>
                    <div className="inventory-container" id="inventory">
                        <div className="key-container" id="keySlot"></div>
                    </div>

                    <div className="inventory-footer">
                        <h1 className="inventory-title">DustCity</h1>
                    </div>
                </div>
            </div>

            <div className="tooltip" id="tooltip"></div>
        </>
    )
}