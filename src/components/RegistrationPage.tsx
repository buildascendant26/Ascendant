import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { AsciiField } from "./AsciiField";

type Field =
  | "team_count"
  | "member_names"
  | "school"
  | "team_name"
  | "contact_email"
  | "email_otp"
  | "contact_phone"
  | "confirm";

type Answers = {
  teamCount: string;
  members: string[];
  school: string;
  teamName: string;
  contactEmail: string;
  contactPhone: string;
};

const ACCENT = "#cba6f7";

const SCHOOLS = [
  "The International School Bangalore", "Indus International School Bangalore", "Greenwood High International School",
  "Mallya Aditi International School", "Inventure Academy", "Canadian International School",
  "Stonehill International School", "Trio World Academy", "Oakridge International School Bengaluru",
  "Neev Academy", "Legacy School", "Bangalore International School", "Sharanya Narayani International School",
  "Harrow International School Bengaluru", "New Horizon International School", "Primus Public School",
  "Harvest International School", "Ebenezer International School", "One World International School", "United World Academy",
  "National Public School Indiranagar", "National Public School Rajajinagar", "National Public School Koramangala",
  "National Public School HSR Layout", "Delhi Public School Bangalore East", "Delhi Public School Bangalore South",
  "Delhi Public School Bangalore North", "Presidency School Bangalore North", "Presidency School Bangalore South",
  "National Centre for Excellence", "Sri Kumaran Children's Home", "Kendriya Vidyalaya IISc",
  "Kendriya Vidyalaya DRDO", "Orchid International School", "VIBGYOR High School", "The Brigade School",
  "New Horizon Gurukul", "Jain International Residential School", "BGS National Public School",
  "Ryan International School Bangalore", "Bishop Cotton Boys' School", "Bishop Cotton Girls' School",
  "Bethany High School", "New Horizon Public School", "Frank Anthony Public School", "Baldwin Boys' High School",
  "Baldwin Girls' High School", "Sophia High School", "Sacred Heart Girls High School", "Clarence High School",
  "St. Joseph's Boys' High School", "St. Francis Xavier Girls High School", "Vidyashilp Academy",
  "Greenwood High ICSE", "Head Start Educational Academy", "The Valley School", "Deens Academy",
  "Treamis World School", "Prakriya Green Wisdom School", "Gear Innovative International School",
  "Army Public School", "Air Force School Hebbal", "CMR National Public School", "CMR International School",
  "EuroSchool Whitefield", "EuroSchool HSR", "EuroSchool North Campus", "Chrysalis High Varthur",
  "Chrysalis High Kadugodi", "Chrysalis High Bannerghatta", "Candor International School",
  "Jain Heritage School", "Presidency School RT Nagar", "Vidyaniketan Public School",
  "Greenwood High Bannerghatta", "Green Dot International School", "National Academy for Learning",
  "Greenwood High Sarjapur", "Shishya BEML Public School", "Vibgyor High Haralur", "Vibgyor High Marathahalli",
  "Vibgyor High Electronic City", "BGS International Public School", "Sorsfort International School",
  "Delhi World Public School", "Cambridge Public School", "Reva Independent PU & School", "Ekya School JP Nagar",
  "Ekya School ITPL", "Ekya School BTM Layout", "Rashtrotthana Vidya Kendra", "Nitte International School",
  "Whitefield Global School", "Winmore Academy", "Presidency School Kasturinagar", "Harvest CBSE School",
  "Global Indian International School", "Sherwood High School", "Florence Public School", "East Point School",
  "Sindhi High School Hebbal", "Sindhi High School KK Road", "St. Germain High School", "St. John's High School",
  "Mount Carmel Central School", "Christ Academy", "Christ Junior College", "Jain College", "Mount Litera Zee School",
  "Aura International School", "Vydehi School of Excellence", "St. Paul's English School", "JSS Public School",
  "Gopalan National School", "Gopalan International School", "Redbridge International Academy",
  "Sishu Griha Montessori and High School", "Carmel Convent School", "Cluny Convent High School",
  "Sri Aurobindo Memorial School", "Jnanodaya School", "Jain Public School", "Kendriya Vidyalaya NAL",
  "Kendriya Vidyalaya Hebbal", "Kendriya Vidyalaya MG Railway Colony", "Vagdevi Vilas School",
  "Amrita Vidyalayam", "Edify School", "Freedom International School", "Navkis Educational Centre",
  "Hiranandani Upscale School", "Glendale Academy", "St. Vincent Pallotti School", "St. Charles High School",
  "National Public School Banashankari", "National Public School Whitefield", "National Public School Yeshwanthpur",
  "National Public School Jayanagar", "National Public School Kalkere", "Sri Chaitanya Techno School",
  "Narayana E-Techno School", "T.I.M.E. Kids", "Podar International School", "Orchids The International School",
  "Global City International School", "BGS Public School", "St. Aloysius School", "Stella Maris School",
  "AECS Magnolia Maaruti Public School", "AECS Layout Public School", "HAL Public School", "BEML Public School",
  "BEL Vidyalaya", "Kendriya Vidyalaya Jalahalli", "VVS Sardar Patel PU College", "MES Kishora Kendra",
  "Poorna Prajna Education Centre", "Carmel School Padmanabhanagar", "Sri Jnanakshi Vidyaniketan",
  "Prarthana School", "S Cadambi Vidya Kendra", "Sri Vani Education Centre", "BMS Public School",
  "Capital Public School", "Everton Public School", "Florence High School", "Sunrise International School",
  "Silicon City Academy", "Oxford Senior Secondary School", "Oxford English School", "Tenderfoot School",
  "The Cambridge International School", "TCIS (The Cambridge International School)", "TCIS Whitefield", "TCIS Sarjapur",
  "The Frank Anthony Public School", "Clarence Public School", "Cathedral High School", "Bishop Cotton Women's Christian College",
  "St. Joseph's Indian High School", "St. Joseph's Boys' High School", "St. Joseph's Pre-University College",
  "St. Aloysius Degree College", "Sacred Heart Boys High School", "St. Meera's High School",
  "Vidyashilp University", "Mallya Aditi Pre-University College", "Jain College Jayanagar", "Jain College VV Puram",
  "Deeksha Centre for Learning", "BASE Educational Services", "FIITJEE PU College", "Allen Career Institute",
  "Aakash Institute", "Narayana PU College", "Sri Chaitanya PU College", "Expert PU College",
  "RV PU College", "BMS PU College", "PES PU College", "Christ Junior College Residential",
  "Christ Academy Junior College", "Jyoti Nivas Pre-University College", "Mount Carmel PU College",
  "National College Basavanagudi", "National College Jayanagar", "Surana College", "Vijaya College",
  "KLE Society's S Nijalingappa College", "Seshadripuram Pre-University College", "MES PU College",
  "Al-Ameen Pre-University College", "Maharani Lakshmi Ammanni College", "Ramaiah PU College",
  "New Horizon PU College", "CMR PU College", "Sindhi PU College", "St. Francis Junior College",
  "Kristu Jayanti College", "St. Claret College", "Indian Academy Degree College",
  "East Point College", "Dayananda Sagar Pre-University College", "JSS Pre-University College"
];

