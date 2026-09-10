/**
 * Real-Time Shared Transport Service & Matching Engine
 * Implements:
 * - Transport Request lifecycle
 * - Real-time compatibility matching engine (mandatory checks + multi-factor scoring)
 * - Transparent weight-based cost splitting
 * - Atomic capacity reservation & concurrency simulation
 * - Real-time event subscriber system
 * - Driver trip lifecycle simulation
 */

// Central Event Bus for real-time reactive updates
class TransportEventBus {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit(event, data) {
    const eventPayload = {
      eventId: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType: event,
      timestamp: new Date().toISOString(),
      payload: data
    };
    this.listeners.get(event)?.forEach(cb => {
      try {
        cb(eventPayload);
      } catch (err) {
        console.error(`Error in event listener for ${event}:`, err);
      }
    });
    // Global wildcard subscriber
    this.listeners.get('*')?.forEach(cb => {
      try {
        cb(eventPayload);
      } catch (err) {
        console.error('Error in wildcard event listener:', err);
      }
    });
  }
}

export const transportEvents = new TransportEventBus();

// Initial Available Vehicles in Erode & Western Tamil Nadu Agro-Corridor
export const INITIAL_VEHICLES = [
  {
    id: 'VEH-01',
    vehicleType: 'Mini Truck (Tata Ace Gold)',
    registrationNumber: 'TN 33 BM 4921',
    capacityKg: 2000,
    driverId: 'DRV-101',
    driverName: 'Murugan K.',
    driverPhone: '+91 98421 77312',
    driverRating: 4.9,
    tripsCompleted: 142,
    baseRatePerKm: 32,
    currentLocation: { lat: 11.2982, lng: 77.5824, label: 'Perundurai Bypass' },
    status: 'AVAILABLE'
  },
  {
    id: 'VEH-02',
    vehicleType: 'Pickup Truck (Mahindra Bolero Maxi)',
    registrationNumber: 'TN 36 AX 8812',
    capacityKg: 2500,
    driverId: 'DRV-102',
    driverName: 'Senthil Kumar',
    driverPhone: '+91 94432 55190',
    driverRating: 4.8,
    tripsCompleted: 98,
    baseRatePerKm: 38,
    currentLocation: { lat: 11.3410, lng: 77.7172, label: 'Erode Ring Road' },
    status: 'AVAILABLE'
  },
  {
    id: 'VEH-03',
    vehicleType: 'Medium Truck (Eicher Pro 2049)',
    registrationNumber: 'TN 28 F 3301',
    capacityKg: 4000,
    driverId: 'DRV-103',
    driverName: 'Ramasamy V.',
    driverPhone: '+91 97890 12345',
    driverRating: 4.95,
    tripsCompleted: 210,
    baseRatePerKm: 48,
    currentLocation: { lat: 11.2050, lng: 77.6250, label: 'Chennimalai Hub' },
    status: 'AVAILABLE'
  }
];

// Major Agricultural Markets (Uzhavar Sandhai & APMC Mandis)
export const AGRI_MARKETS = [
  {
    id: 'MKT-01',
    name: 'Erode Central Agricultural Produce Market (Uzhavar Sandhai)',
    shortName: 'Central Vegetable Market',
    location: 'Brough Road, Erode',
    coords: { lat: 11.3410, lng: 77.7172 },
    typicalArrivalWindow: '04:00 AM - 09:30 AM',
    commodities: ['Tomatoes', 'Onions', 'Brinjal', 'Turmeric', 'Green Chillies']
  },
  {
    id: 'MKT-02',
    name: 'Perundurai Agro Regulated Mandi',
    shortName: 'Perundurai Mandi',
    location: 'Sanitorium, Perundurai',
    coords: { lat: 11.2800, lng: 77.5850 },
    typicalArrivalWindow: '06:00 AM - 11:00 AM',
    commodities: ['Turmeric', 'Coconut', 'Tapioca', 'Groundnut']
  },
  {
    id: 'MKT-03',
    name: 'Coimbatore MGR Wholesale Market',
    shortName: 'Coimbatore Wholesale Mandi',
    location: 'Ukkadam, Coimbatore',
    coords: { lat: 10.9900, lng: 76.9600 },
    typicalArrivalWindow: '03:30 AM - 08:30 AM',
    commodities: ['Vegetables', 'Fruits', 'Banana', 'Plantain']
  }
];

