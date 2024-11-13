import $ from 'jquery';  // import jQuery ในไฟล์ของคุณ
import 'jquery-ui/ui/widgets/draggable';

const closeKeys = [27, 84];  // ปุ่มที่ใช้สำหรับปิดอินเวนทอรี
const MAX_SLOTS = 48;  // จำนวนช่องในอินเวนทอรี

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
function createSlot(i, item) {
    const slot = document.createElement('div');
    const tooltip = document.getElementById('tooltip');
    slot.classList.add('item-slot');

    // ถ้ามีไอเทมในช่องนี้
    if (item && item.name !== "") {
        const img = document.createElement('img');
        img.src = `/img/items/${item.name}.png`;
        img.alt = item.name;
        img.classList.add('item-image'); // กำหนดคลาสเพื่อใช้กับ CSS ถ้าต้องการ

        slot.appendChild(img); // เพิ่มรูปภาพเข้าไปใน slot
        const quantity = document.createElement('div');
        quantity.classList.add('quantity');
        quantity.innerText = `x${item.count}`;
        slot.appendChild(quantity);

        slot.addEventListener('mouseenter', (e) => {
            tooltip.innerText = `${item.name} (x${item.count})`;
            
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        slot.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });
    
        slot.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    }

    return slot;
}

// ฟังก์ชันสำหรับอัพเดตอินเวนทอรี
export function updateInventory() {  // เพิ่มการ export ฟังก์ชัน
    $("#inventory").html('');
    for (let i = 0; i < MAX_SLOTS; i++) {
        const slot = createSlot(i, items[i] && items[i].name !== "" ? items[i] : undefined);
        $("#inventory").append(slot); // ใช้ jQuery .append แทน .appendChild
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
            const audioouta = new Audio();
            audioouta.src = "./sound/sec.mp3";
            audioouta.play()
            audioouta.volume = 0.1;
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
