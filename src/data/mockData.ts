import type { BarberProfile, Service, Booking, CutProfile, Review, BarberEarnings, AdminAlert, PricingConfig } from './types'

// Unsplash portrait images for barbers - men with urban editorial feel
export const BARBER_PHOTOS = {
  ido: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&auto=format',
  omer: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&auto=format',
  daniel: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&auto=format',
  roei: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&auto=format',
  yonatan: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&auto=format',
  adam: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=500&fit=crop&auto=format',
}

export const HAIRCUT_PHOTOS = [
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1584837539680-2c2da74e9ca8?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1605497787998-d4651b9a64f9?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1593702288056-f4578b3e7aa5?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=300&h=300&fit=crop&auto=format',
]

export const SERVICE_PHOTOS = {
  classic: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop&auto=format',
  fade: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop&auto=format',
  beard: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop&auto=format',
  beardOnly: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop&auto=format',
  kid: 'https://images.unsplash.com/photo-1584837539680-2c2da74e9ca8?w=600&h=400&fit=crop&auto=format',
  fatherSon: 'https://images.unsplash.com/photo-1605497787998-d4651b9a64f9?w=600&h=400&fit=crop&auto=format',
  group: 'https://images.unsplash.com/photo-1593702288056-f4578b3e7aa5?w=600&h=400&fit=crop&auto=format',
}

export const HERO_PHOTO = 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&h=1100&fit=crop&auto=format'
export const BARBER_HERO = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=1000&fit=crop&auto=format'
export const KIT_PHOTO = 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900&h=600&fit=crop&auto=format'

const mockReviews: Review[] = [
  {
    id: 'r1', customerId: 'c1', customerName: 'בנימין א.', barberId: 'b1', bookingId: 'bk3',
    resultRating: 5, punctualityRating: 5, cleanlinessRating: 5, communicationRating: 5,
    overallRating: 5, comment: 'עידו מדהים, הפייד בדיוק כמו שביקשתי. הגיע בזמן ומסר ניקוי מלא.',
    date: '2025-01-15', relevantStyle: 'Low Fade'
  },
  {
    id: 'r2', customerId: 'c2', customerName: 'אלון מ.', barberId: 'b1', bookingId: 'bk4',
    resultRating: 5, punctualityRating: 4, cleanlinessRating: 5, communicationRating: 5,
    overallRating: 5, comment: 'שלח תמונה מראש, שאל שאלות רלוונטיות. תוצאה מושלמת.',
    date: '2025-01-10', relevantStyle: 'Low Fade'
  },
  {
    id: 'r3', customerId: 'c3', customerName: 'דוד ר.', barberId: 'b2', bookingId: 'bk5',
    resultRating: 5, punctualityRating: 5, cleanlinessRating: 5, communicationRating: 5,
    overallRating: 5, comment: 'עומר מעולה עם ילדים, ממולץ בחום.', date: '2025-01-08'
  },
  {
    id: 'r4', customerId: 'c4', customerName: 'יואב כ.', barberId: 'b3', bookingId: 'bk6',
    resultRating: 5, punctualityRating: 5, cleanlinessRating: 4, communicationRating: 5,
    overallRating: 5, comment: 'Skin Fade מושלם. דניאל יודע מה הוא עושה.', date: '2025-01-05'
  },
]

