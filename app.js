// ===== تحميل البيانات =====
let freeUsers = JSON.parse(localStorage.getItem("freeUsers")) || [];
let paidUsers = JSON.parse(localStorage.getItem("paidUsers")) || [];

function saveData() {
  localStorage.setItem("freeUsers", JSON.stringify(freeUsers));
  localStorage.setItem("paidUsers", JSON.stringify(paidUsers));
}

// ===== جهاز المستخدم =====
function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

// ===== تسجيل =====
function register() {
  const code = document.getElementById("code").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  if (!code || !password) {
    msg.innerText = "❌ أدخل الكود وكلمة السر";
    return;
  }

  if (freeUsers.find(u => u.code === code) || paidUsers.find(u => u.code === code)) {
    msg.innerText = "❌ الكود مستخدم";
    return;
  }

  freeUsers.push({
    code,
    password,
    deviceId: getDeviceId(),
    expire: Date.now() + 7*24*60*60*1000,
    type: "free",
    banned: false
  });

  saveData();
  msg.innerText = "✅ تم التسجيل بنجاح";
}

// ===== تسجيل دخول =====
function login() {
  const code = document.getElementById("code").value.trim();
  const password = document.getElementById("password").value.trim();
  const deviceId = getDeviceId();
  const msg = document.getElementById("msg");

  let user =
    freeUsers.find(u => u.code === code) ||
    paidUsers.find(u => u.code === code);

  if (!user) {
    msg.innerText = "❌ كود غير صحيح";
    return;
  }

  if (user.banned) {
    msg.innerText = "🚫 الكود محظور";
    return;
  }

  if (user.deviceId && user.deviceId !== deviceId) {
    user.banned = true;
    saveData();
    msg.innerText = "🚫 تم الحظر (جهاز مختلف)";
    return;
  }

  if (user.password && user.password !== password) {
    msg.innerText = "❌ كلمة السر خاطئة";
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "dashboard.html";
}
