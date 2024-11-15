import $ from 'jquery';  // import jQuery ในไฟล์ของคุณ
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';  // เพิ่มการใช้งาน droppable

const closeKeys = [27, 84];  // ปุ่มที่ใช้สำหรับปิดอินเวนทอรี
const MAX_SLOTS = 48;  // จำนวนช่องในอินเวนทอรี
let currentUseSlot = null; // เก็บช่อง item ที่มีปุ่ม use อยู่ในขณะนั้น

// ตัวอย่างรายการไอเทม
let items = [
    { name: "idcard", count: 1, canUse: true },
    { name: "work_card", count: 2, canUse: false, canGive: true },
    { name: "Phone", count: 3, canUse: false, canDrop: true, canGive: true },
    { name: "basic_fail", count: 1, canUse: false, canDrop: true, canGive: true },
    { name: "Painkiller", count: 2, canUse: true, canDrop: true, canGive: true },
    { name: "weapon_bottlex", count: 1, canChangeSkin: true },
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

        // เพิ่ม event listener สำหรับคลิกขวาเพื่อแสดง/ซ่อนปุ่ม use และ drop
        slot.addEventListener('contextmenu', (e) => {
            e.preventDefault();  // ป้องกัน context menu ปกติไม่ให้แสดง

            // ตรวจสอบว่าช่องนี้มีปุ่มอยู่แล้วหรือไม่
            if (currentUseSlot === slot) {
                currentUseSlot = null;
                slot.innerHTML = ''; // ลบปุ่มออก

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

            slot.innerHTML = '';  // ล้างเนื้อหาภายใน slot

            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('item-buttons');

            // ถ้าไอเทมสามารถใช้ได้
            if (item.canChangeSkin) {
                const ChangeSkin = document.createElement('button');
                ChangeSkin.innerText = 'เปลี่ยน';

                ChangeSkin.addEventListener('click', () => {
                    useItem(i);  // เรียกใช้ไอเทมตาม index ของมัน
                    updateInventory();  // อัพเดต inventory เพื่อคืนภาพและจำนวน
                    currentUseSlot = null;
                });

                buttonsContainer.appendChild(ChangeSkin);
            }

            // ถ้าไอเทมสามารถใช้ได้
            if (item.canUse) {
                const useButton = document.createElement('button');
                useButton.innerText = 'ใช้';

                useButton.addEventListener('click', () => {
                    useItem(i);  // เรียกใช้ไอเทมตาม index ของมัน
                    updateInventory();  // อัพเดต inventory เพื่อคืนภาพและจำนวน
                    currentUseSlot = null;
                });

                buttonsContainer.appendChild(useButton);
            }

            // ถ้าไอเทมสามารถทิ้งได้
            if (item.canGive) {
                const giveButton = document.createElement('button');
                giveButton.innerText = 'มอบ';

                giveButton.addEventListener('click', () => {
                    useItem(i);  // เรียกใช้ไอเทมตาม index ของมัน
                    updateInventory();  // อัพเดต inventory เพื่อคืนภาพและจำนวน
                    currentUseSlot = null;
                });

                buttonsContainer.appendChild(giveButton);
            }

            // ถ้าไอเทมสามารถทิ้งได้
            if (item.canDrop) {
                const dropButton = document.createElement('button');
                dropButton.innerText = 'ทิ้ง';

                dropButton.addEventListener('click', () => {
                    useItem(i);  // เรียกใช้ไอเทมตาม index ของมัน
                    updateInventory();  // อัพเดต inventory เพื่อคืนภาพและจำนวน
                    currentUseSlot = null;
                });

                buttonsContainer.appendChild(dropButton);
            }

            // เพิ่มปุ่มทั้งสองใน slot
            slot.appendChild(buttonsContainer);
            tooltip.style.display = 'none';
        });
    }

    return slot;
}

// ฟังก์ชันสำหรับทำให้ item สามารถลากได้
function makeDraggables() {
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

// ฟังก์ชันทำให้ sidebar-item รับการวางและสามารถลบไอเท็มได้ด้วยการคลิกขวา
function makeSidebarDroppables() {
    $(".sidebar-item").droppable({
        accept: ".item-image", // เฉพาะ .item-image เท่านั้นที่จะถูกลากมาวางได้
        drop: function (event, ui) {
            const draggedItem = ui.helper[0];  // element ที่ถูกลาก
            const itemName = $(draggedItem).attr('alt');  // ดึงชื่อไอเทม
            const slot = $(this).data('slot');  // ดึงค่า slot จาก data-slot
            console.log("Item dropped:", itemName);

            // ถ้ามีไอเท็มอยู่แล้วใน sidebar-item ให้ลบไอเท็มเก่าออก
            $(this).find('.item-image').remove();

            // ซ่อนตัวเลขในช่องนั้นเมื่อวางไอเท็ม
            $(this).contents().filter(function() {
                return this.nodeType === 3; // ตัวเลขเป็น text node
            }).wrap('<span class="hidden-text"></span>');

            // เพิ่มรูปภาพไอเท็มใหม่ลงใน sidebar-item
            $(this).append(`<img src='/img/items/${itemName}.png' alt='${itemName}' class='item-image'>`);

            $.post("https://Dust_Inventory/PutIntoFast", JSON.stringify({
                item: itemName,
                slot: slot,
            }));
        }
    });

    // เพิ่ม event listener สำหรับการคลิกขวาที่ sidebar-item เพื่อเอา item ออก
    $(".sidebar-item").on("contextmenu", function (e) {
        e.preventDefault();  // ป้องกันเมนู context ปกติ
        const slot = $(this).data('slot');  // ดึง slot ที่จะเอาไอเท็มออก
        $(this).find('.item-image').remove();  // ลบเฉพาะไอเท็มที่เป็นรูปภาพ

        // นำตัวเลขกลับมาแสดง
        $(this).find('.hidden-text').contents().unwrap();
        console.log("Item removed from sidebar-item");
        $.post("https://Dust_Inventory/TakeFromFast", JSON.stringify({
            slot: slot,
        }));
    });
}

// ฟังก์ชันสำหรับอัพเดตอินเวนทอรี
export function updateInventory() {
    $("#inventory").html('');
    for (let i = 0; i < MAX_SLOTS; i++) {
        const slot = createSlot(i, items[i] && items[i].name !== "" ? items[i] : undefined);
        $("#inventory").append(slot);
    }

    // เรียกใช้ draggable หลังจากที่อินเวนทอรีถูกอัพเดต
    makeDraggables();
    makeSidebarDroppables();  // เรียกใช้งาน droppable สำหรับ sidebar
}

// ฟังก์ชันการใช้ไอเทม
function useItem(index) {
    const item = items[index];
    if (item) {
        $.post("http://Dust_Inventory/UseItem", JSON.stringify({ itemName: item.name }));
    }
}

$("body").on("keyup", function (key) {
    if (closeKeys.includes(key.which)) {
        closeInventory();
    }
});

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