export const mockBarbers: BarberProfile[] = [
  {
    id: 'b1', userId: 'u_b1', name: 'עידו לוי', nameEn: 'Ido Levi',
    bio: 'ספר עצמאי עם 7 שנות ניסיון. מתמחה ב-Low Fade ובשיער מתולתל. עבדתי במספרות בתל אביב ולונדון לפני שפתחתי את השירות הנייד שלי.',
    photoUrl: BARBER_PHOTOS.ido, verified: true, yearsExperience: 7, completedBookings: 312,
    specialties: ['Low Fade', 'שיער מתולתל', 'זקן', 'Textured Crop'],
    languages: ['עברית', 'אנגלית'], serviceAreas: ['רחביה', 'קטמון', 'בקעה', 'מרכז'],
    equipment: ['מכונת תספורת מקצועית', 'מספריים יפניות', 'מכונת זקן', 'שלוש מספריות גימור', 'שמן לזקן', 'כף ידיים'],
    rating: 4.9, relevantRating: 4.9, cleanlinessRating: 4.9, arrivalReliability: 97,
    cancellationRate: 1.2, neighbourhood: 'רחביה',
    currentLat: 31.776, currentLng: 35.213, available: true, nextAvailable: 'עכשיו',
    basePrice: 179, status: 'available', arrivalMinutes: 42,
    portfolio: [
      { id: 'p1', imageUrl: HAIRCUT_PHOTOS[0], style: 'Low Fade', tags: ['fade', 'curly'] },
      { id: 'p2', imageUrl: HAIRCUT_PHOTOS[1], style: 'Skin Fade', tags: ['fade', 'clean'] },
      { id: 'p3', imageUrl: HAIRCUT_PHOTOS[2], style: 'Beard Trim', tags: ['beard'] },
      { id: 'p4', imageUrl: HAIRCUT_PHOTOS[3], style: 'Textured Crop', tags: ['crop', 'texture'] },
      { id: 'p5', imageUrl: HAIRCUT_PHOTOS[4], style: 'Low Fade + Beard', tags: ['fade', 'beard'] },
      { id: 'p6', imageUrl: HAIRCUT_PHOTOS[5], style: 'Classic Cut', tags: ['classic'] },
    ],
    reviews: mockReviews.filter(r => r.barberId === 'b1'),
  },
  {
    id: 'b2', userId: 'u_b2', name: 'עומר כהן', nameEn: 'Omer Cohen',
    bio: 'ספר עם 5 שנות ניסיון, מתמחה בתספורות קלאסיות, ילדים ואב ובן. יודע להרגיע ילדים קטנים ולהוציא את הטוב ביותר מכל תספורת.',
    photoUrl: BARBER_PHOTOS.omer, verified: true, yearsExperience: 5, completedBookings: 245,
    specialties: ['תספורת קלאסית', 'ילדים', 'אב ובן', 'Mid Fade'],
    languages: ['עברית', 'ערבית'], serviceAreas: ['בקעה', 'גן העיר', 'תלפיות', 'ארנונה'],
    equipment: ['מכונת תספורת', 'מספריים', 'מכונת זקן', 'ציוד ילדים מיוחד'],
    rating: 4.8, relevantRating: 4.9, cleanlinessRating: 4.8, arrivalReliability: 95,
    cancellationRate: 2.1, neighbourhood: 'בקעה',
    currentLat: 31.769, currentLng: 35.218, available: true, nextAvailable: 'עכשיו',
    basePrice: 149, status: 'available', arrivalMinutes: 28,
    portfolio: [
      { id: 'p7', imageUrl: HAIRCUT_PHOTOS[2], style: 'Classic', tags: ['classic'] },
      { id: 'p8', imageUrl: HAIRCUT_PHOTOS[5], style: 'Kids Cut', tags: ['kids'] },
      { id: 'p9', imageUrl: HAIRCUT_PHOTOS[6], style: 'Father & Son', tags: ['kids', 'classic'] },
    ],
    reviews: mockReviews.filter(r => r.barberId === 'b2'),
  },
  {
    id: 'b3', userId: 'u_b3', name: 'דניאל אברהם', nameEn: 'Daniel Avraham',
    bio: 'מומחה ב-Skin Fade ו-Textured Crop. 6 שנות ניסיון, עבדתי עם שחקני כדורגל ומוסיקאים. כל תספורת מדויקת עד הפרט האחרון.',
    photoUrl: BARBER_PHOTOS.daniel, verified: true, yearsExperience: 6, completedBookings: 289,
    specialties: ['Skin Fade', 'Textured Crop', 'High Fade', 'Design Lines'],
    languages: ['עברית', 'אנגלית', 'ספרדית'], serviceAreas: ['מרכז העיר', 'נחלאות', 'מחנה יהודה', 'גאולה'],
    equipment: ['מכונת Wahl Cordless', 'Andis Outliner', 'מספריים Jaguar', 'גימור מדויק'],
    rating: 4.9, relevantRating: 4.9, cleanlinessRating: 4.7, arrivalReliability: 92,
    cancellationRate: 3.0, neighbourhood: 'מרכז העיר',
    currentLat: 31.782, currentLng: 35.221, available: true, nextAvailable: 'עכשיו',
    basePrice: 169, status: 'travelling', arrivalMinutes: 51,
    portfolio: [
      { id: 'p10', imageUrl: HAIRCUT_PHOTOS[1], style: 'Skin Fade', tags: ['fade', 'skin'] },
      { id: 'p11', imageUrl: HAIRCUT_PHOTOS[3], style: 'Textured Crop', tags: ['crop'] },
      { id: 'p12', imageUrl: HAIRCUT_PHOTOS[7], style: 'High Fade', tags: ['fade', 'high'] },
    ],
    reviews: mockReviews.filter(r => r.barberId === 'b3'),
  },
  {
    id: 'b4', userId: 'u_b4', name: 'רועי מלכה', nameEn: 'Roi Malka',
    bio: 'ספר מסורתי עם גישה מודרנית. מתמחה בעיצוב זקן ותספורות קלאסיות. 9 שנים בתחום, ידיים יציבות ועין אסתטית.',
    photoUrl: BARBER_PHOTOS.roei, verified: true, yearsExperience: 9, completedBookings: 401,
    specialties: ['עיצוב זקן', 'תספורת קלאסית', 'Straight Razor', 'Low Fade'],
    languages: ['עברית', 'צרפתית'], serviceAreas: ['נחלאות', 'רחביה', 'קרית שמואל', 'ממילא'],
    equipment: ['מכונת תספורת', 'מספריים אמריקאיות', 'תער ישר', 'מוצרי זקן פרמיום'],
    rating: 4.7, relevantRating: 4.8, cleanlinessRating: 4.9, arrivalReliability: 98,
    cancellationRate: 0.8, neighbourhood: 'נחלאות',
    currentLat: 31.780, currentLng: 35.209, available: true, nextAvailable: 'עכשיו',
    basePrice: 159, status: 'available', arrivalMinutes: 35,
    portfolio: [
      { id: 'p13', imageUrl: HAIRCUT_PHOTOS[2], style: 'Beard Shape', tags: ['beard'] },
      { id: 'p14', imageUrl: HAIRCUT_PHOTOS[0], style: 'Classic Cut', tags: ['classic'] },
    ],
    reviews: [],
  },
  {
    id: 'b5', userId: 'u_b5', name: 'יונתן ביטון', nameEn: 'Yonatan Biton',
    bio: 'מתמחה בשיער ארוך ותספורות במספריים. גישה יצירתית, עובד עם כל סוגי השיער. הכשרה בפריז.',
    photoUrl: BARBER_PHOTOS.yonatan, verified: true, yearsExperience: 8, completedBookings: 198,
    specialties: ['שיער ארוך', 'Scissor Cut', 'Layer Cut', 'תספורת יצירתית'],
    languages: ['עברית', 'צרפתית', 'אנגלית'], serviceAreas: ['המושבה הגרמנית', 'בקעה', 'ארנונה'],
    equipment: ['מספריים Yasaka', 'מספריים דקה', 'מכונת גימור', 'מוצרי עיצוב'],
    rating: 4.8, relevantRating: 4.8, cleanlinessRating: 4.8, arrivalReliability: 94,
    cancellationRate: 1.5, neighbourhood: 'המושבה הגרמנית',
    currentLat: 31.762, currentLng: 35.214, available: true, nextAvailable: 'עוד שעה',
    basePrice: 189, status: 'busy', arrivalMinutes: 60,
    portfolio: [
      { id: 'p15', imageUrl: HAIRCUT_PHOTOS[6], style: 'Long Hair', tags: ['long'] },
      { id: 'p16', imageUrl: HAIRCUT_PHOTOS[7], style: 'Textured', tags: ['texture'] },
    ],
    reviews: [],
  },
  {
    id: 'b6', userId: 'u_b6', name: 'אדם חורי', nameEn: 'Adam Khouri',
    bio: 'מומחה לשיער מתולתל ופייד. עובד עם טכניקות מיוחדות לשיער מסולסל ואפרו. כל לקוח מקבל יחס אישי.',
    photoUrl: BARBER_PHOTOS.adam, verified: true, yearsExperience: 5, completedBookings: 167,
    specialties: ['שיער מתולתל', 'Afro', 'Fade', 'עיצוב זקן'],
    languages: ['עברית', 'ערבית', 'אנגלית'], serviceAreas: ['טלביה', 'ק. שמואל', 'רחביה', 'מרכז'],
    equipment: ['מכונת Oster Fast Feed', 'מספריים למתולתל', 'Denman Brush', 'מוצרי curl'],
    rating: 4.9, relevantRating: 4.9, cleanlinessRating: 4.8, arrivalReliability: 93,
    cancellationRate: 2.0, neighbourhood: 'טלביה',
    currentLat: 31.774, currentLng: 35.216, available: true, nextAvailable: 'עכשיו',
    basePrice: 169, status: 'available', arrivalMinutes: 46,
    portfolio: [
      { id: 'p17', imageUrl: HAIRCUT_PHOTOS[0], style: 'Curly Fade', tags: ['curly', 'fade'] },
      { id: 'p18', imageUrl: HAIRCUT_PHOTOS[4], style: 'Afro', tags: ['afro', 'curly'] },
    ],
    reviews: [],
  },
]

