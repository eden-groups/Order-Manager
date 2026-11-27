// Shared configuration & bilingual dictionary (English & Malayalam)
window.HAMPER_CONFIG = {
  // Paste your deployed Google Apps Script Web App URL here:
  GOOGLE_SHEET_WEB_APP_URL:
    "https://script.google.com/macros/s/AKfycbxO3d4fqoA1dl77bncOJwEr5Lvsl6NavkrT5pmIZj18K2RqVMUSC7zGpT1wLiEiOARl/exec",
  DAILY_ORDER_LIMIT: 100,
};

window.HAMPER_TRANSLATIONS = {
  en: {
    // Under en:
    badge: "Can't be home this Christmas? Send the love instead",
    title: "Your Love, <span>Wrapped & Delivered</span> With Us",
    subtitle:
      "A little box of happiness and a special glimpse of joy—your order will be delivered with love to your loved ones, carrying your warmth wrapped with us to the ones you love.",

    card1_badge: "✨ Best Seller",
    card1_title: "The Classic Noel Basket",
    card1_desc:
      "A little box of happiness—a neatly presented box with a rich spiced holiday bake, cozy scented candle, custom photo keepsake card, and bite-sized sweet confections, delivered with love to your loved ones.",
    card1_cta: "Select Classic Noel",

    card2_badge: "✨ Festive Favorite",
    card2_title: "The Festive Cellar Basket",
    card2_desc:
      "A special glimpse of joy—everything from The Classic Noel Basket elevated with golden-wrapped confections and a celebratory festive bottle, carrying your love with us to the ones you cherish.",
    card2_cta: "Select Festive Cellar",

    card3_badge: "✨ Signature Choice",
    card3_title: "Eden Signature Hamper",
    card3_desc:
      "Our curated luxury experience—everything from The Festive Cellar Basket plus cheerful holiday caps, premium dried fruits, and a small wrapped surprise note, presented in our premium wicker basket.",
    card3_cta: "Select Eden Signature",
    card4_badge: "✨ Exclusive Table Add-On",
    card4_title: "The Grand Bethlehem Reserve",
    card4_desc:
      "An elevated festive upgrade built on our signature hamper—bringing together a richer holiday bake, celebratory wine, cozy Christmas mugs, cheerful caps, and a hidden Christmas decorative surprise ready to unbox.",
    card4_cta: "Reserve Bethlehem Add-On",
    card4_surprise: "A special Christmas decorative surprise tucked inside.",

    // -- Curated Perks Text --
    complimentary_cherry_badge:
      "✨ Complimentary Cherry Fruits added to your box!",
    box_status_cherry: "Cherry Fruits packed & box sealed!",

    complimentary_cookie_badge:
      "✨ Complimentary Butter Cookies added to your box!",
    box_status_cookie: "Butter Cookies packed & box sealed!",

    complimentary_surprise_badge: "✨ Personal Surprise Note tucked inside!",
    box_status_surprise: "Surprise note sealed inside!",

    // -- NEW PERK TEXT FOR ₹3900 TIER --
    complimentary_surprise_luxe_badge:
      "✨ A special surprise awaits you inside!",
    box_status_surprise_luxe: "A special surprise awaits you inside!",

    wa_card_title: "Prefer Ordering on WhatsApp?",
    wa_card_desc:
      "Reach out to us directly on WhatsApp or scan the QR code to chat with us and place your Christmas hamper order effortlessly.",
    wa_card_btn: "Chat & Order on WhatsApp",
    wa_qr_caption: "Scan to Order on WhatsApp",
    close_btn: "Close",

    form_heading: "Delivery Details",
    name_label: "Your Full Name *",
    name_ph: "Enter your name",
    wa_label: "WhatsApp Number *",
    wa_ph: "e.g. +91 98765 43210",
    addr_label: "Exact Delivery Address *",
    addr_ph: "House/Flat name, Street, Area, PIN code",
    landmark_label: "Nearby Landmark *",
    landmark_ph: "Near church, junction, school, etc.",
    contact_label: "Delivery Contact Phone Number *",
    contact_ph: "Phone number of person receiving delivery",
    photo_label: "Greeting Card Photo (Optional)",
    photo_hint:
      "Upload a photo for your greeting card. If you skip this, we'll print a cheerful Christmas theme for you.",
    photo_too_large: "Please choose a photo smaller than 8 MB.",
    note_label: "Personal Note for the Card / Order (Optional)",
    note_ph: "Write a warm Christmas wish or any special instruction...",
    daily_limit_error: "Order limit for the day is done, please try tomorrow.",
    submit_btn: "Place Order",
    submitting_btn: "Placing Order...",
    success_title: "Order Placed Successfully!",
    success_msg:
      "Thank you! Your order is placed. One of our executives will reach out to you shortly over the given WhatsApp number to confirm delivery.",
    success_summary_hamper: "Hamper:",
    success_summary_addon: "Complimentary Gift:",
    success_summary_wa: "WhatsApp:",
    success_ok_btn: "Done",
    card3_surprise: "A cute little surprise tucked inside for you.",
    iritty_notice: "Orders accepted within a 20 km radius of Iritty.",
    order_btn: "Order Now",
  },
  ml: {
    // Under ml:
    badge:
      "ഈ ക്രിസ്മസിന് വീട്ടിലെത്താൻ കഴിയുന്നില്ലേ? പകരം നിങ്ങളുടെ സ്നേഹം അയക്കൂ",
    title:
      "നിങ്ങളുടെ സ്നേഹം <span>ഞങ്ങളോടൊപ്പം പൊതിഞ്ഞ്</span> പ്രിയപ്പെട്ടവരിലേക്ക്",
    subtitle:
      "സന്തോഷത്തിന്റെ ഒരു കൊച്ചു പെട്ടിയും ആഹ്ലാദത്തിന്റെ പ്രത്യേക നിമിഷങ്ങളും—നിങ്ങളുടെ ഓർഡർ നിറഞ്ഞ സ്നേഹത്തോടെ പ്രിയപ്പെട്ടവരിലേക്ക് ഞങ്ങൾ എത്തിച്ചു നൽകുന്നു.",

    card1_badge: "✨ ബെസ്റ്റ് സെല്ലർ",
    card1_title: "ദി ക്ലാസിക് നോയൽ ബാസ്കറ്റ്",
    card1_desc:
      "സന്തോഷത്തിന്റെ ഒരു കൊച്ചു പെട്ടി—രുചികരമായ ഹോളിഡേ കേക്ക്, കാൻഡിൽ, ഫോട്ടോ കാർഡ്, കുഞ്ഞൻ മധുരവിഭവങ്ങൾ എന്നിവ നിറഞ്ഞ സ്നേഹത്തോടെ പ്രിയപ്പെട്ടവരിലേക്ക്.",
    card1_cta: "ക്ലാസിക് നോയൽ തിരഞ്ഞെടുക്കുക",

    card2_badge: "✨ ഫെസ്റ്റീവ് ഫേവറിറ്റ്",
    card2_title: "ദി ഫെസ്റ്റീവ് സെല്ലർ ബാസ്കറ്റ്",
    card2_desc:
      "ആഹ്ലാദത്തിന്റെ പ്രത്യേക നിമിഷങ്ങൾ—ക്ലാസിക് നോയൽ ബാസ്കറ്റിലെ വിഭവങ്ങൾക്കൊപ്പം സ്വർണ്ണപ്പൊതിയിൽ ഒരുങ്ങിയ മധുരവിഭവങ്ങളും ഒരു ഫെസ്റ്റീവ് ബോട്ടിലും ചേർത്ത് നിങ്ങളുടെ സ്നേഹം ഞങ്ങളോടൊപ്പം എത്തിക്കുന്നു.",
    card2_cta: "ഫെസ്റ്റീവ് സെല്ലർ തിരഞ്ഞെടുക്കുക",

    card3_badge: "✨ സിഗ്നേച്ചർ ചോയ്‌സ്",
    card3_title: "ഈഡൻ സിഗ്നേച്ചർ ഹാംപർ",
    card3_desc:
      "ഞങ്ങളുടെ എക്സ്ക്ലൂസീവ് ലക്ഷ്വറി അനുഭവം—ഫെസ്റ്റീവ് സെല്ലർ ബാസ്കറ്റിലെ വിഭവങ്ങൾക്കൊപ്പം ക്രിസ്മസ് തൊപ്പികൾ, ഡ്രൈ ഫ്രൂട്ട്സ്, ഒരു സർപ്രൈസ് നോട്ട് എന്നിവയും ഈഡൻ വുഡൻ പെട്ടിയിൽ.",
    card3_cta: "ഈഡൻ സിഗ്നേച്ചർ തിരഞ്ഞെടുക്കുക",

    // -- NEW ADD-ON TIER --
    card4_badge: "✨ എക്സ്ക്ലൂസീവ് ഫെസ്റ്റീവ് ആഡ്-ഓൺ",
    card4_title: "ദി ഗ്രാൻഡ് ബെത്‌ലഹേം റിസർവ്",
    card4_desc:
      "സിഗ്നേച്ചർ ഹാംപറിനൊപ്പം കൂടുതൽ ആഘോഷപ്പൊലിമ—പ്രീമിയം കേക്ക്, ഫെസ്റ്റീവ് വൈൻ, ക്രിസ്മസ് മഗ്ഗുകൾ, തൊപ്പികൾ എന്നിവയ്ക്കൊപ്പം ഒരു രഹസ്യ ക്രിസ്മസ് അലങ്കാര സമ്മാനവും സ്നേഹത്തോടെ.",
    card4_cta: "ബെത്‌ലഹേം ആഡ്-ഓൺ തിരഞ്ഞെടുക്കുക",
    card4_surprise:
      "പ്രത്യേക ക്രിസ്മസ് അലങ്കാര സമ്മാനം ഉള്ളിൽ ഒരുക്കിയിട്ടുണ്ട്.",
    wa_card_title: "വാട്ട്‌സ്ആപ്പ് വഴി ഓർഡർ ചെയ്യണോ?",
    wa_card_desc:
      "ഞങ്ങളുടെ നമ്പറിൽ വാട്ട്‌സ്ആപ്പ് വഴി ബന്ധപ്പെടുകയോ ക്യുആർ (QR) കോഡ് സ്കാൻ ചെയ്യുകയോ ചെയ്ത് നിങ്ങൾക്ക് അവിടെയും ഓർഡറുകൾ നൽകാവുന്നതാണ്.",
    wa_card_btn: "വാട്ട്‌സ്ആപ്പിൽ ഓർഡർ ചെയ്യുക",
    wa_qr_caption: "സ്കാൻ ചെയ്ത് ഓർഡർ ചെയ്യൂ",
    order_btn: "ഓർഡർ ചെയ്യുക",
    close_btn: "അടയ്ക്കുക",
    complimentary_cherry_badge:
      "✨ സൗജന്യ ചെറി ഫ്രൂട്ട്സ് നിങ്ങളുടെ ബോക്സിൽ ചേർത്തിട്ടുണ്ട്!",
    box_status_cherry: "ചെറി ഫ്രൂട്ട്സ് ചേർത്ത് ബോക്സ് അടച്ചിരിക്കുന്നു!",

    complimentary_cookie_badge:
      "✨ സൗജന്യ ബട്ടർ കുക്കീസ് നിങ്ങളുടെ ബോക്സിൽ ചേർത്തിട്ടുണ്ട്!",
    box_status_cookie: "ബട്ടർ കുക്കീസ് ചേർത്ത് ബോക്സ് അടച്ചിരിക്കുന്നു!",

    complimentary_surprise_badge:
      "✨ ഒരു സർപ്രൈസ് നോട്ട് ബോക്സിൽ ഉൾപ്പെടുത്തിയിട്ടുണ്ട്!",
    box_status_surprise: "സർപ്രൈസ് നോട്ട് സുരക്ഷിതമായി ബോക്സിൽ!",

    // -- NEW PERK TEXT FOR ₹3900 TIER --
    complimentary_surprise_luxe_badge:
      "✨ നിങ്ങൾക്കായി ഒരു പ്രത്യേക സർപ്രൈസ് ഉള്ളിൽ കാത്തിരിക്കുന്നു!",
    box_status_surprise_luxe:
      "നിങ്ങൾക്കായി ഒരു പ്രത്യേക സർപ്രൈസ് ഉള്ളിൽ കാത്തിരിക്കുന്നു!",
    form_heading: "ഡെലിവറി വിവരങ്ങൾ",
    name_label: "നിങ്ങളുടെ മുഴുവൻ പേര് *",
    name_ph: "പേര് നൽകുക",
    wa_label: "വാട്ട്‌സ്ആപ്പ് നമ്പർ *",
    wa_ph: "ഉദാ: +91 98765 43210",
    addr_label: "കൃത്യമായ മേൽവിലാസം *",
    addr_ph: "വീട്ടുപേര്, സ്ഥലം, പിൻ കോഡ്",
    landmark_label: "അടുത്തുള്ള ലാൻഡ്‌മാർക്ക് *",
    landmark_ph: "പള്ളി, ജംഗ്ഷൻ, സ്കൂൾ മുതലായവ",
    contact_label: "ഡെലിവറി സമയത്ത് ബന്ധപ്പെടേണ്ട ഫോൺ നമ്പർ *",
    contact_ph: "സാധനം കൈപ്പറ്റുന്ന ആളുടെ ഫോൺ നമ്പർ",
    photo_label: "ഗ്രീറ്റിംഗ് കാർഡിൽ പ്രിന്റ് ചെയ്യാനുള്ള ഫോട്ടോ (ഓപ്ഷണൽ)",
    photo_hint:
      "കാർഡിൽ പ്രിന്റ് ചെയ്യാൻ ഫോട്ടോ തിരഞ്ഞെടുക്കുക. ഫോട്ടോ നൽകിയില്ലെങ്കിൽ മനോഹരമായ ക്രിസ്മസ് തീം ഞങ്ങൾ പ്രിന്റ് ചെയ്യുന്നതാണ്.",
    photo_too_large: "8 MB-ൽ താഴെയുള്ള ഫോട്ടോ തിരഞ്ഞെടുക്കുക.",
    note_label: "കാർഡിലേക്കോ ഓർഡറിനൊപ്പമോ ഉള്ള കുറിപ്പ് (ഓപ്ഷണൽ)",
    note_ph: "ക്രിസ്മസ് ആശംസയോ പ്രത്യേക കുറിപ്പോ എഴുതുക...",
    daily_limit_error:
      "ഇന്നത്തെ ഓർഡർ പരിധി പൂർത്തിയായി, ദയവായി നാളെ ശ്രമിക്കുക.",
    submit_btn: "ഓർഡർ ഉറപ്പാക്കുക",
    submitting_btn: "ഓർഡർ സമർപ്പിക്കുന്നു...",
    success_title: "ഓർഡർ വിജയകരമായി നൽകി!",
    success_msg:
      "നന്ദി! നിങ്ങളുടെ ഓർഡർ ലഭിച്ചിരിക്കുന്നു. തുടർനടപടികൾക്കായി ഞങ്ങളുടെ എക്സിക്യൂട്ടീവ് നിങ്ങൾ നൽകിയ വാട്ട്‌സ്ആപ്പ് നമ്പറിൽ ഉടൻ ബന്ധപ്പെടുന്നതാണ്.",
    success_summary_hamper: "ഹാംപർ:",
    success_summary_addon: "സൗജന്യ സമ്മാനം:",
    success_summary_wa: "വാട്ട്‌സ്ആപ്പ്:",
    success_ok_btn: "ശരി",
    card3_surprise:
      "നിങ്ങൾക്കായി ഉള്ളിൽ ഒരു ചെറിയ ക്യൂട്ട് സർപ്രൈസും ഒളിപ്പിച്ചിട്ടുണ്ട്.",
    iritty_notice:
      "ഇരിട്ടിയിൽ നിന്ന് 20 കി.മീ ചുറ്റളവിലുള്ള ഓർഡറുകൾ സ്വീകരിക്കുന്നതാണ്.",
    order_btn: "ഓർഡർ ചെയ്യുക",
  },
};
