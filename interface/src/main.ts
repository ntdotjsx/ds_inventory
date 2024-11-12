import './style.css';
import $ from 'jquery';

const MAX_SLOTS = 48;
const closeKeys = [27, 84];

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
   <div class="inventory-wrapper" id="wrapper">
    <div class="sidebar">
        <div class="sidebar-item">1</div>
        <div class="sidebar-item">2</div>
        <div class="sidebar-item">3</div>
        <div class="sidebar-item">4</div>
        <div class="sidebar-item">5</div>
        <div class="sidebar-item">6</div>
        <div class="sidebar-item">7</div>
    </div>

    <div class="inventory-content">
        <div class="inventory-header">
            <h1 class="inventory-title">INVENTORY</h1>
            <span class="player-name">[Player Name]</span>
        </div>
        <div class="inventory-container" id="inventory"></div>
    </div>
</div>
`;

const inventoryContainer = document.getElementById('inventory');
const inventoryWrapper = document.getElementById('wrapper');

let items = [] as { name: string, count: number }[]; // กำหนดให้ items เป็น array ว่างก่อน

// ฟังก์ชันเพื่อสร้างแต่ละ slot
function createSlot(i: number, item?: { name: string; count: number }) {
    const slot = document.createElement('div');
    slot.classList.add('item-slot');

    // ถ้ามีไอเทมในช่องนี้
    if (item && item.name !== "") {
        const img = document.createElement('img');
        img.src = `/img/items/${item.name}.png`;
        img.alt = item.name;
        img.classList.add('item-image'); // กำหนดคลาสเพื่อใช้กับ CSS ถ้าต้องการ

        slot.appendChild(img); // เพิ่มรูปภาพเข้าไปใน slot
        slot.setAttribute('draggable', 'true');

        const quantity = document.createElement('div');
        quantity.classList.add('quantity');
        quantity.innerText = `x${item.count}`;
        slot.appendChild(quantity);

        // เพิ่ม event listener สำหรับการลาก (drag) ไอเทม
        slot.addEventListener('dragstart', (e) => {
            e.dataTransfer?.setData('text/plain', JSON.stringify({ index: i }));
        });

        // ฟังก์ชันการแสดง context menu เมื่อคลิกขวาที่ item
        slot.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            // เปลี่ยนเนื้อหาของ slot เป็นปุ่ม "Use"
            slot.innerHTML = `<button class="use-button">Use</button>`;

            // ฟังก์ชันเมื่อกดปุ่ม Use
            slot.querySelector('.use-button')?.addEventListener('click', () => {
                useItem(i); // เรียกใช้ฟังก์ชัน useItem
                updateInventory(); // รีเฟรชการแสดงผลของ inventory
            });

            // ลบเมนูเมื่อคลิกที่ส่วนอื่นๆ
            document.addEventListener('click', () => {
                updateInventory(); // รีเฟรชเมื่อคลิกที่ส่วนอื่น
            }, { once: true });
        });
    }

    return slot;
}

// ฟังก์ชันเมื่อกดปุ่ม Use
function useItem(index: number) {
    const item = items[index];
    if (item) {
        // console.log(`Using item: ${item.name}`);
        $.post("http://Dust_Inventory/UseItem", JSON.stringify({ itemName: item.name }));
    }
}

// ฟังก์ชันเพื่อรีเฟรชการแสดงผลของ inventory
function updateInventory() {
    inventoryContainer!.innerHTML = ''; // ลบสิ่งที่มีอยู่ใน inventory
    for (let i = 0; i < MAX_SLOTS; i++) {
        const slot = createSlot(i, items[i] && items[i].name !== "" ? items[i] : undefined);
        inventoryContainer?.appendChild(slot);
    }
}

// ส่งคำสั่งไปยัง Lua เพื่อปิดกระเป๋า
function closeInventory() {
    $.post("http://Dust_Inventory/NUIFocusOff", JSON.stringify({
        type: "normal"
    }));
    inventoryContainer!.style.display = 'none';
    inventoryWrapper!.style.display = 'none';
}

// ฟังการกดปุ่ม เพื่อปิด UI
$("body").on("keyup", function (key) {
    if (closeKeys.includes(key.which)) {
        closeInventory();
    }
});

// รับข้อมูลจาก FiveM ผ่าน NUI
window.addEventListener('message', (event) => {
    if (event.data.action === 'showinventory') {
        items = event.data.itemList || [];
        updateInventory();

        inventoryContainer!.style.display = 'grid';
    }
    if (event.data.type === "normal") {
        inventoryWrapper!.style.display = 'flex';
    }
});

updateInventory();