export const mockServices: Service[] = [
  {
    id: 's_classic', nameHe: 'תספורת קלאסית',
    description: 'תספורת מלאה עם מספריים ומכונה. מתאים לכל סוגי השיער.',
    included: ['תספורת מלאה', 'גימור מכונה', 'עיצוב ראשוני', 'ניקוי מלא'],
    scheduledPrice: 129, immediatePrice: 159, durationMinutes: 30, imageUrl: SERVICE_PHOTOS.classic, available: true,
  },
  {
    id: 's_fade', nameHe: 'פייד',
    description: 'Fade מדויק לפי הבקשה שלך. Low, Mid, High או Skin Fade.',
    included: ['פייד מדויק', 'גימור עם מכונה', 'עיצוב קו', 'ניקוי מלא'],
    scheduledPrice: 149, immediatePrice: 179, durationMinutes: 40, imageUrl: SERVICE_PHOTOS.fade, available: true,
  },
  {
    id: 's_beard', nameHe: 'תספורת וזקן',
    description: 'תספורת מלאה בשילוב עיצוב וגיזום זקן. שירות כולל.',
    included: ['תספורת מלאה', 'עיצוב זקן', 'גימור', 'שמן זקן', 'ניקוי מלא'],
    scheduledPrice: 189, immediatePrice: 219, durationMinutes: 55, imageUrl: SERVICE_PHOTOS.beard, available: true,
  },
  {
    id: 's_beard_only', nameHe: 'סידור זקן',
    description: 'גיזום ועיצוב זקן בלבד. מדויק ומהיר.',
    included: ['עיצוב זקן', 'גיזום', 'שמן זקן', 'ניקוי'],
    scheduledPrice: 89, immediatePrice: 109, durationMinutes: 20, imageUrl: SERVICE_PHOTOS.beardOnly, available: true,
  },
  {
    id: 's_kid', nameHe: 'תספורת לילד',
    description: 'תספורת מותאמת לילדים עד גיל 12. סבלנות וחוויה נעימה.',
    included: ['תספורת מלאה', 'ניקוי', 'גישה מותאמת לילדים'],
    scheduledPrice: 119, immediatePrice: 139, durationMinutes: 30, imageUrl: SERVICE_PHOTOS.kid, available: true,
  },
  {
    id: 's_father_son', nameHe: 'אב ובן',
    description: 'שתי תספורות — לאב ולבן. חוויה משותפת עם הנחה.',
    included: ['שתי תספורות מלאות', 'גיזום', 'ניקוי כפול'],
    scheduledPrice: 239, immediatePrice: 279, durationMinutes: 65, imageUrl: SERVICE_PHOTOS.fatherSon, available: true,
  },
  {
    id: 's_group', nameHe: 'Group Cut',
    description: 'שלושה אנשים ומעלה באותה כתובת. מחיר טוב יותר לכולם.',
    included: ['תספורות לקבוצה', 'ניהול תור', 'מחיר קבוצתי'],
    scheduledPrice: 119, immediatePrice: 139, durationMinutes: 40, imageUrl: SERVICE_PHOTOS.group, available: true,
  },
]