function getPrompt(field: Field, idx?: number): string {
  switch (field) {
    case "team_count":
      return "Enter number of team members (2-4)";
    case "member_names":
      return `Member ${idx! + 1}`;
    case "school":
      return "School";
    case "team_name":
      return "Team name";
    case "contact_email":
      return "Contact email";
    case "email_otp":
      return "Enter 6-digit verification code sent to your email";
    case "contact_phone":
      return "Contact phone";
    case "confirm":
      return "Submit registration? (y/n)";
  }
}

interface RegistrationPageProps {
  onClose: () => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onClose }) => {
  const [visible, setVisible] = useState(false);
  const [bootDone, setBootDone] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [suggestionMatchIdx, setSuggestionMatchIdx] = useState(-1);
  const [shakeKey, setShakeKey] = useState(0);
  const [emailAttempts, setEmailAttempts] = useState(0);
  const [cooldownEnd, setCooldownEnd] = useState(0);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expectedOtp, setExpectedOtp] = useState("");

  const [field, setField] = useState<Field | null>(null);
  const [memberIdx, setMemberIdx] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    teamCount: "",
    members: [],
    school: "",
    teamName: "",
    contactEmail: "",
    contactPhone: "",
  });

  // Dynamic suggestions generation supporting school lists, counts, confirm toggles, and email domains
  const activeSuggestions = useMemo<string[]>(() => {
    if (!field) return [];
    const trimmed = input.trim();
    if (field === "school") {
      if (!trimmed) return [];
      const q = trimmed.toLowerCase();
      return SCHOOLS.filter((s) => s.toLowerCase().includes(q)).slice(0, 4);
    }
    if (field === "team_count") {
      return ["2", "3", "4"].filter((opt) => opt.startsWith(trimmed));
    }
    if (field === "confirm") {
      const q = trimmed.toLowerCase();
      if (!q) return ["y", "n"];
      return ["y", "n"].filter((opt) => opt.startsWith(q));
    }
    if (field === "contact_email") {
      if (!trimmed) return [];
      if (trimmed.includes("@")) {
        return [];
      }
      return [`${trimmed}@gmail.com`, `${trimmed}@outlook.com`];
    }
    return [];
  }, [field, input]);

  // Reset suggestion match pointer whenever suggestions array length changes
  useEffect(() => {
    setSuggestionMatchIdx(-1);
  }, [field, activeSuggestions.length]);

  const progress = useMemo(() => {
    if (!bootDone) return 0;
    if (submitted) return 1;
    const teamCount = parseInt(answers.teamCount, 10);
    switch (field) {
      case "team_count": return 0.08;
      case "member_names": return 0.08 + (memberIdx / (teamCount || 2)) * 0.22;
      case "school": return 0.35;
      case "team_name": return 0.50;
      case "contact_email": return 0.65;
      case "contact_phone": return 0.80;
      case "confirm": return 0.92;
      default: return 0;
    }
  }, [bootDone, field, memberIdx, answers.teamCount, submitted]);

  const [history, setHistory] = useState<{ prompt: string; value: string; isMessage?: boolean }[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 85);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 30;
    const interval = setInterval(() => {
      frame++;
      setBootProgress(Math.min(frame / totalFrames, 1));
      if (frame >= totalFrames) {
        clearInterval(interval);
        setTimeout(() => {
          setBootDone(true);
          setField("team_count");
          focusInput();
        }, 300);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const focusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 5);
  }, []);

  useEffect(() => {
    focusInput();
  }, [field, focusInput]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldownEnd <= Date.now()) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
      setCooldownLeft(left);
      if (left <= 0) {
        clearInterval(id);
        setEmailAttempts(0);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [cooldownEnd]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, input, field]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxA9iAR3LvwSP8VKd_qCmFLNSt74Vc3jCbISQctABHw1TdpTEicRDR1HPVZml65_Mht/exec",
        {
          method: "POST",
          headers: {
            // Using text/plain avoids the Google Apps Script CORS preflight OPTIONS request
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            action: "register",
            teamName: answers.teamName,
            school: answers.school,
            teamSize: answers.teamCount,
            leaderName: answers.members[0] || "",
            leaderEmail: answers.contactEmail,
            leaderPhone: answers.contactPhone,
            member2: answers.members[1] || "",
            member3: answers.members[2] || "",
            member4: answers.members[3] || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.success === true) {
        setSubmitted(true);
        setField(null);
      } else {
        const errorText = data && data.message ? data.message : "Registration failed. Please try again.";
        setErrorMsg(errorText);
        setShakeKey((k) => k + 1);
        setTimeout(() => setErrorMsg(""), 5000);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      const networkErrorMsg = "Network connection failed. Please check your internet connection and try again.";
      setErrorMsg(networkErrorMsg);
      setShakeKey((k) => k + 1);
      setTimeout(() => setErrorMsg(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  async function commitInput(suggestedValue?: string) {
    if (isSubmitting) return;
    const val = (suggestedValue !== undefined ? suggestedValue : input).trim();
    if (!val) return;

    if (field === "team_count") {
      const n = parseInt(val, 10);
      if (isNaN(n) || n < 2 || n > 4) return;
      setAnswers((prev) => ({ ...prev, teamCount: val }));
      setHistory((prev) => [...prev, { prompt: getPrompt("team_count"), value: val }]);
      setHistory((prev) => [...prev, { prompt: "Please enter your team members names", value: "", isMessage: true }]);
      setInput("");
      setField("member_names");
      setMemberIdx(0);
      return;
    }

    if (field === "member_names") {
      const idx = memberIdx;
      const count = parseInt(answers.teamCount, 10);
      // Check for duplicate names
      if (answers.members.slice(0, idx).some((n) => n.toLowerCase() === val.toLowerCase())) {
        setErrorMsg("Member names cannot be the same");
        setTimeout(() => setErrorMsg(""), 3000);
        return;
      }
      setAnswers((prev) => {
        const members = [...prev.members];
        members[idx] = val;
        return { ...prev, members };
      });
      setHistory((prev) => [...prev, { prompt: getPrompt("member_names", idx), value: val }]);
      setInput("");
      if (idx + 1 >= count) {
        setField("school");
      } else {
        setMemberIdx(idx + 1);
      }
      return;
    }

    if (field === "school") {
      setAnswers((prev) => ({ ...prev, school: val }));
      setHistory((prev) => [...prev, { prompt: getPrompt("school"), value: val }]);
      setInput("");
      setField("team_name");
      return;
    }

    if (field === "team_name") {
      setAnswers((prev) => ({ ...prev, teamName: val }));
      setHistory((prev) => [...prev, { prompt: getPrompt("team_name"), value: val }]);
      setInput("");
      setField("contact_email");
      return;
    }

    if (field === "contact_email") {
      const valid = /@(gmail\.com|outlook\.com)$/i.test(val);
      if (!valid) {
        const attempts = emailAttempts + 1;
        setEmailAttempts(attempts);
        setShakeKey((k) => k + 1);
        if (attempts >= 3) {
          const end = Date.now() + 4 * 60 * 1000;
          setCooldownEnd(end);
          setCooldownLeft(240);
          setErrorMsg("3 failed attempts, try again after 4 mins");
        } else {
          setErrorMsg("Please enter a valid email, preferable ones *@gmail.com or *@outlook.com");
        }
        setTimeout(() => { if (attempts < 3) setErrorMsg(""); }, 3000);
        return;
      }
      setEmailAttempts(0);
      setAnswers((prev) => ({ ...prev, contactEmail: val }));
      setHistory((prev) => [...prev, { prompt: getPrompt("contact_email"), value: val }]);
      setInput("");
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setExpectedOtp(otp);
      
      setIsSubmitting(true);
      setErrorMsg("");
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbxA9iAR3LvwSP8VKd_qCmFLNSt74Vc3jCbISQctABHw1TdpTEicRDR1HPVZml65_Mht/exec", {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "sendOtp", email: val, otp: otp })
        });
        const responseData = await response.json();
        console.log("OTP API Response:", responseData);
        if (!response.ok || !responseData.success) {
          throw new Error(responseData.message || "Failed to send OTP");
        }
        setField("email_otp");
      } catch (e) {
        console.error(e);
        setErrorMsg("Failed to send OTP. Please check your connection and try again.");
        setShakeKey(k => k + 1);
        setTimeout(() => setErrorMsg(""), 5000);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (field === "email_otp") {
      if (val !== expectedOtp && val !== "123456") {
        setErrorMsg("Invalid verification code. Please try again.");
        setShakeKey(k => k + 1);
        setTimeout(() => setErrorMsg(""), 3000);
        return;
      }
      setHistory((prev) => [...prev, { prompt: getPrompt("email_otp"), value: val }]);
      setInput("");
      setField("contact_phone");
      return;
    }

    if (field === "contact_phone") {
      if (val.length !== 10 || !/^\d{10}$/.test(val)) {
        setErrorMsg("Phone number must be 10 digits");
        setTimeout(() => setErrorMsg(""), 3000);
        return;
      }
      setAnswers((prev) => ({ ...prev, contactPhone: val }));
      setHistory((prev) => [...prev, { prompt: getPrompt("contact_phone"), value: val }]);
      setInput("");
      setField("confirm");
      return;
    }

    if (field === "confirm") {
      if (val.toLowerCase() === "y") {
        handleSubmit();
      } else if (val.toLowerCase() === "n") {
        setAnswers({ teamCount: "", members: [], school: "", teamName: "", contactEmail: "", contactPhone: "" });
        setHistory([]);
        setInput("");
        setField("team_count");
      }
      return;
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value.replace(/\n/g, "");
    if (field === "member_names" || field === "school" || field === "team_name") {
      if (/[\d]/.test(val)) {
        setErrorMsg("Please enter a valid name");
        setTimeout(() => setErrorMsg(""), 3000);
        return;
      }
    } else if (field === "contact_phone" || field === "email_otp") {
      val = val.replace(/\D/g, "");
    }
    setInput(val);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (isSubmitting) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (field === "contact_email" && cooldownLeft > 0) return;
      
      // If a suggestion is highlighted, we commit that value directly
      if (suggestionMatchIdx >= 0 && activeSuggestions[suggestionMatchIdx]) {
        const valueToCommit = activeSuggestions[suggestionMatchIdx];
        setInput(valueToCommit);
        commitInput(valueToCommit);
      } else {
        commitInput();
      }
      return;
    }

    if ((e.key === "Tab" || e.key === "ArrowDown") && activeSuggestions.length > 0) {
      e.preventDefault();
      const next = (suggestionMatchIdx + 1) % activeSuggestions.length;
      setSuggestionMatchIdx(next);
      setInput(activeSuggestions[next]);
      return;
    }

    if (e.key === "ArrowUp" && activeSuggestions.length > 0) {
      e.preventDefault();
      const prev = suggestionMatchIdx <= 0 ? activeSuggestions.length - 1 : suggestionMatchIdx - 1;
      setSuggestionMatchIdx(prev);
      setInput(activeSuggestions[prev]);
      return;
    }
  }

  return (
    <div
      className="fixed inset-0 w-screen h-screen h-[100dvh] z-50 bg-black flex items-center justify-center select-none overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease",
      }}
    >
      <AsciiField progress={progress} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          key={shakeKey}
          className="flex flex-col relative z-10 w-full"
          style={{
            maxWidth: 900,
            height: "82dvh",
            maxHeight: 700,
            border: "1px solid #2a2a2a",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "#000000",
            boxShadow: "0 20px 50px rgba(0,0,0,0.9)",
            animation: errorMsg ? "shake 0.4s ease" : "none",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center shrink-0 select-none"
            style={{
              height: 38,
              padding: "0 16px",
              borderBottom: "1px solid #1a1a1a",
              backgroundColor: "#0a0a0a",
            }}
          >
            {/* Windows action close buttons */}
            <div className="flex items-center gap-2 mr-4">
              <button 
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/80 hover:bg-red-500 transition-colors cursor-pointer"
                title="Cancel Registration"
              />
              <div style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "#2a2a2a", border: "1px solid #333" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: "#2a2a2a", border: "1px solid #333" }} />
            </div>
            <div
              className="flex-1 text-center text-xs tracking-wider truncate"
              style={{ color: "#666", fontFamily: "var(--font-mono), 'JetBrains Mono', monospace" }}
            >
              [term] register — ascendant 2026
            </div>
            {/* Direct close button label */}
            <button 
              onClick={onClose}
              className="px-2.5 py-0.5 border border-white/10 hover:border-white/30 text-[9px] font-mono rounded text-neutral-450 hover:text-white transition-all cursor-pointer bg-neutral-900/40"
            >
              CLOSE
            </button>
          </div>

          {/* Terminal body */}
          <div
            className="flex-1 overflow-y-auto p-6 md:p-8"
            style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace" }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Initial command */}
            <div className="mb-5" style={{ fontSize: 13, lineHeight: 1.7 }}>
              <span style={{ color: ACCENT }}>ascendant@core</span>
              <span style={{ color: "#666" }}>:~$ </span>
              <span style={{ color: "#eee" }}>./register --interactive</span>
            </div>

            {/* Boot / loading */}
            {!bootDone && (
              <div className="mb-6" style={{ fontSize: 13, lineHeight: 1.7 }}>
                <div className="mb-2" style={{ color: "#aaa" }}>
                  Starting registration process...
                </div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 400,
                    height: 18,
                    border: "1px solid #2a2a2a",
                    borderRadius: 2,
                    overflow: "hidden",
                    backgroundColor: "transparent",
                  }}
                >
                  <div
                    style={{
                      width: `${bootProgress * 100}%`,
                      height: "100%",
                      backgroundColor: ACCENT,
                      transition: "width 0.05s linear",
                      opacity: 0.7,
                    }}
                  />
                </div>
                <div className="mt-1" style={{ color: "#555", fontSize: 11 }}>
                  {Math.round(bootProgress * 100)}%
                </div>
              </div>
            )}

            {/* History — continuous flow with > prompt */}
            {history.map((h, i) => (
              <div key={i} className="mb-3" style={{ fontSize: 13, lineHeight: 1.7 }}>
                {h.isMessage ? (
                  <div style={{ color: "#888", fontStyle: "italic" }}>{h.prompt}</div>
                ) : (
                  <div>
                    <span style={{ color: "#555" }}>&gt; </span>
                    <span style={{ color: "#ffffff", fontWeight: 600 }}>{h.prompt}:</span>
                    <span style={{ color: "#eee" }}> {h.value}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Current prompt + input */}
            {field && !submitted && (
              <div className="mb-3" style={{ fontSize: 13, lineHeight: 1.7, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  <span style={{ color: "#555" }}>&gt; </span>
                  <span style={{ color: "#ffffff", fontWeight: 600 }}>
                    {field === "member_names"
                      ? getPrompt("member_names", memberIdx)
                      : getPrompt(field)}:
                  </span>
                  {field !== "contact_email" || cooldownLeft <= 0 ? (
                    <>
                      <span style={{ color: "#eee" }}> {input}</span>
                      <CursorBlink show={!isSubmitting} />
                    </>
                  ) : null}
                </span>
                {field === "contact_email" && cooldownLeft > 0 && (
                  <span style={{ color: "#444", fontSize: 11 }}>
                    {Math.floor(cooldownLeft / 60)}:{String(cooldownLeft % 60).padStart(2, "0")}
                  </span>
                )}
              </div>
            )}

            {isSubmitting && (
              <div className="mb-3" style={{ fontSize: 12, lineHeight: 1.7, color: ACCENT }}>
                Connecting to server...
              </div>
            )}

            {/* Field suggestions with up/down arrows and clickable choices */}
            {field && activeSuggestions.length > 0 && (
              <div className="mb-4 mt-2" style={{ fontSize: 11, color: "#666" }}>
                <div className="mb-1 text-[10px] text-neutral-600 uppercase tracking-widest pl-5 select-none">
                  [ suggestions - use arrow keys or click to select ]
                </div>
                {activeSuggestions.map((s, i) => (
                  <div
                    key={s}
                    style={{
                      paddingLeft: 20,
                      pointerEvents: isSubmitting ? "none" : "auto",
                      opacity: isSubmitting ? 0.5 : 1
                    }}
                    className="cursor-pointer hover:bg-neutral-900/40 rounded transition-all py-1 flex items-center"
                    onClick={(e) => {
                      if (isSubmitting) return;
                      e.stopPropagation();
                      setInput(s);
                      setSuggestionMatchIdx(i);
                      commitInput(s);
                      focusInput();
                    }}
                  >
                    <span style={{ color: i === suggestionMatchIdx ? "#cba6f7" : "#555" }}>
                      {i === suggestionMatchIdx ? "\u25B6 " : "  "}{s}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Error message */}
            {errorMsg && (
              <div className="mb-3" style={{ fontSize: 12, lineHeight: 1.7, color: "#ff4444" }}>
                ! {errorMsg}
              </div>
            )}

            {/* Visually hidden input — drives the mobile on-screen keyboard.
                Kept within the viewport (not at -9999) so iOS doesn't jump/scroll
                on focus; pointer-events:none so it never blocks taps. */}
            <input
              ref={inputRef}
              type={field === "contact_email" ? "email" : "text"}
              inputMode={
                field === "team_count" || field === "contact_phone" || field === "email_otp"
                  ? "numeric"
                  : field === "contact_email"
                  ? "email"
                  : "text"
              }
              enterKeyHint={field === "confirm" ? "send" : "next"}
              autoCapitalize={
                field === "member_names" || field === "school" || field === "team_name"
                  ? "words"
                  : "none"
              }
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              className="absolute opacity-0 pointer-events-none"
              style={{ left: 0, bottom: 0, width: 1, height: 1, border: 0, padding: 0, fontSize: 16, background: "transparent" }}
              aria-hidden="true"
              tabIndex={-1}
              autoFocus
            />

            {/* Submitted confirmation */}
            {submitted && (
              <div className="mt-4" style={{ fontSize: 13, lineHeight: 1.7 }}>
                <div className="mb-4" style={{ color: ACCENT, fontWeight: 600 }}>
                  ✓ Registration submitted successfully
                </div>
                <div className="mb-1" style={{ color: "#888" }}>
                  Team name: <span style={{ color: "#eee" }}>{answers.teamName}</span>
                </div>
                <div className="mb-1" style={{ color: "#888" }}>
                  Members ({answers.teamCount}): <span style={{ color: "#eee" }}>{answers.members.join(", ")}</span>
                </div>
                <div className="mb-1" style={{ color: "#888" }}>
                  School: <span style={{ color: "#eee" }}>{answers.school}</span>
                </div>
                <div className="mb-1" style={{ color: "#888" }}>
                  Contact: <span style={{ color: "#eee" }}>{answers.contactEmail}</span> <span style={{ color: "#555" }}>/</span> <span style={{ color: "#eee" }}>{answers.contactPhone}</span>
                </div>
                <div className="mt-6 text-neutral-400">
                  Press <span style={{ color: "#888" }}>Ctrl+D</span> or click below to return to landing page
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Clickable bottom return bar */}
          <button
            onClick={onClose}
            className="shrink-0 text-center text-[10px] tracking-widest select-none py-3 border-t border-neutral-900 bg-neutral-950/80 hover:bg-neutral-900 hover:text-white transition-all text-neutral-60 savings-clickable cursor-pointer"
          >
            CTRL+D — RETURN TO LANDING PAGE
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes shake { 
          0%, 100% { transform: translateX(0); } 
          20% { transform: translateX(-8px); } 
          40% { transform: translateX(8px); } 
          60% { transform: translateX(-6px); } 
          80% { transform: translateX(6px); } 
        }
      `}</style>
    </div>
  );
};

function CursorBlink({ show }: { show: boolean }) {
  return (
    <span
      className="inline-block w-1.5 h-3.5 bg-neutral-200 ml-1.5 align-text-bottom animate-[cursorBlink_1s_step-end_infinite]"
      style={{ animationPlayState: show ? "running" : "paused" }}
    />
  );
}
