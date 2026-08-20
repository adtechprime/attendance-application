import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import {
  Camera,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Building2,
  Zap,
  XCircle,
  RotateCcw,
  Lock,
  Loader2,
  Timer,
  Settings,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { calculateGpsDistanceMeters } from "../../utils/calculations";

/* ─────────────────────────────────────────────────────────────
   PERMISSION HELP BANNER
───────────────────────────────────────────────────────────── */
const PermissionHelp = ({ type, onRetry }) => {
  const isGps = type === "gps";
  const title = isGps ? "Location Access Blocked" : "Camera Access Blocked";
  const reason = isGps
    ? "Your browser blocked location access. Real GPS coordinates are required to verify site attendance."
    : "Your browser blocked camera access. Front camera is required to take a live selfie.";

  return (
    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 space-y-3">
      <div className="flex items-start gap-3">
        {isGps ? (
          <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <Camera className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        )}
        <div className="min-w-0">
          <div className="text-sm font-bold text-amber-900 dark:text-amber-200">{title}</div>
          <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-0.5 leading-relaxed">{reason}</p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> How to allow on Mobile:
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-slate-600 dark:text-slate-400 pl-1">
            <li>Tap the <strong>🔒 lock / info icon</strong> in browser address bar.</li>
            <li>Tap <strong>Permissions</strong> or <strong>Site settings</strong>.</li>
            <li>Set <strong>{isGps ? "Location" : "Camera"}</strong> to <strong className="text-emerald-600 dark:text-emerald-400">Allow</strong>.</li>
          </ol>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="w-full py-3 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center gap-2 transition-all btn-touch"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PUNCH STATION COMPONENT
───────────────────────────────────────────────────────────── */
export const PunchStation = () => {
  const { activeEmployee, projects, attendance, punchIn, punchOut, addNotification, showToast } = useApp();

  const today = new Date().toISOString().split("T")[0];
  const todayAtt = attendance.find((a) => a.employeeId === activeEmployee?.id && a.date === today);
  const hasPunchedIn = !!todayAtt;
  const hasPunchedOut = !!todayAtt?.punchOutTime;

  // Selected site (defaults to first assigned project or first available)
  const empAssignedIds = activeEmployee?.assignedProjectIds || (activeEmployee?.assignedProjectId ? [activeEmployee.assignedProjectId] : []);
  const defaultProjectId = empAssignedIds[0] || activeEmployee?.assignedProjectId || projects[0]?.id;
  const [selectedProjectId, setSelectedProjectId] = useState(defaultProjectId);

  useEffect(() => {
    if (empAssignedIds.length > 0) {
      setSelectedProjectId(empAssignedIds[0]);
    }
  }, [activeEmployee?.id, activeEmployee?.assignedProjectId, activeEmployee?.assignedProjectIds]);

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const selectableProjects = empAssignedIds.length > 0 
    ? projects.filter((p) => empAssignedIds.includes(p.id)) 
    : projects;

  // GPS State
  const [gps, setGps] = useState({ lat: null, lng: null, address: "", status: "idle", errorCode: null });

  // Camera & Live Selfie State
  const videoRef = useRef(null);
  const [camStep, setCamStep] = useState("idle"); // 'idle' | 'live' | 'preview' | 'confirmed' | 'denied'
  const [stream, setStream] = useState(null);
  const [selfieDataUrl, setSelfieDataUrl] = useState(null);

  // Overtime Request State
  const [otRequested, setOtRequested] = useState(todayAtt?.overtimeStatus === "pending");

  // ─────────────────────────────────────────────────────────────
  // LIVE STOP-WATCH WORKING TIMER (HH:MM:SS)
  // ─────────────────────────────────────────────────────────────
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timerInterval = null;

    if (hasPunchedIn && !hasPunchedOut) {
      const calculateElapsed = () => {
        let startMs = todayAtt.punchInTimestamp;
        if (!startMs && todayAtt.punchInTime) {
          startMs = new Date(`${todayAtt.date} ${todayAtt.punchInTime}`).getTime();
        }
        if (startMs) {
          const seconds = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
          setElapsedSeconds(seconds);
        }
      };

      calculateElapsed();
      timerInterval = setInterval(calculateElapsed, 1000);
    } else if (hasPunchedOut) {
      // Calculate final duration
      let startMs = todayAtt.punchInTimestamp || new Date(`${todayAtt.date} ${todayAtt.punchInTime}`).getTime();
      let endMs = todayAtt.punchOutTimestamp || new Date(`${todayAtt.date} ${todayAtt.punchOutTime}`).getTime();
      if (startMs && endMs) {
        setElapsedSeconds(Math.max(0, Math.floor((endMs - startMs) / 1000)));
      }
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [hasPunchedIn, hasPunchedOut, todayAtt]);

  const formatTimer = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // ─────────────────────────────────────────────────────────────
  // GPS GEOLOCATION
  // ─────────────────────────────────────────────────────────────
  const fetchGps = () => {
    setGps({ lat: null, lng: null, address: "", status: "fetching", errorCode: null });

    if (!("geolocation" in navigator)) {
      setGps({ lat: null, lng: null, address: "", status: "unavailable", errorCode: "API_MISSING" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        const accuracy = Math.round(pos.coords.accuracy);
        const dist = calculateGpsDistanceMeters(lat, lng, currentProject.latitude, currentProject.longitude);
        setGps({
          lat,
          lng,
          address: `${lat}° N, ${lng}° E • ~${Math.round(dist)}m from ${currentProject.name} (±${accuracy}m)`,
          status: "ok",
          errorCode: null,
        });
      },
      (err) => {
        let status = "denied";
        if (err.code === 2) status = "unavailable";
        if (err.code === 3) status = "timeout";
        setGps({ lat: null, lng: null, address: "", status, errorCode: err.code });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    fetchGps();
  }, [currentProject?.id]);

  // ─────────────────────────────────────────────────────────────
  // CAMERA STREAM & SNAPSHOT
  // ─────────────────────────────────────────────────────────────
  const openCamera = async () => {
    setSelfieDataUrl(null);
    setCamStep("live");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 120);
    } catch (err) {
      console.warn("Camera error:", err);
      setCamStep("denied");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");

    // Mirror for natural selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Watermark
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.fillRect(0, canvas.height - 48, canvas.width, 48);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(
      `${activeEmployee?.name}  •  ${new Date().toLocaleTimeString("en-IN")}  •  ${currentProject?.code || "SITE"}`,
      12,
      canvas.height - 28
    );
    ctx.fillStyle = "#93c5fd";
    ctx.font = "11px sans-serif";
    ctx.fillText(`GPS: ${gps.lat ?? "verified"}, ${gps.lng ?? "verified"}`, 12, canvas.height - 10);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setSelfieDataUrl(dataUrl);
    stopCamera();
    setCamStep("preview");
  };

  const confirmSelfie = () => setCamStep("confirmed");
  const retakeSelfie = () => {
    setSelfieDataUrl(null);
    openCamera();
  };

  // ─────────────────────────────────────────────────────────────
  // PUNCH ACTIONS
  // ─────────────────────────────────────────────────────────────
  const canPunch = camStep === "confirmed" && gps.status === "ok";

  const handlePunchInAction = () => {
    punchIn({
      employeeId: activeEmployee.id,
      projectId: currentProject.id,
      siteName: currentProject.name,
      lat: gps.lat,
      lng: gps.lng,
      address: gps.address,
      selfieUrl: selfieDataUrl,
    });
  };

  const handlePunchOutAction = () => {
    if (!todayAtt) return;
    punchOut({
      attendanceId: todayAtt.id,
      lat: gps.lat,
      lng: gps.lng,
      address: gps.address,
      selfieUrl: selfieDataUrl,
    });
  };

  const handleRequestOvertime = () => {
    setOtRequested(true);
    addNotification({
      title: "⚡ Overtime Approval Requested",
      message: `${activeEmployee?.name} (EMP-${activeEmployee?.employeeCode}) requested Overtime at ${currentProject?.name}.`,
      type: "overtime_alert",
      employeeId: activeEmployee?.id,
    });
    showToast("✓ Overtime request sent to Superadmin for approval!", "success");
  };

  const gpsIsBlocked = gps.status === "denied" || gps.status === "unavailable" || gps.status === "timeout";

  return (
    <div className="max-w-md mx-auto space-y-4 pb-6">
      {/* ─────────────────────────────────────────────────────────
          TOP WORKER GREETING & STATUS CARD
      ───────────────────────────────────────────────────────── */}
      <div className="app-panel p-5 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activeEmployee?.avatar}
              alt={activeEmployee?.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-600 dark:border-blue-500 shadow-sm"
            />
            <div>
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-400">Welcome on Duty</div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{activeEmployee?.name}</h2>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                EMP-{activeEmployee?.employeeCode} • {activeEmployee?.designation}
              </div>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              hasPunchedOut
                ? "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                : hasPunchedIn
                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700"
                : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700"
            }`}
          >
            {hasPunchedOut ? "Shift Completed" : hasPunchedIn ? "● Working Now" : "○ Not Punched"}
          </span>
        </div>

        {/* ─────────────────────────────────────────────────────────
            LIVE STOP-WATCH WORKING TIMER (HH:MM:SS)
        ───────────────────────────────────────────────────────── */}
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                Today's Working Stopwatch
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100">
                {formatTimer(elapsedSeconds)}
              </div>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
            {hasPunchedIn && (
              <div>
                In: <strong className="text-blue-700 dark:text-blue-400">{todayAtt.punchInTime}</strong>
              </div>
            )}
            {hasPunchedOut && (
              <div>
                Out: <strong className="text-rose-600 dark:text-rose-400">{todayAtt.punchOutTime}</strong>
              </div>
            )}
            {!hasPunchedIn && <div>Shift: 8h Regular</div>}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          STEP 1: SITE SELECTION DROPDOWN
      ───────────────────────────────────────────────────────── */}
      <div className="app-card p-4 rounded-2xl space-y-2">
        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Step 1: Select Work Site / Project
        </label>
        <div className="relative">
          <select
            value={selectedProjectId}
            disabled={hasPunchedIn}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full app-input p-3.5 pr-10 rounded-xl text-sm font-bold appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {selectableProjects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name} ({proj.code})
              </option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="truncate">{currentProject?.locationName}</span>
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────
          STEP 2: LIVE GPS LOCATION TAGGING
      ───────────────────────────────────────────────────────── */}
      <div className="app-card p-4 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Step 2: Live GPS Location
          </label>
          {!gpsIsBlocked && (
            <button
              onClick={fetchGps}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${gps.status === "fetching" ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {gps.status === "fetching" && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800">
            <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Fetching GPS coordinates…
            </div>
          </div>
        )}

        {gps.status === "ok" && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700/60">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">GPS Location Verified ✓</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate">{gps.address}</div>
            </div>
          </div>
        )}

        {gpsIsBlocked && <PermissionHelp type="gps" onRetry={fetchGps} />}
      </div>

      {/* ─────────────────────────────────────────────────────────
          STEP 3: LIVE SELFIE CAMERA
      ───────────────────────────────────────────────────────── */}
      <div className="app-card p-4 rounded-2xl space-y-3">
        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Step 3: Live Selfie Camera
        </label>

        {/* State: Idle */}
        {camStep === "idle" && (
          <div className="space-y-3">
            <div className="h-36 rounded-2xl bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1.5 text-center p-4">
              <Camera className="w-8 h-8 text-slate-400" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Take Live Selfie</div>
              <div className="text-[11px] text-slate-500">Selfie photo required before punching attendance</div>
            </div>
            <button
              onClick={openCamera}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md transition-all btn-touch"
            >
              <Camera className="w-4 h-4" />
              <span>Open Camera & Take Photo</span>
            </button>
          </div>
        )}

        {/* State: Camera Blocked */}
        {camStep === "denied" && <PermissionHelp type="camera" onRetry={openCamera} />}

        {/* State: Live Stream */}
        {camStep === "live" && (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-blue-600 aspect-[4/3]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-full text-[10px] font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>LIVE CAMERA</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  stopCamera();
                  setCamStep("idle");
                }}
                className="py-3 rounded-xl font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 btn-touch"
              >
                <XCircle className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={takePhoto}
                className="py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md btn-touch"
              >
                <Camera className="w-4 h-4" /> Snap Photo
              </button>
            </div>
          </div>
        )}

        {/* State: Preview */}
        {camStep === "preview" && selfieDataUrl && (
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden border-2 border-blue-600 aspect-[4/3]">
              <img src={selfieDataUrl} alt="Selfie Preview" className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={retakeSelfie}
                className="py-3 rounded-xl font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 btn-touch"
              >
                <RotateCcw className="w-4 h-4" /> Retake
              </button>
              <button
                onClick={confirmSelfie}
                className="py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md btn-touch"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Photo
              </button>
            </div>
          </div>
        )}

        {/* State: Confirmed */}
        {camStep === "confirmed" && selfieDataUrl && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700/60">
            <img
              src={selfieDataUrl}
              alt="Confirmed"
              className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">✓ Selfie Confirmed</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">Ready to punch duty</div>
            </div>
            <button
              onClick={() => {
                setSelfieDataUrl(null);
                setCamStep("idle");
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────
          STEP 4: BIG FINGER PUNCH BUTTONS (GREEN IN -> RED OUT -> ORANGE OT)
      ───────────────────────────────────────────────────────── */}
      <div className="app-panel p-5 rounded-3xl space-y-3">
        <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center">
          Step 4: Mark Attendance
        </label>

        {!canPunch && !hasPunchedIn && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Complete Steps 2 & 3 (GPS & Selfie) to unlock Punch In.</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {/* GREEN PUNCH IN BUTTON */}
          <button
            disabled={!canPunch || hasPunchedIn}
            onClick={handlePunchInAction}
            className={`py-4 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg btn-touch ${
              canPunch && !hasPunchedIn
                ? "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-50"
            }`}
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="text-xs leading-tight">{hasPunchedIn ? `IN: ${todayAtt.punchInTime}` : "PUNCH IN (GREEN)"}</span>
          </button>

          {/* RED PUNCH OUT BUTTON */}
          <button
            disabled={!hasPunchedIn || hasPunchedOut || !canPunch}
            onClick={handlePunchOutAction}
            className={`py-4 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg btn-touch ${
              hasPunchedIn && !hasPunchedOut && canPunch
                ? "bg-rose-600 hover:bg-rose-500 text-white cursor-pointer active:scale-95 animate-pulse"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-50"
            }`}
          >
            <XCircle className="w-6 h-6" />
            <span className="text-xs leading-tight">
              {hasPunchedOut ? `OUT: ${todayAtt.punchOutTime}` : "PUNCH OUT (RED)"}
            </span>
          </button>
        </div>

        {/* ORANGE OVERTIME BUTTON */}
        {hasPunchedIn && (
          <button
            disabled={otRequested}
            onClick={handleRequestOvertime}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg btn-touch ${
              !otRequested
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer active:scale-95"
                : "bg-slate-200 dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 cursor-default opacity-80"
            }`}
          >
            <Zap className="w-5 h-5" />
            <span>
              {otRequested ? "✓ OVERTIME ALERT SENT (PENDING APPROVAL)" : "REQUEST OVERTIME APPROVAL (ORANGE)"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