export const mockCutProfile: CutProfile = {
  id: 'cp1', customerId: 'demo_customer',
  name: 'הקאט הרגיל שלי',
  sideLength: '0.5 (מספר 1.5)',
  fadeHeight: 'Low Fade',
  topLength: '4 ס"מ',
  neckline: 'קו עורף טבעי',
  beardLength: '6 מ"מ',
  product: 'אמולסיה קלה',
  barberNotes: 'שיער מתולתל — לא לקצר יותר מדי למעלה. פייד מסיים ב-1.5.',
  customerNotes: 'להשאיר קצת ווליום למעלה. זקן מסודר אבל לא חד מדי.',
  photos: {
    front: HAIRCUT_PHOTOS[0],
    right: HAIRCUT_PHOTOS[1],
    left: HAIRCUT_PHOTOS[3],
    back: HAIRCUT_PHOTOS[4],
  },
  createdAt: '2025-01-15',
  barberId: 'b1',
}

export const mockBookings: Booking[] = [
  {
    id: 'bk1', customerId: 'demo_customer', barberId: 'b1', serviceId: 's_fade',
    address: { street: 'רחוב עזה', number: '32', city: 'ירושלים', floor: '3', apartment: '12', locationType: 'home' },
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'travelling',
    haircutBrief: { option: 'repeat', notes: 'כמו תמיד' },
    servicePrice: 179, arrivalFee: 0, urgencyFee: 30, groupDiscount: 0, finalPrice: 209,
    estimatedArrivalMinutes: 12, estimatedArrivalTime: '19:42',
    estimatedDuration: 40, isImmediate: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'bk2', customerId: 'demo_customer', barberId: 'b2', serviceId: 's_classic',
    address: { street: 'רחוב עזה', number: '32', city: 'ירושלים', locationType: 'home' },
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'accepted',
    haircutBrief: { option: 'repeat' },
    servicePrice: 129, arrivalFee: 0, urgencyFee: 0, groupDiscount: 0, finalPrice: 129,
    estimatedArrivalMinutes: 28, estimatedArrivalTime: '11:00',
    estimatedDuration: 30, isImmediate: false, createdAt: new Date().toISOString(),
  },
  {
    id: 'bk3', customerId: 'demo_customer', barberId: 'b1', serviceId: 's_fade',
    address: { street: 'רחוב עזה', number: '32', city: 'ירושלים', locationType: 'home' },
    scheduledTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    haircutBrief: { option: 'repeat' },
    servicePrice: 149, arrivalFee: 0, urgencyFee: 0, groupDiscount: 0, finalPrice: 149,
    estimatedArrivalMinutes: 42, estimatedArrivalTime: '17:30',
    estimatedDuration: 40, isImmediate: false, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 80 * 60 * 1000).toISOString(),
    customerRating: { result: 5, punctuality: 5, cleanliness: 5, communication: 5, tip: 20, comment: 'מושלם!' },
    barberNotes: { sideLength: '1.5', fadeHeight: 'Low', topLength: '4cm', neckline: 'Natural', beardLength: '6mm', product: 'Emulsion', notes: '' },
  },
  {
    id: 'bk4', customerId: 'demo_customer', barberId: 'b3', serviceId: 's_beard',
    address: { street: 'רחוב עזה', number: '32', city: 'ירושלים', locationType: 'home' },
    scheduledTime: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    haircutBrief: { option: 'repeat' },
    servicePrice: 189, arrivalFee: 0, urgencyFee: 0, groupDiscount: 0, finalPrice: 189,
    estimatedArrivalMinutes: 51, estimatedArrivalTime: '16:00',
    estimatedDuration: 55, isImmediate: false, createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000 + 100 * 60 * 1000).toISOString(),
    customerRating: { result: 5, punctuality: 4, cleanliness: 5, communication: 5, tip: 15, comment: 'מדהים' },
  },
  {
    id: 'bk5', customerId: 'demo_customer', barberId: 'b2', serviceId: 's_kid',
    address: { street: 'רחוב עזה', number: '32', city: 'ירושלים', locationType: 'home' },
    scheduledTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    haircutBrief: { option: 'barber_choice' },
    servicePrice: 119, arrivalFee: 0, urgencyFee: 0, groupDiscount: 0, finalPrice: 119,
    estimatedArrivalMinutes: 28, estimatedArrivalTime: '10:00',
    estimatedDuration: 30, isImmediate: false, createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    customerRating: { result: 5, punctuality: 5, cleanliness: 5, communication: 5, tip: 10, comment: '' },
  },
]