// Open / Poolable Transport Requests from Community Farmers
export const INITIAL_OPEN_REQUESTS = [
  {
    id: 'TR-101',
    farmerId: 'FARMER-245',
    farmerName: 'Ravi Kumar',
    farmerPhone: '+91 98433 11223',
    pickupLocation: 'Kunnathur Road, Perundurai',
    pickupCoords: { lat: 11.2910, lng: 77.5750 },
    destinationMarketId: 'MKT-01',
    destinationMarketName: 'Erode Central Agricultural Produce Market (Uzhavar Sandhai)',
    produceType: 'Onions & Country Tomatoes',
    quantityKg: 650,
    pickupDate: new Date().toISOString().split('T')[0],
    preferredTime: '08:15 AM',
    flexibleWindowMinutes: 30,
    vehicleTypePreference: 'Mini Truck (Tata Ace Gold)',
    maxBudget: 1500,
    allowSharing: true,
    status: 'SEARCHING',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'TR-102',
    farmerId: 'FARMER-312',
    farmerName: 'Karthik Subramanian',
    farmerPhone: '+91 97510 44556',
    pickupLocation: 'Thingalur Village, Erode',
    pickupCoords: { lat: 11.3120, lng: 77.5510 },
    destinationMarketId: 'MKT-01',
    destinationMarketName: 'Erode Central Agricultural Produce Market (Uzhavar Sandhai)',
    produceType: 'Green Chillies & Brinjal',
    quantityKg: 450,
    pickupDate: new Date().toISOString().split('T')[0],
    preferredTime: '08:30 AM',
    flexibleWindowMinutes: 45,
    vehicleTypePreference: 'Mini Truck (Tata Ace Gold)',
    maxBudget: 1200,
    allowSharing: true,
    status: 'SEARCHING',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  }
];

