<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import $ from 'jquery'

// กำหนดปุ่มที่ใช้ในการปิด UI (ESC = 27, T = 84)
const closeKeys = [27, 84]

// ใช้ ref สำหรับการเชื่อมโยงกับ DOM
const inventoryContainer = ref(null)
const inventoryWrapper = ref(null)

// ฟังก์ชันในการปิด inventory
function closeInventory() {
  $.post("http://Dust_Inventory/NUIFocusOff", JSON.stringify({
    type: "normal"
  }))
  // ปรับการแสดงผลของ inventory
  if (inventoryContainer.value && inventoryWrapper.value) {
    inventoryContainer.value.style.display = 'none'
    inventoryWrapper.value.style.display = 'none'
  }
}

// ตั้งค่าฟังก์ชันในการตรวจจับการกดปุ่ม
onMounted(() => {
  $("body").on("keyup", function (key) {
    if (closeKeys.includes(key.which)) {
      closeInventory()
    }
  })
})

// ฟังก์ชันรับข้อความจาก FiveM
window.addEventListener('message', (event) => {
    if (event.data.action === 'showinventory') {
        // อัปเดตข้อมูลของ items จาก event
        items.value = event.data.itemList || []
        updateInventory()

        // แสดง inventory
        if (inventoryContainer.value && inventoryWrapper.value) {
            inventoryContainer.value.style.display = 'grid'
            inventoryWrapper.value.style.display = 'flex'
        }
    }
})

// ลบ event listener เมื่อ component ถูก unmount
onBeforeUnmount(() => {
  $("body").off("keyup")
})

// กำหนดข้อมูลของ items และ slot
const MAX_SLOTS = 48
const items = ref([ { name: "Item 1" }, { name: "Item 2" } ])

// สร้าง slot สำหรับ inventory
const slots = ref([])

// ฟังก์ชันในการอัปเดต inventory (การเติม slot ด้วยข้อมูลจาก items)
function updateInventory() {
    // สร้าง slot ตามจำนวน MAX_SLOTS และใส่ข้อมูลจาก items
    slots.value = []
    for (let i = 0; i < MAX_SLOTS; i++) {
        const slotItem = items.value[i] && items.value[i].name !== "" ? items.value[i] : undefined
        slots.value.push(slotItem)
    }
}

// เรียกใช้เพื่ออัปเดตข้อมูลเมื่อ component ถูก mount
onMounted(() => {
  updateInventory()
})
</script>

<template>
  <div class="inventory-wrapper" id="wrapper" ref="inventoryWrapper">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-item">1</div>
      <div class="sidebar-item">2</div>
      <div class="sidebar-item">3</div>
      <div class="sidebar-item">4</div>
      <div class="sidebar-item">5</div>
      <div class="sidebar-item">6</div>
      <div class="sidebar-item">7</div>
    </div>

    <!-- Inventory Content -->
    <div class="inventory-content">
      <div class="inventory-header">
        <h1 class="inventory-title">INVENTORY</h1>
        <span class="player-name">[Player Name]</span>
      </div>

      <!-- แสดง slot -->
      <div class="inventory-container" id="inventory" ref="inventoryContainer">
        <div v-for="(slot, index) in slots" :key="index" class="item-slot">
          {{ slot ? slot.name : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ใส่สไตล์ที่ใช้ใน inventory ที่นี่ */
</style>
