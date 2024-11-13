import $ from 'jquery';  // import jQuery ในไฟล์ของคุณ
import 'jquery-ui/ui/widgets/draggable';

const closeKeys = [27, 84];  // ปุ่มที่ใช้สำหรับปิดอินเวนทอรี
const MAX_SLOTS = 48;  // จำนวนช่องในอินเวนทอรี
let currentUseSlot = null; // เก็บช่อง item ที่มีปุ่ม use อยู่ในขณะนั้น

// ตัวอย่างรายการไอเทม
let items = [
    { name: "Health Potion", count: 3 },
    { name: "Mana Potion", count: 2 },
    { name: "Sword", count: 1 },
    { name: "Potion", count: 3 },
    { name: "Painkiller", count: 2 },
    { name: "Bottle", count: 1 },
];

// ฟังก์ชันเพื่อสร้างแต่ละ slot
// ฟังก์ชันเพื่อสร้างแต่ละ slot
function createSlot(i, item) {
    const slot = document.createElement('div');
    const tooltip = document.getElementById('tooltip');
    slot.classList.add('item-slot');

    // ถ้ามีไอเทมในช่องนี้
    if (item && item.name !== "") {
        const img = document.createElement('img');
        img.src = `/img/items/${item.name}.png`;
        img.alt = item.name;
        img.classList.add('item-image');

        slot.appendChild(img); // เพิ่มรูปภาพเข้าไปใน slot
        const quantity = document.createElement('div');
        quantity.classList.add('quantity');
        quantity.innerText = `x${item.count}`;
        slot.appendChild(quantity);

        slot.addEventListener('mouseenter', (e) => {
            if (!currentUseSlot) {
                tooltip.innerText = `${item.name} (x${item.count})`;
                tooltip.style.display = 'block';
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.top = `${e.pageY + 10}px`;
            }
        });

        slot.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        slot.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        // เพิ่ม event listener สำหรับคลิกขวาเพื่อแสดง/ซ่อนปุ่ม use
        slot.addEventListener('contextmenu', (e) => {
            e.preventDefault();  // ป้องกัน context menu ปกติไม่ให้แสดง

            // ตรวจสอบว่าช่องนี้มีปุ่ม use อยู่แล้วหรือไม่
            if (currentUseSlot === slot) {
                // ซ่อนปุ่ม use ถ้ามีการคลิกขวาที่ item เดิมซ้ำ
                currentUseSlot = null;
                slot.innerHTML = '';
                const oldImg = document.createElement('img');
                oldImg.src = `/img/items/${item.name}.png`;
                oldImg.alt = item.name;
                oldImg.classList.add('item-image');
                slot.appendChild(oldImg);

                const oldQuantity = document.createElement('div');
                oldQuantity.classList.add('quantity');
                oldQuantity.innerText = `x${item.count}`;
                slot.appendChild(oldQuantity);

                tooltip.style.display = 'none';
                return;
            }

            // ซ่อนปุ่ม use ที่ช่องเก่า (ถ้ามี)
            if (currentUseSlot) {
                currentUseSlot.innerHTML = '';
                const oldItem = items[currentUseSlot.dataset.index];
                if (oldItem) {
                    const oldImg = document.createElement('img');
                    oldImg.src = `/img/items/${oldItem.name}.png`;
                    oldImg.alt = oldItem.name;
                    oldImg.classList.add('item-image');
                    currentUseSlot.appendChild(oldImg);

                    const oldQuantity = document.createElement('div');
                    oldQuantity.classList.add('quantity');
                    oldQuantity.innerText = `x${oldItem.count}`;
                    currentUseSlot.appendChild(oldQuantity);
                }
            }

            // อัปเดตช่องที่มีปุ่ม use ปัจจุบัน
            currentUseSlot = slot;
            slot.dataset.index = i;

            // ล้างเนื้อหาภายใน slot ปัจจุบัน
            slot.innerHTML = '';

            // สร้างปุ่ม use
            const useButton = document.createElement('button');
            useButton.classList.add('use-button');
            useButton.innerText = 'Use';

            // เพิ่ม event เมื่อคลิกที่ปุ่ม use
            useButton.addEventListener('click', () => {
                useItem(i);  // เรียกใช้ไอเทมตาม index ของมัน
                updateInventory();  // อัพเดต inventory เพื่อคืนภาพและจำนวน
                currentUseSlot = null;
            });

            // เพิ่มปุ่ม use ใน slot
            slot.appendChild(useButton);

            // ซ่อน tooltip เมื่อคลิกขวา
            tooltip.style.display = 'none';
        });
    }

    return slot;
}