// Pre-existing Shared Booking (For History and Instant Live Demo)
export const INITIAL_SHARED_BOOKINGS = [
  {
    id: 'ST-10492',
    status: 'BOOKED',
    vehicleId: 'VEH-01',
    vehicleName: 'Mini Truck (Tata Ace Gold)',
    vehicleReg: 'TN 33 BM 4921',
    driver: {
      name: 'Murugan K.',
      phone: '+91 98421 77312',
      rating: 4.9,
      trips: 142
    },
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '08:00 AM',
    destinationMarket: 'Erode Central Agricultural Produce Market (Uzhavar Sandhai)',
    totalVehicleCost: 2000,
    totalCapacity: 2000,
    usedCapacity: 1400,
    remainingCapacity: 600,
    costMethod: 'WEIGHT_BASED',
    route: [
      { step: 1, type: 'pickup', title: 'Pickup 1: Perundurai Village', farmer: 'Your Farm', qty: '800 kg Tomatoes', time: '08:00 AM', completed: true },
      { step: 2, type: 'pickup', title: 'Pickup 2: Kunnathur Road (3.2 km detour)', farmer: 'Ravi Kumar', qty: '600 kg Onions', time: '08:18 AM', completed: true },
      { step: 3, type: 'market', title: 'Destination: Erode Central Mandi', farmer: 'Unloading Bay 4', qty: 'Total 1,400 kg', time: '08:55 AM', completed: false }
    ],
    participants: [
      {
        id: 'PART-01',
        farmerId: 'CURRENT_USER',
        farmerName: 'You (Velu)',
        produceType: 'Hybrid Tomatoes',
        quantityKg: 800,
        pickupLocation: 'Perundurai Village, Erode',
        costShare: 1143,
        soloEstimatedCost: 2000,
        estimatedSavings: 857,
        acceptanceStatus: 'ACCEPTED',
        paymentStatus: 'ESCROW_HELD'
      },
      {
        id: 'PART-02',
        farmerId: 'FARMER-245',
        farmerName: 'Ravi Kumar',
        produceType: 'Onions',
        quantityKg: 600,
        pickupLocation: 'Kunnathur Road, Erode',
        costShare: 857,
        soloEstimatedCost: 2000,
        estimatedSavings: 1143,
        acceptanceStatus: 'ACCEPTED',
        paymentStatus: 'ESCROW_HELD'
      }
    ],
    driverLocation: { lat: 11.3150, lng: 77.6400, address: 'Near Villarasampatti Junction (Heading to Mandi)' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

class TransportService {
  constructor() {
    this.vehicles = [...INITIAL_VEHICLES];
    this.openRequests = [...INITIAL_OPEN_REQUESTS];
    this.sharedBookings = [...INITIAL_SHARED_BOOKINGS];
    this.isLocked = false; // Mutex for concurrency control
  }

  // Retrieve available markets
  getMarkets() {
    return AGRI_MARKETS;
  }

  // Retrieve vehicles
  getVehicles() {
    return this.vehicles;
  }

  // Retrieve all active open requests
  getOpenRequests() {
    return this.openRequests;
  }

  // Retrieve all shared bookings
  getBookings() {
    return this.sharedBookings;
  }

  // 1. Create a New Transport Request
  createRequest(requestData) {
    const newRequest = {
      id: `TR-${Math.floor(100 + Math.random() * 900)}`,
      farmerId: requestData.farmerId || 'CURRENT_USER',
      farmerName: requestData.farmerName || 'You',
      farmerPhone: requestData.farmerPhone || '+91 98421 99881',
      pickupLocation: requestData.pickupLocation,
      pickupCoords: requestData.pickupCoords || { lat: 11.2850, lng: 77.5800 },
      destinationMarketId: requestData.destinationMarketId || 'MKT-01',
      destinationMarketName: requestData.destinationMarketName || 'Erode Central Agricultural Produce Market',
      produceType: requestData.produceType,
      quantityKg: Number(requestData.quantityKg),
      pickupDate: requestData.pickupDate || new Date().toISOString().split('T')[0],
      preferredTime: requestData.preferredTime || '08:00 AM',
      flexibleWindowMinutes: Number(requestData.flexibleWindowMinutes || 30),
      vehicleTypePreference: requestData.vehicleTypePreference || 'Mini Truck (Tata Ace Gold)',
      maxBudget: Number(requestData.maxBudget || 2500),
      allowSharing: requestData.allowSharing !== false,
      status: 'SEARCHING',
      createdAt: new Date().toISOString()
    };

    this.openRequests.unshift(newRequest);

    // Emit event
    transportEvents.emit('TRANSPORT_REQUEST_CREATED', newRequest);

    return newRequest;
  }

  // 2. Real-Time Compatibility Matching Engine
  findMatches(request) {
    if (!request || !request.allowSharing) return [];

    const candidates = this.openRequests.filter(r => r.id !== request.id && r.status === 'SEARCHING' && r.allowSharing);

    const matches = [];

    for (const candidate of candidates) {
      // Condition 1: Same or nearby destination market
      const sameMarket = candidate.destinationMarketId === request.destinationMarketId;
      if (!sameMarket) continue;

      // Condition 2: Check vehicle capacity fit
      const combinedQuantity = request.quantityKg + candidate.quantityKg;
      const vehicle = this.vehicles.find(v => v.capacityKg >= combinedQuantity);
      if (!vehicle) continue;

      // Condition 3: Pickup Date compatibility
      if (candidate.pickupDate !== request.pickupDate) continue;

      // Score Calculation (Max 100)
      let score = 40; // Base: Destination Match (+40)

      // Time compatibility (simulated difference check)
      const timeDiffMinutes = 15; // Within window
      if (timeDiffMinutes <= 15) score += 20;
      else if (timeDiffMinutes <= 30) score += 10;

      // Pickup Proximity (Simulated distance: 3.2 km)
      const pickupDistanceKm = 3.2;
      if (pickupDistanceKm <= 5.0) score += 20;
      else if (pickupDistanceKm <= 10.0) score += 10;

      // Same preferred vehicle type
      if (candidate.vehicleTypePreference === request.vehicleTypePreference) score += 10;

      // Good capacity fit (>65% load utilization)
      const utilization = (combinedQuantity / vehicle.capacityKg) * 100;
      if (utilization >= 60 && utilization <= 100) score += 10;

      // Cost Calculation using Server-Authoritative Weight-Based Splitting
      const totalVehicleCost = 2000; // Base vehicle charter price to mandi
      const { shareA, shareB, savingsA, savingsB } = this.calculateWeightBasedSplit(
        request.quantityKg,
        candidate.quantityKg,
        totalVehicleCost
      );

      matches.push({
        matchId: `MATCH-${request.id}-${candidate.id}`,
        requestA: request,
        requestB: candidate,
        matchedFarmer: candidate,
        compatibilityScore: Math.min(score, 100),
        combinedQuantity,
        vehicle,
        vehicleCapacity: vehicle.capacityKg,
        totalVehicleCost,
        userShare: shareA,
        otherFarmerShare: shareB,
        userSavings: savingsA,
        otherFarmerSavings: savingsB,
        pickupDistanceKm,
        marketName: candidate.destinationMarketName,
        expiresInSeconds: 180 // 3-minute match countdown
      });
    }

    // Prioritize highest compatibility score first
    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  // 3. Server-Authoritative Cost Splitting Algorithm
  calculateWeightBasedSplit(weightA, weightB, totalCost) {
    const totalWeight = weightA + weightB;
    if (totalWeight === 0) return { shareA: totalCost / 2, shareB: totalCost / 2, savingsA: 0, savingsB: 0 };

    // Strict formula: Share = (Weight / TotalWeight) * TotalCost
    const shareA = Math.round((weightA / totalWeight) * totalCost);
    const shareB = totalCost - shareA; // Guarantees sum equals totalCost down to exact rupee

    // Individual standard solo booking is ₹2,000 each
    const soloCost = totalCost;
    const savingsA = soloCost - shareA;
    const savingsB = soloCost - shareB;

    return { shareA, shareB, savingsA, savingsB };
  }

  // 4. Atomic Transaction: Confirm Shared Booking (Prevents Overbooking & Race Conditions)
  async confirmSharedBooking(match) {
    // Acquire mutex lock
    if (this.isLocked) {
      throw new Error('Transaction in progress. Please retry in a moment.');
    }
    this.isLocked = true;

    try {
      // Re-verify vehicle capacity availability
      const targetVehicle = this.vehicles.find(v => v.id === match.vehicle.id);
      if (!targetVehicle || targetVehicle.status === 'BOOKED') {
        throw new Error('Vehicle capacity is no longer available. Searching for another shared vehicle...');
      }

      if (match.combinedQuantity > targetVehicle.capacityKg) {
        throw new Error(`Combined load (${match.combinedQuantity} kg) exceeds vehicle capacity (${targetVehicle.capacityKg} kg).`);
      }

      // Lock vehicle
      targetVehicle.status = 'BOOKED';

      // Update participant requests status
      const reqA = this.openRequests.find(r => r.id === match.requestA.id);
      const reqB = this.openRequests.find(r => r.id === match.requestB.id);
      if (reqA) reqA.status = 'BOOKED';
      if (reqB) reqB.status = 'BOOKED';

      const bookingId = `ST-${Math.floor(10000 + Math.random() * 90000)}`;

      const newBooking = {
        id: bookingId,
        status: 'DRIVER_ASSIGNED',
        vehicleId: targetVehicle.id,
        vehicleName: targetVehicle.vehicleType,
        vehicleReg: targetVehicle.registrationNumber,
        driver: {
          name: targetVehicle.driverName,
          phone: targetVehicle.driverPhone,
          rating: targetVehicle.driverRating,
          trips: targetVehicle.tripsCompleted
        },
        pickupDate: match.requestA.pickupDate,
        pickupTime: match.requestA.preferredTime,
        destinationMarket: match.marketName,
        totalVehicleCost: match.totalVehicleCost,
        totalCapacity: targetVehicle.capacityKg,
        usedCapacity: match.combinedQuantity,
        remainingCapacity: targetVehicle.capacityKg - match.combinedQuantity,
        costMethod: 'WEIGHT_BASED',
        route: [
          { step: 1, type: 'pickup', title: `Pickup 1: ${match.requestA.pickupLocation}`, farmer: match.requestA.farmerName, qty: `${match.requestA.quantityKg} kg ${match.requestA.produceType}`, time: match.requestA.preferredTime, completed: false },
          { step: 2, type: 'pickup', title: `Pickup 2: ${match.requestB.pickupLocation}`, farmer: match.requestB.farmerName, qty: `${match.requestB.quantityKg} kg ${match.requestB.produceType}`, time: match.requestB.preferredTime, completed: false },
          { step: 3, type: 'market', title: `Destination: ${match.marketName}`, farmer: 'Unloading Bay', qty: `Total ${match.combinedQuantity} kg`, time: '08:55 AM', completed: false }
        ],
        participants: [
          {
            id: `PART-${Date.now()}-1`,
            farmerId: match.requestA.farmerId,
            farmerName: match.requestA.farmerName,
            produceType: match.requestA.produceType,
            quantityKg: match.requestA.quantityKg,
            pickupLocation: match.requestA.pickupLocation,
            costShare: match.userShare,
            soloEstimatedCost: match.totalVehicleCost,
            estimatedSavings: match.userSavings,
            acceptanceStatus: 'ACCEPTED',
            paymentStatus: 'CONFIRMED'
          },
          {
            id: `PART-${Date.now()}-2`,
            farmerId: match.requestB.farmerId,
            farmerName: match.requestB.farmerName,
            produceType: match.requestB.produceType,
            quantityKg: match.requestB.quantityKg,
            pickupLocation: match.requestB.pickupLocation,
            costShare: match.otherFarmerShare,
            soloEstimatedCost: match.totalVehicleCost,
            estimatedSavings: match.otherFarmerSavings,
            acceptanceStatus: 'ACCEPTED',
            paymentStatus: 'CONFIRMED'
          }
        ],
        driverLocation: { lat: 11.2950, lng: 77.5810, address: 'Driver dispatched from Perundurai Hub' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.sharedBookings.unshift(newBooking);

      // Emit real-time events to all participants and driver
      transportEvents.emit('SHARED_BOOKING_CREATED', newBooking);
      transportEvents.emit('DRIVER_ASSIGNED', { bookingId: newBooking.id, driver: newBooking.driver });

      return newBooking;
    } finally {
      // Release mutex lock
      this.isLocked = false;
    }
  }

  // 5. Real-Time Trip Progress Simulator
  updateTripProgress(bookingId, nextStatus) {
    const booking = this.sharedBookings.find(b => b.id === bookingId);
    if (!booking) return null;

    booking.status = nextStatus;
    booking.updatedAt = new Date().toISOString();

    // Update route checklist
    if (nextStatus === 'PICKUP_1_COMPLETED' && booking.route[0]) {
      booking.route[0].completed = true;
      booking.driverLocation = { lat: 11.2910, lng: 77.5750, address: 'Arrived at Pickup 2 (Kunnathur Road)' };
    } else if (nextStatus === 'PICKUP_2_COMPLETED' && booking.route[1]) {
      booking.route[1].completed = true;
      booking.driverLocation = { lat: 11.3150, lng: 77.6400, address: 'In Transit on NH-544 towards Erode Mandi' };
    } else if (nextStatus === 'ARRIVED_MARKET') {
      booking.driverLocation = { lat: 11.3410, lng: 77.7172, address: 'Arrived at Erode Central Mandi Unloading Gate' };
    } else if (nextStatus === 'COMPLETED') {
      if (booking.route[2]) booking.route[2].completed = true;
      booking.driverLocation = { lat: 11.3410, lng: 77.7172, address: 'Trip Completed • Goods Delivered Successfully' };
    }

    transportEvents.emit('TRIP_STATUS_UPDATED', { bookingId, status: nextStatus, booking });
    return booking;
  }

  // 6. Cancellation with Capacity Rebalancing & Policy Preservation
  cancelRequest(requestId) {
    const req = this.openRequests.find(r => r.id === requestId);
    if (req) {
      req.status = 'CANCELLED';
      transportEvents.emit('REQUEST_CANCELLED', { requestId });
      return true;
    }
    return false;
  }
}

export const transportService = new TransportService();
