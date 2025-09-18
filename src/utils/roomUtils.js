/**
 * Utility functions for room-related operations
 */

/**
 * Get room type name from room UUID using hostel info
 * @param {string} roomUuid - The room UUID to look up
 * @param {object} hostelInfo - The hostel information containing room_details
 * @returns {string} - The room type name (e.g., "3-Person Room") or the original UUID if not found
 */
export const getRoomTypeName = (roomUuid, hostelInfo) => {
  console.log('=== getRoomTypeName START ===');
  console.log('Input roomUuid:', roomUuid);
  console.log('Input hostelInfo:', hostelInfo);

  // Step 1: Check if we have valid inputs
  if (!roomUuid || roomUuid === 'No room assigned') {
    console.log('No room UUID provided');
    return 'No room assigned';
  }

  if (!hostelInfo || !hostelInfo.room_details || !Array.isArray(hostelInfo.room_details)) {
    console.log('No hostel info or room details available');
    return roomUuid; // Return original UUID if no hostel info
  }

  console.log('Available rooms in hostel:', hostelInfo.room_details.length);

  // Step 2: Loop through each room in the hostel
  for (let i = 0; i < hostelInfo.room_details.length; i++) {
    const room = hostelInfo.room_details[i];
    console.log(`Room ${i}:`, {
      uuid: room.uuid,
      number_in_room: room.number_in_room,
      tenantUuid: roomUuid,
      isMatch: room.uuid === roomUuid
    });
    
    // Step 3: Check if this room's UUID matches the tenant's UUID
    if (room.uuid === roomUuid) {
      // Use room_label if available, otherwise fall back to number_in_room format
      const roomTypeName = room.room_label || `${room.number_in_room || 'N/A'}-Person Room`;
      console.log('✅ MATCH FOUND! Returning:', roomTypeName);
      console.log('=== getRoomTypeName END ===');
      return roomTypeName;
    }
  }

  // Step 4: If no match found, fall back to first available room's label/capacity
  console.log('❌ NO MATCH FOUND for UUID:', roomUuid);
  if (hostelInfo.room_details.length > 0) {
    const firstRoom = hostelInfo.room_details[0];
    const fallbackName = firstRoom.room_label || `${firstRoom.number_in_room || 'N/A'}-Person Room`;
    console.log('Using fallback room type name:', fallbackName);
    console.log('=== getRoomTypeName END ===');
    return fallbackName;
  }
  console.log('=== getRoomTypeName END ===');
  return roomUuid;
};

/**
 * Get room type details from room UUID
 * @param {string} roomUuid - The room UUID to look up
 * @param {object} hostelInfo - The hostel information containing room_details
 * @returns {object|null} - The room type object or null if not found
 */
export const getRoomTypeDetails = (roomUuid, hostelInfo) => {
  if (!roomUuid || !hostelInfo || !hostelInfo.room_details) {
    return null;
  }

  return hostelInfo.room_details.find(room => room.room_uuid === roomUuid) || null;
};

/**
 * Get all room types with their details
 * @param {object} hostelInfo - The hostel information containing room_details
 * @returns {array} - Array of room type objects
 */
export const getAllRoomTypes = (hostelInfo) => {
  if (!hostelInfo || !hostelInfo.room_details) {
    return [];
  }

  return hostelInfo.room_details.map(room => ({
    uuid: room.room_uuid,
    name: `${room.number_in_room || 'N/A'}-Person Room`,
    capacity: room.number_in_room || 0,
    price: room.price || 0,
    numberOfRooms: room.number_of_rooms || 0,
    totalCapacity: (room.number_in_room || 0) * (room.number_of_rooms || 0),
    ...room
  }));
};

/**
 * Create a mapping of room UUIDs to room type names
 * @param {object} hostelInfo - The hostel information containing room_details
 * @returns {object} - Object mapping UUIDs to room type names
 */
export const createRoomUuidToNameMapping = (hostelInfo) => {
  if (!hostelInfo || !hostelInfo.room_details) {
    return {};
  }

  const mapping = {};
  hostelInfo.room_details.forEach(room => {
    if (room.room_uuid) {
      mapping[room.room_uuid] = `${room.number_in_room || 'N/A'}-Person Room`;
    }
  });

  return mapping;
};

/**
 * Get current tenant count for each room type
 * @param {array} tenants - Array of tenant objects
 * @param {object} hostelInfo - The hostel information containing room_details
 * @returns {object} - Object mapping room UUIDs to tenant counts
 */
export const getTenantCountPerRoomType = (tenants, hostelInfo) => {
  if (!tenants || !Array.isArray(tenants) || !hostelInfo || !hostelInfo.room_details) {
    return {};
  }

  const tenantCounts = {};
  
  // Initialize counts for all room types
  hostelInfo.room_details.forEach(room => {
    if (room.uuid) {
      tenantCounts[room.uuid] = 0;
    }
  });

  // Count tenants for each room type
  tenants.forEach(tenant => {
    const roomUuid = tenant.roomUuid || tenant.room_uuid || tenant.originalData?.room_uuid;
    if (roomUuid && tenantCounts.hasOwnProperty(roomUuid)) {
      tenantCounts[roomUuid]++;
    }
  });

  return tenantCounts;
};

/**
 * Get minimum number of rooms required for a room type based on current tenant count
 * @param {string} roomUuid - The room UUID to check
 * @param {array} tenants - Array of tenant objects
 * @param {object} hostelInfo - The hostel information containing room_details
 * @returns {number} - Minimum number of rooms required
 */
export const getMinimumRoomsRequired = (roomUuid, tenants, hostelInfo) => {
  if (!roomUuid || !tenants || !hostelInfo || !hostelInfo.room_details) {
    return 0;
  }

  // Find the room type details
  const roomType = hostelInfo.room_details.find(room => room.uuid === roomUuid);
  if (!roomType) {
    return 0;
  }

  // Count tenants in this room type
  const tenantCount = tenants.filter(tenant => {
    const tenantRoomUuid = tenant.roomUuid || tenant.room_uuid || tenant.originalData?.room_uuid;
    return tenantRoomUuid === roomUuid;
  }).length;

  // Calculate minimum rooms needed (ceil division)
  const capacityPerRoom = parseInt(roomType.number_in_room) || 1;
  const minimumRooms = Math.ceil(tenantCount / capacityPerRoom);

  return minimumRooms;
};

/**
 * Transform tenant data to include room type names
 * @param {array} tenants - Array of tenant objects
 * @param {object} hostelInfo - The hostel information containing room_details
 * @returns {array} - Array of tenant objects with room type names
 */
export const transformTenantsWithRoomTypes = (tenants, hostelInfo) => {
  if (!tenants || !Array.isArray(tenants)) {
    return [];
  }

  return tenants.map(tenant => ({
    ...tenant,
    roomTypeName: getRoomTypeName(tenant.roomUuid || tenant.room_uuid, hostelInfo),
    roomTypeDetails: getRoomTypeDetails(tenant.roomUuid || tenant.room_uuid, hostelInfo)
  }));
};
