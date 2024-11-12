import './style.css';
import $ from 'jquery';
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

const MAX_SLOTS = 48;
const closeKeys = [27, 84];

gsap.registerPlugin(Draggable);

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
   <div class="inventory-wrapper" id="wrapper">
    <div class="sidebar" id="sidebar">
        <div class="sidebar-item" data-slot="1">1</div>
        <div class="sidebar-item" data-slot="2">2</div>
        <div class="sidebar-item" data-slot="3">3</div>
        <div class="sidebar-item" data-slot="4">4</div>
        <div class="sidebar-item" data-slot="5">5</div>
        <div class="sidebar-item" data-slot="6">6</div>
        <div class="sidebar-item" data-slot="7">7</div>
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
const sidebar = document.getElementById('sidebar');

let items = [] as { name: string, count: number }[];

function createSlot(i: number, item?: { name: string; count: number }) {
    const slot = document.createElement('div');
    slot.classList.add('item-slot');

    if (item && item.name !== "") {
        const img = document.createElement('img');
        img.src = `/img/items/${item.name}.png`;
        img.alt = item.name;
        img.classList.add('item-image');
        slot.appendChild(img);
        slot.setAttribute('draggable', 'true');

        const quantity = document.createElement('div');
        quantity.classList.add('quantity');
        quantity.innerText = `x${item.count}`;
        slot.appendChild(quantity);

        slot.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            slot.innerHTML = `<button class="use-button">Use</button>`;
            slot.querySelector('.use-button')?.addEventListener('click', () => {
                useItem(i);
                updateInventory();
            });
            document.addEventListener('click', () => {
                updateInventory();
            }, { once: true });
        });

        Draggable.create(img, {
            type: "x,y",
            bounds: inventoryWrapper,
            onDragEnd: function() {
                const imgRect = img.getBoundingClientRect();
                const sidebarRect = sidebar!.getBoundingClientRect();

                // ตรวจสอบว่าถูกลากไปอยู่ใน sidebar หรือไม่
                if (
                    imgRect.right > sidebarRect.left &&
                    imgRect.left < sidebarRect.right &&
                    imgRect.top > sidebarRect.top &&
                    imgRect.bottom < sidebarRect.bottom
                ) {
                    // ตรวจสอบช่องว่างใน sidebar
                    for (let j = 1; j <= 7; j++) {
                        const sidebarSlot = sidebar?.querySelector(`[data-slot="${j}"]`);
                        const sidebarSlotRect = sidebarSlot!.getBoundingClientRect();

                        // ตรวจสอบว่าถูกปล่อยลงในช่องไหน
                        if (
                            imgRect.right > sidebarSlotRect.left &&
                            imgRect.left < sidebarSlotRect.right &&
                            imgRect.top > sidebarSlotRect.top &&
                            imgRect.bottom < sidebarSlotRect.bottom
                        ) {
                            sidebarSlot!.appendChild(img); // ย้ายรูปไอเทมไปในช่องนั้น
                            
                            // รีเซ็ตพิกัดตำแหน่งของไอเทมให้พอดีกับช่อง
                            gsap.to(img, {
                                x: sidebarSlotRect.left - imgRect.left,
                                y: sidebarSlotRect.top - imgRect.top,
                                duration: 0.3,
                                onComplete: () => {
                                    gsap.set(img, { x: 0, y: 0 });
                                }
                            });
                            return;
                        }
                    }
                } else {
                    gsap.to(img, { x: 0, y: 0 }); // ถ้าไม่ได้ปล่อยใน sidebar ก็กลับไปที่เดิม
                }
            }
        });
    }

    return slot;
}

function useItem(index: number) {
    const item = items[index];
    if (item) {
        $.post("http://Dust_Inventory/UseItem", JSON.stringify({ itemName: item.name }));
    }
}

function updateInventory() {
    inventoryContainer!.innerHTML = '';
    for (let i = 0; i < MAX_SLOTS; i++) {
        const slot = createSlot(i, items[i] && items[i].name !== "" ? items[i] : undefined);
        inventoryContainer?.appendChild(slot);
    }
}

function closeInventory() {
    $.post("http://Dust_Inventory/NUIFocusOff", JSON.stringify({
        type: "normal"
    }));
    inventoryContainer!.style.display = 'none';
    inventoryWrapper!.style.display = 'none';
}

$("body").on("keyup", function (key) {
    if (closeKeys.includes(key.which)) {
        closeInventory();
    }
});

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
