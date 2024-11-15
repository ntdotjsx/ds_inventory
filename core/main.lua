Keys = {
    ["ESC"] = 322, ["F1"] = 288, ["F2"] = 289, ["F3"] = 170, ["F5"] = 166, ["F6"] = 167, ["F7"] = 168, ["F8"] = 169,
    ["F9"] = 56, ["F10"] = 57,
    ["~"] = 243, ["1"] = 157, ["2"] = 158, ["3"] = 160, ["4"] = 164, ["5"] = 165, ["6"] = 159, ["7"] = 161, ["8"] = 162,
    ["9"] = 163, ["-"] = 84, ["="] = 83, ["BACKSPACE"] = 177,
    ["TAB"] = 37, ["Q"] = 44, ["W"] = 32, ["E"] = 38, ["R"] = 45, ["T"] = 245, ["Y"] = 246, ["U"] = 303, ["P"] = 199,
    ["["] = 39, ["]"] = 40, ["ENTER"] = 18,
    ["CAPS"] = 137, ["A"] = 34, ["S"] = 8, ["D"] = 9, ["F"] = 23, ["G"] = 47, ["H"] = 74, ["K"] = 311, ["L"] = 182,
    ["LEFTSHIFT"] = 21, ["Z"] = 20, ["X"] = 73, ["C"] = 26, ["V"] = 0, ["B"] = 29, ["N"] = 249, ["M"] = 244, [","] = 82,
    ["."] = 81,
    ["LEFTCTRL"] = 36, ["LEFTALT"] = 19, ["SPACE"] = 22, ["RIGHTCTRL"] = 70,
    ["HOME"] = 213, ["PAGEUP"] = 10, ["PAGEDOWN"] = 11, ["DELETE"] = 178,
    ["LEFT"] = 174, ["RIGHT"] = 175, ["TOP"] = 27, ["DOWN"] = 173,
    ["NENTER"] = 201, ["N4"] = 108, ["N5"] = 60, ["N6"] = 107, ["N+"] = 96, ["N-"] = 97, ["N7"] = 117, ["N8"] = 61,
    ["N9"] = 118
}

isInInventory = false
ESX = exports["es_extended"]:getSharedObject()
local Vehicle_Key = {}
local Accessory_Items = {}
local status = false
local House_Key = {}
local House2_Key = {}
fastItems = {}
fastitem = nil
FastNum = 1
weaponsiv = {}

local fastWeapons = {
    [1] = {
        [1] = nil,
        [2] = nil,
        [3] = nil,
        [4] = nil,
        [5] = nil,
        [6] = nil,
        [7] = nil,
    },
    [2] = {
        [1] = nil,
        [2] = nil,
        [3] = nil,
        [4] = nil,
        [5] = nil,
        [6] = nil,
        [7] = nil,
    },
}

-- กดปุ่มเพื่อเปิด Inventory
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if IsControlJustReleased(0, 245) then  -- ปุ่มที่กดเพื่อเปิด Inventory
            openInventory()
        end
    end
end)

function openInventory()
    ESX.PlayerData = ESX.GetPlayerData()
    local item = GetDataInventory()
    -- local DustData = {
    --     id = GetPlayerServerId(PlayerId()),
    --     money = Get_Money(),
    -- }
    SendNUIMessage({
        action = "showinventory",  -- การกระทำที่ UI จะทำเมื่อได้รับข้อมูลนี้
        type = "normal",
        itemList = item,  -- รายการไอเทม
        -- Data = DustData,  -- ข้อมูลของผู้เล่น
    })
    SetNuiFocus(true, true)  -- เปิด Focus ไปที่ UI
end

RegisterNUICallback("NUIFocusOff",function()
    closeInventory()
end)

function closeInventory()
    isInInventory = false
    SendNUIMessage({
        action = 'hide'
    })
    SetNuiFocus(false, false)
end

