const DOWNLOADS_KEY = 'foodimager_download_history';
const USAGE_KEY = 'foodimager_account_usage';
const PROFILE_KEY = 'foodimager_user_profile';
const REQUESTS_KEY = 'foodimager_photo_requests';
const CUSTOM_UPLOADS_KEY = 'foodimager_custom_uploads';

// Download History
export function getDownloadHistory() {
  try {
    const raw = localStorage.getItem(DOWNLOADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addDownloadRecord(food) {
  try {
    const current = getDownloadHistory();
    const newRecord = {
      id: `${food.id}-${Date.now()}`,
      foodId: food.id,
      name: food.name,
      category: food.category,
      foodType: food.foodType,
      filename: food.filename || `${food.name}.jpg`,
      image: food.image,
      resolution: food.resolution || '3840 x 2880',
      fileSize: food.fileSize || '3.2 MB',
      downloadedAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...current].slice(0, 200); // keep up to 200 items
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('foodimager:history-updated'));
    return newRecord;
  } catch (e) {
    console.error('Failed to save download history:', e);
  }
}

export function clearDownloadHistory() {
  try {
    localStorage.removeItem(DOWNLOADS_KEY);
    window.dispatchEvent(new Event('foodimager:history-updated'));
  } catch (e) {
    console.error('Failed to clear download history:', e);
  }
}

// Account Quota & Usage
export function getAccountUsage() {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { }
  return {
    planName: 'Pro Creator',
    downloadsUsed: 142,
    downloadsLimit: 500,
    expiryDate: '15 Nov 2026',
    activeTier: 'pro',
  };
}

export function incrementDownloadCount() {
  try {
    const usage = getAccountUsage();
    usage.downloadsUsed = (usage.downloadsUsed || 0) + 1;
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    window.dispatchEvent(new Event('foodimager:usage-updated'));
    return usage;
  } catch (e) {
    console.error('Failed to increment download count:', e);
  }
}

// User Profile
export function getUserProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { }
  return {
    fullName: 'Ritik Kumar',
    email: 'restrodigitalgrowth@gmail.com',
    restaurantName: 'Saffron Cloud Kitchens & Dine',
    role: 'Executive Chef & Menu Director',
    platforms: ['Zomato', 'Swiggy', 'Blinkit', 'Direct Delivery'],
    avatarUrl: 'https://i.pinimg.com/736x/e0/79/1e/e0791e441aed23844e6768a4a83518ea.jpg',
    bio: 'Overseeing visual menu branding, digital menu conversions, and professional food photography assets across 8 cloud kitchen outlets.',
    autoWatermark: false,
    defaultDownloadFormat: 'original',
  };
}

export function saveUserProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('foodimager:profile-updated'));
    return true;
  } catch {
    return false;
  }
}

// Photo Requests
export function getPhotoRequests() {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { }
  return [
    {
      id: 'req-101',
      dishName: 'Amritsari Kulcha with Chole',
      category: 'North Indian',
      foodType: 'veg',
      platform: 'Zomato & Swiggy',
      priority: 'high',
      status: 'In Studio',
      submittedAt: '2026-10-18T10:30:00.000Z',
      notes: 'Need crispy charred crust and melting cube of white butter on top.',
    },
    {
      id: 'req-102',
      dishName: 'Lotus Biscoff Cheesecake Slice',
      category: 'Cake & Pastry',
      foodType: 'veg',
      platform: 'Swiggy Gourmet',
      priority: 'medium',
      status: 'Ready for Review',
      submittedAt: '2026-10-14T14:15:00.000Z',
      notes: 'Clean slice with glossy biscoff drip and whole biscuit garnish.',
    },
    {
      id: 'req-103',
      dishName: 'Hyderabadi Mutton Marag',
      category: 'Soup',
      foodType: 'non-veg',
      platform: 'Menu Card',
      priority: 'urgent',
      status: 'Under Review',
      submittedAt: '2026-10-21T09:00:00.000Z',
      notes: 'Rich bone broth with saffron and mint oil drops.',
    },
  ];
}

export function addPhotoRequest(request) {
  try {
    const list = getPhotoRequests();
    const item = {
      id: `req-${Date.now().toString().slice(-4)}`,
      status: 'Under Review',
      submittedAt: new Date().toISOString(),
      ...request,
    };
    const updated = [item, ...list];
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
    return item;
  } catch (e) {
    console.error('Failed to add photo request:', e);
    return null;
  }
}

// Custom Uploads (Stored locally for gallery fusion)
export function getCustomUploads() {
  try {
    const raw = localStorage.getItem(CUSTOM_UPLOADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addCustomUploads(items) {
  try {
    const current = getCustomUploads();
    const updated = [...items, ...current];
    localStorage.setItem(CUSTOM_UPLOADS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('foodimager:uploads-updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save custom uploads:', e);
    return [];
  }
}

export function removeCustomUpload(id) {
  try {
    const current = getCustomUploads();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(CUSTOM_UPLOADS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('foodimager:uploads-updated'));
    return updated;
  } catch (e) {
    console.error('Failed to remove custom upload:', e);
    return [];
  }
}
