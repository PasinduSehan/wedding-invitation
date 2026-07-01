import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc, writeBatch, getDoc } from "firebase/firestore";
import { Invitation, Guest } from "../types";
import { Check, Mail, Phone, Users, Search, AlertCircle, Sparkles, Edit2, Loader2, Download, Printer } from "lucide-react";
import confetti from "canvas-confetti";
import { gsap } from "gsap";
import { jsPDF } from "jspdf";

interface RsvpSectionProps {
  tokenFromUrl?: string | null;
}

const RSVP_CLOSING_DATE = "2026-08-15";

export default function RsvpSection({ tokenFromUrl }: RsvpSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [existingGuests, setExistingGuests] = useState<Guest[]>([]);
  
  // Lookup states (for when no token is present)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);

  // Secure PIN Passcode Lock States
  const [pendingUnlockInvitation, setPendingUnlockInvitation] = useState<Invitation | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Form states
  const [attendance, setAttendance] = useState<"Coming" | "Not Coming" | null>(null);
  const [selectedGuestCount, setSelectedGuestCount] = useState<number>(1);
  const [guestNames, setGuestNames] = useState<string[]>([""]);
  const [guestDiets, setGuestDiets] = useState<string[]>(["None"]);
  const [guestDietaryRequirements, setGuestDietaryRequirements] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load invitation based on URL token
  useEffect(() => {
    if (tokenFromUrl) {
      loadInvitationByToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  // Luxury GSAP enter animation for the RSVP form fields and submit button
  useEffect(() => {
    if (invitation) {
      const timer = setTimeout(() => {
        const elements = document.querySelectorAll(".rsvp-animate-field");
        if (elements.length > 0) {
          gsap.killTweensOf(elements);
          // Set initial state before running animation
          gsap.set(elements, { opacity: 0, y: 20 });
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [invitation, attendance, isEditing, success, selectedGuestCount]);

  // Premium subtle 'reveal' animation specifically for guest details list
  useEffect(() => {
    if (attendance === "Coming") {
      const timer = setTimeout(() => {
        const rows = document.querySelectorAll(".guest-item-row");
        if (rows.length > 0) {
          gsap.fromTo(
            rows,
            { opacity: 0, x: -10, y: 5 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              overwrite: "auto"
            }
          );
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedGuestCount, attendance]);

  const [downloadingImage, setDownloadingImage] = useState(false);

  const handlePrintInvitation = () => {
    document.body.classList.add("print-invitation-active");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("print-invitation-active");
    }, 1000);
  };

  const handleDownloadInvitation = () => {
    if (!invitation) return;
    setDownloadingImage(true);

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${window.location.origin}/invite/${invitation.token}`)}`;
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = qrUrl;

    const generatePDF = (imgElement: HTMLImageElement | null) => {
      try {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: [5.5, 8.5]
        });

        // 1. Draw luxurious cream background
        doc.setFillColor(250, 250, 249); // #fafaf9 (stone-50)
        doc.rect(0, 0, 5.5, 8.5, "F");

        // 2. Draw gold double borders
        // Thick gold border
        doc.setDrawColor(217, 119, 6); // #d97706 (amber-600)
        doc.setLineWidth(0.06);
        doc.rect(0.15, 0.15, 5.2, 8.2, "S");

        // Light gold border
        doc.setDrawColor(254, 243, 199); // #fef3c7 (amber-100)
        doc.setLineWidth(0.015);
        doc.rect(0.25, 0.25, 5.0, 8.0, "S");

        // Thin inner gold line
        doc.setDrawColor(252, 211, 77); // #fcd34d (amber-300)
        doc.setLineWidth(0.005);
        doc.rect(0.35, 0.35, 4.8, 7.8, "S");

        // 3. S & K Header
        doc.setFont("times", "bold");
        doc.setFontSize(18);
        doc.setTextColor(180, 83, 9); // #b45309 (amber-700)
        doc.text("S   &   K", 2.75, 1.1, { align: "center" });

        // 4. Cordial invitation line
        doc.setFont("times", "italic");
        doc.setFontSize(10);
        doc.setTextColor(120, 113, 108); // #78716c (stone-500)
        doc.text("YOU ARE CORDIALLY INVITED TO CELEBRATE THE MARRIAGE OF", 2.75, 1.7, { align: "center" });

        // 5. Sandeepani & Kawsara
        doc.setFont("times", "normal");
        doc.setFontSize(36);
        doc.setTextColor(28, 25, 23); // #1c1917 (stone-900)
        doc.text("Sandeepani", 2.75, 2.4, { align: "center" });

        doc.setFont("times", "italic");
        doc.setFontSize(24);
        doc.setTextColor(180, 83, 9); // #b45309
        doc.text("&", 2.75, 2.85, { align: "center" });

        doc.setFont("times", "normal");
        doc.setFontSize(36);
        doc.setTextColor(28, 25, 23);
        doc.text("Kawsara", 2.75, 3.4, { align: "center" });

        // 6. Divider ornament
        doc.setDrawColor(252, 211, 77);
        doc.setLineWidth(0.01);
        doc.line(2.0, 3.9, 2.5, 3.9);
        doc.line(3.0, 3.9, 3.5, 3.9);

        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(217, 119, 6);
        doc.text("❖", 2.75, 3.94, { align: "center" });

        // 7. Prepared For
        doc.setFont("times", "italic");
        doc.setFontSize(10);
        doc.setTextColor(120, 113, 108);
        doc.text("SPECIALLY PREPARED FOR", 2.75, 4.3, { align: "center" });

        // Bold family name
        doc.setFont("times", "bold");
        doc.setFontSize(22);
        doc.setTextColor(154, 52, 18); // #9a3412
        doc.text(invitation.familyName, 2.75, 4.7, { align: "center" });

        // 8. Wedding Details (Friday, August 14, 2026)
        // Date Pill Background
        doc.setFillColor(254, 243, 199); // #fef3c7
        doc.rect(1.5, 5.1, 2.5, 0.3, "F");
        doc.setDrawColor(252, 211, 77);
        doc.setLineWidth(0.005);
        doc.rect(1.5, 5.1, 2.5, 0.3, "S");

        // Date Pill Text
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(28, 25, 23);
        doc.text("FRIDAY, AUGUST 14, 2026", 2.75, 5.3, { align: "center" });

        // Time and Venue
        doc.setFont("times", "italic");
        doc.setFontSize(12);
        doc.setTextColor(68, 64, 60); // #44403c
        doc.text("at Ten O'Clock in the Morning", 2.75, 5.7, { align: "center" });

        doc.setFont("times", "bold");
        doc.setFontSize(13);
        doc.setTextColor(154, 52, 18);
        doc.text("Araliya Palace, Grand Ballroom", 2.75, 6.0, { align: "center" });

        // 9. Draw QR Code if loaded
        if (imgElement) {
          doc.setFillColor(255, 255, 255);
          doc.rect(2.25, 6.4, 1.0, 1.0, "F");
          doc.setDrawColor(231, 229, 228);
          doc.setLineWidth(0.01);
          doc.rect(2.25, 6.4, 1.0, 1.0, "S");
          
          doc.addImage(imgElement, "PNG", 2.3, 6.45, 0.9, 0.9);
        }

        // Label under QR
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(168, 162, 158); // #a8a29e
        doc.text("SCAN TO VIEW CELEBRATION DETAILS", 2.75, 7.6, { align: "center" });

        // Save PDF
        const pdfName = `Sandeepani_Kawsara_Wedding_Invitation_${invitation.familyName.replace(/\s+/g, '_')}.pdf`;
        doc.save(pdfName);
      } catch (err) {
        console.error("PDF generation failed:", err);
      } finally {
        setDownloadingImage(false);
      }
    };

    qrImg.onload = () => {
      generatePDF(qrImg);
    };

    qrImg.onerror = () => {
      console.warn("QR code failed to load. Generating PDF without QR code...");
      generatePDF(null);
    };
  };

  const loadInvitationByToken = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      let snap;
      try {
        const q = query(collection(db, "invitations"), where("token", "==", token));
        snap = await getDocs(q);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.LIST, "invitations");
        return;
      }
      
      if (snap.empty) {
        setError("Invitation not found. Please verify the URL or search for your invitation below.");
        setInvitation(null);
        setLoading(false);
        return;
      }

      const invDoc = snap.docs[0];
      const invData = { id: invDoc.id, ...invDoc.data() } as Invitation;
      setInvitation(invData);
      
      // Populate form from existing data if already submitted
      if (invData.status !== "Pending") {
        setAttendance(invData.status);
        setSelectedGuestCount(invData.guestCount || 1);
        setNotes(invData.notes || "");
        
        // Load associated guests
        let guestsSnap;
        try {
          const guestsQ = query(collection(db, "guests"), where("invitationId", "==", invDoc.id));
          guestsSnap = await getDocs(guestsQ);
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.LIST, "guests");
          return;
        }
        const guestsList: Guest[] = [];
        guestsSnap.forEach((d) => {
          guestsList.push({ id: d.id, ...d.data() } as Guest);
        });
        setExistingGuests(guestsList);
        
        if (guestsList.length > 0) {
          setGuestNames(guestsList.map(g => g.guestName));
          setGuestDiets(guestsList.map(g => g.dietaryPreference || "None"));
          setGuestDietaryRequirements(guestsList.map(g => g.dietaryRequirements || ""));
        } else {
          // Fallback if no guest records
          setGuestNames(Array(invData.guestCount || 1).fill(""));
          setGuestDiets(Array(invData.guestCount || 1).fill("None"));
          setGuestDietaryRequirements(Array(invData.guestCount || 1).fill(""));
        }
      } else {
        // Initial clean state
        setAttendance(null);
        setSelectedGuestCount(1);
        setGuestNames([""]);
        setGuestDiets(["None"]);
        setGuestDietaryRequirements([""]);
        setNotes("");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch invitation details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Search by family name, email, or phone (robust, case-insensitive, partial matching)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryTerm = searchQuery.trim().toLowerCase();
    if (!queryTerm) return;

    setLoading(true);
    setSearchError(null);
    try {
      const invitationsCol = collection(db, "invitations");
      let allSnap;
      try {
        allSnap = await getDocs(invitationsCol);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.LIST, "invitations");
        return;
      }

      if (allSnap.empty) {
        setSearchError("No invitations have been created yet by the administrator. Please try again later.");
        setLoading(false);
        return;
      }

      // Strip non-digit characters for phone comparison
      const cleanQueryPhone = queryTerm.replace(/\D/g, "");

      // Find best match in memory to bypass case-sensitivity or Firestore indexing limitations
      const matchedDoc = allSnap.docs.find(doc => {
        const data = doc.data();
        const famName = (data.familyName || "").toLowerCase();
        const emailVal = (data.email || "").toLowerCase();
        const phoneVal = (data.phone || "").replace(/\D/g, "");

        // Match if family name includes search term
        if (famName.includes(queryTerm)) return true;
        // Match if email includes search term
        if (emailVal.includes(queryTerm)) return true;
        // Match if phone contains clean query phone
        if (cleanQueryPhone && phoneVal.includes(cleanQueryPhone)) return true;

        return false;
      });

      if (matchedDoc) {
        const invData = { id: matchedDoc.id, ...matchedDoc.data() } as Invitation;
        if (invData.token) {
          if (invData.pin) {
            setPendingUnlockInvitation(invData);
            setPinInput("");
            setPinError(null);
            setSearchQuery("");
          } else {
            // Backwards compatibility fallback if no PIN exists
            loadInvitationByToken(invData.token);
            setSearchQuery("");
          }
        } else {
          setSearchError("Selected invitation is missing a secure token. Please contact the administrator.");
        }
        return;
      }

      setSearchError("No invitation found matching that name, email, or phone number. Please contact Erandi or Adeesha.");
    } catch (err) {
      console.error(err);
      setSearchError("An error occurred during lookup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify entered RSVP PIN passcode
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUnlockInvitation) return;

    if (pinInput.trim() === pendingUnlockInvitation.pin) {
      // Correct PIN -> load invitation
      loadInvitationByToken(pendingUnlockInvitation.token);
      setPendingUnlockInvitation(null);
      setPinInput("");
      setPinError(null);
    } else {
      setPinError("The RSVP passcode you entered is incorrect. Please verify and try again.");
    }
  };

  // Adjust guest name arrays when guest count dropdown changes
  const handleGuestCountChange = (count: number) => {
    setSelectedGuestCount(count);
    
    // Resize guestNames array
    const names = [...guestNames];
    if (count > names.length) {
      while (names.length < count) names.push("");
    } else {
      names.splice(count);
    }
    setGuestNames(names);

    // Resize diets array
    const diets = [...guestDiets];
    if (count > diets.length) {
      while (diets.length < count) diets.push("None");
    } else {
      diets.splice(count);
    }
    setGuestDiets(diets);

    // Resize dietaryRequirements array
    const reqs = [...guestDietaryRequirements];
    if (count > reqs.length) {
      while (reqs.length < count) reqs.push("");
    } else {
      reqs.splice(count);
    }
    setGuestDietaryRequirements(reqs);
  };

  const handleNameInput = (idx: number, val: string) => {
    const names = [...guestNames];
    names[idx] = val;
    setGuestNames(names);
  };

  const handleDietInput = (idx: number, val: string) => {
    const diets = [...guestDiets];
    diets[idx] = val;
    setGuestDiets(diets);
  };

  const handleDietaryRequirementsInput = (idx: number, val: string) => {
    const reqs = [...guestDietaryRequirements];
    reqs[idx] = val;
    setGuestDietaryRequirements(reqs);
  };

  const isClosingDatePassed = () => {
    const close = new Date(RSVP_CLOSING_DATE);
    const today = new Date();
    return today > close;
  };

  // RSVP Submission Handler
  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation || !invitation.id) return;

    if (isClosingDatePassed()) {
      alert(`We apologize, but RSVPs closed on ${RSVP_CLOSING_DATE}. Please contact us directly.`);
      return;
    }

    if (attendance === "Coming") {
      // Validate guest names
      const emptyNameIdx = guestNames.findIndex(n => !n.trim());
      if (emptyNameIdx !== -1) {
        alert(`Please provide a name for Guest ${emptyNameIdx + 1}`);
        return;
      }
    }

    setLoading(true);
    try {
      const batch = writeBatch(db);

      // 1. Update Invitation Document
      const invitationRef = doc(db, "invitations", invitation.id);
      const isComing = attendance === "Coming";
      const count = isComing ? selectedGuestCount : 0;

      batch.update(invitationRef, {
        status: attendance,
        guestCount: count,
        notes: notes.trim(),
        submittedAt: new Date().toISOString(),
      });

      // 2. Manage Guests Collection (delete previous and add new to avoid duplicates)
      const prevGuestsQ = query(collection(db, "guests"), where("invitationId", "==", invitation.id));
      let prevGuestsSnap;
      try {
        prevGuestsSnap = await getDocs(prevGuestsQ);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.LIST, "guests");
        return;
      }
      prevGuestsSnap.forEach((d) => {
        batch.delete(d.ref);
      });

      if (isComing) {
        guestNames.forEach((name, i) => {
          const guestRef = doc(collection(db, "guests"));
          batch.set(guestRef, {
            invitationId: invitation!.id,
            guestName: name.trim(),
            dietaryPreference: guestDiets[i],
            dietaryRequirements: guestDietaryRequirements[i] || "",
          });
        });
      }

      try {
        await batch.commit();
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.WRITE, `batch_rsvp_${invitation.id}`);
        return;
      }

      // Trigger Celebration Confetti on acceptance
      if (isComing) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#d4af37", "#f3e5ab", "#c5a059", "#ffffff"]
        });
      }

      setSuccess(true);
      setIsEditing(false);
      // Reload updated details
      loadInvitationByToken(invitation.token);

      // Auto-download PDF invitation on successful accept submission
      if (isComing) {
        setTimeout(() => {
          handleDownloadInvitation();
        }, 800);
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="rsvp-section"
      className="py-24 bg-stone-100 relative overflow-hidden"
    >
      {/* Decorative luxury corners */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-15 pointer-events-none border-t-2 border-l-2 border-amber-600 m-6"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-15 pointer-events-none border-b-2 border-r-2 border-amber-600 m-6"></div>

      <div className="max-w-3xl mx-auto px-6 relative z-20">
        
        {/* Title */}
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-700/80 mb-3">
            R.S.V.P.
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-stone-900 tracking-wide mb-3">
            Response Card
          </h2>
          <p className="font-serif italic text-sm text-stone-500">
            Please respond by August 15, 2026
          </p>
          <div className="w-12 h-[1px] bg-amber-400 mx-auto mt-4"></div>
        </div>

        {/* Outer RSVP Glassmorphism Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-amber-200/50 p-6 md:p-12 shadow-2xl">
          
          {/* SEARCH VIEW (If no invitation loaded) */}
          {!invitation && !loading && !pendingUnlockInvitation && (
            <div className="text-center">
              <Users size={32} className="text-amber-600 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-normal text-stone-800 mb-2">
                Find Your Invitation
              </h3>
              <p className="font-serif text-stone-500 text-sm max-w-md mx-auto mb-8">
                Enter your Family Name or the email address listed on your invitation card to load your personal response page.
              </p>

              <form onSubmit={handleSearch} className="max-w-md mx-auto flex flex-col gap-4">
                <div className="relative">
                  <input
                    id="family-search-input"
                    type="text"
                    required
                    placeholder="e.g. Amal Family or guest@email.com"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-stone-50 font-serif text-stone-800 text-sm outline-none"
                  />
                  <Search size={18} className="absolute left-4 top-3.5 text-stone-400" />
                </div>

                <button
                  id="family-search-btn"
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 font-mono text-xs font-bold uppercase tracking-[0.15em] py-4 rounded-xl shadow-[0_4px_20px_rgba(217,119,6,0.15)] hover:shadow-[0_10px_25px_rgba(217,119,6,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Search Invitation</span>
                </button>
              </form>

              {searchError && (
                <div className="mt-4 flex items-center justify-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs py-3 px-4 rounded-xl max-w-md mx-auto">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}
            </div>
          )}

          {/* SECURE PIN ACCESS VIEW */}
          {!invitation && !loading && pendingUnlockInvitation && (
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 animate-pulse">
                <Users size={20} className="text-amber-700" />
              </div>
              <h3 className="font-serif text-xl font-normal text-stone-800 mb-2">
                Passcode Required
              </h3>
              <p className="font-serif text-stone-500 text-sm max-w-md mx-auto mb-2">
                An invitation was found for:
              </p>
              <p className="font-serif text-amber-700 text-lg font-bold max-w-md mx-auto mb-6">
                {pendingUnlockInvitation.familyName}
              </p>
              <p className="font-sans text-stone-500 text-xs max-w-sm mx-auto mb-8 leading-relaxed">
                Please enter the 4-digit RSVP passcode printed on your physical card to view and modify your invitation details.
              </p>

              <form onSubmit={handleVerifyPin} className="max-w-xs mx-auto flex flex-col gap-4">
                <div>
                  <input
                    id="rsvp-pin-input"
                    type="text"
                    required
                    maxLength={4}
                    pattern="[0-9]{4}"
                    placeholder="••••"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-32 mx-auto text-center tracking-[0.5em] text-2xl font-bold font-mono py-3 border border-stone-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-stone-50 text-stone-800 outline-none"
                    autoFocus
                  />
                </div>

                {pinError && (
                  <div className="flex items-center justify-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs py-2 px-3 rounded-lg">
                    <AlertCircle size={13} className="shrink-0" />
                    <span className="text-left font-sans">{pinError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    id="cancel-pin-btn"
                    type="button"
                    onClick={() => {
                      setPendingUnlockInvitation(null);
                      setPinInput("");
                      setPinError(null);
                    }}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer border border-stone-200"
                  >
                    Back
                  </button>
                  <button
                    id="submit-pin-btn"
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-mono text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-serif italic text-stone-500 text-sm">Reviewing parchment registers...</p>
            </div>
          )}

          {/* DETAILED RSVP FORM */}
          {invitation && !loading && (
            <div>
              {/* Top Welcome Panel */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-100 pb-6 mb-8 gap-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700">
                    Personalized Invitation
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-stone-900 mt-1">
                    Welcome, {invitation.familyName}
                  </h3>
                </div>
                
                {/* Contact Pill */}
                <div className="text-left md:text-right font-mono text-[11px] text-stone-500 space-y-1">
                  {invitation.phone && <div className="flex items-center md:justify-end gap-1.5"><Phone size={12} className="text-amber-600" />{invitation.phone}</div>}
                  {invitation.email && <div className="flex items-center md:justify-end gap-1.5"><Mail size={12} className="text-amber-600" />{invitation.email}</div>}
                </div>
              </div>

              {/* Already Submitted or Just Submitted Summary Screen */}
              {invitation.status !== "Pending" && !isEditing ? (
                <div className="space-y-6">
                  {/* Success Banner */}
                  {success && (
                    <div 
                      id="rsvp-success-toast"
                      className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-center animate-[slideIn_0.4s_ease-out] relative"
                    >
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                        <Check size={18} className="text-emerald-600" />
                      </div>
                      <p className="font-serif text-lg text-amber-800 font-medium mb-1">
                        Response Submitted with Grace
                      </p>
                      <p className="font-serif text-stone-600 text-xs leading-relaxed max-w-md mx-auto">
                        {invitation.status === "Coming" 
                          ? "Your attendance has been engraved in our guest rolls. We look forward to clinking crystal glasses under the Florentine skies!"
                          : "Your heartfelt regrets have been received. Though we will miss you in Florence, we carry your warm wishes in our hearts."}
                      </p>
                      <button
                        id="success-dismiss-btn"
                        onClick={() => setSuccess(false)}
                        className="mt-3 font-mono text-[9px] text-amber-700 hover:text-stone-900 uppercase tracking-widest font-bold cursor-pointer transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Summary Details Card */}
                  <div className="bg-stone-50/60 rounded-2xl border border-stone-200/60 p-6 md:p-8 space-y-6 text-stone-800">
                    <div className="text-center pb-4 border-b border-stone-200/40">
                      <h4 className="font-serif text-xl font-normal text-stone-900">
                        RSVP Selection Confirmed
                      </h4>
                      <p className="text-xs font-serif text-stone-500 mt-1">
                        Submitted on {invitation.submittedAt ? new Date(invitation.submittedAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : "date unknown"}
                      </p>
                    </div>

                    {/* Attendance status badge */}
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className={`px-5 py-2.5 rounded-full border font-mono text-xs uppercase tracking-widest font-bold ${
                        invitation.status === "Coming"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-rose-50 border-rose-200 text-rose-800"
                      }`}>
                        {invitation.status === "Coming" ? "Attending (Joyfully Accepts)" : "Declined (Regretfully Declines)"}
                      </div>
                    </div>

                    {/* Guests Details (if coming) */}
                    {invitation.status === "Coming" && existingGuests.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-serif text-sm font-semibold text-stone-800 border-b border-stone-200/40 pb-1">
                          Attending Guests ({existingGuests.length})
                        </h5>
                        <div className="space-y-2">
                          {existingGuests.map((guest, idx) => (
                            <div key={guest.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm py-1.5 border-b border-stone-100 last:border-0">
                              <div className="font-serif text-stone-900 font-medium">
                                {idx + 1}. {guest.guestName}
                              </div>
                              <div className="flex items-center gap-2 mt-1 sm:mt-0">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                  guest.dietaryPreference && guest.dietaryPreference !== "None"
                                    ? "bg-amber-100 text-amber-800 font-medium"
                                    : "bg-stone-100 text-stone-500"
                                }`}>
                                  Diet: {guest.dietaryPreference || "No Restrictions"}
                                </span>
                                {guest.dietaryRequirements && (
                                  <span className="text-[10px] font-sans italic text-stone-500 max-w-xs truncate" title={guest.dietaryRequirements}>
                                    ({guest.dietaryRequirements})
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warm Wishes / Notes */}
                    {invitation.notes && (
                      <div className="space-y-2">
                        <h5 className="font-serif text-sm font-semibold text-stone-800 border-b border-stone-200/40 pb-1">
                          Warm Wishes & Notes
                        </h5>
                        <div className="bg-white/60 p-4 rounded-xl border border-stone-200/40 font-serif italic text-sm text-stone-600 leading-relaxed relative">
                          <span className="text-amber-300 font-serif text-3xl absolute top-1 left-2 pointer-events-none">“</span>
                          <p className="pl-5 relative z-10">{invitation.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Actions Panel */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-stone-200/40">
                      {invitation.status === "Coming" && (
                        <button
                          id="print-rsvp-invitation-btn"
                          disabled={downloadingImage}
                          onClick={handleDownloadInvitation}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-600 text-stone-950 hover:bg-amber-700 rounded-xl font-mono text-[11px] uppercase tracking-widest font-bold transition-all hover:scale-[1.02] shadow-md cursor-pointer disabled:opacity-50"
                        >
                          {downloadingImage ? (
                            <Loader2 size={12} className="animate-spin text-stone-950" />
                          ) : (
                            <Printer size={12} />
                          )}
                          <span>{downloadingImage ? "Downloading..." : "Download Invitation"}</span>
                        </button>
                      )}
                      <button
                        id="edit-rsvp-btn"
                        onClick={() => {
                          setSuccess(false);
                          setIsEditing(true);
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-stone-950 text-stone-100 rounded-xl font-mono text-[11px] uppercase tracking-widest hover:bg-amber-600 hover:text-stone-950 transition-colors shadow-sm cursor-pointer"
                      >
                        <Edit2 size={12} />
                        <span>Edit Response</span>
                      </button>
                      <button
                        id="clear-invitation-btn"
                        onClick={() => {
                          setSuccess(false);
                          setInvitation(null);
                        }}
                        className="w-full sm:w-auto px-6 py-2.5 bg-stone-200 text-stone-700 rounded-xl font-mono text-[11px] uppercase tracking-widest hover:bg-stone-300 transition-colors cursor-pointer"
                      >
                        Search Another Name
                      </button>
                    </div>

                    <p className="text-[10px] text-stone-400 font-mono text-center mt-2">
                      Responses can be modified until closing on {RSVP_CLOSING_DATE}.
                    </p>
                  </div>
                </div>
              ) : (
                /* ACTUAL ENTRY FORM */
                <form onSubmit={handleSubmitRsvp} className="space-y-8">
                  
                  {/* Attendance Selector Cards */}
                  <div className="rsvp-animate-field">
                    <label className="block font-serif text-sm font-medium text-stone-800 mb-4 text-center">
                      Will you honor us with your presence?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Option 1: Coming */}
                      <button
                        id="rsvp-coming-card"
                        type="button"
                        disabled={loading}
                        onClick={() => setAttendance("Coming")}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                          attendance === "Coming"
                            ? "border-amber-600 bg-amber-50/40 shadow-md"
                            : "border-stone-200 bg-stone-50 hover:border-amber-300"
                        }`}
                      >
                        <span className="font-serif text-lg font-light text-stone-900 mb-1">
                          Joyfully Accepts
                        </span>
                        <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
                          I will attend
                        </span>
                      </button>

                      {/* Option 2: Decline */}
                      <button
                        id="rsvp-decline-card"
                        type="button"
                        disabled={loading}
                        onClick={() => setAttendance("Not Coming")}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                          attendance === "Not Coming"
                            ? "border-amber-600 bg-amber-50/40 shadow-md"
                            : "border-stone-200 bg-stone-50 hover:border-amber-300"
                        }`}
                      >
                        <span className="font-serif text-lg font-light text-stone-900 mb-1">
                          Regretfully Declines
                        </span>
                        <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
                          I cannot attend
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* IF ATTENDING VIEW */}
                  {attendance === "Coming" && (
                    <div className="space-y-6 bg-stone-50 border border-amber-100/60 rounded-2xl p-6 md:p-8 animate-[fadeIn_0.5s_ease-out]">
                      
                      {/* Guest Count Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/50 pb-5 rsvp-animate-field">
                        <div>
                          <h4 className="font-serif text-base text-stone-800">
                            Number of Attending Guests
                          </h4>
                          <p className="font-serif text-xs text-stone-500">
                            Maximum allowed for your family: <strong>{invitation.maxGuests} guests</strong>
                          </p>
                        </div>

                        {/* Dropdown enforcing maxGuests limit */}
                        <div className="relative">
                          <select
                            id="guest-count-dropdown"
                            value={selectedGuestCount}
                            disabled={loading}
                            onChange={(e) => handleGuestCountChange(parseInt(e.target.value))}
                            className="bg-white border border-stone-200 rounded-lg px-4 py-2 font-mono text-xs font-semibold outline-none focus:border-amber-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {Array.from({ length: invitation.maxGuests }, (_, i) => i + 1).map((val) => (
                              <option key={val} value={val}>
                                {val} Guest{val > 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Guest Names Inputs */}
                      <div className="space-y-6">
                        <h4 className="font-serif text-sm font-medium text-stone-800">
                          Guest Details
                        </h4>

                        {Array.from({ length: selectedGuestCount }).map((_, idx) => (
                          <div 
                            key={idx} 
                            className="guest-item-row border-b border-stone-200/50 pb-5 last:border-none last:pb-0 space-y-3 rsvp-animate-field"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] bg-stone-200/60 px-2 py-0.5 rounded text-stone-500 uppercase tracking-wider">
                                Guest #{idx + 1}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                              {/* Full Name */}
                              <div className="md:col-span-7">
                                <input
                                  id={`guest-name-input-${idx}`}
                                  type="text"
                                  placeholder={`Full Name of Guest ${idx + 1}`}
                                  required
                                  value={guestNames[idx] || ""}
                                  disabled={loading}
                                  onChange={(e) => handleNameInput(idx, e.target.value)}
                                  className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-800 text-sm font-serif outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:bg-stone-50 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                              </div>

                              {/* Dietary Dropdown */}
                              <div className="md:col-span-5">
                                <select
                                  id={`guest-diet-dropdown-${idx}`}
                                  value={guestDiets[idx] || "None"}
                                  disabled={loading}
                                  onChange={(e) => handleDietInput(idx, e.target.value)}
                                  className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-600 text-xs font-serif outline-none focus:border-amber-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                  <option value="None">No Dietary Restrictions</option>
                                  <option value="Vegetarian">Vegetarian</option>
                                  <option value="Vegan">Vegan</option>
                                  <option value="Gluten-Free">Gluten-Free</option>
                                  <option value="Halal">Halal</option>
                                  <option value="Nut-Allergy">Nut Allergy</option>
                                </select>
                              </div>
                            </div>

                            {/* Dietary Requirements / Allergy Details Text Input */}
                            <div className="pl-0 md:pl-1">
                              <input
                                id={`guest-dietary-requirements-${idx}`}
                                type="text"
                                placeholder="Specific allergies or food preferences (e.g. peanut allergy, lactose intolerant, etc.)"
                                value={guestDietaryRequirements[idx] || ""}
                                disabled={loading}
                                onChange={(e) => handleDietaryRequirementsInput(idx, e.target.value)}
                                className="w-full bg-stone-100/40 border border-stone-200 rounded-lg px-3 py-1.5 text-stone-700 text-xs font-serif outline-none focus:bg-white focus:border-amber-500 disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-stone-400"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* General message notes box */}
                  {attendance && (
                    <div className="animate-[fadeIn_0.5s_ease-out] rsvp-animate-field">
                      <label htmlFor="rsvp-notes" className="block font-serif text-xs font-medium text-stone-700 mb-2">
                        Special Notes or Warm Wishes for Sandeepani & Kawsara (Optional)
                      </label>
                      <textarea
                        id="rsvp-notes"
                        rows={3}
                        placeholder="Write your wishes or leave any other special coordination requests here..."
                        value={notes}
                        disabled={loading}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl p-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-serif text-stone-800 text-sm outline-none bg-stone-50 disabled:bg-stone-50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  {attendance && (
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-stone-100 pt-6 rsvp-animate-field">
                      {isEditing && (
                        <button
                          id="rsvp-cancel-edit-btn"
                          type="button"
                          disabled={loading}
                          onClick={() => {
                            setIsEditing(false);
                            // Reload original values
                            loadInvitationByToken(invitation.token);
                          }}
                          className="w-full sm:w-auto px-6 py-3 border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      )}
                      
                      <button
                        id="rsvp-submit-btn"
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 hover:from-amber-600 hover:to-amber-700 font-mono text-xs font-bold uppercase tracking-[0.15em] rounded-xl shadow-[0_4px_20px_rgba(217,119,6,0.15)] hover:shadow-[0_10px_25px_rgba(217,119,6,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:from-stone-700 disabled:to-stone-800 disabled:text-stone-400 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <Loader2 size={14} className="animate-spin text-stone-950" />
                        ) : (
                          <Sparkles size={14} className="animate-pulse text-stone-950" />
                        )}
                        <span>{loading ? "Processing..." : isEditing ? "Update RSVP Record" : "Submit Response"}</span>
                      </button>
                    </div>
                  )}

                </form>
              )}

            </div>
          )}

          {/* Invitation Lookup help note */}
          {!invitation && (
            <div className="mt-8 border-t border-stone-100 pt-6 flex justify-between items-center text-[10px] md:text-xs text-stone-400 font-serif">
              <span>Invitation RSVP deadline: August 14, 2026</span>
              <span className="italic">Questions? Contact contact@sandeepani&kawsara.wedding</span>
            </div>
          )}

        </div>
      </div>

      {/* CSS print style injection block */}
      <style>{`
        #print-invitation-area {
          display: none !important;
        }
        @media print {
          body.print-invitation-active {
            background-color: #ffffff !important;
            background-image: none !important;
            color: #1c1917 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
          }
          body.print-invitation-active * {
            visibility: hidden !important;
          }
          body.print-invitation-active #print-invitation-area,
          body.print-invitation-active #print-invitation-area * {
            visibility: visible !important;
          }
          body.print-invitation-active #print-invitation-area {
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            margin: 0 auto !important;
            width: 5.5in !important;
            height: 8.5in !important;
            box-sizing: border-box !important;
            padding: 0.5in !important;
            border: 3px double #d97706 !important;
            background-color: #ffffff !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: space-between !important;
            text-align: center !important;
          }
        }
      `}</style>

      {/* Hidden printable wedding invitation style container */}
      {invitation && (
        <div 
          id="print-invitation-area" 
          className="bg-white text-stone-900 border-[6px] border-double border-amber-600 text-center font-serif relative"
          style={{ width: "5.5in", height: "8.5in" }}
        >
          {/* Fine border inside */}
          <div className="absolute inset-4 border border-amber-200 pointer-events-none"></div>

          {/* Elegant top ornament */}
          <div className="my-auto flex flex-col items-center justify-center h-full p-8">
            <div className="text-[11px] font-mono tracking-[0.3em] text-amber-700 uppercase mb-4">S&amp;K</div>
            
            <h2 className="font-serif text-[10px] uppercase tracking-[0.15em] text-stone-500 mb-6">
              You are cordially invited to celebrate the marriage of
            </h2>

            <h1 className="text-2xl font-light tracking-wide text-stone-900 mb-2">
              Sandeepani &amp; Kawsara
            </h1>

            {/* Ornament Divider */}
            <div className="flex items-center justify-center gap-3 text-amber-500 my-4">
              <div className="w-12 h-[1px] bg-amber-200"></div>
              <span className="text-[10px]">❖</span>
              <div className="w-12 h-[1px] bg-amber-200"></div>
            </div>

            <p className="text-stone-500 text-[10px] italic mb-4">
              Specially Prepared For
            </p>

            <p className="font-serif text-lg font-semibold text-amber-800 italic border-b border-stone-200 pb-2 px-6 mb-6">
              {invitation.familyName}
            </p>

            {/* Date & Location */}
            <div className="space-y-1.5 mb-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-stone-900 font-semibold border-t border-b border-amber-200 py-1 max-w-xs mx-auto">
                Friday, August 14, 2026
              </p>
              <p className="text-stone-700 text-xs italic">
                at Ten O'Clock in the Morning
              </p>
              <p className="text-amber-800 text-xs font-serif italic">
                Araliya Palace, Grand Ballroom
              </p>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center gap-1.5 mt-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/invite/${invitation.token}`)}`} 
                alt="RSVP QR" 
                className="w-20 h-20 p-1 border border-stone-200 rounded-lg bg-white"
              />
              <span className="font-mono text-[8px] text-stone-400 uppercase tracking-widest mt-1">
                Scan to view celebration details
              </span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