function GetDataInventory()
    local data = {}
    local fastItems = {}
    local account = ESX.GetPlayerData().accounts
    local inven = ESX.GetPlayerData().inventory
    local loadout = ESX.GetPlayerData().loadout
    local currentWeight = 0


    -- IDCARD
    local IDCard = {
        label = "IDCard",
        name = "idcard",
        type = "item_idcard",
        count = 1,
        usable = true,
        canRemove = false
    }
    table.insert(data, IDCard)
    -- print(json.encode(fastWeapons[FastNum]))
    -- print(ESX.DumpTable(fastWeapons))
    if fastWeapons[FastNum] ~= nil then  -- ตรวจสอบว่ามีค่าอยู่ใน fastWeapons[FastNum] หรือไม่
        for slot, item in pairs(fastWeapons[FastNum]) do
            if item == "idcard" then
                IDCard.slot = slot
                table.insert(fastItems, IDCard)
            end
        end
    else
        print("No items in fastWeapons for slot:", FastNum)
    end
    

    if Mask then
        skinMask = json.decode(Mask.skin)
        local MASK = {
            label = "Mask",
            name = "mask",
            type = "item_accessories",
            count = 1,
            usable = true,
            canRemove = false,
            itemnum = skinMask.mask_1,
            itemskin = skinMask.mask_2,
        }

        table.insert(data, MASK)
        for slot, item in pairs(fastWeapons[FastNum]) do
            if item == "mask" then
                MASK.slot = slot
                ReceivedData[FastNum][slot] = MASK
                table.insert(fastItems, MASK)
            end
        end
    end

    for i = 1, #Accessory_Items, 1 do
        table.insert(data, {
            label = Accessory_Items[i].label,
            count = 1,
            weight = 0,
            type = "item_accessories",
            name = Accessory_Items[i].name,
            usable = true,
            rare = false,
            canRemove = true,
            itemnum = Accessory_Items[i].itemnum,
            itemskin = Accessory_Items[i].itemskin,
            itemarms = Accessory_Items[i].itemarms,
            itemarms2 = Accessory_Items[i].itemarms2,
            itemtshirt = Accessory_Items[i].itemtshirt,
            itemtshirt2 = Accessory_Items[i].itemtshirt2,
            itemchain = Accessory_Items[i].itemchain,
            itemchain2 = Accessory_Items[i].itemchain2
        })
    end

    for k, v in pairs(account) do
        if v.name ~= 'bank' then
            if v.money > 0 then
                if (TypeOpen == 'TRUNK') then
                    if v.name ~= 'money' then
                        local canDrop = v.name ~= "bank"
                        local accountData = {
                            name = v.name,
                            label = v.label,
                            count = v.money,
                            type = "item_account",
                            usable = false,
                            limit = -1,
                            canRemove = canDrop
                        }
                        table.insert(data, accountData)
                    end
                else
                    local canDrop = v.name ~= "bank"
                    local accountData = {
                        name = v.name,
                        label = v.label,
                        count = v.money,
                        type = "item_account",
                        usable = false,
                        limit = -1,
                        canRemove = canDrop
                    }
                    table.insert(data, accountData)

                end
            end
        end
    end

    for k, v in pairs(inven) do
        if v.count > 0 then
            v.type = "item_standard"
            table.insert(data, v)

            -- WEIGHT
            currentWeight = currentWeight + (v.limit * v.count)
        end
    end

    for k, v in pairs(weaponsiv) do
        local weaponHash = GetHashKey(v.name)
        if HasPedGotWeapon(PlayerPedId(), weaponHash, false) and v.name ~= "WEAPON_UNARMED" then
            local ammo = GetAmmoInPedWeapon(PlayerPedId(), weaponHash)
            local PLoadOut = {
                name = v.name,
                label = v.label,
                count = ammo,
                limit = -1,
                type = "item_weapon",
                usable = true,
                canRemove = false
            }
            table.insert(data, PLoadOut)
            if (TypeOpen == 'PLAYER') then
                for slot, item in pairs(fastWeapons[FastNum]) do
                    if v.name == item then
                        table.insert(
                            fastItems,
                            {
                                label = v.label,
                                count = ammo,
                                weight = 0,
                                type = 'item_weapon',
                                name = v.name,
                                usable = false,
                                rare = false,
                                canRemove = true,
                                slot = slot
                            }
                        )
                    end
                end
            end
        end
    end

    for k, v in pairs(data) do
        local founditem = false
        for category, value in pairs(Config.Category) do
            for index, data in pairs(value) do
                if Config.Category[category][index] == v.name then
                    v.category = category;
                    founditem = true
                    break
                end
            end
        end

        if founditem == false then
            if data[k].type == "item_key" or data[k].type == "item_keyhouse" then
                data[k].category = "inventory_keys";
            elseif data[k].type == "item_weapon" then
                data[k].category = "fighting";
            end
        end
    end

    if fastWeapons[FastNum] ~= nil then
        for slot, item in pairs(fastWeapons[FastNum]) do
            for i = 1, #Accessory_Items, 1 do
                if item == Accessory_Items[i].name then
                    table.insert(
                        fastItems,
                        {
                            label = Accessory_Items[i].label,
                            count = 0,
                            weight = 0,
                            type = "item_accessories",
                            name = Accessory_Items[i].name,
                            itemnum = Accessory_Items[i].itemnum,
                            itemskin = Accessory_Items[i].itemskin,
                            itemarms = Accessory_Items[i].itemarms,
                            itemarms2 = Accessory_Items[i].itemarms2,
                            itemtshirt = Accessory_Items[i].itemtshirt,
                            itemtshirt2 = Accessory_Items[i].itemtshirt2,
                            itemchain = Accessory_Items[i].itemchain,
                            itemchain2 = Accessory_Items[i].itemchain2,
                            usable = true,
                            rare = false,
                            canRemove = true,
                            slot = slot
                        }
                    )
                end
            end
        end
    else
        print("No items in fastWeapons for slot:", FastNum)
    end
    
    -- ตรวจสอบอีกครั้งว่า fastWeapons[FastNum] ไม่เป็น nil สำหรับการวนลูปนี้
    if fastWeapons[FastNum] ~= nil then
        for key, v in pairs(inven) do
            if inven[key].count <= 0 then
                inven[key] = nil
            else
                local founditem = false
                for slot, item in pairs(fastWeapons[FastNum]) do
                    if item == inven[key].name then
                        table.insert(
                            fastItems,
                            {
                                label = inven[key].label,
                                count = inven[key].count,
                                real = inven[key].real or nil,
                                weight = 0,
                                type = inven[key].type,
                                name = inven[key].name,
                                usable = inven[key].usable,
                                rare = inven[key].rare,
                                canRemove = true,
                                slot = slot
                            }
                        )
                    end
                end
            end
        end
    else
        print("No items in fastWeapons for slot:", FastNum)
    end    
    return data, currentWeight, fastItems