function makeDraggables() {
    for (let i = 1; i <= 7; i++) {
        $(`[data-slot="${i}"]`).droppable({
            hoverClass: 'FasthoverControl',
            drop: function (event, ui) {
                const itemData = ui.draggable.data("item");
                const itemInventory = ui.draggable.data("inventory");

                if (type === "normal" && (itemInventory === "main" || itemInventory === "fast")) {
                    $.post("https://Dust_Inventory/PutIntoFast", JSON.stringify({
                        item: itemData,
                        slot: i
                    }));
                }
            }
        });
    }
}


// ฟังก์ชันสำหรับอัพเดตอินเวนทอรี
export function updateInventory() {
    $("#inventory").html('');
    for (let i = 0; i < MAX_SLOTS; i++) {
        const slot = createSlot(i, items[i] && items[i].name !== "" ? items[i] : undefined);
        $("#inventory").append(slot);
    }

    // เรียกใช้ draggable หลังจากที่อินเวนทอรีถูกอัพเดต
    $('.item-image').draggable({
        appendTo: 'body',
        zIndex: 99999,
        disabled: false,
        drag: function (event, ui) {
            ui.position.left = ui.position.left + 1;
            ui.position.top = ui.position.top + 1;
        },
        helper: function (e) {
            var original = $(e.target).hasClass("ui-draggable") ? $(e.target) : $(e.target).closest(".ui-draggable");
            return original.clone().css({
                width: original.width(),
                height: original.height(),
            });
        },
        start: function () {
            $(this).css('background-image', 'none');
            // const audioouta = new Audio();
            // audioouta.src = "./sound/sec.mp3";
            // audioouta.play();
            // audioouta.volume = 0.1;
        },
        stop: function () {
            const itemData = $(this).data("item");

            if (itemData !== undefined && itemData.name !== undefined) {
                $("#drop").removeClass("disabled");
                $("#use").removeClass("disabled");
                $("#give").removeClass("disabled");
            }
        }
    });
}

// ตรวจจับการกดปุ่มเพื่อปิดอินเวนทอรี
$("body").on("keyup", function (key) {
    if (closeKeys.includes(key.which)) {
        closeInventory();
    }
});

// ฟังก์ชันการใช้ไอเทม
function useItem(index) {
    const item = items[index];
    if (item) {
        $.post("http://Dust_Inventory/UseItem", JSON.stringify({ itemName: item.name }));
    }
}

// ฟังก์ชันสำหรับปิดอินเวนทอรี
function closeInventory() {
    $.post("http://Dust_Inventory/NUIFocusOff", JSON.stringify({
        type: "normal"
    }));
    $("#inventory").hide();
    $("#wrapper").hide();
}

// ฟังก์ชันสำหรับรับข้อมูลจากเซิร์ฟเวอร์ (ผ่าน message)
window.addEventListener('message', (event) => {
    if (event.data.action === 'showinventory') {
        items = event.data.itemList || [];  // รับรายการไอเทมจากเซิร์ฟเวอร์
        updateInventory();  // อัพเดตอินเวนทอรี

        $("#inventory").show();  // แสดงอินเวนทอรี
    }

    if (event.data.type === "normal") {
        $("#wrapper").show();  // แสดง wrapper
    }
});
