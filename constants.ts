import { Plant, Message } from "./types";

export const INITIAL_PLANTS: Plant[] = [
  {
    id: "p1",
    name: "Monstera Deliciosa",
    species: "Philodendron",
    location: "Living Room",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYvP4geCqmIlDxyA8NzKtEyO6bK3_ZWG_VKtWy40ZKbw1T6zEXo2UOGlLr-y47_TNhMWNFMsL2CaLftyK0kV5juMOXNdJJzX_7HYeXQZSR45wsl2YrCEZbwmLx14Oh03D-HYy8Aea1dMh31wQQQUdBJA7enDyditRBep8aYFTDwADKRp51y2IFwgkJWNPtb4svgnrw0anhxyKL0pDFNFttW130JkJFdXzipGLVGeuvxH-MCYAwuPLrnZJaDJ6MRZq3ostv9oQSH6ty",
    vitality: 100,
    status: "Excellent",
    metrics: {
      temp: 72,
      moisture: 45,
      reservoir: 60,
      light: 85,
    },
    description:
      "Known for its striking natural leaf holes, this specimen thrives in bright, indirect sunlight. The current ambient data suggests an optimal growing environment. Ensure the top two inches of the topsoil naturally dry out before the next watering cycle to encourage strong root development.",
    isFavorite: true,
  },
  {
    id: "p2",
    name: "Fiddle Leaf Fig",
    species: "Ficus Lyrata",
    location: "Bedroom",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCP6xmk57ZRYbjIf_5FpeaLOLoUEFU56GslMwMRjXAMqEf7_vLa-5CAxf3jgJNztU9TC4yG8RP4DiIq63H77v4K50avi1XUhq26PQsE1H32teQZY4xW_ugu4osw8tUVjtri8gK4jX-yHif8uZKhoGgdsKEdrdMi_UXrJJK7ys85yRy2DLnFf8u8kAR7-ZsvcixXOly-Gr8ks8R3GS5JaAFGQTWvnNgWsYkxktygeThw15gFTtqR2RXJOxqKWTV4RYDu1ujSsNonZwG9",
    vitality: 82,
    status: "Good",
    metrics: {
      temp: 68,
      moisture: 72,
      reservoir: 30,
      light: 90,
    },
    description:
      "A beautifully composed Fiddle Leaf Fig tree standing proudly in a woven basket planter. Thrives in highly consistent light environments.",
    isFavorite: false,
  },
  {
    id: "p3",
    name: "Snake Plant",
    species: "Sansevieria",
    location: "Office",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJODcMRGo2uQDWRRrVzESRRv84ak0AK_kbCYsL5zhlaKipGPI0R2NvmRyZG1eDM_CCfkrzBs2bPIeJqyOrMRBC46anwRVacq9gsR5pssdnGLYuCyEahwP-oqOWQOiBL13ctP2yONTRPF2BYUU9zbQ1ykEPGngXPlmax98fN9GOKeL-PafWLKIlgdWBUu65nAiD9yMBI4WuRlAjFuFNVi3winy7HAl9mHAUF4dvh1MFFbKZVHP8p0DRJXjewA8pIP7Fh0zfCUVbdFoT",
    vitality: 45,
    status: "Needs Water",
    metrics: {
      temp: 74,
      moisture: 12,
      reservoir: 5,
      light: 40,
    },
    description:
      "Structural and enduring, perfectly aligned with modern organic design principles. Requires very little water.",
    isFavorite: false,
  },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    role: "bot",
    content: "Hi! I'm Flora, your plant assistant. I can see your live sensor data and history. Ask me anything about your plants!",
    timestamp: new Date(),
  },
];
