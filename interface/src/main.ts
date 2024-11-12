import './style.css'

const MAX_SLOTS = 25;
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
   <div class="inventory-container" id="inventory"></div>
`

const inventoryContainer = document.getElementById('inventory');

// สมมุติว่าเรามี array ของ items ที่เก็บข้อมูลไอเทม
const items = [
    { name: "Potion", count: 3 },
    { name: "Painkiller", count: 2 },
    { name: "Bottle", count: 1 },
];

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
    } else {
        // ถ้าไม่มีไอเทมในช่องนี้ จะแสดง "Empty Slot"
        // slot.innerText = 'Empty Slot';
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

// แสดงผลของ inventory
updateInventory();
