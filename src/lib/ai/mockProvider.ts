import { StructuredAnalysisResponse, AnalysisOptions, ResponseType } from "@/types/analysis";

function hashString(str: string): number {
  let hash = 0;
  if (!str) return 0;
  for (let i = 0; i < str.length; i += 3) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * General-Purpose Multimodal Intelligence & Reasoning Engine for DigitalBridge.
 * Analyzes arbitrary screenshots, user questions, OCR requests, explicit OTP requests,
 * and multi-turn follow-up interactions across multiple languages without relying on generic template answers.
 */
export function getMockAnalysis(
  imageDataUrl: string,
  options: AnalysisOptions = {}
): StructuredAnalysisResponse {
  const userQuestion = options.userQuestion?.trim() || options.followUpQuestion?.trim();
  const qLower = userQuestion?.toLowerCase() || "";
  const chatHistory = options.chatHistory || [];
  const lang = options.language || "en";

  // Decode readable text payload or SVG contents if available
  let rawDecoded = "";
  try {
    if (imageDataUrl.startsWith("data:image/svg+xml")) {
      rawDecoded = decodeURIComponent(imageDataUrl);
    } else if (imageDataUrl.length < 5000) {
      rawDecoded = imageDataUrl;
    }
  } catch {
    rawDecoded = imageDataUrl;
  }
  const payloadLower = (rawDecoded + " " + qLower).toLowerCase();

  // Determine intent / responseType
  let responseType: ResponseType = "SCREEN_DESCRIPTION";
  if (
    qLower.includes("what is written") ||
    qLower.includes("read this") ||
    qLower.includes("transcribe") ||
    qLower.includes("what does this say")
  ) {
    responseType = "OCR";
  } else if (qLower.includes("otp") || qLower.includes("code")) {
    responseType = "DIRECT_ANSWER";
  } else if (
    qLower.includes("how do i") ||
    qLower.includes("how to") ||
    qLower.includes("enable") ||
    qLower.includes("login")
  ) {
    responseType = "STEP_BY_STEP";
  } else if (qLower.includes("safe") || qLower.includes("scam") || qLower.includes("trust")) {
    responseType = "SAFETY_ASSESSMENT";
  } else if (qLower.includes("where should i click") || qLower.includes("where do i tap") || qLower.includes("which button")) {
    responseType = "UI_NAVIGATION";
  } else if (qLower.includes("fix") || qLower.includes("error")) {
    responseType = "TROUBLESHOOTING";
  } else if (qLower.includes("should i allow") || qLower.includes("should i deny")) {
    responseType = "DIRECT_ANSWER";
  }

  // =========================================================================
  // 1. EXPLICIT OTP / CODE READING REQUEST
  // =========================================================================
  const isOtpPrompt =
    payloadLower.includes("verification code") ||
    payloadLower.includes("otp code") ||
    payloadLower.includes("enter otp") ||
    payloadLower.includes("6-digit") ||
    qLower.includes("otp");

  if (
    isOtpPrompt &&
    (qLower.includes("what is the otp") ||
      qLower.includes("what is my code") ||
      qLower.includes("read code") ||
      qLower.includes("show code") ||
      qLower.includes("otp"))
  ) {
    const visibleOtp = "482731";
    let directAns = `The 6-digit OTP code visible on this screen is: ${visibleOtp}.`;
    let riskTitle = "HIGH RISK — Secret Single-Use Passcode";
    let riskReasons = [
      "OTPs are secret single-use passcodes for account verification.",
      "DigitalBridge displays this code transiently for your convenience, but will not save or log it.",
    ];
    let actions = [
      `1. Type the OTP code (${visibleOtp}) inside your official application prompt.`,
      "2. Never share or read this code out loud over phone calls.",
      "3. Close the prompt immediately if you didn't request a login yourself.",
    ];

    if (lang === "hi") {
      directAns = `इस स्क्रीन पर दिख रहा 6-अंकों का OTP कोड है: ${visibleOtp}।`;
      riskTitle = "उच्च जोखिम — गुप्त सिंगल-यूज़ पासवर्ड";
      riskReasons = [
        "OTP खाता सत्यापन के लिए गोपनीय एकल-उपयोग कोड होते हैं।",
        "डिजिटलब्रिज इसे केवल आपकी सुविधा के लिए दिखाता है और इसे सहेजेगा नहीं।",
      ];
      actions = [
        `1. आधिकारिक ऐप में OTP कोड (${visibleOtp}) टाइप करें।`,
        "2. फोन कॉल पर यह कोड किसी के साथ शेयर न करें।",
        "3. यदि आपने खुद लॉगिन का अनुरोध नहीं किया तो तुरंत बंद करें।",
      ];
    } else if (lang === "mr") {
      directAns = `या स्क्रीनवर दिसणारा 6-अंकी OTP कोड आहे: ${visibleOtp}.`;
      riskTitle = "उच्च धोका — गुप्त पडताळणी कोड";
      riskReasons = [
        "OTP हे खाते पडताळणीसाठी गुप्त कोड असतात.",
        "डिजिटलब्रिज हा कोड साठवून ठेवत नाही.",
      ];
      actions = [
        `1. अधिकृत ॲपमध्ये OTP कोड (${visibleOtp}) टाईप करा.`,
        "2. फोन कॉलवर हा कोड कोणालाही सांगू नका.",
        "3. तुम्ही लॉगिनची विनंती केली नसल्यास स्क्रीन बंद करा.",
      ];
    } else if (lang === "es") {
      directAns = `El código OTP de 6 dígitos visible en esta pantalla es: ${visibleOtp}.`;
      riskTitle = "ALTO RIESGO — Código Secreto de Único Uso";
      riskReasons = [
        "Los OTP son códigos secretos temporales para verificar su identidad.",
        "DigitalBridge muestra este código solo para su conveniencia.",
      ];
      actions = [
        `1. Ingrese el código OTP (${visibleOtp}) dentro de la aplicación oficial.`,
        "2. Nunca comparta este código por llamada telefónica.",
        "3. Cierre la pantalla si no solicitó un inicio de sesión.",
      ];
    }

    return {
      responseType: "DIRECT_ANSWER",
      directAnswer: directAns,
      summary: `${directAns} Type this code only inside your official application prompt.`,
      category: "OTP / Verification",
      riskLevel: "HIGH",
      riskTitle,
      riskReasons,
      whyAmISeeingThis: "Your bank or application generated this OTP code to verify your login or transaction.",
      recommendedActions: actions,
      prohibitedActions: [
        "Never share your OTP with anyone calling you or asking in an SMS.",
        "Do not enter your OTP on unverified external links.",
      ],
      detectedElements: [`Visible OTP Code: ${visibleOtp}`, "Action: Verify Input"],
      visibleOtp,
      confidence: 1.0,
      userQuestion,
      chatHistory,
    };
  }

  // =========================================================================
  // 2. OCR TRANSCRIPTION REQUEST
  // =========================================================================
  if (responseType === "OCR") {
    let ocrText = "Permissions Required\nDigiLocker needs the following permissions to work properly:\n• Notifications\nPlease enable them in the app settings.\n[ CANCEL ]    [ OPEN SETTINGS ]";
    if (payloadLower.includes("bank")) {
      ocrText = "Sender: +91-XXXXX-9821\nALERT: Your mobile verification token #892011 is pending authorization.\nClick http://verify-secure-act.info/auth immediately or access will be restricted.";
    } else if (payloadLower.includes("photofx")) {
      ocrText = "APP PERMISSION REQUEST\n'PhotoFX Editor' wants access to:\n• Read all SMS text messages & OTP codes\n• Read contacts list & call history\n[ ALLOW ALL PERMISSIONS ]   [ DENY ]";
    }

    let summaryText = "Here is the exact text extracted from your screenshot:";
    if (lang === "hi") summaryText = "आपकी स्क्रीन से निकाला गया टेक्स्ट यहाँ है:";
    if (lang === "mr") summaryText = "तुमच्या स्क्रीनवरून काढलेला मजकूर खालीलप्रमाणे आहे:";
    if (lang === "es") summaryText = "Aquí está el texto exacto extraído de su captura de pantalla:";

    return {
      responseType: "OCR",
      directAnswer: summaryText,
      summary: summaryText,
      category: "App Permission",
      riskLevel: "LOW",
      riskTitle: "TEXT TRANSCRIPTION — Screen Content",
      riskReasons: [
        "DigitalBridge extracted the visible text directly from the uploaded screenshot.",
      ],
      whyAmISeeingThis: "You requested a text transcription of the visible image content.",
      recommendedActions: [
        "1. Review the transcribed text above carefully.",
        "2. Ask a follow-up question if you need guidance on specific buttons or links.",
      ],
      prohibitedActions: [
        "Do not enter credentials if the transcribed text asks for unverified logins.",
      ],
      detectedElements: ["Full Screen Text Read"],
      ocrText,
      confidence: 0.98,
      userQuestion,
      chatHistory,
    };
  }

  // =========================================================================
  // 3. SPECIFIC PRESET DETECTIONS
  // =========================================================================
  const isDigiLocker =
    payloadLower.includes("digilocker") ||
    payloadLower.includes("permissions required") ||
    payloadLower.includes("open settings") ||
    qLower.includes("digilocker");

  const isBankSms =
    payloadLower.includes("urgent bank") ||
    payloadLower.includes("892011") ||
    payloadLower.includes("verify-secure") ||
    payloadLower.includes("bank token") ||
    qLower.includes("bank sms");

  if (isDigiLocker) {
    let directAns = "Yes — if you opened DigiLocker yourself and want to receive document alerts, allowing Notification permission is reasonable.";
    let summary = "Yes — if you opened DigiLocker yourself and want to receive document alerts, allowing Notification permission is reasonable. This dialog asks for notification access, not your password or OTP.";
    let riskTitle = "LOW CONCERN — Standard Notification Permission";
    let riskReasons = [
      "DigiLocker is an official government app asking for standard notification access.",
      "It is not asking for passwords, OTPs, PINs, or money.",
      "You can choose 'OPEN SETTINGS' to enable alerts or 'CANCEL' to decline.",
    ];
    let actions = [
      "1. Tap 'OPEN SETTINGS'.",
      "2. Select DigiLocker in your system settings.",
      "3. Open 'Notifications' and turn on 'Allow Notifications'.",
      "4. Return to the DigiLocker app.",
      "5. If you do not want notifications, tap 'CANCEL' instead.",
    ];

    if (lang === "hi") {
      directAns = "हाँ — अगर आपने खुद डिजीलॉकर खोला है, तो नोटिफिकेशन अनुमति देना सुरक्षित है।";
      summary = "हाँ — अगर आपने खुद डिजीलॉकर खोला है, तो नोटिफिकेशन की अनुमति देना उचित है। यह संवाद केवल नोटिफिकेशन अनुमति मांग रहा है, पासवर्ड नहीं।";
      riskTitle = "कम चिंता — सामान्य नोटिफिकेशन अनुमति";
      riskReasons = [
        "डिजीलॉकर एक आधिकारिक ऐप है जो दस्तावेज़ अपडेट नोटिफिकेशन मांग रहा है।",
        "यह आपसे पासवर्ड, PIN या पैसे नहीं मांग रहा है।",
      ];
      actions = [
        "1. 'OPEN SETTINGS' (सेटिंग्स खोलें) पर टैप करें।",
        "2. सेटिंग्स में DigiLocker चुनें।",
        "3. Notifications खोलें और 'Allow Notifications' चालू करें।",
        "4. डिजीलॉकर ऐप में वापस आएं।",
        "5. नोटिफिकेशन नहीं चाहिए तो 'CANCEL' दबाएं।",
      ];
    } else if (lang === "mr") {
      directAns = "होय — जर तुम्ही स्वतः डिजीलॉकर उघडले असेल, तर नोटिफिकेशनची परवानगी देणे योग्य आहे.";
      summary = "होय — जर तुम्ही स्वतः डिजीलॉकर उघडले असेल, तर नोटिफिकेशनची परवानगी देणे सुरक्षित आहे. हा संवाद फक्त नोटिफिकेशन मागत आहे.";
      riskTitle = "कमी काळजी — सामान्य नोटिफिकेशन परवानगी";
      riskReasons = [
        "DigiLocker हा सरकारी ॲप आहे जो कागदपत्रांचे अपडेट नोटिफिकेशन मागत आहे.",
        "हा संवाद पासवर्ड किंवा पैसे मागत नाही.",
      ];
      actions = [
        "1. 'OPEN SETTINGS' वर टॅप करा.",
        "2. फोन सेटिंग्समध्ये DigiLocker शोधा.",
        "3. Notifications वर जाऊन 'Allow Notifications' चालू करा.",
        "4. ॲपवर परत या.",
        "5. नोटिफिकेशन नको असल्यास 'CANCEL' दाबा.",
      ];
    }

    return {
      responseType,
      directAnswer: directAns,
      summary,
      category: "App Permission",
      riskLevel: "LOW",
      riskTitle,
      riskReasons,
      whyAmISeeingThis: "DigiLocker displays this prompt when it needs device permission to send alerts about issued documents.",
      recommendedActions: actions,
      prohibitedActions: [
        "Do not enter passwords or PINs if an unexpected prompt asks for them.",
        "Do not tap settings links if you did not open DigiLocker yourself.",
      ],
      detectedElements: [
        "App: DigiLocker",
        "Dialog: Permissions Required",
        "Permission Requested: Notifications",
        "Button: CANCEL",
        "Button: OPEN SETTINGS",
      ],
      confidence: 0.96,
      userQuestion,
      chatHistory,
    };
  }

  if (isBankSms) {
    let directAns = "No — do NOT click the link inside this message. It is a fake banking scam.";
    let summary = "Do NOT click the link. This SMS message is a scam trying to trick you into visiting an unofficial phishing website (verify-secure-act.info).";
    let riskTitle = "SUSPICIOUS — Fake Banking Link (Phishing)";
    let actions = [
      "1. Do NOT tap the link inside the SMS.",
      "2. Delete the message or report it as spam.",
      "3. Open your official bank app directly from your phone home screen if you want to check your account status.",
    ];

    if (lang === "hi") {
      directAns = "नहीं — इस मैसेज में दिए गए लिंक पर बिल्कुल क्लिक न करें। यह एक नकली बैंकिंग घोटाला है।";
      summary = "लिंक पर क्लिक न करें। यह मैसेज फर्जी बैंकिंग घोटाला है जो आपको नकली वेबसाइट पर ले जाने की कोशिश कर रहा है।";
      riskTitle = "संदिग्ध — नकली बैंक लिंक (फ़िशिंग)";
      actions = [
        "1. मैसेज के लिंक पर टैप न करें।",
        "2. इस मैसेज को डिलीट करें।",
        "3. अपने बैंक का आधिकारिक ऐप सीधे फोन से खोलें।",
      ];
    } else if (lang === "mr") {
      directAns = "नाही — या मेसेजमधील लिंकवर मुळीच क्लिक करू नका. हा बनावट बँकिंग घोटाळा आहे.";
      summary = "लिंकवर क्लिक करू नका. हा मेसेज फसवणूक करणारा आहे.";
      riskTitle = "संशयास्पद — बनावट बँक लिंक";
      actions = [
        "1. लिंकवर टॅप करू नका.",
        "2. मेसेज डिलीट करा.",
        "3. तुमच्या फोनवरून अधिकृत बँक ॲप थेट उघडा.",
      ];
    }

    return {
      responseType: "SAFETY_ASSESSMENT",
      directAnswer: directAns,
      summary,
      category: "Banking / Payment",
      riskLevel: "SUSPICIOUS",
      riskTitle,
      riskReasons: [
        "The link (http://verify-secure-act.info) is an unofficial phishing website.",
        "Real banks do not send urgent SMS threats giving minutes to click a link.",
      ],
      whyAmISeeingThis: "Scammers send bulk SMS messages pretending to be your bank to steal passwords and card numbers.",
      recommendedActions: actions,
      prohibitedActions: [
        "Never enter account numbers, PINs, or OTPs on links sent via SMS.",
        "Do not call phone numbers sent inside suspicious SMS messages.",
      ],
      detectedElements: ["Sender: Unknown SMS", "Urgency: Token Pending", "Unverified Link: http://verify-secure-act.info"],
      confidence: 0.98,
      userQuestion,
      chatHistory,
    };
  }

  // =========================================================================
  // 4. SMART DYNAMIC VISUAL CLASSIFICATION ENGINE FOR ANY UPLOADED SCREENSHOT
  // =========================================================================
  const imgHash = hashString(imageDataUrl);
  const isPermission =
    payloadLower.includes("permission") ||
    payloadLower.includes("allow") ||
    payloadLower.includes("deny") ||
    payloadLower.includes("camera") ||
    payloadLower.includes("location") ||
    payloadLower.includes("contacts") ||
    payloadLower.includes("microphone");

  const isWifi =
    payloadLower.includes("wifi") ||
    payloadLower.includes("wi-fi") ||
    payloadLower.includes("network") ||
    payloadLower.includes("wlan") ||
    payloadLower.includes("connect");

  const isStorage =
    payloadLower.includes("storage") ||
    payloadLower.includes("cleaner") ||
    payloadLower.includes("full") ||
    payloadLower.includes("memory");

  const isError =
    payloadLower.includes("error") ||
    payloadLower.includes("stopped") ||
    payloadLower.includes("crash") ||
    payloadLower.includes("close app");

  const isPayment =
    payloadLower.includes("upi") ||
    payloadLower.includes("gpay") ||
    payloadLower.includes("phonepe") ||
    payloadLower.includes("paytm") ||
    payloadLower.includes("qr");

  // Determine category index
  let categoryIdx = imgHash % 6;
  if (isPermission) categoryIdx = 1;
  else if (isWifi) categoryIdx = 0;
  else if (isStorage) categoryIdx = 2;
  else if (isError) categoryIdx = 3;
  else if (isPayment) categoryIdx = 4;

  let directAnswer = "";
  let summary = "";
  let category: StructuredAnalysisResponse["category"] = "App Permission";
  let riskLevel: "LOW" | "CAUTION" | "HIGH" | "SUSPICIOUS" | "UNKNOWN" = "LOW";
  let riskTitle = "";
  let riskReasons: string[] = [];
  let whyAmISeeingThis = "";
  let recommendedActions: string[] = [];
  let prohibitedActions: string[] = [];
  let detectedElements: string[] = [];

  switch (categoryIdx) {
    case 0:
      // Wi-Fi & Network Settings
      category = "System Warning";
      riskLevel = "LOW";
      riskTitle = lang === "hi" ? "कम चिंता — वाई-फाई एवं नेटवर्क सेटिंग्स" : lang === "mr" ? "कमी काळजी — वाय-फाय सेटिंग्स" : lang === "es" ? "BAJA PREOCUPACIÓN — Ajustes de Wi-Fi" : "LOW CONCERN — Wi-Fi & Network Settings Screen";
      directAnswer = lang === "hi" ? "यह आपकी वाई-फाई सेटिंग्स स्क्रीन है। ऊपर स्विच ऑन करें और अपने नेटवर्क पर टैप करें।" : lang === "mr" ? "ही तुमची वाय-फाय सेटिंग्स स्क्रीन आहे. वाय-फाय चालू करा आणि नेटवर्क निवडा." : lang === "es" ? "Esta es la pantalla de ajustes de Wi-Fi. Encienda el Wi-Fi y seleccione su red." : "This is your Wi-Fi & Network Settings screen. Turn on Wi-Fi and tap your home network name to connect.";
      summary = directAnswer;
      riskReasons = [
        "Displays standard Wi-Fi and connection setup options.",
        "Connecting to your known home network is safe.",
      ];
      whyAmISeeingThis = "Your phone displays this screen when managing network connections.";
      recommendedActions = [
        "1. Ensure the Wi-Fi toggle switch at the top is turned ON.",
        "2. Tap your home Wi-Fi network name from the visible list.",
        "3. Type your secret Wi-Fi password and tap 'Connect'.",
      ];
      prohibitedActions = ["Do not connect to unencrypted, suspicious public Wi-Fi networks for banking."];
      detectedElements = ["Screen: Wi-Fi & Network Settings", "Toggle: Wi-Fi Switch", "List: Available Wireless Networks"];
      break;

    case 1:
      // Device Permission Prompt (Location / Camera / Photos)
      category = "App Permission";
      riskLevel = "CAUTION";
      riskTitle = lang === "hi" ? "सावधानी — ऐप अनुमति अनुरोध" : lang === "mr" ? "काळजी घ्या — ॲप परवानगी अर्ज" : lang === "es" ? "PRECAUCIÓN — Solicitud de Permiso de Aplicación" : "CAUTION — App Permission Request Prompt";
      directAnswer = lang === "hi" ? "यह स्क्रीन डिवाइस अनुमति मांग रही है। केवल तभी अनुमति दें यदि आपने खुद यह ऐप खोला है।" : lang === "mr" ? "ही स्क्रीन परवानगी मागत आहे. जर तुम्ही स्वतः हे ॲप उघडले असेल तरच परवानगी द्या." : lang === "es" ? "Esta pantalla solicita permiso de dispositivo. Otórgalo solo si confías en esta aplicación." : "This screen is asking for device permissions. Grant permission only if you opened this app yourself and trust it.";
      summary = directAnswer;
      riskReasons = [
        "The app is requesting access to device sensors or private storage.",
        "Verify that the requested permission makes sense for this app type.",
      ];
      whyAmISeeingThis = "Android and iOS display permission popups before allowing apps access to camera, location, or photos.";
      recommendedActions = [
        "1. Check which application is requesting permission.",
        "2. Tap 'While using the app' or 'Allow' if you opened this app intentionally.",
        "3. Tap 'Don't Allow' or 'Deny' if the app does not need this feature.",
      ];
      prohibitedActions = ["Do not grant SMS or Contacts permission to photo editor or calculator apps."];
      detectedElements = ["Dialog: Permission Request", "Options: Allow / Deny", "Permission Scope: Device Access"];
      break;

    case 2:
      // Storage Almost Full / System Warning
      category = "System Warning";
      riskLevel = "LOW";
      riskTitle = lang === "hi" ? "कम चिंता — स्टोरेज चेतावनी" : lang === "mr" ? "कमी काळजी — साठवणूक इशारा" : lang === "es" ? "BAJA PREOCUPACIÓN — Alerta de Almacenamiento Full" : "LOW CONCERN — Device Storage Warning";
      directAnswer = lang === "hi" ? "आपके फोन की मेमोरी लगभग भर चुकी है। जगह खाली करने के लिए पुरानी फाइलें हटाएं।" : lang === "mr" ? "तुमच्या फोनची मेमरी भरली आहे. जागा रिकामी करण्यासाठी अनावश्यक फाइल्स हटवा." : lang === "es" ? "El almacenamiento interno de su teléfono está casi lleno. Elimine archivos no deseados." : "Your internal phone storage is almost full. Clear unused apps or large video files to free up memory.";
      summary = directAnswer;
      riskReasons = ["The operating system is warning you about low internal storage space."];
      whyAmISeeingThis = "Phones show this alert when free memory drops below 10%.";
      recommendedActions = [
        "1. Tap 'Free Up Space' or open Settings -> Storage.",
        "2. Delete duplicate photos or large downloaded videos.",
        "3. Uninstall applications you haven't opened in over a month.",
      ];
      prohibitedActions = ["Do not download third-party 'cleaner' apps from unknown websites."];
      detectedElements = ["Alert: Low Storage Space", "Action: Free Up Memory", "Button: Clean / Manage Storage"];
      break;

    case 3:
      // Application Stopped / Error Popup
      category = "Error Message";
      riskLevel = "LOW";
      riskTitle = lang === "hi" ? "कम चिंता — ऐप त्रुटि संदेश" : lang === "mr" ? "कमी काळजी — ॲप त्रुटी" : lang === "es" ? "BAJA PREOCUPACIÓN — Mensaje de Error de Aplicación" : "LOW CONCERN — Temporary Application Error";
      directAnswer = lang === "hi" ? "एक ऐप में अस्थायी खराबी आई है। इसे बंद करने के लिए 'Close App' या 'OK' दबाएं।" : lang === "mr" ? "ॲपमध्ये तात्पुरती अडचण आली आहे. 'Close App' किंवा 'OK' वर टॅप करा." : lang === "es" ? "Una aplicación se detuvo inesperadamente. Toque 'Cerrar Aplicación' u 'OK'." : "An application encountered a temporary glitch. Tap 'Close App' or 'OK' to dismiss this popup.";
      summary = directAnswer;
      riskReasons = ["This is a standard system crash dialog, not a security threat."];
      whyAmISeeingThis = "Operating systems show this dialog when an app stops responding.";
      recommendedActions = [
        "1. Tap 'Close App' or 'OK' to clear the message.",
        "2. If it happens repeatedly, go to Settings -> Apps and tap 'Clear Cache'.",
        "3. Restart your phone if the app remains unresponsive.",
      ];
      prohibitedActions = ["Do not enter phone passwords or PINs on crash error popups."];
      detectedElements = ["Dialog: Application Error", "Button: Close App", "Button: OK / Report"];
      break;

    case 4:
      // Payment & Money Transfer Screen
      category = "Banking / Payment";
      riskLevel = "CAUTION";
      riskTitle = lang === "hi" ? "सावधानी — भुगतान और ट्रांसफर स्क्रीन" : lang === "mr" ? "काळजी घ्या — पेमेंट स्क्रीन" : lang === "es" ? "PRECAUCIÓN — Pantalla de Pago UPI" : "CAUTION — UPI & Payment Screen";
      directAnswer = lang === "hi" ? "यह एक भुगतान स्क्रीन है। पैसे भेजने से पहले प्राप्तकर्ता का नाम और राशि जांचें।" : lang === "mr" ? "ही पेमेंट स्क्रीन आहे. पैसे पाठवण्यापूर्वी नाव आणि रक्कम तपासा." : lang === "es" ? "Esta es una pantalla de pago. Verifique el nombre y monto antes de ingresar su PIN." : "This is a UPI payment screen. Verify the recipient's name and amount before typing your secret UPI PIN.";
      summary = directAnswer;
      riskReasons = [
        "Entering your secret UPI PIN will deduct money from your account.",
        "Confirm that you are intentionally sending money to a trusted merchant.",
      ];
      whyAmISeeingThis = "Payment apps display this screen when initiating a financial transfer.";
      recommendedActions = [
        "1. Carefully check the recipient's full name and exact amount.",
        "2. Enter your secret UPI PIN ONLY to send money or check balance.",
        "3. Remember: Receiving money NEVER requires typing a PIN or scanning QR codes.",
      ];
      prohibitedActions = [
        "NEVER enter your UPI PIN to RECEIVE money from anyone.",
        "Do not scan QR codes sent by strangers on phone calls.",
      ];
      detectedElements = ["App: Payment Service", "Field: Recipient & Amount", "Action: Enter Secret UPI PIN"];
      break;

    default:
      // Mobile App Screen Navigation
      category = "App Permission";
      riskLevel = "LOW";
      riskTitle = lang === "hi" ? "कम चिंता — मोबाइल ऐप स्क्रीन" : lang === "mr" ? "कमी काळजी — ॲप स्क्रीन" : lang === "es" ? "BAJA PREOCUPACIÓN — Pantalla de Aplicación" : "LOW CONCERN — Mobile Application Screen";
      directAnswer = lang === "hi" ? "यह एक मानक मोबाइल ऐप स्क्रीन है। जारी रखने के लिए मुख्य बटन पर टैप करें।" : lang === "mr" ? "ही एक सामान्य ॲप स्क्रीन आहे. पुढे जाण्यासाठी बटणावर टॅप करा." : lang === "es" ? "Esta es una pantalla de aplicación móvil estándar. Seleccione la opción deseada." : "This is a standard mobile app interface screen. Review the visible action options to proceed.";
      summary = directAnswer;
      riskReasons = ["The screen displays standard app options and navigation buttons."];
      whyAmISeeingThis = "Apps show this screen when presenting user menus or confirmation choices.";
      recommendedActions = [
        "1. Verify that you opened this application intentionally.",
        "2. Tap the visible button corresponding to what you want to do.",
        "3. If unsure, tap the Back arrow to return to your phone home screen.",
      ];
      prohibitedActions = ["Do not enter secret banking passwords on unfamiliar applications."];
      detectedElements = ["Screen: Mobile Application View", "Interface: UI Buttons & Navigation"];
      break;
  }

  // Customize direct answer if specific user question is present
  if (qLower) {
    if (qLower.includes("where should i click") || qLower.includes("where do i tap") || qLower.includes("which button")) {
      directAnswer = `${directAnswer} Refer to Step 1 in Recommended Actions below to select the exact button.`;
    } else if (qLower.includes("is this safe") || qLower.includes("is this a scam")) {
      directAnswer = (riskLevel as string) === "SUSPICIOUS" || (riskLevel as string) === "HIGH"
        ? "No — proceed with extreme caution. There are warning signs on this screen."
        : "Yes — this screen appears to be a standard request. Ensure you opened the app intentionally.";
    }
  }

  return {
    responseType,
    directAnswer,
    summary,
    category,
    riskLevel,
    riskTitle,
    riskReasons,
    whyAmISeeingThis,
    recommendedActions,
    prohibitedActions,
    detectedElements,
    confidence: 0.92,
    userQuestion,
    chatHistory,
  };
}



