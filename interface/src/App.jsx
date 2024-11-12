import React, { useState, useEffect } from 'react';
import $ from 'jquery';

const MAX_SLOTS = 48;
const closeKeys = [27, 84];

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [isInventoryOpen, setInventoryOpen] = useState(false);

  useEffect(() => {
    // รับข้อมูลจาก FiveM ผ่าน NUI
    const handleMessage = (event) => {
      if (event.data.action === 'showinventory') {
        setItems(event.data.itemList || []);
        setInventoryOpen(true);
      }
      if (event.data.type === 'normal') {
        setInventoryOpen(true);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const useItem = (index) => {
    const item = items[index];
    if (item) {
      // ส่งคำสั่งไปยัง Lua เพื่อใช้ไอเท็ม
      $.post('http://Dust_Inventory/UseItem', JSON.stringify({ itemName: item.name }));
    }
  };

  const closeInventory = () => {
    $.post('http://Dust_Inventory/NUIFocusOff', JSON.stringify({ type: 'normal' }));
    setInventoryOpen(false);
  };

  const handleKeyup = (event) => {
    if (closeKeys.includes(event.keyCode)) {
      closeInventory();
    }
  };

  useEffect(() => {
    // ฟังการกดปุ่ม เพื่อปิด UI
    document.body.addEventListener('keyup', handleKeyup);

    return () => {
      document.body.removeEventListener('keyup', handleKeyup);
    };
  }, []);

  const createSlot = (i, item) => {
    return (
      <div className="item-slot" key={i} draggable onDragStart={(e) => e.dataTransfer?.setData('text/plain', JSON.stringify({ index: i }))}>
        {item && item.name !== '' && (
          <>
            <img src={`/img/items/${item.name}.png`} alt={item.name} className="item-image" />
            <div className="quantity">x{item.count}</div>
            <button onClick={() => useItem(i)} className="use-button">Use</button>
          </>
        )}
      </div>
    );
  };

  const updateInventory = () => {
    return [...Array(MAX_SLOTS).keys()].map((i) => {
      return createSlot(i, items[i] && items[i].name !== '' ? items[i] : undefined);
    });
  };

  return (
    <div className="inventory-wrapper" id="wrapper" style={{ display: isInventoryOpen ? 'flex' : 'none' }}>
      <div className="sidebar">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="sidebar-item">{i + 1}</div>
        ))}
      </div>

      <div className="inventory-content">
        <div className="inventory-header">
          <h1 className="inventory-title">INVENTORY</h1>
          <span className="player-name">[Player Name]</span>
        </div>
        <div className="inventory-container" id="inventory">
          {updateInventory()}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
