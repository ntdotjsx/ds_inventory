import './style.css';
import $ from 'jquery';

const MAX_SLOTS = 25;
const closeKeys = [27, 84];

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
   <div class="inventory-container" id="inventory" style="display: none;"></div>
`;

const inventoryContainer = document.getElementById('inventory');

let items = [] as { name: string, count: number }[]; // กำหนดให้ items เป็น array ว่างก่อน

// ฟังก์ชันเพื่อสร้างแต่ละ slot
function createSlot(i: number, item?: { name: string; count: number }) {
    const slot = document.createElement('div');
    slot.classList.add('item-slot');

    // ถ้ามีไอเทมในช่องนี้
    if (item && item.name !== "") {
        slot.innerText = `${item.name}`;
        slot.setAttribute('draggable', 'true');

        const quantity = document.createElement('div');
        quantity.classList.add('quantity');
        quantity.innerText = `x${item.count}`;
        slot.appendChild(quantity);

        slot.addEventListener('dragstart', (e) => {
            // เก็บข้อมูลของไอเทมที่ลาก
            e.dataTransfer?.setData('text/plain', JSON.stringify({ index: i }));
        });
    }

    // เพิ่ม event listener สำหรับการวาง (drop) ไอเทม
    slot.addEventListener('dragover', (e) => {
        e.preventDefault(); // ทำให้สามารถวางได้

        // ถ้าคือช่องที่มีไอเทมหรือช่องที่ว่าง ไม่สามารถวางได้
        if (!item || item.name === "") {
            e.stopPropagation(); // หยุดการไหลของ event ถ้าช่องว่าง (Empty Slot)
        }
    });

    slot.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer?.getData('text/plain');
        if (data) {
            // const draggedItem = JSON.parse(data);
            // const draggedItemIndex = draggedItem.index;

            // ถ้า slot ปลายทางไม่มีไอเทม (Empty Slot) หรือช่องว่าง
            if (!item || item.name === "") {
                e.stopPropagation(); // หยุดการทำงานไม่ให้ทำการวาง
            }
        }
    });

    return slot;
}

// ฟังก์ชันเพื่อรีเฟรชการแสดงผลของ inventory
function updateInventory() {
    inventoryContainer!.innerHTML = ''; // ลบสิ่งที่มีอยู่ใน inventory
    for (let i = 0; i < MAX_SLOTS; i++) {
        // ถ้า items[i] ไม่มีข้อมูล (empty slot) ก็จะเป็นช่องว่าง
        const slot = createSlot(i, items[i] && items[i].name !== "" ? items[i] : undefined);
        inventoryContainer?.appendChild(slot);
    }
}

// ส่งคำสั่งไปยัง Lua เพื่อปิดกระเป๋า
function closeInventory() {
    $.post("http://Dust_Inventory/NUIFocusOff", JSON.stringify({
        type: "normal"
    }));
    inventoryContainer!.style.display = 'none'; // ซ่อน UI เมื่อปิด
}

// ฟังการกดปุ่ม ESC เพื่อปิด UI
$("body").on("keyup", function (key) {
    if (closeKeys.includes(key.which)) {
        closeInventory();
    }
});

// รับข้อมูลจาก FiveM ผ่าน NUI
window.addEventListener('message', (event) => {
    if (event.data.action === 'showinventory') {
        // เมื่อได้รับคำสั่ง "showinventory", อัปเดตไอเทมและแสดง UI
        items = event.data.itemList || []; // รับข้อมูล itemList จาก FiveM
        updateInventory(); // รีเฟรชการแสดงผล

        // แสดง inventory-container
        inventoryContainer!.style.display = 'grid'; // ทำให้ inventory-container แสดงขึ้น
    }
});

// แสดงผลของ inventory (ตอนเริ่มต้นอาจจะซ่อนอยู่)
updateInventory();