export const mockBarberEarnings: BarberEarnings = {
  today: 586, thisWeek: 2840, thisMonth: 11200,
  pending: 586, tips: 120, platformFees: 1430, workingHours: 6.5, travelHours: 1.2,
  revenuePerHour: 90,
  completedPayouts: [
    { date: '2025-01-14', amount: 2340, bookings: 16 },
    { date: '2025-01-07', amount: 2780, bookings: 19 },
    { date: '2024-12-31', amount: 3100, bookings: 22 },
    { date: '2024-12-24', amount: 2650, bookings: 18 },
  ],
}

export const mockAdminAlerts: AdminAlert[] = [
  { id: 'a1', type: 'delay', message: 'הספר עומר כהן מאחר ב-20 דקות להזמנה bk2', bookingId: 'bk2', severity: 'medium', createdAt: new Date().toISOString() },
  { id: 'a2', type: 'no_supply', message: 'אין ספרים זמינים בגבעת שאול — 3 בקשות ממתינות', neighbourhood: 'גבעת שאול', severity: 'high', createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
  { id: 'a3', type: 'complaint', message: 'תלונה מלקוח על ניקיון — הזמנה bk4', bookingId: 'bk4', severity: 'low', createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
]

export const mockPricingConfig: PricingConfig = {
  services: {
    s_classic: { scheduled: 129, immediate: 159 },
    s_fade: { scheduled: 149, immediate: 179 },
    s_beard: { scheduled: 189, immediate: 219 },
    s_beard_only: { scheduled: 89, immediate: 109 },
    s_kid: { scheduled: 119, immediate: 139 },
    s_father_son: { scheduled: 239, immediate: 279 },
    s_group: { scheduled: 119, immediate: 139 },
  },
  urgencyFee: 30,
  arrivalFee: 0,
  maxDistanceKm: 8,
  groupDiscounts: { 2: 0.22, 3: 0.33, 4: 0.38 },
  peakMultiplier: 1.2,
  minBarberPayout: 100,
  platformCommission: 0.20,
}

export const DEMO_CUSTOMER = {
  id: 'demo_customer',
  name: 'בנימין',
  phone: '050-1234567',
  email: 'benjamin@example.com',
  savedAddresses: [{ street: 'רחוב עזה', number: '32', city: 'ירושלים', floor: '3', apartment: '12', locationType: 'home' as const }],
}
