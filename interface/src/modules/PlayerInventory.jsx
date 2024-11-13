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
                    <div className="sidebar-item">1</div>
                    <div className="sidebar-item">2</div>
                    <div className="sidebar-item">3</div>
                    <div className="sidebar-item">4</div>
                    <div className="sidebar-item">5</div>
                    <div className="sidebar-item">6</div>
                    <div className="sidebar-item">7</div>
                </div>

                <div className="inventory-content">
                    <div className="inventory-header">
                        <h1 className="inventory-title">INVENTORY</h1>
                        <span className="player-name">[Player Name]</span>
                    </div>
                    <div className="inventory-container" id="inventory"></div>
                </div>
            </div>

            <div className="tooltip" id="tooltip"></div>
        </>
    )
}