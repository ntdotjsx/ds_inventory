import './style.css'

const MAX_SLOTS = 25;
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
   <div class="inventory" id="inventory"></div>
`

const inventoryContainer = document.getElementById('inventory');

// สมมุติว่าเรามี array ของ items ที่เก็บข้อมูลไอเทม
const items = [
    { name: "Health Potion", count: 3 },
    { name: "Mana Potion", count: 2 },
    { name: "Sword", count: 1 },
];

// ฟังก์ชันเพื่อสร้างแต่ละ slot
function createSlot(i: number, item?: { name: string; count: number }) {
    const slot = document.createElement('div');
    slot.classList.add('slot');

    // ถ้ามีไอเทมในช่องนี้
    if (item && item.name !== "") {
        slot.innerText = `${item.name} x${item.count}`;
        slot.setAttribute('draggable', 'true');
        slot.addEventListener('dragstart', (e) => {
            // เก็บข้อมูลของไอเทมที่ลาก
            e.dataTransfer?.setData('text/plain', JSON.stringify({ index: i }));
        });
    } else {
        // ถ้าไม่มีไอเทมในช่องนี้ จะแสดง "Empty Slot"
        // slot.innerText = 'Empty Slot';
    }

    // เพิ่ม event listener สำหรับการวาง (drop) ไอเทม
    slot.addEventListener('dragover', (e) => {
        e.preventDefault(); // ทำให้สามารถวางได้
    });

    slot.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer?.getData('text/plain');
        if (data) {
            const draggedItem = JSON.parse(data);
            const draggedItemIndex = draggedItem.index;
            
            // ถ้าเป็น slot ที่ว่างอยู่ (Empty Slot)
            if (!item || item.name === "") {
                // เปลี่ยนข้อมูลของ slot นี้ให้มีไอเทมจากช่องที่ลากมา
                items[i] = items[draggedItemIndex];
                items[draggedItemIndex] = { name: "", count: 0 }; // เคลียร์ข้อมูลไอเทมในช่องต้นทาง
            }

            // รีเฟรช inventory เพื่ออัพเดต UI
            updateInventory();
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

// แสดงผลของ inventory
updateInventory();
