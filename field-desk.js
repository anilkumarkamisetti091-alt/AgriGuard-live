(() => {
  "use strict";
  const STORAGE_KEY = "agriguard:fieldDesk:v1";
  const $ = (id) => document.getElementById(id);
  const today = () => new Date().toISOString().slice(0, 10);
  const uid = () => (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (value) => new Intl.NumberFormat(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(value) || 0);
  const messages = {
    en: { eyebrow:"PRACTICAL FARM SUPPORT", title:"Your farm, organized in one place.", intro:"Keep field notes, crop observations, tasks and money records on this device. Core tools work offline after this page has loaded once.", privacy:"🔒 Your records stay in this browser on this device. They are not uploaded or shared.", navDiary:"Field diary", navTasks:"Tasks", navMoney:"Farm finances", navPlanning:"Planning", navData:"Backup", diaryTitle:"Field diary & crop scouting", diaryHelp:"Record what you see and what you did. Notes are not an automated diagnosis; consult a local KVK or qualified agriculture officer for serious crop problems.", date:"Date", field:"Field / village", crop:"Crop", stage:"Crop stage", observation:"Observation / symptom", action:"Action taken / follow-up", saveEntry:"Save field note", tasksTitle:"Farm task planner", tasksHelp:"Set your own reminders for irrigation checks, scouting, harvest, insurance deadlines or market visits. Browser notifications are optional and require permission.", task:"Task", dueDate:"Due date", fieldOptional:"Field (optional)", addTask:"Add task", notifications:"Enable browser reminders", moneyTitle:"Farm income & expense book", moneyHelp:"Track your own purchases and sales. Totals are based only on the records you enter; keep receipts and verify amounts.", income:"Income recorded", expense:"Expenses recorded", balance:"Recorded balance", type:"Record type", description:"Description", amount:"Amount (₹)", saveRecord:"Save record", planningTitle:"Simple field calculators", seedTitle:"Seed quantity estimate", seedHelp:"Use a seed rate from your seed label or local extension advice. This tool does not prescribe crop rates.", areaAcres:"Area (acres)", seedRate:"Your seed rate (kg/acre)", calculate:"Calculate", waterTitle:"Water volume estimate", waterHelp:"Enter a water depth decided from field conditions or local advice. One millimetre over one acre is about 4,047 litres; this is a volume conversion, not an irrigation recommendation.", waterDepth:"Water depth you plan (mm)", dataTitle:"Your data, your device", dataHelp:"Download a backup before changing phones or clearing browser data. Import replaces these Field Desk records with the selected backup.", export:"Download backup", import:"Import backup", clear:"Clear Field Desk data", offlineNote:"Offline use: visit this page once while online, then it can open from the same browser when disconnected. Weather forecasts, external websites, and sending enquiries still need internet.", home:"← Back to AgriGuard home", disclaimer:"Use local agricultural guidance for crop decisions. Estimates are planning aids only.", online:"Online", offline:"Offline · saved tools available", checking:"Checking connection…", emptyDiary:"No field notes saved yet.", emptyTasks:"No tasks saved yet.", emptyMoney:"No money records saved yet.", delete:"Delete", done:"Done", reopen:"Reopen", confirmClear:"Clear all Field Desk notes, tasks and money records from this device? This cannot be undone.", cleared:"Saved Field Desk data cleared.", exported:"Backup downloaded.", imported:"Backup imported successfully.", invalidBackup:"That backup is not valid. No data was changed.", saved:"Saved on this device.", due:"Due", completed:"Completed", seedOutput:"Estimated seed needed", waterOutput:"Estimated water volume", notificationGranted:"Browser reminders enabled on this device.", notificationDenied:"Notifications are unavailable or permission was not granted.", dueNotification:"Farm task due today" },
    hi: { eyebrow:"किसानों के लिए व्यावहारिक सहायता", title:"आपका खेत, एक ही जगह व्यवस्थित।", intro:"खेत के नोट, फसल निरीक्षण, काम और आय-खर्च इस डिवाइस पर रखें। पेज एक बार ऑनलाइन खुलने के बाद मुख्य सुविधाएँ ऑफलाइन चलती हैं।", privacy:"🔒 आपके रिकॉर्ड इसी डिवाइस के ब्राउज़र में रहते हैं। वे अपलोड या साझा नहीं किए जाते।", navDiary:"खेत डायरी", navTasks:"काम", navMoney:"खेत का हिसाब", navPlanning:"योजना", navData:"बैकअप", diaryTitle:"खेत डायरी और फसल निरीक्षण", diaryHelp:"जो दिखा और जो किया, उसे लिखें। यह स्वचालित निदान नहीं है; गंभीर समस्या में स्थानीय कृषि अधिकारी या KVK से सलाह लें।", date:"तारीख", field:"खेत / गांव", crop:"फसल", stage:"फसल अवस्था", observation:"निरीक्षण / लक्षण", action:"की गई कार्रवाई / अगला कदम", saveEntry:"खेत नोट सहेजें", tasksTitle:"खेती के काम की योजना", tasksHelp:"सिंचाई जांच, निरीक्षण, कटाई, बीमा की तारीख या बाजार जाने के लिए अपनी याद दिलाने वाली तारीखें जोड़ें। ब्राउज़र सूचना वैकल्पिक है।", task:"काम", dueDate:"अंतिम तारीख", fieldOptional:"खेत (वैकल्पिक)", addTask:"काम जोड़ें", notifications:"ब्राउज़र रिमाइंडर चालू करें", moneyTitle:"खेत की आय और खर्च बही", moneyHelp:"अपनी खरीद और बिक्री दर्ज करें। कुल केवल आपके दर्ज रिकॉर्ड पर आधारित हैं; रसीद रखें और राशि जांचें।", income:"दर्ज आय", expense:"दर्ज खर्च", balance:"दर्ज शेष", type:"रिकॉर्ड प्रकार", description:"विवरण", amount:"राशि (₹)", saveRecord:"रिकॉर्ड सहेजें", planningTitle:"खेत के सरल कैलकुलेटर", seedTitle:"बीज मात्रा का अनुमान", seedHelp:"बीज पैकेट या स्थानीय कृषि सलाह में दी गई दर दर्ज करें। यह उपकरण बीज दर की सिफारिश नहीं करता।", areaAcres:"क्षेत्र (एकड़)", seedRate:"आपकी बीज दर (किलो/एकड़)", calculate:"गणना करें", waterTitle:"पानी की मात्रा का अनुमान", waterHelp:"खेत की स्थिति या स्थानीय सलाह के आधार पर तय गहराई दर्ज करें। एक एकड़ में 1 मिमी पानी लगभग 4,047 लीटर है; यह केवल मात्रा रूपांतरण है, सिंचाई की सलाह नहीं।", waterDepth:"आपकी नियोजित पानी की गहराई (मिमी)", dataTitle:"आपका डेटा, आपका डिवाइस", dataHelp:"फोन बदलने या ब्राउज़र डेटा साफ करने से पहले बैकअप डाउनलोड करें। आयात करने पर Field Desk रिकॉर्ड चुने गए बैकअप से बदल जाएंगे।", export:"बैकअप डाउनलोड करें", import:"बैकअप आयात करें", clear:"Field Desk डेटा मिटाएं", offlineNote:"ऑफलाइन उपयोग: इस पेज को एक बार ऑनलाइन खोलें; फिर इसी ब्राउज़र में इंटरनेट के बिना खोल सकते हैं। मौसम, बाहरी वेबसाइट और पूछताछ भेजने के लिए इंटरनेट चाहिए।", home:"← AgriGuard होम पर लौटें", disclaimer:"फसल निर्णयों के लिए स्थानीय कृषि सलाह लें। अनुमान केवल योजना में मदद के लिए हैं।", online:"ऑनलाइन", offline:"ऑफलाइन · सहेजे टूल उपलब्ध", checking:"कनेक्शन जांच रहे हैं…", emptyDiary:"अभी कोई खेत नोट सहेजा नहीं है।", emptyTasks:"अभी कोई काम सहेजा नहीं है।", emptyMoney:"अभी कोई वित्तीय रिकॉर्ड सहेजा नहीं है।", delete:"हटाएं", done:"पूरा", reopen:"फिर खोलें", confirmClear:"इस डिवाइस से Field Desk के सभी नोट, काम और वित्तीय रिकॉर्ड हटाएं? यह वापस नहीं किया जा सकता।", cleared:"Field Desk डेटा मिटा दिया गया।", exported:"बैकअप डाउनलोड हो गया।", imported:"बैकअप सफलतापूर्वक आयात हुआ।", invalidBackup:"बैकअप मान्य नहीं है। डेटा नहीं बदला।", saved:"इस डिवाइस पर सहेजा गया।", due:"देय", completed:"पूरा", seedOutput:"अनुमानित आवश्यक बीज", waterOutput:"अनुमानित पानी की मात्रा", notificationGranted:"इस डिवाइस पर ब्राउज़र रिमाइंडर चालू हैं।", notificationDenied:"सूचनाएं उपलब्ध नहीं हैं या अनुमति नहीं मिली।", dueNotification:"आज खेत का काम देय है" },
    te: { eyebrow:"రైతులకు ఉపయోగకరమైన సహాయం", title:"మీ వ్యవసాయం, ఒకే చోట క్రమబద్ధంగా.", intro:"పొలం నోట్స్, పంట పరిశీలనలు, పనులు, ఆదాయ-ఖర్చులను ఈ పరికరంలో ఉంచండి. ఈ పేజీని ఒకసారి ఆన్‌లైన్‌లో తెరిచిన తర్వాత ప్రధాన సాధనాలు ఆఫ్‌లైన్‌లో పనిచేస్తాయి.", privacy:"🔒 మీ రికార్డులు ఈ పరికరంలోని బ్రౌజర్‌లోనే ఉంటాయి. అవి అప్‌లోడ్ లేదా షేర్ చేయబడవు.", navDiary:"పొలం డైరీ", navTasks:"పనులు", navMoney:"వ్యవసాయ లెక్కలు", navPlanning:"ప్రణాళిక", navData:"బ్యాకప్", diaryTitle:"పొలం డైరీ & పంట పరిశీలన", diaryHelp:"మీరు గమనించినది, చేసినది రాయండి. ఇది ఆటోమేటిక్ రోగ నిర్ధారణ కాదు; తీవ్రమైన సమస్యలకు స్థానిక KVK లేదా అర్హత కలిగిన వ్యవసాయ అధికారిని సంప్రదించండి.", date:"తేదీ", field:"పొలం / గ్రామం", crop:"పంట", stage:"పంట దశ", observation:"పరిశీలన / లక్షణం", action:"చర్య / తదుపరి పని", saveEntry:"పొలం నోట్ సేవ్ చేయండి", tasksTitle:"వ్యవసాయ పనుల ప్రణాళిక", tasksHelp:"నీటి తనిఖీ, పంట పరిశీలన, కోత, బీమా తేదీలు లేదా మార్కెట్ సందర్శనకు మీ రిమైండర్‌లను పెట్టుకోండి. బ్రౌజర్ నోటిఫికేషన్లు ఐచ్ఛికం.", task:"పని", dueDate:"చివరి తేదీ", fieldOptional:"పొలం (ఐచ్ఛికం)", addTask:"పని చేర్చండి", notifications:"బ్రౌజర్ రిమైండర్‌లు ప్రారంభించండి", moneyTitle:"వ్యవసాయ ఆదాయం & ఖర్చుల పుస్తకం", moneyHelp:"మీ కొనుగోళ్లు, అమ్మకాలను నమోదు చేయండి. మొత్తం మీరు నమోదు చేసిన లెక్కల ఆధారంగానే ఉంటుంది; రసీదులు ఉంచి మొత్తాలను తనిఖీ చేయండి.", income:"నమోదైన ఆదాయం", expense:"నమోదైన ఖర్చులు", balance:"నమోదైన నిల్వ", type:"రికార్డు రకం", description:"వివరణ", amount:"మొత్తం (₹)", saveRecord:"రికార్డు సేవ్ చేయండి", planningTitle:"సులభమైన పొలం లెక్కలు", seedTitle:"విత్తన పరిమాణ అంచనా", seedHelp:"విత్తన ప్యాకెట్ లేదా స్థానిక వ్యవసాయ సలహాలోని రేటును ఉపయోగించండి. ఈ సాధనం విత్తన రేటును సూచించదు.", areaAcres:"విస్తీర్ణం (ఎకరాలు)", seedRate:"మీ విత్తన రేటు (కిలోలు/ఎకరం)", calculate:"లెక్కించండి", waterTitle:"నీటి పరిమాణ అంచనా", waterHelp:"పొలం పరిస్థితి లేదా స్థానిక సలహా ఆధారంగా నిర్ణయించిన లోతును నమోదు చేయండి. ఒక ఎకరంలో 1 మిమీ నీరు సుమారు 4,047 లీటర్లు; ఇది పరిమాణ మార్పిడి మాత్రమే, నీటిపారుదల సిఫారసు కాదు.", waterDepth:"మీరు అనుకున్న నీటి లోతు (మిమీ)", dataTitle:"మీ డేటా, మీ పరికరం", dataHelp:"ఫోన్ మార్చే లేదా బ్రౌజర్ డేటా తొలగించే ముందు బ్యాకప్ డౌన్‌లోడ్ చేయండి. దిగుమతి చేస్తే Field Desk రికార్డులు ఎంచుకున్న బ్యాకప్‌తో భర్తీ అవుతాయి.", export:"బ్యాకప్ డౌన్‌లోడ్", import:"బ్యాకప్ దిగుమతి", clear:"Field Desk డేటా తొలగించండి", offlineNote:"ఆఫ్‌లైన్ ఉపయోగం: ఈ పేజీని ఒకసారి ఆన్‌లైన్‌లో తెరవండి; తర్వాత అదే బ్రౌజర్‌లో ఇంటర్నెట్ లేకుండానే తెరవవచ్చు. వాతావరణ సమాచారం, బయటి వెబ్‌సైట్లు, విచారణ పంపేందుకు ఇంటర్నెట్ అవసరం.", home:"← AgriGuard హోమ్‌కు వెళ్ళండి", disclaimer:"పంట నిర్ణయాలకు స్థానిక వ్యవసాయ సలహా తీసుకోండి. అంచనాలు ప్రణాళిక సహాయానికి మాత్రమే.", online:"ఆన్‌లైన్", offline:"ఆఫ్‌లైన్ · సేవ్ చేసిన టూల్స్ అందుబాటులో", checking:"కనెక్షన్ తనిఖీ…", emptyDiary:"ఇంకా పొలం నోట్లు సేవ్ కాలేదు.", emptyTasks:"ఇంకా పనులు సేవ్ కాలేదు.", emptyMoney:"ఇంకా ఆర్థిక రికార్డులు సేవ్ కాలేదు.", delete:"తొలగించు", done:"పూర్తయింది", reopen:"మళ్ళీ తెరువు", confirmClear:"ఈ పరికరం నుంచి Field Desk నోట్స్, పనులు, ఆర్థిక రికార్డులన్నీ తొలగించాలా? తిరిగి పొందలేరు.", cleared:"Field Desk డేటా తొలగించబడింది.", exported:"బ్యాకప్ డౌన్‌లోడ్ అయింది.", imported:"బ్యాకప్ విజయవంతంగా దిగుమతి అయింది.", invalidBackup:"బ్యాకప్ సరైనది కాదు. డేటా మారలేదు.", saved:"ఈ పరికరంలో సేవ్ అయింది.", due:"గడువు", completed:"పూర్తయింది", seedOutput:"అంచనా విత్తన అవసరం", waterOutput:"అంచనా నీటి పరిమాణం", notificationGranted:"ఈ పరికరంలో బ్రౌజర్ రిమైండర్‌లు ప్రారంభమయ్యాయి.", notificationDenied:"నోటిఫికేషన్లు అందుబాటులో లేవు లేదా అనుమతి లేదు.", dueNotification:"ఈరోజు పొలం పని గడువు" }
  };
  let language = "en";
  const t = (key) => messages[language][key] || messages.en[key] || key;
  const blankData = () => ({ diary: [], tasks: [], money: [] });
  function readData() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return { diary: Array.isArray(parsed?.diary) ? parsed.diary : [], tasks: Array.isArray(parsed?.tasks) ? parsed.tasks : [], money: Array.isArray(parsed?.money) ? parsed.money : [] };
    } catch { return blankData(); }
  }
  let data = readData();
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
    catch { announce("Storage is full or unavailable. Download a backup and free browser space."); return false; }
  }
  function announce(message) { $("dataStatus").textContent = message; }
  function makeButton(label, action, id, className = "icon-button") {
    return `<button type="button" class="${className}" data-action="${action}" data-id="${safe(id)}">${safe(label)}</button>`;
  }
  function renderDiary() {
    const target = $("diaryRecords");
    if (!data.diary.length) { target.innerHTML = `<p class="empty">${safe(t("emptyDiary"))}</p>`; return; }
    target.innerHTML = [...data.diary].sort((a,b) => b.date.localeCompare(a.date)).map((item) => `<article class="record"><div class="record-main"><strong>${safe(item.crop)} · ${safe(item.field)}</strong><span>${safe(item.date)}${item.stage ? ` · ${safe(item.stage)}` : ""}</span><span>${safe(item.observation)}</span>${item.action ? `<span class="record-meta">${safe(t("action"))}: ${safe(item.action)}</span>` : ""}</div><div class="record-actions">${makeButton(t("delete"), "delete-diary", item.id, "icon-button delete")}</div></article>`).join("");
  }
  function renderTasks() {
    const target = $("taskRecords");
    if (!data.tasks.length) { target.innerHTML = `<p class="empty">${safe(t("emptyTasks"))}</p>`; return; }
    target.innerHTML = [...data.tasks].sort((a,b) => Number(a.done)-Number(b.done) || a.date.localeCompare(b.date)).map((item) => `<article class="record ${item.done ? "done" : ""}"><div class="record-main"><strong>${safe(item.text)}</strong><span class="record-meta">${safe(t(item.done ? "completed" : "due"))}: ${safe(item.date)}${item.field ? ` · ${safe(item.field)}` : ""}</span></div><div class="record-actions">${makeButton(t(item.done ? "reopen" : "done"), "toggle-task", item.id)}${makeButton(t("delete"), "delete-task", item.id, "icon-button delete")}</div></article>`).join("");
  }
  function renderMoney() {
    const target = $("moneyRecords");
    const income = data.money.filter((x) => x.type === "income").reduce((sum,x) => sum + Number(x.amount), 0);
    const expenses = data.money.filter((x) => x.type === "expense").reduce((sum,x) => sum + Number(x.amount), 0);
    $("incomeTotal").textContent = money(income); $("expenseTotal").textContent = money(expenses); $("balanceTotal").textContent = money(income - expenses);
    if (!data.money.length) { target.innerHTML = `<p class="empty">${safe(t("emptyMoney"))}</p>`; return; }
    target.innerHTML = [...data.money].sort((a,b) => b.date.localeCompare(a.date)).map((item) => `<article class="record"><div class="record-main"><strong>${safe(item.description)} · ${safe(money(item.amount))}</strong><span class="record-meta">${safe(item.date)} · ${safe(t(item.type))}</span></div><div class="record-actions">${makeButton(t("delete"), "delete-money", item.id, "icon-button delete")}</div></article>`).join("");
  }
  function render() { renderDiary(); renderTasks(); renderMoney(); }
  function handleRecordAction(event) {
    const button = event.target.closest("button[data-action]"); if (!button) return;
    const { action, id } = button.dataset;
    if (action === "delete-diary") data.diary = data.diary.filter((x) => x.id !== id);
    if (action === "delete-task" || action === "toggle-task") data.tasks = data.tasks.map((x) => x.id !== id ? x : action === "delete-task" ? null : { ...x, done: !x.done }).filter(Boolean);
    if (action === "delete-money") data.money = data.money.filter((x) => x.id !== id);
    persist(); render();
  }
  ["diaryRecords", "taskRecords", "moneyRecords"].forEach((id) => $(id).addEventListener("click", handleRecordAction));
  $("diaryDate").value = today(); $("moneyDate").value = today(); $("taskDate").value = today();
  $("diaryForm").addEventListener("submit", (event) => {
    event.preventDefault();
    data.diary.unshift({ id: uid(), date: $("diaryDate").value, field: $("diaryField").value.trim(), crop: $("diaryCrop").value.trim(), stage: $("diaryStage").value.trim(), observation: $("diaryObservation").value.trim(), action: $("diaryAction").value.trim() });
    persist(); event.target.reset(); $("diaryDate").value = today(); render(); announce(t("saved"));
  });
  $("taskForm").addEventListener("submit", (event) => {
    event.preventDefault(); data.tasks.unshift({ id: uid(), text: $("taskText").value.trim(), date: $("taskDate").value, field: $("taskField").value.trim(), done: false });
    persist(); event.target.reset(); $("taskDate").value = today(); render(); announce(t("saved"));
  });
  $("moneyForm").addEventListener("submit", (event) => {
    event.preventDefault(); data.money.unshift({ id: uid(), type: $("moneyType").value, description: $("moneyDescription").value.trim(), amount: Number($("moneyAmount").value), date: $("moneyDate").value });
    persist(); event.target.reset(); $("moneyDate").value = today(); render(); announce(t("saved"));
  });
  $("seedForm").addEventListener("submit", (event) => {
    event.preventDefault(); const amount = Number($("seedArea").value) * Number($("seedRate").value);
    $("seedResult").textContent = `${t("seedOutput")}: ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg`; $("seedResult").hidden = false;
  });
  $("waterForm").addEventListener("submit", (event) => {
    event.preventDefault(); const liters = Number($("waterArea").value) * Number($("waterDepth").value) * 4046.856;
    $("waterResult").textContent = `${t("waterOutput")}: ${Math.round(liters).toLocaleString()} L`; $("waterResult").hidden = false;
  });
  function setLanguage(next) {
    language = messages[next] ? next : "en"; document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach((el) => { const value = t(el.dataset.i18n); if (value) el.textContent = value; });
    render(); updateConnection();
  }
  $("language").addEventListener("change", (event) => setLanguage(event.target.value));
  function updateConnection() {
    const status = $("connectionStatus"); status.textContent = navigator.onLine ? `● ${t("online")}` : `● ${t("offline")}`;
    status.classList.toggle("online", navigator.onLine); status.classList.toggle("offline", !navigator.onLine);
  }
  window.addEventListener("online", updateConnection); window.addEventListener("offline", updateConnection);
  $("enableNotifications").addEventListener("click", async () => {
    const node = $("notificationStatus");
    if (!("Notification" in window)) { node.textContent = t("notificationDenied"); return; }
    try { const permission = await Notification.requestPermission(); node.textContent = permission === "granted" ? t("notificationGranted") : t("notificationDenied"); }
    catch { node.textContent = t("notificationDenied"); }
  });
  function notifyDueTasks() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const marker = `agriguard:taskNotice:${today()}`; if (localStorage.getItem(marker)) return;
    const due = data.tasks.filter((task) => !task.done && task.date <= today()); if (!due.length) return;
    try { new Notification(t("dueNotification"), { body: due.slice(0, 3).map((x) => x.text).join(" · ") }); localStorage.setItem(marker, "1"); } catch { /* Notification may be blocked by browser policy. */ }
  }
  $("exportData").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ app: "AgriGuard Field Desk", version: 1, exportedAt: new Date().toISOString(), data }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `agriguard-field-desk-${today()}.json`; link.click(); URL.revokeObjectURL(url); announce(t("exported"));
  });
  $("importData").addEventListener("change", async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      if (file.size > 2_000_000) throw new Error("too large");
      const parsed = JSON.parse(await file.text()); const incoming = parsed.data;
      if (!incoming || !["diary", "tasks", "money"].every((key) => Array.isArray(incoming[key]))) throw new Error("invalid shape");
      data = { diary: incoming.diary, tasks: incoming.tasks, money: incoming.money };
      if (!persist()) throw new Error("storage unavailable");
      render(); announce(t("imported"));
    } catch { announce(t("invalidBackup")); }
    event.target.value = "";
  });
  $("clearData").addEventListener("click", () => {
    if (!window.confirm(t("confirmClear"))) return;
    data = blankData(); persist(); render(); announce(t("cleared"));
  });
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("field-desk-sw.js").catch(() => announce("Offline setup could not start. Please reload while connected.")));
  }
  setLanguage("en"); notifyDueTasks();
})();
