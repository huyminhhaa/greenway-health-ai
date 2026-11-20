/**
 * English. Typed against the Vietnamese source (vi.ts): a missing or misspelled key fails the build.
 */
import type { vi } from './vi';

type Dict = typeof vi;

export const en: Dict = {
  meta: {
    title: 'Greenway AI Pharmacist',
    description:
      'Message an AI pharmacist the way you text a friend, add photos, get Greenway products with dosage, and buy from the official store.',
  },
  skip: 'Skip to the chat',
  lang: { label: 'Language', vi: 'Tiếng Việt', en: 'English' },

  nav: { home: 'Greenway Global, back to top', main: 'Main', products: 'Products', start: 'Start asking' },

  hero: {
    titleA: 'Describe your symptoms,',
    titleB: 'get a Greenway plan.',
    lead: 'Text it like you would a pharmacist friend. No forms first.',
    askLabel: 'What is bothering you?',
    placeholder: 'For example: I sleep badly and my shoulders ache',
    submit: 'Ask now',
    quickLabel: 'Quick questions',
    quick: [
      { label: 'Poor sleep', text: 'I struggle to sleep and wake up at night' },
      { label: 'Belly fat', text: 'I want to lose belly fat' },
      { label: 'Neck pain', text: 'My neck and shoulders ache and my hands go numb when I wake up' },
      { label: 'High cholesterol', text: 'My cholesterol is a bit high' },
    ],
    sampleLabel: 'Example line from a plan',
    sampleDose: '2 caps',
    sampleStamp: 'after breakfast',
    sampleWhen: 'daily, after breakfast',
    priceAt: 'Price at Greenway',
    pause: 'Pause motion',
    resume: 'Play motion',
  },

  chat: {
    title: 'Talk to the AI pharmacist',
    lead: 'Ask as many questions as you like and add photos if they help. Body metrics are optional.',
    ready: 'AI pharmacist is ready',
    typing: 'AI pharmacist is typing',
    newChat: 'New chat',
    confirmReset: 'Tap again to clear',
    log: 'Conversation',
    who: 'AI pharmacist',
    retry: 'Try again',
    productsLabel: 'Suggested products',
    suggestLabel: 'Suggested follow-ups',
    sentImages: 'Photos sent',
    dropHere: 'Drop photos here to attach them',
    bmiLine: (label: string) => `BMI, ${label.toLowerCase()}`,
    chipUsing: (summary: string) => `The AI pharmacist is using: ${summary}. Click to edit`,
    addMetrics: 'Add body metrics',
    welcome:
      'Hi, I am the Greenway AI pharmacist. What is bothering you, or what would you like to improve? Write naturally, and feel free to attach photos.',
    welcomeSuggestions: [
      'I struggle to sleep and wake up at night',
      'I want to lose belly fat',
      'My neck and shoulders often ache',
      'My cholesterol is a bit high',
    ],
    sendError: (detail: string) =>
      `Your message was not sent${detail ? ` (${detail})` : ''}. It is still here, tap try again.`,
  },

  composer: {
    filesLabel: 'Photos to send',
    remove: (name: string) => `Remove photo ${name}`,
    attach: 'Attach photos',
    inputLabel: 'Message to the AI pharmacist',
    placeholder: 'Message the AI pharmacist…',
    send: 'Send',
    keys: 'Enter to send, Shift + Enter for a new line. ',
    limit: (n: number) => `Attach up to ${n} photos.`,
    notImage: 'only image files are accepted',
    tooBig: (mb: number) => `photos must be under ${mb} MB`,
    tooMany: (n: number) => `up to ${n} photos at a time`,
    skipped: (problems: string) => `Some files were not added: ${problems}.`,
  },

  profile: {
    title: 'Body metrics',
    optional: 'optional',
    note: 'Optional. Fill them in and the AI pharmacist works out your BMI and gives closer advice.',
    gender: 'Sex',
    female: 'Female',
    male: 'Male',
    clear: 'Clear metrics',
    fields: {
      age: { label: 'Age', unit: 'yrs' },
      heightCm: { label: 'Height', unit: 'cm' },
      weightKg: { label: 'Weight', unit: 'kg' },
    },
    range: (min: number, max: number) => `${min} to ${max}`,
    slider: (label: string) => `${label}, drag to choose`,
    empty: 'Not set',
    errNumber: (example: number) => `Enter a number, for example ${example}.`,
    errRange: (label: string, min: number, max: number, unit: string) => `${label} must be ${min} to ${max} ${unit}.`,
    bmiChild: 'Adult BMI does not apply to children under 18.',
    bmiEmpty: 'Add height and weight to see your BMI here.',
    bmiSr: 'BMI ',
    receiptNew: 'The AI pharmacist will use these metrics from the next reply.',
    receiptSent: 'The AI pharmacist has used these metrics.',
    sendMetrics: 'Send metrics for analysis',
  },

  bmi: {
    under: { label: 'Underweight', hint: 'Your body needs more energy and micronutrients.' },
    balanced: { label: 'Healthy', hint: 'Keep your current eating and activity rhythm.' },
    over: { label: 'Slightly overweight', hint: 'Fat is starting to build around the waist.' },
    obese: { label: 'Obese', hint: 'A steady, supervised weight loss protects your heart.' },
  },

  summary: {
    female: 'Female',
    male: 'Male',
    age: (n: number) => `${n} yrs`,
    prefix: 'My metrics:',
  },

  product: {
    byPackage: 'See package',
    readBox: 'follow the box instructions',
    doseSr: 'Suggested dosage: ',
    buy: 'Buy at Greenway',
    opensShop: ' (opens the store)',
    ask: 'Ask the AI pharmacist',
    askMessage: (name: string) => `Tell me about ${name}`,
  },

  units: {
    capsule: 'capsules',
    tablet: 'tablets',
    sachet: 'sachets',
    teabag: 'tea bags',
  },

  needs: {
    sleep: 'Sleep and stress',
    heart: 'Heart and cholesterol',
    joint: 'Bones and joints',
    weight: 'Weight',
    digest: 'Digestion and liver',
    beauty: 'Skin, hair, women',
    immune: 'Immunity',
    men: 'Men',
  },

  shelf: {
    title: 'Greenway products by need',
    lead: 'Prices and photos come from the official store. Tap buy and the Greenway page opens.',
    chooseNeed: 'Choose a need',
    prev: 'Previous products',
    next: 'Next products',
    allShop: 'Browse the whole Greenway store',
  },

  faq: {
    title: 'Before you ask',
    items: [
      {
        q: 'Do I need to sign up or fill in a form?',
        a: 'No. Open the page and ask right away. Age, height and weight are only for closer advice, if you want it.',
      },
      { q: 'Which photos help?', a: 'Lab results, the skin area that bothers you, or the medicine box you take now.' },
      { q: 'Where do I buy the products?', a: 'At the official Greenway Global store. Every product has a button that opens its page.' },
      {
        q: 'Can the AI pharmacist replace a doctor?',
        a: 'No. This is general advice about dietary supplements, not a diagnosis or a prescription.',
      },
    ],
  },

  footer: {
    sign: 'Sleep well, eat well, and feel well from the inside.',
    from: 'The Greenway AI pharmacist',
    chat: 'Chat',
    products: 'Products',
    shop: 'Greenway Global store',
    legal: 'These products are dietary supplements, not medicines, and do not replace medical treatment. Advice is for reference only.',
    credit: 'Logo, product photos and prices: Greenway Global.',
  },

  ai: {
    honor: { female: 'you', male: 'you', none: 'you' },
    opening: () => 'Thanks for sharing. What you describe is common, and it can be improved at the root.',
    openingNext: (needs: string) => `Got it, let us add ${needs} to the plan.`,
    and: ' and ',
    tipPrefix: (tip: string) => `Before any product: ${tip}`,
    noMetrics: ' If you want your BMI included, add your height and weight in the panel beside the chat.',
    reasonFor: (need: string) => `For ${need}`,
    bmiFinding: (bmi: string, label: string, hint: string) => `BMI ${bmi}: ${label.toLowerCase()} by the Asian standard. ${hint}`,
    causes: {
      sleep: 'Broken sleep often comes with a nervous system that has been on alert for a long time; in the evening the body does not wind down in time.',
      heart: 'Cholesterol and blood pressure reflect how you process fat: bad cholesterol narrows the vessels and the heart has to work harder.',
      joint: 'Neck, shoulder and joint pain is common with long sitting, wearing cartilage and low calcium or vitamin D. Numb hands on waking also point to circulation.',
      weight: 'Belly fat builds when fast carbs exceed what you burn; constantly raised insulin tells the body to store fat around the organs.',
      digest: 'Bloating and reflux usually come from eating fast, eating late and too little fibre, which overloads the stomach and upsets gut flora.',
      beauty: 'Dull skin and hair loss often mean low antioxidants and collagen that drops after 25, plus sun and stress.',
      immune: 'Catching every cold is a sign of lower immunity: low vitamin C and D, short sleep and long stress all play a part.',
      men: 'After 35, men’s health depends on hormones, sleep and circulation; it needs steady care, not only when symptoms appear.',
    },
    tips: {
      sleep: 'Turn off screens 45 minutes before bed and keep the room dark and cool.',
      heart: 'Eat less fried food, have fish 2 to 3 times a week and walk briskly 30 minutes a day.',
      joint: 'Every 45 minutes of sitting, stand up and slowly roll your neck and shoulders 10 times each way.',
      weight: 'Eat vegetables first, protein next, carbs last, and no carbs after 7 pm.',
      digest: 'Chew slowly and do not lie down for 2 hours after dinner.',
      beauty: 'Wear sunscreen every morning and sleep before 11 pm.',
      immune: 'Sleep 7 hours, drink enough warm water and add citrus fruit.',
      men: 'Do endurance exercise 3 times a week and cut back on alcohol.',
    },

    imagesOnly: (n: number) =>
      `I got your ${n === 1 ? 'photo' : `${n} photos`}. Tell me a little more: what is in the photo, and where do you feel unwell? I will read it together with your description.`,
    imagesOnlySuggest: ['These are my blood test results', 'A photo of my acne', 'The medicine I take now'],
    metricsBmi: (bmi: string) => `Got your metrics. Your BMI is ${bmi}; I have included it in the analysis below.`,
    metricsNoBmi: 'Got your metrics. Add height and weight and I can work out your BMI.',
    metricsMore: '\nWith these metrics, I also suggest:',
    metricsSame: '\nThe products I suggested above still fit.',
    metricsAskMore: '\nTell me what is bothering you so I can choose the right products.',
    thanks: 'You are welcome. Come back any time if something does not feel right; I still have this conversation.',
    thanksSuggest: ['Remind me of my daily schedule', 'I have another question'],
    priceHead: 'Prices at the Greenway store today:',
    priceLine: (name: string, price: string, pack: string) => `${name}: ${price} (${pack})`,
    priceTotal: (n: number, total: string) =>
      `All ${n} products come to ${total}. To start lighter on the wallet, begin with the first one; it is the most essential.`,
    priceSuggest: ['If I pick only one?', 'How do I take them each day?'],
    doseHead: 'Suggested schedule:',
    doseLine: (name: string, dose: string, timing: string) => `${name}: ${dose}, ${timing}.`,
    doseDefault: (name: string) => `${name}: follow the package, usually after a meal.`,
    doseNote: 'If you take prescription medicine, keep at least 2 hours between them.',
    doseSuggest: ['Are there side effects?', 'How long until I see results?'],
    safety:
      'These are dietary supplements and are usually safe at the right dose. If you are pregnant, breastfeeding, have a chronic condition or take prescription medicine, ask your doctor first. Does any of that apply to you?',
    safetySuggest: ['I take blood pressure medicine', 'No, I am healthy'],
    duration:
      'It usually takes 4 to 8 weeks of steady use, together with the habits I suggested, to see a clear change. Come back in 2 weeks and tell me how it is going.',
    durationSuggest: ['How do I take them each day?', 'I have another question'],
    combo: 'You can pair it with the products below from the same group. Start with one, then add a second after 2 weeks to see what suits you.',
    whereBuy: 'Tap “Buy at Greenway” on any product and the official Greenway Global store opens with the price and cart.',
    followSuggest: ['How much is it?', 'How do I take them each day?'],
    named: (name: string, brand: string, needs: string, price: string, pack: string, dose: string) =>
      `${name} is part of the ${brand} line, for ${needs}. It costs ${price} for ${pack}; take ${dose}.\nTell me how you feel now so I can say whether it suits you.`,
    namedDoseDefault: 'as the package says, usually after a meal',
    namedReason: 'The product you asked about',
    namedSuggest: ['Should I take it?', 'Are there side effects?', 'What goes well with it?'],
    askMoreImages:
      'Got your photo. Describe your symptoms or what you want to improve (sleep, weight, joints, digestion) so I can suggest something closer.',
    askMore: 'Tell me a little more: where does it bother you, for how long, and when is it worse? For example “I cannot sleep and wake at 3 am”.',
    defaultSuggest: ['How much is it?', 'How do I take them each day?', 'Are there side effects?'],
  },
};
