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
    // สามารถเพิ่มไอเทมอื่นๆ ได้
];

// สร้าง slot ตามจำนวน MAX_SLOTS
for (let i = 0; i < MAX_SLOTS; i++) {
    const slot = document.createElement('div');
    slot.classList.add('slot');
    
    // ตรวจสอบว่ามีไอเทมในช่องนี้หรือไม่
    if (i < items.length) {
        const item = items[i];
        slot.innerText = `${item.name} x${item.count}`;  // แสดงชื่อและจำนวนของไอเทม
    } else {
        // slot.innerText = 'Empty Slot';  // ถ้าไม่มีไอเทมให้แสดงข้อความ "Empty Slot"
    }
    
    inventoryContainer?.appendChild(slot);
}
