// ===== تحميل البيانات من localStorage =====
let freeUsers = JSON.parse(localStorage.getItem("freeUsers")) || [];
let paidUsers = JSON.parse(localStorage.getItem("paidUsers")) || [];

function saveData() {
  localStorage.setItem("freeUsers", JSON.stringify(freeUsers));
  localStorage.setItem("paidUsers", JSON.stringify(paidUsers));
}

// ===== معرف الجهاز =====
function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = Math.random().toString(36).substring(2);
    localStorage.setItem("device_id", id);
  }
  return id;
}

// ===== تسجيل مستخدم جديد (Free) =====
function register() {
  const code = document.getElementById("code").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  if (!code || !password) {
    msg.innerText = "❌ أدخل الكود وكلمة السر";
    return;
  }

  if (
    freeUsers.find(u => u.code === code) ||
    paidUsers.find(u => u.code === code)
  ) {
    msg.innerText = "❌ الكود مستخدم";
    return;
  }

  freeUsers.push({
    type: "free",
    code,
    password,
    deviceId: getDeviceId(),
    expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
    banned: false,
    servers: ["FREE-SERVER-1"]
  });

  saveData();
  msg.innerText = "✅ تم التسجيل، ادخل الآن";
}

// ===== تسجيل الدخول =====
function login() {
  const code = document.getElementById("code").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  let user =
    freeUsers.find(u => u.code === code) ||
    paidUsers.find(u => u.code === code);

  if (!user) {
    msg.innerText = "❌ كود غير صحيح";
    return;
  }

  if (user.banned) {
    msg.innerText = "🚫 هذا الكود محظور";
    return;
  }

  if (user.deviceId && user.deviceId !== getDeviceId()) {
    user.banned = true;
    saveData();
    msg.innerText = "🚫 تم الحظر (جهاز آخر)";
    return;
  }

  if (user.password && user.password !== password) {
    msg.innerText = "❌ كلمة السر خاطئة";
    return;
  }

  if (Date.now() > user.expire) {
    msg.innerText = "⏱️ انتهت المدة";
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "dashboard.html";
}
let freeUsers = [];
let paidUsers = [];

function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("device_id", id); }
  return id;
}

function register() {
  const code = document.getElementById("code").value;
  const password = document.getElementById("password").value;
  const deviceId = getDeviceId();
  const msg = document.getElementById("msg");

  freeUsers.push({ code, password, deviceId, expire: Date.now()+7*24*60*60*1000 });
  msg.innerText = "✅ تم التسجيل بنجاح";
}

function login() {
  const code = document.getElementById("code").value;
  const password = document.getElementById("password").value;
  const deviceId = getDeviceId();
  const msg = document.getElementById("msg");

  let user = freeUsers.find(u=>u.code===code) || paidUsers.find(u=>u.code===code);

  if (!user) { msg.innerText="❌ كود غير صحيح"; return; }
  if (user.banned) { msg.innerText="🚫 تم حظر الكود"; return; }
  if (user.deviceId && user.deviceId !== deviceId) { user.banned=true; msg.innerText="🚫 تم حظر الكود (جهاز ثاني)"; return; }
  if (user.password && user.password!==password) { msg.innerText="❌ كلمة السر خاطئة"; return; }

  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

function registerFree() {
  const code = document.getElementById("freeCode").value;
  freeUsers.push({ code, deviceId: getDeviceId(), expire: Date.now()+7*24*60*60*1000 });
  alert("تم تسجيل الكود المجاني!");
}

function createPaidCode() {
  const code = document.getElementById("paidCode").value;
  const duration = parseInt(document.getElementById("duration").value);
  const expire = Date.now() + duration*24*60*60*1000;
  paidUsers.push({ code, deviceId:null, expire });
  document.getElementById("paidList").innerHTML = paidUsers.map(u=>`${u.code} → ينتهي: ${new Date(u.expire).toLocaleDateString()}`).join("<br>");
  alert("تم إنشاء الكود المدفوع!");
}

function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) location.href="index.html";
  const div = document.getElementById("servers");

  if (user.type==="admin") div.innerHTML=`<h2>👑 سيرفرك الخاص</h2><pre>${user.servers.join("\n")}</pre>`;
  else if (user.type==="free") div.innerHTML=`<h2>🆓 سيرفر مجاني</h2><pre>${user.servers.join("\n")}</pre>
  <p>⏱️ تنتهي في: ${new Date(user.expire).toLocaleString()}</p>`;
  else if (user.type==="paid") div.innerHTML=`<h2>💎 سيرفر مدفوع</h2><pre>${user.servers.join("\n")}</pre>
  <p>🎟️ ينتهي في: ${new Date(user.expire).toLocaleString()}</p>`;
}
let freeUsers = [];
let paidUsers = [];

function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("device_id", id); }
  return id;
}

function register() {
  const code = document.getElementById("code").value;
  const password = document.getElementById("password").value;
  const deviceId = getDeviceId();
  const msg = document.getElementById("msg");

  freeUsers.push({ code, password, deviceId, expire: Date.now()+7*24*60*60*1000 });
  msg.innerText = "✅ تم التسجيل بنجاح";
}

function login() {
  const code = document.getElementById("code").value;
  const password = document.getElementById("password").value;
  const deviceId = getDeviceId();
  const msg = document.getElementById("msg");

  let user = freeUsers.find(u=>u.code===code) || paidUsers.find(u=>u.code===code);

  if (!user) { msg.innerText="❌ كود غير صحيح"; return; }
  if (user.banned) { msg.innerText="🚫 تم حظر الكود"; return; }
  if (user.deviceId && user.deviceId !== deviceId) { user.banned=true; msg.innerText="🚫 تم حظر الكود (جهاز ثاني)"; return; }
  if (user.password && user.password!==password) { msg.innerText="❌ كلمة السر خاطئة"; return; }

  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

function registerFree() {
  const code = document.getElementById("freeCode").value;
  freeUsers.push({ code, deviceId: getDeviceId(), expire: Date.now()+7*24*60*60*1000 });
  alert("تم تسجيل الكود المجاني!");
}

function createPaidCode() {
  const code = document.getElementById("paidCode").value;
  const duration = parseInt(document.getElementById("duration").value);
  const expire = Date.now() + duration*24*60*60*1000;
  paidUsers.push({ code, deviceId:null, expire });
  document.getElementById("paidList").innerHTML = paidUsers.map(u=>`${u.code} → ينتهي: ${new Date(u.expire).toLocaleDateString()}`).join("<br>");
  alert("تم إنشاء الكود المدفوع!");
}

function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) location.href="index.html";
  const div = document.getElementById("servers");

  if (user.type==="admin") div.innerHTML=`<h2>👑 سيرفرك الخاص</h2><pre>${user.servers.join("\n")}</pre>`;
  else if (user.type==="free") div.innerHTML=`<h2>🆓 سيرفر مجاني</h2><pre>${user.servers.join("\n")}</pre>
  <p>⏱️ تنتهي في: ${new Date(user.expire).toLocaleString()}</p>`;
  else if (user.type==="paid") div.innerHTML=`<h2>💎 سيرفر مدفوع</h2><pre>${user.servers.join("\n")}</pre>
  <p>🎟️ ينتهي في: ${new Date(user.expire).toLocaleString()}</p>`;
}