end

RegisterNUICallback(
    "UseItem",
    function(data, cb)
        TriggerServerEvent("esx:useItem", data.itemName)
    cb("ok")
end)

RegisterNUICallback("PutIntoFast", function(data, cb)
    local slot = tonumber(data.slot)
    if slot and data.item then
        fastWeapons[slot] = { name = data.item }  -- เก็บข้อมูลไอเท็มใน fast slot ตาม slot ที่ส่งมา
        -- print("Item "..data.item.." assigned to slot "..slot)
    end
    cb("ok")
end)

RegisterNUICallback("TakeFromFast", function(data, cb)
    local slot = tonumber(data.slot)
    if slot and fastWeapons[slot] then
        fastWeapons[slot] = nil 
        print("Removed item from fast slot:", slot)
    end
    cb("ok")
end)

function OnUseFastSlot(number)
    if fastWeapons[number] and fastWeapons[number].name and not IsEntityDead(PlayerPedId()) then
        TriggerServerEvent("esx:useItem", fastWeapons[number].name)
        -- print("Used item from slot", number)
    end
end

RegisterKeyMapping('fast1', 'Use Fast Slot (1)', 'keyboard', '1')
RegisterKeyMapping('fast2', 'Use Fast Slot (2)', 'keyboard', '2')
RegisterKeyMapping('fast3', 'Use Fast Slot (3)', 'keyboard', '3')
RegisterKeyMapping('fast4', 'Use Fast Slot (4)', 'keyboard', '4')
RegisterKeyMapping('fast5', 'Use Fast Slot (5)', 'keyboard', '5')
RegisterKeyMapping('fast6', 'Use Fast Slot (6)', 'keyboard', '6')
RegisterKeyMapping('fast7', 'Use Fast Slot (7)', 'keyboard', '7')

RegisterCommand('fast1', function() 
    OnUseFastSlot(1) 
end, false)
RegisterCommand('fast2', function() 
    OnUseFastSlot(2) 
end, false)
RegisterCommand('fast3', function() 
    OnUseFastSlot(3) 
end, false)
RegisterCommand('fast4', function() 
    OnUseFastSlot(4) 
end, false)
RegisterCommand('fast5', function() 
    OnUseFastSlot(5) 
end, false)
RegisterCommand('fast6', function() 
    OnUseFastSlot(6) 
end, false)
RegisterCommand('fast7', function() 
    OnUseFastSlot(7) 
end, false)